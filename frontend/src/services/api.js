import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const getCategories = () => {
    return axiosInstance.get('/categories/')
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching categories:', error);
            throw error;
        });
};

export default axiosInstance;