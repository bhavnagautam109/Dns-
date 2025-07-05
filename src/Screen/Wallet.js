import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const Wallet = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [data,setData]=useState([])

  const balance = 4287.66;

useEffect(() => {
  const fetchApplications = async () => {
    try {

      const token = await AsyncStorage.getItem("token") // Replace with your actual key
      if (!token) {
        throw new Error("No token found")
      }
      console.log(token,"---->token")

      const response = await axios.get("https://dnsconcierge.awd.world/api/wallet_transaction", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = response.data
     
      setData(data)


    } catch (err) {
      console.error("Error fetching applications:", err)
      setError("Failed to load applications")
    }
  }

  fetchApplications()
}, [])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Wallet</Text>
          <Icon name="credit-card" size={24} color="#1D2A57" />
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <View>
              <Text style={styles.balanceLabel}>Current Balance</Text>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceAmount}>
                  {showBalance ? `₹${data?.data?.wallet?.toFixed(2)}` : '••••••'}
                </Text>
                {/* <TouchableOpacity 
                  onPress={() => setShowBalance(!showBalance)}
                  style={styles.eyeButton}
                >
                  <Icon 
                    name={showBalance ? 'eye-off' : 'eye'} 
                    size={20} 
                    color="rgba(255,255,255,0.7)" 
                  />
                </TouchableOpacity> */}
              </View>
            </View>
            {/* <View style={styles.balanceStats}>
              <View style={styles.growthIndicator}>
                <Icon name="trending-up" size={16} color="#4ade80" />
                <Text style={styles.growthText}>+2.5%</Text>
              </View>
              <Text style={styles.growthLabel}>This month</Text>
            </View> */}
          </View>

          {/* Quick Stats */}
          {/* <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Icon name="arrow-down-left" size={16} color="#4ade80" />
                <Text style={styles.statLabel}>Income</Text>
              </View>
              <Text style={styles.statValue}>${totalIncome.toFixed(2)}</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Icon name="arrow-up-right" size={16} color="#f87171" />
                <Text style={styles.statLabel}>Expenses</Text>
              </View>
              <Text style={styles.statValue}>${totalExpenses.toFixed(2)}</Text>
            </View>
          </View> */}
        </View>

        {/* Transactions Section */}
        <View style={styles.transactionsSection}>
          <View style={styles.transactionsHeader}>
            <Text style={styles.transactionsTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllButton}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionsList}>
            {data?.data?.list?.map((transaction) => (
              <View key={transaction.id} style={styles.transactionCard}>
                <View style={styles.transactionContent}>
                  <View style={styles.transactionLeft}>
                    <View style={[
                      styles.transactionIcon,
                      { backgroundColor: transaction.type === 'dr' ? 'rgba(255, 203, 9, 0.1)' : 'rgba(29, 42, 87, 0.1)' }
                    ]}>
                      <Icon 
                        name={transaction.type === 'dr' ? 'plus' : 'minus'} 
                        size={20} 
                        color={transaction.type === 'dr' ? '#FFCB09' : '#1D2A57'} 
                      />
                    </View>
                    <View style={styles.transactionDetails}>
                      <Text style={styles.serviceName}>{transaction.service_name}</Text>
                      {/* <Text style={styles.category}></Text> */}
                      <Text style={styles.date}>{format(parseISO(transaction.created_at), "MMMM d, yyyy 'at' h:mm a")}</Text>
                    </View>
                  </View>
                  <View style={styles.transactionRight}>
                    <Text style={[
                      styles.amount,
                      { color: transaction.type === 'dr' ? '#FFCB09' : '#1D2A57' }
                    ]}>
                      {transaction.type === 'dr' ? '+' : '-'}₹{Math.abs(transaction.amount).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  balanceCard: {
    backgroundColor: '#1D2A57',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginBottom: 4,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  eyeButton: {
    padding: 4,
  },
  balanceStats: {
    alignItems: 'flex-end',
  },
  growthIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  growthText: {
    color: '#4ade80',
    fontSize: 14,
  },
  growthLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 12,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  statValue: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  transactionsSection: {
    marginBottom: 24,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  viewAllButton: {
    color: '#1D2A57',
    fontSize: 14,
    fontWeight: '500',
  },
  transactionsList: {
    gap: 12,
  },
  transactionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionDetails: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  category: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#9ca3af',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Wallet;