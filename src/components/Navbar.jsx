import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { signOut, isAuthenticated, onAuthChange } from '../services/authService';

/**
 * Navigation bar component
 */
export const Navbar = () => {
    const navigate = useNavigate();
    const authenticated = isAuthenticated();
    const [user, setUser] = useState(auth.currentUser);

    useEffect(() => {
        const unsubscribe = onAuthChange((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <nav
            className="sticky top-0 z-40 w-full border-b"
            style={{
                backgroundColor: 'var(--bg-panel)',
                borderColor: 'var(--border)',
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
                            <span className="text-white font-bold text-lg">DH</span>
                        </div>
                        <span className="text-xl font-bold text-text-main">DigitalHuman</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-4">
                        {authenticated && (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="px-4 py-2 text-text-main hover:text-primary transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/connect"
                                    className="px-4 py-2 text-text-main hover:text-primary transition-colors"
                                >
                                    Connect
                                </Link>
                            </>
                        )}

                        {/* User Info & Sign Out */}
                        {authenticated && user && (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-text-muted">
                                    {user.email || user.displayName || 'User'}
                                </span>
                                <button
                                    onClick={handleSignOut}
                                    className="px-4 py-2 rounded-lg font-medium transition-colors"
                                    style={{
                                        backgroundColor: 'var(--danger)',
                                        color: 'white',
                                    }}
                                    onMouseEnter={(e) => (e.target.style.opacity = '0.9')}
                                    onMouseLeave={(e) => (e.target.style.opacity = '1')}
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
