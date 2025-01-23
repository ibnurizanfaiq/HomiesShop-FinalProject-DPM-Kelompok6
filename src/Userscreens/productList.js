import React, { useState, useEffect} from "react";
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { getImages } from "../components/productEnd";
import { GetProductById } from "../components/productEnd";

const ProductList = ({ route, navigation }) => {
    const subcategory = route.params.subCategoryId;
    const idcategory = route.params.idcategory;
    const [noTujuan, setNoTujuan] = useState("");
    const [products, setProducts] = useState([]);
    const [images, setImages] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await GetProductById(subcategory);
                
                if (result.success) {
                    setProducts(result.data);
                } else {
                    console.warn(result?.message || "Invalid response format");
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, [subcategory]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const result = await getImages(idcategory, subcategory);
                if (result.success) {
                    setImages(result.data);
                } else {
                    console.warn(result?.message || "Invalid response format");
                }
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };
        fetchImages();
    }, [idcategory, subcategory]);

    const handlePay = () => {
        if (!selectedProduct || !noTujuan) {
            Alert.alert("Warning","Pilih produk dan no tujuan terlebih dahulu!");
            return;
        }
        navigation.navigate("PayScreen", { product: selectedProduct, noTujuan, images });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.head}>
            </View>
            <View style={styles.header}>
                <Text style={styles.title}>Nomor HP</Text>
                <View style={styles.inputContainer}>
                    <MaterialIcons name="phone" size={24} color="#666" style={styles.phoneIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Destination Number"
                        value={noTujuan}
                        onChangeText={setNoTujuan}
                        keyboardType="number-pad"
                    />
                </View>
                <Text style={styles.subtitle}>Silahkan Pilih Product</Text>
            </View>
            <ScrollView contentContainerStyle={styles.grid}>
                {products.map((product) => (
                    <TouchableOpacity
                        key={product.idproduct}
                        style={[
                            styles.productBox,
                            selectedProduct?.idproduct === product.idproduct && styles.selectedProduct,
                        ]}
                        onPress={() => setSelectedProduct(product)}
                    >
                        <Image
                            source={{ uri: images }}
                            style={styles.productImage}
                        />
                        <View style={styles.productInfo}>
                            <Text style={styles.productName}>{product.name}</Text>
                            <Text style={styles.productPrice}>Rp {product.price}</Text>
                            <Text style={styles.productDescrip}>{product.description}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <TouchableOpacity style={styles.payButton} onPress={handlePay}>
                <Text style={styles.payButtonText}>Bayar</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );    
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E3EED4", 
    },
    head: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 150, 
        backgroundColor: "#B3151C",
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        overflow: 'hidden',
    },
    header: {
        marginTop: 65,
        padding: 15,
        backgroundColor: "white",
        marginHorizontal: 15,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 2,
    },
    title: {
        fontSize: 16,
        color: "#666",
        marginBottom: 10,
        marginLeft: 5,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: "500",
        marginTop: 15,
        marginLeft: 5,
        color: "#333",
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        height: 45,
    },
    phoneIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#000',
        padding: 0,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        marginTop: 20, 
    },
    productBox: {
        flexDirection: "column",
        width: "48%",
        backgroundColor: "white",
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        alignItems: "center",
        elevation: 2,
    },
    selectedProduct: {
        borderWidth: 2,
        borderColor: "green",
    },
    productName: {
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
    },
    productPrice: {
        fontSize: 13,
        color: "green",
        textAlign: "center",
    }, 
    productDescrip: {
        fontSize: 12,
        color: "#000",
        textAlign: "center",
    },
    payButton: {
        backgroundColor: "green",
        padding: 15,
        borderRadius: 20,
        margin: 10,
        marginHorizontal: 20,
        alignItems: "center",
    },
    payButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    productImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 10, 
    },
    productInfo: {
        flex: 1, 
    },
});

export default ProductList;