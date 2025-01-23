import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert } from "react-native";
import { getAllUser, deleteUser } from "../components/userEnd";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const MemberScreen = () => {
  const [users, setUsers] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    setIsRefreshing(true);
    const response = await getAllUser();
    if (response.success) {
      const filteredUsers = Object.values(response.data).filter(user => user.role === "user");
      setUsers(filteredUsers);
    }
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handledelete = async (uid, Name) => {
    const result = await deleteUser(uid);
    if (result.success) {
      Alert.alert("Success", `Success delete User ${Name}`);
      fetchData();
    }
  };

  return (
    <ScrollView 
      style={styles.container} 
      refreshControl={
        <RefreshControl 
          refreshing={isRefreshing} 
          onRefresh={fetchData} 
        />
      }
    >
      {users.map((user, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.profileCircle}>
              <Text style={styles.profileInitial}>{user.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.headerDetails}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.headerLabel}>Detail Member</Text>
            </View>
          </View>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Ionicons name="mail" size={20} color="#ffffff" />
              <Text style={styles.detailText}>{user.email}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="call" size={20} color="#ffffff" />
              <Text style={styles.detailText}>{user.phone}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="transgender" size={20} color="#ffffff" />
              <Text style={styles.detailText}>{user.gender}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={20} color="#ffffff" />
              <Text style={styles.detailText}>{user.create_at}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="wallet" size={20} color="#ffffff" />
              <Text style={styles.detailText}>Balance: {user.balance}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handledelete(user.uid, user.name)}>
            <View style={styles.deleteButtonContent}>
              <MaterialIcons name="delete" size={20} color="#fff" />
              <Text style={styles.deleteButtonText}>Hapus akun member</Text>
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#f9f9f9",
  },
  card: {
    backgroundColor: "#AEC300",
    borderRadius: 15,
    marginBottom: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileCircle: {
    width: 50,
    height: 50,
    backgroundColor: "#375534",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitial: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerDetails: {
    marginLeft: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#375534",
  },
  headerLabel: {
    fontSize: 14,
    color: "#000",
  },
  detailCard: {
    backgroundColor: "#375534",
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    shadowColor: "#AEC300",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,

  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    marginLeft: 8,
    color: "#ffffff",
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: "#A94444",
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  deleteButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default MemberScreen;
