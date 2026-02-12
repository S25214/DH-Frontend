import { useState, useEffect } from 'react';
import { fetchConfigs, loadConfig, saveConfig, deleteConfig } from '../services/apiService';
import { useToast } from '../components/Toast';

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

    if (configType !== 'dh') {
        return (
            <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-body)' }}>
                <ToastContainer />
                <div className="flex items-center justify-center w-full">
                    <p className="text-text-muted text-lg">
                        A2F and Customize config editors coming soon. Use DH Config for now.
                    </p>
                </div>
            </div>
        );
    }

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

                        {/* Core Settings Section */}
                        <div
                            className="mb-4 rounded-xl border overflow-hidden"
                            style={{
                                backgroundColor: 'var(--bg-panel)',
                                borderColor: 'var(--border)',
                            }}
                        >
                            <button
                                onClick={() => toggleSection('core')}
                                className="w-full px-6 py-4 flex justify-between items-center hover:opacity-80"
                                style={{ backgroundColor: 'var(--bg-input)' }}
                            >
                                <h3 className="text-lg font-semibold text-text-main">Core Settings</h3>
                                <span className="text-text-main">{expandedSections.core ? '▼' : '▶'}</span>
                            </button>

                            {expandedSections.core && (
                                <div className="p-6 grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-text-muted mb-2">
                                            Config ID <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={currentData.config_id || ''}
                                            onChange={(e) => updateField('config_id', e.target.value)}
                                            readOnly={!isCreating}
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
                                            Bot ID <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={currentData.botid || ''}
                                            onChange={(e) => updateField('botid', e.target.value)}
                                            placeholder="68ef116e8596ddfa50f9ce64"
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
                                            Destination Flow <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={currentData.destinationflow || ''}
                                            onChange={(e) => updateField('destinationflow', e.target.value)}
                                            placeholder="IN_greeting"
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
                                            A2F Config (Ref)
                                        </label>
                                        <input
                                            type="text"
                                            value={currentData.a2f_config || ''}
                                            onChange={(e) => updateField('a2f_config', e.target.value)}
                                            placeholder="default"
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
                                            Customize (Ref)
                                        </label>
                                        <input
                                            type="text"
                                            value={currentData.customize || ''}
                                            onChange={(e) => updateField('customize', e.target.value)}
                                            placeholder="default_theme"
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
                                            Project Name
                                        </label>
                                        <input
                                            type="text"
                                            value={currentData.projectname || ''}
                                            onChange={(e) => updateField('projectname', e.target.value)}
                                            placeholder="DigitalHuman"
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
                                            User ID
                                        </label>
                                        <input
                                            type="text"
                                            value={currentData.userid || ''}
                                            onChange={(e) => updateField('userid', e.target.value)}
                                            placeholder="MetaDefault"
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
                                            ASR Timeout (s)
                                        </label>
                                        <input
                                            type="number"
                                            value={currentData.asrtimeout || ''}
                                            onChange={(e) => updateField('asrtimeout', parseInt(e.target.value))}
                                            placeholder="40"
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
                                            Session Timeout (s)
                                        </label>
                                        <input
                                            type="number"
                                            value={currentData.sessiontimeout || ''}
                                            onChange={(e) => updateField('sessiontimeout', parseInt(e.target.value))}
                                            placeholder="9999"
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
                                            Is Anim
                                        </label>
                                        <select
                                            value={currentData.isanim || 'true'}
                                            onChange={(e) => updateField('isanim', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg"
                                            style={{
                                                backgroundColor: 'var(--bg-input)',
                                                border: '1px solid var(--border)',
                                                color: 'var(--text-main)',
                                            }}
                                        >
                                            <option value="true">True</option>
                                            <option value="false">False</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ASR Settings Section */}
                        <div
                            className="mb-4 rounded-xl border overflow-hidden"
                            style={{
                                backgroundColor: 'var(--bg-panel)',
                                borderColor: 'var(--border)',
                            }}
                        >
                            <button
                                onClick={() => toggleSection('asr')}
                                className="w-full px-6 py-4 flex justify-between items-center hover:opacity-80"
                                style={{ backgroundColor: 'var(--bg-input)' }}
                            >
                                <h3 className="text-lg font-semibold text-text-main">ASR Settings</h3>
                                <span className="text-text-main">{expandedSections.asr ? '▼' : '▶'}</span>
                            </button>

                            {expandedSections.asr && (
                                <div className="p-6 grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-text-muted mb-2">
                                            ASR Provider
                                        </label>
                                        <select
                                            value={currentData.asrprovider || 'elevenlabs'}
                                            onChange={(e) => updateField('asrprovider', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg"
                                            style={{
                                                backgroundColor: 'var(--bg-input)',
                                                border: '1px solid var(--border)',
                                                color: 'var(--text-main)',
                                            }}
                                        >
                                            <option value="elevenlabs">ElevenLabs</option>
                                            <option value="botnoi">Botnoi</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-muted mb-2">
                                            ASR Language
                                        </label>
                                        <select
                                            value={currentData.asrlanguage || 'th-TH'}
                                            onChange={(e) => updateField('asrlanguage', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg"
                                            style={{
                                                backgroundColor: 'var(--bg-input)',
                                                border: '1px solid var(--border)',
                                                color: 'var(--text-main)',
                                            }}
                                        >
                                            <option value="th-TH">Thai</option>
                                            <option value="en-US">English</option>
                                            <option value="fil-PH">Filipino</option>
                                            <option value="pt-BR">Portuguese</option>
                                            <option value="en-SG">Singapore</option>
                                            <option value="tr-TR">Turkish</option>
                                            <option value="lo-LA">Lao</option>
                                            <option value="zh-CN">Chinese</option>
                                            <option value="vi-VN">Vietnamese</option>
                                            <option value="id-ID">Indonesian</option>
                                            <option value="de-DE">German</option>
                                            <option value="fr-FR">French</option>
                                            <option value="ru-RU">Russian</option>
                                            <option value="my-MM">Burmese</option>
                                            <option value="km-KH">Cambodia</option>
                                            <option value="es-ES">Spanish</option>
                                            <option value="ms-MY">Malaysian</option>
                                            <option value="nl-NL">Dutch</option>
                                            <option value="ko-KR">Korean</option>
                                            <option value="hi-IN">Hindi</option>
                                            <option value="it-IT">Italian</option>
                                            <option value="ja-JP">Japanese</option>
                                            <option value="ar-SA">Arabic</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-muted mb-2">
                                            Mic Active Delay (s)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={currentData.micactivedelay || ''}
                                            onChange={(e) => updateField('micactivedelay', parseFloat(e.target.value))}
                                            placeholder="0.5"
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
                                            ASR VAD False Block
                                        </label>
                                        <input
                                            type="number"
                                            value={currentData.asrvadfalseblock || ''}
                                            onChange={(e) => updateField('asrvadfalseblock', parseInt(e.target.value))}
                                            placeholder="20"
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
                                            ASR VAD False Timeout (s)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={currentData.asrvadfalsetimeout || ''}
                                            onChange={(e) => updateField('asrvadfalsetimeout', parseFloat(e.target.value))}
                                            placeholder="1.5"
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
                                            ASR VAD True Block
                                        </label>
                                        <input
                                            type="number"
                                            value={currentData.asrvadtrueblock || ''}
                                            onChange={(e) => updateField('asrvadtrueblock', parseInt(e.target.value))}
                                            placeholder="50"
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
                                            PS Audio
                                        </label>
                                        <select
                                            value={currentData.psaudio || 'true'}
                                            onChange={(e) => updateField('psaudio', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg"
                                            style={{
                                                backgroundColor: 'var(--bg-input)',
                                                border: '1px solid var(--border)',
                                                color: 'var(--text-main)',
                                            }}
                                        >
                                            <option value="true">True</option>
                                            <option value="false">False</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* TTS Settings Section */}
                        <div
                            className="mb-4 rounded-xl border overflow-hidden"
                            style={{
                                backgroundColor: 'var(--bg-panel)',
                                borderColor: 'var(--border)',
                            }}
                        >
                            <button
                                onClick={() => toggleSection('tts')}
                                className="w-full px-6 py-4 flex justify-between items-center hover:opacity-80"
                                style={{ backgroundColor: 'var(--bg-input)' }}
                            >
                                <h3 className="text-lg font-semibold text-text-main">TTS Settings</h3>
                                <span className="text-text-main">{expandedSections.tts ? '▼' : '▶'}</span>
                            </button>

                            {expandedSections.tts && (
                                <div className="p-6 grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-text-muted mb-2">
                                            TTS Provider
                                        </label>
                                        <select
                                            value={currentData.ttsprovider || 'botnoi'}
                                            onChange={(e) => updateField('ttsprovider', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg"
                                            style={{
                                                backgroundColor: 'var(--bg-input)',
                                                border: '1px solid var(--border)',
                                                color: 'var(--text-main)',
                                            }}
                                        >
                                            <option value="botnoi">Botnoi</option>
                                            <option value="elevenlabs">ElevenLabs</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-muted mb-2">
                                            Speaker Language
                                        </label>
                                        <select
                                            value={currentData.speakerlanguage || 'th'}
                                            onChange={(e) => updateField('speakerlanguage', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg"
                                            style={{
                                                backgroundColor: 'var(--bg-input)',
                                                border: '1px solid var(--border)',
                                                color: 'var(--text-main)',
                                            }}
                                        >
                                            <option value="th">Thai</option>
                                            <option value="en">English</option>
                                            <option value="fil">Filipino</option>
                                            <option value="pt">Portuguese</option>
                                            <option value="en-SG">Singapore</option>
                                            <option value="tr">Turkish</option>
                                            <option value="lo">Lao</option>
                                            <option value="zh">Chinese</option>
                                            <option value="vi">Vietnamese</option>
                                            <option value="id">Indonesian</option>
                                            <option value="de">German</option>
                                            <option value="fr">French</option>
                                            <option value="ru">Russian</option>
                                            <option value="my">Burmese</option>
                                            <option value="km">Cambodia</option>
                                            <option value="es">Spanish</option>
                                            <option value="ms">Malaysian</option>
                                            <option value="nl">Dutch</option>
                                            <option value="ko">Korean</option>
                                            <option value="hi">Hindi</option>
                                            <option value="it">Italian</option>
                                            <option value="ja">Japanese</option>
                                            <option value="ar">Arabic</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-muted mb-2">
                                            Speaker ID
                                        </label>
                                        <input
                                            type="text"
                                            value={currentData.speakerid || ''}
                                            onChange={(e) => updateField('speakerid', e.target.value)}
                                            placeholder="39"
                                            className="w-full px-4 py-3 rounded-lg"
                                            style={{
                                                backgroundColor: 'var(--bg-input)',
                                                border: '1px solid var(--border)',
                                                color: 'var(--text-main)',
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sheet Config Section (Optional) */}
                        <div
                            className="mb-4 rounded-xl border overflow-hidden"
                            style={{
                                backgroundColor: 'var(--bg-panel)',
                                borderColor: 'var(--border)',
                            }}
                        >
                            <div className="px-6 py-4 flex justify-between items-center" style={{ backgroundColor: 'var(--bg-input)' }}>
                                <div className="flex items-center space-x-3">
                                    <h3 className="text-lg font-semibold text-text-main">Sheet Config (Optional)</h3>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={!!currentData.sheet}
                                            onChange={(e) => toggleSheetConfig(e.target.checked)}
                                            className="w-5 h-5"
                                        />
                                        <span className="text-sm text-text-muted">Enable</span>
                                    </label>
                                </div>
                                {currentData.sheet && (
                                    <button onClick={() => toggleSection('sheet')} className="text-text-main">
                                        {expandedSections.sheet ? '▼' : '▶'}
                                    </button>
                                )}
                            </div>

                            {currentData.sheet && expandedSections.sheet && (
                                <div className="p-6 grid md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-text-muted mb-2">
                                            Spreadsheet ID
                                        </label>
                                        <input
                                            type="text"
                                            value={currentData.sheet?.spreadsheet_id || ''}
                                            onChange={(e) => updateNestedField('sheet', 'spreadsheet_id', e.target.value)}
                                            placeholder="16mEfquegafSdcsCpnkv8..."
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
                                            Range Name
                                        </label>
                                        <input
                                            type="text"
                                            value={currentData.sheet?.range_name || ''}
                                            onChange={(e) => updateNestedField('sheet', 'range_name', e.target.value)}
                                            placeholder="Bot!B:E"
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
                                            Poll Interval (seconds)
                                        </label>
                                        <input
                                            type="number"
                                            value={currentData.sheet?.poll_interval_seconds || ''}
                                            onChange={(e) => updateNestedField('sheet', 'poll_interval_seconds', parseInt(e.target.value))}
                                            placeholder="10"
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
                                            Prefix
                                        </label>
                                        <input
                                            type="text"
                                            value={currentData.sheet?.prefix || ''}
                                            onChange={(e) => updateNestedField('sheet', 'prefix', e.target.value)}
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
                                            Item Template
                                        </label>
                                        <input
                                            type="text"
                                            value={currentData.sheet?.item || ''}
                                            onChange={(e) => updateNestedField('sheet', 'item', e.target.value)}
                                            placeholder="คุณ {col1} จาก {col3}"
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
                                            Joiner
                                        </label>
                                        <input
                                            type="text"
                                            value={currentData.sheet?.joiner || ''}
                                            onChange={(e) => updateNestedField('sheet', 'joiner', e.target.value)}
                                            placeholder=", "
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
                                            Last Joiner
                                        </label>
                                        <input
                                            type="text"
                                            value={currentData.sheet?.last_joiner || ''}
                                            onChange={(e) => updateNestedField('sheet', 'last_joiner', e.target.value)}
                                            placeholder="และ"
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
                                            Suffix
                                        </label>
                                        <input
                                            type="text"
                                            value={currentData.sheet?.suffix || ''}
                                            onChange={(e) => updateNestedField('sheet', 'suffix', e.target.value)}
                                            placeholder="ได้ทำการลงทะเบียนเรียบร้อยแล้ว"
                                            className="w-full px-4 py-3 rounded-lg"
                                            style={{
                                                backgroundColor: 'var(--bg-input)',
                                                border: '1px solid var(--border)',
                                                color: 'var(--text-main)',
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Idle Config Section (Optional) */}
                        <div
                            className="mb-4 rounded-xl border overflow-hidden"
                            style={{
                                backgroundColor: 'var(--bg-panel)',
                                borderColor: 'var(--border)',
                            }}
                        >
                            <div className="px-6 py-4 flex justify-between items-center" style={{ backgroundColor: 'var(--bg-input)' }}>
                                <div className="flex items-center space-x-3">
                                    <h3 className="text-lg font-semibold text-text-main">Idle Config (Optional)</h3>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={!!currentData.idle_config}
                                            onChange={(e) => toggleIdleConfig(e.target.checked)}
                                            className="w-5 h-5"
                                        />
                                        <span className="text-sm text-text-muted">Enable</span>
                                    </label>
                                </div>
                                {currentData.idle_config && (
                                    <button onClick={() => toggleSection('idle')} className="text-text-main">
                                        {expandedSections.idle ? '▼' : '▶'}
                                    </button>
                                )}
                            </div>

                            {currentData.idle_config && expandedSections.idle && (
                                <div className="p-6">
                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="block text-sm font-medium text-text-muted mb-2">
                                                Enabled
                                            </label>
                                            <select
                                                value={currentData.idle_config?.enabled || 'true'}
                                                onChange={(e) => updateNestedField('idle_config', 'enabled', e.target.value)}
                                                className="w-full px-4 py-3 rounded-lg"
                                                style={{
                                                    backgroundColor: 'var(--bg-input)',
                                                    border: '1px solid var(--border)',
                                                    color: 'var(--text-main)',
                                                }}
                                            >
                                                <option value="true">True</option>
                                                <option value="false">False</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-text-muted mb-2">
                                                Random
                                            </label>
                                            <select
                                                value={currentData.idle_config?.random || 'true'}
                                                onChange={(e) => updateNestedField('idle_config', 'random', e.target.value)}
                                                className="w-full px-4 py-3 rounded-lg"
                                                style={{
                                                    backgroundColor: 'var(--bg-input)',
                                                    border: '1px solid var(--border)',
                                                    color: 'var(--text-main)',
                                                }}
                                            >
                                                <option value="true">True</option>
                                                <option value="false">False</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-text-muted mb-2">
                                                Min Interval (seconds)
                                            </label>
                                            <input
                                                type="number"
                                                value={currentData.idle_config?.min_interval || ''}
                                                onChange={(e) => updateNestedField('idle_config', 'min_interval', parseInt(e.target.value))}
                                                placeholder="10"
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
                                                Max Interval (seconds)
                                            </label>
                                            <input
                                                type="number"
                                                value={currentData.idle_config?.max_interval || ''}
                                                onChange={(e) => updateNestedField('idle_config', 'max_interval', parseInt(e.target.value))}
                                                placeholder="30"
                                                className="w-full px-4 py-3 rounded-lg"
                                                style={{
                                                    backgroundColor: 'var(--bg-input)',
                                                    border: '1px solid var(--border)',
                                                    color: 'var(--text-main)',
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-muted mb-2">
                                            Idle Sentences
                                        </label>
                                        <div className="space-y-2 mb-3">
                                            {currentData.idle_config?.sentences?.map((sentence, index) => (
                                                <div key={index} className="flex space-x-2">
                                                    <input
                                                        type="text"
                                                        value={sentence}
                                                        onChange={(e) => updateIdleSentence(index, e.target.value)}
                                                        placeholder="Enter idle sentence..."
                                                        className="flex-1 px-4 py-3 rounded-lg"
                                                        style={{
                                                            backgroundColor: 'var(--bg-input)',
                                                            border: '1px solid var(--border)',
                                                            color: 'var(--text-main)',
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => removeIdleSentence(index)}
                                                        className="px-4 py-2 rounded-lg text-white"
                                                        style={{ backgroundColor: 'var(--danger)' }}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            )) || null}
                                        </div>
                                        <button
                                            onClick={addIdleSentence}
                                            className="w-full px-4 py-2 rounded-lg font-medium text-white"
                                            style={{ backgroundColor: 'var(--primary)' }}
                                        >
                                            + Add Sentence
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* TTS Inject Config Section (Optional) */}
                        <div
                            className="mb-4 rounded-xl border overflow-hidden"
                            style={{
                                backgroundColor: 'var(--bg-panel)',
                                borderColor: 'var(--border)',
                            }}
                        >
                            <div className="px-6 py-4 flex justify-between items-center" style={{ backgroundColor: 'var(--bg-input)' }}>
                                <div className="flex items-center space-x-3">
                                    <h3 className="text-lg font-semibold text-text-main">TTS Inject Config (Optional)</h3>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={!!currentData.tts_inject_config}
                                            onChange={(e) => toggleTTSInjectConfig(e.target.checked)}
                                            className="w-5 h-5"
                                        />
                                        <span className="text-sm text-text-muted">Enable</span>
                                    </label>
                                </div>
                                <p className="text-xs text-text-muted">* Required if Sheet or Idle is enabled</p>
                                {currentData.tts_inject_config && (
                                    <button onClick={() => toggleSection('tts_inject')} className="text-text-main">
                                        {expandedSections.tts_inject ? '▼' : '▶'}
                                    </button>
                                )}
                            </div>

                            {currentData.tts_inject_config && expandedSections.tts_inject && (
                                <div className="p-6 grid md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-text-muted mb-2">
                                            Auth Token
                                        </label>
                                        <input
                                            type="text"
                                            value={currentData.tts_inject_config?.auth_token || ''}
                                            onChange={(e) => updateNestedField('tts_inject_config', 'auth_token', e.target.value)}
                                            placeholder="eyJhbG..."
                                            className="w-full px-4 py-3 rounded-lg"
                                            style={{
                                                backgroundColor: 'var(--bg-input)',
                                                border: '1px solid var(--border)',
                                                color: 'var(--text-main)',
                                            }}
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-text-muted mb-2">
                                            Callback URL
                                        </label>
                                        <input
                                            type="text"
                                            value={currentData.tts_inject_config?.callback_url || ''}
                                            onChange={(e) => updateNestedField('tts_inject_config', 'callback_url', e.target.value)}
                                            placeholder="https://..."
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
                                            Provider
                                        </label>
                                        <input
                                            type="text"
                                            value={currentData.tts_inject_config?.provider || ''}
                                            onChange={(e) => updateNestedField('tts_inject_config', 'provider', e.target.value)}
                                            placeholder="botnoi"
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
                                            Speaker
                                        </label>
                                        <input
                                            type="text"
                                            value={currentData.tts_inject_config?.speaker || ''}
                                            onChange={(e) => updateNestedField('tts_inject_config', 'speaker', e.target.value)}
                                            placeholder="523"
                                            className="w-full px-4 py-3 rounded-lg"
                                            style={{
                                                backgroundColor: 'var(--bg-input)',
                                                border: '1px solid var(--border)',
                                                color: 'var(--text-main)',
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
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
