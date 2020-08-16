class Users {
    constructor() {
        this.persons = [];
    }

    addPerson(id, name, room) {
        const person = { id, name, room };
        this.persons.push(person);
        return this.persons;
    }

    getPerson(id) {
        return this.persons.filter(person => person.id === id)[0];
    }

    getPersons() {
        return this.persons;
    }

    getPersonByRoom(room) {
        return this.persons.filter(person => person.room === room);
    }

    deletePerson(id) {
        const deletedPerson = this.getPerson(id);
        this.persons = this.persons.filter(person => person.id !== id);
        return deletedPerson;
    }
}

module.exports = {
    Users
}