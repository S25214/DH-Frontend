import { useState, useEffect } from 'react';
import useDigitalHuman from '../hooks/useDigitalHuman';
import { fetchConfigs, loadConfig, saveConfig } from '../services/apiService';
import { useToast } from '../components/Toast';
import { ASR_PROVIDERS, TTS_PROVIDERS, ASR_LANGUAGES, TTS_LANGUAGES } from '../constants/dhConstants';

export const ConnectPage = () => {
    const { showToast, ToastContainer } = useToast();
    const [configs, setConfigs] = useState([]);
    const [selectedConfig, setSelectedConfig] = useState('');
    const [appId, setAppId] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(false);

    // New state for redesign
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [configData, setConfigData] = useState(null);

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

    const handleConnect = async () => {
        if (!appId) {
            showToast('Please enter an App ID', 'error');
            return;
        }

        setLoading(true);
        try {
            // Load config details if selected
            if (selectedConfig) {
                const data = await loadConfig('dh', selectedConfig);
                setConfigData(data);
            } else {
                // Initialize empty/default data if no config selected (though UI encourages selection)
                setConfigData({});
            }

            init();
            if (selectedConfig) {
                setConfigID(selectedConfig);
            }
            setIsConnected(true);
            setIsMenuOpen(false); // Start with menu closed
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
        setIsMenuOpen(false);
        setConfigData(null);
        showToast('Disconnected', 'success');
    };

    const handleApplyConfig = async () => {
        if (!selectedConfig || !configData) return;

        setLoading(true);
        try {
            // Save changes to API
            await saveConfig('dh', configData);

            // Re-apply config ID to SDK to trigger update
            setConfigID(selectedConfig);

            showToast('Config applied successfully!', 'success');
        } catch (error) {
            showToast(error.message || 'Failed to apply config', 'error');
        } finally {
            setLoading(false);
        }
    };

    const updateConfigField = (field, value) => {
        setConfigData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-body)' }}>
            <ToastContainer />

            {/* Main Content Area */}
            <div className={`transition-all duration-300 ${isConnected ? 'fixed inset-0 z-50' : 'max-w-7xl mx-auto px-4 py-8'}`}>

                {/* Header - Only visible when NOT connected */}
                {!isConnected && (
                    <h1 className="text-3xl font-bold text-text-main mb-8">Connect to DigitalHuman</h1>
                )}

                {/* Initial Connection Form - Only visible when NOT connected */}
                {!isConnected && (
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

                        <div className="mt-6">
                            <button
                                onClick={handleConnect}
                                disabled={loading || !appId}
                                className="px-6 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: 'var(--success)' }}
                            >
                                {loading ? 'Connecting...' : 'Connect'}
                            </button>
                        </div>
                    </div>
                )}

                {/* SDK Container - Full Screen when connected, or placeholder when not */}
                <div
                    className={`${isConnected ? 'w-full h-full' : 'rounded-xl border overflow-hidden'}`}
                    style={{
                        backgroundColor: isConnected ? 'black' : 'var(--bg-panel)',
                        borderColor: 'var(--border)',
                        minHeight: isConnected ? '100%' : '600px',
                    }}
                >
                    {/* The container ref div requires display:block to be measured by SDK init */}
                    <div ref={containerRef} className="w-full h-full" style={{ display: isConnected ? 'block' : 'none' }} />

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

            {/* Hamburger Menu & Settings Drawer - Only when Connected */}
            {isConnected && (
                <>
                    {/* Hamburger Button */}
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="fixed top-6 right-6 z-[60] p-3 rounded-full shadow-lg hover:bg-opacity-90 transition-all"
                        style={{ backgroundColor: 'var(--bg-panel)', color: 'var(--text-main)' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>



                    {/* Settings Drawer */}
                    <div
                        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-bg-panel shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out overflow-y-auto ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                        style={{ backgroundColor: 'var(--bg-panel)' }}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-text-main">Settings</h2>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-text-muted hover:text-text-main"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {configData ? (
                                <div className="space-y-4">
                                    {/* Config ID Display */}
                                    <div className="p-3 rounded-lg bg-bg-input border border-border">
                                        <p className="text-xs text-text-muted uppercase font-semibold">Current Config</p>
                                        <p className="text-text-main font-mono">{configData.config_id}</p>
                                    </div>

                                    {/* Bot ID */}
                                    <div>
                                        <label className="block text-sm font-medium text-text-muted mb-1">Bot ID</label>
                                        <input
                                            type="text"
                                            value={configData.botid || ''}
                                            onChange={(e) => updateConfigField('botid', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg bg-bg-input border border-border text-text-main"
                                        />
                                    </div>

                                    {/* Destination Flow */}
                                    <div>
                                        <label className="block text-sm font-medium text-text-muted mb-1">Destination Flow</label>
                                        <input
                                            type="text"
                                            value={configData.destinationflow || ''}
                                            onChange={(e) => updateConfigField('destinationflow', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg bg-bg-input border border-border text-text-main"
                                        />
                                    </div>

                                    <div className="h-px bg-border my-4" />

                                    {/* ASR Settings */}
                                    <div>
                                        <label className="block text-sm font-medium text-text-muted mb-1">ASR Provider</label>
                                        <select
                                            value={configData.asrprovider || 'elevenlabs'}
                                            onChange={(e) => updateConfigField('asrprovider', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg bg-bg-input border border-border text-text-main"
                                        >
                                            {ASR_PROVIDERS.map((provider) => (
                                                <option key={provider.value} value={provider.value}>
                                                    {provider.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-muted mb-1">ASR Language</label>
                                        <select
                                            value={configData.asrlanguage || 'th-TH'}
                                            onChange={(e) => updateConfigField('asrlanguage', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg bg-bg-input border border-border text-text-main"
                                            style={{
                                                backgroundColor: 'var(--bg-input)',
                                                border: '1px solid var(--border)',
                                                color: 'var(--text-main)',
                                            }}
                                        >
                                            {ASR_LANGUAGES.map((lang) => (
                                                <option key={lang.value} value={lang.value}>
                                                    {lang.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="h-px bg-border my-4" />

                                    {/* TTS Settings */}
                                    <div>
                                        <label className="block text-sm font-medium text-text-muted mb-1">TTS Provider</label>
                                        <select
                                            value={configData.ttsprovider || 'botnoi'}
                                            onChange={(e) => updateConfigField('ttsprovider', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg bg-bg-input border border-border text-text-main"
                                        >
                                            {TTS_PROVIDERS.map((provider) => (
                                                <option key={provider.value} value={provider.value}>
                                                    {provider.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-muted mb-1">TTS Language</label>
                                        <select
                                            value={configData.speakerlanguage || 'th'}
                                            onChange={(e) => updateConfigField('speakerlanguage', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg bg-bg-input border border-border text-text-main"
                                            style={{
                                                backgroundColor: 'var(--bg-input)',
                                                border: '1px solid var(--border)',
                                                color: 'var(--text-main)',
                                            }}
                                        >
                                            {TTS_LANGUAGES.map((lang) => (
                                                <option key={lang.value} value={lang.value}>
                                                    {lang.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-muted mb-1">Speaker ID</label>
                                        <input
                                            type="text"
                                            value={configData.speakerid || ''}
                                            onChange={(e) => updateConfigField('speakerid', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg bg-bg-input border border-border text-text-main"
                                        />
                                    </div>

                                    {/* Actions */}
                                    <div className="pt-6 space-y-3">
                                        <button
                                            onClick={handleApplyConfig}
                                            disabled={loading}
                                            className="w-full px-4 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                                            style={{ backgroundColor: 'var(--success)' }}
                                        >
                                            {loading ? 'Applying...' : 'Apply Config'}
                                        </button>

                                        <button
                                            onClick={handleDisconnect}
                                            className="w-full px-4 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                                            style={{ backgroundColor: 'var(--danger)' }}
                                        >
                                            Disconnect
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-text-muted">No config data loaded.</p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ConnectPage;
