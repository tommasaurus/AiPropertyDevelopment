// api.js
import axios from "axios";

// Set up the base Axios instance
const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // Ensures cookies (refresh token) are included with requests
});

// Function to store and retrieve tokens
function getAccessToken() {
  return localStorage.getItem("access_token");
}

function setAccessToken(token) {
  localStorage.setItem("access_token", token);
}

function clearAccessToken() {
  localStorage.removeItem("access_token");
}

// Function to refresh access token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

async function refreshAccessToken() {
  try {
    const response = await axios.post(
      "http://localhost:8000/auth/refresh",
      {},
      {
        withCredentials: true, // Ensure cookies are sent
      }
    );
    const { access_token } = response.data;
    setAccessToken(access_token);
    api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    processQueue(null, access_token);
    return access_token;
  } catch (error) {
    processQueue(error, null);
    clearAccessToken();
    throw error;
  }
}

// Request interceptor to add access token to request headers
api.interceptors.request.use(
  async (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors and token refresh
api.interceptors.response.use(
  (response) => response, // Return response if successful
  (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop by checking if the request is already a retry
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // Prevent multiple refresh attempts
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(function (resolve, reject) {
        refreshAccessToken()
          .then((newToken) => {
            originalRequest.headers["Authorization"] = "Bearer " + newToken;
            resolve(api(originalRequest));
          })
          .catch((err) => {
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
