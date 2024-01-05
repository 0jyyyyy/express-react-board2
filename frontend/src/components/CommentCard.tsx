import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { IComment } from "./Comment";
import { formatDistanceToNow } from "date-fns";
import { ko }  from "date-fns/locale";
import { useMe } from "../hooks";
import { GrEdit } from "react-icons/gr";
import { FiTrash2, FiX } from "react-icons/fi";
import axios from "axios";


interface CommentCardProps {
  comment: IComment;
  comments : IComment[];
  setComments : Dispatch<SetStateAction<IComment[]>>;
}

const CommentCard:FC<CommentCardProps> =({ comment, comments, setComments }) => {
  const{ account, getMe } = useMe();
  const[ isEdit, setIsEdit ] = useState<boolean>(false);
  const[updateComment, setUpdateComment] = useState<string>(comment.content);
  const[ content, setContent] = useState<string>(comment.content);

  const[ isOpen, setIsOpen] = useState<boolean>(false);

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

  const onClickDelete = async () => {
    try{
      const response = await axios.delete(
        `${process.env.REACT_APP_BACK_URL}/comment/${comment.id}`,
        {
          headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const temp = comments.filter((v, i) => v.id !== response.data);
     setComments(temp);
     setIsOpen(false);
     window.location.reload();
    }catch(error){
      console.error(error);
    }
  }
  useEffect(() =>{
    getMe();
  },[]);

  useEffect(() => {
    setContent(comment.content);
    setUpdateComment(comment.content);
  },[comment]);

  
  return(
    <>
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
          <button 
            className="flex items-center mr-3"
            onClick={() => setIsOpen(true)}
          >
            <FiTrash2 size={20}/> Delete
          </button>
          
        </span>)}
        <span className="w-32 pl-2">
        {formatDistanceToNow(new Date(comment.createdAt),{
          locale: ko,
          addSuffix: true,
        })}
        </span>
    </li>
    {isOpen && ( 
        <div className="fixed w-full h-full bg white top-0 left-0 bg-opacity-50 flex justify-center items-center">
          <div className="text-xl p-8">
            <div className="text-right">
              <button onClick={() => setIsOpen(false)}>
                <FiX/>
              </button>
            </div>
            <h1 className="mt-8">댓글을 삭제하시겠습니까?</h1>
            <div className="mt-8 text-center mt-4 flex justify-center">
              <button className="flex items-center justify-center" onClick={onClickDelete}>
                <FiTrash2 size={22}/> Delete  
              </button>
            </div>
          </div>
        </div>
      )}
    </>  
  );
};

export default CommentCard;