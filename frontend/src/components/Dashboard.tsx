import { useState } from 'react';
import { Home, Users, User, Menu } from 'lucide-react'; // Added Menu icon
import HomeDetails from "../components/HomeDetails";
import Suggestions from './Suggestions';
import Profile from './Profile';


type NavItem = 'Home' | 'Suggestions' | 'Profile';

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState<NavItem>('Home');
  const [isNavOpen, setIsNavOpen] = useState(false); // State to toggle mobile navigation

  const renderContent = () => {
    switch (activeNav) {
      case 'Home':
        return (
          <div>
             <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <HomeDetails />
          </div> 
        );
      case 'Suggestions':
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold mb-6">Suggestions</h2>
            <Suggestions />
          </div>
        );
      case 'Profile':
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold mb-6">Profile</h2>
            <Profile />
          </div>
        );
      default:
        return null;
    }
  };

  const handleNavClick = (navItem: NavItem) => {
    setActiveNav(navItem);
    setIsNavOpen(false); // Close the menu when an item is clicked
  };

  return (
    <div className="flex h-screen bg-black text-white">
      <div className="lg:hidden p-4 bg-gray-900">
        <button onClick={() => setIsNavOpen(!isNavOpen)}>
          <Menu size={28} />
        </button>
      </div>

      {isNavOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-10 lg:hidden"
          onClick={() => setIsNavOpen(false)} // Clicking outside will close the menu
        />
      )}

      <nav
        className={`lg:flex flex-col justify-center w-64 bg-gray-900 p-4 h-screen border-r border-gray-700 transition-transform duration-300 transform lg:translate-x-0 ${
          isNavOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static fixed z-20`} 
      >
        <div className="space-y-4">
          <button
            className={`flex items-center space-x-2 w-full p-2 rounded-md ${
              activeNav === 'Home' ? 'bg-gray-800' : 'hover:bg-gray-800'
            }`}
            onClick={() => handleNavClick('Home')} // Close menu after clicking
          >
            <Home size={20} />
            <span>Home</span>
          </button>
          <button
            className={`flex items-center space-x-2 w-full p-2 rounded-md ${
              activeNav === 'Suggestions' ? 'bg-gray-800' : 'hover:bg-gray-800'
            }`}
            onClick={() => handleNavClick('Suggestions')} // Close menu after clicking
          >
            <Users size={20} />
            <span>Suggestions</span>
          </button>
          <button
            className={`flex items-center space-x-2 w-full p-2 rounded-md ${
              activeNav === 'Profile' ? 'bg-gray-800' : 'hover:bg-gray-800'
            }`}
            onClick={() => handleNavClick('Profile')} // Close menu after clicking
          >
            <User size={20} />
            <span>Profile</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 p-8 overflow-auto bg-gray-900">
        {renderContent()}
      </main>
    </div>
  );
}
