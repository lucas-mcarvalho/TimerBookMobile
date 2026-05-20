import React from 'react';
import { View, Text } from 'react-native';
import globalStyles from '../../styles/globalStyles';

function EmptyState({ title, description }) {
  return (
    <View style={globalStyles.emptyState}>
      <Text style={globalStyles.emptyTitle}>{title}</Text>
      <Text style={globalStyles.emptyDescription}>{description}</Text>
    </View>
  );
}

export default EmptyState;
