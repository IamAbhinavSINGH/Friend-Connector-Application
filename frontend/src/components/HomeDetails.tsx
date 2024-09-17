import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { BASE_API } from '../../constants';
import axios from 'axios';
import UserItemTitle from './UserItemTitle';
import UserItem from "./UserItem"
import { useAuth } from '../hooks/AuthProvider';

interface Friend {
  id: string,
  name: string,
  status: string
}

const HomeDetails = () => {

  return (
    <div className="space-y-6">
      <UserItemTitle />
      <div className='relative'>
          <SearchBar />
      </div>
    </div>
  );
};

const SearchBar = () => {
  const auth = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Friend[]>([]);
  const [searchResultError, setSearchResultError] = useState('');

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    try {
      const response = await axios.get(`${BASE_API}/user/bulk?filter=${query}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });

      if (response.data && response.data.users) {
        setSearchResults(response.data.users);
        setSearchResultError('');
      } else {
        throw new Error('No users found');
      }
    } catch (err: any) {
      setSearchResults([]);
      setSearchResultError(err.message || 'An error occurred during search');
    }
  };

  useEffect(() => {
    handleSearch("");
  }, []);

  return (
    <div >
      <div>
        <input
          type="text"
          placeholder="Search by username or name..."
          className="w-full px-2 py-3 pl-10 bg-gray-800 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Search className="absolute left-3 top-3.5 text-gray-500" size={18} />
      </div>
      <div className="pt-4 space-y-2">
        {
          searchResults ? 
            searchResults.map((friend) => (
              <UserItem key={friend.id} id={friend.id} name={friend.name} status={friend.status} />
            )) : searchResultError
        }
      </div>
    </div>
  );

}

export default HomeDetails;
