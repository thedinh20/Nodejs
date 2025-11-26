import { useAuthStore } from '@/stores/useAuthStore';
import axios from 'axios';


const api = axios.create({
    baseURL: 
        import.meta.env.MODE === 'development' ? 'http://localhost:5001/api' : '/api',
    withCredentials: true,

});

// gan access token 
api.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    };
    
    return config;
});

// tu dong lam moi access token neu het han
api.interceptors.response.use((res) => res, async (error) => {
    const originalRequest = error.config;
    // kiem tra neu la loi 401 va chua duoc lam moi
    if(originalRequest.url.includes("/auth/signin") ||
       originalRequest.url.includes("/auth/refresh") || 
       originalRequest.url.includes("/auth/signup")
    ) {
        return Promise.reject(error);
    }

    originalRequest._retryCount = originalRequest._retryCount || 0;

    if (error.response?.status === 403  && originalRequest._retryCount < 4) {
        originalRequest._retryCount += 1;
        console.log('Refreshing access token...', originalRequest._retryCount);
        try {
            const res = await api.post('/auth/refresh', {}, {withCredentials: true});
            const newAccessToken = res.data.accessToken;

            // cap nhat access token moi vao store
            useAuthStore.getState().setAccessToken(newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            useAuthStore.getState().clearState();
            return Promise.reject(refreshError);
        }}
    return Promise.reject(error);
});



export default api;