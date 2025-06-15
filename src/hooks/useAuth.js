import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, register } from "../API/authService";

export const useRegister = () => {
    return useMutation({
        mutationFn: register,
        onSuccess: (data) => {
            console.log('registration successful', data);
        },
        onError: (error) => {
            console.log('registration failed', error);
        }
    });
};

export const useLogin = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            console.log('login successful', data);
            
            // Handle different token response formats
            let token = null;
            if (typeof data === 'string') {
                // If the response is directly a token string
                token = data;
            } else if (data.token) {
                // If the response has a token property
                token = data.token;
            } else if (data.access_token) {
                // Alternative token property name
                token = data.access_token;
            }
            
            if (token) {
                localStorage.setItem('token', token);
                console.log('Token stored successfully');
                
                // Invalidate and refetch all queries to use the new token
                queryClient.invalidateQueries();
            } else {
                console.error('No token found in login response:', data);
            }
        },
        onError: (error) => {
            console.log('login failed', error);
            // Clear any existing token on login failure
            localStorage.removeItem('token');
        }
    });
};

// Utility hook for authentication state
export const useAuth = () => {
    const queryClient = useQueryClient();
    
    const token = localStorage.getItem('token');
    const isAuthenticated = !!token;
    
    const logout = () => {
        localStorage.removeItem('token');
        queryClient.clear(); // Clear all cached queries
        // Optionally redirect to login
        // window.location.href = '/login';
    };
    
    return {
        isAuthenticated,
        token,
        logout
    };
};