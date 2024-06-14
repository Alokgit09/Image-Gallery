const download = require('image-downloader');
const image = require('../Models/image');
const fs = require('fs');
const path = require('path');

const imageDownloader = async (req, res) => {
    const { id } = req.params;
    try {
        const imageFind = await image.findOne({ _id: id });
        console.log("imageFind", imageFind.fileUrl);

        // Define the directory and ensure it exists
        const downloadDir = path.resolve(__dirname, '../download');
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir, { recursive: true });
        }

        const options = {
            url: imageFind.fileUrl,
            dest: path.join(downloadDir, path.basename(imageFind.fileUrl)), // save with original file name
        };
        console.log('options>>', options);
        await download.image(options);
        const filePath = path.join(downloadDir, path.basename(imageFind.fileUrl));
        res.status(201).sendFile(filePath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).json({ message: 'Error sending file' });
            } else {
                console.log('File sent successfully');
            }
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = imageDownloader;
