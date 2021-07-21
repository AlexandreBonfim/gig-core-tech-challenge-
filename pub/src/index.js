const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
        cors: {
        origin: ['http://localhost:3000'],
        },
    })
const { addUser, removeUser, getUser, getUsersInRoom } = require('./repositories/userRepository');
const rabbitMQ = require('./queue/rabbitMQ');

const PORT = process.env.PORT || 5000;

module.exports = {
    socket : any = io.on('connect', (socket) => {
        socket.on('join', ({ name, room }, callback) => {
            const { error, user } = addUser({
                id: socket.id,
                name,
                room,
            });
    
            if (error) return callback(error);
    
            socket.join(user.room);
    
            socket.emit('message', {
                user: 'admin',
                text: `${user.name}, welcome to room ${user.room}.`,
            });
            
            socket.broadcast
            .to(user.room)
            .emit('message', { user: 'admin', text: `${user.name} has joined!` });
    
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room),
            });
    
            return callback();
        });
    
        socket.on('sendMessage', (message, callback) => {
            const user = getUser(socket.id);
            console.log('test', user);
            //io.to(user.room).emit('message', { user: user.name, text: message });

            // send to queue
            rabbitMQ('challenge-gig', JSON.stringify({ user: user.name, room: user.room, text: message }));

            callback();
        });

        socket.on('disconnect', () => {
            const user = removeUser(socket.id);
    
            if (user) {
                io.to(user.room).emit('message', {
                    user: 'Admin',
                    text: `${user.name} has left.`,
                });
                io.to(user.room).emit('roomData', {
                    room: user.room,
                    users: getUsersInRoom(user.room),
                });
            }
        });
    })
};

try {
    server.listen(PORT, () => {
        console.log(`Connected successfully on port ${PORT}`);
    });
    } catch (error) {
    console.error(`Error: ${error.message}`);
}
  