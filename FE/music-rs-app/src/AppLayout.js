import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./home/Home";
import Login from "./login/Login";
import PlayList from "./playlist/Playlist";
import Play from "./play/Play";
import User from "./user/User";
import AskUser from "./askuser/AskUser";
import CreateAccount from "./createaccount/CreateAccount";
import AuthContext from "./AuthProvider";
import ShowAll from "./showall/ShowAll";
function EntityNavigation() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const handler = (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;

      const el = target.closest("[data-nav-type][data-id]");
      if (!el) return;

      const type = el.getAttribute("data-nav-type");
      const id = el.getAttribute("data-id");
      if (!type || !id) return;

      let nextPath = null;
      if (type === "song") nextPath = "/play";
      if (type === "album") nextPath = "/playlist";
      if (type === "artist") nextPath = "/user";
      if (!nextPath) return;

      // Keep query param so destination page can display which item was clicked.
      navigate(`${nextPath}?id=${encodeURIComponent(id)}`);
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [navigate]);

  return null;
}

export default function AppLayout() {
  const [currentUser,setcurrentUser]=useState();
  return (
    <AuthContext.Provider value={{currentUser,setcurrentUser}}>
    <BrowserRouter>
      <EntityNavigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/playlist" element={<PlayList />} />
        <Route path="/play" element={<Play />} />
        <Route path="/user" element={<User />} />
        <Route path="/ask_user" element={<AskUser />} />
        <Route path="/create_account" element={<CreateAccount />} />
        <Route path="/creataccount" element={<CreateAccount />} />
        <Route path="/show_all" element={<ShowAll/>}/>
      </Routes>
    </BrowserRouter>
    </AuthContext.Provider>
  );
}