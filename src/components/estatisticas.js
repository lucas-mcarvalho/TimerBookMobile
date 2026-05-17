import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  useColorScheme,
  Dimensions 
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { getReadingStats } from "../api/timerbook"; 

const screenWidth = Dimensions.get("window").width;

const Estatisticas = ({ readingId, onBack }) => {
  const systemTheme = useColorScheme();
  const isDarkMode = systemTheme === "dark";

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        if (!readingId) {
          throw new Error("ID da leitura não informado.");
        }
        const data = await getReadingStats(readingId);
        setErro(null);
        setStats(data);
      } catch (error) {
        console.error("Erro ao buscar stats:", error);
        setErro("Não foi possível carregar as estatísticas.");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [readingId]);

  const formatTime = (seconds) => {
    if (!seconds) return "0h 0min";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}min`;
  };

  const styles = getStyles(isDarkMode);

  if (loading) {
    return (
      <View style={styles.centerMsg}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Carregando estatísticas...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.centerMsg}>
        <Text style={styles.errorText}>{erro}</Text>
        <TouchableOpacity onPress={onBack} style={[styles.backButton, { marginTop: 20 }]}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!stats) return null;

  const chartConfig = {
    backgroundGradientFrom: isDarkMode ? "#2C2C2C" : "#FFFFFF",
    backgroundGradientTo: isDarkMode ? "#2C2C2C" : "#FFFFFF",
    color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
    labelColor: (opacity = 1) => isDarkMode ? `rgba(229, 231, 235, ${opacity})` : `rgba(107, 114, 128, ${opacity})`,
    barPercentage: 0.6,
    propsForLabels: { fontSize: 10 }
  };

  const timeChartConfig = {
    ...chartConfig,
    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, 
  };

  const chartData = {
    labels: ["Páginas", "Sessões", "Streak", "Melhor"],
    datasets: [{
      data: [
        stats.pagesRead ?? 0, 
        stats.sessionsCount ?? 0, 
        stats.currentStreakDays ?? 0, 
        stats.maxStreakDays ?? 0
      ]
    }]
  };

  const timeChartData = {
    labels: ["Total (s)", "Média/Sessão"],
    datasets: [{
      data: [
        stats.totalSeconds ?? 0, 
        Number(stats.averageSecondsPerSession ?? 0)
      ]
    }]
  };

  return (
    <ScrollView style={styles.pageContainer} contentContainerStyle={styles.contentWrapper}>
      
      {/* Botão de Voltar usando a Prop onBack */}
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>📊 Estatísticas de Leitura</Text>

      <View style={styles.gridContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>📖</Text>
          <Text style={styles.statLabel}>Páginas lidas</Text>
          <Text style={styles.statValue}>{stats.pagesRead ?? 0}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>⏱️</Text>
          <Text style={styles.statLabel}>Tempo total</Text>
          <Text style={styles.statValue}>{formatTime(stats.totalSeconds)}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>⚡</Text>
          <Text style={styles.statLabel}>Média por sessão</Text>
          <Text style={styles.statValue}>{Number(stats.averageSecondsPerSession ?? 0).toFixed(1)}s</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🔁</Text>
          <Text style={styles.statLabel}>Sessões</Text>
          <Text style={styles.statValue}>{stats.sessionsCount ?? 0}</Text>
        </View>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Comparativo geral</Text>
        <BarChart
          data={chartData}
          width={screenWidth - 80}
          height={220}
          yAxisLabel=""
          chartConfig={chartConfig}
          verticalLabelRotation={0}
          fromZero
          style={styles.chartStyle}
        />
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Tempo de leitura</Text>
        <BarChart
          data={timeChartData}
          width={screenWidth - 80}
          height={220}
          yAxisLabel=""
          chartConfig={timeChartConfig}
          verticalLabelRotation={0}
          fromZero
          style={styles.chartStyle}
        />
      </View>

    </ScrollView>
  );
};

const getStyles = (isDarkMode) => StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: isDarkMode ? "#121212" : "#F3F4F6",
  },
  contentWrapper: {
    padding: 20,
    paddingBottom: 40,
  },
  centerMsg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: isDarkMode ? "#121212" : "#F3F4F6",
  },
  loadingText: {
    marginTop: 10,
    color: isDarkMode ? "#9CA3AF" : "#4B5563",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 16,
    textAlign: "center",
  },
  backButton: {
    marginBottom: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: isDarkMode ? "#374151" : "#D1D5DB",
    backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: isDarkMode ? "#F3F4F6" : "#374151",
    fontWeight: "600",
    fontSize: 14,
  },
  title: {
    color: isDarkMode ? "#F9FAFB" : "#111827",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: isDarkMode ? "#2C2C2C" : "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    width: "48%",
    marginBottom: 16,
    borderWidth: isDarkMode ? 1 : 0,
    borderColor: "#444",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: isDarkMode ? "#9CA3AF" : "#6B7280",
    fontWeight: "500",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    color: isDarkMode ? "#F9FAFB" : "#111827",
    fontWeight: "bold",
  },
  chartCard: {
    backgroundColor: isDarkMode ? "#2C2C2C" : "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: isDarkMode ? 1 : 0,
    borderColor: "#444",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  chartTitle: {
    color: isDarkMode ? "#E5E7EB" : "#374151",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
    alignSelf: "flex-start",
  },
  chartStyle: {
    borderRadius: 16,
  }
});

export default Estatisticas;