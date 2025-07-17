

import { useState } from "react"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
  StatusBar,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"

const COLORS = {
  primary: "#1D2A57",
  secondary: "#FFCB09",
  white: "#FFFFFF",
  black: "#000000",
  gray: "#6B7280",
  lightGray: "#F3F4F6",
  border: "#E5E7EB",
  green: "#10B981",
}

export default function SecurityScreen({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [biometricEnabled, setBiometricEnabled] = useState(false)
  const [loginNotifications, setLoginNotifications] = useState(true)

const handlePasswordChange = async () => {
  if (!currentPassword || !newPassword || !confirmPassword) {
    Alert.alert("Error", "Please fill in all fields")
    return
  }

  if (newPassword !== confirmPassword) {
    Alert.alert("Error", "New passwords do not match")
    return
  }



  setLoading(true)

  try {
    const token = await AsyncStorage.getItem("token")
    if (!token) {
      setLoading(false)
      Alert.alert("Error", "Authentication token not found")
      return
    }

    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_API_URL}/changePassword`, // Use your actual API endpoint
      {
       old_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )

    console.log("Password change response:", response.data)

    Alert.alert("Success", "Password updated successfully")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  } catch (error) {
    console.error("Password update failed:", error?.response?.data || error.message)
    Alert.alert(
      "Failed",
      error?.response?.data?.message || "Unable to update password. Please try again."
    )
  } finally {
    setLoading(false)
  }
}


  return (
    <SafeAreaView style={styles.container}>
          <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
    
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Change Password</Text>
          <Text style={styles.cardSubtitle}>Update your password to keep your account secure</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Current Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your current password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showCurrentPassword}
              />
              <TouchableOpacity style={styles.eyeButton} onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                <Ionicons name={showCurrentPassword ? "eye-off" : "eye"} size={20} color={COLORS.gray} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your new password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
              />
              <TouchableOpacity style={styles.eyeButton} onPress={() => setShowNewPassword(!showNewPassword)}>
                <Ionicons name={showNewPassword ? "eye-off" : "eye"} size={20} color={COLORS.gray} />
              </TouchableOpacity>
            </View>
            <Text style={styles.passwordHint}>
              Password must be at least 8 characters and include a mix of letters, numbers, and symbols.
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm New Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity style={styles.eyeButton} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={20} color={COLORS.gray} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.updateButton, loading && styles.disabledButton]}
            onPress={handlePasswordChange}
            disabled={loading}
          >
            <Text style={styles.updateButtonText}>{loading ? "Updating..." : "Update Password"}</Text>
          </TouchableOpacity>
        </View>

        {/* <View style={styles.card}>
          <Text style={styles.cardTitle}>Two-Factor Authentication</Text>
          <Text style={styles.cardSubtitle}>Add an extra layer of security to your account</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Enable 2FA</Text>
              <Text style={styles.settingDescription}>Secure your account with two-factor authentication</Text>
            </View>
            <Switch
              value={twoFactorEnabled}
              onValueChange={setTwoFactorEnabled}
              trackColor={{ false: COLORS.lightGray, true: COLORS.secondary }}
              thumbColor={twoFactorEnabled ? COLORS.white : COLORS.gray}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Biometric Login</Text>
              <Text style={styles.settingDescription}>Use fingerprint or face recognition to login</Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: COLORS.lightGray, true: COLORS.secondary }}
              thumbColor={biometricEnabled ? COLORS.white : COLORS.gray}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Login Notifications</Text>
              <Text style={styles.settingDescription}>Get notified when someone logs into your account</Text>
            </View>
            <Switch
              value={loginNotifications}
              onValueChange={setLoginNotifications}
              trackColor={{ false: COLORS.lightGray, true: COLORS.secondary }}
              thumbColor={loginNotifications ? COLORS.white : COLORS.gray}
            />
          </View>
        </View> */}
      </ScrollView>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 16,
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color:'black'
  },
  eyeButton: {
    padding: 12,
  },
  passwordHint: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  updateButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  updateButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  settingContent: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: COLORS.gray,
  },
})
