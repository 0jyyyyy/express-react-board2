import { FC, useEffect, useState } from "react";
import { useMe } from "../hooks";
import { Link, useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import Comment from "../components/Comment";
import axios from "axios";
import { IPost } from "./main";
import { FiArrowLeft, FiX , FiTrash2 } from "react-icons/fi";
import { GrEdit } from "react-icons/gr";

const Detail: FC = () => {
  const[post, setPost] = useState<IPost>();
  const[editToggle, setEditToggle] = useState<boolean>(false);
  const[title, setTitle] = useState<string>("");
  const[content, setContent] = useState<string>("");
  const[isOpen, setIsOpen] = useState<boolean>(false); // modal 창이 열려있는지를 판별

  const {account, getMe} = useMe();
 
  const { postId } = useParams();

  const navigate = useNavigate();

  const getPost = async() => {
    try{
      const response = await axios.get(`
      ${process.env.REACT_APP_BACK_URL}/post/${postId}`);
      setPost(response.data);
      setTitle(response.data.title);
      setContent(response.data.content);

    }catch(error){
      console.error(error);
    }
  };

  const onClickEdit = async () => {
    try{
      if(!title && !content) return ;

      if(title === post?.title && content === post?.content) return;

      const response = await axios.put(`
      ${process.env.REACT_APP_BACK_URL}/post/${postId}`,
        {
          title,
          content,
        },
        {
          headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
        setPost(response.data);
        setTitle(response.data.title);
        setContent(response.data.content);
        setEditToggle(false);
    }catch(error){
      console.error(error);
    }
  };

  const onClickDelete = async () => {
    try{
      await axios.delete(`
      ${process.env.REACT_APP_BACK_URL}/post/${postId}`,
        {
          headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      navigate("/");
    }catch(error){
      console.error(error);
    }
  };


  useEffect(() => {
    getMe();
    getPost();
  },[]);

  return(
    <>
      <Header account={account}/>
      <main className="max-w-screen-md mx-auto py-24">
      {post ? (
      <div>
        <div className="p-4 flex justify-between" >
          <Link to="/"className="flex items-center">
            <FiArrowLeft size={22}/>Back
          </Link>
          <div className="flex">
            {editToggle &&(
              <button onClick={onClickEdit} className="flex items-center mr-3">
                <GrEdit size={22}/>Edit
              </button>
            )}
            {account === post.user.account && (
              <>  
                <button
                  className="flex items-center"
                  onClick={()=> setEditToggle(!editToggle)}
                >
                  {editToggle ? (
                    "Cancel"
                  ) : (
                    <>
                      <GrEdit size={22}/>Edit
                    </>
                  )}
                </button>
                <button
                  className="flex items-center"
                  onClick={() =>setIsOpen(true)}
                >
                  <FiTrash2 size={22}/>Delete   
                </button>
              </>
            )}
          </div>
        </div>
        <div className="border-b-2">
          {editToggle ? (
            <div className="text-center py-[26px] px-20">
              <input 
                type="text" 
                className="input-style w-full" 
                value={title} onChange={(e) => setTitle(e.target.value)
              }/>
            </div>
          ) : (
            <h1 className="text-center font-bold py-8 text-2xl">
              {post.title}
            </h1>
          )}
          <div className="text-right pb-2 text-sm px-20"> 
            <span>{post.user.account},</span>
            <span>
              {formatDistanceToNow(new Date(post.createdAt), {
                locale: ko,
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
        {editToggle ? (
          <div className="px-20 pt-12">
            <textarea 
              className="input-style w-full h-96 resize-none"
              value={content} onChange={(e) => setContent(e.target.value)
            }/>
          </div> 
        ) : (
          <div className="px-20 pt-12 min-h-[360px]">
            { post.content }
          </div>
        )}
      </div> ) : (<div>Loading...</div>)}
         <Comment postId={+postId!} />     
      </main>
      {isOpen && ( 
        <div className="fixed w-full h-full bg white top-0 left-0 bg-opacity-50 flex justify-center items-center">
          <div className="text-xl p-8">
            <div className="text-right">
              <button onClick={() => setIsOpen(false)}>
                <FiX/>
              </button>
            </div>
            <h1 className="mt-8">정말 삭제하시겠습니까?</h1>
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

export default Detail;