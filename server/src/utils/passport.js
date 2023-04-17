const LocalStrategy = require('passport-local').Strategy;

// creating and exporting passport configuration function
module.exports = (passport, User) => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
            },
            (email, password, done) => {
                try {
                    User.findOne({ email }, async (err, user) => {
                        if (err) { return done(err); }
                        if (!user) {
                            return done(null, false, { message: 'Incorrect email or password' });
                        }
                        const isPasswordMatch = await bcrypt.compare(password, user.password);
                        if (!isPasswordMatch) {
                            return done(null, false, { message: 'Incorrect email or password' });
                        }
                        return done(null, user);
                    });
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