const connection = require('./db.js');
const Helper = require('../helpers/Helper.js');

const Image = (image) => {
    this.chatId = image.patientId;
    this.senderId = image.name;
    this.receiverId = image.description;
    this.imageData = image.imageData;
    this.dateAdded = image.dateAdded;
}

Image.getAllImagesByPatientId = (patientId, result) => {
    try {
        connection.query('select * from image where patientId = ?', [patientId], (error, results, fields) => {
            if (error) {
                console.log("Error: " + error.message);
                result(null, err);
                return;
            }
            result(null, results);
        });

    } catch (err) {
        console.log("Error: " + err.message);
        result(null, err);
        return;
    }
}

Image.addImage = (image, result) => {
    try {

        const imageData = image.imageData;

        image.dateAdded = Helper.getCurrentDateTime();

        let filepath = base64Img.imgSync(imageData, '../../server/images', Date.now());
        const arr = filepath.split('\\');

        image.imageData = 'http://localhost:8000/' + arr[arr.length - 1];

        connection.query('insert into image (patientId, name, description, imageData, dateAdded) values (?, ?, ?, ?, ?)', [image.patientId, image.name, image.description, image.imageData, image.dateAdded], (error, results, fields) => {
            if (error) {
                console.log("Error: " + error.message);
                result(null, err);
                return;
            }
            result(null, results);
        });

    } catch (err) {
        console.log("Error: " + err.message);
        result(null, err);
        return;
    }
}

Image.addImageByAddress = (image, result) => {
    
    try {

        image.dateAdded = getCurrentDateTime();
    
        connection.query('insert into image (patientId, name, description, imageData, dateAdded) values (?, ?, ?, ?, ?)', [image.patientId, image.name, image.description, image.imageData, image.dateAdded], (error, results, fields) => {
            if (error) {
                console.log("Error: " + error.message);
                result(null, err);
                return;
            }
            result(null, results);
        });
    
    } catch (err) {
        console.log("Error: " + err.message);
        result(null, err);
        return;
    }

}

Image.deleteImage = (imageId, result) => {
    
    let imageToDelete = null;

    try {
        connection.query('select * from image where imageId = ?', [imageId], (error, results, fields) => {
            if (error) throw error;
            imageToDelete = results.data[0];
        });

    } catch (err) {console.log("Couldn't get image to unlink from server/images")}

    if (imageToDelete != null) {
        // Now we must delete image from server/images
        let arr = imageToDelete.imageFileName.split("/");
        let fileName = arr[arr.length - 1];
        const path = '../../server/images/' + fileName;

        // Try to remove it
        try {
            fs.unlinkSync(path);
        } catch (err) {
            console.error(err);
        }
    }

    try {
        connection.query('delete from image where imageId = ?', [imageId], (error, results, fields) => {
            if (error) {
                console.log("Error: " + error.message);
                result(null, err);
                return;
            }
            result(null, results);
        });

    } catch (err) {
        console.log("Error: " + err.message);
        result(null, err);
        return;
    }

}


Image.updateImage = (image, result) => {
    
    try {

        const imageData = image.imageData;

        image.dateAdded = Helper.getCurrentDateTime();

        let filepath = base64Img.imgSync(imageData, '../../server/images', Date.now());
        const arr = filepath.split('\\');

        image.imageData = 'http://localhost:8000/' + arr[arr.length - 1];

        connection.query('update image set imageData = ?, dateAdded = ? where imageId = ?', [image.imageData, image.dateAdded, image.imageId], (error, results, fields) => {
            if (error) {
                console.log("Error: " + error.message);
                result(null, err);
                return;
            }
            result(null, results);
        });

    } catch (err) {
        console.log("Error: " + err.message);
        result(null, err);
        return;
    }

}

Image.getImageById = (imageId, result) => {
    
    try {
        connection.query('select * from image where imageId = ?', [imageId], (error, results, fields) => {
            if (error) {
                console.log("Error: " + error.message);
                result(null, err);
                return;
            }
            result(null, results);
        });

    } catch (err) {
        console.log("Error: " + err.message);
        result(null, err);
        return;
    }

}