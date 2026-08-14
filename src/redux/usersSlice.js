import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (page, { rejectWithValue }) => {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=5`);
    const data = await response.json();
    
    // Transform data: Combine API address fields
    const transformed = data.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      address: `${user.address.street}, ${user.address.city}, ${user.address.zipcode}`
    }));
    
    await AsyncStorage.setItem('users_cache', JSON.stringify(transformed));
    return transformed;
  } catch (error) {
    const cached = await AsyncStorage.getItem('users_cache');
    if (cached) {
      return JSON.parse(cached);
    }
    return rejectWithValue('Network error and no cache available');
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState: { list: [], status: 'idle', page: 1 },
  reducers: {
    incrementPage: (state) => { state.page += 1; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const newUsers = action.payload.filter(
            newUser => !state.list.some(existing => existing.id === newUser.id)
        );
        state.list = [...state.list, ...newUsers];
      });
  }
});

export const { incrementPage } = usersSlice.actions;
export default usersSlice.reducer;