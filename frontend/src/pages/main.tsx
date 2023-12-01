import axios from "axios";
import { FC, useEffect, useState } from "react";
import Header from "../components/Header";
import PostCard from "../components/PostCard";
import { useMe } from "../hooks";

export interface IPost {
  content: string;
  createdAt: string;
  id: number;
  title: string;
  updatedAt: string;
  user: {
    account: string;
  };
  userId: number;
}

const Main:FC =() => {
  const [page, setPage] = useState<number>(0);
  const [posts, setPosts] = useState<IPost[]>();

  const{ account, getMe} = useMe();
  const getPosts =async () =>{
    try{
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_URL}/post?page=${page}`
      );

      setPosts(response.data);
      console.log(response);
    }catch(error){
      console.error(error);
    }
  };
 
  useEffect(() => {
    getMe();
    getPosts();
  },[]);
  
  return posts ? (<>
  <Header account = {account}/>
  <main className="max-w-screen-md mx-auto">
    <h1 className="mt-20 text-center font-bold text-2xl">ojy0533's Board</h1>
    <ul className="mt-10 h-[440px]">
      <li className="flex justify-between border-b-2 font-semibold">
        <span className="w-2/12 p-2 text-center">ID</span>
        <span className="w-6/12 p-2 text-center">TITLE</span>
        <span className="w-2/12 p-2 text-center">USER</span>
        <span className="w-2/12 p-2 text-center">DATE</span>
      </li>
      <li>
        {posts.map((v, i) => (
          <PostCard key={i} index={i} post={v} />
        ))}
      </li>
    </ul>
    <ul className="flex text-lg justify-center">
      <li>페이지</li>
    </ul>
  </main>
  </>
  ) : (
    <div>Loading...</div>
  );
};

export default Main;