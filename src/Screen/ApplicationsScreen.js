
import { useState, useEffect, useCallback } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, StatusBar } from "react-native"
import axios from "axios"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect } from "@react-navigation/native"


const COLORS = {
  primary: "#1D2A57",
  secondary: "#FFCB09",
  white: "#FFFFFF",
  black: "#000000",
  gray: "#6B7280",
  lightGray: "#F3F4F6",
  border: "#E5E7EB",
  green: "#10B981",
  red: "#EF4444",
  amber: "#F59E0B",
}


function ApplicationCard({ application, type, onPress }) {
  console.log(type)
  const getStatusIcon = () => {
    switch (type) {
      case "pending":
        return <Ionicons name="time" size={16} color={COLORS.amber} />
      case "completed":
        return <Ionicons name="checkmark-circle" size={16} color={COLORS.green} />
      case "rejected":
        return <Ionicons name="close-circle" size={16} color={COLORS.red} />
      default:
        return null
    }
  }

  return (
    <TouchableOpacity style={styles.applicationCard} onPress={() => onPress(application)}>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.serviceName}>{application.service_name}</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
        </View>
        <Text style={styles.applicationId}>ID: {application.id}</Text>
        <View style={styles.statusContainer}>
          {getStatusIcon()}
          <Text style={styles.statusText}>{application.application_status==0?"Pending":application.application_status==3?"Rejected":"Complete" } </Text>
        </View>
        {application.reason && <Text style={styles.reasonText}>Reason: {application.reason}</Text>}
        <Text style={styles.dateText}>
          {type === "completed" ? "Completed" : type === "rejected" ? "Rejected" : "Applied"} on {application.purchase_date}
        </Text>
        {type === "pending" && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${application.application_status==0? 30:60 }%` }]} />
            </View>
            <Text style={styles.progressText}>{application.application_status==0? 30:60}%</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default function ApplicationsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("pending")
  const [pendingApplications, setPendingApplications] = useState([])
const [completedApplications, setCompletedApplications] = useState([])
const [rejectedApplications, setRejectedApplications] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)
useFocusEffect(
  useCallback(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);

        const token = await AsyncStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/view_service_apply`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data.data.serviceApply;

        setPendingApplications(
          data.filter((app) => app.application_status == "0" || app.application_status == "2")
        );
        setCompletedApplications(
          data.filter((app) => app.application_status == "1")
        );
        setRejectedApplications(
          data.filter((app) => app.application_status == "3")
        );
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [])
);


  const handleApplicationPress = (application) => {
    navigation.navigate("StatusScreen", { application })
  }

  const renderApplications = () => {
    let data = []
    const type = activeTab

    switch (activeTab) {
      case "pending":
        data = pendingApplications
        break
      case "completed":
        data = completedApplications
        break
      case "rejected":
        data = rejectedApplications
        break
    }

    if (data.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No {activeTab} applications</Text>
          {activeTab === "pending" && (
            <TouchableOpacity style={styles.applyButton} onPress={() => navigation.navigate("HomeScreen")}>
              <Text style={styles.applyButtonText}>Apply for a service</Text>
            </TouchableOpacity>
          )}
        </View>
      )
    }

    return (
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ApplicationCard application={item} type={type} onPress={handleApplicationPress} />}
        showsVerticalScrollIndicator={false}
      />
    )
  }

  return (
    <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Applications</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "pending" && styles.activeTab]}
          onPress={() => setActiveTab("pending")}
        >
          <Text style={[styles.tabText, activeTab === "pending" && styles.activeTabText]}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "completed" && styles.activeTab]}
          onPress={() => setActiveTab("completed")}
        >
          <Text style={[styles.tabText, activeTab === "completed" && styles.activeTabText]}>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "rejected" && styles.activeTab]}
          onPress={() => setActiveTab("rejected")}
        >
          <Text style={[styles.tabText, activeTab === "rejected" && styles.activeTabText]}>Rejected</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>{renderApplications()}</View>
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.lightGray,
    margin: 16,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: COLORS.secondary,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: "500",
  },
  activeTabText: {
    color: COLORS.black,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  applicationCard: {
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
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
  },
  applicationId: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    marginLeft: 4,
    color: COLORS.black,
  },
  reasonText: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
    marginRight: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.secondary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.black,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 16,
  },
  applyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  applyButtonText: {
    color: COLORS.primary,
    fontSize: 14,
  },
})
