import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Async Thunks
export const fetchStates = createAsyncThunk('pincode/fetchStates', async () => {
  const response = await axios.get(`${API_URL}/states`);
  return response.data;
});

export const fetchDistricts = createAsyncThunk('pincode/fetchDistricts', async (state) => {
  const response = await axios.get(`${API_URL}/states/${state}/districts`);
  return response.data;
});

export const fetchTaluks = createAsyncThunk('pincode/fetchTaluks', async ({ state, district }) => {
  const response = await axios.get(`${API_URL}/states/${state}/districts/${district}/taluks`);
  return response.data;
});

export const fetchPincodes = createAsyncThunk('pincode/fetchPincodes', async (params) => {
  const response = await axios.get(`${API_URL}/pincodes`, { params });
  return response.data;
});

export const searchPincodes = createAsyncThunk('pincode/searchPincodes', async (q) => {
  const response = await axios.get(`${API_URL}/search`, { params: { q } });
  return response.data;
});

export const fetchPincodeDetails = createAsyncThunk('pincode/fetchPincodeDetails', async (pincode) => {
  const response = await axios.get(`${API_URL}/pincode/${pincode}`);
  return response.data;
});

export const fetchStats = createAsyncThunk('pincode/fetchStats', async () => {
  const response = await axios.get(`${API_URL}/stats`);
  return response.data;
});

export const fetchStateDistribution = createAsyncThunk('pincode/fetchStateDistribution', async () => {
  const response = await axios.get(`${API_URL}/stats/state-distribution`);
  return response.data;
});

export const fetchDeliveryDistribution = createAsyncThunk('pincode/fetchDeliveryDistribution', async () => {
  const response = await axios.get(`${API_URL}/stats/delivery-distribution`);
  return response.data;
});

export const fetchOfficeTypeDistribution = createAsyncThunk('pincode/fetchOfficeTypeDistribution', async () => {
  const response = await axios.get(`${API_URL}/stats/office-type-distribution`);
  return response.data;
});

export const fetchRegionDistribution = createAsyncThunk('pincode/fetchRegionDistribution', async () => {
  const response = await axios.get(`${API_URL}/stats/region-distribution`);
  return response.data;
});

export const fetchTopDistricts = createAsyncThunk('pincode/fetchTopDistricts', async () => {
  const response = await axios.get(`${API_URL}/stats/top-districts`);
  return response.data;
});

const initialState = {
  states: [],
  districts: [],
  taluks: [],
  
  // Table data
  pincodeData: [],
  totalParams: 0,
  currentPage: 1,
  currentQueryLimit: 20,
  loadingPincodes: false,
  
  // Search
  searchSuggestions: [],
  loadingSearch: false,

  // Details
  pincodeDetails: null,
  loadingDetails: false,
  
  // Stats
  generalStats: null,
  stateDistribution: [],
  deliveryDistribution: null,
  officeTypeDistribution: null,
  regionDistribution: [],
  topDistricts: [],
  loadingStats: false,

  // Global error
  error: null,
};

const pincodeSlice = createSlice({
  name: 'pincode',
  initialState,
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    resetFilters(state) {
      state.districts = [];
      state.taluks = [];
    },
    clearSearchSuggestions(state) {
      state.searchSuggestions = [];
    }
  },
  extraReducers: (builder) => {
    // States
    builder.addCase(fetchStates.fulfilled, (state, action) => {
      state.states = action.payload;
    });
    // Districts
    builder.addCase(fetchDistricts.fulfilled, (state, action) => {
      state.districts = action.payload;
      state.taluks = [];
    });
    // Taluks
    builder.addCase(fetchTaluks.fulfilled, (state, action) => {
      state.taluks = action.payload;
    });
    
    // Fetch Pincodes
    builder.addCase(fetchPincodes.pending, (state) => {
      state.loadingPincodes = true;
    });
    builder.addCase(fetchPincodes.fulfilled, (state, action) => {
      state.loadingPincodes = false;
      state.pincodeData = action.payload.data;
      state.totalParams = action.payload.total;
    });
    builder.addCase(fetchPincodes.rejected, (state, action) => {
      state.loadingPincodes = false;
      state.error = action.error.message;
    });

    // Search Pincodes
    builder.addCase(searchPincodes.pending, (state) => {
      state.loadingSearch = true;
    });
    builder.addCase(searchPincodes.fulfilled, (state, action) => {
      state.loadingSearch = false;
      state.searchSuggestions = action.payload;
    });

    // Pincode Details
    builder.addCase(fetchPincodeDetails.pending, (state) => {
      state.loadingDetails = true;
      state.pincodeDetails = null;
    });
    builder.addCase(fetchPincodeDetails.fulfilled, (state, action) => {
      state.loadingDetails = false;
      state.pincodeDetails = action.payload;
    });
    builder.addCase(fetchPincodeDetails.rejected, (state) => {
      state.loadingDetails = false;
      state.pincodeDetails = null;
    });

    // Stats
    builder.addCase(fetchStats.pending, (state) => {
      state.loadingStats = true;
    });
    builder.addCase(fetchStats.fulfilled, (state, action) => {
      state.loadingStats = false;
      state.generalStats = action.payload;
    });
    builder.addCase(fetchStateDistribution.fulfilled, (state, action) => {
      state.stateDistribution = action.payload;
    });
    builder.addCase(fetchDeliveryDistribution.fulfilled, (state, action) => {
      state.deliveryDistribution = action.payload;
    });

    // Office Type Distribution
    builder.addCase(fetchOfficeTypeDistribution.fulfilled, (state, action) => {
      state.officeTypeDistribution = action.payload;
    });

    // Region Distribution
    builder.addCase(fetchRegionDistribution.fulfilled, (state, action) => {
      state.regionDistribution = action.payload;
    });

    // Top Districts
    builder.addCase(fetchTopDistricts.fulfilled, (state, action) => {
      state.topDistricts = action.payload;
    });
  }
});

export const { setCurrentPage, resetFilters, clearSearchSuggestions } = pincodeSlice.actions;
export default pincodeSlice.reducer;
