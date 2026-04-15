import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import orderBy from 'lodash/orderBy';

const API_BASE_URL = 'https://cdn.workmob.com/stories_workmob/config/';
const API_BASE_URL_TOP = 'https://cdn.workmob.com/stories_workmob/config-latest/';

const INITIAL_STATE = {
  loading: true,
  storyListLoading: true,
  storyAllListLoading: false,
  masterListLoading: true,
  masterListLoadingNew: true,
  blogLoading: true,
  storyListing: [],
  storyAllListing: [],
  masterListing: [],
  masterListingNew: [],
  storyListingStorage: [],
  storiesListing: [],
  storiesListingStorage: [],
  storiesListLoading: true,
  storyAllListingStorage: [],
  masterListingStorage: [],
  masterListingStorageNew: [],
  insightListing: [],
  podcastListing: [],
  podcastListingHome: [],
  trendingStories: [],
  blogDetail: null,
  isiFrameView: false,
  rules: null,
  isHindi: false,
  showHindButton: true,
  blogs: {
    stories: [],
    insights: [],
    podcasts: [],
  },
  categories: [],
  locationList: [],
  audioCategories: [],
  userDataTable: [],
  isLayoverPlayBtn: false,
  isVCardShow: false,
  isFlagBtn: false,
  filteredMasterListing: [],
  filterObject: {},
  hasMore: false,
  lastKey: ''
};

const onlyUnique = (value, index, self) => self.indexOf(value) === index;

const toSearchTerm = (payload) => {
  if (typeof payload === 'string') {
    return payload;
  }
  if (payload && typeof payload === 'object') {
    if ('target' in payload && payload.target && typeof payload.target.value === 'string') {
      return payload.target.value;
    }
    if ('value' in payload && typeof payload.value === 'string') {
      return payload.value;
    }
  }
  return '';
};

const filterCollectionByQuery = (collection, rawQuery) => {
  if (!Array.isArray(collection)) {
    return [];
  }

  const query = (rawQuery || '').trim().toLowerCase();

  if (!query || query.length < 2) {
    return collection.filter(Boolean);
  }

  const matches = [];

  collection.slice().forEach((item) => {
    if (!item || typeof item !== 'object') {
      return;
    }

    const name = item?.name ? String(item.name).trim().toLowerCase() : '';
    if (!name) {
      return;
    }

    if (query.includes(' ')) {
      if (name.includes(query)) {
        matches.push(item);
      }
    } else {
      name.split(' ').forEach((word) => {
        if (word.startsWith(query)) {
          matches.push(item);
        }
      });
    }
  });

  return matches.filter(onlyUnique);
};

const safeAxiosGet = async (url, rejectWithValue) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    const message = error?.response?.data ?? error?.message ?? 'Request failed';
    return rejectWithValue(message);
  }
};

export const fetchBlogs = createAsyncThunk('blog/fetchBlogs', async (_, { rejectWithValue }) =>
  // safeAxiosGet(`${API_BASE_URL}blog-home.json`, rejectWithValue),
  safeAxiosGet(`https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/stories-blog-home`, rejectWithValue),
);

export const fetchCategories = createAsyncThunk('blog/fetchCategories', async (_, { rejectWithValue }) =>
  // safeAxiosGet(`${API_BASE_URL_TOP}category.json`, rejectWithValue),
  safeAxiosGet(`https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/config_latest_category`, rejectWithValue),
);

export const fetchCity = createAsyncThunk('blog/fetchCity', async (_, { rejectWithValue }) =>
  // safeAxiosGet(`${API_BASE_URL_TOP}LocationMaster.json`, rejectWithValue),
  safeAxiosGet(`https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/locations`, rejectWithValue),
);

export const fetchCityNew = createAsyncThunk(
  "blog/fetchCityNew",
  async (lastKey, { rejectWithValue }) => {

    let url = `https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/locations?limit=100&lastKey=${encodeURIComponent(lastKey)}`;

    return safeAxiosGet(url, rejectWithValue);
  }
);

export const fetchAudioCategories = createAsyncThunk(
  'blog/fetchAudioCategories',
  // async (_, { rejectWithValue }) => safeAxiosGet(`${API_BASE_URL}audio-category.json`, rejectWithValue),
  async (_, { rejectWithValue }) => safeAxiosGet(`https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/audio-category?limit=54`, rejectWithValue),
);

