import { Menu, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

function Navbar({ setIsSidebarOpen, setIsWalletOpen }) {
    const { user } = useUser();
    const navigate = useNavigate();

    return (
        <nav className="flex items-center justify-between bg-[#1A2C38] text-white px-4 py-2 h-[8vh] shadow-md w-full">
            
            {/* Left: Sidebar toggle + Logo */}
            <div className="flex items-center gap-4">
                <button
                    className="lg:hidden focus:outline-none"
                    onClick={() => setIsSidebarOpen(prev => !prev)}
                >
                    <Menu className="h-6 w-6" />
                </button>

                <Link to={"/"}>
                    <h1 className="text-xl sm:text-2xl font-extrabold whitespace-nowrap tracking-wide flex items-center">
                        <span className="text-gray-200 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.6)]">
                            7
                        </span>
                        <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 bg-clip-text text-transparent drop-shadow-[2px_2px_6px_rgba(0,0,0,0.9)]">
                            XBET
                        </span>
                    </h1>
                </Link>
            </div>

            {/* Center: Auth Buttons (on mobile) */}
            {!user && (
                <div className="flex gap-2 lg:hidden">
                    <button
                        onClick={() => navigate("/login")}
                        className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800 transition"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate("/register")}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Register
                    </button>
                </div>
            )}

            {/* Wallet + Profile (if logged in) */}
            {user && (
                <>
                    {/* Wallet Box */}
                    <div className="flex items-center rounded-md overflow-hidden shadow-sm text-sm">
                        <div className="bg-[#071824] px-3 py-1 font-semibold text-white">
                            ₹{Number(user.wallet).toFixed(2)}
                        </div>
                        <button
                            onClick={() => setIsWalletOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-white font-medium transition"
                        >
                            Wallet
                        </button>
                    </div>

                    {/* Profile Icon */}
                    <button
                        onClick={() => navigate('/profile')}
                        className="hidden md:block p-1 rounded-full hover:bg-[#0e1d28] transition"
                    >
                        <User className="w-6 h-6 text-white" />
                    </button>
                </>
            )}
        </nav>
    );
}

export default Navbar;