import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import { useAuth } from "../hooks/AuthProvider";

const DashboardPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  if(auth.user == null){
    navigate('/login');
  }

  return (
    <div className="bg-gray-900">
        <Dashboard />
    </div>
  )
}

export default DashboardPage