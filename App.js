import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { checkLoginStatus } from "./src/components/backEnd";

import AdminScreen from "./src/Adminscreens/adminScreen";
import ProductScreen from "./src/Adminscreens/productScreen";
import AddProductScreen from "./src/Adminscreens/addProductScreen";
import EditProduct from "./src/Adminscreens/editProduct";
import HomeScreen from "./src/Userscreens/userScreen";
import TransactionScreen from "./src/Userscreens/transaksiScreen";
import ProductList from "./src/Userscreens/productList";
import PayScreen from "./src/Userscreens/payScreen";
import SignupScreen from "./src/logscreens/signupScreen";
import LoginScreen from "./src/logscreens/loginScreen";
import AddCategoryScreen from "./src/Adminscreens/addCategoryScreen";
import AddSubCategoryScreen from "./src/Adminscreens/addSubCategoryScreen";
import TopupScreen from "./src/Userscreens/topupScreen";
import VerifTopup from "./src/Userscreens/verifTopup";
import AdminVerif from "./src/Adminscreens/adminVerif";
import MemberScreen from "./src/Adminscreens/memberScreen";
import AdminTransaction from "./src/Adminscreens/adminTransaction";
import ProfileLayout from "./src/Userscreens/profile";
import ProfileAdmin from "./src/Adminscreens/profilAdmin";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const result = await checkLoginStatus();
        setIsLoggedIn(result.success);
        setIsAdmin(result.role === "admin");
      } catch (error) {
        console.error("Error checking login status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkStatus();
  }, []);

  const handleCheck = async () => {
    try {
      const result = await checkLoginStatus();
      setIsLoggedIn(result.success);
      setIsAdmin(result.role === "admin");
    } catch (error) {
      console.error("Error checking login status:", error);
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  const UserTabs = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Transaksi") {
            iconName = focused ? "cash" : "cash-outline";
          } else if (route.name === "Profil") {
            iconName = focused ? "person" : "person-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007BFF",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { paddingBottom: 5, height: 60 },
      })}
    >
      <Tab.Screen
        name="Home"
        options={{ headerShown: false }}
        component={HomeScreen}
      />
      <Tab.Screen
        name="Transaksi"
        component={TransactionScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="ProfilLayout"
        options={{ headerShown: false }}
        children={(props) => <ProfileLayout {...props} onLogout={handleCheck} />}
      />
    </Tab.Navigator>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          isAdmin ? (
            <>
              <Stack.Screen name="AdminHome" options={{ headerShown: false }}>
                {(props) => <AdminScreen {...props} onLogout={handleCheck} />}
              </Stack.Screen>
              <Stack.Screen
                name="ProductScreen"
                component={ProductScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="EditProduct"
                component={EditProduct}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="AddProductScreen"
                component={AddProductScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="AddCategoryScreen"
                component={AddCategoryScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="AddSubCategoryScreen"
                component={AddSubCategoryScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="AdminTransaction"
                component={AdminTransaction}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Adminverif"
                component={AdminVerif}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="MemberScreen"
                component={MemberScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="ProfileAdmin"
                component={ProfileAdmin}
                options={{headerShown: false}}
              />              
              <Stack.Screen name="UserTabs" options={{ headerShown: false }} component={UserTabs} />
              <Stack.Screen
                name="ProductList"
                component={ProductList}
                options={{ headerShown: false }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="UserTabs"
                component={UserTabs}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ProductList"
                component={ProductList}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="PayScreen"
                component={PayScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="TopupScreen"
                component={TopupScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="VerifTopup"
                component={VerifTopup}
                options={{headerShown: false}}
              />
            </>
          )
        ) : (
          <>
            <Stack.Screen name="LoginScreen" options={{ headerShown: false }}>
              {(props) => <LoginScreen {...props} onLogin={handleCheck} />}
            </Stack.Screen>
            <Stack.Screen
              name="SignupScreen"
              component={SignupScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E6F5D0",
  },
});

export default App;
