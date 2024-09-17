import axios from "axios";
import { useAuth } from "../hooks/AuthProvider";
import UserItemTitle from "./UserItemTitle";
import RequestItem from "./RequestItem";  // Import the new component
import { useState, useEffect } from "react";
import { BASE_API } from "../../constants";

interface Interest {
    interest: string;
}

interface Hobby {
    hobby: string;
}

interface Request {
    id: string;
    name: string;
}

const Profile = () => {
    const auth = useAuth();
    const [interests, setInterests] = useState<Interest[]>([]);
    const [hobbies, setHobbies] = useState<Hobby[]>([]);
    const [incomingRequests, setIncomingRequests] = useState<Request[]>([]);
    const [sentRequests, setSentRequests] = useState<Request[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        getPersonalization();
        getRequests();
    }, []);

    const getPersonalization = async () => {
        try {
            const response = await axios.get(`${BASE_API}/user/personalization`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });

            if (response.data) {
                setInterests(response.data.interests);
                setHobbies(response.data.hobbies);
            } else throw Error("Could not fetch information");
        } catch (err: any) {
            setErrorMessage(err.message);
            setInterests([]);
            setHobbies([]);
            console.error(`Error while fetching personalization info: ${err}`);
        }
    };

    const getRequests = async () => {
        try {
            const response = await axios.get(`${BASE_API}/user/getRequest`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });

            if (response.data) {
                setSentRequests(response.data.sentRequests || []);
                setIncomingRequests(response.data.receivedRequests || []);
            } else throw Error("Could not fetch requests");
        } catch (err: any) {
            setErrorMessage(err.message);
            setSentRequests([]);
            setIncomingRequests([]);
            console.error(`Error while fetching requests: ${err}`);
        }
    };

    const handleAcceptRequest = async (id: string) => {
        try {
            const response = await axios.post(`${BASE_API}/user/handleRequest`, {
                senderId: id,
                isAccepted: true
            }, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });

            if (response.data) {
                console.log(`Accepted request with ID: ${id}`);
                // Remove the accepted request from the state
                setIncomingRequests(prevRequests => 
                    prevRequests.filter(request => request.id !== id)
                );
            } else {
                console.log(response.data);
                throw Error(response.data.message);
            }
        } catch (err: any) {
            setErrorMessage(err.message);
            console.error(`Error while accepting request: ${err}`);
        }
    };

    const handleDeleteRequest = async (id: string) => {
        try {
            const response = await axios.post(`${BASE_API}/user/handleRequest`, {
                senderId: id,
                isAccepted: false
            }, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });

            if (response.data) {
                console.log(`Deleted request with ID: ${id}`);
                setIncomingRequests(prevRequests => 
                    prevRequests.filter(request => request.id !== id)
                );
            } else {
                console.log(response.data);
                throw Error(response.data.message);
            }
        } catch (err: any) {
            setErrorMessage(err.message);
            console.error(`Error while deleting request: ${err}`);
        }
    };

      // Add Interest
      const addInterest = async (interest: Interest) => {
        try {
            const response = await axios.put(`${BASE_API}/user/addPersonalization`, {
                ...interest,
                isDelete: false, // Adding interest
            }, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });

            if (!response.data) throw new Error("Could not add interest");
        } catch (err: any) {
            setErrorMessage(err.message);
            console.error(`Error while adding interest: ${err}`);
        }
    };

    // Remove Interest
    const removeInterest = async (interest: Interest) => {
        try {
            const response = await axios.put(`${BASE_API}/user/addPersonalization`, {
                ...interest,
                isDelete: true, // Deleting interest
            }, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });

            if (!response.data) throw new Error("Could not delete interest");
        } catch (err: any) {
            setErrorMessage(err.message);
            console.error(`Error while deleting interest: ${err}`);
        }
    };

    // Add Hobby
    const addHobby = async (hobby: Hobby) => {
        try {
            const response = await axios.put(`${BASE_API}/user/addPersonalization`, {
                ...hobby,
                isDelete: false, // Adding hobby
            }, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });

            if (!response.data) throw new Error("Could not add hobby");
        } catch (err: any) {
            setErrorMessage(err.message);
            console.error(`Error while adding hobby: ${err}`);
        }
    };

    // Remove Hobby
    const removeHobby = async (hobby: Hobby) => {
        try {
            const response = await axios.put(`${BASE_API}/user/addPersonalization`, {
                ...hobby,
                isDelete: true, // Deleting hobby
            }, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });

            if (!response.data) throw new Error("Could not delete hobby");
        } catch (err: any) {
            setErrorMessage(err.message);
            console.error(`Error while deleting hobby: ${err}`);
        }
    };


    return (
        <div className="bg-gray-900 min-h-screen text-white">
            <UserItemTitle />
            <div className="mt-6">
                <PersonalizationComponent
                    title="Hobbies"
                    items={hobbies}
                    setItems={setHobbies}
                    addItem={addHobby}
                    removeItem={removeHobby}
                    itemKey="hobby"
                />
                <PersonalizationComponent
                    title="Interests"
                    items={interests}
                    setItems={setInterests}
                    addItem={addInterest}
                    removeItem={removeInterest}
                    itemKey="interest"
                />
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Incoming Requests</h2>
                    <div className="flex flex-col gap-2">
                        {
                            incomingRequests.length === 0 ?
                                <div className="text-stone-300 text-lg font-medium">
                                    You have no incoming requests
                                </div> :
                                incomingRequests.map((request) => (
                                    <RequestItem
                                        key={request.id}
                                        request={request}
                                        type="incoming"
                                        onAccept={handleAcceptRequest}
                                        onDelete={handleDeleteRequest}
                                    />
                                ))
                        }
                    </div>
                </div>
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Sent Requests</h2>
                    <div className="flex flex-col gap-2">
                        {
                            sentRequests.length === 0 ?
                                <div className="text-stone-300 text-lg font-medium">
                                    You have not sent any requests
                                </div> :
                                sentRequests.map((request) => (
                                    <RequestItem
                                        key={request.id}
                                        request={request}
                                        type="sent"
                                    />
                                ))
                        }
                    </div>
                </div>
            </div>
            {errorMessage && (
                <div className="mt-4 text-red-500">{errorMessage}</div>
            )}
        </div>
    );
};

interface PersonalizationComponentProps<T> {
    title: string;
    items: T[];
    setItems: React.Dispatch<React.SetStateAction<T[]>>;
    addItem: (item: T) => Promise<void>;
    removeItem: (item: T) => Promise<void>;
    itemKey: keyof T;
}

function PersonalizationComponent<T>({
    title,
    items,
    setItems,
    addItem,
    removeItem,
    itemKey,
}: PersonalizationComponentProps<T>) {
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            const newItem = { [itemKey]: inputValue.trim() } as T;
            setItems((prevItems) => [...prevItems, newItem]);
            setInputValue("");
            await addItem(newItem);
        }
    };

    const handleRemoveItem = async (item: T, index: number) => {
        setItems((prevItems) => prevItems.filter((_, i) => i !== index));
        await removeItem(item);
    };

    return (
        <div className="mt-6 bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                placeholder={`Add new ${title.toLowerCase()}...`}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-4 flex flex-wrap gap-2">
                {items.map((item, index) => (
                    <div key={index} className="bg-gray-700 text-white px-3 py-1 rounded-full flex items-center">
                        <span>{String(item[itemKey])}</span>
                        <button
                            onClick={() => handleRemoveItem(item, index)}
                            className="ml-2 text-gray-400 hover:text-white focus:outline-none"
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Profile;
