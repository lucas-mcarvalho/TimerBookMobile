import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, View, Switch, Pressable, Alert, ActivityIndicator, Modal } from "react-native";
import * as ImagePicker from "expo-image-picker";
import getGlobalStyles from "../styles/globalStyles";
import getProfileStyles from "../styles/profile.styles";
import Field from "../components/common/Field";
import PrimaryButton from "../components/common/PrimaryButton";
import { getUserPhoto, getErrorMessage } from "../utils/helpers";
import { updateProfile } from "../api/timerbook";

// Icons
import PencilIcon from "../assets/PencilIcon.svg";
import TrashIcon from "../assets/TrashIcon.svg";

function ProfileScreen({ apiUrl, setApiUrl, user, onSaveApiUrl, onSaveGoal, onLogout, theme, themeMode, onToggleTheme, onRefreshUser, onNavigateSubscription }) {
  const [username, setUsername] = useState(user?.username || "");
  const [goal, setGoal] = useState(String(user?.dailyReadingGoalMinutes ?? 20)); // Restaurei o estado do goal
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  
  const userPhoto = getUserPhoto(user, apiUrl);
  
  const globalStyles = getGlobalStyles(theme);
  const profileStyles = getProfileStyles(theme);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setGoal(String(user.dailyReadingGoalMinutes ?? 20));
    }
  }, [user]);

  async function pickAndUploadPhoto() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7
      });

      if (!result.canceled && result.assets?.[0]) {
        setUploading(true);
        await updateProfile(user.id, { username: user.username, email: user.email }, result.assets[0]);
        if (onRefreshUser) await onRefreshUser();
        Alert.alert("Sucesso", "Foto de perfil atualizada!");
      }
    } catch (error) {
      Alert.alert("Erro", getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  }

  async function handleRemovePhoto() {
    Alert.alert(
      "Remover Foto",
      "Deseja realmente remover sua foto de perfil?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Remover", 
          style: "destructive", 
          onPress: async () => {
            setUploading(true);
            try {
              await updateProfile(user.id, { username: user.username, email: user.email }, null, true);
              if (onRefreshUser) await onRefreshUser();
              Alert.alert("Sucesso", "Foto de perfil removida!");
            } catch (error) {
              Alert.alert("Erro", getErrorMessage(error));
            } finally {
              setUploading(false);
            }
          } 
        }
      ]
    );
  }

  async function handleSaveProfile() {
    if (!username.trim()) {
      Alert.alert("Erro", "O nome de usuário não pode estar vazio.");
      return;
    }

    setSavingProfile(true);
    try {
      await updateProfile(user.id, { username: username.trim(), email: user.email }, null);
      if (onRefreshUser) await onRefreshUser();
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } catch (error) {
      Alert.alert("Erro", getErrorMessage(error));
    } finally {
      setSavingProfile(false);
    }
  }
 
  return (
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={globalStyles.screenContent}>
      <View style={{ alignItems: "center", marginBottom: 30 }}>
        <View style={{ position: "relative" }}>
          <View style={globalStyles.profileImageContainer}>
            {uploading ? (
              <ActivityIndicator color={theme.accent} size="large" />
            ) : userPhoto ? (
              <Image source={{ uri: userPhoto }} style={globalStyles.profileImage} />
            ) : (
              <View style={globalStyles.profileImageDefault}>
                <Text style={{ fontSize: 40, color: theme.subtext }}>
                  {(user?.username || "U").slice(0, 1).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <Pressable 
            onPress={pickAndUploadPhoto} 
            disabled={uploading}
            style={[profileStyles.photoEditButton, uploading && { opacity: 0.5 }]}
          >
            <PencilIcon width={16} height={16} color="#ffffff" />
          </Pressable>
          
          {userPhoto && !uploading && (
            <Pressable 
              onPress={handleRemovePhoto} 
              style={[profileStyles.photoEditButton, { left: 0, right: undefined, backgroundColor: theme.danger }]}
            >
              <TrashIcon width={16} height={16} color="#ffffff" />
            </Pressable>
          )}
        </View>
        <Text style={profileStyles.eyebrow}>Conta</Text>
        <Text style={[profileStyles.title, { textAlign: "center", marginBottom: 0 }]}>
          {user?.username || "Perfil"}
        </Text>
      </View>

      <View style={profileStyles.profileBox}>
        <Text style={profileStyles.profileLabel}>Informações da Conta</Text>
        <Field
          theme={theme}
          label="Nome de Usuário"
          value={username}
          onChangeText={setUsername}
        />
        <Text style={profileStyles.profileLabel}>Email</Text>
        <Text style={[profileStyles.profileValue, { marginBottom: 15, opacity: 0.7 }]}>{user?.email || "-"}</Text>
        
        <PrimaryButton theme={theme} onPress={handleSaveProfile} disabled={savingProfile}>
          {savingProfile ? "Salvando..." : "Atualizar Nome"}
        </PrimaryButton>
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

      {/* META DE LEITURA (Botão que abre o Modal) */}
      <View style={profileStyles.profileBox}>
        <Text style={profileStyles.profileLabel}>Meta de Leitura</Text>
        <Text style={[profileStyles.profileValue, { marginBottom: 15 }]}>
          {goal} minutos por dia
        </Text>
        <PrimaryButton theme={theme} onPress={() => setIsGoalModalOpen(true)} variant="secondary">
          Alterar Meta de Leitura
        </PrimaryButton>
      </View>

      {/* BLOCO: ASSINATURA */}
      <View style={profileStyles.profileBox}>
        <Text style={profileStyles.profileLabel}>Assinatura</Text>
        <Text style={[profileStyles.profileValue, { marginBottom: 15, opacity: 0.7 }]}>
          Gerencie seu plano atual e descubra os benefícios Premium.
        </Text>
        <PrimaryButton theme={theme} onPress={onNavigateSubscription} variant="primary">
          Plano de Assinatura
        </PrimaryButton>
      </View>

      <View style={profileStyles.divider} />
      
      <View style={profileStyles.profileBox}>
        <Text style={profileStyles.profileLabel}>Configurações de Rede</Text>
        <Field
          theme={theme}
          label="Endereço do Backend"
          value={apiUrl}
          onChangeText={setApiUrl}
          placeholder="http://10.0.2.2:8080"
        />
        <PrimaryButton theme={theme} onPress={onSaveApiUrl} variant="secondary">
          Salvar URL
        </PrimaryButton>
      </View>

      <PrimaryButton theme={theme} onPress={onLogout} variant="danger">
        Sair da Conta
      </PrimaryButton>

      {/* MODAL DE META DE LEITURA */}
      <Modal
        visible={isGoalModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsGoalModalOpen(false)}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center", padding: 20 }}>
          <View style={{ backgroundColor: themeMode === "dark" ? "#1e2f4c" : "#ffffff", padding: 25, borderRadius: 12, width: "100%" }}>
            
            <Text style={{ fontSize: 20, fontWeight: "bold", color: theme.text, marginBottom: 8 }}>
              Meta diária de leitura
            </Text>
            <Text style={{ color: theme.subtext, marginBottom: 20 }}>
              Escolha quantos minutos você quer ler por dia.
            </Text>

            {/* Botões de 10, 20 e 30 */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 25 }}>
              {[10, 20, 30].map((minutes) => (
                <Pressable
                  key={minutes}
                  onPress={() => setGoal(String(minutes))}
                  style={{
                    flex: 1,
                    marginHorizontal: 5,
                    paddingVertical: 15,
                    borderWidth: 2,
                    borderColor: goal === String(minutes) ? theme.accent : (themeMode === "dark" ? "#334155" : "#e2e8f0"),
                    borderRadius: 8,
                    alignItems: "center",
                    backgroundColor: goal === String(minutes) ? (themeMode === "dark" ? "rgba(29, 158, 117, 0.2)" : "#e6f6f0") : "transparent"
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: "bold", color: theme.text }}>{minutes}</Text>
                  <Text style={{ fontSize: 12, color: theme.subtext }}>min/dia</Text>
                </Pressable>
              ))}
            </View>

            {/* Ações do Modal */}
            <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 15 }}>
              <Pressable onPress={() => setIsGoalModalOpen(false)} style={{ padding: 10 }}>
                <Text style={{ color: theme.subtext, fontWeight: "600" }}>Cancelar</Text>
              </Pressable>
              
              <PrimaryButton 
                theme={theme} 
                onPress={() => {
                  onSaveGoal(goal);
                  setIsGoalModalOpen(false);
                }}
              >
                Salvar Meta
              </PrimaryButton>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

export default ProfileScreen;