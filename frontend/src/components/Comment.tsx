import axios from "axios";
import { FC, FormEvent, useEffect, useState } from "react";
import CommentCard from "./CommentCard";

interface CommentProps {
  postId : number;
}

export interface IComment {
  content: string;
  createdAt: Date;
  id: number;
  postId: number;
  updatedAt: Date;
  userId: number;
  user: {
    account:string;
  }
}

const Comment:FC<CommentProps> = ({ postId }) => {
  const [content, setContent] = useState<string>("");
  const [comments, setComments] = useState<IComment[]>([]);
  const onSubmitCreateComment = async(e:FormEvent) => {
    try{
      e.preventDefault();
      if(
        !content || content.trim().length === 0
      )
      return;
      const response = await axios.post(`${process.env.REACT_APP_BACK_URL!}/comment`,
      {
        content,
         postId,
      },
      {
        headers: {
          "Content-Type" : "application/json",
          Authorization : `Bearer ${localStorage.getItem("token")}`,
        }
      });
      setComments([response.data, ...comments]);
    }catch(error){
      console.error(error);
    }
  };

  const getComments = async() =>{
    try{
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_URL!}/comment?postId=${postId}`,
      );
      setComments(response.data);
    }catch(error){
      console.error(error);
    }
  };
  useEffect(()=>{
    getComments();
  }, []);

  return(
    <div className="px-4">
    <form className="flex flex-col pt-12" onSubmit={onSubmitCreateComment}>
      <textarea 
        className="px-4 py-2 h-28 rounded-md resize-none focus:outline-none border-2 focus:border-blue-300"
        value={content}
        onChange={(e) => setContent(e.target.value)} 
      />
      <input 
        className="self-end mt-2 button-style" 
        type="submit" 
        value="Create" 
      />
    </form>
    <ul className="pt-2">
      {comments.map((v, i) => (
        <CommentCard key={i} comment={v}/>
      ))}
    </ul>
    </div>
  );
  
};

export default Comment;