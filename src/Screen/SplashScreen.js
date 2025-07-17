
import { useCallback, useEffect, useRef } from "react"
import { View, Text, StyleSheet, Animated, Dimensions, SafeAreaView, StatusBar, Image, BackHandler, Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect } from "@react-navigation/native"

const { width, height } = Dimensions.get("window")

const COLORS = {
  primary: "#1D2A57",
  secondary: "#FFCB09",
  white: "#FFFFFF",
}

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current

  useEffect(() => {
    checkFirstLaunch()
  }, [])

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem("token")

      // Start animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start()

      // Navigate after delay
      setTimeout(() => {
        if (hasLaunched) {
          navigation.navigate("Main")
        } else {
          navigation.navigate("LoginScreen")
        }

      }, 3000)
    } catch (error) {
      console.error("Error checking first launch:", error)
      navigation.navigate("LoginScreen")
    }
  }


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
      
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>
            <Image source={require('../../assets/icon.png')} style={{ width:'100%',height:'100%',borderRadius:100}}/>
            </Text>
          </View>
        </View>
        <Text style={styles.title}>One Stop Solution</Text>
        <Text style={styles.subtitle}>All services in one place</Text>
      </Animated.View>

      <View style={styles.loadingContainer}>
        <View style={styles.loadingDots}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    height:'100%',
    width:'100%',
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 96,
    height: 96,
    backgroundColor: COLORS.secondary,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.secondary,
  },
  loadingContainer: {
    position: "absolute",
    bottom: 40,
  },
  loadingDots: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
    marginHorizontal: 4,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
})
