import axios from "axios";
import { FC, FormEvent, useState } from "react";

interface CommentProps {
  postId : number;
}

const Comment:FC<CommentProps> = ({ postId }) => {
  const [content, setContent] = useState<string>("");
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
      console.log(response);
    }catch(error){
      console.error(error);
    }
  };
  return(
    <form className="flex flex-col px-20 pt-12" onSubmit={onSubmitCreateComment}>
      <textarea className="px-4 py-2 h-28 resize-none rounded-md focus:outline-none border-2 focus:border-blue-300"
      value={content}
      onChange={(e) => setContent(e.target.value)} />
      <input className="self-end mt-2 button-style" type="submit" value="Create" />
    </form>
  )
  
};

export default Comment;