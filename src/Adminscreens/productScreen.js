import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getProduct } from '../components/productEnd';

const ICON_SIZE = 50;
const ICON_COLOR = '#4CAF50';

const ProductScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const result = await getProduct();
        if (result.success) {
          const productArray = Object.keys(result.data).map(key => ({
            idproduct: key,
            ...result.data[key],
          }));
          setProducts(productArray);
        } else {
          console.warn(result?.message || 'Invalid response format');
          Alert.alert('Sepertinya', result?.message || 'Gagal memuat produk.');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        Alert.alert('Kesalahan', 'Terjadi kesalahan saat mengambil data produk.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);

  const handleAddProduct = useCallback(() => {
    navigation.navigate('AddProductScreen');
  }, [navigation]);

  const renderProduct = useCallback(({ item }) => {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.productContainer}
          onPress={() =>
            navigation.navigate('EditProduct', { product: item })
          }>
          <View style={styles.iconContainer}>
            <MaterialIcons name="shopping-bag" size={ICON_SIZE} color={ICON_COLOR} />
          </View>
          <View style={styles.productTextContainer}>
            <Text style={styles.productName}>{item.name || 'Produk Tidak Diketahui'}</Text>
            <Text style={styles.productPrice}>
              {item.price ? `Rp ${item.price}` : 'Harga tidak tersedia'}
            </Text>
            <Text style={styles.productDescription}>
              {item.description || 'Deskripsi tidak tersedia'}
            </Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.loaderText}>Memuat produk...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.idproduct.toString()}
        renderItem={renderProduct}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="info" size={ICON_SIZE} color="#999" />
            <Text style={styles.emptyText}>Tidak ada produk tersedia</Text>
          </View>
        }
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
        <Text style={styles.addButtonText}>Tambah Produk</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 15,
  },
  productTextContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 16,
    color: '#4CAF50',
    marginTop: 5,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    fontSize: 16,
    color: '#555',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
});

export default ProductScreen;
