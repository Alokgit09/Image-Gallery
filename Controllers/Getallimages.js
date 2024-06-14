const images = require('../Models/image');


const getAllImages = async (req, res) => {
    try {
        const allImages = await images.find();
        res.status(201).json(allImages);
        // console.log("allImages>>", allImages);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


module.exports = getAllImages;
