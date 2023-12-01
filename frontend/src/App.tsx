import { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/main";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up";
import Create from "./pages/create";



const App:FC = () => {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<Main />}/>
      <Route path="/sign-in" element={<SignIn />}/>
      <Route path="/sign-up" element={<SignUp />}/>
      <Route path="/create" element={<Create />}/>
      <Route path="/:postId" element={<Main />}/>
    </Routes>
  </BrowserRouter>
}; 

export default App;
