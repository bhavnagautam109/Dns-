import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable, Alert, SafeAreaView, StatusBar, Image } from "react-native"
import Icon from "react-native-vector-icons/Feather"
import Toast from 'react-native-toast-message';
import axios from "axios";







export default function ResetPassword({ navigation ,route}) {

  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [secure,setSecure]=useState(false)
    const [secure2,setSecure2]=useState(false)
    const {otp,email}=route.params;

  
  const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

  const [loading, setLoading] = useState(false);


  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricAvailable(compatible && enrolled);
    })();
  }, []);




const handleLogin = async () => {

  if (!email || !password || !password2 || !otp) {
       Toast.show({
            type: 'error',
            text1: 'Please fill all fields',
          });
    return;
  }

  if (password !== password2) {
       Toast.show({
            type: 'error',
            text1: 'Passwords do not match',
          });
    return;
  }

  try {
    setLoading(true);

    const form = new FormData();
    form.append("email", email);
    form.append("new_password", password);
    form.append("confirmed_password", password2);

    const response = await axios.post(
   `${process.env.EXPO_PUBLIC_API_URL}/reset_password `,
      form,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const data = response.data;

    console.log(response.data)

    if (data.status) {
         Toast.show({
            type: 'success',
            text1: data.message,
          });
      navigation.navigate("LoginScreen");
    } else {
  Toast.show({
            type: 'error',
            text1: data.message,
          });    }

  } catch (err) {
    console.error("OTP Verification Error:", err?.response?.data || err.message);
      Toast.show({
            type: 'error',
            text1: err.response?.data?.message  || "Something went wrong",
          });
  } finally {
    setLoading(false);
  }
};




  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
       <Toast />
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <View style={styles.logoInnerCircle}>
                <Image source={require('../../assets/icon.png')} style={{width:'100%',height:'100%',    borderRadius: 100,
}}/>
              
              </View>
            </View>
            <View>
              <Text style={styles.logoTextTop}>ONE STOP </Text>
              <Text style={styles.logoTextBottom}>SOLUTIONS</Text>
            </View>
          </View>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Reset Password </Text>

            <View style={styles.inputContainer}>
         

              <View style={styles.inputWrapper}>
                <Icon name="lock" size={20} color="#9ca3af" style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#9ca3af" secureTextEntry={secure}  onChangeText={(text)=>setPassword(text)}  />
                <Text style={styles.forgotText} onPress={()=>setSecure(!secure)}>
                  <Icon name="eye"/>
                </Text>
              </View>

 <View style={styles.inputWrapper}>
                <Icon name="lock" size={20} color="#9ca3af" style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder=" Confirm Password" placeholderTextColor="#9ca3af" secureTextEntry={secure2}  onChangeText={(text)=>setPassword2(text)}  />
                <Text style={styles.forgotText} onPress={()=>setSecure2(!secure)}>
                  <Icon name="eye"/>
                </Text>
              </View>
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                 <Text style={styles.loginButtonText}>
    {loading ? 'Reseting in...' : 'Reset'}
  </Text>
              </TouchableOpacity>
            </View>

            {/* <Text style={styles.orText}>or</Text> */}
          </View>
        </View>

        <View style={styles.fingerprintContainer}>
           <Pressable >
           {/* <Text style={{fontWeight:'600',fontSize:14}}>Forget Password</Text> */}
          </Pressable>
          {/* <Pressable style={styles.fingerprintCircle}onPress={handleBiometricAuth}>
            <MaterialIcons name="fingerprint" size={40} color="#9ca3af" />
          </Pressable> */}
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
 
    height:'100%',
    width:'100%',
    backgroundColor: "#e6e6f2",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "white",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    backgroundColor: "#FFCB09",
    padding: 24,
    paddingBottom: 64,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoCircle: {
    borderRadius: 50,
    padding: 8,
    marginRight: 5,
    
  },
  logoInnerCircle: {
    width: 60,
    height: 60,
    borderRadius: 100,
    borderWidth:4,
    borderColor:'orange',
        alignItems: "center",
    justifyContent: "center",
  },
  logoCenter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    
    backgroundColor: "#ff9933",
  },
  logoTextTop: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    letterSpacing: 1,
  },
  logoTextBottom: {
    fontSize: 24,
    fontWeight: "bold",
        color: "black",
    letterSpacing: 1,
  },
  formContainer: {
    paddingHorizontal: 24,
    marginTop: -40,
  },
  formCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 44,
    color: "#1f2937",
  },
  forgotText: {
    fontSize: 12,
    color: "#9ca3af",
  },
  loginButton: {
    backgroundColor: "#1D2A57",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  loginButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
  orText: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 14,
    marginTop: 24,
  },
  fingerprintContainer: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 32,
  },
  fingerprintCircle: {
    width: 64,
    height: 64,
    backgroundColor: "white",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
})
