
import { useCallback, useState } from "react"
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
  BackHandler,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Toast from "react-native-toast-message"
import { useFocusEffect } from "@react-navigation/native"

const COLORS = {
  primary: "#1D2A57",
  secondary: "#FFCB09",
  white: "#FFFFFF",
  black: "#000000",
  gray: "#6B7280",
  lightGray: "#F3F4F6",
  border: "#E5E7EB",
}

export default function LoginScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [mobile, setMobile] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)


    const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

console.log(process.env.EXPO_PUBLIC_API_URL)
const handleSubmit = async () => {
  if (!email || !password || (!isLogin && (!name || !mobile))) {
    Toast.show({
      type: 'error',
      text1: 'Missing Fields',
      text2: isLogin
        ? 'Email and password are required.'
        : 'All fields are required for sign up.',
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

  if (isLogin) {
    // LOGIN
    const options = {
      method: 'POST',
      url: `${process.env.EXPO_PUBLIC_API_URL}/loginUser`,
      data: { email, password },
    };

    try {
      const response = await axios.request(options);
      if (response.data.status === 1) {

        await AsyncStorage.setItem('token', response.data.data.token.token);
                await AsyncStorage.setItem('userId', response.data.data.userDetail.userid.toString());

        Toast.show({ type: 'success', text1: response.data.msg});
        setTimeout(() => {
          setLoading(false);
          navigation.navigate('Main');
        }, 1500);
      } else {
        Toast.show({ type: 'error', text1: response.data.title, text2: 'Please try again.' });
        setEmail('');
        setPassword('');
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
  } else {
    // SIGN UP
    const options = {
      method: 'POST',
      url: `${process.env.EXPO_PUBLIC_API_URL}/registerUser`, // <-- adjust if needed
      data: {
       fname: name,
        email,
        password,
        mobile,
      },
    };

    try {
      const response = await axios.request(options);
      console.log(response.data,"---->hhhh")
      if (response.data.status === 1) {
        Toast.show({
          type: 'success',
          text1: response?.data?.msg,
        });
        // Reset signup form and switch to login
        setIsLogin(true);
        setName('');
        setMobile('');
        setEmail('');
        setPassword('');
      } else {
        const msg = response?.data?.msg;
const firstKey = msg && Object.keys(msg)[0];
const firstMessage = firstKey && Array.isArray(msg[firstKey]) ? msg[firstKey][0] : null;

        Toast.show({
          type: 'error',
          text1: firstMessage|| 'Something went wrong.',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text2: error?.response?.data?.msg || 'Could not register account.',
      });
    } finally {
      setLoading(false);
    }
  }
};

  useFocusEffect(
  useCallback(() => {
   const onBackPress = () => {
  Alert.alert("Exit App", "Do you want to exit?", [
    { text: "Cancel", style: "cancel" },
    { text: "Yes", onPress: () => BackHandler.exitApp() }
  ]);
  return true;
};


const backHandler = BackHandler.addEventListener(
  'hardwareBackPress',
  onBackPress
);

return () => backHandler.remove(); // ✅ Correct cleanup
  }, [])
);


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

          <View style={styles.tabContainer}>
            <TouchableOpacity style={[styles.tab, isLogin && styles.activeTab]} onPress={() => setIsLogin(true)}>
              <Text style={[styles.tabText, isLogin && styles.activeTabText]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, !isLogin && styles.activeTab]} onPress={() => setIsLogin(false)}>
              <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            {!isLogin && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput style={styles.input} placeholder="John Doe" value={name} onChangeText={setName} />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Mobile Number</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="+91 9876543210"
                    value={mobile}
                    onChangeText={setMobile}
                    keyboardType="phone-pad"
                  />
                </View>
              </>
            )}

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

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={(text)=>setPassword(text)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color={COLORS.gray} />
                </TouchableOpacity>
              </View>
            </View>

            {isLogin && (
              <TouchableOpacity style={styles.forgotPassword} onPress={()=>navigation.navigate("EmailVerify")}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>{loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}</Text>
            </TouchableOpacity>

            {!isLogin && (
              <Text style={styles.termsText}>By signing up, you agree to our Terms of Service and Privacy Policy</Text>
            )}
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