export const fetchStoryDetail = createAsyncThunk(
  'blog/fetchStoryDetail',
  async (params, { rejectWithValue }) => {
    const { source, type = 'story' } =
      typeof params === 'string' ? { source: params, type: 'story' } : params || {};

    if (!source) {
      return rejectWithValue('Source is required to fetch story detail');
    }

    try {
      // const response = await axios.get(`${API_BASE_URL}${type}-detail/${source}.json`);
      // console.log('source', source);
      const response = await axios.get(`https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/story-detail/${source}`);
      return response.data;
    } catch (error) {
      const message = error?.response?.data ?? error?.message ?? 'Request failed';
      return rejectWithValue(message);
    }
  },
);

export const fetchStoryListing = createAsyncThunk(
  'blog/fetchStoryListing',
  async (params, { rejectWithValue }) => {
    const category = typeof params === 'string' ? params : params?.category;
    if (!category) {
      return rejectWithValue('Category is required to fetch story listing');
    }
    // return safeAxiosGet(`${category == 'top' ? 'https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/stories-top?limit=60' : `${API_BASE_URL_TOP}category-index/${category}.json`}`, rejectWithValue);
     return safeAxiosGet(`https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/config_latest_category_detail/${category}`, rejectWithValue);
    // return safeAxiosGet(`${API_BASE_URL_TOP}category-index/${category}.json`, rejectWithValue);
  },
);

export const fetchStoriesListing = createAsyncThunk(
  'blog/fetchStoriesListing',
  async (params, { rejectWithValue }) => {
    const category = typeof params === 'string' ? params : params?.category;
    if (!category) {
      return rejectWithValue('Category is required to fetch stories listing');
    }
    return safeAxiosGet(`https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/categories/${category}`, rejectWithValue);
    // https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/categories/technology
    // return safeAxiosGet(`${category == 'top' ? 'https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/stories-top?limit=60' : `https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/categories/${category}`}`, rejectWithValue);
    // return safeAxiosGet(`https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/${category == 'top' ? 'stories-top?limit=60' : `categories/${category}`}`, rejectWithValue);
  },
);

export const fetchStoriesListingNew = createAsyncThunk(
  "blog/fetchStoriesListingNew",
  async (params, { rejectWithValue }) => {
    const category = typeof params === 'string' ? params : params?.categoryNew;

    let url = `https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/categories/${category}?name=${encodeURIComponent(params.value)}`;

    return safeAxiosGet(url, rejectWithValue);
  }
);

export const fetchMasterListing = createAsyncThunk('blog/fetchMasterListing', async (_, { rejectWithValue }) =>
  safeAxiosGet(`https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/stories?limit=60`, rejectWithValue),
);

export const fetchMasterListingNew = createAsyncThunk(
  "blog/fetchMasterListingNew",
  async (name, { rejectWithValue }) => {

    let url = `https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/stories?name=${encodeURIComponent(name)}`;

    return safeAxiosGet(url, rejectWithValue);
  }
);

export const fetchStoryListingByLocation = createAsyncThunk(
  'blog/fetchStoryListingByLocation',
  async (params, { rejectWithValue }) => {
    const city = typeof params === 'string' ? params : params?.city;
    if (!city) {
      return rejectWithValue('City is required to fetch listing');
    }
    const sanitized = city.replace(/-/g, '_');
    // return safeAxiosGet(`${API_BASE_URL_TOP}locations/${sanitized}.json`, rejectWithValue);
    return safeAxiosGet(`https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/config_latest_locations/${sanitized}`, rejectWithValue);
    // return safeAxiosGet(`https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/config-latest-locations-${sanitized}?limit=100`, rejectWithValue);
  },
);

export const fetchAllListingByLocation = createAsyncThunk(
  'blog/fetchAllListingByLocation',
  async (params, { rejectWithValue }) => {
    const city = typeof params === 'string' ? params : params?.city;
    if (!city) {
      return rejectWithValue('City is required to fetch all listings');
    }
    const sanitized = city.replace(/-/g, '_');
    // return safeAxiosGet(`${API_BASE_URL}locations/${sanitized}.json`, rejectWithValue);
    return safeAxiosGet(`https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/locations/${sanitized}?name=${encodeURIComponent(params.value)}`, rejectWithValue);
  },
);

export const fetchStoryTags = createAsyncThunk(
  'blog/fetchStoryTags',
  async (params, { rejectWithValue }) => {
    const category = typeof params === 'string' ? params : params?.category;
    if (!category) {
      return rejectWithValue('Category is required to fetch story tags');
    }
    const sanitized = category.replace(/-/g, '_');
    return safeAxiosGet(`${API_BASE_URL}tags/${sanitized}.json`, rejectWithValue);
    // return safeAxiosGet(`https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/${sanitized}?limit=100`, rejectWithValue);
  },
);

