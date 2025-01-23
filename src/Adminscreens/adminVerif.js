import React, { useEffect, useState } from "react";
import { 
  SafeAreaView, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  RefreshControl 
} from "react-native";
import { updateSaldoUser, getSaldoUserid } from "../components/userEnd";
import { getRequest, updateRequest, deleteRequestid } from "../components/orderEnd";

const AdminVerif = () => {
  const [topupRequests, setTopupRequests] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const now = new Date();
  const waktuskrg = now.getFullYear() * 10000000000 + (now.getMonth() + 1) * 100000000 + now.getDate() * 1000000 + now.getHours() * 10000 + now.getMinutes() * 100 + now.getSeconds();


  const fetchRequests = async () => {
    try {
      const result = await getRequest();
      if (result.success) {
        const data = Object.entries(result.data || {}).flatMap(([uid, requests]) => {
          return Object.entries(requests).map(([idtopup, details]) => ({
            uid,
            idtopup,
            ...details,
            create_at: details.create_at || Date.now()
          }));
        });

        const sortedData = data.sort((a, b) => b.create_at - a.create_at);
        setTopupRequests(sortedData);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleVerify = async (uid, idtopup, nominal) => {
    try {
      const saldoResult = await getSaldoUserid(uid);
      if (saldoResult.success) {
        const updatedSaldo = parseInt(saldoResult.saldo) + parseInt(nominal);
        const saldoUpdateResult = await updateSaldoUser(uid, updatedSaldo);

        if (saldoUpdateResult.success) {
          const requestUpdateResult = await updateRequest(uid, idtopup);
          if (requestUpdateResult.success) {
            alert("Top-up berhasil diverifikasi dan saldo diperbarui.");
            await fetchRequests();
          }
        }
      }
    } catch (error) {
      console.error("Error verifying top-up:", error);
      alert("Gagal memverifikasi top-up.");
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchRequests();
  };

  const formatCurrency = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const formatDate = (timestamp) => {
    if (!timestamp || typeof timestamp !== 'number') return "Invalid Date";
  
    try {
      const timestampStr = timestamp.toString();
      const year = parseInt(timestampStr.slice(0, 4));
      const month = parseInt(timestampStr.slice(4, 6)) - 1; 
      const day = parseInt(timestampStr.slice(6, 8));
      const hours = parseInt(timestampStr.slice(8, 10));
      const minutes = parseInt(timestampStr.slice(10, 12));
      const seconds = parseInt(timestampStr.slice(12, 14));
  
      const date = new Date(year, month, day, hours, minutes, seconds);
  
      if (isNaN(date.getTime())) throw new Error("Invalid Date");
  
      return date.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={onRefresh}
            colors={["#2563EB"]} 
            tintColor="#2563EB"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {topupRequests.map((request, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.idContainer}>
                <Text style={styles.idLabel}>ID Top-Up</Text>
                <Text style={styles.idValue}>{request.idtopup}</Text>
                <Text style={styles.dateText}>
                  {formatDate(request.create_at)}
                </Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: request.Status === 'Pending' ? '#FEF3C7' : '#D1FAE5' }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: request.Status === 'Pending' ? '#D97706' : '#059669' }
                ]}>{request.Status}</Text>
              </View>
            </View>

            <View style={styles.cardDivider} />

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Nominal</Text>
                <Text style={styles.detailValue}>Rp {formatCurrency(request.nominal)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>User ID</Text>
                <Text style={styles.detailValue}>{request.uid}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.verifyButton,
                request.Status !== 'Pending' || (parseInt(waktuskrg) - parseInt(request.create_at)) > 10000
                  ? styles.verifyButtonDisabled
                  : null
              ]}
              onPress={() => handleVerify(request.uid, request.idtopup, request.nominal)}
              disabled={
                request.Status !== 'Pending' || (parseInt(waktuskrg) - parseInt(request.create_at)) > 10000
              }
            >
              <Text style={styles.verifyButtonText}>
                {request.Status !== 'Pending'
                  ? 'Sudah Diverifikasi'
                  : (parseInt(waktuskrg) - parseInt(request.create_at)) > 10000
                  ? 'Expired'
                  : 'Verifikasi Pembayaran'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3EED4",
  },
  headerContainer: {
    backgroundColor: "#E3EED4",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  idContainer: {
    flex: 1,
  },
  idLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  idValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: "#6B7280",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginBottom: 16,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  verifyButton: {
    backgroundColor: "#375534",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#375534",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  verifyButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  verifyButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default AdminVerif;
