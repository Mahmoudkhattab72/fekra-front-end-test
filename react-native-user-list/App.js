import React, { useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './src/redux/store';
import { fetchUsers, setSearchQuery, loadMoreUsers } from './src/redux/userSlice';
import UserCard from './src/components/UserCard';
import SearchBar from './src/components/SearchBar';

const UserListScreen = () => {
  const dispatch = useDispatch();
  const { users, searchQuery, currentPage, pageSize, loading, error, isOffline } = useSelector(
    (state) => state.users
  );

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(0, currentPage * pageSize);
  const hasMore = paginatedUsers.length < filteredUsers.length;

  const renderItem = useCallback(({ item }) => <UserCard user={item} />, []);
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>User Directory</Text>

      {isOffline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>⚠️ Offline Mode: Showing Cached Data</Text>
        </View>
      )}

      <SearchBar value={searchQuery} onChangeText={(text) => dispatch(setSearchQuery(text))} />

      {loading && users.length === 0 ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={paginatedUsers}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={true}
          ListFooterComponent={
            hasMore ? (
              <TouchableOpacity style={styles.loadMoreButton} onPress={() => dispatch(loadMoreUsers())}>
                <Text style={styles.loadMoreText}>Load More</Text>
              </TouchableOpacity>
            ) : paginatedUsers.length > 0 ? (
              <Text style={styles.endText}>No more users to load.</Text>
            ) : (
              <Text style={styles.endText}>No users found.</Text>
            )
          }
        />
      )}
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <UserListScreen />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', paddingHorizontal: 16, paddingTop: 10 },
  header: { fontSize: 24, fontWeight: 'bold', marginVertical: 10, color: '#1a1a1a' },
  offlineBanner: { backgroundColor: '#fff3cd', padding: 8, borderRadius: 6, marginBottom: 8 },
  offlineText: { color: '#856404', textAlign: 'center', fontWeight: '600' },
  loadMoreButton: { backgroundColor: '#007bff', padding: 12, borderRadius: 8, alignItems: 'center', marginVertical: 15 },
  loadMoreText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  endText: { textAlign: 'center', color: '#888', marginVertical: 15 },
  errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
});