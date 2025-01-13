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
  Modal 
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
    } else{
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
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal visible={Loading} transparent={true}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      </Modal>
      <Text style={styles.title}>Tambah Produk</Text>
      
      <TextInput
        style={styles.input}
        placeholder="ID Produk"
        value={Idproduct}
        onChangeText={setIdproduct}
      />
      <TextInput
        style={styles.input}
        placeholder="ID Kategori"
        value={Idcategory}
        onChangeText={setIdcategory}
      />
      <TextInput
        style={styles.input}
        placeholder="Nama Produk"
        value={Name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Harga"
        keyboardType="numeric"
        value={Price}
        onChangeText={setPrice}
      />
      <TextInput
        style={styles.input}
        placeholder="Deskripsi"
        value={Description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
        <Text style={styles.buttonText}>Tambah Produk</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 5,
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#007BFF",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default AddProductScreen;
