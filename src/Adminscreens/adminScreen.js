import React from "react";
import { SafeAreaView, View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { logoutUser } from "../components/backEnd";

const AdminScreen = ({onLogout, navigation}) => {

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
    navigation.navigate('ProductScreen')

  };

  const handleTransaction = () => {

  };

  const handleMember = () => {
    
  };

  const handleProfile = () => {
    
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Image
          source={{ uri: 'https://dashboard.codeparrot.ai/api/assets/Z3yn7kjX1HzWCCoB' }}
          style={styles.headerBg}
        />
        <Image
          source={{ uri: 'https://dashboard.codeparrot.ai/api/assets/Z3yn7kjX1HzWCCoC' }}
          style={styles.logoLeft}
        />
        <Text style={styles.adminTitle}></Text>

        <View style={styles.mainContent}>
          <Image
            source={{ uri: 'https://dashboard.codeparrot.ai/api/assets/Z3yn7kjX1HzWCCoE' }}
            style={styles.mainBg}
          />

          <View style={styles.gridContainer}>
            <TouchableOpacity style={styles.gridItem} onPress={handleProduct}>
              <Image
                source={{ uri: 'https://dashboard.codeparrot.ai/api/assets/Z3yn7kjX1HzWCCoF' }}
                style={styles.gridItemBg}
              />
              <Text style={styles.gridText}>Produk</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gridItem} onPress={handleTransaction}>
              <Image
                source={{ uri: 'https://dashboard.codeparrot.ai/api/assets/Z3yn70jX1HzWCCoG' }}
                style={styles.gridItemBg}
              />
              <Text style={styles.gridText}>Transaksi</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gridItem} onPress={handleMember}>
              <Image
                source={{ uri: 'https://dashboard.codeparrot.ai/api/assets/Z3yn70jX1HzWCCoH' }}
                style={styles.gridItemBg}
              />
              <Text style={styles.gridText}>Member</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gridItem} onPress={handleProfile}>
              <Image
                source={{ uri: 'https://dashboard.codeparrot.ai/api/assets/Z3yn70jX1HzWCCoI' }}
                style={styles.gridItemBg}
              />
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
            <Image
              source={{ uri: 'https://dashboard.codeparrot.ai/api/assets/Z3yn70jX1HzWCCoJ' }}
              style={styles.logoutBg}
            />
            <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3eed4',
    alignItems: 'center',
  },
  headerBg: {
    width: 430,
    height: 143,
    position: 'absolute',
    top: 0,
  },
  logoLeft: {
    width: 118,
    height: 196,
    position: 'absolute',
    top: 2,
    left: 0,
  },
  logoRight: {
    width: 118,
    height: 196,
    position: 'absolute',
    top: 2,
    right: 0,
  },
  adminTitle: {
    marginTop: 72,
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '800',
    color: '#000000',
  },
  mainContent: {
    marginTop: 60,
    width: 379,
    height: 474,
    position: 'relative',
  },
  mainBg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderRadius: 6,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 20,
    marginTop: 30,
  },
  gridItem: {
    width: 155,
    height: 164,
    marginBottom: 48,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gridItemBg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderRadius: 6,
  },
  gridText: {
    fontFamily: 'Aclonica',
    fontSize: 20,
    color: '#FFFFFF',
    zIndex: 1,
  },
  logoutButton: {
    width: 146,
    height: 40,
    marginTop: 40,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutBg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderRadius: 10,
  },
  logoutText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    zIndex: 1,
  }
});

export default AdminScreen;
