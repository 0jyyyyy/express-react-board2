import { PrismaClient } from "@prisma/client";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyToken } from "./auth";

const router = express.Router();

const client = new PrismaClient;

//유저 생성
router.post("/",async (req, res) => {
  try{
    const {account, password} = req.body;

    if(
        !account ||
        !password ||
        account.trim().length === 0 ||
        password.trim().length === 0
    )
    {
      return res.status(400).json({
        message: "Not Exist Data",
      });
    }

    const user = await client.user.findUnique({
      where:{
        account,
      },
    });
    if(user){
      return res.status(400).json({
        message: "Already Exist User",
      });
    }

    const hashedPassword = bcrypt.hashSync(password,10);

    await client.user.create({
      data:{
        account,
        password: hashedPassword,
      }
    });

    const token = jwt.sign({account},process.env.JWT_SECRET!);
    return res.json({token});

  }catch(error){
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
});
//유저 확인
router.get("/", verifyToken,async (req:any, res) => {
  try{
    const{account} = req.user;

    return res.json({account});
  }catch(error){
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
});

export default router;