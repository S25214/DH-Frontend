export const ToggleSwitch = ({ checked, onChange }) => {
    return (
        <label className="relative inline-block cursor-pointer" style={{ width: '44px', height: '24px' }}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="opacity-0 w-0 h-0"
                style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span
                className="absolute inset-0 rounded-full transition-all duration-400"
                style={{
                    backgroundColor: checked ? 'var(--success)' : 'var(--bg-input)',
                    transition: '.4s',
                }}
            >
                <span
                    className="absolute rounded-full bg-white transition-transform duration-400"
                    style={{
                        height: '18px',
                        width: '18px',
                        left: '3px',
                        bottom: '3px',
                        transform: checked ? 'translateX(20px)' : 'translateX(0)',
                        transition: '.4s',
                    }}
                ></span>
            </span>
        </label>
    );
};

export default ToggleSwitch;
