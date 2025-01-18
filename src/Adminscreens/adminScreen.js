import React from "react";
import { SafeAreaView, View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { logoutUser } from "../components/backEnd";
import { FontAwesome5, MaterialIcons, Entypo, Feather } from "@expo/vector-icons";

const AdminScreen = ({ onLogout, navigation }) => {
  const handleLogout = async () => {
    try {
      const result = await logoutUser();
      if (result.success) {
        Alert.alert(result.message, "Thank you for using our app.");
        onLogout();
      } else {
        Alert.alert("Logout gagal", "Terjadi kesalahan saat logout.");
      }
    } catch (error) {
      Alert.alert("Error", "Terjadi kesalahan: " + error.message);
    }
  };

  const handleProduct = () => {
    navigation.navigate("ProductScreen");
  };

  const handleTransaction = () => {
    navigation.navigate("TransactionScreen");
  };

  const handleMember = () => {
    navigation.navigate("MemberScreen");
  };

  const handleProfile = () => {
    navigation.navigate("ProfileScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Image
          source={{ uri: "https://dashboard.codeparrot.ai/api/assets/Z3yn7kjX1HzWCCoB" }}
          style={styles.headerBg}
        />
        <Image
          source={{ uri: "https://dashboard.codeparrot.ai/api/assets/Z3yn7kjX1HzWCCoC" }}
          style={styles.logoLeft}
        />
        <Text style={styles.adminTitle}>AdminHome</Text>

        <View style={styles.mainContent}>
          <View style={styles.gridContainer}>
            <TouchableOpacity style={styles.gridItem} onPress={handleProduct}>
              <FontAwesome5 name="box" size={48} color="white" />
              <Text style={styles.gridText}>Produk</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gridItem} onPress={handleTransaction}>
              <MaterialIcons name="receipt" size={48} color="white" />
              <Text style={styles.gridText}>Transaksi</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gridItem} onPress={handleMember}>
              <Entypo name="users" size={48} color="white" />
              <Text style={styles.gridText}>Member</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gridItem} onPress={handleProfile}>
              <Feather name="user" size={48} color="white" />
              <Text style={styles.gridText}>Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
          accessibilityLabel="Log out of your account"
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3EED4",
    alignItems: "center",
  },
  headerBg: {
    width: "100%",
    height: 350,
    position: 'absolute',
    top: 0,
    backgroundColor: '#93c47d',
    borderBottomLeftRadius: 200, 
    borderBottomRightRadius: 200, 
    overflow: 'hidden',
  },
  logoLeft: {
    width: 118,
    height: 196,
    position: "absolute",
    justifyContent: "center",
  },
  adminTitle: {
    marginTop: 120,
    fontFamily: "Inter",
    fontSize: 30,
    fontWeight: "bold",
    color: "#000000",
  },
  mainContent: {
    marginTop: 40,
    width: "90%",
    backgroundColor: "#C4D559",
    borderRadius: 15,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  gridItem: {
    width: 120,
    height: 140,
    marginBottom: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#375534",
    borderRadius: 10,
  },
  gridText: {
    fontFamily: "Aclonica",
    fontSize: 16,
    color: "#FFFFFF",
    marginTop: 10,
    textAlign: "center",
  },
  logoutButton: {
    width: 120,
    height: 40,
    marginTop: 40,
    backgroundColor: "#FF5722",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  logoutText: {
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});

export default AdminScreen;
