import { getBotnoiToken } from './authService';

// API Endpoints
const API_ENDPOINTS = {
    dh: 'https://dhconfig-zb2xurnl2a-as.a.run.app/dhConfig',
    a2f: 'https://dha2fconfig-zb2xurnl2a-as.a.run.app/dhA2fConfig',
    customize: 'https://dhcustomize-zb2xurnl2a-as.a.run.app/dhCustomize',
};

/**
 * Get API URL based on config type
 * @param {string} type - Config type: 'dh', 'a2f', or 'customize'
 */
const getApiUrl = (type) => {
    return API_ENDPOINTS[type] || API_ENDPOINTS.dh;
};

/**
 * Get authorization headers
 */
const getAuthHeaders = () => {
    const token = getBotnoiToken();
    if (!token) {
        throw new Error('Not authenticated. Please log in.');
    }
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
};

/**
 * Fetch all configs of a specific type
 * @param {string} type - Config type: 'dh', 'a2f', or 'customize'
 * @returns {Promise<Array>} Array of config IDs
 */
export const fetchConfigs = async (type = 'dh') => {
    try {
        const url = `${getApiUrl(type)}?config_id=listall`;
        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Failed to fetch configs: ${response.statusText}`);
        }

        const data = await response.json();
        return data.configs || [];
    } catch (error) {
        console.error('Error fetching configs:', error);
        throw error;
    }
};

/**
 * Load a specific config by ID
 * @param {string} type - Config type: 'dh', 'a2f', or 'customize'
 * @param {string} configId - Config ID to load
 * @returns {Promise<Object>} Config data
 */
export const loadConfig = async (type = 'dh', configId) => {
    try {
        const url = `${getApiUrl(type)}?config_id=${configId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Failed to load config: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading config:', error);
        throw error;
    }
};

/**
 * Save a config (create or update)
 * @param {string} type - Config type: 'dh', 'a2f', or 'customize'
 * @param {Object} payload - Config data to save
 * @returns {Promise<Object>} Response data
 */
export const saveConfig = async (type = 'dh', payload) => {
    try {
        const url = getApiUrl(type);
        const response = await fetch(url, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Failed to save config: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error saving config:', error);
        throw error;
    }
};

/**
 * Delete a config by ID
 * @param {string} type - Config type: 'dh', 'a2f', or 'customize'
 * @param {string} configId - Config ID to delete
 * @returns {Promise<Object>} Response data
 */
export const deleteConfig = async (type = 'dh', configId) => {
    try {
        const url = `${getApiUrl(type)}?config_id=${configId}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Failed to delete config: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting config:', error);
        throw error;
    }
};
