import { useState } from "react"
import { useNavigate , Link } from "react-router-dom"
import { useAuth } from "../hooks/AuthProvider"

const AuthComponent = ({ isLogin } : {isLogin : boolean}) => {
    const [name , setName]  = useState('');
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { loginAction , signUpAction } = useAuth()
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      try {
        if(isLogin){
          const isSuccess = await loginAction({username , password});
          if(isSuccess){
            navigate('/dashboard');
          }
          else throw Error
        }else{
          const isSuccess = await signUpAction({name , username , password});
          if(isSuccess){
            navigate('/dashboard');
          }
          else throw Error
        }
      } catch (err) {
        setError('Failed to log in. Please check your credentials.')
      }
    }
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-full max-w-md space-y-8 p-8 bg-gray-900 rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-white">
              {
                isLogin ? "Log in to FriendConnect" : "Sign up to FriendConnect"
              }
              </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                { 
                  !isLogin ? 
                    <div>
                      <label htmlFor="username" className="sr-only">Name</label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 
                          placeholder-gray-500 text-white rounded-t-md focus:outline-none focus:ring-indigo-500
                          focus:border-indigo-500 focus:z-10 sm:text-sm bg-gray-800"
                          placeholder="Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                    </div> : null
                }
                <label htmlFor="username" className="sr-only">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-gray-800"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-gray-800"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
  
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
  
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Log in
              </button>
            </div>
          </form>
          <p className="mt-2 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to={isLogin ? "/signup" : "/login"} className="font-medium text-indigo-400 hover:text-indigo-300">
              {
                isLogin ? "Sign up" : "Log in"
              }
            </Link>
          </p>
        </div>
      </div>
    )
}

export default AuthComponent
