import React, { useEffect, useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, Modal, KeyboardAvoidingView, Platform, StatusBar } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as DocumentPicker from "expo-document-picker"
import DateTimePicker from '@react-native-community/datetimepicker'
import axios from 'axios'
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"
import Checkbox from 'expo-checkbox';
import RazorpayCheckout from "react-native-razorpay"


const COLORS = {
  primary: "#1D2A57",
  secondary: "#FFCB09",
  white: "#FFFFFF",
  black: "#000000",
  gray: "#6B7280",
  lightGray: "#F3F4F6",
  border: "#E5E7EB",
  green: "#10B981",
  blue: "#3B82F6",
}

// API Configuration
const API_BASE_URL = 'https://dnsconcierge.awd.world/api'
const API_ENDPOINTS = {
  SUBMIT_APPLICATION: '/applications/submit'
}

// File size limit (500KB in bytes)
const MAX_FILE_SIZE = 500 * 1024 // 500KB

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", 
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", 
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", 
  "Ladakh", "Puducherry", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
  "Lakshadweep", "Andaman and Nicobar Islands"
]

const GENDER_OPTIONS = ["Male", "Female", "Other"]

export default function ApplyScreen({ route }) {
  const navigation = useNavigation()
  const { service } = route.params
  console.log(service, "service")
  
  const [loading, setLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const[balance,setBalance]=useState("")
  
  // Modal states
  const [showStateModal, setShowStateModal] = useState(false)
  const [showGenderModal, setShowGenderModal] = useState(false)
    const [selected, setSelected] = useState('partial');
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [isChecked, setChecked] = useState(false);


  // Form data
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    email: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
    dob: new Date(),
    gender: "",
    service_id: service?.id || '',
    fees: service?.fees || '',
    country: "india",
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false)
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, dob: selectedDate }))
    }
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB'
    return Math.round(bytes / (1024 * 1024)) + ' MB'
  }

  // Helper function to validate file size
  const validateFileSize = (file) => {
    if (file.size && file.size > MAX_FILE_SIZE) {
      return false
    }
    return true
  }

  const handleFileUpload = async (documentType) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      })

      console.log('Document picker result:', result)

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0]
        
        // Validate file size
        if (!validateFileSize(file)) {
          Alert.alert(
            "File Too Large", 
            `The selected file (${formatFileSize(file.size)}) exceeds the maximum allowed size of 500KB. Please select a smaller file or compress the current file.`,
            [{ text: "OK" }]
          )
          return
        }
        
        setUploadedFiles((prev) => [
          ...prev.filter(f => f.type !== documentType), // Remove existing file of same type
          {
            type: documentType,
            file: file,
            uploaded: true
          }
        ])
        
        Alert.alert(
          "Success", 
          `Document selected successfully!\nFile size: ${formatFileSize(file.size)}`,
          [{ text: "OK" }]
        )
      } else {
        console.log('Document selection was canceled or failed')
      }
    } catch (error) {
      console.error('Error console', error.response.data)
      // Alert.alert("Error", "Failed to select document")
    }
  }

  console.log(service?.doc_require,"service?.doc_require?")
  // Fixed validateForm function
const validateForm = () => {
  // Validate personal information
  const requiredFields = ['first_name', 'last_name', 'mobile', 'email', 'address', 'state', 'city', 'pincode', 'gender']
  
  for (let field of requiredFields) {
    if (!formData[field] || formData[field].toString().trim() === '') {
      Alert.alert("Error", `Please fill in ${field.replace('_', ' ')}`)
      return false
    }
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.email)) {
    Alert.alert("Error", "Please enter a valid email address")
    return false
  }
  
  // Validate mobile number (10 digits)
  const mobileRegex = /^\d{10}$/
  if (!mobileRegex.test(formData.mobile)) {
    Alert.alert("Error", "Please enter a valid 10-digit mobile number")
    return false
  }
  
  // Validate pincode (6 digits)
  const pincodeRegex = /^\d{6}$/
  if (!pincodeRegex.test(formData.pincode)) {
    Alert.alert("Error", "Please enter a valid 6-digit pincode")
    return false
  }

  // Validate documents only if doc_require exists and is not empty
  if (service?.doc_require && service.doc_require.trim() !== '') {
    const requiredDocs = service.doc_require.split(',').map(doc => doc.trim())
    const uploadedDocTypes = uploadedFiles.map(file => file.type)
    
    for (let doc of requiredDocs) {
      if (!uploadedDocTypes.includes(doc)) {
        Alert.alert("Error", `Please upload ${doc}`)
        return false
      }
    }
    
    // Additional validation to ensure all uploaded files are within size limit
    for (let fileItem of uploadedFiles) {
      if (!validateFileSize(fileItem.file)) {
        Alert.alert("Error", `File "${fileItem.file.name}" exceeds the 500KB size limit. Please replace it with a smaller file.`)
        return false
      }
    }
  }
  
  return true
}

