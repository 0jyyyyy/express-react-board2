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
}

const Main:FC =() => {
  const [page, setPage] = useState<number>(0);
  const [posts, setPosts] = useState<IPost[]>();
  const [totalPage, setTotalPage] = useState<number>(0);

  const{ account, getMe} = useMe();

  const getPosts =async (selectedPage: number) =>{
    try{
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_URL}/post?page=${selectedPage}`
      );
      setPosts(response.data);
      setPage(selectedPage);

    }catch(error){
      console.error(error);
    }
  };

  const getCount = async () => {
    try{
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_URL}/post/count`);
    
      setTotalPage(Math.floor(response.data.count / 10));
    }catch(error){
      console.error(error);
    }
  };

  const pageComp = () => {
    let pageCompArray = [];

    for(let i = 0; i <= totalPage; i++){
      pageCompArray.push(
      <li 
        key={i}
        className={`${page === i ? "font-bold" : "text-gray-300 hover:text-black"}`}>
        <button disabled={page === i} onClick={() => getPosts(i)}>
          {i + 1}
        </button>
      </li>);
    }
    return pageCompArray;
  };
 
  useEffect(() => {
    getMe();
    getPosts(0);
    getCount();
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
        {posts.map((v, i) => (
          <PostCard key={i} index={i} post={v} />
        ))}
    </ul>
    <ul className="flex text-lg justify-center mt-2 gap-2">
      {totalPage && pageComp()}
    </ul>
  </main>
  </>
  ) : (
    <div>Loading...</div>
  );
};

export default Main;