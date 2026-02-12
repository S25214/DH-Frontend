import { useState, useEffect } from 'react';
import useDigitalHuman from '../hooks/useDigitalHuman';
import { fetchConfigs } from '../services/apiService';
import { useToast } from '../components/Toast';

export const ConnectPage = () => {
    const { showToast, ToastContainer } = useToast();
    const [configs, setConfigs] = useState([]);
    const [selectedConfig, setSelectedConfig] = useState('');
    const [appId, setAppId] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(false);

    const { containerRef, init, disconnect, setConfigID, sendJob } = useDigitalHuman(appId);

    // Load configs on mount
    useEffect(() => {
        loadConfigs();
    }, []);

    const loadConfigs = async () => {
        try {
            const configList = await fetchConfigs('dh');
            setConfigs(configList);
        } catch (error) {
            showToast(error.message || 'Failed to load configs', 'error');
        }
    };

    const handleConnect = () => {
        if (!appId) {
            showToast('Please enter an App ID', 'error');
            return;
        }

        setLoading(true);
        try {
            init();
            if (selectedConfig) {
                setConfigID(selectedConfig);
            }
            setIsConnected(true);
            showToast('Connected successfully!', 'success');
        } catch (error) {
            showToast(error.message || 'Failed to connect', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDisconnect = () => {
        disconnect();
        setIsConnected(false);
        showToast('Disconnected', 'success');
    };

    const handleTestTTS = () => {
        if (!isConnected) {
            showToast('Please connect first', 'error');
            return;
        }

        // This is a test - users should provide their actual TTS API endpoint
        showToast('TTS test - implement your TTS API endpoint', 'error');
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-body)' }}>
            <ToastContainer />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-text-main mb-8">Connect to DigitalHuman</h1>

                {/* Connection Form */}
                <div
                    className="p-6 rounded-xl mb-8 border"
                    style={{
                        backgroundColor: 'var(--bg-panel)',
                        borderColor: 'var(--border)',
                    }}
                >
                    <h2 className="text-xl font-semibold text-text-main mb-4">Connection Settings</h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">
                                App ID (Stream ID) <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                value={appId}
                                onChange={(e) => setAppId(e.target.value)}
                                disabled={isConnected}
                                placeholder="Enter your DigitalHuman App ID"
                                className="w-full px-4 py-3 rounded-lg"
                                style={{
                                    backgroundColor: 'var(--bg-input)',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text-main)',
                                }}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">
                                Config (Optional)
                            </label>
                            <select
                                value={selectedConfig}
                                onChange={(e) => setSelectedConfig(e.target.value)}
                                disabled={isConnected}
                                className="w-full px-4 py-3 rounded-lg"
                                style={{
                                    backgroundColor: 'var(--bg-input)',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text-main)',
                                }}
                            >
                                <option value="">-- Select a config --</option>
                                {configs.map((config) => (
                                    <option key={config} value={config}>
                                        {config}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 flex space-x-4">
                        {!isConnected ? (
                            <button
                                onClick={handleConnect}
                                disabled={loading || !appId}
                                className="px-6 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: 'var(--success)' }}
                            >
                                {loading ? 'Connecting...' : 'Connect'}
                            </button>
                        ) : (
                            <button
                                onClick={handleDisconnect}
                                className="px-6 py-3 rounded-lg font-semibold text-white transition-all"
                                style={{ backgroundColor: 'var(--danger)' }}
                            >
                                Disconnect
                            </button>
                        )}

                        <button
                            onClick={handleTestTTS}
                            disabled={!isConnected}
                            className="px-6 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50"
                            style={{ backgroundColor: 'var(--primary)' }}
                        >
                            Test TTS
                        </button>
                    </div>

                    {isConnected && (
                        <div className="mt-4 px-4 py-2 rounded-lg inline-block" style={{ backgroundColor: 'var(--success)', opacity: 0.2 }}>
                            <span className="text-success font-medium">● Connected</span>
                        </div>
                    )}
                </div>

                {/* SDK Container */}
                <div
                    className="rounded-xl border overflow-hidden"
                    style={{
                        backgroundColor: 'var(--bg-panel)',
                        borderColor: 'var(--border)',
                        minHeight: '600px',
                    }}
                >
                    {/* Main Container for DigitalHuman */}
                    <div ref={containerRef} className="w-full h-full min-h-[600px]" style={{ display: isConnected ? 'block' : 'none' }} />

                    {/* Placeholder / Connect Prompt */}
                    {!isConnected && (
                        <div className="flex items-center justify-center h-[600px]">
                            <div className="text-center">
                                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-bg-input flex items-center justify-center">
                                    <span className="text-5xl text-text-muted">🎭</span>
                                </div>
                                <p className="text-text-muted text-lg">Enter an App ID and click Connect to start</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConnectPage;
