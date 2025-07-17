import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import Toast from "react-native-toast-message";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Dimensions,
  Image,
  StatusBar,
  Linking,
  BackHandler,
  Alert,
} from "react-native";
import { FontAwesome5, Ionicons, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const COLORS = {
  primary: "#1D2A57",
  secondary: "#FFCB09",
  white: "#FFFFFF",
  black: "#000000",
  gray: "#6B7280",
  lightGray: "#F3F4F6",
  border: "#E5E7EB",
};

const services = [
  {
    id: "driving-license",
    title: "Driving License",
    description: "Apply for new license or renew existing one",
    icon: "🚗",
  },
  {
    id: "number-plate",
    title: "Number Plate",
    description: "Apply for new vehicle registration number",
    icon: "🔢",
  },
  {
    id: "vehicle-registration",
    title: "Vehicle Registration",
    description: "Register your new vehicle",
    icon: "📋",
  },
  {
    id: "fitness-certificate",
    title: "Fitness Certificate",
    description: "Get vehicle fitness certificate",
    icon: "✅",
  },
  {
    id: "permit",
    title: "Vehicle Permit",
    description: "Apply for commercial vehicle permit",
    icon: "📄",
  },
];

function Slider({ data, loading }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const slidet = [{}, {}, {}];

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % data?.length;
      setCurrentIndex(nextIndex);
      flatListRef?.current?.scrollToIndex({
        index: nextIndex || 0,
        animated: true,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, data?.length]);

  const renderSlide = ({ item }) =>
    loading ? (
      <View style={styles.slideloading}>
        <View style={styles.slideImageContainer}>
          <Text style={styles.slideEmoji}></Text>
        </View>
        <View style={styles.slideOverlayloading}>
          <Text style={styles.slideTitle}></Text>
        </View>
      </View>
    ) : (
      <View style={styles.slide}>
        <View style={{ width: "100%" }}>
          <Image
            source={{ uri: item?.image }}
            style={{ height: "100%", width: "100%" }}
          />
        </View>
        <View style={styles.slideOverlay}>
          <Text style={styles.slideTitle}>Apply for new nomber plate </Text>
        </View>
      </View>
    );

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert("Exit App", "Do you want to exit?", [
          { text: "Cancel", style: "cancel" },
          { text: "Yes", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => backHandler.remove(); // ✅ Correct cleanup
    }, [])
  );

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

      <View style={styles.sliderContainer}>
        <FlatList
          ref={flatListRef}
          data={loading ? slidet : data}
          renderItem={renderSlide}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
        />
        <View style={styles.pagination}>
          {loading
            ? slidet?.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === currentIndex && styles.activePaginationDot,
                  ]}
                />
              ))
            : data?.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === currentIndex && styles.activePaginationDot,
                  ]}
                />
              ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

