module.exports = app => {
    
    const image = require('../controllers/image.controller.js');

    // Get all images by a patientId
    app.get("/images/:patientId", image.getAllImagesByPatientId);

    // Add a new image
    app.post("/image", image.addImage);

    // Add image with existing address
    app.post("/imageAddress", image.addImageByAddress);

    // Delete image by id
    app.delete("/image/:imageId", image.deleteImage);

    // Updates an image
    app.put("/image", image.updateImage);

    app.get("/image/:imageId", image.getImageById);

}