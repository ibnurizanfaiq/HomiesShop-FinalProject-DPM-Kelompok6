import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getOrderNoId } from '../components/orderEnd';

const AdminTransaction = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const result = await getOrderNoId();
      if (result.success) {
        let orderList = [];

        Object.values(result.data).forEach((userOrders) => {
          Object.values(userOrders).forEach((order) => {
            orderList.push(order);
          });
        });

        orderList.sort((a, b) => new Date(b.create_at) - new Date(a.create_at));

        setOrders(orderList);
        setError(null);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Terjadi kesalahan saat memuat data.');
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="mobile-friendly" size={24} color="white" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>ref id: {item.orderId}</Text>
        <Text style={styles.subtitle}>price: {item.price}</Text>
        <Text style={styles.subtitle}>Nomor Tujuan: {item.noCustomer}</Text>
        <Text style={styles.subtitle}>Status: {item.status}</Text>
        <Text style={styles.subtitle}>Serial No: {item.sn}</Text>
        <Text style={styles.date}>{item.create_at}</Text>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
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
      <FlatList
        data={orders}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderOrderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
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
  card: {
    flexDirection: 'row',
    backgroundColor: '#ACE1AF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
  },
  iconContainer: {
    backgroundColor: '#375534',
    padding: 10,
    borderRadius: 50,
    marginRight: 16,
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

export default AdminTransaction;
