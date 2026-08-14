import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UserCard = ({ user }) => (
  <View style={styles.card}>
    <Text style={styles.name}>{user.name}</Text>
    <Text>Email: {user.email}</Text>
    <Text>Address: {user.address}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: { padding: 15, marginVertical: 8, backgroundColor: '#f9f9f9', borderRadius: 8 },
  name: { fontSize: 18, fontWeight: 'bold' }
});

export default UserCard;