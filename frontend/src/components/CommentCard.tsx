import { FC, useEffect, useState } from "react";
import { IComment } from "./Comment";
import { formatDistanceToNow } from "date-fns";
import { ko }  from "date-fns/locale";
import { useMe } from "../hooks";
import { GrEdit } from "react-icons/gr";
import { FiX } from "react-icons/fi";
import axios from "axios";


interface CommentCardProps {
  comment: IComment;
}

const CommentCard:FC<CommentCardProps> =({ comment }) => {
  const{ account, getMe } = useMe();
  const[ isEdit, setIsEdit ] = useState<boolean>(false);
  const[updateComment, setUpdateComment] = useState<string>(comment.content);
  const[ content, setContent] = useState<string>(comment.content);

  const onClickEdit = async () => {
    try{
      if(!updateComment || updateComment === comment.content) return;

      const response = await axios.put(
        `${process.env.REACT_APP_BACK_URL}/comment/${comment.id}`,
        {
          content : updateComment,
        },
        {
          headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

     setContent(response.data.content);
     setIsEdit(false);
    }catch(error){
      console.error(error);
    }
  };
  useEffect(() =>{
    getMe();
  },[]);

  
  return(
    <li className="flex mb-2">
        <span className="w-20 text-right">{comment.user.account}</span> 
        <span className="grow pl-2">{isEdit ? (
          <input 
            type="text" 
            className="border-2 focus:outline-none focus:border-blue-300 px-1 rounded-lg text-sm"
            value={updateComment}
            onChange={(e) => setUpdateComment(e.target.value)}
          /> 
          ) : (
            content
          )}
         </span>
        { account === comment.user.account && (
        <span className="flex">
          {isEdit && (
            <button 
            onClick={onClickEdit}
            className="flex items-center mr-3"
          >
            <GrEdit size={20}/>Edit 
          </button>  
          )}
          <button 
            onClick={() => setIsEdit(!isEdit)}
            className="flex items-center mr-3"
          >
            {isEdit ? <><FiX size={20} />Cancel </>: <><GrEdit size={20}/>Edit</>}
          </button>
          삭제 가능
        </span>)}
        <span className="w-32 pl-2">
        {formatDistanceToNow(new Date(comment.createdAt),{
          locale: ko,
          addSuffix: true,
        })}
        </span>
    </li>
  )
};

export default CommentCard;