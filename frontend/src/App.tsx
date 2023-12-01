import { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/main";
import SignIn from "./pages/sign-in";



const App:FC = () => {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<Main />}/>
      <Route path="/sign-in" element={<SignIn />}/>
      <Route path="/sign-up" element={<Main />}/>
      <Route path="/create" element={<Main />}/>
      <Route path="/:postId" element={<Main />}/>
    </Routes>
  </BrowserRouter>
}; 

export default App;
