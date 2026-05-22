import React from 'react';
import { View, Text, TextInput } from 'react-native';
import getGlobalStyles from '../../styles/globalStyles';

function Field({ label, value, onChangeText, secureTextEntry, keyboardType, placeholder, multiline, theme }) {
  const globalStyles = getGlobalStyles(theme);
  return (
    <View style={globalStyles.field}>
      <Text style={globalStyles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={theme.subtext}
        multiline={multiline}
        style={[globalStyles.input, multiline && globalStyles.textArea]}
      />
    </View>
  );
}

export default Field;