export const fetchInsightListing = createAsyncThunk('blog/fetchInsightListing', async (_, { rejectWithValue }) =>
  safeAxiosGet(`https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/insightlisting`, rejectWithValue),
  // safeAxiosGet(`${API_BASE_URL}insightlisting.json`, rejectWithValue),
);

export const fetchHomePodcastListing = createAsyncThunk(
  'blog/fetchHomePodcastListing',
  async (params, { rejectWithValue }) => {
    const category = typeof params === 'string' ? params : params?.category ?? 'top';
    // return safeAxiosGet(`${API_BASE_URL}audio-category-index/${category}.json`, rejectWithValue);
    return safeAxiosGet(`https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/audio_category_index/${category}`, rejectWithValue);
  },
);

export const fetchPodcastListing = createAsyncThunk(
  'blog/fetchPodcastListing',
  async (params, { rejectWithValue }) => {
    const category = typeof params === 'string' ? params : params?.category;
    if (!category) {
      return rejectWithValue('Category is required to fetch podcast listing');
    }
    // return safeAxiosGet(`${API_BASE_URL}audio-category-index/${category}.json`, rejectWithValue);
    return safeAxiosGet(`https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/audio_category_index/${category}`, rejectWithValue);
  },
);

export const fetchTrendingStories = createAsyncThunk('blog/fetchTrendingStories', async (_, { rejectWithValue }) =>
  // safeAxiosGet(`${API_BASE_URL}trending.json`, rejectWithValue),
  safeAxiosGet(`https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/stories-trending?limit=100`, rejectWithValue),
);

export const fetchBlogRules = createAsyncThunk('blog/fetchBlogRules', async (_, { rejectWithValue }) =>
  // safeAxiosGet(`https://workmob-v3.s3.ap-south-1.amazonaws.com/asset_urls/video_questions.json`, rejectWithValue),
  safeAxiosGet(`https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/video_questions`, rejectWithValue),
);

export const fetchUserDataTable = createAsyncThunk(
  'blog/fetchUserDataTable',
  async (params, { rejectWithValue }) => {
    const { onComplete } = typeof params === 'function' ? { onComplete: params } : params || {};
    try {
      const response = await axios.get(
        'https://s3.ap-south-1.amazonaws.com/yourstories.workmob.com/userdata.json',
      );
      onComplete?.(true);
      return response.data;
    } catch (error) {
      onComplete?.(false);
      const message = error?.response?.data ?? error?.message ?? 'Request failed';
      return rejectWithValue(message);
    }
  },
);

export const uploadVideoFile = createAsyncThunk(
  'blog/uploadVideoFile',
  async (params, { rejectWithValue }) => {
    const { filePath, file, onProgress } = params || {};
    if (!filePath || !file) {
      return rejectWithValue('filePath and file are required for upload');
    }

    try {
      const response = await axios.post(
        'https://jxkzj2iz23.execute-api.ap-south-1.amazonaws.com/storyup',
        {
          object_key: `${filePath}`,
        },
      );

      const signedVideoUrl = response.data.url;

      await axios.put(signedVideoUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
        onUploadProgress: (event) => {
          if (typeof onProgress === 'function' && event.total) {
            const percentCompleted = Math.round((event.loaded * 100) / event.total);
            onProgress(percentCompleted);
          }
        },
      });

      if (typeof onProgress === 'function') {
        onProgress(100);
      }

      return true;
    } catch (error) {
      if (typeof onProgress === 'function') {
        onProgress(-1);
      }
      const message = error?.response?.data ?? error?.message ?? 'Upload failed';
      return rejectWithValue(message);
    }
  },
);

