const users = [];

const addUser = ({ id, name, room }) => {
  if(!name || !room) return { error: 'Username and room are required.'};

  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find((user) => user.room === room && user.name === name);


  if(existingUser) return { error: 'Username is taken.' };

  const user = { id, name, room };

  users.push(user);

  return  { user };
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) return { error: "User not found." };

  return users.splice(index, 1)[0];
}

const getUser = (id) => {
  const user = users.find((user) => user.id === id);
  
  if(!user) return { error: 'User not found.' };

  return user;
}
  
const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
