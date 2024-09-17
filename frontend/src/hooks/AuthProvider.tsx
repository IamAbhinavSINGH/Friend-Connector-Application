import axios from "axios";
import { useContext, createContext, useState, ReactNode, useEffect } from "react";
import { BASE_API } from "../../constants";

interface AuthContextType {
  token: string;
  user: User | null;
  loginAction: (data: LoginData) => Promise<boolean>;
  signUpAction: (data: SignUpData) => Promise<boolean>;
  logOut: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface LoginData {
  username: string;
  password: string;
}

interface SignUpData {
  name: string;
  username: string;
  password: string;
}

// Initialize the AuthContext with a default value (which can be null initially)
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>(localStorage.getItem("site") || "");

  // Effect to restore user state when the component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("site");
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const loginAction = async (data: LoginData) : Promise<boolean>  => {
    try {
      const response = await axios.post(`${BASE_API}/auth/login`, data);

      if (response.data) {
        const { user, token } = response.data;
        setUser(user);
        setToken(token);
        localStorage.setItem("site", token);
        localStorage.setItem("user", JSON.stringify(user)); // Store user data
        return true;
      }

      throw new Error(response.data.message);
    } catch (err: any) {
      console.error(err.message || "An error occurred during login");
      return false;
    }
  };

  const signUpAction = async (data: SignUpData) : Promise<boolean> => {
    try {
      const response = await axios.post(`${BASE_API}/auth/signup`, data);

      if (response && response.data) {
        const { user, token } = response.data;
        setUser(user);
        setToken(token);
        localStorage.setItem("site", token);
        localStorage.setItem("user", JSON.stringify(user)); // Store user data
        return true;
      }

      throw new Error(response.data.message);
    } catch (err: any) {
      console.error(err.message || "An error occurred during signup");
      return false;
    }
  };

  const logOut = (): void => {
    setUser(null);
    setToken("");
    localStorage.removeItem("site");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, loginAction, signUpAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

// Custom hook to consume the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
