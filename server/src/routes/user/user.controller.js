const bcrypt = require('bcryptjs');
const validator = require('validator');
const passport = require('passport');
const userModel = require('../../models/user.model');

async function registerUser(req, res) {
    try {
        const { firstName, lastName, email, password, role, admin_key } = req.body;

        if (!firstName || !lastName || !email || !password || !role) {
            return res.status(400).json({ error: 'Please enter all the details' });
        }

        const isEmail = validator.isEmail(email);

        if (!isEmail) {
            return res.status(400).json({ error: 'Please enter a valid email' });
        }


        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long' });
        }

        if (role !== 'admin' && role !== 'employer' && role !== 'user') {
            return res.status(400).json({ error: 'Please enter a valid role' });
        }

        if (role === 'admin') {
            if (admin_key !== process.env.ADMIN_KEY) {
                return res.status(401).json({ error: 'Invalid Admin key' });
            }
        }

        const UserExist = await userModel.findOne({ email });
        if (UserExist) {
            return res.status(409).json({ error: 'User already exist with the given email' });
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

        passport.serializeUser((user, done) => {
            done(null, { id: user._id, role: user.role });
        });

        passport.deserializeUser((user, done) => {
            return done(null, user);
        });

        req.login(user, () => {
            return res.status(201).json({ message: "Registration sucessful" });
        });
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json('Encountered an error');
    }
}

async function loginUser(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err) { 
          console.error(err);
          return res.status(500).json({ error: "An error occurred during authentication" });
        }
        if (!user) { 
          return res.status(401).json(info);
        }
        req.logIn(user, (err) => {
          if (err) { 
            console.error(err);
            return res.status(500).json({ message: "An error occurred while logging in" });
          }
          return res.status(200).json({ message: "Signin successful" });
        });
      })(req, res, next);
}

module.exports = {
    registerUser,
    loginUser,
}




