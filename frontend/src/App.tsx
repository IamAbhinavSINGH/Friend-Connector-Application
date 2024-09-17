import { BrowserRouter , Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import Dashboard from "./pages/DashboardPage"
import AuthProvider from "./hooks/AuthProvider"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"

function App() {

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/dashboard" element={<DashboardPage />}/>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

function Home(){
  return <LandingPage />
}

function DashboardPage(){
  return <Dashboard />
}

function Login(){
  return <LoginPage />
}

function SignUp(){
  return <SignUpPage />
}

export default App
