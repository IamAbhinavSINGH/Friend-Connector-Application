# **FriendConnect**

FriendConnect is a personalized social platform that allows users to discover mutual friends and find new friends based on hobbies and interests. With dynamic personalization features and easy friend suggestions, this application offers a seamless user experience for making connections.

## **What does this application do?**

FriendConnect is designed to enhance your social networking experience by making friend discovery simple and intuitive. Users can view mutual friends, explore suggestions based on shared interests and hobbies, and manage their personal preferences. This app is perfect for those looking to build meaningful connections with people who share similar passions or backgrounds.

### **Key Features**

- **Mutual Friends:** View friends you have in common with other users.
- **Friend Suggestions:** Get personalized friend suggestions based on your hobbies and interests.
- **Dynamic Friend Requests:** Send or remove friend requests with ease.
- **Personalization:** Add and remove hobbies and interests to receive tailored friend suggestions.
- **User-friendly Interface:** Clean and simple design for easy navigation.

## **Installation Steps**

To run the project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/iamAbhinavSINGH/Friend-Connector-Application.git
   
   cd friendconnect

2. **Backend Setup:**

    Navigate to the backend directory and install dependencies:

    ```bash
    cd server
    npm install

- Set up environment variables by creating a .env file in the root of the server directory. Add necessary API keys and database configurations (MongoDB, JWT secret, etc.).

- Start the backend server:

    ```bash
    npm start


3. **Frontend Setup:**

    Navigate to the frontend directory and install dependencies:

    ```bash
    cd client
    npm install

- Set up your environment variables in a .env file for the frontend (if required).
Start the frontend development server:

    ```bash
    npm start

4. **Access the Application:**

- Open your browser and navigate to http:/ localhost:3000 to start using the app.

## Tech Stack
- Frontend:
    - React: A JavaScript library for building user interfaces.
    - TypeScript: For static type checking.
    - Tailwind CSS: Utility-first CSS framework for styling.
    - Axios: For making HTTP requests to the backend.

- Backend:

    - Node.js: JavaScript runtime environment for executing server-side code.
    - Express.js: Fast and minimal web framework for Node.js.
    - MongoDB: NoSQL database for storing user data and connections.
    - JWT (JSON Web Token): For user authentication and session management.
    - bcrypt.js: For password hashing and security.

- Deployment:

    - Deployed on cloud platforms like AWS for the backend and Vercel for the frontend.

## API Documentation

The API endpoints used in the application are as follows:

- GET /user/personalization
Fetches the user's interests and hobbies.

- GET /user/mutual
Retrieves a list of mutual friends.

- GET /user/suggestions
Fetches friend suggestions based on hobbies and interests.

- POST /friend/request
Send a friend request.

- POST /friend/handleRequest
    Accept or Delete a friend request

## Contribution

  We welcome contributions to enhance the functionality and features of this project. To contribute:

- Fork the repository.
- Create a new branch for your feature or bug fix.
- Submit a pull request with a detailed description of the changes.

## Contact

 For any inquiries or questions about this project, feel free to reach out to the repository owner at iamabhii205@gmail.com
