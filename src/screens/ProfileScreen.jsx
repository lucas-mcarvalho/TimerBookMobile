import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, View, Switch } from "react-native";
import getGlobalStyles from "../styles/globalStyles";
import getProfileStyles from "../styles/profile.styles";
import Field from "../components/common/Field";
import PrimaryButton from "../components/common/PrimaryButton";
import { getUserPhoto } from "../utils/helpers";

function ProfileScreen({ apiUrl, setApiUrl, user, onSaveApiUrl, onSaveGoal, onLogout, theme, themeMode, onToggleTheme }) {
  const [goal, setGoal] = useState(String(user?.dailyReadingGoalMinutes ?? 20));
  const userPhoto = getUserPhoto(user, apiUrl);

  const globalStyles = getGlobalStyles(theme);
  const profileStyles = getProfileStyles(theme);

  useEffect(() => {
    setGoal(String(user?.dailyReadingGoalMinutes ?? 20));
  }, [user?.dailyReadingGoalMinutes]);

  return (
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={globalStyles.screenContent}>
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
        <Text style={profileStyles.eyebrow}>Conta</Text>
        <Text style={[profileStyles.title, { textAlign: "center", marginBottom: 0 }]}>
          {user?.username || "Perfil"}
        </Text>
      </View>

      {/* Theme Selection */}
      <View style={profileStyles.themeContainer}>
        <Text style={profileStyles.themeLabel}>Modo Escuro</Text>
        <Switch
          trackColor={{ false: "#cbd5e0", true: theme.accent }}
          thumbColor={themeMode === "dark" ? "#ffffff" : "#f4f3f4"}
          onValueChange={onToggleTheme}
          value={themeMode === "dark"}
        />
      </View>


      <View style={profileStyles.profileBox}>
        <Text style={profileStyles.profileLabel}>Email</Text>
        <Text style={profileStyles.profileValue}>{user?.email || "-"}</Text>
      </View>
      <Field
        theme={theme}
        label="Meta diaria em minutos"
        value={goal}
        onChangeText={setGoal}
        keyboardType="numeric"
      />
      <PrimaryButton theme={theme} onPress={() => onSaveGoal(goal)} variant="secondary">
        Atualizar meta
      </PrimaryButton>
      <View style={profileStyles.divider} />
      <Field
        theme={theme}
        label="Endereco do backend"
        value={apiUrl}
        onChangeText={setApiUrl}
        placeholder="http://10.0.2.2:8080"
      />
      <PrimaryButton theme={theme} onPress={onSaveApiUrl} variant="secondary">
        Salvar API
      </PrimaryButton>
      <PrimaryButton theme={theme} onPress={onLogout} variant="danger">
        Sair
      </PrimaryButton>
    </ScrollView>
  );
}

export default ProfileScreen;
