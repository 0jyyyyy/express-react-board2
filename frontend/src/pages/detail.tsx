import { FC, useEffect } from "react";
import { useMe } from "../hooks";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

const Detail: FC = () => {
  const {account, getMe} = useMe();

  const [searchParams] = useSearchParams();
  const title = searchParams.get("title");
  const userAccount = searchParams.get("user-account");
  const createdAt = searchParams.get("created_at");
  const content = searchParams.get("content");

  useEffect(() => {
    getMe();
  },[]);

  return(
    <>
      <Header account={account}/>
      <main className="max-w-screen-md mx-auto py-24">
        <div className="border-b-2">
          <h1 className="text-center font-bold py-8 text-2xl">{ title }</h1>
          <div className="text-right pb-2 text-sm px-20"> 
            <span>{ userAccount },</span>
            <span>
              { formatDistanceToNow(new Date(createdAt!), {
                locale: ko,
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
        <div className="px-20 pt-12 min-h-[360px]">{ content }</div>
      </main>
    </>
  ); 
};

export default Detail;