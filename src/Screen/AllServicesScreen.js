import React, { useState, useEffect } from "react"
import axios from "axios"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  StatusBar,
  Image
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
}



// Categories for filtering
const categories = [
  "All",
  "License",
  "Registration",
  "Certificate",
  "Permit",
  "Update",
  "Transfer",
  "Insurance",
]

function ServiceCard({ service, onPress }) {
  
  return (

    <TouchableOpacity style={styles.serviceCard} onPress={() => onPress(service)}>
      <View style={styles.serviceIconContainer}>
        <Image source={{uri:service.image}} style={{width:'100%',height:'100%',borderRadius:100}}/>
      </View>
      <View style={styles.serviceContent}>
        <Text style={styles.serviceTitle}>{service.name}</Text>
        <Text style={styles.serviceDescription}>{service.description}</Text>
        {/* <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{service.category}</Text>
        </View> */}
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
    </TouchableOpacity>

  )
}

export default function AllServicesScreen({ navigation }) {
  const [searchText, setSearchText] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [allServices, setAllServices] = useState([])
const [loading, setLoading] = useState(true)


useEffect(() => {
  const fetchServices = async () => {
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/viewService`)
      setAllServices(response.data.data.service) // Adjust based on API response shape
    } catch (error) {
      console.error("Failed to fetch services:", error)
    } finally {
      setLoading(false)
    }
  }

  fetchServices()
}, [])

const filteredServices = 


allServices?.filter((service) => {
  const matchesSearch =
    service?.name?.toLowerCase()?.includes(searchText?.toLowerCase()) ||
    service?.description?.toLowerCase()?.includes(searchText?.toLowerCase())


  return matchesSearch
})


  const handleServicePress = (service) => {
    navigation.navigate("ServiceDetailScreen", { service })
  }



  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Services</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Ionicons name="close-circle" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.categoryButton, selectedCategory === item && styles.selectedCategoryButton]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[styles.categoryButtonText, selectedCategory === item && styles.selectedCategoryButtonText]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      <FlatList
        data={filteredServices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ServiceCard service={item} onPress={handleServicePress} />}
        contentContainerStyle={styles.servicesList}
         showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color={COLORS.gray} />
            <Text style={styles.emptyText}>No services found</Text>
            <Text style={styles.emptySubtext}>Try a different search term or category</Text>
          </View>
        }
      />
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
    borderRadius: 25,
    paddingHorizontal: 16,
    margin: 16,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  categoriesContainer: {
    marginBottom: 8,
    display:'none'
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    marginRight: 8,
  },
  selectedCategoryButton: {
    backgroundColor: COLORS.secondary,
  },
  categoryButtonText: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: "500",
  },
  selectedCategoryButtonText: {
    color: COLORS.black,
    fontWeight: "600",
  },
  servicesList: {
    padding: 16,
    paddingTop: 8,
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
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  serviceIcon: {
    fontSize: 24,
  },
  serviceContent: {
    flex: 1,
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
    marginBottom: 6,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.primary + "15",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.gray,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
  },
})
