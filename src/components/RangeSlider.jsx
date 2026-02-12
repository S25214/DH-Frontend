export const RangeSlider = ({ label, value, onChange, min, max, step, defaultValue }) => {
    const displayValue = value !== undefined && value !== null ? value : defaultValue;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                    {label}
                </label>
                <span
                    className="text-xs font-mono px-2 py-1 rounded"
                    style={{
                        backgroundColor: 'var(--bg-input)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-main)',
                        minWidth: '50px',
                        textAlign: 'right'
                    }}
                >
                    {displayValue}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={displayValue}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                style={{
                    backgroundColor: 'var(--bg-input)',
                    accentColor: 'var(--primary)',
                }}
            />
        </div>
    );
};

export default RangeSlider;
