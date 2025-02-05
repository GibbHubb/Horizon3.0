import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  StyleSheet,
} from 'react-native';
import { fetchUsers } from '../../utils/api'; // API call for users

const logo = require('../../imgs/Horizon.png'); // Ensure correct path

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
      {/* Horizon Logo */}
      <Image source={logo} style={styles.logo} />

      {/* Back Button (Top Right) */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Client & Trainer Overview</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search users..."
        placeholderTextColor="#555"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Loader or User List */}
      {loading && users.length === 0 ? (
        <ActivityIndicator size="large" color="#f6b000" />
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
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // White background for clarity
  },
  logo: {
    width: 150,
    height: 80,
    resizeMode: 'contain',
    marginTop: 20, // Adjusted spacing
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#f6b000', // Horizon Gold
    padding: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#1A1A1A',
    fontWeight: 'bold',
    fontSize: 18,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#3274ba', // Horizon Blue for contrast
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#8ebce6', // Horizon Light Blue
    borderRadius: 8,
    padding: 12,
    width: '90%',
    backgroundColor: '#f8f8f8',
    color: '#333',
    marginBottom: 16,
  },
  userButton: {
    padding: 16,
    backgroundColor: '#f6b000', // Horizon Gold
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
    marginBottom: 8,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  loadMoreButton: {
    padding: 12,
    backgroundColor: '#3274ba', // Horizon Blue
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 10,
    width: '90%',
  },
  loadMoreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

