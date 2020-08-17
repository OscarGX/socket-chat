const query = new URLSearchParams(window.location.search);
const usersDiv = $('#divUsuarios');
const boxTitle = $('.box-title > small');
const msgForm = document.querySelector('#msgForm');
const txtMsg = document.querySelector('#msg');
const chatBox = $('#divChatBox');

boxTitle.text(query.get('room'));
const renderUsers = (users) => {
    let usersList = '';
    usersList += `
        <li>
            <a href="javascript:void(0)" class="active"> Chat de <span> ${query.get('room')} </span></a>
        </li>
    `;
    users.forEach(user => {
        usersList += `
            <li>
                <a data-id="${user.id}" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span> ${user.name} <small class="text-success">online</small></span></a>
            </li>
        `;
    });
    usersList += '<li class="p-20"></li>';
    usersDiv.html(usersList);
}

const renderMessage = (msgObject, im) => {
    const li = document.createElement('li');
    if (im) {
        li.className = 'reverse';
        li.innerHTML = createMessageElement(msgObject, im);
    } else {
        li.innerHTML = createMessageElement(msgObject, im);
    }
    chatBox.append(li);
}

const createMessageElement = (msgObject, isReverse) => {
    let inv;
    let liChild = '';
    const hour = new Date(msgObject.date);
    if (msgObject.name === 'Admin') {
        inv = 'bg-light-danger';
        liChild += `
            <div class="chat-img"><img src="assets/images/users/${msgObject.name === 'Admin' ? '2' : '1'}.jpg" alt="user" /></div>
            <div class="chat-content">
                <h5>${msgObject.name}</h5>
                <div class="box ${inv}">${msgObject.msg}</div>
            </div>
        `;
    } else if (isReverse) {
        inv = 'bg-light-inverse';
        liChild += `
            <div class="chat-content">
                <h5>${msgObject.name}</h5>
                <div class="box ${inv}">${msgObject.msg}</div>
            </div>
            <div class="chat-img"><img src="assets/images/users/${msgObject.name === 'Admin' ? '2' : '1'}.jpg" alt="user" /></div>
        `;
    } else {
        inv = 'bg-light-info'
        liChild += `
            <div class="chat-img"><img src="assets/images/users/${msgObject.name === 'Admin' ? '2' : '1'}.jpg" alt="user" /></div>
            <div class="chat-content">
                <h5>${msgObject.name}</h5>
                <div class="box ${inv}">${msgObject.msg}</div>
            </div>
        `;
    }
    liChild += `
        <div class="chat-time">${hour.toLocaleTimeString('en-US', {timeStyle: 'short'})}</div>
    `;
    return liChild;
}

function scrollBottom() {

    // selectors
    const newMessage = chatBox.children('li:last-child');

    // heights
    const clientHeight = chatBox.prop('clientHeight');
    const scrollTop = chatBox.prop('scrollTop');
    const scrollHeight = chatBox.prop('scrollHeight');
    const newMessageHeight = newMessage.innerHeight();
    const lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        chatBox.scrollTop(scrollHeight);
    }
}

usersDiv.on('click', 'a', function() {
    const id = $(this).data('id');
    if (id) {
        console.log(id);
    }
});

msgForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = txtMsg.value;
    if (msg.trim().length === 0) {
        return;
    }
    socket.emit('message', { msg }, resp => {
        renderMessage(resp, true);
        scrollBottom();
        msgForm.reset();
    });
});