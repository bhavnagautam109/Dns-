import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView ,
  Image,
  StatusBar
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

const serviceDetails = {
  "driving-license": {
    title: "Driving License",
    description: "Apply for new license or renew existing one",
    icon: "🚗",
    requirements: [
      "Age proof (18 years and above)",
      "Address proof (Aadhar card, voter ID, etc.)",
      "Passport size photographs",
      "Medical fitness certificate (Form 1A)",
      "Valid learner's license",
    ],
    fee: "₹500",
    processingTime: "15-30 days",
  },
  "number-plate": {
    title: "Number Plate",
    description: "Apply for new vehicle registration number",
    icon: "🔢",
    requirements: [
      "Vehicle registration certificate (RC)",
      "Address proof",
      "Identity proof",
      "Insurance certificate",
      "Pollution certificate",
    ],
    fee: "₹1,000",
    processingTime: "7-14 days",
  },
  "vehicle-registration": {
    title: "Vehicle Registration",
    description: "Register your new vehicle",
    icon: "📋",
    requirements: [
      "Vehicle invoice/bill",
      "Insurance certificate",
      "Pollution certificate",
      "Address proof",
      "Identity proof",
      "Form 20 (Sale certificate)",
    ],
    fee: "₹1,500",
    processingTime: "7-14 days",
  },
  "fitness-certificate": {
    title: "Fitness Certificate",
    description: "Get vehicle fitness certificate",
    icon: "✅",
    requirements: [
      "Vehicle registration certificate (RC)",
      "Insurance certificate",
      "Pollution certificate",
      "Tax payment receipt",
    ],
    fee: "₹800",
    processingTime: "3-7 days",
  },
  permit: {
    title: "Vehicle Permit",
    description: "Apply for commercial vehicle permit",
    icon: "📄",
    requirements: [
      "Vehicle registration certificate (RC)",
      "Insurance certificate",
      "Fitness certificate",
      "Tax payment receipt",
      "Route details (for route permits)",
    ],
    fee: "₹2,000",
    processingTime: "15-30 days",
  },
}

export default function ServiceDetailScreen({ route, navigation }) {
  const { service } = route.params
  const details = serviceDetails[service.id] || service

  const handleApply = () => {
    navigation.navigate("ApplyScreen", { service: service })
  }

  return (
    <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{details.name}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:'15%'}}>
        <View style={styles.serviceHeader}>
          <View style={styles.serviceIconContainer}>
            {/* <Text style={styles.serviceIcon}>{details.icon}</Text> */}
            <Image source={{uri:details.image}} style={{width:'100%',height:'100%',borderRadius:100}}/>
          </View>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceTitle}>{details.name}</Text>
            <Text style={styles.serviceDescription}>{details.description}</Text>
          </View>
        </View>
        {
details?.doc_require!=null &&

     <View style={styles.card}>
  <View style={styles.cardHeader}>
    <Ionicons name="document-text" size={20} color={COLORS.primary} />
    <Text style={styles.cardTitle}>Required Documents</Text>
  </View>
  <Text style={styles.cardSubtitle}>Documents needed for application</Text>
  <View style={styles.requirementsList}>
    {details?.doc_require?.split(",").map((doc, index) => (
      <View key={index} style={styles.requirementItem}>
        <Ionicons name="checkmark-circle" size={16} color={COLORS.green} />
        <Text style={styles.requirementText}>{doc.trim()}</Text>
      </View>
    ))}
  </View>
</View>

        }

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="card" size={20} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Fee Details</Text>
          </View>
          <Text style={styles.feeAmount}>{details.fees}</Text>
          <Text style={styles.feeNote}>Application fee (may vary based on vehicle type)</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="time" size={20} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Processing Time</Text>
          </View>
          <Text style={styles.processingTime}>{details?.process_time}</Text>
          <Text style={styles.processingNote}>Estimated time for processing</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyButtonText}>Apply Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
     height:'100%',
  width:'100%',
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
  serviceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  serviceIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  serviceIcon: {
    fontSize: 32,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 16,
    color: COLORS.gray,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
    marginLeft: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 16,
  },
  requirementsList: {
    gap: 8,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  requirementText: {
    fontSize: 14,
    color: COLORS.black,
    marginLeft: 8,
    flex: 1,
  },
  feeAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 4,
  },
  feeNote: {
    fontSize: 14,
    color: COLORS.gray,
  },
  processingTime: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 4,
  },
  processingNote: {
    fontSize: 14,
    color: COLORS.gray,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  applyButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
})
