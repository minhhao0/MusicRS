import Sidebar from "../appsidebar/Sidebar";
import AppHeader from "../appheader/Header";
export default function Login(){
    return (<>
{/* <header id="app-header"></header> */}
<div className="flex min-h-screen w-full">
{/* !-- Left Side: Visual Branding (Hidden on mobile) -- */}
{/* <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary/10">
<div className="flex flex-col h-full w-full bg-black">
<div className="p-8">
<div className="flex items-center gap-3 mb-12">
<div className="bg-primary p-2 rounded-lg">
<span className="material-symbols-outlined text-black font-bold">music_note</span>
</div>
<h1 className="text-2xl font-bold tracking-tight text-white uppercase">MusicStream</h1>
</div>
<nav className="space-y-6">
<a className="flex items-center gap-4 text-primary bg-primary/10 px-4 py-3 rounded-lg" href="./home.html">
<span className="material-symbols-outlined">home</span>
<span className="font-semibold">Home</span>
</a>
<a className="flex items-center gap-4 text-slate-400 hover:text-white px-4 py-3 transition-colors" href="./playlist">
<span className="material-symbols-outlined">library_music</span>
<span className="font-semibold">Your Playlist</span>
</a>
<a className="flex items-center gap-4 text-slate-400 hover:text-white px-4 py-3 transition-colors" href="/ask_user">
<span className="material-symbols-outlined">tune</span>
<span className="font-semibold">Personalize</span>
</a>
</nav>
</div>
<div className="mt-auto p-8">
<div className="flex items-center gap-4 text-xs text-slate-500">
<span>© 2024 MusicStream Inc.</span>
<a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
</div>
</div>
</div>
</div> */}
<Sidebar/>
{/* !-- Right Side: Form Content -- lg:w-1/2*/}
<div className="w-full  flex flex-col bg-background-dark min-h-screen ">
{/* <div className="w-full flex justify-between items-center p-6 mb-8">
<div className="relative flex-1 max-w-md">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
<input className="w-full bg-slate-800/50 border-none rounded-full py-2 pl-12 pr-4 text-sm text-white focus:ring-1 focus:ring-primary" placeholder="Search for songs, artists..." type="text"/>
</div>
<div className="flex items-center gap-4 ml-4">
<button className="p-2 bg-slate-800/50 rounded-full text-slate-300 relative">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background-dark"></span>
</button>
<div className="w-10 h-10 rounded-full overflow-hidden border border-slate-700">
<img alt="User" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkxUG3-vM_4BzL4nymkeTsD1ukZJeUAJ6j9Bk11_xThkfR_TiNeBcn5FWCJ6pLKAR_E9VXzCk26-urm4RK-gVrCcjShyOxp0ZpNyo5OyP6JLyXh-uS4lHTk7WB4OrSVnKaxYjgEiH9rMHYSjeuDxeU0-CanIxXor3qP0XA61_2qUQhn9g4nTzUJhcOKpkqnZQZHrt0SCi3c9FuNiNsa2Y1RHytGPM02l1twT665kbsfB7k4eOOiBbaVQWgSlZMmbDz7lKJFYAdPUI"/>
</div>
</div>
</div> */}
<AppHeader/>
<div className="w-full max-w-md mx-auto ">
{/* !-- Mobile Logo -- */}
<div className="flex lg:hidden items-center gap-3 mb-10 justify-center">
<div className="bg-primary p-2 rounded-lg">
<span className="material-symbols-outlined text-background-dark font-bold">music_note</span>
</div>
<h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">MusicStream</h1>
</div>
<div className="mb-10">
<h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome back</h2>
<p className="text-slate-600 dark:text-slate-400">Enter your details to manage your account.</p>
</div>
{/* !-- Tabs -- */}
<div className="flex border-b border-white/10 mb-8">
<button className="flex-1 pb-4 text-sm font-bold border-b-2 border-primary text-primary transition-all">Sign In</button>
<a className="flex-1 pb-4 text-sm font-bold border-b-2 border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all text-center" href="/create_account">Create Account</a>
</div>
{/* !-- Social Logins -- */}
<div className="grid grid-cols-2 gap-4 mb-8">
<button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-primary/20 bg-white dark:bg-primary/5 hover:bg-slate-50 dark:hover:bg-primary/10 transition-colors">
<img alt="" className="w-5 h-5" data-alt="Google G Logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEviuhFQ8kUaovdNWuEuvB1a_ljyuYthsJHkao2voCrWSxyi-frvAFNPA7kFasZqoeCQFreJpeRsYE7FshXVArKrEcf7H81WUCH4GLWL7Pis9MxDWx_F_bYW6SYD0LgGPHTvM_KwQtrbvIVupG4v9TkjvO7nonqhAENpFVt6bG87oz8OGwuCp3FSYZCaXhyzV5NYHxnFt7xjsgAGNqLfrtQZNy63n6ms9RzG-FLOtqEZQ8NEw2H7ak8D06nG89apVYuEliUMPiqQE"/>
<span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Google</span>
</button>
<button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-primary/20 bg-white dark:bg-primary/5 hover:bg-slate-50 dark:hover:bg-primary/10 transition-colors">
<span className="material-symbols-outlined text-xl text-slate-900 dark:text-white">ios</span>
<span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Apple</span>
</button>
</div>
<div className="relative flex items-center justify-center mb-8">
<div className="w-full border-t border-slate-200 dark:border-primary/10 p-4"></div>
<span className="absolute bg-background-light dark:bg-background-dark px-4 text-xs font-semibold text-slate-400 uppercase tracking-widest ">or continue with email</span>
</div>
{/* !-- Login Form -- */}
<form className="space-y-5">
<div>
<label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email address</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
<input className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/5 bg-white/5 focus:ring-1 focus:ring-primary focus:border-transparent outline-none transition-all text-white placeholder:text-slate-500" placeholder="name@example.com" type="email"/>
</div>
</div>
<div>
<div className="flex justify-between items-center mb-2">
<label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
<a className="text-xs font-bold text-primary hover:underline" href="#">Forgot password?</a>
</div>
<div className="relative">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
<input className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/5 bg-white/5 focus:ring-1 focus:ring-primary focus:border-transparent outline-none transition-all text-white placeholder:text-slate-500" placeholder="••••••••" type="password"/>
<button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" type="button">
<span className="material-symbols-outlined text-xl">visibility</span>
</button>
</div>
</div>
<div className="flex items-center gap-2 py-2">
<input className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300 dark:border-primary/30 bg-white dark:bg-transparent" id="remember" type="checkbox"/>
<label className="text-sm text-slate-600 dark:text-slate-400" for="remember">Keep me logged in</label>
</div>
<button className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-4 rounded-xl shadow-lg shadow-primary/10 transition-all flex items-center justify-center gap-2" type="submit">
                        Sign In
                        <span className="material-symbols-outlined text-xl">arrow_forward</span>
</button>
</form>
<div className="mt-10 text-center">
<p className="text-slate-600 dark:text-slate-400 text-sm">
                        Don't have an account? 
                        <a className="text-primary font-bold hover:underline ml-1" href="/create_account">Create an account for free</a>
</p>
</div>
</div>
{/* !-- Help Button (Float or Footer style) -- */}
</div>
</div>
    </>)
}