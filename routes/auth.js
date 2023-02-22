import express from "express";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import prisma from "../db/index.js";

const router = express.Router();

router.post("/login", async function (request, response) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: request.body.username,
      },
      select: {
        id: true,
        username: true,
        password: true,
      },
    });

    if (!user) {
      response.status(401).json({
        success: false,
        message: "Wrong username and/or password",
      });
    }

    try {
      const passswordVerified = await argon2.verify(
        user.password,
        request.body.password
      );

      if (passswordVerified) {
        const token = jwt.sign({ user }, "superSecretPhrase");

        response.status(200).json({
          success: true,
          token,
        });
      } else {
        response.status(401).json({
          success: false,
          message: "Wrong user or password",
        });
      }
    } catch (e) {
      response.status(401).json({
        success: false,
        message: "Wrong user or password",
      });
    }
  } catch (e) {
    response.status(401).json({
      success: false,
      message: "Wrong user or password",
    });
  }
});

router.post("/signup", async function (request, response) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: request.body.username,
      },
      select: {
        id: true,
        username: true,
        password: true,
      },
    });

    if (!user) {
      try {
        const hashedPassword = await argon2.hash(request.body.password);
        const newUser = await prisma.user.create({
          data: {
            username: request.body.username,
            password: hashedPassword,
          },
        });

        if (newUser) {
          response.status(200).json({
            success: true,
            message: "User successfully created",
          });
        } else {
          console.log("failed to create new user");
          response.status(500).json({
            success: false,
          });
        }
      } catch (e) {
        console.log("could not hash password");
        response.status(500).json({
          success: false,
        });
      }
    } else {
      response.status(401).json({
        success: false,
        message: "user already exists",
      });
    }
  } catch (e) {
    response.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
});

export default router;
