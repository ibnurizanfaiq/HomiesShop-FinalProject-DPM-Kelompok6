import React, { useState, useEffect} from "react";
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { getSaldoUser } from "../components/userEnd";
import { payload } from "../config/digiflazz"; 
import { buyProduct } from "../components/orderProces";
import { addOrder } from "../components/orderEnd";

const PayScreen = ({ route, navigation }) => {
    const product = route.params.product;
    const images = route.params.images;
    const notujuan = route.params.noTujuan;
    const [selectedPayment, setSelectedPayment] = useState('saldo');
    const [saldo, setSaldo] = useState();

    useEffect(() => {
        const fetchSaldo = async () => {
            try {
                const result = await getSaldoUser();
                if (result.success) {
                    setSaldo(result.saldo);
                }
            } catch (error) {
                console.log("error")
            }
        };
        fetchSaldo();
    },[]);

    const handlePay = async () => {
        try {
            const Payload = payload(product.idproduct, notujuan);
            if (Payload.success) {
                const buy = await buyProduct(Payload.data);
                if (buy.success) {
                    const Addorder = await addOrder(
                        product.name,
                        buy.data.ref_id,
                        buy.data.noCus,
                        buy.data.idproduct,
                        buy.data.Status,
                        buy.data.pesan,
                        buy.data.sn,
                        Payload.data.sign,
                        product.price
                    );
                    if (Addorder.success) {
                        Alert.alert("Success", Addorder.message);
                        navigation.navigate("UserTabs");
                    } else {
                        Alert.alert("Gagal", Addorder.message);
                    }
                } else {
                    Alert.alert("Error", buy.message);
                }
            } else {
                console.log("Payload gagal");
            }
        } catch (error) {
            Alert.alert("Error", "dibagian catch")
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.paymentcontainer}>
                <Text style={styles.productName}>Pilih Pembayaran</Text>
                <TouchableOpacity
                    style={styles.paymentOption}
                    onPress={() => setSelectedPayment('saldo')}
                >
                    <View style={styles.radio}>
                        {selectedPayment === "saldo" && <View style={styles.radioSelected} />}
                    </View>
                    <View>
                        <Text style={styles.paymentText}>Saldo balance</Text>
                        <Text style={styles.balanceText}>Saldo balance anda sebesar Rp{saldo}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.paymentOption}
                    onPress={() => setSelectedPayment("bank")}
                >
                    <View style={styles.radio}>
                        {selectedPayment === "bank" && <View style={styles.radioSelected} />}
                    </View>
                    <Text style={styles.paymentText}>Transfer Bank</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.productContainer}>
                <Text style={styles.productName}>{product.name}</Text>
                <View style={styles.productContent}>
                    <Image source={{ uri: images }} style={styles.image} />
                    <View style={styles.productDetail}>
                        <Text style={styles.productPrice}>Rp {product.price}</Text>
                        <Text style={styles.productDescrip}>{product.description}</Text>
                        <Text style={styles.noCus}>{notujuan}</Text>

                    </View>
                </View>
            </View>
            <View style={styles.bayar}>
                <View style={styles.totalc}>
                    <Text style={styles.total}>Total Belanja</Text>
                    <Text style={styles.totalP}>Rp {product.price}</Text>
                </View>
                <TouchableOpacity style={styles.button} onPress={handlePay}>
                    <Text style={styles.buttonText}>Bayar</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E3EED4",
    },
    header: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        backgroundColor: "grey",
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    paymentcontainer: {
        backgroundColor: "#fff",
        borderRadius: 20,
        margin: 10,
        padding: 20,
    },
    paymentOption: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "red",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    radioSelected: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "red",
    },
    paymentText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    balanceText: {
        fontSize: 14,
        color: "green",
    },
    productContainer: {
        backgroundColor: "white",
        borderRadius: 20,
        margin: 10,
        padding: 20,
    },
    productContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 15,
    },
    productDetail: {
        flex: 1,
    },
    productName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    noCus: {
        fontSize: 18,
        fontWeight: "500",
        marginBottom: 10,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: "red",
        marginBottom: 5,
    },
    productDescrip: {
        fontSize: 15,
        color: "#000",
    },
    bayar:{
        flex: 1,
        flexDirection: "row",
        position: "absolute",
        backgroundColor: "#B9D89C",
        bottom: 20,
        left: 1,
        right: 1,
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: "#CCCCCC", 
    },
    button: {
        backgroundColor: "#435334",
        borderRadius: 8,
        width: 150,
        height: 60,
        padding: 15,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 18,
    },
    totalc:{
        marginRight: 200,
        margin: 10
    },
    total: {
        fontSize: 15,
        color: "#000",
    },
    totalP: {
        fontSize: 15,
        color: "red",
    }
});

export default PayScreen;