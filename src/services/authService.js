import {
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './firebase';

const BOTNOI_TOKEN_KEY = 'botnoi_token';
const TOKEN_EXCHANGE_URL = 'https://api-voice.botnoi.ai/api/dashboard/firebase_auth';

/**
 * Sign in with Google
 */
export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        // Exchange Firebase token for Botnoi token
        await exchangeTokenForBotnoi(result.user);
        return result.user;
    } catch (error) {
        console.error('Error signing in with Google:', error);
        throw error;
    }
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email, password) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        // Exchange Firebase token for Botnoi token
        await exchangeTokenForBotnoi(result.user);
        return result.user;
    } catch (error) {
        console.error('Error signing in with email:', error);
        throw error;
    }
};

/**
 * Create new account with email and password
 */
export const createAccount = async (email, password) => {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        // Exchange Firebase token for Botnoi token
        await exchangeTokenForBotnoi(result.user);
        return result.user;
    } catch (error) {
        console.error('Error creating account:', error);
        throw error;
    }
};

/**
 * Sign out
 */
export const signOut = async () => {
    try {
        await firebaseSignOut(auth);
        clearTokens();
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
};

/**
 * Exchange Firebase ID Token for Botnoi Token
 * @param {Object} user - Firebase user object
 */
export const exchangeTokenForBotnoi = async (user) => {
    if (!user) {
        throw new Error('No user provided for token exchange');
    }

    try {
        // Get Firebase ID token
        const firebaseToken = await user.getIdToken();

        // Exchange for Botnoi token
        const response = await fetch(TOKEN_EXCHANGE_URL, {
            method: 'GET',
            headers: {
                'botnoi-token': `Bearer ${firebaseToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Token exchange failed: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.token) {
            throw new Error('No token received from Botnoi API');
        }

        // Store Botnoi token in sessionStorage
        sessionStorage.setItem(BOTNOI_TOKEN_KEY, data.token);

        return data.token;
    } catch (error) {
        console.error('Error exchanging token:', error);
        throw error;
    }
};

/**
 * Get the current Botnoi token from storage
 */
export const getBotnoiToken = () => {
    return sessionStorage.getItem(BOTNOI_TOKEN_KEY);
};

/**
 * Clear all tokens from storage
 */
export const clearTokens = () => {
    sessionStorage.removeItem(BOTNOI_TOKEN_KEY);
};

/**
 * Listen to auth state changes
 * @param {Function} callback - Callback function to receive user updates
 */
export const onAuthChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};

/**
 * Check if user is authenticated with Botnoi token
 */
export const isAuthenticated = () => {
    return !!getBotnoiToken();
};
