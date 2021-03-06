import axios from 'axios';

// A class that is used in the React app to communicate with the REST API
class RadioLogicService {

    // Returns all users from the database
    async getUsers() {
        return await axios.get('http://localhost:8000/users');
    }

    // Returns a user by their unique userId
    async getUser(userId) {
        return await axios.get('http://localhost:8000/user/' + userId);
    }

    // Used to add a new user to the database
    async AddUser(data) {
        return await axios.post('http://localhost:8000/user', data);
    }

    // Get patients associated with current logged in user
    async getPatients(userId) {
        return await axios.get('http://localhost:8000/patients/' + userId);
    }

    // Get images associated with the current patient
    async getImages(patientId) {
        return await axios.get('http://localhost:8000/images/' + patientId);
    }

    // Send data needed to add a new image to the database
    async addImage(data) {
        return await axios.post('http://localhost:8000/image', data);
    }

    // Send data needed to add a new image by existing address to the database
    async addImageAddress(data) {
        return await axios.post('http://localhost:8000/imageAddress', data);
    }

    // Send data needed to update an image in the database
    async updateImage(data) {
        return await axios.put('http://localhost:8000/image', data);
    }

    // Send data needed to update a chat image in the database
    async updateChatImage(data) {
        return await axios.put('http://localhost:8000/chatImage', data);
    }

    // Send data needed to add a new message to the database
    async addMessage(data) {
        return await axios.post('http://localhost:8000/message', data);
    }

    // Send data needed to add a new contact to the database
    async addContact(data) {
        return await axios.post('http://localhost:8000/contact', data);
    }

    // Get chats associated with the current patient
    async getChats(patientId) {
        return await axios.get('http://localhost:8000/chats/' + patientId);
    }

    // Get general chats associated with the current user
    async getGeneralChats(userId) {
        return await axios.get('http://localhost:8000/generalchats/' + userId);
    }

    // Get messages associated with the current chat
    async getMessages(chatId) {
        return await axios.get('http://localhost:8000/messages/' + chatId);
    }    

    // Get chat associated with the current chatId
    async getChatById(chatId) {
        return await axios.get('http://localhost:8000/chat/' + chatId);
    }   

    // Get image associated with the current imageId
    async getImage(imageId) {
        return await axios.get('http://localhost:8000/image/' + imageId);
    }

    // Get info needed for message page by chatId
    async getMessageInfo(chatId) {
        return await axios.get('http://localhost:8000/messageinfo/' + chatId);
    }  

    // Get info needed for general message page by chatId
    async getGeneralMessageInfo(chatId) {
        return await axios.get('http://localhost:8000/generalmessageinfo/' + chatId);
    }  

    // Get all contacts for the current user
    async getContacts(userId) {
        return await axios.get('http://localhost:8000/contacts/' + userId);
    }

    // Adds a new chat and returns the chatId
    async addChat(data) {
        return (await axios.post('http://localhost:8000/chat/', data)).data.insertId;
    }

    // Adds a new patient to the database
    async addPatient(data) {
        return await axios.post('http://localhost:8000/patient', data);
    }

    // Deletes a patient from the database
    async deletePatient(patientId) {
        return await axios.delete('http://localhost:8000/patient/' + patientId);
    }

    // Deletes an image from the database
    async deleteImage(imageId) {
        return await axios.delete('http://localhost:8000/image/' + imageId);
    }

}

export default new RadioLogicService();