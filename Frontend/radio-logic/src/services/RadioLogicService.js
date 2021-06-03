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

    // Get chats associated with the current patient
    async getChats(patientId) {
        return await axios.get('http://localhost:8000/chats/' + patientId);
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

}

export default new RadioLogicService();