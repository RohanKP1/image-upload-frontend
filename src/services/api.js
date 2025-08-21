import axios from 'axios';

const API_URL = 'http://http://13.233.117.180:8000/api/v1'; // Adjust if your backend runs on a different URL

const api = axios.create({
  baseURL: API_URL,
});

export const login = async (username, password) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  const response = await api.post('/auth/token', formData);
  return response.data;
};

export const getImages = async (token) => {
  const response = await api.get('/images', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// uploadImage now accepts: File, FileList, or Array<File>
// - For single File: appended as 'file' (backwards compatible)
// - For multiple files: appended as repeated 'files' fields
export const uploadImage = async (files, token) => {
  const formData = new FormData();

  // single File
  if (files instanceof File) {
    formData.append('file', files);
  } else if (files instanceof FileList || Array.isArray(files)) {
    // multiple files => append as 'files' (repeatable)
    for (const f of files) {
      formData.append('files', f);
    }
  } else {
    throw new Error('uploadImage expects a File, FileList or Array<File>');
  }

  const response = await api.post('/images/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Accepts options for clustering
export const getClusters = async (token, options = {
  algorithm: 'hierarchical',
  n_clusters: 3,
  generate_names: true,
}) => {
  const response = await api.post('/images/cluster', options, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const signup = async (username, password) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  const response = await api.post('/auth/signup', formData);
  return response.data;
};

// Triggers clustering (does not return clusters)
export const triggerClustering = async (token, options = {
  algorithm: 'hierarchical',
  n_clusters: 3,
  generate_names: true,
}) => {
  await api.post('/images/cluster', options, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Gets stored clusters
export const getStoredClusters = async (token) => {
  const response = await api.get('/images/clusters', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
