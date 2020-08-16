const { io } = require('../server');
const { Users } = require('../classes/usuarios');
const { createMessage } = require('../utils/utils');

const users = new Users();
io.on('connection', (client) => {
    client.on('joinChat', (user, callback) => {
        if (!user.name || !user.room) {
            return callback({
                ok: false,
                err: {
                    msg: 'Username/room required'
                }
            });
        }
        client.join(user.room);
        users.addPerson(client.id, user.name, user.room)
        callback(users.getPersonByRoom(user.room));
        client.broadcast.to(user.room).emit('personsList', users.getPersonByRoom(user.room));
    });

    client.on('message', (msg) => {
        const user = users.getPerson(client.id);
        client.broadcast.to(user.room).emit('message', createMessage(user.name, msg.msg));
    });

    client.on('disconnect', () => {
        const deletedPerson = users.deletePerson(client.id);
        client.broadcast.to(deletedPerson.room).emit('message', createMessage('Admin', `${deletedPerson.name} left the chat`));
        client.broadcast.to(deletedPerson.room).emit('personsList', users.getPersonByRoom(deletedPerson.room));
    });

    client.on('privateMessage', (data) => {
        const user = users.getPerson(client.id);
        client.broadcast.to(data.to).emit('privateMessage', createMessage(user.name, data.msg));
    });
});