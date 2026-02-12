import { useEffect } from 'react';
import { onAuthChange, exchangeTokenForBotnoi, getBotnoiToken } from '../services/authService';

/**
 * Custom hook to maintain authentication state
 * Listens for Firebase auth changes and ensures Botnoi token is valid
 */
export const useAuth = () => {
    useEffect(() => {
        const unsubscribe = onAuthChange(async (user) => {
            if (user) {
                // User is signed in with Firebase
                const botnoiToken = getBotnoiToken();

                // If we don't have a Botnoi token, exchange for one
                if (!botnoiToken) {
                    try {
                        await exchangeTokenForBotnoi(user);
                    } catch (error) {
                        console.error('Failed to re-exchange token:', error);
                    }
                }
            }
            // If user is null, they're signed out - token already cleared
        });

        return () => unsubscribe();
    }, []);
};

export default useAuth;
