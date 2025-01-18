import React, {useState} from "react";
import { SafeAreaView, View, Text, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Modal, TextInput, Button } from "react-native";

import { updateProduct, deleteProduct } from "../components/productEnd";

const EditProduct = ({route, navigation}) => {
    const {product} = route.params;
    const [idproduct, setIdproduct] = useState(product.idproduct);
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price);
    const [description, setDescription] = useState(product.description);
    const [Loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        if (name.trim() === "" || price.trim() === "" || description.trim() === "") {
            Alert.alert("Error", "All fields must be filled.");
            return;
        } else {
            setLoading(true);
            const update = new Date().toLocaleString();
            try {
                const result = await updateProduct(product.idproduct, product.idsubcategory, name, price, description, update);
                Alert.alert("Success", result.message);
                navigation.goBack();
            } catch (error) {
                Alert.alert("Error", error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                    <Image
                        source={{ uri: "https://dashboard.codeparrot.ai/api/assets/Z3yn7kjX1HzWCCoE" }}
                        style={styles.mainBg}
                    />

                    <View style={styles.formContainer}>
                        <Text style={styles.label}>Product ID</Text>
                        <TextInput
                            style={styles.input}
                            value={idproduct}
                            onChangeText={setIdproduct}
                        />

                        <Text style={styles.label}>Product Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                        />

                        <Text style={styles.label}>Price</Text>
                        <TextInput
                            style={styles.input}
                            value={price}
                            onChangeText={setPrice}
                        />

                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={styles.input}
                            value={description}
                            onChangeText={setDescription}
                        />

                        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                            <Text style={styles.buttonText}>Update Product</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.ButtonCancel} onPress={() => navigation.goBack()}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.ButtonDelete} onPress={() => {
                            Alert.alert("Delete Product", "Are you sure you want to delete this product?", [
                                {
                                    text: "Yes",
                                    onPress: async () => {
                                        setLoading(true);
                                        try {
                                            const result = await deleteProduct(product.idproduct, product.idsubcategory);
                                            Alert.alert("Success", result.message);
                                            navigation.goBack();
                                        } catch (error) {
                                            Alert.alert("Error", error.message);
                                        } finally {
                                            setLoading(false);
                                        }
                                    },
                                },
                                {
                                    text: "No",
                                },
                            ]);
                        }}>
                            <Text style={styles.buttonText}>Delete Product</Text>
                        </TouchableOpacity>
                    </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E3EED4",
    },
    formContainer: {
        margin: 25,
        borderRadius: 10,
        padding: 20,
        backgroundColor: "#C4D559",
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: "bold",
    },
    input: {
        backgroundColor: "#fff",
        padding: 5,
        height: 43,
        borderRadius: 5,
        marginBottom: 10,
    },

    button: {
        backgroundColor: "#0a53c2",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    ButtonDelete: {
        backgroundColor: "#c90606",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 10,
    },
    ButtonCancel: {
        backgroundColor: "#f0e21d",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 10,
    },
});

export default EditProduct;
    
