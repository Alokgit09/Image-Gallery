const jwt = require('jsonwebtoken');
const User = require('../Models/User');



const authenticat = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (verifyUser) {
            const user = await User.findOne({ _id: verifyUser.id });
            // console.log("user find by id >>>", user);
            req.user = user;
            return next();

        }

    } catch (err) {
        res.status(404).json({ message: 'Please Login Your Account' });
        console.log("Token Expired Please Login Your Account");
    }

};


module.exports = authenticat;