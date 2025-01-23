import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { topupRequest } from '../components/orderEnd';
import { getSaldoUser } from '../components/userEnd';

const TopupScreen = ({ navigation }) => {
  const [saldo, setSaldo] = useState(0);
  const [nominal, setNominal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkTopupStatus = async () => {
      const storedTopup = await AsyncStorage.getItem('activeTopup');
      if (storedTopup) {
        const { expiryTime } = JSON.parse(storedTopup);
        const currentTime = Date.now();

        if (currentTime < expiryTime) {
          const { nominal, berita } = JSON.parse(storedTopup);
          navigation.navigate('VerifTopup', { nominal, berita });
        } else {
          await AsyncStorage.removeItem('activeTopup');
        }
      }
    };

    const fetchSaldo = async () => {
      setLoading(true);
      try {
        const response = await getSaldoUser();
        if (response.success) {
          setSaldo(response.saldo);
        } else {
          setError('Gagal mengambil saldo');
        }
      } catch (err) {
        setError('Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    fetchSaldo();
    checkTopupStatus();
  }, [navigation]);

  const handleTopup = async () => {
    if (nominal < 10000) {
      setError('Minimal topup adalah 10.000');
      Alert.alert('Error', 'Minimal topup adalah 10.000');
      return;
    }
    setError('');
    setLoading(true);

    const randomNominal = modifyNominal(nominal);
    const idtopup = Date.now();

    try {
      const response = await topupRequest(randomNominal, idtopup);

      if (response.success) {
        const expiryTime = Date.now() + 3600000;
        const topupData = {
          nominal: randomNominal,
          berita: idtopup,
          expiryTime,
        };
        await AsyncStorage.setItem('activeTopup', JSON.stringify(topupData));

        Alert.alert('Sukses', 'Topup berhasil');
        navigation.navigate('VerifTopup', { nominal: randomNominal, berita: idtopup });
      } else {
        Alert.alert('Gagal', response.message || 'Gagal melakukan topup');
      }
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan saat melakukan topup');
    } finally {
      setLoading(false);
    }
  };

  const modifyNominal = (nominal) => {
    const randomLastDigits = Math.floor(Math.random() * 1000);
    const modifiedNominal = Math.floor(nominal / 1000) * 1000 + randomLastDigits;
    return modifiedNominal;
  };

  const handleQuickTopup = (amount) => {
    setNominal(amount);
  };

  const formatCurrency = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo Anda</Text>
        <Text style={styles.balanceText}>Rp {formatCurrency(saldo)}</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Nominal Topup</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan nominal topup"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={nominal ? nominal.toString() : ''}
          onChangeText={(value) => setNominal(Number(value))}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      <View style={styles.quickTopupContainer}>
        <Text style={styles.quickTopupLabel}>Nominal Cepat</Text>
        <View style={styles.quickTopupButtons}>
          {[20000, 50000, 100000, 150000, 200000, 250000].map((amount) => (
            <TouchableOpacity
              key={amount}
              style={[
                styles.quickTopupButton,
                nominal === amount && styles.quickTopupButtonActive
              ]}
              onPress={() => handleQuickTopup(amount)}
            >
              <Text style={[
                styles.quickTopupText,
                nominal === amount && styles.quickTopupTextActive
              ]}>
                Rp {formatCurrency(amount)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.topupButton, loading && styles.topupButtonDisabled]}
        onPress={handleTopup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.topupButtonText}>Lakukan Topup</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E3EED4',
  },
  balanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  balanceText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#435334',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#374151',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 8,
  },
  quickTopupContainer: {
    marginBottom: 24,
  },
  quickTopupLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  quickTopupButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickTopupButton: {
    width: '48%',
    backgroundColor: '#DADADA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  quickTopupButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  quickTopupText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  quickTopupTextActive: {
    color: '#FFFFFF',
  },
  topupButton: {
    backgroundColor: '#435334',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  topupButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  topupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TopupScreen;