function ServiceCard({ service, onPress, loading }) {
  return loading ? (
    <TouchableOpacity
      style={styles.serviceCardloading}
      onPress={() => onPress(service)}
    >
      <View style={styles.serviceIconContainerloading}>
        <Text style={styles.serviceIcon}></Text>
      </View>
      <View style={styles.serviceContentloading}>
        <Text style={styles.serviceTitle}></Text>
        <Text style={styles.serviceDescription}></Text>
      </View>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() => onPress(service)}
    >
      <View style={styles.serviceIconContainer}>
        {/* <Text style={styles.serviceIcon}>{service.icon}</Text> */}
        <Image source={{ uri: service.image }} style={styles.serviceIcon} />
      </View>
      <View style={styles.serviceContent}>
        <Text style={styles.serviceTitle}>{service.name}</Text>
        <Text style={styles.serviceDescription}>{service.description} </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }) {
  const [searchText, setSearchText] = useState("");
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState("");
  const handleWhatsApp = () => {
    const phoneNumber = "7053750750";
    const message = "Hi, I need help with your service!";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    Linking.openURL(url).catch(() =>
      alert("Could not open WhatsApp. Is it installed?")
    );
  };

  const handleCall = () => {
    Linking.openURL("tel:+7053750750");
  };

  const filteredServices = homeData?.service?.filter((service) =>
    service.name.toLowerCase().includes(searchText.toLowerCase())
  );

  console.log(process.env.EXPO_PUBLIC_API_URL);
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = await AsyncStorage.getItem("token"); // Replace with your actual key
        if (!token) {
          throw new Error("No token found");
        }
        console.log(token, "---->token");

        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/wallet_balance`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;
        console.log("wallet balance api", data);

        setBalance(data);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to load applications");
      }
    };

    fetchApplications();
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/home`
        ); // replace with your base URL if needed
        setHomeData(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleServicePress = (service) => {
    navigation.navigate("ServiceDetailScreen", { service });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      {loading ? (
        <View style={styles.headerloading}>
          <Text style={styles.headerTitle}></Text>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={COLORS.primary}
            />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.header}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: 130, height: 40 }}>
              <Image
                source={require("../../assets/dns-logo.png")}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </View>
            {/* <Text style={styles.headerTitle}>Vehicle Services</Text> */}
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: "#E2DBDC",
              width: "25%",
              height: 30,
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 6,
            }}
            onPress={() => navigation.navigate("Wallet")}
          >
            <FontAwesome5 name="wallet" size={20} />

            <Text style={styles.headerTitle}>
              ₹{new Intl.NumberFormat('en-IN').format(balance?.data?.balance) ??0}
            </Text>
            {/* <Ionicons
              name="notifications-outline"
              size={24}
              color={COLORS.primary}
            /> */}
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={COLORS.gray}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services..."
            placeholderTextColor="grey"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <Slider data={homeData?.slider} loading={loading} />

        {loading ? (
          <View style={styles.servicesSectionloading}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}></Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}></Text>
              </TouchableOpacity>
            </View>

            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onPress={handleServicePress}
                loading={loading}
              />
            ))}
          </View>
        ) : (
          <>
            <View style={styles.servicesSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Our Services</Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("AllServicesScreen", services)
                  }
                >
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              {filteredServices?.length > 0 ? (
                filteredServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onPress={handleServicePress}
                    loading={loading}
                  />
                ))
              ) : (
                <Text style={{ textAlign: "center", color: COLORS.gray }}>
                  No services found.
                </Text>
              )}
            </View>
            <View style={styles.containers}>
              <Text style={styles.heading}>Welcome to Our Service!</Text>

              <Text style={styles.description}>
                We're here to help! Feel free to reach out to us via WhatsApp or
                give us a call.
              </Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.whatsappButton}
                  onPress={handleWhatsApp}
                >
                  <FontAwesome5
                    name="whatsapp"
                    size={20}
                    color="white"
                    style={styles.icon}
                  />
                  <Text style={styles.whatsappText}>WhatsApp Us</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.callButton}
                  onPress={handleCall}
                >
                  <Feather
                    name="phone-call"
                    size={20}
                    color="#000"
                    style={styles.icon}
                  />
                  <Text style={styles.callText}>Call Us</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerloading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: "#E0E0E0", // Light gray typical for skeleton
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2, // For Android
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    alignSelf: "center",
  },
  notificationButton: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  containers: {
    backgroundColor: "#F9FAFB", // light background
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    marginBottom: "5%",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  sliderContainer: {
    marginBottom: 24,
  },
  slide: {
    width: width - 32,
    height: 200,
    borderRadius: 12,
    // backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  slideloading: {
    width: width - 32,
    height: 200,
    borderRadius: 12,
    backgroundColor: "#F1EFF1",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },

  slideImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  slideEmoji: {
    // fontSize: 64,
  },
  slideOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 16,
  },
  slideOverlayloading: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#E0E0E0", // Light gray typical for skeleton
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2, // For Android
    padding: 16,
  },

  slideTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.gray,
    marginHorizontal: 4,
  },
  activePaginationDot: {
    width: 24,
    backgroundColor: COLORS.secondary,
  },
  servicesSection: {
    marginTop: 8,
    marginBottom: 12,
  },
  servicesSectionloading: {
    marginTop: 8,
    marginBottom: 12,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
  },
  viewAllText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  serviceCardloading: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1EFF1",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  serviceIconContainerloading: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F1EFF1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  serviceIcon: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: 100,
  },
  serviceContent: {
    flex: 1,
  },
  serviceContentloading: {
    flex: 1,
    backgroundColor: "#E0E0E0", // Light gray typical for skeleton
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2, // For Android
  },

  serviceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: COLORS.gray,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    maxWidth: 320,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 16,
  },
  whatsappButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  whatsappText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  callButton: {
    flexDirection: "row",
    borderColor: "#D1D5DB",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  callText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
  icon: {
    marginRight: 8,
  },
});
