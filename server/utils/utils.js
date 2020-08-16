const createMessage = (name, msg) => {
    return {
        name,
        msg,
        date: new Date().getTime()
    }
}

module.exports = {
    createMessage
}