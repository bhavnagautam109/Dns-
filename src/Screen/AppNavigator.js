import { View, Text, StyleSheet, StatusBar, SafeAreaView } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import SplashScreen from "./SplashScreen";
import LoginScreen from "./LoginScreen";
import MainNavigator from "./MainNavigator";
import HelpScreen from "./HelpScreen";
import NotificationsScreen from "./NotificationsScreen";
import SecurityScreen from "./SecurityScreen";
import StatusScreen from "./StatusScreen";
import ServiceDetailScreen from "./ServiceDetailScreen";
import ApplyScreen from "./ApplyScreen";
import AllServicesScreen from "./AllServicesScreen";
import Toast from "react-native-toast-message";
import Wallet from './Wallet';
import EmailVerify from './EmailVerify';
import OtpScreen from './OtpScreen';
import ResetPassword from './ResetPassword';


  const Stack = createNativeStackNavigator();


const AppNavigator = () => {
  return (

  <NavigationContainer style={{height:'100%',width:'100%'}}>

      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Main" component={MainNavigator} />

        <Stack.Screen name="HelpScreen" component={HelpScreen} />
        <Stack.Screen
          name="NotificationsScreen"
          component={NotificationsScreen}
        />
        <Stack.Screen name="SecurityScreen" component={SecurityScreen} />
        <Stack.Screen name="StatusScreen" component={StatusScreen} />
        <Stack.Screen
          name="ServiceDetailScreen"
          component={ServiceDetailScreen}
        />
        <Stack.Screen
          name="ApplyScreen"
          component={ApplyScreen}
        />

        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationsScreen}
        />
          <Stack.Screen
          name="AllServicesScreen"
          component={AllServicesScreen}
        />
        <Stack.Screen
          name="Wallet"
          component={Wallet}
        />
           <Stack.Screen
          name="EmailVerify"
          component={EmailVerify}
        />
           <Stack.Screen
          name="OtpScreen"
          component={OtpScreen}
        />
            <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
        />
        
      </Stack.Navigator>
       <Toast /> 
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AppNavigator