import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Modal,
} from "react-native";
import { addProduct } from "../components/productEnd";

const AddProductScreen = ({ navigation }) => {
  const [Idproduct, setIdproduct] = useState("");
  const [Idcategory, setIdcategory] = useState("");
  const [Name, setName] = useState("");
  const [Price, setPrice] = useState("");
  const [Description, setDescription] = useState("");
  const [Loading, setLoading] = useState(false);

  const handleAddProduct = async () => {
    if (
      Idproduct.trim() === "" ||
      Idcategory.trim() === "" ||
      Name.trim() === "" ||
      Price.trim() === "" ||
      Description.trim() === ""
    ) {
      Alert.alert("Error", "Semua bidang harus diisi.");
      return;
    } else {
      setLoading(true);
      const Create_at = new Date().toLocaleString();
      const Update_at = Create_at;
      try {
        const result = await addProduct(Idproduct, Idcategory, Name, Price, Description, Create_at, Update_at);
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
          <Text style={styles.infoTitle}>Informasi Produk</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nama Barang</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Nama Barang"
              value={Name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Harga</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Harga"
              keyboardType="numeric"
              value={Price}
              onChangeText={setPrice}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Kategori</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Kategori"
              value={Idcategory}
              onChangeText={setIdcategory}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Kode Produk</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Kode Produk"
              value={Idproduct}
              onChangeText={setIdproduct}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Deskripsi</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Deskripsi"
              value={Description}
              onChangeText={setDescription}
            />
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleAddProduct}>
            <Text style={styles.submitBtnText}>Tambahkan</Text>
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
  header: {
    height: 133,
    backgroundColor: "#E3EED4",
    position: "relative",
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 3,
    elevation: 5,
    zIndex: 1,
  },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    padding: 60,
    gap: 10,
    marginLeft: -20,
  },
  backArrow: {
    width: 32, // Memperbesar ukuran logo
    height: 32,
    marginLeft: -10, // Menggeser logo lebih ke kiri
  },
  title: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 15,
    color: "#000000",
  },
  headerDesign: {
    position: "absolute",
    top: 1,
    right: 20,
    width: 100,
    height: 200,
  },
  content: {
    marginTop: 50,
    paddingHorizontal: 20,
  },
  infoCard: {
    backgroundColor: "#C4D559",
    borderRadius: 8,
    padding: 20,
    width: "100%",
  },
  infoTitle: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 20,
    color: "#000000",
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: 13,
    color: "#000000",
    marginBottom: 8,
  },
  inputField: {
    width: "100%",
    height: 43,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontFamily: "Inter",
    fontSize: 16,
    color: "#000000",
  },
  submitBtn: {
    backgroundColor: "#4285F4",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 10,
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default AddProductScreen;