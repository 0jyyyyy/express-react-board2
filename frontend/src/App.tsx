import { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/main";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up";
import Create from "./pages/create";
import Detail from "./pages/detail";



const App:FC = () => {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<Main />}/>
      <Route path="/sign-in" element={<SignIn />}/>
      <Route path="/sign-up" element={<SignUp />}/>
      <Route path="/create" element={<Create />}/>
      <Route path="/:postId" element={<Detail />}/>
    </Routes>
  </BrowserRouter>
}; 

export default App;
