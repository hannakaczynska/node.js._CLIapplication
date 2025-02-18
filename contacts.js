const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function listContacts() {
    try {
        const data = await fs.readFile(contactsPath, 'utf8');
        const contacts = JSON.parse(data);
        return contacts;
    } catch (err) {
        console.log(err.message);
    }
}

async function getContactById(contactId) {
    try {
        const contacts = await listContacts();
        const contact = contacts.find(contact => contact.id === contactId.toString());
        return contact;
    } catch (err) {
        console.log(err.message);
    }
}

async function removeContact(contactId) {
    try {
        const contacts = await listContacts();
        if (contacts) {
            const contactExists = contacts.some(contact => contact.id === contactId.toString());
            if (!contactExists) {
                console.log(`Contact with id ${contactId} not found.`);
                return;
            }
            const updatedContacts = contacts.filter(contact => contact.id !== contactId.toString());
            await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
            return updatedContacts;
        } else {
            console.log("No contacts found.");
        }
    } catch (err) {
        console.log(err.message);
    }
}

async function addContact(name, email, phone) {
    try {
        const contacts = await listContacts();
        const lastId = contacts.length > 0 ? Math.max(...contacts.map(contact => parseInt(contact.id))) : 0;
        const newId = (lastId + 1).toString();
        const newContact = { id: newId, name, email, phone };
        contacts.push(newContact);
        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
        return newContact;
    } catch (err) {
        console.log(err.message);
    }
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
};
