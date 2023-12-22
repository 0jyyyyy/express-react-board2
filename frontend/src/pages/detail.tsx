import { FC, useEffect, useState } from "react";
import { useMe } from "../hooks";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import Comment from "../components/Comment";
import axios from "axios";
import { IPost } from "./main";
import { FiArrowLeft } from "react-icons/fi";

const Detail: FC = () => {
  const[post, setPost] = useState<IPost>();

  const {account, getMe} = useMe();

  //const [searchParams] = useSearchParams();
  const { postId } = useParams();

  // const title = searchParams.get("title");
  // const userAccount = searchParams.get("user-account");
  // const createdAt = searchParams.get("created_at");
  // const content = searchParams.get("content");

  const getPost = async() => {
    try{
      const response = await axios.get(`
      ${process.env.REACT_APP_BACK_URL}/post/${postId}`);
      setPost(response.data);

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
        <div className="p-4">
          <Link to="/"className="flex items-center">
            <FiArrowLeft size={22}/>Back
          </Link>
        </div>
        <div className="border-b-2">
          <h1 className="text-center font-bold py-8 text-2xl">{post.title}</h1>
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
        <div className="px-20 pt-12 min-h-[360px]">{ post.content }</div>
        </div> ) : (<div>Loading...</div>)}
         <Comment postId={+postId!} />     
      </main>
    </>
  ); 
};

export default Detail;