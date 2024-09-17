import  AppBar  from '../components/AppBar';
import { Link } from 'react-router-dom'
import { ArrowRight } from "lucide-react"

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <AppBar />

      <main className="flex-grow flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Connect with Friends, Anytime, Anywhere
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            FriendConnect brings people together, making it easier than ever to stay in touch with your loved ones.
          </p>
          <Link 
            to="/dashboard" 
            className="inline-flex items-center px-8 py-3 text-lg font-semibold text-black bg-white rounded-full
                      hover:bg-gray-200 hover:text-blue-500 transition-all duration-300 ease-in-out 
                      transform hover:scale-105">
                Go to Dashboard
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 ease-in-out transform hover:translate-x-1" />
          </Link>
        </div>
      </main>

      <footer className="border-t border-gray-800 py-4 text-center text-gray-400">
        <p>&copy; 2023 FriendConnect. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default LandingPage
