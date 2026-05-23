import React from "react";
import { Image, RefreshControl, ScrollView, Text, View } from "react-native";
import getGlobalStyles from "../styles/globalStyles";
import getHomeStyles from "../styles/home.styles";
import StatCard from "../components/common/StatCard";
import EmptyState from "../components/common/EmptyState";
import HomeGuide from "../components/HomeGuide";
import { formatDuration } from "../utils/formatters";
import { getBookTitle, getUserPhoto } from "../utils/helpers";

function HomeScreen({ apiUrl, user, stats, inProgress, onRefresh, refreshing, theme, onNavigateProfile }) {
  const globalStyles = getGlobalStyles(theme);
  const homeStyles = getHomeStyles(theme);
  const userPhoto = getUserPhoto(user, apiUrl);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={globalStyles.screenContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.accent} />}
      >
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <View style={globalStyles.profileImageContainer}>
            {userPhoto ? (
              <Image source={{ uri: userPhoto }} style={globalStyles.profileImage} />
            ) : (
              <View style={globalStyles.profileImageDefault}>
                <Text style={{ fontSize: 40, color: theme.subtext }}>
                  {(user?.username || "U").slice(0, 1).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <Text style={homeStyles.eyebrow}>Bem-vindo de volta!</Text>
          <Text style={[homeStyles.title, { textAlign: "center", marginBottom: 10 }]}>
            {user?.username || "Leitor"}
          </Text>
        </View>
   
        <View style={homeStyles.statsGrid}>
          <StatCard theme={theme} label="Paginas lidas" value={stats?.pagesRead ?? 0} />
          <StatCard theme={theme} label="Tempo total" value={formatDuration(stats?.totalSeconds)} />
          <StatCard theme={theme} label="Sessoes" value={stats?.sessionsCount ?? 0} />
          <StatCard theme={theme} label="Sequencia" value={`${stats?.currentStreakDays ?? 0} dias`} />
        </View>
   
        <View style={homeStyles.sectionHeader}>
          <Text style={homeStyles.sectionTitle}>Leituras em andamento</Text>
        </View>
   
        {inProgress.length === 0 ? (
          <EmptyState
            theme={theme}
            title="Nada em andamento"
            description="Comece uma leitura pela biblioteca para acompanhar seu progresso."
          />
        ) : (
          inProgress.map((reading) => (
            <View key={String(reading.id)} style={homeStyles.readingRow}>
              <Text style={homeStyles.readingTitle}>{getBookTitle(reading.book)}</Text>
              <Text style={homeStyles.readingMeta}>Pagina atual: {reading.currentPage ?? 0}</Text>
            </View>
          ))
        )}
      </ScrollView>
      <HomeGuide onNavigateProfile={onNavigateProfile} />
    </View>
  );
}

export default HomeScreen;
