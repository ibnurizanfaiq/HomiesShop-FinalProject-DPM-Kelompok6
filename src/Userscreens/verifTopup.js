import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  Clipboard
} from 'react-native';

const VerifTopup = ({ route, navigation }) => {
  const { nominal, berita } = route.params;
  const bankDetails = {
    bank: 'DANA',
    atasNama: 'Ibnu rizan Faiq',
    nomorRekening: '082268706679',
  };

  const handleCopy = (text) => {
    Clipboard.setString(`${text}`);
    Alert.alert('Berhasil', 'Nomor rekening telah disalin ke clipboard');
  };

  const handleConfirmPayment = async () => {
    const telegramLink = 'https://t.me/Homieshop12';
    const canOpen = await Linking.canOpenURL(telegramLink);
    if (canOpen) {
      Linking.openURL(telegramLink);
    } else {
      Alert.alert('Gagal', 'Tidak dapat membuka aplikasi Telegram.');
    }
  };

  const handleTopupLain = () => {
    navigation.goBack();
  };

  const formatCurrency = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Detail Pembayaran</Text>
          <Text style={styles.headerSubtitle}>
            Silakan transfer sesuai nominal berikut
          </Text>
        </View>

        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Total Pembayaran</Text>
          <Text style={styles.amountValue}>Rp {formatCurrency(nominal)}</Text>
          <View style={styles.transferIdContainer}>
            <Text style={styles.transferIdLabel}>ID Transfer</Text>
            <Text style={styles.transferIdValue}>{berita}</Text>
          </View>
        </View>

        <View style={styles.bankSection}>
          <Text style={styles.bankSectionTitle}>Transfer ke Rekening</Text>
          <TouchableOpacity 
            style={styles.bankDetailsCard}
            onPress={() => handleCopy(bankDetails.nomorRekening)}
          >
            <View style={styles.bankHeader}>
              <Text style={styles.bankName}>{bankDetails.bank}</Text>
              <Text style={styles.copyHint}>Tap untuk menyalin</Text>
            </View>
            <View style={styles.bankInfo}>
              <Text style={styles.accountName}>{bankDetails.atasNama}</Text>
              <Text style={styles.accountNumber}>{bankDetails.nomorRekening}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmPayment}
        >
          <Text style={styles.confirmButtonText}>Konfirmasi Pembayaran</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.otherTopupButton}
          onPress={handleTopupLain}
        >
          <Text style={styles.otherTopupButtonText}>Ubah Nominal Topup</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3EED4',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  amountSection: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  amountLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 16,
  },
  transferIdContainer: {
    alignItems: 'center',
  },
  transferIdLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  transferIdValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  bankSection: {
    marginTop: 24,
  },
  bankSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  bankDetailsCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  bankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bankName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000080',
  },
  copyHint: {
    fontSize: 12,
    color: '#6B7280',
  },
  bankInfo: {
    gap: 4,
  },
  accountName: {
    fontSize: 14,
    color: '#4B5563',
  },
  accountNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  buttonContainer: {
    gap: 12,
  },
  confirmButton: {
    backgroundColor: '#435334',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  otherTopupButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  otherTopupButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VerifTopup;