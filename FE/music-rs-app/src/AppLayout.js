import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./home/Home";
import Login from "./login/Login";

export default function AppLayout(){
 return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
    </Routes>
    </BrowserRouter>
 )
}