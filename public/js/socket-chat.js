const socket = io();
const queryParams = new URLSearchParams(window.location.search);

if (!queryParams.has('name') || !queryParams.has('room')) {
    window.location = 'index.html';
    throw new Error('Name/room are required');
}

const user = {
    name: queryParams.get('name'),
    room: queryParams.get('room')
};

socket.on('connect', () => {
    console.log('Conectado al servidor');
    socket.emit('joinChat', user, (usersData) => {
        renderUsers(usersData);
    });
});

// escuchar
socket.on('disconnect', () => {
    console.log('Perdimos conexión con el servidor');
});

socket.on('message', (msg) => {
    renderMessage(msg, false);
    scrollBottom();
});

socket.on('personsList', (list) => {
    renderUsers(list);
});

socket.on('privateMessage', (data) => {
    console.log(data);
});