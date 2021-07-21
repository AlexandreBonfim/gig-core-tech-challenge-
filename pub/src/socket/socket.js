const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { addUser, removeUser, getUsersInRoom } = require('../user/users');

const socket = io.on("connect", (socket) => {
    socket.on("join", ({ name, room }, callback) => {
        const { error, user } = addUser({
            id: socket.id,
            name,
            room,
        });

        if (error) return callback(error);

        socket.join(user.room);

        socket.emit("message", {
            user: "admin",
            text: `${user.name}, welcome to room ${user.room}.`,
        });

        socket.broadcast
        .to(user.room)
        .emit("message", { user: "admin", text: `${user.name} has joined!` });

        io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUsersInRoom(user.room),
        });

        return callback();
    });

    socket.on("disconnect", () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit("message", {
                user: "Admin",
                text: `${user.name} has left.`,
            });
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: getUsersInRoom(user.room),
            });
        }
    });
});

export default { socket };

server.listen(1923);