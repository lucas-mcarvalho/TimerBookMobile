import React from 'react';
import { Pressable, Text } from 'react-native';
import globalStyles from '../../styles/globalStyles';

function PrimaryButton({ children, onPress, disabled, variant = "primary" }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        globalStyles.button,
        variant === "secondary" && globalStyles.secondaryButton,
        variant === "danger" && globalStyles.dangerButton,
        disabled && globalStyles.disabledButton,
        pressed && !disabled && globalStyles.pressedButton
      ]}
    >
      <Text style={[globalStyles.buttonText, variant === "secondary" && globalStyles.secondaryButtonText]}>
        {children}
      </Text>
    </Pressable>
  );
}

export default PrimaryButton;
