

export const DHConfig = ({
    currentData,
    isCreating,
    updateField,
    updateNestedField,
    toggleSection,
    expandedSections,
    toggleSheetConfig,
    toggleIdleConfig,
    toggleTTSInjectConfig,
    addIdleSentence,
    updateIdleSentence,
    removeIdleSentence
}) => {
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
        </>
    );
};

export default DHConfig;
