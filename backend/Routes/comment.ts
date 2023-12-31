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
//댓글 수정
router.put("/:commentId", verifyToken, async(req:any, res) =>{
    try{
      const{ commentId } = req.params;
      const{ content } = req.body;
      const{ user } = req;

      if(!commentId || isNaN(+commentId)){
        return res.status(400).json({
          message: "Not Exist Comment Id",
        });
      }

      if(!content || commentId.trim().length <= 0){
        return res.status(400).json({
          message: "Not Exist Content",
        });
      }

      const existComment = await client.comment.findUnique({
        where : {
          id: +commentId,
        },
      });
      
      if(!existComment || existComment.userId !== user.id){
        return res.status(400).json({
          message: "Not Exist Comment"
        });
      }

      const updatedComment = await client.comment.update({
        where : {
          id: +commentId,
        },
        data: {
          content,
        },
        select,
      });

      return res.json(updatedComment);
    }catch(error){
      console.error(error);

      return res.status(500).json({
        message: "Server Error",
      });
    }
});
//댓글 삭제
router.delete("/:commentId",verifyToken, async(req:any, res) => {
  try{
    const { commentId } = req.params;
    const { user } = req;

    if(!commentId || isNaN(+commentId)){
      return res.status(400).json({
        message: "Not Exist CommentId",
      });
    }

    const existComment = await client.comment.findUnique({
      where : {
        id : +commentId,
      },
    });

    if(!existComment || existComment.userId !== user.id){
      return res.status(400).json({
        message : "Not Exist Comment",
      });
    }
    const deleteComment = await client.comment.delete({
      where : {
        id: +commentId,
      },
    });
    return res.json({
      id: +deleteComment.id, // 삭제된 모든 내용보다는 몇번이 삭제된거지만 확인용으로
    });
  }catch(error){
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    })
  }
});
export default router;