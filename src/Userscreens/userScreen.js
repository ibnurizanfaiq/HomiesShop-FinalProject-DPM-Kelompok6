import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Button
} from "react-native";
import { getSubCategories, getCategories } from "../components/productEnd";
import { logoutUser } from "../components/backEnd";

const HomeScreen = ({onLogout, navigation}) => {
  const [categories, setCategories] = useState({});
  const [subCategories, setSubCategories] = useState({});


  const handleLogout = async () => {
    try {
      const result = await logoutUser();
      if (result.success) {
        onLogout();
      } else {
        console.warn(result?.message || "Invalid response format");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getCategories();
        if (result.success) {
          setCategories(result.data);
        } else {
          console.warn(result?.message || "Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchSubCategories = async () => {
      try {
        const result = await getSubCategories();
        if (result.success) {
          setSubCategories(result.data);
        } else {
          console.warn(result?.message || "Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchCategories();
    fetchSubCategories();
  }, []);

  const handleSubCategoryPress = (subCategoryId) => {
    navigation.navigate("ProductList", { subCategoryId });
  };



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {Object.entries(categories).map(([categoryId, categoryData]) => (
          <View key={categoryId} style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{categoryData.name}</Text>
            <View style={styles.subCategoriesWrapper}>
              {Object.entries(subCategories[categoryId] || {}).map(
                ([subCategoryId, subCategoryData]) => (
                  <TouchableOpacity
                    key={subCategoryId}
                    style={styles.subCategoryContainer}
                    onPress={() => handleSubCategoryPress(subCategoryId)}
                  >
                    <Image
                      source={{ uri: subCategoryData.image }}
                      style={styles.subCategoryImage}
                    />
                    <Text style={styles.subCategoryName}>
                      {subCategoryData.name}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>
        ))}
      </ScrollView>
      <Button title="Logout" onPress={handleLogout} />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  categoryContainer: {
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subCategoriesWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  subCategoryContainer: {
    width: "30%",
    marginBottom: 10,
    alignItems: "center",
  },
  subCategoryImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
  subCategoryName: {
    fontSize: 14,
    textAlign: "center",
  },
});

export default HomeScreen;
