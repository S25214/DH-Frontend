import { useState } from 'react';
import RangeSlider from './RangeSlider';
import ToggleSwitch from './ToggleSwitch';

// A2F Configuration Constants
const A2F_PARAMS = [
    { id: 'blink_strength', label: 'Blink Strength', min: 0, max: 2, step: 0.1, def: 1 },
    { id: 'eyelid_open_offset', label: 'Eyelid Open Offset', min: -1, max: 1, step: 0.1, def: 0 },
    { id: 'face_mask_level', label: 'Face Mask Level', min: 0, max: 1, step: 0.05, def: 0.6 },
    { id: 'face_mask_softness', label: 'Face Mask Softness', min: 0.001, max: 0.5, step: 0.001, def: 0.0085 },
    { id: 'lip_open_offset', label: 'Lip Open Offset', min: -0.2, max: 0.2, step: 0.01, def: 0 },
    { id: 'lower_face_smoothing', label: 'Lower Face Smoothing', min: 0, max: 0.1, step: 0.001, def: 0.006 },
    { id: 'lower_face_strength', label: 'Lower Face Strength', min: 0, max: 2, step: 0.1, def: 1 },
    { id: 'tongue_depth_offset', label: 'Tongue Depth Offset', min: -3, max: 3, step: 0.1, def: 0 },
    { id: 'tongue_height_offset', label: 'Tongue Height Offset', min: -3, max: 3, step: 0.1, def: 0 },
    { id: 'tongue_strength', label: 'Tongue Strength', min: 0, max: 3, step: 0.1, def: 1.3 },
    { id: 'upper_face_smoothing', label: 'Upper Face Smoothing', min: 0, max: 0.1, step: 0.001, def: 0.001 },
    { id: 'upper_face_strength', label: 'Upper Face Strength', min: 0, max: 2, step: 0.1, def: 1 },
    { id: 'skin_strength', label: 'Skin Strength', min: 0, max: 2, step: 0.1, def: 1 }
];

const A2F_EMOTIONS_GENERAL = [
    { id: 'detected_emotion_contrast', label: 'Contrast', min: 0.3, max: 3, step: 0.1, def: 1 },
    { id: 'detected_emotion_smoothing', label: 'Smoothing', min: 0, max: 1, step: 0.05, def: 0.7 },
    { id: 'max_detected_emotions', label: 'Max Detected', min: 1, max: 6, step: 1, def: 3 },
    { id: 'emotion_override_strength', label: 'Override Strength', min: 0, max: 1, step: 0.1, def: 0.5 },
    { id: 'overall_emotion_strength', label: 'Overall Strength', min: 0, max: 1, step: 0.1, def: 0.6 }
];

const A2F_EMOTION_TYPES = [
    "amazement", "anger", "cheekiness", "disgust", "fear",
    "grief", "joy", "outofbreath", "pain", "sadness"
];

