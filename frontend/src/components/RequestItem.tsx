import React from "react";

interface Request {
    id: string;
    name: string;
}

interface RequestItemProps {
    request: Request;
    type: "incoming" | "sent";
    onAccept?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const RequestItem: React.FC<RequestItemProps> = ({ request, type, onAccept, onDelete }) => {
    return (
        <div className="bg-gray-800 text-white px-3 py-2 rounded-md flex items-center justify-between">
            <span>
                {request.name}
            </span>
            {type === "incoming" ? (
                <div className="flex gap-2 ">
                    <button
                        onClick={() => onAccept && onAccept(request.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                    >
                        Accept
                    </button>
                    <button
                        onClick={() => onDelete && onDelete(request.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                    >
                        Delete
                    </button>
                </div>
            ) : (
                <span className="text-gray-200 text-lg font-medium mx-4">Requested</span>
            )}
        </div>
    );
};

export default RequestItem;
