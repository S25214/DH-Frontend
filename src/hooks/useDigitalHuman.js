import { useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook to manage DigitalHuman SDK lifecycle
 * @param {string} appId - The DigitalHuman app/stream ID
 * @param {Object} options - SDK initialization options
 * @returns {Object} SDK control methods
 */
export const useDigitalHuman = (appId, options = {}) => {
    const containerRef = useRef(null);
    const isInitialized = useRef(false);

    /**
     * Initialize the DigitalHuman SDK
     */
    const init = useCallback(() => {
        if (!appId || isInitialized.current) return;

        try {
            if (window.DigitalHuman) {
                const initOptions = {
                    autoUnmute: false,
                    showUI: true,
                    lookAt: false,
                    microphone: true,
                    ...options,
                };

                // If custom container is provided, use it
                if (containerRef.current) {
                    initOptions.container = containerRef.current;
                } else {
                    console.warn('DigitalHuman: No container ref provided, falling back to default container.');
                }

                window.DigitalHuman.init(appId, initOptions);
                isInitialized.current = true;
            } else {
                console.error('DigitalHuman SDK not loaded');
            }
        } catch (error) {
            console.error('Error initializing DigitalHuman:', error);
        }
    }, [appId, options]);

    /**
     * Disconnect and cleanup
     */
    const disconnect = useCallback(() => {
        if (!isInitialized.current) return;

        try {
            if (window.DigitalHuman && window.DigitalHuman.disconnect) {
                window.DigitalHuman.disconnect();
                isInitialized.current = false;
            }
        } catch (error) {
            console.error('Error disconnecting DigitalHuman:', error);
        }
    }, []);

    /**
     * Set configuration ID
     */
    const setConfigID = useCallback((configId) => {
        if (!isInitialized.current) {
            console.warn('SDK not initialized');
            return;
        }

        try {
            if (window.DigitalHuman && window.DigitalHuman.setConfigID) {
                window.DigitalHuman.setConfigID(configId);
            }
        } catch (error) {
            console.error('Error setting config ID:', error);
        }
    }, []);

    /**
     * Send TTS job
     */
    const sendJob = useCallback((text, callbackUrl, authToken, customParams = {}) => {
        if (!isInitialized.current) {
            console.warn('SDK not initialized');
            return;
        }

        try {
            if (window.DigitalHuman && window.DigitalHuman.sendJob) {
                window.DigitalHuman.sendJob(text, callbackUrl, authToken, customParams);
            }
        } catch (error) {
            console.error('Error sending job:', error);
        }
    }, []);

    /**
     * Send generic message
     */
    const sendMessage = useCallback((message) => {
        if (!isInitialized.current) {
            console.warn('SDK not initialized');
            return;
        }

        try {
            if (window.DigitalHuman && window.DigitalHuman.sendMessage) {
                window.DigitalHuman.sendMessage(message);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }, []);

    /**
     * Control gaze direction
     */
    const lookAt = useCallback((faces, x, y) => {
        if (!isInitialized.current) {
            console.warn('SDK not initialized');
            return;
        }

        try {
            if (window.DigitalHuman && window.DigitalHuman.lookAt) {
                window.DigitalHuman.lookAt(faces, x, y);
            }
        } catch (error) {
            console.error('Error controlling lookAt:', error);
        }
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return {
        containerRef,
        init,
        disconnect,
        setConfigID,
        sendJob,
        sendMessage,
        lookAt,
        isInitialized: isInitialized.current,
    };
};

export default useDigitalHuman;
