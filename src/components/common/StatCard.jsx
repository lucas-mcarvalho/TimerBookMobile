import React from 'react';
import { View, Text } from 'react-native';
import getGlobalStyles from '../../styles/globalStyles';

function StatCard({ label, value, theme }) {
  const globalStyles = getGlobalStyles(theme);
  return (
    <View style={globalStyles.statCard}>
      <Text style={globalStyles.statValue}>{value}</Text>
      <Text style={globalStyles.statLabel}>{label}</Text>
    </View>
  );
}

export default StatCard;
