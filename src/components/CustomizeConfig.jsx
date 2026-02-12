import { useState } from 'react';

export const CustomizeConfig = ({
    currentData,
    isCreating,
    updateField,
    updateNestedField
}) => {
    const [expandedSections, setExpandedSections] = useState({
        core: true,
        accessories: true,
        colors: true,
        hair: true
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Helper to get accessory value
    const getAccessoryValue = (accessoryType) => {
        return currentData.accessories?.[accessoryType] ?? 0;
    };

    // Helper to get color value
    const getColorValue = (index) => {
        return currentData.colors?.[index] ?? '#000000';
    };

    // Helper to get hair value
    const getHairValue = (field) => {
        return currentData.hair?.[field] ?? (field === 'color' ? '#000000' : '');
    };

    // Handle accessory change
    const handleAccessoryChange = (accessoryType, value) => {
        updateNestedField('accessories', accessoryType, parseInt(value) || 0);
    };

    // Handle color change
    const handleColorChange = (index, value) => {
        const colors = currentData.colors || ['#000000', '#000000', '#000000', '#000000', '#000000'];
        const newColors = [...colors];
        newColors[index] = value;
        updateField('colors', newColors);
    };

    // Handle hair change
    const handleHairChange = (field, value) => {
        updateNestedField('hair', field, value);
    };

    return (
        <>
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
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">
                                Config ID <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                value={currentData.config_id || ''}
                                onChange={(e) => updateField('config_id', e.target.value)}
                                readOnly={!isCreating}
                                placeholder="my_customize_config"
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
                                Model
                            </label>
                            <input
                                type="text"
                                value={currentData.model || ''}
                                onChange={(e) => updateField('model', e.target.value)}
                                placeholder="ModelName"
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
                                Clothes
                            </label>
                            <input
                                type="text"
                                value={currentData.clothes || ''}
                                onChange={(e) => updateField('clothes', e.target.value)}
                                placeholder="Casual"
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

            {/* Accessories Section */}
            <div
                className="mb-4 rounded-xl border overflow-hidden"
                style={{
                    backgroundColor: 'var(--bg-panel)',
                    borderColor: 'var(--border)',
                }}
            >
                <button
                    onClick={() => toggleSection('accessories')}
                    className="w-full px-6 py-4 flex justify-between items-center hover:opacity-80"
                    style={{ backgroundColor: 'var(--bg-input)' }}
                >
                    <h3 className="text-lg font-semibold text-text-main">Accessories</h3>
                    <span className="text-text-main">{expandedSections.accessories ? '▼' : '▶'}</span>
                </button>

                {expandedSections.accessories && (
                    <div className="p-6 grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">
                                Hat
                            </label>
                            <input
                                type="number"
                                value={getAccessoryValue('hat')}
                                onChange={(e) => handleAccessoryChange('hat', e.target.value)}
                                min="0"
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
                                Face
                            </label>
                            <input
                                type="number"
                                value={getAccessoryValue('face')}
                                onChange={(e) => handleAccessoryChange('face', e.target.value)}
                                min="0"
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
                                Earring
                            </label>
                            <input
                                type="number"
                                value={getAccessoryValue('earring')}
                                onChange={(e) => handleAccessoryChange('earring', e.target.value)}
                                min="0"
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

            {/* Colors Section */}
            <div
                className="mb-4 rounded-xl border overflow-hidden"
                style={{
                    backgroundColor: 'var(--bg-panel)',
                    borderColor: 'var(--border)',
                }}
            >
                <button
                    onClick={() => toggleSection('colors')}
                    className="w-full px-6 py-4 flex justify-between items-center hover:opacity-80"
                    style={{ backgroundColor: 'var(--bg-input)' }}
                >
                    <h3 className="text-lg font-semibold text-text-main">Colors</h3>
                    <span className="text-text-main">{expandedSections.colors ? '▼' : '▶'}</span>
                </button>

                {expandedSections.colors && (
                    <div className="p-6">
                        <div className="grid grid-cols-5 gap-4">
                            {[0, 1, 2, 3, 4].map((index) => (
                                <div key={index}>
                                    <label className="block text-sm font-medium text-text-muted mb-2">
                                        Color {index + 1}
                                    </label>
                                    <div className="flex flex-col items-center gap-2">
                                        <input
                                            type="color"
                                            value={getColorValue(index)}
                                            onChange={(e) => handleColorChange(index, e.target.value)}
                                            className="w-full h-12 rounded-lg cursor-pointer"
                                            style={{
                                                border: '2px solid var(--border)',
                                            }}
                                        />
                                        <span className="text-xs text-text-muted font-mono">
                                            {getColorValue(index)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Hair Section */}
            <div
                className="mb-4 rounded-xl border overflow-hidden"
                style={{
                    backgroundColor: 'var(--bg-panel)',
                    borderColor: 'var(--border)',
                }}
            >
                <button
                    onClick={() => toggleSection('hair')}
                    className="w-full px-6 py-4 flex justify-between items-center hover:opacity-80"
                    style={{ backgroundColor: 'var(--bg-input)' }}
                >
                    <h3 className="text-lg font-semibold text-text-main">Hair</h3>
                    <span className="text-text-main">{expandedSections.hair ? '▼' : '▶'}</span>
                </button>

                {expandedSections.hair && (
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">
                                Hair Name
                            </label>
                            <input
                                type="text"
                                value={getHairValue('name')}
                                onChange={(e) => handleHairChange('name', e.target.value)}
                                placeholder="HairStyle"
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
                                Hair Color
                            </label>
                            <div className="flex gap-4 items-end">
                                <div className="flex-1">
                                    <input
                                        type="color"
                                        value={getHairValue('color')}
                                        onChange={(e) => handleHairChange('color', e.target.value)}
                                        className="w-full h-12 rounded-lg cursor-pointer"
                                        style={{
                                            border: '2px solid var(--border)',
                                        }}
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={getHairValue('color')}
                                        readOnly
                                        className="w-full px-4 py-3 rounded-lg font-mono text-sm"
                                        style={{
                                            backgroundColor: 'var(--bg-input)',
                                            border: '1px solid var(--border)',
                                            color: 'var(--text-main)',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default CustomizeConfig;
