import React from 'react';
import { ToastContainer } from './Toast';

const ConfigLayout = ({
    // Sidebar Props
    configType,
    setConfigType,
    configs,
    selectedConfig,
    handleSelectConfig,
    isCreating,
    handleNewConfig,
    loading,

    // Header & Action Props
    currentData,
    handleSave,
    setShowDeleteModal,

    // Delete Modal Props
    showDeleteModal,
    deleteConfirmText,
    setDeleteConfirmText,
    handleDelete,

    // Content
    children
}) => {
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

            {/* Main Content */}
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
                                {isCreating ? `Create New ${configType.toUpperCase()} Config` : `Edit: ${currentData.config_id}`}
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

                        {/* Child Content (The specific form) */}
                        {children}
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

                        <p className="text-text-main mb-4">
                            Type <strong>BOTNOI</strong> to confirm:
                        </p>
                        <input
                            type="text"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg mb-6"
                            style={{
                                backgroundColor: 'var(--bg-input)',
                                border: '1px solid var(--border)',
                                color: 'var(--text-main)',
                            }}
                        />

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
};

export default ConfigLayout;
