import  NavLink from "./NavLink";
export default function Sidebar(){
     const links = [
    { key: "home", href: `/`, icon: "home", label: "Home" },
    {
      key: "playlist",
      href: `/playlist`,
      icon: "library_music",
      label: "Your Playlist",
    },
    {
      key: "play",
      href: `/play`,
      icon: "play_circle",
      label: "Now Playing",
    },
    {
      key: "user",
      href: `/user`,
      icon: "account_circle",
      label: "Profile",
    },
    {
      key: "ask_user",
      href: `/ask_user`,
      icon: "tune",
      label: "Personalize",
    },
  ];
    return (<>
    <aside className="w-64 flex-shrink-0 flex flex-col bg-slate-100 dark:bg-black p-4 gap-6">
      <a className="flex items-center gap-3 px-2" href="/" aria-label="Go to home">
        <div className="bg-primary rounded-full p-1 flex items-center justify-center">
          <span className="material-symbols-outlined text-black text-2xl">music_note</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight">MusicStream</h1>
      </a>
      <nav className="flex flex-col gap-2">
        {links.map((it)=>(<NavLink href={it.href}  icon={it.icon} label={it.label} key={it.key}/>))}
      </nav>
      <div className="flex flex-col gap-2 mt-4">
        <a
          className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          href="/login"
          data-nav-key="login"
        >
          <span className="material-symbols-outlined bg-gradient-to-br from-indigo-600 to-blue-300 p-1 rounded-sm text-sm text-white">login</span>
          <span className="font-semibold text-sm">Login</span>
        </a>
      </div>
    </aside>
    </>)
}