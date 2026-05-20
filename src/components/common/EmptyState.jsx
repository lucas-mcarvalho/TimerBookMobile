import React from 'react';
import { View, Text } from 'react-native';
import getGlobalStyles from '../../styles/globalStyles';

function EmptyState({ title, description, theme }) {
  const globalStyles = getGlobalStyles(theme);
  return (
    <View style={globalStyles.emptyState}>
      <Text style={globalStyles.emptyTitle}>{title}</Text>
      <Text style={globalStyles.emptyDescription}>{description}</Text>
    </View>
  );
}

export default EmptyState;
