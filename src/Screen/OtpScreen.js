import axios from 'axios';
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';

const COLORS = {
  primary: "#1D2A57",
  secondary: "#FFCB09",
  white: "#FFFFFF",
  black: "#000000",
  gray: "#6B7280",
  lightGray: "#F3F4F6",
  border: "#E5E7EB",
}


export default function OtpScreen({ navigation, route }) {
  const {email}=route.params
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const[loading,setLoading]=useState(false)
  const inputs = useRef([]);




// Inside component
const handleSubmit = async () => {
  const enteredOtp = otp.join('');

  if (enteredOtp.length !== 6) {
    Toast.show({
      type: 'error',
      text1: 'Incomplete OTP',
      text2: 'Please enter all 6 digits',
    });
    return;
  }

  setLoading(true)
  try {
    const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/verify_otp `, {
      email: route?.params?.email,
      otp: enteredOtp,
    });

    console.log(response.data)
    if (response.data?.status == true) {
      Toast.show({
        type: 'success',
        text1: 'OTP Verified',
        text2: 'You may now reset your password',
      });
        setLoading(false)


      setTimeout(() => {
        navigation.navigate('ResetPassword', {
          otp: enteredOtp,
          email: route?.params?.email,
        });

        
      }, 1000);
    } else {
              setLoading(false)

      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: response.data?.message || 'Invalid OTP or expired code',
      });
    }
  } catch (error) {
            setLoading(false)

    console.error('OTP verification error:', error);

    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: error?.response?.data?.message || 'Server error, try again.',
    });
  }
};


  const handleChange = (text, index) => {
    if (isNaN(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move focus to next input
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };



  return (
    <SafeAreaView style={styles.container}>

        <Toast />
      <StatusBar />
      <View style={styles.card}>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>A 6-digit code has been sent to your email.</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
              ref={(el) => (inputs.current[index] = el)}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              value={digit}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={()=> handleSubmit()
}>
       {loading?
       <ActivityIndicator color="white"/>
       :   <Text style={styles.submitButtonText}>Verify OTP</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {

  
    height:'100%',
    width:'100%',
    backgroundColor: '#e6e6f2',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
    color: '#111',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    backgroundColor: '#f9f9f9',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  cancelText: {
    color: '#666',
    marginTop: 16,
    textDecorationLine: 'underline',
  },
});

