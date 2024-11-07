const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../schema/userInfo');

module.exports = function() {
    // Serialize user for the session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Deserialize user from the session
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });

passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback"
  
  },
  async function(accessToken, refreshToken, profile,cb){
    try{
      let user = await User.findByGoogleId(profile.id);
      if(user){
        await user.updateLastLogin();
      }
      else{
        user = await User.create({
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          profilePhoto: profile.photos[0].value
        });
      }
      return cb(null , user);
    }catch(err){
      return cb(err,null);
    }
  }
  ));
};  