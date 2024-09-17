import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthProvider';

const AppBar = () => {
    const auth = useAuth();
    const navigate = useNavigate(); 

    const handleClick = () => {
        if (auth.user) {
            auth.logOut();  // log out the user
            navigate("/");   // programmatically redirect to home
        } else {
            navigate("/login"); // programmatically redirect to login
        }
    }

    return (
        <div>
            <header className="border-b border-gray-800">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Connector</h1>
                    <nav>
                        <ul className="flex space-x-4">
                            <li>
                                <button 
                                    onClick={handleClick} 
                                    className="text-gray-300 hover:text-blue-400 transition duration-300">
                                    {auth.user ? 'LogOut' : 'Log in'}
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
        </div>
    );
}

export default AppBar;
