import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UserCard = React.memo(({ user }) => {
  const formatAddress = (address) => {
    if (!address) return 'N/A';
    const { street, city, zipcode } = address;
    return `${street}, ${city}, ${zipcode}`;
  };

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>📧 {user.email}</Text>
      <Text style={styles.address}>📍 {formatAddress(user.address)}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: { fontSize: 18, fontWeight: 'bold', color: '#333333', marginBottom: 4 },
  email: { fontSize: 14, color: '#555555', marginBottom: 4 },
  address: { fontSize: 13, color: '#777777' },
});

export default UserCard;