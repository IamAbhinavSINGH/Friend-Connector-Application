import express, { Request, Response }  from 'express';
import authMiddleware  from '../authMiddleware'
import zod from 'zod';
import { db } from './db';

export const userRouter = express.Router();

const sendRequestSchema = zod.object({
    "recieverId" : zod.string()
});

const acceptingRequestSchema = zod.object({
    "senderId" : zod.string(),
    "isAccepted" : zod.boolean()
});

const addPersonalization = zod.object({
    "Interest" : zod.string().optional(),
    "Hobby" : zod.string().optional(),
    "isDelete" : zod.boolean()
});

// endpoint to get all the users
userRouter.get('/bulk', authMiddleware, async (req: Request, res: Response) => {
    const filter = req.query.filter as string || "";
    const currentUserId = req.body.userId;

    try {
        // Fetch the current user's following and sent requests
        const currentUser = await db.user.findUnique({
            where: { id: currentUserId },
            include: {
                following: true,    // Users the current user is following (Already Friends)
                sentRequests: true  // Users the current user has sent requests to (Requested)
            }
        });

        // Check if the current user exists
        if (!currentUser) {
            return res.status(404).json({ message: "Current user not found" });
        }

        // Get all users filtered by name or email
        const users = await db.user.findMany({
            where: {
                OR: [
                    {
                        email: {
                            contains: filter,
                            mode: 'insensitive'
                        }
                    },
                    {
                        name: {
                            contains: filter,
                            mode: 'insensitive'
                        }
                    }
                ],
                id: { not: currentUserId }  // Exclude the current user from the results
            },
            select: {
                name: true,
                id: true
            }
        });

        // If no users are found, return a message
        if (users.length === 0) {
            return res.status(200).json({ message: "No users found" });
        }
        
        // Convert users into Friend interface format with the correct status
        const friends = users.map((user) => {
            let status: 'Send request' | 'Requested' | 'Already Friend' = 'Send request';

            if (currentUser.following.some(f => f.userId === user.id)) {
                status = 'Already Friend';
            } else if (currentUser.sentRequests.some(r => r.receiverId === user.id)) {
                status = 'Requested';
            }

            return {
                id: user.id,
                name: user.name,
                status
            };
        });

        // Return the users with their friend statuses
        res.status(200).json({
             users: friends 
        });
        
    } catch (err) {
        console.log(`Error while fetching users: ${err}`);
        res.status(500).json({ message: "Unknown error" });
    }
});


// endpoint to get mutual users
userRouter.get('/mutual', authMiddleware, async (req: Request, res: Response) => {
    const { userId } = req.body; // Get the current user's ID from request body
    try {

        const currentUser = await db.user.findFirst({
            where : {
                id : userId
            },
            include : {
                sentRequests : true,
                following : true
            }
        })

        if(!currentUser){
            res.status(411).json({
                message : "User does not exist"
            });
            return;
        }

        // Fetch the friends of the current user
        const userFriends = await db.friendship.findMany({
            where: {
                friendId: userId
            },
            select: {
                userId: true // Get only the friend's IDs
            }
        });

        // Extract friend IDs of the current user
        const friendIds = userFriends.map(f => f.userId);

        if (friendIds.length === 0) {
            return res.status(200).json({ message: "No friends found" });
        }

        // Fetch friends of each friend (excluding the current user and their direct friends)
        const friendsOfFriends = await db.friendship.findMany({
            where: {
                friendId: {
                    in: friendIds // Friends of the current user
                },
                NOT: {
                    userId: {
                        in: [userId, ...friendIds] // Exclude the current user and the direct friends
                    }
                }
            },
            select: {
                userId: true // The ID of the friend's friend
            }
        });

        // Remove duplicates
        const uniqueFriendIds = Array.from(new Set(friendsOfFriends.map(f => f.userId)));

        if (uniqueFriendIds.length === 0) {
            return res.status(200).json({ message: "No mutual friends found" });
        }

        // Fetch user details for the unique friend IDs
        const mutualFriends = await db.user.findMany({
            where: {
                id: {
                    in: uniqueFriendIds
                }
            },
            select: {
                id: true,
                name: true // Include the name of the user
            }
        });

        const friends = mutualFriends.map((user) => {
            let status: 'Send request' | 'Requested' | 'Already Friend' = 'Send request';

            if (currentUser.following.some(f => f.userId === user.id)) {
                status = 'Already Friend';
            } else if (currentUser.sentRequests.some(r => r.receiverId === user.id)) {
                status = 'Requested';
            }

            return {
                id: user.id,
                name: user.name,
                status : status
            };
        });

        return res.status(200).json({
            mutualFriends: friends
        });

    } catch (err) {
        console.log(`Error while fetching mutual friends: ${err}`);
        res.status(500).json({
            message: "Unknown error"
        });
    }
});

