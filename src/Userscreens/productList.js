import React, { useState, useEffect, use } from "react";
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from "react-native";

import { GetProductById, getImages } from "../components/productEnd";

const ProductList = ({ route, navigation }) => {
    const subcategory  = route.params.subCategoryId;
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
        if (!selectedProduct) {
            alert("Pilih produk terlebih dahulu!");
            return;
        }
        navigation.navigate("payScreen", { product: selectedProduct, noTujuan });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Masukan Nomor Tujuan</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Masukan Nomor Tujuan"
                    value={noTujuan}
                    onChangeText={setNoTujuan}
                    keyboardType="number-pad"
                />
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
    header: {
        padding: 10,
        backgroundColor: "white",
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
        marginHorizontal: 20,
    },
    input: {
        height: 43,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 20,
        marginHorizontal: 20,
        paddingHorizontal: 10,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 10,
    },
    productBox: {
        flexDirection: "row", 
        width: "47%",
        backgroundColor: "white",
        borderRadius: 20,
        padding: 10,
        marginHorizontal: 5,
        marginBottom: 10,
        alignItems: "center",
        elevation: 3,
    },
    selectedProduct: {
        borderWidth: 2,
        borderColor: "green",
    },
    productName: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    productPrice: {
        fontSize: 14,
        color: "green",
        marginTop: 5,
        textAlign: "center",
    }, 
    productDescrip: {
        fontSize: 14,
        color: "#000",
        marginTop: 5,
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
        width: 60,
        height: 60,
        borderRadius: 5,
        marginRight: 10, 
    },
    productInfo: {
        flex: 1, 
    },
});

export default ProductList;
