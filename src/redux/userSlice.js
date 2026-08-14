import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = '@user_list_cache';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) throw new Error('Failed to fetch users from server.');
      
      const data = await response.json();
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data)); // Cache for offline
      return { users: data, isOffline: false };
    } catch (error) {
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      if (cachedData) {
        return { users: JSON.parse(cachedData), isOffline: true }; // Offline fallback
      }
      return rejectWithValue(error.message || 'No internet connection and no cached data.');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    searchQuery: '',
    currentPage: 1,
    pageSize: 4,
    loading: false,
    error: null,
    isOffline: false,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset pagination when searching
    },
    loadMoreUsers: (state) => {
      state.currentPage += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.isOffline = action.payload.isOffline;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery, loadMoreUsers } = userSlice.actions;
export default userSlice.reducer;