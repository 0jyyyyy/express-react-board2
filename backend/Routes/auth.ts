import express, {Response, NextFunction } from "express";
import {PrismaClient} from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const client = new PrismaClient;

//로그인
router.post("/", async (req,res) => {
  try{
    const {account, password} = req.body;

    if(
      !account ||
      !password ||
      account.trim().length === 0||
      password.trim().length === 0
    )
    {
      return res.status(400).json({
        message: "Not Exist Data",
      });
    }

    const user = await client.user.findUnique({
      where: {
        account,
      },
    });

    if(!user){
      return res.status(400).json({
        message: "Not Exist User",
      });
    }
    const isComparePassword = bcrypt.compareSync(password, user.password);

    if(!isComparePassword){
      return res.status(400).json({
        message: "Incorrect Password",
      });
    }

    const token = jwt.sign({account}, process.env.JWT_SECRET!);

    return res.json({ token,});

  }catch(error){
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
});

export const verifyToken = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try{
    const token = req.headers.authorization.substring(7);

    if(!token){
      return res.status(400).json({
        message: "Not Exist Token",
      });
    }

    const {account} = jwt.verify(token,process.env.JWT_SECRET!) as {
      account : string
    };

    const user = await client.user.findUnique({
      where:{
        account,
      },
    });

    if(!user){
      return res.status(400).json({
        message: "Not Exist User",
      });
    }
    req.user = user;

    next();
  }catch(error){
    console.error(error);

    return res.status(400).json({
      message: "Not Verified Token"
    });
  }
};
export default router;