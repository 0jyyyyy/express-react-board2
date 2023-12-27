import { PrismaClient } from "@prisma/client";
import express from "express";
import { verifyToken } from "./auth";

const router = express.Router();
const client = new PrismaClient;

const select = {
  id: true,
  createdAt: true,
  title: true,
  content: true,
  user: {
    select: {
      account:true,
    },
  },
};


//글 생성
router.post("/", verifyToken, async(req:any, res) =>{
  try{
    const {title, content} = req.body;
    const {user} =req;

    if(
      !title ||
      !content ||
      title.trim().length === 0 ||
      content.trim().length === 0
    ) {
      return res.status(400).json({
        message: "Not Exist Data",
      });
    }
    const post = await client.post.create({
      data: {
        title,
        content,
        userId : user.id
      },
      select,
    });
    return res.json({post})
  }catch(error){
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
});

//글 조회
router.get("/", async (req, res) => {
  try{
    const {page} = req.query
    
    if(
      !page ||
      isNaN(+page)
    ){
      return res.status(400).json({
        message: "Wrong Page",
      });
    }

    const posts = await client.post.findMany({
      skip: +page * 10,
      take: 10,
      orderBy: {
        id: "desc",
      },
      select,
    });

    return res.json(posts);
  }catch(error){
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
});


//전체 글 갯수
router.get("/count", async(req,res) => {
  try{
    const posts = await client.post.findMany();

    return res.json({ count: posts.length});
  }catch(error){
    console.error(error);

    return res.status(500).json({
      message:"Server Error",
    });
  }
});

//글 한개 조회
router.get("/:postId", async(req,res) =>{
  try{
    const { postId } = req.params;

    if(!postId || isNaN(+postId)){
      return res.status(400).json({
        message: "Not Exist postId",
      });
    }

    const post = await client.post.findUnique({
      where : {
        id: +postId,
      },
      select,
    });

    if(!post){
      return res.status(400).json({
        message: "Not Exist postId",
      });
    }
    
    return res.json(post);
  }catch(error){
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
});

//글 수정
router.put("/:postId", verifyToken, async(req: any ,res) =>{
  try{
    const { postId } = req.params;
    const { title, content } = req.body;
    const { user } = req;

    if(!postId || isNaN(+postId)){
      return res.status(400).json({
        message: "Not Exist postId",
      });
    }

    if(
      (!title || title.trim().length === 0) &&
      (!content || content.trim().length === 0)
      
    ) {
      return res.status(400).json({
        message: "Not Exist Data",
      });
    }

    const existPost = await client.post.findUnique({
      where : {
        id : +postId,
      },
    });

    if(!existPost || existPost.userId !== user.id) {
      return res.status(400).json({
        message : "Not exist post",
      });
    }

    const updatedPost = await client.post.update({
      where : {
        id : +postId,
      },
      data : {
        title : title ? title : existPost.title,
        content : content ? content : existPost.content,
      },
      select,
    });
    return res.json(updatedPost);
  }catch(error){
    console.error(error);

    return res.status(500).json({
      message : "Server Error",
    })
  }
});
//글 삭제
router.delete("/:postId", verifyToken, async(req:any, res)=>{
  try{
    const { postId } = req.params;
    const { user } = req;

    if(!postId || isNaN(+postId)){
      return res.status(400).json({
        message: "Not Exist postId",
      });
    }

    const existPost = await client.post.findUnique({
      where : {
        id : +postId,
      },
    });

    if(!existPost || existPost.userId !== user.id) {
      return res.status(400).json({
        message : "Not exist post",
      });
    }

    await client.comment.deleteMany({
      where : {
        postId : existPost.id,
      },
    });

    const deletePost = await client.post.delete({
      where : {
        id : +postId,
      },
    });

    return res.json(deletePost.id);
  }catch(error){
    console.error(error);

    return res.status(500).json({
      message : "Server Error",
    })
  }
});

export default router;