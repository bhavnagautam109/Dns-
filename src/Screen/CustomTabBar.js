import { View, Text, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, StatusBar } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

const COLORS = {
  primary: "#1D2A57",
  secondary: "#FFCB09",
  white: "#FFFFFF",
  black: "#000000",
  gray: "#6B7280",
  lightGray: "#F3F4F6",
}

export default function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <SafeAreaView  >
            <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const label = options.tabBarLabel || route.name
        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        const getIconName = () => {
          switch (route.name) {
            case "Home":
              return isFocused ? "home" : "home-outline"
            case "Applications":
              return isFocused ? "document-text" : "document-text-outline"
            case "Profile":
              return isFocused ? "person" : "person-outline"
            default:
              return "home-outline"
          }
        }

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, isFocused && styles.activeIconContainer]}>
              <Ionicons name={getIconName()} size={24} color={isFocused ? COLORS.secondary : COLORS.gray} />
            </View>
            <Text style={[styles.tabLabel, isFocused && styles.activeTabLabel]}>{label}</Text>
            {isFocused && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        )
      })}
    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingBottom: 8,
    paddingTop: 8,
    height: 60,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  iconContainer: {
    padding: 4,
    borderRadius: 20,
  },
  activeIconContainer: {
    backgroundColor: COLORS.secondary + "20",
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.gray,
    marginTop: 4,
  },
  activeTabLabel: {
    color: COLORS.secondary,
    fontWeight: "600",
  },
  activeIndicator: {
    position: "absolute",
    top: 0,
    width: 24,
    height: 2,
    backgroundColor: COLORS.secondary,
    borderRadius: 1,
  },
})
