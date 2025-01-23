import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { MaterialIcons, FontAwesome, Ionicons, Entypo, AntDesign } from "@expo/vector-icons";
import { getUserid } from "../components/userEnd";
import { logoutUser } from "../components/backEnd";


const ProfileLayout = ({ onLogout,navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await getUserid();
        if (result.success) {
          setUserData(result.data);
        } else {
          Alert.alert("Error", "Gagal mengambil data user.");
        }
      } catch (error) {
        Alert.alert("Error", "Terjadi kesalahan: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    Alert.alert("Konfirmasi", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      { text: "Keluar", onPress: async () => {
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
      } }, 
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#375534" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundWrapper}>
        <ProfileHeader style={styles.header} userData={userData} />
      </View>
      <StatusBar style={styles.statusBar} userData={userData} />
      <View style={styles.navWrapper}>
        <NavigationButtons navigation={navigation} style={styles.navigation} handleLogout={handleLogout} />
      </View>
    </SafeAreaView>
  );
};

const ProfileHeader = ({ style, userData }) => {
  return (
    <View style={{ ...styles.headerContainer, ...style }}>
      <View style={styles.profileSection}>
        <View style={styles.initialCircle}>
          <Text style={styles.initial}>{userData?.name?.charAt(0).toUpperCase() || "?"}</Text>
        </View>
        <Text style={styles.name}>{userData?.name || "Nama Tidak Diketahui"}</Text>
      </View>
    </View>
  );
};

const StatusBar = ({ style, userData }) => {
  return (
    <View style={{ ...styles.statusBarContainer, ...style }}>
      <View style={styles.statusContainer}>
        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>Balance</Text>
          <Text style={styles.statusValue}>{userData?.balance || 0}</Text>
        </View>
        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>Email</Text>
          <Text style={styles.statusValue}>{userData?.email || "Tidak Ada"}</Text>
        </View>
      </View>
    </View>
  );
};

const NavigationButtons = ({ navigation, style, handleLogout }) => {
  const buttons = [
    {
      icon: <FontAwesome name="user" size={24} color="white" />,
      text: "Profile Saya",
      onPress: () => navigation.navigate("ProfileSaya"),
    },
    { icon: <MaterialIcons name="history" size={24} color="white" />, text: "Riwayat Saldo & TopUp" },
    { icon: <Ionicons name="settings-sharp" size={24} color="white" />, text: "Pengaturan" },
    { icon: <Entypo name="lock" size={24} color="white" />, text: "Privacy & Policy" },
    { icon: <AntDesign name="infocirlce" size={24} color="white" />, text: "About" },
  ];

  return (
    <View style={{ ...styles.navButtons, ...style }}>
      {buttons.map((button, index) => (
        <TouchableOpacity
          key={index}
          style={styles.navButton}
          onPress={button.onPress ? button.onPress : null}
        >
          <View style={styles.buttonContent}>
            {button.icon}
            <Text style={styles.buttonText}>{button.text}</Text>
          </View>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3eed4",
    alignItems: "center",
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e3eed4",
  },
  backgroundWrapper: {
    width: "100%",
    backgroundColor: "#c4d559",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: "center",
    paddingBottom: 20,
  },
  navWrapper: {
    width: "100%",
    backgroundColor: "#c4d559",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderRadius: 20,
    paddingTop: 20,
    alignItems: "center",
    paddingBottom: 20,
  },
  headerContainer: {
    alignItems: "center",
  },
  profileSection: {
    alignItems: "center",
    marginTop: 20,
  },
  initialCircle: {
    width: 80,
    height: 80,
    backgroundColor: "#375534",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  initial: {
    color: "#ffffff",
    fontSize: 36,
    fontWeight: "bold",
  },
  name: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#000000",
    marginTop: 10,
  },
  statusBarContainer: {
    width: "90%",
    marginTop: -10,
    zIndex: 1,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#375534",
    padding: 15,
    borderRadius: 20,
  },
  statusItem: {
    alignItems: "center",
  },
  statusLabel: {
    color: "#ffffff",
    fontSize: 14,
  },
  statusValue: {
    color: "#ffffff",
    fontSize: 16,
  },
  navButtons: {
    width: "100%",
    paddingHorizontal: 20,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#375534",
    padding: 15,
    marginBottom: 10,
    borderRadius: 20,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: "red",
    padding: 15,
    marginTop: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  logoutText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileLayout;
