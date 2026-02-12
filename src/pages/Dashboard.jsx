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
        });
    };

    const handleSave = async () => {
        if (!currentData || !currentData.config_id) {
            showToast('Config ID is required', 'error');
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
                                {isCreating ? `Create New ${configType.toUpperCase()}` : `Edit: ${currentData.config_id}`}
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

                        {/* Simple Form for DH Config */}
                        <div
                            className="p-6 rounded-xl border"
                            style={{
                                backgroundColor: 'var(--bg-panel)',
                                borderColor: 'var(--border)',
                            }}
                        >
                            <h3 className="text-lg font-semibold text-text-main mb-4">Core Settings</h3>

                            <div className="grid md:grid-cols-2 gap-6">
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

                                {configType === 'dh' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-text-muted mb-2">
                                                Bot ID <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={currentData.botid || ''}
                                                onChange={(e) => updateField('botid', e.target.value)}
                                                className="w-full px-4 py-3 rounded-lg"
                                                style={{
                                                    backgroundColor: 'var(--bg-input)',
                                                    border: '1px solid var(--border)',
                                                    color: 'var(--text-main)',
                                                }}
                                                placeholder="Bot ID"
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
                                                className="w-full px-4 py-3 rounded-lg"
                                                style={{
                                                    backgroundColor: 'var(--bg-input)',
                                                    border: '1px solid var(--border)',
                                                    color: 'var(--text-main)',
                                                }}
                                                placeholder="e.g., IN_greeting"
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
                                                className="w-full px-4 py-3 rounded-lg"
                                                style={{
                                                    backgroundColor: 'var(--bg-input)',
                                                    border: '1px solid var(--border)',
                                                    color: 'var(--text-main)',
                                                }}
                                                placeholder="Project Name"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            <p className="mt-6 text-sm text-text-muted">
                                Note: This is a simplified editor. For advanced configuration with all fields,
                                please refer to the full config-edit.html file.
                            </p>
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
