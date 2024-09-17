import axios from "axios";
import { useAuth } from "../hooks/AuthProvider";
import { useEffect, useState } from "react";
import { BASE_API } from "../../constants";

interface Follower {
    id: string,
    name: string
}

const UserItemTitle = () => {

    const auth = useAuth();
    const [followers, setFollowers] = useState<Follower[]>([]);
    const [following, setFollowing] = useState<Follower[]>([]);

    
    const getCurrentUser = async () => {
        try {
        const response = await axios.get(`${BASE_API}/user/me`, {
            headers: {
            Authorization: `Bearer ${auth.token}`
            }
        });

        if (response.data) {

            setFollowers(response.data.followers || []);
            setFollowing(response.data.following || []);
        } else {
            throw new Error('Failed to get user data');
        }
        } catch (err: any) {
            console.log(`Error while getting user info: ${err}`);
            setFollowers([]);
            setFollowing([]);
        }
    };

    useEffect(() => {
        getCurrentUser();
    },[])

  return (
    <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {auth.user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-lg font-semibold">{auth?.user?.name}</span>
        </div>
        <div className="text-sm text-gray-400">
          <span className="mr-4 text-lg ">{followers.length} Followers</span>
          <span className="text-lg">{following.length} Following</span>
        </div>
      </div>
  )
}

export default UserItemTitle
