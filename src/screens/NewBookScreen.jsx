import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import getGlobalStyles from "../styles/globalStyles";
import getNewBookStyles from "../styles/newBook.styles";
import Field from "../components/common/Field";
import PrimaryButton from "../components/common/PrimaryButton";

function NewBookScreen({ form, setForm, onCreateBook, loading, theme }) {
  const globalStyles = getGlobalStyles(theme);
  const newBookStyles = getNewBookStyles(theme);

  async function pickCover() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8
    });
    if (!result.canceled && result.assets?.[0]) {
      setForm((current) => ({ ...current, cover: result.assets[0] }));
    }
  }
 
  async function pickPdf() {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true
    });
    if (!result.canceled) {
      const asset = result.assets?.[0] || result;
      setForm((current) => ({ ...current, pdf: asset }));
    }
  }
 
  return (
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={globalStyles.screenContent}>
      <Text style={newBookStyles.eyebrow}>Cadastro</Text>
      <Text style={newBookStyles.title}>Novo livro</Text>
      <Field
        theme={theme}
        label="Nome"
        value={form.name}
        onChangeText={(value) => setForm((current) => ({ ...current, name: value }))}
      />
      <Field
        theme={theme}
        label="Descricao"
        value={form.description}
        onChangeText={(value) => setForm((current) => ({ ...current, description: value }))}
        multiline
      />
      <View style={newBookStyles.fileRow}>
        <Pressable onPress={pickCover} style={newBookStyles.fileButton}>
          <Text style={newBookStyles.fileButtonText}>
            {form.cover ? "Capa selecionada" : "Selecionar capa"}
          </Text>
        </Pressable>
        <Pressable onPress={pickPdf} style={newBookStyles.fileButton}>
          <Text style={newBookStyles.fileButtonText}>
            {form.pdf ? "PDF selecionado" : "Selecionar PDF"}
          </Text>
        </Pressable>
      </View>
      <PrimaryButton theme={theme} onPress={onCreateBook} disabled={loading}>
        {loading ? "Salvando..." : "Salvar livro"}
      </PrimaryButton>
    </ScrollView>
  );
}

export default NewBookScreen;
