const userRepository = require('../../repositories/userRepository');


const users = [
  {id: 1, name: 'karl', room: 'python'}, // should pass 
  {id: 2, name: 'karl', room: 'python'}, // should break
  {id: 3, name: 'Paul', room: ''}, // should break
  {id: 4, name: '', room: 'nodejs'}, // should break
];

describe('Add user', () => {
  test('should return user', () => {
    const addUserMock = jest.spyOn(userRepository, 'addUser');
    const result = addUserMock(users[0]);

    expect(result).toMatchObject({user: {id: 1, name: 'karl', room: 'python'}});
    expect(addUserMock).toHaveBeenCalledTimes(1);
    expect(addUserMock).toHaveBeenCalledWith(users[0]);

    addUserMock.mockRestore();
  });

  test('there is no room', () => {
    const addUserMock = jest.spyOn(userRepository, 'addUser');
    const result = addUserMock(users[2]);

    expect(result).toMatchObject({ error: 'Username and room are required.'});
    expect(addUserMock).toHaveBeenCalledTimes(1);
    expect(addUserMock).toHaveBeenCalledWith(users[2]);

    addUserMock.mockRestore();
  });

  test('there is no name', () => {
    const addUserMock = jest.spyOn(userRepository, 'addUser');
    const result = addUserMock(users[3]);

    expect(result).toMatchObject({ error: 'Username and room are required.'});
    expect(addUserMock).toHaveBeenCalledTimes(1);
    expect(addUserMock).toHaveBeenCalledWith(users[3]);

    addUserMock.mockRestore();
  });

  test('there is an existing user', () => {
    const addUserMock = jest.spyOn(userRepository, 'addUser');
    const result = addUserMock(users[1]);

    expect(result).toMatchObject({ error: 'Username is taken.'});
    expect(addUserMock).toHaveBeenCalledTimes(1);
    expect(addUserMock).toHaveBeenCalledWith(users[1]);

    addUserMock.mockRestore();
  });
});


describe('Remove user', () => {
  test('there is no user', () => {
    const removeUserMock = jest.spyOn(userRepository, 'removeUser');
    const result = removeUserMock(users[1].id);

    expect(result).toMatchObject({ error: 'User not found.'});
    expect(removeUserMock).toHaveBeenCalledTimes(1);
    expect(removeUserMock).toHaveBeenCalledWith(users[1].id);

    removeUserMock.mockRestore();
  });

  test('there is an existing user', () => {
    // Added user
    const addUserMock = jest.spyOn(userRepository, 'addUser');
    addUserMock(users[0]);
    
    const removeUserMock = jest.spyOn(userRepository, 'removeUser');
    const result = removeUserMock(users[0].id);

   expect(result).toMatchObject({id: 1, name: 'karl', room: 'python'});
   expect(addUserMock).toHaveBeenCalledTimes(1);
   expect(removeUserMock).toHaveBeenCalledTimes(1);
   expect(addUserMock).toHaveBeenCalledWith(users[0]);
   expect(removeUserMock).toHaveBeenCalledWith(users[0].id);

   removeUserMock.mockRestore();
   addUserMock.mockRestore();
  });
});

describe('Get user', () => {
  test('there is no user', () => {
    const getUserMock = jest.spyOn(userRepository, 'getUser');
    const result = getUserMock(users[0].id);

    expect(result).toMatchObject({ error: 'User not found.'});
    expect(getUserMock).toHaveBeenCalledTimes(1);
    expect(getUserMock).toHaveBeenCalledWith(users[0].id);

    getUserMock.mockRestore();
  });

  test('there is an existing user', () => {
    // Added user
    const addUserMock = jest.spyOn(userRepository, 'addUser');
    addUserMock(users[0]);
    
    const getUserMock = jest.spyOn(userRepository, 'getUser');
    const result = getUserMock(users[0].id);

   expect(result).toMatchObject(users[0]);
   expect(addUserMock).toHaveBeenCalledTimes(1);
   expect(addUserMock).toHaveBeenCalledWith(users[0]);  
   expect(getUserMock).toHaveBeenCalledTimes(1);
   expect(getUserMock).toHaveBeenCalledWith(users[0].id); 

   addUserMock.mockRestore();
   getUserMock.mockRestore();
  });
});

describe('Get users in room', () => {
  test('there is no user', () => {
    // Added user
    const addUserMock = jest.spyOn(userRepository, 'addUser');
    addUserMock(users[0]);

    const getUsersInRoomMock = jest.spyOn(userRepository, 'getUsersInRoom');
    const result = getUsersInRoomMock(users[0].room);

    expect(result).toHaveLength(1);
    expect(result).toMatchObject([users[0]]);
    expect(getUsersInRoomMock).toHaveBeenCalledTimes(1);
    expect(getUsersInRoomMock).toHaveBeenCalledWith(users[0].room); 
    expect(addUserMock).toHaveBeenCalledTimes(1);
    expect(addUserMock).toHaveBeenCalledWith(users[0]);  

    getUsersInRoomMock.mockRestore();
    addUserMock.mockRestore();
  });
});

