import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  UIManager,
  View
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import globalStyles from "../styles/globalStyles";
import authStyles from "../styles/auth.styles";
import { saveApiUrl, saveTokens } from "../utils/storage";
import { loginUser, registerUser } from "../api/timerbook";
import { setRuntimeApiUrl } from "../api/client";
import { getErrorMessage } from "../utils/helpers";
import Field from "../components/common/Field";
import PrimaryButton from "../components/common/PrimaryButton";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function AuthScreen({ apiUrl, setApiUrl, onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [goal, setGoal] = useState("20");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  function toggleMode(newMode) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMode(newMode);
  }

  async function pickProfilePhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8
    });
    if (!result.canceled && result.assets?.[0]) {
      setProfilePhoto(result.assets[0]);
    }
  }
 
  async function persistApiUrl() {
    const cleanUrl = apiUrl.trim();
    if (!cleanUrl) {
      Alert.alert("API", "Informe a URL do backend.");
      return;
    }
    await saveApiUrl(cleanUrl);
    setRuntimeApiUrl(cleanUrl);
    Alert.alert("API", "Endereco salvo.");
  }
 
  async function submit() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Campos obrigatorios", "Informe email e senha.");
      return;
    }
    if (mode === "register" && !username.trim()) {
      Alert.alert("Campos obrigatorios", "Informe seu nome de usuario.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "register") {
        await registerUser({
          username: username.trim(),
          email: email.trim(),
          password,
          dailyReadingGoalMinutes: goal ? Number(goal) : undefined,
          photo: profilePhoto
        });
        Alert.alert("Cadastro criado", "Agora faca login com sua conta.");
        toggleMode("login");
        return;
      }
      const response = await loginUser(email.trim(), password);
      await saveTokens({ token: response.token, refreshToken: response.refreshToken });
      onAuthenticated();
    } catch (error) {
      Alert.alert("TimerBook", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }
 
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={authStyles.authContainer}
    >
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={authStyles.authContent}>
        <View style={authStyles.loginFormCard}>
          <View style={authStyles.logoBlock}>
            <View style={authStyles.brandMark}>
              <Text style={authStyles.brandInitial}>T</Text>
            </View>
            <Text style={authStyles.authTitle}>TimerBook</Text>
          </View>
          <Text style={authStyles.authSubtitle}>Acesse sua biblioteca pessoal</Text>
 
          <View style={authStyles.segmented}>
            <Pressable
              onPress={() => toggleMode("login")}
              style={[authStyles.segment, mode === "login" && authStyles.segmentActive]}
            >
              <Text style={[authStyles.segmentText, mode === "login" && authStyles.segmentTextActive]}>
                Entrar
              </Text>
            </Pressable>
            <Pressable
              onPress={() => toggleMode("register")}
              style={[authStyles.segment, mode === "register" && authStyles.segmentActive]}
            >
              <Text style={[authStyles.segmentText, mode === "register" && authStyles.segmentTextActive]}>
                Cadastrar
              </Text>
            </Pressable>
          </View>
 
          {mode === "register" && (
            <>
              <Pressable onPress={pickProfilePhoto} style={authStyles.profilePhotoPicker}>
                {profilePhoto?.uri ? (
                  <Image source={{ uri: profilePhoto.uri }} style={authStyles.profilePhotoPreview} />
                ) : (
                  <View style={authStyles.profilePhotoPlaceholder}>
                    <Text style={authStyles.profilePhotoInitial}>
                      {(username || email || "T").slice(0, 1).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={authStyles.profilePhotoTextBox}>
                  <Text style={authStyles.profilePhotoTitle}>Foto de perfil</Text>
                  <Text style={authStyles.profilePhotoDescription}>
                    {profilePhoto ? "Toque para trocar a imagem" : "Toque para escolher uma imagem"}
                  </Text>
                </View>
              </Pressable>
              <Field label="Usuario" value={username} onChangeText={setUsername} />
            </>
          )}
 
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="voce@email.com"
          />
          <Field label="Senha" value={password} onChangeText={setPassword} secureTextEntry />
          {mode === "register" && (
            <Field
              label="Meta diaria em minutos"
              value={goal}
              onChangeText={setGoal}
              keyboardType="numeric"
            />
          )}
 
          <PrimaryButton onPress={submit} disabled={loading}>
            {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
          </PrimaryButton>
 
          <View style={authStyles.apiBox}>
            <Text style={authStyles.apiTitle}>Backend</Text>
            <TextInput
              value={apiUrl}
              onChangeText={setApiUrl}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="http://10.0.2.2:8080"
              placeholderTextColor="#64748b"
              style={globalStyles.input}
            />
            <PrimaryButton onPress={persistApiUrl} variant="secondary">
              Salvar endereco da API
            </PrimaryButton>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default AuthScreen;
