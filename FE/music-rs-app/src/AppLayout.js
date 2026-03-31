import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./home/Home";
import Login from "./login/Login";
import PlayList from "./playlist/Playlist";
import Play from "./play/Play";
import User from "./user/User";
import AskUser from "./askuser/AskUser";

export default function AppLayout(){
 return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/playlist" element={<PlayList/>}/>
        <Route path="/play" element={<Play/>}/>
        <Route path="/user" element={<User/>}/>
        <Route path="/ask_user" element={<AskUser/>}/>
    </Routes>
    </BrowserRouter>
 )
}