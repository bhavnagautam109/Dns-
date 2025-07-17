import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, TextInput, Alert, StatusBar, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as ImagePicker from 'expo-image-picker'
import axios from "axios"
import Toast from 'react-native-toast-message' // Add this import

const COLORS = {
  primary: "#1D2A57",
  secondary: "#FFCB09",
  white: "#FFFFFF",
  black: "#000000",
  gray: "#6B7280",
  lightGray: "#F3F4F6",
  border: "#E5E7EB",
  red: "#EF4444",
}

export default function ProfileScreen({ navigation }) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [mobile, setMobile] = useState("")
  const [address, setAddress] = useState("")
  const [lname, setLName] = useState("")
  const [profileImage, setProfileImage] = useState(null) // Add state for profile image

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token")
        if (!token) {
          console.warn("No token found in storage")
          return
        }

        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/viewprofile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = response.data.data.viewProfile[0]
        console.log("Profile Data:", data)

        setName(data.fname || "-")
                setProfileImage(data.avatar || "-")

        setLName(data.lname || "-")
        setMobile(data.mobile || "-")
        setAddress(data.address || "-")
        // If you have profile image URL from API, set it here
        // setProfileImage(data.profileImage || null)

      } catch (error) {
        console.error("Failed to fetch profile:", error?.response?.data || error.message)
      }
    }

    fetchProfile()
  }, [])

  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      console.log('Permission status:', status)
      
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera roll permissions are needed to select images.')
        return
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Use MediaTypeOptions.Images
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio for profile picture
        quality: 0.8, // Reduce quality to optimize upload
      })

      console.log('Image picker result:', result)

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri
        console.log('Selected image URI:', imageUri)
        
        // Set the image immediately for UI feedback
        setProfileImage(imageUri)
        
        // Upload the image
        await uploadImage(imageUri)
      }
    } catch (error) {
      console.error('Error picking image:', error)
      Alert.alert('Error', 'Failed to pick image. Please try again.')
    }
  }

  const uploadImage = async (uri) => {
    try {
      const token = await AsyncStorage.getItem("token")
      if (!token) {
        Alert.alert("Error", "Authentication token not found")
        return
      }

      // Replace with your actual upload endpoint
      const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/updatePhoto`

      const filename = uri.split('/').pop()
      const match = /\.(\w+)$/.exec(filename || '')
      const type = match ? `image/${match[1]}` : 'image/jpeg'

      const formData = new FormData()
      formData.append('photo', {
        uri: uri,
        name: filename || 'profile.jpg',
        type: type,
      } ) // TypeScript workaround

      console.log('Uploading image...')

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      })

      const responseText = await response.text()
      console.log('Upload response:', responseText)

      if (response.ok) {
        try {
          const jsonResponse = JSON.parse(responseText)
          console.log('Upload success:', jsonResponse)
          
          Toast.show({
            type: 'success',
            text1: 'Profile image updated successfully',
            text2: 'Your profile picture has been updated'
          })
        } catch (parseError) {
          console.log('Response is not JSON, but upload seems successful')
          Toast.show({
            type: 'success',
            text1: 'Profile image updated',
            text2: 'Your profile picture has been updated'
          })
        }
      } else {
        throw new Error(`Upload failed with status: ${response.status}`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      Alert.alert('Upload Failed', 'There was an error uploading the image. Please try again.')
      
      Toast.show({
        type: 'error',
        text1: 'Upload Failed',
        text2: 'Failed to update profile image'
      })
    }
  }

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("token")
      if (!token) {
        Alert.alert("Error", "Authentication token not found")
        Toast.show({
          type: 'error',
          text1: "Authentication token not found",
          text2: "",
        })
        return
      }

      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/updateProfile`,
        {
          fname: name,
          lname: lname,
          mobile,
          address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      console.log(response.data, "Update")
      setIsEditing(false)

      Toast.show({
        type: 'success',
        text1: 'Profile updated successfully',
        text2: "Profile updated successfully"
      })

    } catch (error) {
      console.error('Update error:', error)
      Toast.show({
        type: 'error',
        text1: 'Failed to Update',
        text2: "Failed to Update"
      })
    }
  }

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Logout", 
        style: "destructive", 
        onPress: async () => {
          await AsyncStorage.removeItem("token")
          navigation.navigate("LoginScreen")
        } 
      },
    ])
  }

  const menuItems = [
    {
      id: "security",
      title: "Security",
      subtitle: "Password, Change Password",
      icon: "shield-checkmark",
      onPress: () => navigation.navigate("SecurityScreen"),
    },
    {
      id: "help",
      title: "Help & Support",
      subtitle: "FAQs, contact us",
      icon: "help-circle",
      onPress: () => navigation.navigate("HelpScreen"),
    },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              ) : (
                <Image source={require('../../assets/user.png')} style={styles.avatarImage} />
              )}
            </View>
            <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
              <Ionicons name="camera" size={16} color={COLORS.gray} />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{name} {lname}</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Personal Information</Text>
            <TouchableOpacity onPress={isEditing ? handleSave : () => setIsEditing(true)}>
              <Text style={styles.editButton}>{isEditing ? "Save" : "Edit"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoContent}>
            {isEditing ? (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>First name</Text>
                  <TextInput style={styles.input} value={name} onChangeText={setName} />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Last name</Text>
                  <TextInput style={styles.input} value={lname} onChangeText={setLName} />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Mobile Number</Text>
                  <TextInput style={styles.input} value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Address</Text>
                  <TextInput style={styles.input} value={address} onChangeText={setAddress} multiline />
                </View>
              </>
            ) : (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>First Name</Text>
                  <Text style={styles.infoValue}>{name}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Last Name</Text>
                  <Text style={styles.infoValue}>{lname}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Mobile</Text>
                  <Text style={styles.infoValue}>{mobile}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Address</Text>
                  <Text style={styles.infoValue}>{address}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon} size={20} color={COLORS.primary} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.red} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: COLORS.white,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
    overflow: 'hidden', // Important for circular images
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: COLORS.gray,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
  },
  editButton: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  infoContent: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.gray,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: "500",
    flex: 2,
    textAlign: "right",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
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
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: COLORS.red,
    borderRadius: 12,
    marginBottom: 32,
  },
  logoutText: {
    fontSize: 16,
    color: COLORS.red,
    fontWeight: "600",
    marginLeft: 8,
  },
})