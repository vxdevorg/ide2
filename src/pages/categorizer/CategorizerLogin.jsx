import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import logo2 from '../../assets/images/logo2.png';

// Pre-configured categorizer credentials
const CATEGORIZER_CREDENTIALS = {
    'categorizer1': { password: 'cat123pass1', id: 'CAT001' },
    'categorizer2': { password: 'cat123pass2', id: 'CAT002' },
    'categorizer3': { password: 'cat123pass3', id: 'CAT003' },
    'categorizer4': { password: 'cat123pass4', id: 'CAT004' },
    'categorizer5': { password: 'cat123pass5', id: 'CAT005' },
    'categorizer6': { password: 'cat123pass6', id: 'CAT006' },
    'categorizer7': { password: 'cat123pass7', id: 'CAT007' },
    'categorizer8': { password: 'cat123pass8', id: 'CAT008' },
    'categorizer9': { password: 'cat123pass9', id: 'CAT009' },
    'categorizer10': { password: 'cat123pass10', id: 'CAT010' },
    'categorizer11': { password: 'cat123pass10', id: 'CAT011' }
};

export default function CategorizerLogin() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validate credentials
        const userCreds = CATEGORIZER_CREDENTIALS[username.toLowerCase()];

        if (!userCreds) {
            setError('Invalid username. Please use categorizer1 to categorizer10.');
            setLoading(false);
            return;
        }

        if (userCreds.password !== password) {
            setError('Incorrect password. Please try again.');
            setLoading(false);
            return;
        }

        // Store categorizer info in localStorage
        localStorage.setItem('categorizerId', userCreds.id);
        localStorage.setItem('categorizerName', username.toLowerCase());
        localStorage.setItem('categorizerAuth', 'true');

        console.log(`✅ Categorizer ${username} logged in successfully`);

        // Navigate to categorizer dashboard
        setTimeout(() => {
            navigate('/categorizer/dashboard');
        }, 500);
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-10 px-4 py-6">
                <img src={logo} className="w-[100px] h-[90px] sm:w-[150px] sm:h-[130px]" alt="Logo 1" />
                <h1 className="text-center font-poppins font-semibold text-[28px] sm:text-[40px] md:text-[50px] leading-[100%] tracking-[0.05em] text-[#0868CC]">
                    Categorizer Portal
                </h1>
                <img src={logo2} className="w-[100px] h-[90px] sm:w-[150px] sm:h-[130px]" alt="Logo 2" />
            </div>

            {/* Login Form */}
            <div className="flex-1 flex items-center justify-center px-4 py-8">
                <div className="bg-white rounded-[20px] shadow-2xl p-8 w-full max-w-[450px] border border-gray-200">
                    <div className="text-center mb-8">
                        <h2 className="text-[28px] font-bold text-[#0868CC] mb-2">
                            Categorizer Login
                        </h2>
                        <p className="text-gray-600 text-sm">
                            Sign in to categorize candidate performances
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="categorizer1"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0868CC] focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0868CC] focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-lg font-semibold text-white text-[16px] transition-all ${loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-[#0868CC] hover:bg-[#075bb4] shadow-lg hover:shadow-xl'
                                }`}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    {/* Info Box */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-xs text-blue-800 font-semibold mb-2">
                            📋 Categorizer Accounts:
                        </p>
                        <p className="text-xs text-blue-700">
                            Use <strong>categorizer1</strong> to <strong>categorizer10</strong>
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                            Contact admin for your password
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center py-4 text-sm text-gray-500">
                <p>International Day of Persons with Disabilities – 2025</p>
            </div>
        </div>
    );
}
