const Image = require('../Models/image');

const imageFilter = async (req, res) => {
    const category = req.query.category;
    if (!category) {
        return res.status(400).send({ error: 'Category query parameter is required' });
    }
    try {
        const byCategory = await Image.find({ categories: category });
        console.log('Image filter>>', byCategory);
        res.status(201).json(byCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }

};

module.exports = imageFilter