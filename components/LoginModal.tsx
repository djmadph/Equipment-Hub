
import React, { useState } from 'react';

interface LoginModalProps {
    onClose: () => void;
    onLoginSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would be a secure API call.
        if (username === 'Kurt C.' && password === 'camano') {
            onLoginSuccess();
        } else {
            setError('Invalid username or password.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-brand-row p-8 rounded-lg w-full max-w-sm shadow-2xl shadow-black/40" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-center text-2xl font-semibold mt-0 mb-4">Admin Login</h2>
                <form onSubmit={handleLogin}>
                    {error && <p className="text-brand-danger text-center text-sm mb-4">{error}</p>}
                    <div className="mb-4">
                        <label htmlFor="username" className="block mb-2 text-sm text-brand-text-light">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 text-base rounded-lg border border-brand-border bg-brand-header text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password"className="block mb-2 text-sm text-brand-text-light">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 text-base rounded-lg border border-brand-border bg-brand-header text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full p-3.5 text-base font-semibold rounded-lg border-none bg-brand-accent text-white cursor-pointer">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
