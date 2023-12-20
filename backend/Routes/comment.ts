import { PrismaClient } from "@prisma/client";
import express from "express";
import { verifyToken } from "./auth";

const router = express.Router();

const client = new PrismaClient();

const select = {
  id: true,
  createdAt: true,
  content: true,
  userId: true,
  user: {
    select: {
      account:true,
    },
  },
  postId: true,
};

//댓글 생성
router.post('/', verifyToken, async(req:any, res) => {
  try{
    const { content, postId }  = req.body; // 댓글은 글의 내용, 글 제목 가져온다
    const { user } = req;

    if(
      !content ||
      content.trim().length === 0
    ){
      return res.status(400).json({
        message : "Not Exist Data",
      });
    }
    if( // postid가 존재하지않거나 postId가 숫자가 아닐경우
      !postId ||
      isNaN(+postId)
    ){
      return res.status(400).json({
        message: "Post Id is not a Number",
      });
    }
    // db 상에 postId가 존재하는지를 먼저 체크한다.
    const post = await client.post.findUnique({
      where : { 
        id: +postId,
      },
    });

    if(!post) { 
      return res.status(400).json({
        message: "Not Exist Post",
      });
    }
    const comment = await client.comment.create({
      data : {
        content,
        userId : user.id,
        postId : post.id,
      },
      select,
    });

    return res.json(comment);
    
  }catch(error){
    console.error(error);

    return res.status(500).json({
      message : "Server Error",
    });
  }
});
//댓글 읽기?
router.get('/', async(req, res) => { // verifyToken은 필수 x 
  try{
    const { postId } = req.query;
    if(
      !postId ||
      isNaN(+postId)
    ){
      return res.status(400).json({
        message: "Post Id is not a Number",
      });
    }
     // db 상에 postId가 존재하는지를 먼저 체크한다.
     const post = await client.post.findUnique({
      where : { 
        id: +postId,
      },
    });

    if(!post) { 
      return res.status(400).json({
        message: "Not Exist Post",
      });
    }

    const comments = await client.comment.findMany({
      where : { // postId로 comment를 조회하는것
        postId : +postId,
      },
      select,
      orderBy: {
        createdAt:"desc", //최신순으로
      },
    });

    return res.json(comments);
  }catch(error){
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }

});

export default router;