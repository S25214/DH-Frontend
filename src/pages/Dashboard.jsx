import { useState, useEffect } from 'react';
import { fetchConfigs, loadConfig, saveConfig, deleteConfig } from '../services/apiService';
import { useToast } from '../components/Toast';
import A2FConfig from '../components/A2FConfig';
import CustomizeConfig from '../components/CustomizeConfig';
import DHConfig from '../components/DHConfig';

export const Dashboard = () => {
    const { showToast, ToastContainer } = useToast();
    const [configType, setConfigType] = useState('dh');
    const [configs, setConfigs] = useState([]);
    const [selectedConfig, setSelectedConfig] = useState(null);
    const [currentData, setCurrentData] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    // Collapsible sections state
    const [expandedSections, setExpandedSections] = useState({
        core: true,
        asr: false,
        tts: false,
        sheet: false,
        idle: false,
        tts_inject: false,
    });

    useEffect(() => {
        loadConfigList();
    }, [configType]);

    const loadConfigList = async () => {
        setLoading(true);
        try {
            const list = await fetchConfigs(configType);
            setConfigs(list);
            setSelectedConfig(null);
            setCurrentData(null);
        } catch (error) {
            showToast(error.message || 'Failed to load configs', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectConfig = async (configId) => {
        setLoading(true);
        try {
            const data = await loadConfig(configType, configId);
            setCurrentData(data);
            setSelectedConfig(configId);
            setIsCreating(false);
        } catch (error) {
            showToast(error.message || 'Failed to load config', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleNewConfig = () => {
        setIsCreating(true);
        setSelectedConfig(null);
        setCurrentData({
            config_id: '',
            botid: '',
            destinationflow: '',
            a2f_config: '',
            customize: '',
            projectname: '',
            userid: 'MetaDefault',
            asrtimeout: 40,
            sessiontimeout: 9999,
            isanim: 'true',
            // ASR Settings
            asrprovider: 'elevenlabs',
            asrlanguage: 'th-TH',
            micactivedelay: 0.5,
            asrvadfalseblock: 20,
            asrvadfalsetimeout: 1.5,
            asrvadtrueblock: 50,
            psaudio: 'true',
            // TTS Settings
            ttsprovider: 'botnoi',
            speakerlanguage: 'th',
            speakerid: '39',
            // Sheet Config (optional)
            sheet: null,
            // Idle Config (optional)
            idle_config: null,
            // TTS Inject Config (optional)
            tts_inject_config: null,
        });
    };

    const handleSave = async () => {
        if (!currentData || !currentData.config_id) {
            showToast('Config ID is required', 'error');
            return;
        }

        if (!currentData.botid || !currentData.destinationflow) {
            showToast('Bot ID and Destination Flow are required', 'error');
            return;
        }

        setLoading(true);
        try {
            await saveConfig(configType, currentData);
            showToast('Config saved successfully!', 'success');
            await loadConfigList();
            if (isCreating) {
                setIsCreating(false);
                handleSelectConfig(currentData.config_id);
            }
        } catch (error) {
            showToast(error.message || 'Failed to save config', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (deleteConfirmText !== 'BOTNOI') {
            showToast('Please type BOTNOI to confirm', 'error');
            return;
        }

        setLoading(true);
        try {
            await deleteConfig(configType, selectedConfig);
            showToast('Config deleted successfully', 'success');
            setShowDeleteModal(false);
            setDeleteConfirmText('');
            await loadConfigList();
        } catch (error) {
            showToast(error.message || 'Failed to delete config', 'error');
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field, value) => {
        setCurrentData((prev) => ({ ...prev, [field]: value }));
    };

    const updateNestedField = (parent, field, value) => {
        setCurrentData((prev) => ({
            ...prev,
            [parent]: {
                ...(prev[parent] || {}),
                [field]: value,
            },
        }));
    };

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const toggleSheetConfig = (enabled) => {
        if (enabled) {
            setCurrentData((prev) => ({
                ...prev,
                sheet: {
                    spreadsheet_id: '',
                    range_name: 'Bot!B:E',
                    poll_interval_seconds: 10,
                    prefix: '',
                    item: '',
                    joiner: ', ',
                    last_joiner: '',
                    suffix: '',
                    enabled: 'true',
                },
            }));
        } else {
            setCurrentData((prev) => ({
                ...prev,
                sheet: null,
            }));
        }
    };

    const toggleIdleConfig = (enabled) => {
        if (enabled) {
            setCurrentData((prev) => ({
                ...prev,
                idle_config: {
                    enabled: 'true',
                    random: 'true',
                    min_interval: 10,
                    max_interval: 30,
                    sentences: [],
                },
            }));
        } else {
            setCurrentData((prev) => ({
                ...prev,
                idle_config: null,
            }));
        }
    };

    const toggleTTSInjectConfig = (enabled) => {
        if (enabled) {
            setCurrentData((prev) => ({
                ...prev,
                tts_inject_config: {
                    auth_token: '',
                    callback_url: '',
                    provider: 'botnoi',
                    speaker: '523',
                },
            }));
        } else {
            setCurrentData((prev) => ({
                ...prev,
                tts_inject_config: null,
            }));
        }
    };

    const addIdleSentence = () => {
        setCurrentData((prev) => ({
            ...prev,
            idle_config: {
                ...prev.idle_config,
                sentences: [...(prev.idle_config?.sentences || []), ''],
            },
        }));
    };

    const updateIdleSentence = (index, value) => {
        setCurrentData((prev) => ({
            ...prev,
            idle_config: {
                ...prev.idle_config,
                sentences: prev.idle_config.sentences.map((s, i) => (i === index ? value : s)),
            },
        }));
    };

    const removeIdleSentence = (index) => {
        setCurrentData((prev) => ({
            ...prev,
            idle_config: {
                ...prev.idle_config,
                sentences: prev.idle_config.sentences.filter((_, i) => i !== index),
            },
        }));
    };

    // A2F Config Editor
    if (configType === 'a2f') {
        return (
            <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-body)' }}>
                <ToastContainer />

                {/* Sidebar - Same as DH */}
                <aside
                    className="w-80 border-r flex flex-col"
                    style={{
                        backgroundColor: 'var(--bg-panel)',
                        borderColor: 'var(--border)',
                    }}
                >
                    <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                        <h2 className="text-lg font-semibold text-text-main mb-4">Config Manager</h2>

                        {/* Config Type Selector */}
                        <div className="flex rounded-lg overflow-hidden mb-4" style={{ backgroundColor: 'var(--bg-input)' }}>
                            {['dh', 'a2f', 'customize'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setConfigType(type)}
                                    className={`flex-1 py-2 text-sm font-medium transition-colors ${configType === type ? 'text-white' : 'text-text-muted'
                                        }`}
                                    style={configType === type ? { backgroundColor: 'var(--primary)' } : {}}
                                >
                                    {type.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleNewConfig}
                            className="w-full py-2 px-4 rounded-lg font-medium text-white transition-all"
                            style={{ backgroundColor: 'var(--success)' }}
                        >
                            + New Config
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        {loading ? (
                            <p className="text-text-muted text-sm">Loading...</p>
                        ) : (
                            configs.map((configId) => (
                                <button
                                    key={configId}
                                    onClick={() => handleSelectConfig(configId)}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-all mb-2 ${selectedConfig === configId ? 'border border-primary' : ''
                                        }`}
                                    style={{
                                        backgroundColor:
                                            selectedConfig === configId ? 'var(--bg-panel)' : 'var(--bg-input)',
                                        color: 'var(--text-main)',
                                    }}
                                >
                                    {configId}
                                </button>
                            ))
                        )}
                    </div>
                </aside>

                {/* Main Editor - A2F */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {!currentData ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <p className="text-text-muted text-lg">Select a config or create a new one</p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold text-text-main">
                                    {isCreating ? 'Create New A2F Config' : `Edit: ${currentData.config_id}`}
                                </h1>
                                <div className="flex space-x-3">
                                    {!isCreating && (
                                        <button
                                            onClick={() => setShowDeleteModal(true)}
                                            className="px-6 py-2 rounded-lg font-medium text-white"
                                            style={{ backgroundColor: 'var(--danger)' }}
                                        >
                                            Delete
                                        </button>
                                    )}
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="px-6 py-2 rounded-lg font-medium text-white disabled:opacity-50"
                                        style={{ backgroundColor: 'var(--success)' }}
                                    >
                                        {loading ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </div>

                            {/* Render A2F Config Component */}
                            <A2FConfig
                                currentData={currentData}
                                isCreating={isCreating}
                                updateField={updateField}
                                updateNestedField={updateNestedField}
                            />
                        </div>
                    )}
                </main>

                {/* Delete Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                        <div
                            className="p-8 rounded-xl max-w-md w-full mx-4"
                            style={{
                                backgroundColor: 'var(--bg-panel)',
                                border: '1px solid var(--border)',
                            }}
                        >
                            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--danger)' }}>
                                Delete Configuration
                            </h3>
                            <p className="mb-6" style={{ color: 'var(--text-main)' }}>
                                Are you sure you want to delete "{selectedConfig}"? This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-6 py-2 rounded-lg font-medium"
                                    style={{
                                        backgroundColor: 'var(--bg-input)',
                                        color: 'var(--text-main)',
                                        border: '1px solid var(--border)',
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="px-6 py-2 rounded-lg font-medium text-white disabled:opacity-50"
                                    style={{ backgroundColor: 'var(--danger)' }}
                                >
                                    {loading ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Customize - show placeholder
    // Customize Config Editor
    if (configType === 'customize') {
        return (
            <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-body)' }}>
                <ToastContainer />

                {/* Sidebar - Same as DH/A2F */}
                <aside
                    className="w-80 border-r flex flex-col"
                    style={{
                        backgroundColor: 'var(--bg-panel)',
                        borderColor: 'var(--border)',
                    }}
                >
                    <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                        <h2 className="text-lg font-semibold text-text-main mb-4">Config Manager</h2>

                        {/* Config Type Selector */}
                        <div className="flex rounded-lg overflow-hidden mb-4" style={{ backgroundColor: 'var(--bg-input)' }}>
                            {['dh', 'a2f', 'customize'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setConfigType(type)}
                                    className={`flex-1 py-2 text-sm font-medium transition-colors ${configType === type ? 'text-white' : 'text-text-muted'
                                        }`}
                                    style={configType === type ? { backgroundColor: 'var(--primary)' } : {}}
                                >
                                    {type.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleNewConfig}
                            className="w-full py-2 px-4 rounded-lg font-medium text-white transition-all"
                            style={{ backgroundColor: 'var(--success)' }}
                        >
                            + New Config
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        {loading ? (
                            <p className="text-text-muted text-sm">Loading...</p>
                        ) : (
                            configs.map((configId) => (
                                <button
                                    key={configId}
                                    onClick={() => handleSelectConfig(configId)}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-all mb-2 ${selectedConfig === configId ? 'border border-primary' : ''
                                        }`}
                                    style={{
                                        backgroundColor:
                                            selectedConfig === configId ? 'var(--bg-panel)' : 'var(--bg-input)',
                                        color: 'var(--text-main)',
                                    }}
                                >
                                    {configId}
                                </button>
                            ))
                        )}
                    </div>
                </aside>

                {/* Main Editor - Customize */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {!currentData ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <p className="text-text-muted text-lg">Select a config or create a new one</p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold text-text-main">
                                    {isCreating ? 'Create New Customize Config' : `Edit: ${currentData.config_id}`}
                                </h1>
                                <div className="flex space-x-3">
                                    {!isCreating && (
                                        <button
                                            onClick={() => setShowDeleteModal(true)}
                                            className="px-6 py-2 rounded-lg font-medium text-white"
                                            style={{ backgroundColor: 'var(--danger)' }}
                                        >
                                            Delete
                                        </button>
                                    )}
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="px-6 py-2 rounded-lg font-medium text-white disabled:opacity-50"
                                        style={{ backgroundColor: 'var(--success)' }}
                                    >
                                        {loading ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </div>

                            {/* Render Customize Config Component */}
                            <CustomizeConfig
                                currentData={currentData}
                                isCreating={isCreating}
                                updateField={updateField}
                                updateNestedField={updateNestedField}
                            />
                        </div>
                    )}
                </main>

                {/* Delete Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                        <div
                            className="p-8 rounded-xl max-w-md w-full mx-4"
                            style={{
                                backgroundColor: 'var(--bg-panel)',
                                border: '1px solid var(--border)',
                            }}
                        >
                            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--danger)' }}>
                                Delete Configuration
                            </h3>
                            <p className="mb-6" style={{ color: 'var(--text-main)' }}>
                                Are you sure you want to delete "{selectedConfig}"? This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-6 py-2 rounded-lg font-medium"
                                    style={{
                                        backgroundColor: 'var(--bg-input)',
                                        color: 'var(--text-main)',
                                        border: '1px solid var(--border)',
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="px-6 py-2 rounded-lg font-medium text-white disabled:opacity-50"
                                    style={{ backgroundColor: 'var(--danger)' }}
                                >
                                    {loading ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // DH Config Editor (existing code)

    // DH Config Editor (existing code)
    return (
        <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-body)' }}>
            <ToastContainer />

            {/* Sidebar */}
            <aside
                className="w-80 border-r flex flex-col"
                style={{
                    backgroundColor: 'var(--bg-panel)',
                    borderColor: 'var(--border)',
                }}
            >
                <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                    <h2 className="text-lg font-semibold text-text-main mb-4">Config Manager</h2>

                    {/* Config Type Selector */}
                    <div className="flex rounded-lg overflow-hidden mb-4" style={{ backgroundColor: 'var(--bg-input)' }}>
                        {['dh', 'a2f', 'customize'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setConfigType(type)}
                                className={`flex-1 py-2 text-sm font-medium transition-colors ${configType === type ? 'text-white' : 'text-text-muted'
                                    }`}
                                style={configType === type ? { backgroundColor: 'var(--primary)' } : {}}
                            >
                                {type.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleNewConfig}
                        className="w-full py-2 px-4 rounded-lg font-medium text-white transition-all"
                        style={{ backgroundColor: 'var(--success)' }}
                    >
                        + New Config
                    </button>
                </div>

                {/* Config List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {loading && configs.length === 0 ? (
                        <p className="text-text-muted text-center py-4">Loading...</p>
                    ) : configs.length === 0 ? (
                        <p className="text-text-muted text-center py-4">No configs found</p>
                    ) : (
                        configs.map((configId) => (
                            <button
                                key={configId}
                                onClick={() => handleSelectConfig(configId)}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${selectedConfig === configId ? 'border border-primary' : ''
                                    }`}
                                style={{
                                    backgroundColor: selectedConfig === configId ? 'var(--bg-panel)' : 'var(--bg-input)',
                                    color: 'var(--text-main)',
                                }}
                            >
                                {configId}
                            </button>
                        ))
                    )}
                </div>
            </aside>

            {/* Main Editor */}
            <main className="flex-1 p-8 overflow-y-auto">
                {!currentData ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <p className="text-text-muted text-lg">Select a config or create a new one</p>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-text-main">
                                {isCreating ? 'Create New DH Config' : `Edit: ${currentData.config_id}`}
                            </h1>
                            <div className="flex space-x-3">
                                {!isCreating && (
                                    <button
                                        onClick={() => setShowDeleteModal(true)}
                                        className="px-6 py-2 rounded-lg font-medium text-white"
                                        style={{ backgroundColor: 'var(--danger)' }}
                                    >
                                        Delete
                                    </button>
                                )}
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="px-6 py-2 rounded-lg font-medium text-white disabled:opacity-50"
                                    style={{ backgroundColor: 'var(--success)' }}
                                >
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>

                        {/* DH Config Component */}
                        <DHConfig
                            currentData={currentData}
                            isCreating={isCreating}
                            updateField={updateField}
                            updateNestedField={updateNestedField}
                            toggleSection={toggleSection}
                            expandedSections={expandedSections}
                            toggleSheetConfig={toggleSheetConfig}
                            toggleIdleConfig={toggleIdleConfig}
                            toggleTTSInjectConfig={toggleTTSInjectConfig}
                            addIdleSentence={addIdleSentence}
                            updateIdleSentence={updateIdleSentence}
                            removeIdleSentence={removeIdleSentence}
                        />
                    </div>
                )}
            </main>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div
                        className="p-8 rounded-xl max-w-md w-full mx-4"
                        style={{
                            backgroundColor: 'var(--bg-panel)',
                            border: '1px solid var(--border)',
                        }}
                    >
                        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--danger)' }}>
                            Delete Confirmation
                        </h3>
                        <p className="text-text-muted mb-4">This action cannot be undone.</p>
                        <p className="text-text-main mb-4">
                            Type <strong>BOTNOI</strong> to confirm:
                        </p>
                        <input
                            type="text"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg mb-6 text-center font-bold"
                            style={{
                                backgroundColor: 'var(--bg-input)',
                                border: '1px solid var(--border)',
                                color: 'var(--text-main)',
                            }}
                            placeholder="Type BOTNOI"
                        />
                        <div className="flex space-x-4">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteConfirmText('');
                                }}
                                className="flex-1 px-4 py-2 rounded-lg"
                                style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-main)' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="flex-1 px-4 py-2 rounded-lg text-white disabled:opacity-50"
                                style={{ backgroundColor: 'var(--danger)' }}
                            >
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
