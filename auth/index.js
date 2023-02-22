import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";

let opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "superSecretPhrase",
};

export default function setupJWTStrategy(passport) {
  passport.use(
    new JWTStrategy(opts, async function (payload, done) {
      try {
        return done(null, payload.user);
      } catch (err) {
        return done(err, null);
      }
    })
  );
}