export const A2FConfig = ({
    currentData,
    isCreating,
    updateField,
    updateNestedField
}) => {
    const [expandedSections, setExpandedSections] = useState({
        core: true,
        parameters: true,
        emotions: true,
        emotionOverrides: false
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Helper to get parameter value
    const getParamValue = (paramId) => {
        return currentData.parameters?.[paramId] ?? A2F_PARAMS.find(p => p.id === paramId)?.def ?? 0;
    };

    // Helper to get emotion value
    const getEmotionValue = (emotionId) => {
        return currentData.emotions?.[emotionId] ?? A2F_EMOTIONS_GENERAL.find(e => e.id === emotionId)?.def ?? 0;
    };

    // Helper to check if emotion override is enabled
    const isEmotionOverrideEnabled = (emotionType) => {
        return currentData.emotions?.emotion_overrides?.[emotionType] !== undefined;
    };

    // Helper to get emotion override value
    const getEmotionOverrideValue = (emotionType) => {
        return currentData.emotions?.emotion_overrides?.[emotionType] ?? 0.5;
    };

    // Handle parameter change
    const handleParameterChange = (paramId, value) => {
        updateNestedField('parameters', paramId, value);
    };

    // Handle emotion change
    const handleEmotionChange = (emotionId, value) => {
        updateNestedField('emotions', emotionId, value);
    };

    // Handle emotion override toggle
    const handleEmotionOverrideToggle = (emotionType, enabled) => {
        if (enabled) {
            // Add the override with default value
            const overrides = currentData.emotions?.emotion_overrides || {};
            updateNestedField('emotions', 'emotion_overrides', {
                ...overrides,
                [emotionType]: 0.5
            });
        } else {
            // Remove the override
            const overrides = { ...(currentData.emotions?.emotion_overrides || {}) };
            delete overrides[emotionType];
            updateNestedField('emotions', 'emotion_overrides', overrides);
        }
    };

    // Handle emotion override value change
    const handleEmotionOverrideChange = (emotionType, value) => {
        const overrides = currentData.emotions?.emotion_overrides || {};
        updateNestedField('emotions', 'emotion_overrides', {
            ...overrides,
            [emotionType]: value
        });
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
                    <div className="p-6">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">
                                Config ID <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                value={currentData.config_id || ''}
                                onChange={(e) => updateField('config_id', e.target.value)}
                                readOnly={!isCreating}
                                placeholder="my_a2f_config"
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

            {/* Parameters Section */}
            <div
                className="mb-4 rounded-xl border overflow-hidden"
                style={{
                    backgroundColor: 'var(--bg-panel)',
                    borderColor: 'var(--border)',
                }}
            >
                <button
                    onClick={() => toggleSection('parameters')}
                    className="w-full px-6 py-4 flex justify-between items-center hover:opacity-80"
                    style={{ backgroundColor: 'var(--bg-input)' }}
                >
                    <h3 className="text-lg font-semibold text-text-main">Parameters</h3>
                    <span className="text-text-main">{expandedSections.parameters ? '▼' : '▶'}</span>
                </button>

                {expandedSections.parameters && (
                    <div className="p-6 space-y-4">
                        {A2F_PARAMS.map((param) => (
                            <RangeSlider
                                key={param.id}
                                label={param.label}
                                value={getParamValue(param.id)}
                                onChange={(value) => handleParameterChange(param.id, value)}
                                min={param.min}
                                max={param.max}
                                step={param.step}
                                defaultValue={param.def}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Emotions Section */}
            <div
                className="mb-4 rounded-xl border overflow-hidden"
                style={{
                    backgroundColor: 'var(--bg-panel)',
                    borderColor: 'var(--border)',
                }}
            >
                <button
                    onClick={() => toggleSection('emotions')}
                    className="w-full px-6 py-4 flex justify-between items-center hover:opacity-80"
                    style={{ backgroundColor: 'var(--bg-input)' }}
                >
                    <h3 className="text-lg font-semibold text-text-main">Emotions</h3>
                    <span className="text-text-main">{expandedSections.emotions ? '▼' : '▶'}</span>
                </button>

                {expandedSections.emotions && (
                    <div className="p-6 space-y-6">
                        {/* General Emotion Settings */}
                        <div className="space-y-4">
                            <h4 className="text-md font-semibold text-text-main mb-3">General Settings</h4>
                            {A2F_EMOTIONS_GENERAL.map((emotion) => (
                                <RangeSlider
                                    key={emotion.id}
                                    label={emotion.label}
                                    value={getEmotionValue(emotion.id)}
                                    onChange={(value) => handleEmotionChange(emotion.id, value)}
                                    min={emotion.min}
                                    max={emotion.max}
                                    step={emotion.step}
                                    defaultValue={emotion.def}
                                />
                            ))}
                        </div>

                        {/* Emotion Overrides */}
                        <div>
                            <button
                                onClick={() => toggleSection('emotionOverrides')}
                                className="w-full flex justify-between items-center py-2 hover:opacity-80"
                            >
                                <h4 className="text-md font-semibold text-text-main">Emotion Overrides</h4>
                                <span className="text-text-main text-sm">{expandedSections.emotionOverrides ? '▼' : '▶'}</span>
                            </button>

                            {expandedSections.emotionOverrides && (
                                <div className="mt-3 space-y-3">
                                    {A2F_EMOTION_TYPES.map((emotionType) => (
                                        <div key={emotionType} className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 min-w-[160px]">
                                                <ToggleSwitch
                                                    checked={isEmotionOverrideEnabled(emotionType)}
                                                    onChange={(checked) => handleEmotionOverrideToggle(emotionType, checked)}
                                                />
                                                <span className="text-sm text-text-main capitalize">{emotionType}</span>
                                            </div>
                                            {isEmotionOverrideEnabled(emotionType) && (
                                                <div className="flex-1">
                                                    <RangeSlider
                                                        label=""
                                                        value={getEmotionOverrideValue(emotionType)}
                                                        onChange={(value) => handleEmotionOverrideChange(emotionType, value)}
                                                        min={0}
                                                        max={1}
                                                        step={0.1}
                                                        defaultValue={0.5}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default A2FConfig;
