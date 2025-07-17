
import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Image,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Toast from "react-native-toast-message"

const COLORS = {
  primary: "#1D2A57",
  secondary: "#FFCB09",
  white: "#FFFFFF",
  black: "#000000",
  gray: "#6B7280",
  lightGray: "#F3F4F6",
  border: "#E5E7EB",
}

export default function EmailVerify({ navigation }) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)


    const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };


const handleSubmit = async () => {
  if (!email ) {
    Toast.show({
      type: 'error',
      text1: 'Missing Fields',
      text2: 'Email  are required.'
    });
    return;
  }

  if (!validateEmail(email)) {
    Toast.show({
      type: 'info',
      text1: 'Invalid Email',
      text2: 'Please enter a valid email address.',
    });
    return;
  }

  setLoading(true);


    // LOGIN
    const options = {
      method: 'POST',
      url: `${process.env.EXPO_PUBLIC_API_URL}/forget_password `,
      data: { email },
    };

    try {
      const response = await axios.request(options);
      console.log(response.data)
      if (response.data.status == true) {
        Toast.show({ type: 'success', text1: response.data.message});
        setTimeout(() => {
          setLoading(false);
    navigation.navigate("OtpScreen",{email:email})
        }, 1500);
      } else {
        Toast.show({ type: 'error', text1: response.data.msg});
        setEmail('');
        setLoading(false);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error?.response?.data?.message || 'Something went wrong.',
      });
      setLoading(false);
    }
  }



  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      <KeyboardAvoidingView  >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoEmoji}>
                            <Image source={require('../../assets/icon.png')} style={{ width:'100%',height:'100%',borderRadius:100}}/>
                
              </Text>
            </View>
            <Text style={styles.title}>One Stop Solution</Text>
            <Text style={styles.subtitle}>Access all vehicle-related services in one place</Text>
          </View>

      

          <View style={styles.form}>
      
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                value={email}
                onChangeText={(text)=>setEmail(text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

        

        
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>{loading ? "Please wait..." : " Verify"}</Text>
            </TouchableOpacity>

          
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {

  height:'100%',
  width:'100%',

    backgroundColor: COLORS.white,
    justifyContent:'center'

  },

  scrollContent: {

    padding: 16,
    justifyContent: "center",
    alignSelf:'center'
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoContainer: {
    width: 95,
    height: 95,
    backgroundColor: COLORS.secondary,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoEmoji: {
 width:90,
 height:90,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    marginBottom: 24,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: COLORS.secondary,
  },
  tabText: {
    fontSize: 16,
    color: COLORS.gray,
  },
  activeTabText: {
    color: COLORS.black,
    fontWeight: "600",
  },
  form: {
    flex: 1,
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
    color:'black',
    backgroundColor: COLORS.white,
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  termsText: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: "center",
    lineHeight: 18,
  },
})
