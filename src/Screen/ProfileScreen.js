
import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, TextInput, Alert, StatusBar } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"

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
  const[lname,setLName]=useState("")


useEffect(() => {
  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token") // Await needed
      if (!token) {
        console.warn("No token found in storage")
        return
      }

      const response = await axios.get("https://dnsconcierge.awd.world/api/viewprofile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = response.data.data.viewProfile[0]
      console.log("Profile Data:", data)

      // Set your state here based on API response structure
      setName(data.fname||"-")
      setLName(data.lname|| "-")
      setMobile(data.mobile|| "-")
      setAddress(data.address|| "-")

    } catch (error) {
      console.error("Failed to fetch profile:", error?.response?.data || error.message)
    }
  }

  fetchProfile()
}, [])


const handleSave = async () => {
  try {
    const token = await AsyncStorage.getItem("token")
    if (!token) {
      Alert.alert("Error", "Authentication token not found")
         Toast.show({
            type: 'error',
            text1: "Authentication token not found",
            text2:"",
          });
      return
    }

    const response = await axios.post(
      "https://dnsconcierge.awd.world/api/updateProfile",
      {
        fname:name,
     lname:lname,
 
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
console.log(response.data,"Updata")
   setIsEditing(false)
   
       Toast.show({
      type: 'success',
      text1: 'Profile updated successfully',
      text2: "Profile updated successfully"
    });
 

  } catch (error) {
        Toast.show({
      type: 'success',
      text1: 'Failed to Update',
      text2: "Failed to Update"
    });
  }
}

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: async() => {
        await AsyncStorage.removeItem("token")
        navigation.navigate("LoginScreen")} },
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
    // {
    //   id: "notifications",
    //   title: "Notifications",
    //   subtitle: "Preferences, alerts",
    //   icon: "notifications",
    //   onPress: () => navigation.navigate("NotificationScreen"),
    // },
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
              <Text style={styles.avatarText}>JD</Text>
            </View>
            {/* <TouchableOpacity style={styles.cameraButton}>
              <Ionicons name="camera" size={16} color={COLORS.gray} />
            </TouchableOpacity> */}
          </View>
          <Text style={styles.profileName}>{name}</Text>
          {/* <Text style={styles.profileEmail}>{email}</Text> */}
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
                {/* <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>L</Text>
                  <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
                </View> */}
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
                  <Text style={styles.infoLabel}>Full Name</Text>
                  <Text style={styles.infoValue}>{name}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>lname</Text>
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
    height:'100%',
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
