import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Modal
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RNPickerSelect from "react-native-picker-select";
import { signupUser } from "../components/backEnd"; 

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState(new Date());
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (
      username.trim() === "" ||
      phoneNumber.trim() === "" ||
      email.trim() === "" ||
      date.trim() === "" ||
      gender.trim() === "" ||
      password.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      Alert.alert("Error", "Semua bidang harus diisi.");
      return;
    } else if (!validateEmail(email)) {
      Alert.alert("Error", "Email tidak valid.");
      return;
    } else if (password !== confirmPassword) {
      Alert.alert("Error", "Password dan konfirmasi password tidak cocok.");
      return;
    } else {
        setLoading(true);
        const create_at = new Date().toLocaleString();
        const update_at = create_at;
        const role = "user";
        const balance = 0;
              
        try {
          const result = await signupUser(username, phoneNumber, email, password, date, gender, role, balance, create_at, update_at);
          
          if (result.success) {
            setLoading(false);
            Alert.alert("Success", result.message);
            navigation.navigate("LoginScreen");
          } else {
            setLoading(false);
            Alert.alert("Error", result.message);
          }
        } catch (error) {
          setLoading(false);
          Alert.alert("Error", "An unexpected error occurred. Please try again.");
          console.error("Signup error:", error);
        }
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <Modal visible={loading} transparent={true}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      </Modal>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <Image
              source={require("../../assets/logo.png")}
              style={styles.logo}
            />

            <Text style={styles.title}>Register</Text>

            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukan Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />

            <Text style={styles.label}>Nomor HP</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukan Nomor HP"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukan Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Tanggal Lahir</Text>
            <TextInput
              style={styles.input}
              placeholder="Tanggal Lahir"
              onChangeText={setDate}
              autoCapitalize="none"
            />

            <Text style={styles.label}>Jenis Kelamin</Text>
            <RNPickerSelect
              onValueChange={(value) => setGender(value)}
              items={[
                { label: "Pria", value: "pria" },
                { label: "Wanita", value: "wanita" },
              ]}
              style={pickerStyles}
              placeholder={{ label: "Pilih Jenis Kelamin", value: null }}
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Masukan Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Icon name={showPassword ? "eye-off" : "eye"} size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Konfirmasi Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Masukan kembali Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Icon name={showConfirmPassword ? "eye-off" : "eye"} size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <View style={styles.footer}>
              <Text>Sudah memiliki akun? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
                <Text style={styles.link}>Masuk</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={handleRegister}
              style={styles.registerButton}
            >
              <Text style={styles.registerButtonText}>Daftar</Text>
            </TouchableOpacity>

            
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
    marginBottom: 20,
  },
});

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 50,
    marginTop: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    fontFamily: "Poppins-Bold",
  },
  label: {
    alignSelf: "flex-start",
    marginBottom: 5,
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    fontFamily: "Poppins-Regular",
  },
  inputContainer: {
    width: "100%",
    position: "relative",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 12,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    fontFamily: "Poppins-Regular",
    marginBottom: 20,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 12,
  },
  registerButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
  },
  footer: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "center",
  },
  link: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default SignupScreen;
