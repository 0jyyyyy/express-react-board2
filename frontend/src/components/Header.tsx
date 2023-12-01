import { FC } from "react";
import { Link } from "react-router-dom";

interface HeaderProps{
  account: string;
}
const Header:FC<HeaderProps> = ({account}) => {
  return(
    <header className="max-w-screen=md mx-auto flex justify-between items-center p-4">
      {account ? (
        <div>
        <span className="font-semibold">ojy0533</span>'s Welcome
        <Link to="/create" className="button-style">
          Create  
        </Link> 
      </div>
      ) : (
        <div>
        <Link to="/sign-in" className="text-blue-500 hover:text-blue-700">
          Sign In
        </Link>
        <Link to="/sign-up" className="ml-4 text-blue-500 hover:text-blue-700">
          Sign Up
        </Link>
      </div>
      )
    }  
    </header>
  );
};

export default Header;