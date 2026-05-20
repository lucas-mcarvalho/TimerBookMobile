import React from 'react';
import { View, Text } from 'react-native';
import globalStyles from '../../styles/globalStyles';

function StatCard({ label, value }) {
  return (
    <View style={globalStyles.statCard}>
      <Text style={globalStyles.statValue}>{value}</Text>
      <Text style={globalStyles.statLabel}>{label}</Text>
    </View>
  );
}

export default StatCard;
