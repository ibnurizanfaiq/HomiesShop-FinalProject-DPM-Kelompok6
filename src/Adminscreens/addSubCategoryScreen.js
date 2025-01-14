import React, {useState} from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, Modal } from "react-native";
import { addSubCategories } from "../components/productEnd";

const AddSubCategoryScreen = ({navigation}) => {
    const [Idcategory, setIdcategory] = useState("");
    const [Idsub, setIdsub] = useState("");
    const [Name, setName] = useState("");
    const [Loading, setLoading] = useState(false);

    const handleSubCategories = async () => {
        if (Idcategory.trim() === "" || Idsub.trim() === "" || Name.trim() === "") {
            Alert.alert("Error", "Semua bidang harus diisi.");
            return;
        } else {
            setLoading(true);
            const Create_at = new Date().toLocaleString();
            const Update_at = Create_at;
            try {
                const result = await addSubCategories(Idcategory, Idsub, Name, Create_at, Update_at);
                Alert.alert("Sukses", result.message);
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
            <Modal visible={Loading} transparent={true}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007BFF" />
                </View>
            </Modal>
            <View style={styles.content}>
                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>Informasi Sub Kategori</Text>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>ID Kategori</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Masukkan ID Kategori"
                            value={Idcategory}
                            onChangeText={(value) => setIdcategory(value)}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>ID Sub Kategori</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Masukkan ID Sub Kategori"
                            value={Idsub}
                            onChangeText={(value) => setIdsub(value)}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Nama Sub Kategori</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Masukkan Nama Sub Kategori"
                            value={Name}
                            onChangeText={(value) => setName(value)}
                        />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleSubCategories}>
                        <Text style={styles.buttonText}>Tambah Sub Kategori</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f0f0",
    },
    content: {
        flex: 1,
        padding: 20,
    },
    infoCard: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    formGroup: {
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
        padding: 10,
    },
    button: {
        backgroundColor: "#007BFF",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
});

export default AddSubCategoryScreen;