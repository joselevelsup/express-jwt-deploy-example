import express from "express";
import passport from "passport";
import setupJWTStrategy from "./auth/index.js";
import authRouter from "./routes/auth.js";

export default function createServer() {
  const app = express();

  app.use(express.json());

  setupJWTStrategy(passport);

  app.use("/auth", authRouter);

  app.get(
    "/protected",
    passport.authenticate("jwt", { session: false }),
    function (request, response) {
      console.log(request);

      response.status(200).json({
        success: true,
        message: "You should be good",
      });
    }
  );

  return app;
}
