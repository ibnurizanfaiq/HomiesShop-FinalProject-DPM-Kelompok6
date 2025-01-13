import React from 'react';
import { SafeAreaView, Text, StyleSheet, Button, Alert } from 'react-native';
import { logoutUser } from '../components/backEnd';


const UserScreen = ({onLogout}) => {

  const handleLogout = async () =>{
    try {
         const result = await logoutUser();
         if (result.success) {
           Alert.alert(result.message);
           onLogout();
         } else {
           Alert.alert("Logout gagal", "Terjadi kesalahan saat logout.");
         }
       } catch (error) {
         Alert.alert("Error", "Terjadi kesalahan: " + error.message);
       }
     };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Ini adalah Home user</Text>
      <Button title='Logout' onPress={handleLogout}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default UserScreen;
