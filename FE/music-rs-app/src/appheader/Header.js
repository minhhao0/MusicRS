export default function AppHeader(){
    return(
    <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="flex gap-4"></div>

      <div className="flex items-center gap-4">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            className="bg-slate-200 dark:bg-white/10 border-none rounded-full pl-10 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-slate-500"
            placeholder="Search for songs, artists..."
            type="text"
          />
        </div>

        <button className="bg-slate-200 dark:bg-white/10 rounded-full p-2 hover:bg-slate-300 dark:hover:bg-white/20 transition-colors relative" type="button">
          <span className="material-symbols-outlined text-xl">notifications</span>
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-primary rounded-full"></span>
        </button>

        <a className="h-10 w-10 rounded-full bg-slate-300 dark:bg-slate-700 overflow-hidden border-2 border-transparent hover:border-white/20 transition-all" href="${pageBase}user.html" aria-label="Profile">
          <img
            className="w-full h-full object-cover"
            alt="User avatar"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwNZwafGFIvZGq75OE7sH44FwCvQWoHzARVAQtVvomTZAx5dt0Tu_-Zmwohn0KudjBKvfDeBdsEToDz2VFLn0Sq-CPDSPQWgGe7Pd4dXJ0NUhQFPicBOnUhFkoHzRZC1Bt-czWZaQX-3gTItHX-JUxOPu3-O16joAKbvOJ1nkdXn451di1o_G0micm8oaJDU6ZWTdPH1V916A5iuGXdPn6cdpQqaoBCxPRIEKwgb-o3EBt4Ypa5rkhYzzvL9hNEpCMmFrLIaojpH4"
          />
        </a>
      </div>
    </header>)
}