import React from "react";
import { SafeAreaView, View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";

import {updateProduct, deleteProduct} from "../components/backEnd";

const EditProduct = ({route, navigation}) => {
    const {product} = route.params;

    const handleUpdate = async () => {
        const result = await updateProduct(product.idproduct, product.idsubcategory, product.name, product.price, product.description, Date.now());
        if (result.success) {
            Alert.alert("Info", result.message, [
                {text: "OK", onPress: () => navigation.navigate("ProductScreen")},
            ]);
        } else {
            Alert.alert("Error", result.message);
        }
    };

    const handleDelete = async () => {
        const result = await deleteProduct(product.idproduct, product.idsubcategory);
        if (result.success) {
            Alert.alert("Info", result.message, [
                {text: "OK", onPress: () => navigation.navigate("ProductScreen")},
            ]);
        } else {
            Alert.alert("Error", result.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.productContainer}>
                <Image source={{uri: product.image}} style={styles.productImage} />
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>Rp. {product.price}</Text>
                <Text style={styles.productDescription}>{product.description}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonUpdate} onPress={handleUpdate}>
                    <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonDelete} onPress={handleDelete}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    productContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    productImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
    productName: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 10,
    },
    productPrice: {
        fontSize: 18,
        color: "green",
    },
    productDescription: {
        fontSize: 16,
        textAlign: "center",
        margin: 10,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 20,
    },
    buttonUpdate: {
        backgroundColor: "#007BFF",
        padding: 10,
        borderRadius: 5,
    },
    buttonDelete: {
        backgroundColor: "red",
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
});

export default EditProduct;