useEffect(() => {
  const fetchApplications = async () => {
    try {

      const token = await AsyncStorage.getItem("token") // Replace with your actual key
      if (!token) {
        throw new Error("No token found")
      }
      console.log(token,"---->token")

      const response = await axios.get("https://dnsconcierge.awd.world/api/wallet_balance", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = response.data
      console.log("wallet balance api",data)
     
      setBalance(data)


    } catch (err) {
      console.error("Error fetching applications:", err)
      setError("Failed to load applications")
    }
  }

  fetchApplications()
}, [])
// Fixed handleSubmit function (key parts)
const handleSubmit = async () => {
  if (!validateForm()) return;

  setLoading(true);

  try {
    const userToken = await AsyncStorage.getItem("token");

    if (!userToken) {
      Alert.alert("Error", "Please log in to submit application");
      setLoading(false);
      return;
    }

    if (!service?.id) {
      Alert.alert("Error", "Service information missing");
      setLoading(false);
      return;
    }

    const totalAmount = parseFloat(formData.fees);
    const isPartialPayment = selected === "Partial";
    const razorAmount = isPartialPayment ? totalAmount / 2 : totalAmount;

    const options = {
      description: 'Order Purchase',
      image: 'https://dnsconcierge.awd.world/web/logo/logo.png',
      currency: 'INR',
      key: 'rzp_test_ErtLVEWcwYUyfw',
      amount: razorAmount * 100, // in paise
      name: 'DNS CONCIERGE',
      prefill: {
        email: formData.email || '',
        contact: formData.mobile,
        name: `${formData.first_name || ''} ${formData.last_name || ''}`.trim(),
      },
      theme: { color: '#495477' },
    };

    console.log("Razorpay options:", options);

    // Launch Razorpay payment
    const paymentData = await RazorpayCheckout.open(options);
    console.log("Payment Success:", paymentData);

    // Now prepare and send form data after successful payment
    const submitFormData = new FormData();

    submitFormData.append("first_name", formData.first_name);
    submitFormData.append("last_name", formData.last_name);
    submitFormData.append("mobile", formData.mobile);
    submitFormData.append("email", formData.email);
    submitFormData.append("payment_type", selected);
    submitFormData.append("wallet_amount", isChecked ? balance?.data?.balance : 0);

    if (service.dob_status == 1) {
      submitFormData.append("dob", formData.dob.toISOString().split("T")[0]);
    }

    submitFormData.append("gender", formData.gender);
    submitFormData.append("address", formData.address);
    submitFormData.append("city", formData.city);
    submitFormData.append("state", formData.state);
    submitFormData.append("pincode", formData.pincode);
    submitFormData.append("country", formData.country);
    submitFormData.append("service_id", formData.service_id.toString());
    submitFormData.append("fees", formData.fees.toString());

    if (service?.doc_require && service.doc_require.trim() !== '') {
      const docRequireArray = service.doc_require.split(",").map(item => item.trim());
      docRequireArray.forEach((doc, index) => {
        submitFormData.append(`doc_require[${index}]`, doc);
      });
    }

    uploadedFiles.forEach((fileItem, index) => {
      const fileObject = {
        uri: fileItem.file.uri,
        type: fileItem.file.mimeType || 'application/octet-stream',
        name: fileItem.file.name || `document_${index}.pdf`,
      };
      submitFormData.append(`docname[${index}]`, fileObject);
    });

    const response = await axios.post(
      `${API_BASE_URL}/serviceApply`,
      submitFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userToken}`,
        },
        timeout: 60000,
      }
    );

    console.log('API Response:', response.data);

    if (response.data.status == 1) {
      navigation.navigate("StatusScreen", {
        application: service,
      });
    } else {
      Alert.alert("Error", response.data.message || "Failed to submit application");
    }

  } catch (error) {
    console.error('Error:', error);
    Alert.alert("Error", "Payment or form submission failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const handleBack = () => {
    navigation.goBack()
  }



  const renderDropdownModal = (title, options, selectedValue, onSelect, showModal, setShowModal) => (
    <Modal
      visible={showModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowModal(false)}
    >
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{title}</Text>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <Ionicons name="close" size={24} color={COLORS.gray} />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalList}>
                {options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.modalOption,
                      selectedValue === option && styles.selectedOption
                    ]}
                    onPress={() => {
                      onSelect(option)
                      setShowModal(false)
                    }}
                  >
                    <Text style={[
                      styles.modalOptionText,
                      selectedValue === option && styles.selectedOptionText
                    ]}>
                      {option}
                    </Text>
                    {selectedValue === option && (
                      <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  )

  return (
    <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Application Form</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Personal Information Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your first name"
              value={formData.first_name}
              onChangeText={(value) => handleInputChange("first_name", value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your last name"
              value={formData.last_name}
              onChangeText={(value) => handleInputChange("last_name", value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your mobile number"
              value={formData.mobile}
              onChangeText={(value) => handleInputChange("mobile", value)}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

{
 service.dob_status==1 &&
   <View style={styles.inputContainer}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {formatDate(formData.dob)}
              </Text>
              <Ionicons name="calendar" size={20} color={COLORS.gray} />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formData.dob}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>

}
         

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Gender</Text>
            <TouchableOpacity
              style={styles.dropdownInput}
              onPress={() => setShowGenderModal(true)}
            >
              <Text style={[styles.dropdownText, !formData.gender && styles.placeholderText]}>
                {formData.gender || "Select gender"}
              </Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>State</Text>
            <TouchableOpacity
              style={styles.dropdownInput}
              onPress={() => setShowStateModal(true)}
            >
              <Text style={[styles.dropdownText, !formData.state && styles.placeholderText]}>
                {formData.state || "Select state"}
              </Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your city"
              value={formData.city}
              onChangeText={(value) => handleInputChange("city", value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Pincode</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter pincode"
              value={formData.pincode}
              onChangeText={(value) => handleInputChange("pincode", value)}
              keyboardType="numeric"
              maxLength={6}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter your full address"
              value={formData.address}
              onChangeText={(value) => handleInputChange("address", value)}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Document Upload Section */}
        {service?.doc_require!=null &&
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Document Upload</Text>

          <View style={styles.alertContainer}>
            <Ionicons name="information-circle" size={20} color={COLORS.blue} />
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Important</Text>
              <Text style={styles.alertText}>
                Please upload clear, legible scanned copies or photos of all required documents. Maximum file size: 500KB per document.
              </Text>
            </View>
          </View>

          <View style={styles.documentsCard}>
            <Text style={styles.cardTitle}>Required Documents</Text>
            <Text style={styles.cardSubtitle}>Upload the following documents (Max: 500KB each)</Text>

            {service?.doc_require?.split(',').map((doc, index) => (
              <View key={index} style={styles.documentItem}>
                <View style={styles.documentHeader}>
                  <Ionicons name="document-text" size={16} color={COLORS.primary} />
                  <Text style={styles.documentTitle}>{doc.trim()}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.uploadButton} 
                  onPress={() => handleFileUpload(doc.trim())}
                >
                  <Ionicons name="cloud-upload" size={16} color={COLORS.primary} />
                  <Text style={styles.uploadButtonText}>
                    {uploadedFiles.some((file) => file.type === doc.trim()) ? "File selected" : "Select file"}
                  </Text>
                  {uploadedFiles.some((file) => file.type === doc.trim()) && (
                    <Ionicons name="checkmark" size={16} color={COLORS.green} />
                  )}
                </TouchableOpacity>
                {uploadedFiles.some((file) => file.type === doc.trim()) && (
                  <View style={styles.fileInfo}>
                    {/* <Text style={styles.fileName}>
                      {uploadedFiles.find((file) => file.type === doc.trim())?.file.name}
                    </Text> */}
                    {/* <Text style={styles.fileSize}>
                      Size: {formatFileSize(uploadedFiles.find((file) => file.type === doc.trim())?.file.size || 0)}
                    </Text> */}
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
}

        {/* Modals */}
        {renderDropdownModal(
          "Select State",
          INDIAN_STATES,
          formData.state,
          (value) => handleInputChange("state", value),
          showStateModal,
          setShowStateModal
        )}

        {renderDropdownModal(
          "Select Gender",
          GENDER_OPTIONS,
          formData.gender,
          (value) => handleInputChange("gender", value),
          showGenderModal,
          setShowGenderModal
        )}

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
                        <Text style={[styles.label,{marginTop:"2%"}]}>Payment Amount</Text>
           <View style={styles.radioContainer}>

      {['partial', 'full'].map((option) => (
        <TouchableOpacity
          key={option}
          style={styles.radioOption}
          onPress={() => setSelected(option)}
        >
          <View style={[
            styles.radioCircle,
            {
              borderColor: selected === option ? '#FFCB09' : '#1F2C55',
            },
          ]}>
            {selected === option && <View style={styles.radioInner} />}
          </View>
          <Text style={[
            styles.radioLabel,
            { color: selected === option ? '#FFCB09' : 'grey' }
          ]}>
            {option === 'partial' ? 'Partial Payment' : 'Full Payment'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
    {
      balance?.data?.balance!=0  &&
      <>
                                <Text style={[styles.label,{marginTop:16}]}>Add Wallet </Text>
  <View style={{flexDirection:'row',gap:5,marginTop:"2%"}}>
      <Checkbox
        value={isChecked}
        onValueChange={setChecked}
      color={isChecked ? '#1F2C55' : "#999"}
      />
      <Text >Wallet ₹{balance?.data?.balance}</Text>
    </View>
      </>

    }
  


        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? "Processing..." : "Submit Application"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    fontSize: 16,
    color: COLORS.primary,
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.secondary,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.black,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: COLORS.white,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  dropdownInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  dropdownText: {
    fontSize: 16,
    color: COLORS.black,
  },
  placeholderText: {
    color: COLORS.gray,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  dateText: {
    fontSize: 16,
    color: COLORS.black,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
  },
  modalList: {
    maxHeight: 400,
  },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  selectedOption: {
    backgroundColor: COLORS.lightGray,
  },
  modalOptionText: {
    fontSize: 16,
    color: COLORS.black,
  },
  selectedOptionText: {
    color: COLORS.primary,
    fontWeight: "500",
  },
  alertContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.blue + "20",
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  alertContent: {
    flex: 1,
    marginLeft: 8,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.blue,
    marginBottom: 2,
  },
  alertText: {
    fontSize: 14,
    color: COLORS.blue,
  },
  documentsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 10,
  },
  documentItem: {
    marginBottom: 10,
  },
  documentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  documentTitle: {
    fontSize: 14,
    color: COLORS.black,
    marginLeft: 4,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.lightGray,
  },
  uploadButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    marginLeft: 8,
    marginRight: 8,
  },
  fileInfo: {
    marginTop: 4,
  },
  fileName: {
    fontSize: 12,
    color: COLORS.gray,
    fontStyle: 'italic',
  },
  fileSize: {
    fontSize: 11,
    color: COLORS.blue,
    marginTop: 2,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
   radioContainer: {
    flexDirection: 'row',
    gap:15,
   
    marginTop: 2,
    marginBottom: 6,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    height: 16,
    width: 16,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#FFCB09',
  },
  radioLabel: {
  
  },
})