const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// creating and exporting passport configuration function
module.exports = (passport, User) => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
            },
            async (email, password, done) => {
                try {
                    const user = await User.findOne({ email });
                        if (!user) {
                            return done(null, false, { error: 'Incorrect email or password' });
                        }
                        const isPasswordMatch = await bcrypt.compare(password, user.password);
                        if (!isPasswordMatch) {
                            return done(null, false, { error: 'Incorrect email or password' });
                        }
                        return done(null, user);
                } catch (err) {
                    return done(err);
                }
                
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, { id: user._id, role: user.role });
    });

    passport.deserializeUser((user, done) => {
        return done(null, user);
    });
}