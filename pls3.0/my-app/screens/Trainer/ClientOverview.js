import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { fetchUsers } from '../../utils/api'; // API call for users

export default function ClientOverview({ navigation }) {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadUsers();
  }, [searchQuery]);

  const loadUsers = async () => {
    if (!hasMore) return;

    setLoading(true);
    try {
      const userList = await fetchUsers(page, searchQuery);
      if (userList.length < 20) setHasMore(false);
      setUsers((prevUsers) => (page === 1 ? userList : [...prevUsers, ...userList]));
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    setPage(1);
    setHasMore(true);
    setUsers([]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Client & Trainer Overview</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search users..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {loading && users.length === 0 ? (
        <ActivityIndicator size="large" color="#0056A6" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.user_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userButton}
              onPress={() => navigation.navigate('ProfileScreen', { userId: item.user_id })}
            >
              <Text style={styles.username}>{item.username}</Text>
            </TouchableOpacity>
          )}
          onEndReached={loadUsers}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            hasMore && (
              <TouchableOpacity style={styles.loadMoreButton} onPress={loadUsers}>
                <Text style={styles.loadMoreText}>Load More</Text>
              </TouchableOpacity>
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  backButton: {
    backgroundColor: '#FF6B6B',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  userButton: {
    padding: 16,
    backgroundColor: '#0056A6',
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loadMoreButton: {
    padding: 10,
    backgroundColor: '#0056A6',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 10,
  },
  loadMoreText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
