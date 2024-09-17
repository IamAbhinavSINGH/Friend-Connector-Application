import axios from "axios";
import { BASE_API } from "../../constants";
import { useAuth } from "../hooks/AuthProvider"
import { useState } from "react";


const UserItem = ({id , name ,status} : {id : string , name : string , status : string}) => {
  const auth = useAuth();
  const [requestStatus , setRequestStatus] = useState<string>(status);

  const handleRequestButtonClicked = async () => {
    if(requestStatus === "Send request"){
      try{
        const body = {recieverId : id};
        const response = await axios.post(`${BASE_API}/user/sendRequest` , body , {
          headers : {
            Authorization : `Bearer ${auth.token}`
          }
        });
        if(response.data){
          setRequestStatus("Friend request sent");
        }
      }catch(err : any){
        setRequestStatus("Couldn't send request");
      }
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between bg-gray-800 p-3 rounded-md">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white font-semibold">
                {name.charAt(0).toUpperCase()}
              </div>
                <span className="text-gray-200">{name}</span>
            </div>
                <button onClick={handleRequestButtonClicked} className='inline-flex items-center px-3 py-1 rounded-full text-m font-semibold bg-white text-black 
                hover:bg-gray-200 hover:text-blue-900 transition-all duration-100 ease-in-out transform hover:scale-105'>
                  {requestStatus}
                </button>
        </div>
    </div>
  )
}

export default UserItem
