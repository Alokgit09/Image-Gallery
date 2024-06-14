const express = require('express');
require('./db/Connect');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cookieParser = require("cookie-parser");
const images = require('./Models/image');
const destinationPath = path.join(__dirname, './upload');

const getAllImages = require('./Controllers/Getallimages');
const { createAccount, loginAccount } = require('./Controllers/LoginSignup');
const imagesDownload = require('./Controllers/ImageDownload');
const ImageLikes = require('./Controllers/imageLikes');
const Auth = require('./Middleware/Auth');
const getUserImages = require('./Controllers/GetuserImage');
const imageFilter = require('./Controllers/Filter');

const app = express();
const port = 6060;
app.use(express.json());
app.use(cookieParser());

// Ensure the upload directory exists
if (!fs.existsSync(destinationPath)) {
    fs.mkdirSync(destinationPath, { recursive: true });
}

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
        console.log("Uploading");
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb, res) => {
    // Allowed file extensions
    const filetypes = /jpeg|jpg|png|gif/;
    // Check the file extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check the file MIME type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only images are allowed!'), false);
    }
};

const upload = multer({
    storage: diskStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: fileFilter
});
console.log("diskStorage", upload);

// Serve static files from the public directory
app.use(express.static('public'));

// Serve uploaded files from the upload directory
app.use('/upload', express.static(destinationPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});



app.get('/getallimages', getAllImages);

app.post('/signup', createAccount);
app.post('/login', loginAccount);

app.get('/download/:id', imagesDownload);
app.post('/like/:id', Auth, ImageLikes);
app.get('/userimage', Auth, getUserImages);
app.get('/category', imageFilter);



app.post('/upload', Auth, upload.single('image'), async (req, res) => {
    const imageUrl = req.file.filename;
    res.setHeader("Content-Type", "text/html");
    req.body.userId = req.user.id;
    const userId = req.body.userId;
    console.log("UserId>>", userId);
    // res.json({
    //     success: "OK",
    //     file_url: `http://localhost:6060/upload/${req.file.filename}`
    // });


    // const payload = {
    //     username: req.body.username,
    //     categories: req.body.categories,
    //     fileUrl: imageUrl
    // };

    // const hostname = `${req.protocol}://${req.hostname}:${req.port}`;
    const host = req.get('host')
    console.log("host>>>", host);
    try {
        const addImage = new images({
            userId: userId,
            categories: req.body.categories, // Assuming Categories is coming from the request body
            fileUrl: `${req.protocol}://${host}/upload/${imageUrl}`
        });
        const imageData = await addImage.save();
        console.log("payload>>", imageData);
        res.status(201).send(imageData);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

function exceptionHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        res.json({
            success: "Not OK",
            message: err.message
        });
    } else {
        next(err);
    }
}

app.use(exceptionHandler);




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