const blogSlice = createSlice({
  name: 'blog',
  initialState: INITIAL_STATE,
  reducers: {
    filterStoryListing(state, action) {
      const query = toSearchTerm(action.payload);
      const filtered = filterCollectionByQuery(state.storyListingStorage, query);
      state.storyListing = filtered.filter(Boolean);
    },
    filterAllStoryListing(state, action) {
      const query = toSearchTerm(action.payload);
      const source =
        typeof query === 'string' && query.length === 0
          ? state.storyListingStorage
          : state.storyAllListingStorage;
      const filtered = filterCollectionByQuery(source, query);
      state.storyListing = filtered.filter(Boolean);
    },
    filterMasterListing(state, action) {
      const query = toSearchTerm(action.payload);
      const filtered = filterCollectionByQuery(state.masterListingStorage, query);
      state.storyListing = filtered.filter(Boolean);
    },
    setHindiView(state, action) {
      state.isHindi = Boolean(action.payload);
    },
    setIframeView(state, action) {
      state.isiFrameView = Boolean(action.payload);
    },
    setHindiButtonView(state, action) {
      state.showHindButton = Boolean(action.payload);
    },
    setLayoverPlayBtn(state, action) {
      state.isLayoverPlayBtn = Boolean(action.payload);
    },
    setVCard(state, action) {
      state.isVCardShow = Boolean(action.payload);
    },
    setFlagBtn(state, action) {
      state.isFlagBtn = Boolean(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.blogs.stories = Array.isArray(action?.payload?.data) ? action?.payload?.data : [];
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        const payload = Array.isArray(action?.payload?.categories) ? action?.payload?.categories : [];
        const arr1 = payload.filter((entry) => entry?.category === 'top');
        const arrOther = payload.filter((entry) => entry?.category === 'other');
        const arr2 = payload.filter(
          (entry) => entry?.category !== 'top' && entry?.category !== 'other',
        );
        const arranged = [...arr1, ...orderBy(arr2), ...arrOther];
        state.categories = arranged;
      })
      .addCase(fetchCity.fulfilled, (state, action) => {
        state.locationList = Array.isArray(action.payload.locations) ? action.payload.locations : [];
        state.hasMore = action.payload.hasMore;
        state.lastKey = action.payload.lastKey;
      })
      .addCase(fetchCityNew.fulfilled, (state, action) => {
        const newLocations = Array.isArray(action.payload.locations)
          ? action.payload.locations
          : [];

        if (state.hasMore) {
          // next page -> append
          state.locationList = [...state.locationList, ...newLocations];
        } else {
          // first load
          state.locationList = newLocations;
        }
        state.hasMore = action.payload.hasMore;
        state.lastKey = action.payload.lastKey;
      })
      .addCase(fetchAudioCategories.fulfilled, (state, action) => {
        const payload = Array.isArray(action.payload.data) ? action.payload.data : [];
        const arr1 = payload.filter((entry) => entry?.category === 'top');
        const arrOther = payload.filter((entry) => entry?.category === 'other');
        const arr2 = payload.filter(
          (entry) => entry?.category !== 'top' && entry?.category !== 'other',
        );
        const arranged = [
          ...arr1,
          ...orderBy(arr2, ['category'], ['asc']),
          ...arrOther,
        ];
        state.audioCategories = arranged;
      })
      .addCase(fetchStoryDetail.pending, (state) => {
        state.blogLoading = true;
      })
      .addCase(fetchStoryDetail.fulfilled, (state, action) => {
        state.blogDetail = action.payload ?? null;
        state.blogLoading = false;
      })
      .addCase(fetchStoryDetail.rejected, (state) => {
        state.blogLoading = false;
      })
      .addCase(fetchStoryListing.pending, (state) => {
        state.storyListLoading = true;
      })
      .addCase(fetchStoryListing.fulfilled, (state, action) => {
        const data = Array.isArray(action?.payload?.stories) ? action?.payload?.stories : [];
        // const data = Array.isArray(action?.meta?.arg == 'top' ? action?.payload?.data : action?.payload) ? action?.meta?.arg == 'top' ? action?.payload?.data : action?.payload : [];
        state.storyListing = data;
        state.storyListingStorage = data;
        state.storyListLoading = false;
      })
      .addCase(fetchStoryListing.rejected, (state) => {
        state.storyListLoading = false;
      })
      .addCase(fetchStoriesListing.pending, (state) => {
        state.storiesListLoading = true;
      })
      .addCase(fetchStoriesListing.fulfilled, (state, action) => {
        const data = Array.isArray(action?.payload.data) ? action?.payload.data : [];
        // const data = Array.isArray(action?.payload?.stories) ? action?.payload?.stories : [];
        state.storiesListing = data;
        state.storiesListingStorage = data;
        state.storiesListLoading = false;
      })
      .addCase(fetchStoriesListing.rejected, (state) => {
        state.storiesListLoading = false;
      })
      .addCase(fetchStoriesListingNew.pending, (state) => {
        state.storiesListLoading = true;
      })
      .addCase(fetchStoriesListingNew.fulfilled, (state, action) => {
        const data = Array.isArray(action?.payload.data) ? action?.payload.data : [];
        // const data = Array.isArray(action?.payload?.stories) ? action?.payload?.stories : [];
        state.storiesListing = data;
        state.storiesListingStorage = data;
        state.storiesListLoading = false;
      })
      .addCase(fetchStoriesListingNew.rejected, (state) => {
        state.storiesListLoading = false;
      })
      .addCase(fetchAllListingByLocation.pending, (state) => {
        state.storyAllListLoading = true;
      })
      .addCase(fetchAllListingByLocation.fulfilled, (state, action) => {
        const data = Array.isArray(action.payload.stories) ? action.payload.stories : [];
        state.storyAllListing = data;
        state.storyAllListingStorage = data;
        state.storyAllListLoading = false;
      })
      .addCase(fetchAllListingByLocation.rejected, (state) => {
        state.storyAllListLoading = false;
      })
      .addCase(fetchMasterListing.pending, (state) => {
        state.masterListLoading = true;
      })
      .addCase(fetchMasterListing.fulfilled, (state, action) => {
        const data = Array.isArray(action.payload) ? action.payload : [];
        state.masterListing = data;
        state.masterListingStorage = data;
        state.masterListLoading = false;
      })
      .addCase(fetchMasterListing.rejected, (state) => {
        state.masterListLoading = false;
      })
      .addCase(fetchMasterListingNew.pending, (state) => {
        state.masterListLoading = true;
        state.masterListLoadingNew = true;
      })
      .addCase(fetchMasterListingNew.fulfilled, (state, action) => {
        const data = Array.isArray(action.payload.data) ? action.payload.data : [];
        state.masterListing = data;
        state.masterListingStorage = data;
        state.masterListLoading = false;
        state.masterListLoadingNew = false;
      })
      .addCase(fetchMasterListingNew.rejected, (state) => {
        state.masterListLoading = false;
        state.masterListLoadingNew = false;
      })
      .addCase(fetchStoryListingByLocation.pending, (state) => {
        state.storyListLoading = true;
      })
      .addCase(fetchStoryListingByLocation.fulfilled, (state, action) => {
        const data = Array.isArray(action.payload.data) ? action.payload.data : [];
        // const data = Array.isArray(action.payload) ? action.payload : [];
        state.storyListing = data;
        state.storyListingStorage = data;
        state.storyListLoading = false;
      })
      .addCase(fetchStoryListingByLocation.rejected, (state) => {
        state.storyListLoading = false;
      })
      .addCase(fetchStoryTags.pending, (state) => {
        state.storyListLoading = true;
      })
      .addCase(fetchStoryTags.fulfilled, (state, action) => {
        const data = Array.isArray(action.payload) ? action.payload : [];
        state.storyListing = data;
        state.storyListingStorage = data;
        state.storyListLoading = false;
      })
      .addCase(fetchStoryTags.rejected, (state) => {
        state.storyListLoading = false;
      })
      .addCase(fetchInsightListing.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInsightListing.fulfilled, (state, action) => {
        state.insightListing = Array.isArray(action.payload.data) ? action.payload.data : [];
        state.loading = false;
      })
      .addCase(fetchInsightListing.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchHomePodcastListing.fulfilled, (state, action) => {
        state.podcastListingHome = Array.isArray(action?.payload?.tags) ? action?.payload?.tags : [];
      })
      .addCase(fetchPodcastListing.pending, (state) => {
        state.storyListLoading = true;
      })
      .addCase(fetchPodcastListing.fulfilled, (state, action) => {
        state.podcastListing = Array.isArray(action?.payload?.tags) ? action?.payload?.tags : [];
        state.storyListLoading = false;
      })
      .addCase(fetchPodcastListing.rejected, (state) => {
        state.storyListLoading = false;
      })
      .addCase(fetchTrendingStories.fulfilled, (state, action) => {
        state.trendingStories = Array.isArray(action.payload.data) ? action.payload.data : [];
      })
      .addCase(fetchBlogRules.fulfilled, (state, action) => {
        state.rules = action.payload.data[0] ?? null;
      })
      .addCase(fetchUserDataTable.fulfilled, (state, action) => {
        state.userDataTable = Array.isArray(action.payload) ? action.payload : [];
      })
  },
});

export const {
  filterStoryListing,
  filterAllStoryListing,
  filterMasterListing,
  setHindiView,
  setIframeView,
  setHindiButtonView,
  setLayoverPlayBtn,
  setVCard,
  setFlagBtn,
} = blogSlice.actions;

export default blogSlice.reducer;
