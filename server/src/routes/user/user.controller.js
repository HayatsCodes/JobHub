const bcrypt = require('bcryptjs');
const userModel = require('../../models/user.model');

async function registerUser(req, res) {
    try {
        const { firstName, lastName, email, password, role } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: 'Please enter all the details' });
        }

        const UserExist = await userModel.findOne({ email });
        if (UserExist) {
            return res.status(409).json({ error: 'User already exist with the given email' });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
        };

        const user = new userModel(newUser);
        await user.save();

        req.login({ id: user._id, role }, () => {
            return res.status(201).json({ message: "Registration sucessful" });
        });
    } catch (err) {
        return res.status(400).json(err.stack);
    }
}

module.exports = registerUser;




