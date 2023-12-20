import { FC } from "react";
import { IComment } from "./Comment";
import { formatDistanceToNow } from "date-fns";
import { ko }  from "date-fns/locale";

interface CommentCardProps {
  comment: IComment;
}

const CommentCard:FC<CommentCardProps> =({ comment }) => {
  
  return(
    <li className="flex mb-2">
        <span className="w-20 text-right">{comment.user.account}</span> 
        <span className="grow pl-2">{comment.content}</span>
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