const User = require('../Models/User');
const bcrypt = require("bcrypt");


const createAccount = async (req, res) => {
    try {
        const ragisterInfo = new User(req.body);
        const token = await ragisterInfo.generateAuthToken();
        const ragistered = await ragisterInfo.save();
        res.status(201).json(ragistered);

    } catch (err) {
        console.log("Error>>>>>", err);
        res.status(400).send({
            message: `Error In Register Controllers`,
            success: false,
            err,
        });
    }

};



const loginAccount = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const emailVal = await User.findOne({ email: email });
        const passwordVal = await bcrypt.compare(password, emailVal.password);
        if (emailVal || passwordVal) {
            const token = await emailVal.generateAuthToken();
            const sendValue = { email: email, token: token };
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 600000),
                httpOnly: true,
            });
            if (passwordVal) {
                res.status(200).json(sendValue);
            } else {
                res.status(400).json({ message: 'Invalid Password' });
            }
        } else {
            res.status(400).json({ message: 'Invalid login Details' });
        }

    } catch (err) {
        console.log("Error>>>>>", err);
        res.status(400).send({
            message: `Error In login Controllers`,
            success: false,
            err,
        });
    }
};



module.exports = {
    createAccount,
    loginAccount
};