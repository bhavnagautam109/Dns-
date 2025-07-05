import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import HomeScreen from "./HomeScreen"
import ApplicationsScreen from "./ApplicationsScreen"
import ProfileScreen from "./ProfileScreen"
import CustomTabBar from "./CustomTabBar"
import { SafeAreaView, View } from "react-native"

const Tab = createBottomTabNavigator()

export default function MainNavigator() {
  return (

<SafeAreaView style={{flex:1}} >
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
    
         screenOptions={{
            headerShown: false,
      
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="Applications"
        component={ApplicationsScreen}
        options={{
          tabBarLabel: "Applications",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  
</SafeAreaView>
  

  )
}
