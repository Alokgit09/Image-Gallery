
const mongoose = require('mongoose');
const Image = require('../Models/image');


const imageLikes = async (req, res) => {
    const imageId = req.params.id;
    const userId = req.user._id; // Corrected from 'UsedId' to 'userId'
    if (!mongoose.Types.ObjectId.isValid(imageId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({ error: 'Invalid image ID or user ID' });
    }

    try {
        console.log("Finding and updating the image with ID:", imageId);
        const image = await Image.findById(imageId);
        if (!image) {
            console.log("Image not found with ID:", imageId);
            return res.status(404).send({ error: 'Image not found' });
        }
        const hasLiked = image.likes.includes(userId);
        const update = hasLiked
            ? { $pull: { likes: userId } }
            : { $addToSet: { likes: userId } };

        const updateImage = await Image.findByIdAndUpdate(
            imageId,
            update,
            { new: true }
        );
        res.status(200).json(updateImage);
        // const protocol = req.protocol;
        // const host = req.get('host');
        // console.log(`"host>>>", ${protocol}://${host}/upload`);
    } catch (error) {
        console.error("Error toggling like:", error);
        res.status(500).send({ error: 'Error toggling like' });
    }

};

module.exports = imageLikes;
