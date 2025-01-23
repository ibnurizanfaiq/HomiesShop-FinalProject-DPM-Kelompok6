import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { getOrder, getRequestid } from '../components/orderEnd';
import { checkTransaction } from '../components/orderProces';
import { updateSaldoUserid } from '../components/userEnd';

const TransactionScreen = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [topups, setTopups] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('transactions');

  const fetchOrders = async (isInterval = false) => {
    if (!isInterval) setLoading(true);
    try {
      const result = await getOrder();
      if (result.success) {
        let orderList = Object.values(result.data);

        orderList.sort((a, b) => new Date(b.create_at) - new Date(a.create_at));

        setOrders(orderList);
        setError(null);

        orderList.forEach(async (order) => {
          if (order.status === 'Pending') {
            const check = await checkTransaction(order.orderId, order.idproduct, order.noCustomer, order.sign);
            if (check.succes) {
              await updateSaldoUserid(parseInt(order.price));
            }
          }
        });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Terjadi kesalahan saat memuat data.');
    }
    if (!isInterval) setLoading(false);
    setRefreshing(false);
  };

  const fetchTopups = async () => {
    setLoading(true);
    try {
      const result = await getRequestid();
      if (result.success) {
        let topupList = Object.values(result.data);

        topupList.sort((a, b) => new Date(b.create_at) - new Date(a.create_at));

        setTopups(topupList);
        setError(null);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Terjadi kesalahan saat memuat data topup.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    if (activeTab === 'transactions') {
      fetchOrders();
    } else {
      fetchTopups();
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={[styles.card, styles.cardShadow]}>
      <View style={[styles.iconContainer, styles.iconContainerColor]}>
        {item.idproduct ? (
          <MaterialIcons name="mobile-friendly" size={24} color="white" />
        ) : (
          <FontAwesome5 name="sim-card" size={24} color="white" />
        )}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>ref id: {item.orderId}</Text>
        <Text style={styles.subtitle}>price : {item.price}</Text>
        <Text style={styles.subtitle}>Nomor Tujuan: {item.noCustomer}</Text>
        <Text style={styles.subtitle}>Status: {item.status}</Text>
        <Text style={styles.subtitle}>Serial No: {item.sn}</Text>
        <Text style={styles.date}>{item.create_at}</Text>
      </View>
    </View>
  );

  const renderTopupItem = ({ item }) => (
    <View style={[styles.card, styles.cardShadow]}>
      <View style={[styles.iconContainer, styles.iconContainerColor]}>
        <FontAwesome5 name="wallet" size={24} color="white" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Topup ID: {item.idtopup}</Text>
        <Text style={styles.subtitle}>Nominal: {item.nominal}</Text>
        <Text style={styles.subtitle}>Status: {item.Status}</Text>
        <Text style={styles.date}>{item.create_at}</Text>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#6200ee" style={styles.loader} />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'transactions' && styles.activeTab]}
          onPress={() => {
            setActiveTab('transactions');
            fetchOrders();
          }}
        >
          <Text style={[styles.tabText, activeTab === 'transactions' && styles.activeTabText]}>
            History Transaksi
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'topups' && styles.activeTab]}
          onPress={() => {
            setActiveTab('topups');
            fetchTopups();
          }}
        >
          <Text style={[styles.tabText, activeTab === 'topups' && styles.activeTabText]}>
            History Topup
          </Text>
        </TouchableOpacity>
      </View>
      {activeTab === 'transactions' ? (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.orderId}
          renderItem={renderOrderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <FlatList
          data={topups}
          keyExtractor={(item) => item.idtopup}
          renderItem={renderTopupItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#375534',
  },
  tabText: {
    fontSize: 14,
    color: '#000',
  },
  activeTabText: {
    color: '#fff',
  },
  listContainer: {
    paddingVertical: 8,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 50,
    marginRight: 16,
  },
  iconContainerColor: {
    backgroundColor: '#375534',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
});

export default TransactionScreen;