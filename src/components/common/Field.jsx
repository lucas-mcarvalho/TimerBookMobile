import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from "react-native-svg";
import getGlobalStyles from '../../styles/globalStyles';

function Field({ label, value, onChangeText, secureTextEntry, isPassword, keyboardType, placeholder, multiline, theme }) {
  const globalStyles = getGlobalStyles(theme);
  
  // O estado começa como 'true' se for um campo de senha (isPassword)
  const [isSecure, setIsSecure] = useState(isPassword || secureTextEntry);

  return (
    <View style={globalStyles.field}>
      <Text style={globalStyles.label}>{label}</Text>
      
      <View
        style={[
          globalStyles.input,
          styles.inputContainer,
          multiline ? globalStyles.textArea : styles.singleLineInputContainer
        ]}
      >
        
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor={theme.subtext}
          multiline={multiline}
          style={[styles.textInputBase, multiline && styles.multilineTextInput, { color: theme.text }]} 
        />

        {/* Só renderiza o olho se for marcado como isPassword */}
        {isPassword && (
          <Pressable 
            onPress={() => setIsSecure(!isSecure)}
            style={styles.iconButton}
          >
            {isSecure ? (
              <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.subtext} strokeWidth="2">
                <Path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" />
                <Circle cx="12" cy="12" r="3" />
              </Svg>
            ) : (
              <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth="2">
                <Path d="M17.94 17.94A10.94 10.94 0 0 1 12 19C7 19 2.73 15.11 1 12C1.68 10.82 2.61 9.73 3.74 8.86M9.9 4.24A10.94 10.94 0 0 1 12 5C17 5 21.27 8.89 23 12C22.35 13.11 21.5 14.14 20.5 15.03M1 1L23 23" />
              </Svg>
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    overflow: 'hidden',
  },
  singleLineInputContainer: {
    height: 48,
    minHeight: 48,
  },
  textInputBase: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 0,
    minHeight: 48,
    fontSize: 16,
  },
  multilineTextInput: {
    minHeight: 110,
    paddingVertical: 12,
    textAlignVertical: 'top',
  },
  iconButton: {
    paddingHorizontal: 12,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Field;
