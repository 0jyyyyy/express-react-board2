import axios from "axios";
import { FC, useEffect } from "react";

const Main:FC =() => {
  const getMe = async () =>{
    const token = localStorage.getItem("token");
    if(!token) return;

    try{
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_URL}/user`,
        {
          headers:{
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
    }catch(error){
      console.error(error);
    }
  };

  useEffect(() => {
    getMe();
  },[]);

  return <>
  <header>헤더</header>
  <main className="max-w-screen-md mx-auto">
    <h1 className="mt-20 text-center font-bold text-2xl">ojy0533's Board</h1>
    <ul className="mt-10 h-[440px]">
      <li className="flex justify-between border-b-2 font-semibold">
        <span className="w-2/12 p-2 text-center">ID</span>
        <span className="w-6/12 p-2 text-center">TITLE</span>
        <span className="w-2/12 p-2 text-center">USER</span>
        <span className="w-2/12 p-2 text-center">DATE</span>
      </li>
      <li>포스트 카드</li>
    </ul>
    <ul className="flex text-lg justify-center">
      <li>페이지</li>
    </ul>
  </main>
  </>;
};

export default Main;