// endpoint to get users who have same hobbies or interests
userRouter.get('/suggestions', authMiddleware, async (req: Request, res: Response) => {
    const userId = req.body.userId;

    try {
        // Fetch user's hobbies and interests
        const user = await db.user.findFirst({
            where: { id: userId },
            include: { hobbies: true, interests: true , sentRequests : true , following : true}
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const followingIds = user.following.map(f => f.userId);

        // Fetch users with the same hobbies or interests but not already followers
        const suggestedFriends = await db.user.findMany({
            where: {
                id: { notIn: followingIds, not: userId },  // Exclude current user and their followers
                OR: [
                    {
                        hobbies: {
                            some: { hobby: { in: user.hobbies.map(h => h.hobby) } }
                        }
                    },
                    {
                        interests: {
                            some: { interest: { in: user.interests.map(i => i.interest) } }
                        }
                    }
                ]
            },
        });
        
        const suggestions = suggestedFriends.map((friend) => {
            let status: 'Send request' | 'Requested' | 'Already Friend' = 'Send request';

            if (user.following.some(f => f.userId === friend.id)) {
                status = 'Already Friend';
            } else if (user.sentRequests.some(r => r.receiverId === friend.id)) {
                status = 'Requested';
            }

            return {
                id: friend.id,
                name: friend.name,
                status : status
            };
        });

        res.status(200).json({
            suggestion : suggestions
        });
        
    } catch (error) {
        console.log(`Error fetching suggestions: ${error}`);
        res.status(500).json({ message: "An error occurred while fetching suggestions" });
    }
});


/*
    When a user sends a request to a person , two things happen :- 
        1st : His sentRequests[] increases by the current request
        2nd : The reciever's recievedRequest[] increases by the current request

    When a user accepts a request sent my someone , two things happen :-
        1st : His followers[] goes up by one & recievedRequest[] array decreases by one
        2nd : The someone who sent the request, his following[] increases by one & sentRequests[] decreases by one

*/

// endpoint to send request
userRouter.post('/sendRequest' , authMiddleware , async(req : Request , res : Response) => {
    const body = req.body;
    try{
        const reqSchema = sendRequestSchema.safeParse(body);
        if(!reqSchema){
            res.status(411).json({
                message : "Invalid inputs"
            });
            return;
        }
        
        const recieverUserId = body.recieverId;
        const senderUserId = body.userId;

        if(senderUserId == null){
            res.status(411).json({
                message : "Not Authorized, cannot find userId"
            });
            return;
        }
        
        const sender = await db.user.findFirst({
            where : {
                id : senderUserId
            }
        });

        const reciever = await db.user.findFirst({
            where : {
                id : recieverUserId
            }
        });

        if(sender == null || reciever == null){
            res.status(411).json({
                message : "couldn't find the user"
            });
            return;
        }

         // Check if a request already exists between the users
        const existingRequest = await db.request.findFirst({
            where: {
                senderId: senderUserId,
                receiverId: recieverUserId
            }
        });
    
        if (existingRequest) {
            return res.status(409).json({
            message: "Request already exists"
            });
        }

        const friendship = await db.friendship.findFirst({
            where : {
                friendId : senderUserId,
                userId : recieverUserId
            }
        });

        if(friendship){
            res.status(411).json({
                message : "You are already a friend!"
            });
            return;
        }

         // Create the new friend request
        const request = await db.request.create({
            data: {
                senderId: senderUserId,
                receiverId: recieverUserId,
                status: 'Pending'
            }
        });
        
        return res.status(200).json({
            message: "Friend request sent successfully",
            request : request
        });

    }catch(err){
        console.log(`error while sending request ${err}`);
        res.status(411).json({
            message : "An error occured while sending request"
        });
    }
});

// endpoint to handle request
userRouter.post('/handleRequest' , authMiddleware , async(req : Request , res : Response) => {
    const body = req.body;
    try{
        const schemaResult = acceptingRequestSchema.safeParse(body);
        if(!schemaResult){
            res.status(411).json({
                message : "couldn't find sender ID"
            });
            return;
        }

        const senderUserId = body.senderId;  // The sender who sent the request
        const receiverUserId = body.userId;  // The current user (receiver of the request)
        const isAccepted = body.isAccepted;  // Boolean indicating if the request was accepted

        const reciever = await db.user.findFirst({ where : { id : receiverUserId } });
        const sender = await db.user.findFirst({ where : { id : senderUserId } });

        if(!sender || !reciever){
            res.status(411).json({
                message : "Sender or Reciever don't exist"
            });
            return;
        }

        const request = await db.request.findFirst( { 
            where : { 
                sender : sender ,
                receiver : reciever ,
                status : 'Pending' 
            } 
        });

        if(!request){
            res.status(411).json({
                message : "Friend Request not found"
            });
            return;
        }

        if(isAccepted){
            // delete the request after accepting
            await db.request.delete({
                where: { id: request.id }
            });

             // Create a friendship for both users
             await db.friendship.createMany({
                data: [
                    {
                        userId: receiverUserId,    // Sender becomes a friend of the receiver and his following increases by one
                        friendId: senderUserId
                    }
                ]
            });
            
            return res.status(200).json({
                message: "Friend request accepted"
            });

        }else{
            // If request is rejected, simply delete the request
            await db.request.delete({
                where: { id: request.id }
            });

            return res.status(200).json({
                message: "Friend request rejected"
            });
        }

    }catch(err){
        console.log(`error while accepting request ${err}`);
        res.status(411).json({
            message : "An error occurred while processing the friend request"
        });
    }
});


userRouter.get('/getRequest', authMiddleware, async (req: Request, res: Response) => {
    const body = req.body;

    try {
        const userId = body.userId;
        // Find the user by their ID and include sent and received requests
        const user = await db.user.findUnique({
            where: { id: userId },
            include: {
                sentRequests: { select: { receiverId: true } },
                recievedRequests: { select: { senderId: true } }
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch users who sent requests to the authenticated user
        const sentRequestsUsers = await db.user.findMany({
            where: {
                id: { in: user.sentRequests.map(request => request.receiverId) }
            },
            select: {
                id: true,
                name: true
            }
        });

        // Fetch users who received requests from the authenticated user
        const receivedRequestsUsers = await db.user.findMany({
            where: {
                id: { in: user.recievedRequests.map(request => request.senderId) }
            },
            select: {
                id: true,
                name: true
            }
        });

        res.status(200).json({
            sentRequests: sentRequestsUsers,
            receivedRequests: receivedRequestsUsers
        });

    } catch (err) {
        console.error(`Error while fetching requests: ${err}`);
        res.status(500).json({ message: "An error occurred while fetching requests" });
    }
});


// endpoint to get all the friends
userRouter.get('/me' , authMiddleware , async(req : Request , res : Response) => {
    const body = req.body;
    try{
        const userId = body.userId;
        const user = await db.user.findFirst({
            where : { 
                id : userId 
            } ,
            select : {
                id : true,
                name : true,
                email : true
            }
        });

        if(!user){
            res.status(411).json({
                message : "Couldn't find the user"
            });
            return;
        }

         // Fetch IDs of users following the current user (followers)
        const followingIds = await db.friendship.findMany({
            where: { friendId: userId },
            select: { userId: true }  // Get only userId of the followers
        });

        // Fetch details of followers
        const following = await db.user.findMany({
            where: { id: { in: followingIds.map(f => f.userId) } },
            select: { id: true, name: true }  // Fetch name and id of followers
        });

        // Fetch IDs of users whom the current user is following (following)
        const followersIds = await db.friendship.findMany({
            where: { userId: userId },
            select: { friendId: true }  // Get only friendId of the users being followed
        });

        // Fetch details of following users
        const followers = await db.user.findMany({
            where: { id: { in: followersIds.map(f => f.friendId) } },
            select: { id: true, name: true }  // Fetch name and id of following users
        });


        res.status(200).json({
            user : user,
            followers : followers,
            following : following
        });
        
    }catch(err){
        console.log(`error while getting friends ${err}`);
        res.status(411).json({
            message : "An error occured while getting friends"
        });
    }
});

// endpoint to add intersts or hobby
userRouter.put('/addPersonalization' , authMiddleware , async(req : Request , res : Response) => {
    const body = req.body;
    try{
        const userId = body.userId;
        const schemaResult = addPersonalization.safeParse(body);
        if(!schemaResult){
            console.log("schema failed");
            res.status(411).json({
                message : "Invalid inputs"
            });
            return;
        }

        const user = await db.user.findFirst({ where : { id : userId } });
        const isDelete = body.isDelete;
        const hobby = body.hobby;
        const interst = body.interest;

        if(hobby == null && interst == null){
            res.status(411).json({
                message : "Invalid inputs"
            });
            return;
        }

        if(!user){
            res.status(411).json({
                message : "Couldn't find user"
            });
            return;
        }

        if(hobby){
            if(isDelete){
                const deleteHobby = await db.hobby.findFirst({ where : { hobby : hobby } });
                if(deleteHobby == null){
                    res.status(411).json({
                        message : "No such interest exist"
                    });
                    return;
                }
                await db.hobby.delete({ where : { id : deleteHobby.id } });
            }else{
                await db.hobby.create({ 
                    data : { 
                        hobby : hobby,
                        userId : userId
                    } 
                });
            }
        }

        if(interst){
            if(isDelete){
                const deleteInterest = await db.interest.findFirst({ where : { interest : interst } });
                if(deleteInterest == null){
                    res.status(411).json({
                        message : "No such interest exist"
                    });
                    return;
                }
                await db.interest.delete({ where : { id : deleteInterest.id } });
            }
            else{
                await db.interest.create({ 
                    data : { 
                        interest : interst,
                        userId : userId
                    } 
                });
            }
        }

        res.status(200).json({
            message : "Personalization added successfully"
        });

    }catch(err){
        console.log(`error while adding personalization ${err}`);
        res.status(411).json({
            message : "An error occured while adding personalization"
        });
    }
});

// endpoint to get personalization(Intersts & Hobby)
userRouter.get('/personalization' , authMiddleware , async(req : Request , res : Response)=> {
    const body = req.body;
    try{
        const userId = body.userId;

        const interests = await db.interest.findMany({ 
            where : {
                 userId : userId 
            },
            select : {
                interest : true
            } 
        });

        const hobbies = await db.hobby.findMany({ 
            where : { 
                userId : userId 
            } ,
            select : {
                hobby : true
            }
        });

        if(!interests || !hobbies){
            res.status(411).json({
                message : "Couldn't find interests or hobbies"
            });
            return;
        }

        res.status(200).json({
            interests : interests,
            hobbies : hobbies
        });
    }catch(err){
        console.log(`error while getting personalization ${err}`);
        res.status(411).json({
            message : "An error occured while fetching personalization"
        });
    }
});