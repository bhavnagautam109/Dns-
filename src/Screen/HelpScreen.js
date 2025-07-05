
import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Linking, StatusBar } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const COLORS = {
  primary: "#1D2A57",
  secondary: "#FFCB09",
  white: "#FFFFFF",
  black: "#000000",
  gray: "#6B7280",
  lightGray: "#F3F4F6",
  border: "#E5E7EB",
}

const faqs = [
  {
    question: "How do I apply for a driving license?",
    answer:
      'To apply for a driving license, navigate to the Home screen, select "Driving License" from the services list, and follow the on-screen instructions to complete your application.',
  },
  {
    question: "What documents are required for vehicle registration?",
    answer:
      "For vehicle registration, you'll need the vehicle invoice/bill, insurance certificate, pollution certificate, address proof, identity proof, and Form 20 (Sale certificate).",
  },
  {
    question: "How long does it take to process my application?",
    answer:
      'Processing times vary by service. Driving licenses typically take 15-30 days, number plates 7-14 days, and vehicle registration 7-14 days. You can check the status of your application in the "Applications" tab.',
  },
  {
    question: "Can I cancel my application?",
    answer:
      'Yes, you can cancel your application if it\'s still in the "Application Submitted" stage. Go to the "Applications" tab, select your application, and look for the cancel option.',
  },
  {
    question: "How do I update my personal information?",
    answer:
      'To update your personal information, go to the "Profile" tab, and click on the "Edit" button next to "Personal Information". Make your changes and save them.',
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept credit/debit cards, UPI, net banking, and mobile wallets for all payments. All transactions are secure and encrypted.",
  },
]

export default function HelpScreen({ navigation }) {
  const [searchText, setSearchText] = useState("")
  const [expandedFaq, setExpandedFaq] = useState(null)

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchText.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchText.toLowerCase()),
  )

  const handleCall = () => {
    Linking.openURL("tel:+917053750750")
  }

  const handleEmail = () => {
    Linking.openURL("mailto:support@dnsconcierge.com")
  }

  const ContactCard = ({ icon, title, subtitle, onPress, backgroundColor }) => (
    <TouchableOpacity style={[styles.contactCard, { backgroundColor }]} onPress={onPress}>
      <View style={styles.contactIconContainer}>
        <Ionicons name={icon} size={20} color={COLORS.secondary} />
      </View>
      <View style={styles.contactContent}>
        <Text style={styles.contactTitle}>{title}</Text>
        <Text style={styles.contactSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  )

  const FaqItem = ({ faq, index }) => (
    <TouchableOpacity style={styles.faqItem} onPress={() => setExpandedFaq(expandedFaq === index ? null : index)}>
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{faq.question}</Text>
        <Ionicons name={expandedFaq === index ? "chevron-up" : "chevron-down"} size={20} color={COLORS.gray} />
      </View>
      {expandedFaq === index && <Text style={styles.faqAnswer}>{faq.answer}</Text>}
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
          
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for help..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <View style={styles.contactSection}>
          <ContactCard
            icon="call"
            title="Call Us"
            subtitle="+91 705-375-0750"
            
            onPress={handleCall}
            backgroundColor={COLORS.primary}
          />
          <ContactCard
            icon="mail"
            title="Email Us"
            subtitle="support@dnsconcierge.com"
            onPress={handleEmail}
            backgroundColor={COLORS.primary}
          />
          <ContactCard
            icon="chatbubble-ellipses"
            title="Contact us"
            subtitle="Contact us our support team"
            onPress={() => Linking.openURL('https://dnsconcierge.awd.world/contact-us')}

            backgroundColor={COLORS.primary}
          />
        </View>

        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {filteredFaqs.map((faq, index) => (
            <FaqItem key={index} faq={faq} index={index} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  contactSection: {
    marginBottom: 32,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 203, 9, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  faqSection: {
    marginBottom: 55,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 16,
  },
  faqItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
    flex: 1,
    marginRight: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 12,
    lineHeight: 20,
  },
})
