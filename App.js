import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicator, View, StyleSheet, Alert } from "react-native";
import { checkLoginStatus} from "./src/components/backEnd";

import AdminScreen from "./src/Adminscreens/adminScreen";
import ProductScreen from "./src/Adminscreens/productScreen";
import AddProductScreen from "./src/Adminscreens/addProductScreen";
import UserScreen from "./src/Userscreens/userScreen";
import SignupScreen from "./src/logscreens/signupScreen";
import LoginScreen from "./src/logscreens/loginScreen";
import AddCategoryScreen from "./src/Adminscreens/addCategoryScreen";
import AddSubCategoryScreen from "./src/Adminscreens/addSubCategoryScreen";

const Stack = createStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setisAdmin] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const result = await checkLoginStatus();
        setIsLoggedIn(result.success);
        setisAdmin(result.role === "admin");
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };
    checkStatus();
  }, []);

const handleCheck = async () => {
    try {
        const result = await checkLoginStatus();
        if (result.success) {
          setIsLoggedIn(result.success);
          setisAdmin(result.role === "admin");
        }else{
          setIsLoggedIn(false);
          setisAdmin(false);
        };
    } catch (error) {
      console.error("Error checking login status:", error);
    }
};

  if (isLoggedIn === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          isAdmin ? (
            <>
              <Stack.Screen name="AdminHome" options={{ headerShown: false }}> 
                {props => <AdminScreen {...props} onLogout={handleCheck} />}
              </Stack.Screen>
              <Stack.Screen 
                name="ProductScreen" 
                component={ProductScreen} 
                options={{ headerShown: false}}
              />
              <Stack.Screen 
                name="AddProductScreen" 
                component={AddProductScreen} 
                options={{ headerShown: false}}
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
            </>
          ) : (
            <>
              <Stack.Screen name="Userhome" options={{ headerShown: false }}>
                {props => <UserScreen {...props} onLogout={handleCheck} />}
              </Stack.Screen>
            </>
          )
        ) : (
          <>
            <Stack.Screen name="LoginScreen" options={{ headerShown: false }}>
              {props => <LoginScreen {...props} onLogin={handleCheck} />}
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
