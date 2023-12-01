import axios from "axios";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const onSubmitSignUp = async(e:FormEvent) =>{
    try{
      e.preventDefault();

      if(
        !account ||
        !password ||
        account.trim().length === 0 ||
        password.trim().length === 0
      )
      return;

      const response = await axios.post(
        `${process.env.REACT_APP_BACK_URL}/user`,
        {
          account,
          password,
        }
      );

      localStorage.setItem("token",response.data.token);
      navigate("/");
    }catch(error){
      console.error(error);
    }
  }
  return(
    <main className="min-h-screen flex flex-col justify-center items-center pb-20">
      <h1 className="text-2xl font-bold">ojy0533's Board Sign Up</h1>
      <form 
        className="mt-8 flex items-end gap-4"
        onSubmit={onSubmitSignUp}
      >
        <div className="flex flex-col gap-2 relative">
          <input 
            className="input-style" 
            type="text"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />
          <input 
            className="input-style" 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}  
          />
          <div className="absolute-bottom-5 left-2 text-xs">
            Already have an Account?
            <Link to ="/sign-in"
              className="ml-1 text-blue-500 active:text-blue-700">
                Sign In
            </Link>
          </div>
        </div>
        <input className="button-style" type="submit" value="Sign up"/>
      </form>
    </main>
  )
};

export default SignUp;