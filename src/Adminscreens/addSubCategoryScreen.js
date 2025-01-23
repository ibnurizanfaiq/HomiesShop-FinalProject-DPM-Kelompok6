import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, Modal, ScrollView, RefreshControl } from "react-native";
import { addSubCategories, getCategories } from "../components/productEnd";
import RNPickerSelect from "react-native-picker-select";

const AddSubCategoryScreen = ({ navigation }) => {
  const [Idcategory, setIdcategory] = useState("");
  const [Idsub, setIdsub] = useState("");
  const [Name, setName] = useState("");
  const [link, setlink] = useState("");
  const [Loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSubCategories = async () => {
    if (Idcategory.trim() === "" || Idsub.trim() === "" || Name.trim() === "") {
      Alert.alert("Error", "Semua bidang harus diisi.");
      return;
    } else {
      setLoading(true);
      const Create_at = new Date().toLocaleString();
      const Update_at = Create_at;
      try {
        const result = await addSubCategories(Idsub, Idcategory, Name, link, Create_at, Update_at);
        Alert.alert("Sukses", result.message);
        navigation.goBack();
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const result = await getCategories();
      if (result.success) {
        const categoryArray = Object.keys(result.data).map(key => ({
          idcategory: key,
          ...result.data[key],
        }));
        setCategories(categoryArray);
      } else {
        console.warn(result?.message || "Invalid response format");
        Alert.alert("Kesalahan", result?.message || "Gagal memuat kategori.");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      Alert.alert("Kesalahan", "Terjadi kesalahan saat mengambil data kategori.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchCategories();
    setIsRefreshing(false);
  };

  const handleAddCategory = () => {
    navigation.navigate("AddCategoryScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal visible={Loading} transparent={true}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      </Modal>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Informasi Sub Kategori</Text>

          <View style={styles.formGroupRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>ID Kategori</Text>
              <RNPickerSelect
                onValueChange={(value) => setIdcategory(value)}
                items={categories.map((category) => ({
                  label: category.name,
                  value: category.idcategory,
                }))}
                style={pickerStyles}
                placeholder={{ label: "Pilih Category", value: null }}
              />
            </View>
            <TouchableOpacity onPress={handleAddCategory} style={styles.addCategoryBtn}>
              <Text style={styles.addCategoryBtnText}>+</Text>
            </TouchableOpacity>
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
              placeholder="Masukkan Nama SubKategori"
              value={Name}
              onChangeText={(value) => setName(value)}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Link Direct Gambar</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan Link Direct Gambar"
              value={link}
              onChangeText={(value) => setlink(value)}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubCategories}>
            <Text style={styles.buttonText}>Tambah Sub Kategori</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const pickerStyles = StyleSheet.create({
  inputIOS: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  inputAndroid: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3EED4",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    backgroundColor: "#C4D559",
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
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#375534",
    padding: 8,
    borderRadius: 10,
    height: 43,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  addCategoryBtn: {
    backgroundColor: "#375534",
    width: 50,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    marginTop: 25,
  },
  addCategoryBtnText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  formGroupRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
});

export default AddSubCategoryScreen;
