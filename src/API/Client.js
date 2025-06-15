import axios from "axios";
import https from 'https';

// Create a more detailed debugging client
const apiClient = axios.create({
    baseURL: "https://localhost:7246",
    headers: {
        'Content-Type': 'application/json'
    },
    // httpsAgent: new https.Agent({  
    //     rejectUnauthorized: false
    // }),
    // // Allow credentials (cookies) to be sent if needed
    // withCredentials: true,
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(request => {
    // Add token to headers if it exists
    const token = localStorage.getItem('token');
    if (token) {
        request.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Starting Request:', {
        method: request.method,
        url: request.url,
        baseURL: request.baseURL,
        headers: request.headers
    });
    return request;
});

// Add response and error interceptors for debugging
apiClient.interceptors.response.use(
    response => {
        console.log('Response received:', {
            status: response.status,
            statusText: response.statusText,
            data: response.data
        });
        return response;
    },
    error => {
        console.error('Request failed:', error.message);
        
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error('Error details:', {
                data: error.response.data,
                status: error.response.status,
                headers: error.response.headers
            });
                  // Handle 401 Unauthorized - token expired or invalid
            if (error.response.status === 401) {
                console.warn('Authentication failed - removing token');
                localStorage.removeItem('token');
                // Optionally redirect to login page
                // window.location.href = '/authPage';
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error setting up request:', error.message);
        }
        
        return Promise.reject(error);
    }
);

console.log("API Client configured with baseURL:", apiClient.defaults.baseURL);
export default apiClient;