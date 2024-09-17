import { useEffect, useState } from 'react';
import UserItem from './UserItem';
import axios from 'axios';
import { BASE_API } from '../../constants';
import { useAuth } from '../hooks/AuthProvider';
import UserItemTitle from './UserItemTitle';

interface Friend {
  id: string;
  name: string;
  status: string;
}

const Suggestions = () => {
  const auth = useAuth();
  const [mutualFriends, setMutualFriends] = useState<Friend[]>([]);
  const [suggestedFriends, setSuggestedFriends] = useState<Friend[]>([]);

  const getFriends = async () => {
    try {
      const mutualResponse = await axios.get(`${BASE_API}/user/mutual`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      const suggestedResponse = await axios.get(`${BASE_API}/user/suggestions`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (mutualResponse.data && mutualResponse.data.mutualFriends) {
        setMutualFriends(mutualResponse.data.mutualFriends);
      } else {
        setMutualFriends([]);
      }

      if (suggestedResponse.data && suggestedResponse.data.suggestion) {
        setSuggestedFriends(suggestedResponse.data.suggestion);
      } else {
        setSuggestedFriends([]);
      }
    } catch (err: any) {
      console.error(`Error while fetching friends: ${err}`);
    }
  };

  useEffect(() => {
    getFriends();
  }, []);

  return (
    <div>
      <UserItemTitle />
      <div>
        <div className="text-xl text-stone-100 font-medium mt-10">Mutual Friends</div>
        <div className='mt-4 space-y-2'>
          {mutualFriends.length !== 0 ? (
            mutualFriends.map((friend) => (
              <UserItem key={friend.id} id={friend.id} name={friend.name} status={friend.status} />
            ))
          ) : (
            <div className='text-lg font-medium text-stone-400' >No mutual friends found</div>
          )}
        </div>
      </div>
      <div>
        <div className="text-xl text-stone-100 mt-10 font-medium">
          Suggestions based on hobbies and interests
        </div>
        <div className='mt-4 space-y-2'>
          {suggestedFriends.length !== 0 ? (
            suggestedFriends.map((friend) => (
              <UserItem key={friend.id} id={friend.id} name={friend.name} status={friend.status} />
            ))
          ) : (
            <div className='text-lg font-medium text-stone-400'>No suggestions found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
