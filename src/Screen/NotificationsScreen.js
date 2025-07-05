"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Switch, StatusBar } from "react-native"
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

export default function NotificationsScreen({ navigation }) {
  const [settings, setSettings] = useState({
    statusChanges: true,
    documentVerification: true,
    applicationApproval: true,
    paymentConfirmation: true,
    paymentReminders: false,
    newsUpdates: false,
    tipsReminders: false,
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
  })

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const SettingItem = ({ title, description, settingKey }) => (
    <SafeAreaView >

    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={settings[settingKey]}
        onValueChange={(value) => updateSetting(settingKey, value)}
        trackColor={{ false: COLORS.lightGray, true: COLORS.secondary }}
        thumbColor={settings[settingKey] ? COLORS.white : COLORS.gray}
      />
    </View>
    </SafeAreaView>
  )

  return (
    <SafeAreaView style={styles.container}>
               <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
         
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notification Preferences</Text>
          <Text style={styles.cardSubtitle}>Manage how you receive notifications</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Application Updates</Text>
            <SettingItem
              title="Status Changes"
              description="Get notified when your application status changes"
              settingKey="statusChanges"
            />
            <SettingItem
              title="Document Verification"
              description="Get notified when your documents are verified"
              settingKey="documentVerification"
            />
            <SettingItem
              title="Application Approval"
              description="Get notified when your application is approved"
              settingKey="applicationApproval"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Notifications</Text>
            <SettingItem
              title="Payment Confirmation"
              description="Get notified when a payment is processed"
              settingKey="paymentConfirmation"
            />
            <SettingItem
              title="Payment Reminders"
              description="Get reminders for upcoming payments"
              settingKey="paymentReminders"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>General Notifications</Text>
            <SettingItem
              title="News & Updates"
              description="Get updates about new services and features"
              settingKey="newsUpdates"
            />
            <SettingItem
              title="Tips & Reminders"
              description="Get helpful tips and reminders"
              settingKey="tipsReminders"
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notification Channels</Text>
          <Text style={styles.cardSubtitle}>Choose how you want to receive notifications</Text>

          <SettingItem
            title="Push Notifications"
            description="Receive notifications on your device"
            settingKey="pushNotifications"
          />
          <SettingItem
            title="Email Notifications"
            description="Receive notifications via email"
            settingKey="emailNotifications"
          />
          <SettingItem
            title="SMS Notifications"
            description="Receive notifications via SMS"
            settingKey="smsNotifications"
          />
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
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  settingContent: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: COLORS.gray,
  },
})
