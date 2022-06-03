export const host = process.env.REACT_APP_API_HOST;
// export const host = "http://localhost:5000";

export const registerRoute = `${host}/api/auth/register`;
export const loginRoute = `${host}/api/auth/login`;
export const setAvatarRoute = `${host}/api/auth/setAvatar`;
export const allUsersRoute = `${host}/api/auth/allusers`;
export const allChats = `${host}/api/chat`;
export const addChat = `${host}/api/chat`;
export const searchUsers = `${host}/api/auth`;
export const addGroups = `${host}/api/chat/group`;
export const addUsers = `${host}/api/chat/addgroup`;
export const removeUsers = `${host}/api/chat/removefromgroup`;
export const renameGroups = `${host}/api/chat/editchat`;

// for messages
export const sendMessageRoute = `${host}/api/messages/addmsg`;
export const getAllMessagesRoute = `${host}/api/messages`;

// socket
