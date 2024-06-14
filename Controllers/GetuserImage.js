const Image = require('../Models/image');


const getUserImages = async (req, res) => {
    const userId = req.user._id;
    try {
        const likedImages = await Image.find({ likes: userId });
        console.log("likedImages>>>", likedImages);
        res.json(likedImages);
        console.log("Image Lenght>>", likedImages.length);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = getUserImages;