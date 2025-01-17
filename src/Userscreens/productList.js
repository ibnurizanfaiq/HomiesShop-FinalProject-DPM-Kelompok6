import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";

import { GetProductById } from "../components/productEnd"; 

const ProductList = ({ route, navigation }) => {
    const { subcategoryId } = route.params;
    const [noTujuan, setNoTujuan] = useState("");
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await GetProductById(subcategoryId); 
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
    }, [subcategoryId]);

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
                        <Text style={styles.productName}>{product.name}</Text>
                        <Text style={styles.productPrice}>Rp {product.price}</Text>
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
        backgroundColor: "#f5f5f5",
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
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 10,
    },
    productBox: {
        width: "48%", // 2 kolom
        backgroundColor: "white",
        borderRadius: 5,
        padding: 10,
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
    payButton: {
        backgroundColor: "green",
        padding: 15,
        borderRadius: 5,
        margin: 10,
        alignItems: "center",
    },
    payButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default ProductList;
