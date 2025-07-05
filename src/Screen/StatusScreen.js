import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  primary: "#1D2A57",
  secondary: "#FFCB09",
  white: "#FFFFFF",
  black: "#000000",
  gray: "#6B7280",
  lightGray: "#F3F4F6",
  border: "#E5E7EB",
  green: "#10B981",
  red: "#EF4444", // Added red color
};

export default function StatusScreen({ route, navigation }) {
  const { service, applicationId, application } = route?.params;

  console.log(application, "wow");
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // Simulate progress updates
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 5;
        }
        clearInterval(interval);
        return 100;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusText = () => {
    if (application.application_status == 0) return "Application Submitted";
    if (application.application_status == 2) return "Document Verification";
    if (application.application_status == 1) return "Approved";
    if (application.application_status == 3) return "Rejected";
    return "Approved";
  };

  const timelineSteps = [
    {
      title: "Application Submitted",
      description: "Your application has been successfully submitted.",
      date: new Date().toLocaleDateString(),
      completed: true,
    },
    {
      title: "Document Verification",
      description: "Your documents are being verified by our team.",
      date: "In progress",
      completed:
        application.application_status >= 2 ||
        application.application_status == 1,
    },
    {
      title: "Processing",
      description: "Your application is being processed by the authorities.",
      date: "Pending",
      completed:
        application.application_status == 2 ||
        application.application_status == 1 ||
        application.application_status == 3,
    },
    {
      title: "Approval & Issuance",
      description:
        application.application_status == 3
          ? "Your application has been rejected."
          : "Final approval and issuance of your document.",
      date: application.application_status == 3 ? "Rejected" : "Pending",
      completed:
        application.application_status == 1 ||
        application.application_status == 3,
      isRejected: application.application_status == 3,
    },
  ];

  // Function to get the icon color for each timeline step
  const getTimelineIconStyle = (step, index) => {
    if (!step.completed) {
      return styles.timelineIcon;
    }

    // If it's the last step and application is rejected (status 3)
    if (index === timelineSteps.length - 1 && step.isRejected) {
      return [styles.timelineIcon, styles.rejectedTimelineIcon];
    }

    // All other completed steps are green
    return [styles.timelineIcon, styles.completedTimelineIcon];
  };

  // Function to get the icon name for each timeline step
  const getTimelineIconName = (step, index) => {
    if (!step.completed) {
      return "time";
    }

    // If it's the last step and application is rejected (status 3)
    if (index === timelineSteps.length - 1 && step.isRejected) {
      return "close";
    }

    // All other completed steps show checkmark
    return "checkmark";
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Application Status</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statusCard}>
          <Text style={styles.serviceTitle}>
            {application?.service_name || "title"}
          </Text>
          <Text style={styles.applicationId}>
            Application ID: {application.id}
          </Text>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>
                Status: {getStatusText()}
              </Text>
              <Text style={styles.progressPercentage}>
                {application.application_status == 0
                  ? 30
                  : application.application_status == 1
                  ? 100
                  : application.application_status == 3
                  ? 0
                  : 60}
                %
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${
                      application.application_status == 0
                        ? 30
                        : application.application_status == 1
                        ? 100
                        : application.application_status == 3
                        ? 10
                        : 60
                    }%`,
                    backgroundColor: `${
                      application.application_status == 3
                        ? "red"
                        : COLORS.secondary
                    }`,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.datesContainer}>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Submitted On</Text>
              <Text style={styles.dateValue}>{application.purchase_date}</Text>
            </View>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Est. Completion</Text>
              <Text style={styles.dateValue}>
                {new Date(
                  Date.now() + 15 * 24 * 60 * 60 * 1000
                ).toLocaleDateString()}
              </Text>
            </View>
          </View>

          <View style={styles.tableContainer}>
            {/* <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>Label</Text>
        <Text style={styles.headerCell}>Date</Text>
      </View> */}

            <View style={styles.tableRow}>
              <Text style={styles.cell}>Advance Payment</Text>
              <Text style={styles.cell}>
                ₹
                {application.payment_type == "partial"
                  ? application.advance_payment
                  : application.fees}
              </Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.cell}>Remaining Payment</Text>
              <Text style={styles.cell}>
                ₹
                {application.payment_type == "partial"
                  ? application.remaining_payment
                  : 0}
              </Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.cell}>Total Paid</Text>
              <Text style={styles.cell}>₹{application.fees}</Text>
            </View>
          </View>

          {application.remaining_payment != 0 && (
            <Text
              style={{
                marginTop: "5%",
                backgroundColor: "#FFCB09",
                width: "100%",
                textAlign: "center",
                padding: 10,

                alignItems: "center",
                alignSelf: "center",
                fontWeight: "700",
                fontSize: 16,
                borderRadius: 8,
              }}
            >
              Pay ₹{application.remaining_payment}
            </Text>
          )}
        </View>

        <View style={styles.timelineSection}>
          <Text style={styles.sectionTitle}>Application Timeline</Text>

          <View style={styles.timeline}>
            {timelineSteps.map((step, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineIconContainer}>
                  <View style={getTimelineIconStyle(step, index)}>
                    <Ionicons
                      name={getTimelineIconName(step, index)}
                      size={16}
                      color={step.completed ? COLORS.white : COLORS.gray}
                    />
                  </View>
                  {index < timelineSteps.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        step.completed && styles.completedTimelineLine,
                      ]}
                    />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>
                    {step?.title || "title"}
                  </Text>
                  <Text style={styles.timelineDate}>{step.date}</Text>
                  <Text style={styles.timelineDescription}>
                    {step.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actionsSection}>
          {/* <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionContent}>
              <Ionicons name="document-text" size={20} color={COLORS.primary} />
              <Text style={styles.actionText}>View Application Details</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity> */}
          {/* 
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionContent}>
              <Ionicons name="download" size={20} color={COLORS.primary} />
              <Text style={styles.actionText}>Download Receipt</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity> */}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate("Main")}
        >
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
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
  statusCard: {
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
  serviceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 4,
  },
  applicationId: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 16,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: COLORS.black,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.black,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  datesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  datesContainer2: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "4%",
  },
  dateItem: {
    flex: 1,
  },
  dateItem2: {
    borderRightWidth: 2,
    paddingRight: 2,
  },

  dateLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.black,
  },
  timelineSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 16,
  },
  timeline: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 24,
  },
  timelineIconContainer: {
    alignItems: "center",
    marginRight: 16,
  },
  timelineIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  completedTimelineIcon: {
    backgroundColor: COLORS.green,
  },
  rejectedTimelineIcon: {
    backgroundColor: COLORS.red,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.lightGray,
    marginTop: 8,
  },
  completedTimelineLine: {
    backgroundColor: COLORS.green,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  timelineDescription: {
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 20,
  },
  actionsSection: {
    marginBottom: 24,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: "5%",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  headerCell: {
    flex: 1,
    padding: 10,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  cell: {
    flex: 1,
    padding: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    fontSize: 16,
    color: COLORS.black,
    marginLeft: 12,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  homeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  homeButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
