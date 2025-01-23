import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { getSubCategories, getCategories } from "../components/productEnd";
import { getSaldoUser, getUserid } from "../components/userEnd";

const HomeScreen = ({ navigation }) => {
  const [categories, setCategories] = useState({});
  const [subCategories, setSubCategories] = useState({});
  const [saldo, setSaldo] = useState(0);
  const [username, setUsername] = useState(""); 
  const [refreshing, setRefreshing] = useState(false);


  const fetchSaldo = async () => {
    try {
      const result = await getSaldoUser();
      if (result.success) {
        setSaldo(result.saldo);
      }
    } catch (error) {
      console.error("Error fetching saldo:", error);
    }
  };

  const fetchUsername = async () => {
    try {
      const result = await getUserid();
      if (result.success) {
        setUsername(result.data.name || "User"); 
      }
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };

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
        const validData = {};
        Object.entries(result.data).forEach(([categoryId, subCategoryList]) => {
          validData[categoryId] = Object.entries(subCategoryList).reduce(
            (acc, [subCategoryId, subCategoryData]) => {
              acc[subCategoryId] = {
                ...subCategoryData,
                image: typeof subCategoryData.image === "string" ? subCategoryData.image : "",
              };
              return acc;
            },
            {}
          );
        });
        setSubCategories(validData);
      } else {
        console.warn(result?.message || "Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };
  

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchSaldo(), fetchCategories(), fetchSubCategories(), fetchUsername()]);
    } catch (error) {
      console.error("Error during refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  const handleSubCategoryPress = (idcategory, subCategoryId) => {
    navigation.navigate("ProductList", { idcategory, subCategoryId });
  };

  const handleTopup = () => {
    navigation.navigate("TopupScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundWrapper}>
        <View style={styles.headerContainer}>
          <Image source={require("../../assets/logo.png")} style={styles.logo} />
          <Text style={styles.appName}>Homies Shop</Text>
          <Text style={styles.username}>{username}</Text>
        </View>

        <View style={styles.balanceContainer}>
          <TouchableOpacity style={styles.balanceSection}>
            <Text style={styles.balanceLabel}>Saldo</Text>
            <Text style={styles.balanceAmount}>Rp.{saldo.toLocaleString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.topUpSection} onPress={handleTopup}>
            <Text style={styles.topUpText}>Top Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {Object.entries(categories).map(([categoryId, categoryData]) => (
          <View key={categoryId} style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{categoryData.name}</Text>
            <View style={styles.subCategoriesWrapper}>
              {Object.entries(subCategories[categoryId] || {}).map(
                ([subCategoryId, subCategoryData]) => (
                  <TouchableOpacity
                    key={subCategoryId}
                    style={[styles.subCategoryItem, styles.subCategoryItemContainer]}
                    onPress={() => handleSubCategoryPress(categoryId, subCategoryId)}
                  >
                    <View style={styles.subCategoryItemContainerBackground}>
                      <Image
                        source={{
                          uri: typeof subCategoryData.image === "string" ? subCategoryData.image : "",
                        }}
                        style={styles.subCategoryImage}
                        onError={(error) => console.log("Image load error:", error)}
                      />
                      <Text style={styles.subCategoryName}>
                        {subCategoryData.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3EED4",
  },
  backgroundWrapper: {
    width: "100%",
    backgroundColor: "#556B2F",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: "center",
    paddingBottom: 20,
    marginBottom: 15,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    marginVertical: 15,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  appName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    flex: 1,
    textAlign: "left",
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  balanceContainer: {
    flexDirection: "row",
    backgroundColor: "#8B9D77",
    borderRadius: 25,
    overflow: "hidden",
    width: "90%",
    height: 70,
    padding: 5,
  },
  balanceSection: {
    flex: 1,
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#E3EED4",
  },
  balanceLabel: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,

  },
  balanceAmount: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    marginBottom: 10,
  },
  topUpSection: {
    flex: 1,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  topUpText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  categoryContainer: {
    margin: 10,
    paddingHorizontal: 15,
    backgroundColor: "#8B9D77",
    borderRadius: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 10,
    marginLeft: 15,
  },
  subCategoriesWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  subCategoryItem: {
    width: "48%",
    marginBottom: 15,
    alignItems: "center",
  },
  subCategoryItemContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 5,
    margin: 5,
    width: 100,
    height: 137,
  },
  subCategoryItemContainerBackground: {
    backgroundColor: "#FFFFF",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  subCategoryImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 5,
  },
  subCategoryName: {
    fontSize: 14,
    textAlign: "center",
  },
});

export default HomeScreen;
