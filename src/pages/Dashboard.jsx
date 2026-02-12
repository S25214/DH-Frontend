import { useState, useEffect } from 'react';
import { fetchConfigs, loadConfig, saveConfig, deleteConfig } from '../services/apiService';
import { useToast } from '../components/Toast';
import A2FConfig from '../components/A2FConfig';
import CustomizeConfig from '../components/CustomizeConfig';
import DHConfig from '../components/DHConfig';
import ConfigLayout from '../components/ConfigLayout';

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

    // Config lists for dropdowns
    const [a2fConfigs, setA2FConfigs] = useState([]);
    const [customizeConfigs, setCustomizeConfigs] = useState([]);

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

            // If in DH mode, fetch other config lists for dropdowns
            if (configType === 'dh') {
                const [a2fList, customizeList] = await Promise.all([
                    fetchConfigs('a2f'),
                    fetchConfigs('customize')
                ]);
                setA2FConfigs(a2fList);
                setCustomizeConfigs(customizeList);
            }

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

        if (configType === 'dh') {
            if (!currentData.botid || !currentData.destinationflow) {
                showToast('Bot ID and Destination Flow are required', 'error');
                return;
            }
        }

        setLoading(true);
        try {
            let payload = currentData;

            // STRICT FIELD WHITELISTING for DH Config
            if (configType === 'dh') {
                const allowedFields = [
                    'config_id', 'botid', 'destinationflow', 'projectname', 'userid',
                    'speakerlanguage', 'speakerid', 'asrlanguage', 'asrprovider', 'ttsprovider',
                    'asrvadfalsetimeout', 'asrtimeout', 'micactivedelay', 'sessiontimeout',
                    'asrvadtrueblock', 'asrvadfalseblock', 'isanim', 'psaudio',
                    'a2f_config', 'customize'
                ];

                payload = {};
                allowedFields.forEach(field => {
                    if (currentData[field] !== undefined) {
                        payload[field] = currentData[field];
                    }
                });

                // Handle objects - Keep them if they exist in state, regardless of enabled status (Data Preservation)
                if (currentData.sheet) payload.sheet = currentData.sheet;
                if (currentData.idle_config) payload.idle_config = currentData.idle_config;
                if (currentData.tts_inject_config) payload.tts_inject_config = currentData.tts_inject_config;
            } else if (configType === 'a2f') {
                // STRICT FIELD WHITELISTING for A2F Config
                payload = {
                    config_id: currentData.config_id,
                    parameters: {},
                    emotions: {
                        emotion_overrides: {} // Initialize overrides
                    }
                };

                // Copy Parameters
                if (currentData.parameters) {
                    payload.parameters = { ...currentData.parameters };
                }

                // Copy Emotions
                if (currentData.emotions) {
                    // Copy flat emotion fields (excluding emotion_overrides which is an object)
                    Object.keys(currentData.emotions).forEach(key => {
                        if (key !== 'emotion_overrides') {
                            payload.emotions[key] = currentData.emotions[key];
                        }
                    });

                    // Deep copy emotion_overrides
                    if (currentData.emotions.emotion_overrides) {
                        payload.emotions.emotion_overrides = JSON.parse(JSON.stringify(currentData.emotions.emotion_overrides));
                    }
                }
            } else if (configType === 'customize') {
                // STRICT FIELD WHITELISTING for Customize Config
                payload = {
                    config_id: currentData.config_id,
                    model: currentData.model || "Charmi",
                    clothes: currentData.clothes || "Suit",
                    accessories: {},
                    color: [],
                    hair: {}
                };

                // Accessories
                if (currentData.accessories) {
                    payload.accessories = { ...currentData.accessories };
                } else {
                    payload.accessories = { hat: 0, face: 0, earring: 0 };
                }

                // Colors
                if (Array.isArray(currentData.colors)) {
                    // Note: Dashboard state uses 'colors' (plural), but API expects 'color' (singular) based on config-edit.html
                    // Let's check CustomizeConfig.jsx to see what it writes to.
                    // It writes to 'colors' (line 62 of CustomizeConfig.jsx, seen in previous turns).
                    // But config-edit.html constructs 'color' array.
                    // Attempt to read from 'colors' first, then 'color'.
                    payload.color = [...(currentData.colors || currentData.color || ["#000000", "#000000", "#000000", "#000000", "#000000"])];
                } else {
                    payload.color = ["#000000", "#000000", "#000000", "#000000", "#000000"];
                }

                // Hair
                if (currentData.hair) {
                    payload.hair = { ...currentData.hair };
                } else {
                    payload.hair = { name: "Pony Tail", color: "#555555" };
                }
            }

            await saveConfig(configType, payload);
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
        setCurrentData((prev) => {
            if (!prev.sheet) {
                return {
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
                        enabled: true, // Use boolean for internal state
                    },
                };
            }
            return {
                ...prev,
                sheet: { ...prev.sheet, enabled: enabled },
            };
        });
    };

    const toggleIdleConfig = (enabled) => {
        setCurrentData((prev) => {
            if (!prev.idle_config) {
                return {
                    ...prev,
                    idle_config: {
                        enabled: true,
                        random: true,
                        min_interval: 10,
                        max_interval: 30,
                        sentences: [],
                    },
                };
            }
            return {
                ...prev,
                idle_config: { ...prev.idle_config, enabled: enabled },
            };
        });
    };

    const toggleTTSInjectConfig = (enabled) => {
        setCurrentData((prev) => {
            if (!prev.tts_inject_config) {
                return {
                    ...prev,
                    tts_inject_config: {
                        auth_token: '',
                        callback_url: '',
                        provider: 'botnoi',
                        speaker: '523',
                        enabled: true, // Add enabled field for data preservation
                    },
                };
            }
            return {
                ...prev,
                tts_inject_config: { ...prev.tts_inject_config, enabled: enabled },
            };
        });
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

    return (
        <ConfigLayout
            configType={configType}
            setConfigType={setConfigType}
            configs={configs}
            selectedConfig={selectedConfig}
            handleSelectConfig={handleSelectConfig}
            isCreating={isCreating}
            handleNewConfig={handleNewConfig}
            loading={loading}
            currentData={currentData}
            handleSave={handleSave}
            setShowDeleteModal={setShowDeleteModal}
            showDeleteModal={showDeleteModal}
            deleteConfirmText={deleteConfirmText}
            setDeleteConfirmText={setDeleteConfirmText}
            handleDelete={handleDelete}
            ToastContainer={ToastContainer}
        >
            {configType === 'a2f' && (
                <A2FConfig
                    currentData={currentData}
                    isCreating={isCreating}
                    updateField={updateField}
                    updateNestedField={updateNestedField}
                />
            )}
            {configType === 'customize' && (
                <CustomizeConfig
                    currentData={currentData}
                    isCreating={isCreating}
                    updateField={updateField}
                    updateNestedField={updateNestedField}
                />
            )}
            {configType === 'dh' && (
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
                    a2fConfigs={a2fConfigs}
                    customizeConfigs={customizeConfigs}
                />
            )}
        </ConfigLayout>
    );
};

export default Dashboard;
