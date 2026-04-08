import { useContext, useEffect } from "react";
import AppHeader from "../appheader/Header";
import Sidebar from "../appsidebar/Sidebar";
import Playing from "./SongPlay";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../AuthProvider";

export default function PlayList(){
    const location = useLocation();
    const id = new URLSearchParams(location.search).get("id");
    const displayId = id ? id.replace(/-/g, " ") : null;
    const {currentUser,setcurrentUser}=useContext(AuthContext);
    const navigate=useNavigate();
    useEffect(()=>{
        if(!currentUser){
            navigate('/login');
        }
    })
    return (
    <>
<div className="flex h-screen overflow-hidden">
{/* !-- SideNavBar -- */}
{/* <div id="app-sidebar"></div> */}
<Sidebar/>
{/* !-- Main Content Area -- */}
<main className="flex-1 flex flex-col overflow-hidden relative bg-background-light dark:bg-background-dark">
{/* <!-- Header --> */}
{/* <header id="app-header"></header> */}
<AppHeader/>
{/* <!-- Content --> */}
<div className="flex-1 overflow-y-auto custom-scrollbar p-8">
{/* <!-- Playlists Grid --> */}
<section className="mb-10">
<div className="flex items-center justify-between mb-6">
<h2 className="text-2xl font-bold tracking-tight">Bài hát thịnh hành</h2>
<a className="text-sm font-bold text-primary hover:underline" href="#">Show all</a>
</div>
{displayId && <p className="text-sm text-slate-400 mb-6">Selected album: {displayId}</p>}
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
{/* <!-- Liked Card --> */}
<div className="group relative bg-card-bg p-4 rounded-xl hover:bg-white/5 transition-all cursor-pointer">
<div className="aspect-square rounded-lg bg-gradient-to-br from-indigo-600 to-primary mb-4 flex items-center justify-center shadow-lg group-hover:shadow-primary/20">
<span className="material-symbols-outlined text-white text-5xl">favorite</span>
</div>
<h3 className="font-bold text-base mb-1 text-white">Liked Songs</h3>
<p className="text-slate-400 text-xs">245 songs</p>
<button className="absolute bottom-16 right-6 size-12 rounded-full bg-primary text-background-dark shadow-xl flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all" type="button" data-nav-type="song" data-id="liked-songs" aria-label="Play song">
<span className="material-symbols-outlined fill-1 font-bold">play_arrow</span>
</button>
</div>
{/* <!-- Card 1 --> */}
<div className="group relative bg-card-bg p-4 rounded-xl hover:bg-white/5 transition-all cursor-pointer">
<img className="aspect-square rounded-lg mb-4 object-cover shadow-lg group-hover:shadow-black/40" data-alt="Abstract neon dance music album cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOrhOvYp8AZ1Y5VA63fFXI0OdXDc_e_NHA5sVdpcFdYeIpQ-0f9kjbih3XHg3vVYJi6ZOaC7oy0ktJNIQ13AWH28YnecZ2LivaO8ZPAZLjcb4rPqFd2i1qqGtfGBCFmWafKaojaCc0YyO5kF6GYNfV2cTFUGao2erwQ4tD8bnoiIKDItCflEvyCblqv_224cdtD1P-RJNREJAeMgD8qLIoj1EoIip_iS6HEFNJm-5oqstzdjkZ7LHXocubHPbA2DtePxiM_D2Axg0"/>
<h3 className="font-bold text-base mb-1 text-white">Daily Mix 1</h3>
<p className="text-slate-400 text-xs">Made for you</p>
<button className="absolute bottom-16 right-6 size-12 rounded-full bg-primary text-background-dark shadow-xl flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all" type="button" data-nav-type="song" data-id="daily-mix-1" aria-label="Play song">
<span className="material-symbols-outlined fill-1 font-bold">play_arrow</span>
</button>
</div>
{/* <!-- Card 2 --> */}
<div className="group relative bg-card-bg p-4 rounded-xl hover:bg-white/5 transition-all cursor-pointer">
<img className="aspect-square rounded-lg mb-4 object-cover shadow-lg group-hover:shadow-black/40" data-alt="Calm aesthetic ocean view sunset background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQMEHJbE_gCqEUwGL8OWyz4P9W_CJMf2R80RrtzO83psVkDH2ZvQSfH7q8yGuECFnIbUdHV5aw9u2rcMxOlq_bw40znXVW2cDelSsGrczRfRAnZTY0RPcJjflW5MpKAnMjKqgdWyLD_1SAmshhA9QVtPDP60pYSd-o0Eog0nAp26cBCnTyaM0jpWODnhplxW9TYzAkveqamlMRb0tMGmORTjsbMjgBQlvni1zTnXgCIlv6taGh56YuEfMy54JU6wEIXOBensmtQjw"/>
<h3 className="font-bold text-base mb-1 text-white">Chill Vibes</h3>
<p className="text-slate-400 text-xs">User Playlist</p>
<button className="absolute bottom-16 right-6 size-12 rounded-full bg-primary text-background-dark shadow-xl flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all" type="button" data-nav-type="song" data-id="chill-vibes" aria-label="Play song">
<span className="material-symbols-outlined fill-1 font-bold">play_arrow</span>
</button>
</div>
{/* <!-- Card 3 --> */}
<div className="group relative bg-card-bg p-4 rounded-xl hover:bg-white/5 transition-all cursor-pointer">
<img className="aspect-square rounded-lg mb-4 object-cover shadow-lg group-hover:shadow-black/40" data-alt="Vibrant night city street light trails" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxvEBt7hZijoJL70wcLBFRnGy4TcgyrUG-KyvARARAn8NjlNdjo7LG0TyBS0hXQhS780S7CfH0gBzMMt7vCq35BwMCWVgx49bcKYgJYhq45jhH7GMMHDlKwtnVZs-zOeC56J6AnVLDhVEkn1wQQ-mSM2r2VdIUCm_IZOYMuUkGOFGATmyPfsUkueC4Z8s9DMG7kRddncDKFWx-jdH5IKGVvN2GdvjmKR1QRs2VWW4_vvmBYRnli-_fPoE1NZuBBevaXzbmJai7T-M"/>
<h3 className="font-bold text-base mb-1 text-white">Night Drive</h3>
<p className="text-slate-400 text-xs">User Playlist</p>
<button className="absolute bottom-16 right-6 size-12 rounded-full bg-primary text-background-dark shadow-xl flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all" type="button" data-nav-type="song" data-id="night-drive" aria-label="Play song">
<span className="material-symbols-outlined fill-1 font-bold">play_arrow</span>
</button>
</div>
{/* <!-- Card 4 --> */}
<div className="group relative bg-card-bg p-4 rounded-xl hover:bg-white/5 transition-all cursor-pointer">
<img className="aspect-square rounded-lg mb-4 object-cover shadow-lg group-hover:shadow-black/40" data-alt="Concert stage with colorful stage lights" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvTVOj_hfMn3exYepIsAvYUGYqOPJtpXv2DABKRuDOnigraOdmGOIM0ADjGCUY_S4pzCzIHQ2JNZ860yraNYlQRq5FSaAoHzuUG4KSmwN9caf0RuUBXbqCSGmzz-W-gdJOJz840y1tvHznLkED5F0GwOVIv9LYW4D7Y_uLVGdwjOdIBHJ8AGRbNQrxjK_dR9_gXU0GGPdzc64ApdoSJVhLWEElI8QrfaRmE4BkpYeX3qxVR_sCz7fhweQM0bdQyakOmwzy_xN-3dM"/>
<h3 className="font-bold text-base mb-1 text-white">Top Hits 2024</h3>
<p className="text-slate-400 text-xs">MusicStream Curated</p>
<button className="absolute bottom-16 right-6 size-12 rounded-full bg-primary text-background-dark shadow-xl flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all" type="button" data-nav-type="song" data-id="top-hits-2024" aria-label="Play song">
<span className="material-symbols-outlined fill-1 font-bold">play_arrow</span>
</button>
</div>
</div>
</section>
{/* <!-- Selected Playlist Table --> */}
<section>
<div className="flex items-end gap-6 mb-8">
<div className="size-48 rounded-lg shadow-2xl bg-gradient-to-br from-emerald-500 to-primary flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-white text-7xl">favorite</span>
</div>
<div className="flex flex-col gap-2">
<span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-primary/60">Public Playlist</span>
<h2 className="text-5xl lg:text-7xl font-black tracking-tight">Liked Songs</h2>
<div className="flex items-center gap-2 mt-4 text-sm font-medium">
<span className="font-bold">Alex Rivera</span>
<span className="size-1 rounded-full bg-slate-500"></span>
<span className="text-slate-500">245 songs, 12 hr 45 min</span>
</div>
</div>
</div>
<div className="bg-background-light dark:bg-background-dark/50 rounded-xl overflow-hidden border border-primary/5">
<table className="w-full text-left border-collapse">
<thead>
<tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-white/5">
<th className="px-6 py-4 font-semibold w-12 text-center">#</th>
<th className="px-4 py-4 font-semibold">Title</th>
<th className="px-4 py-4 font-semibold">Album</th>
<th className="px-4 py-4 font-semibold text-right pr-12">
<span className="material-symbols-outlined text-base">schedule</span>
</th>
</tr>
</thead>
<tbody className="divide-y divide-primary/5">
<tr className="group hover:bg-white/5 transition-colors cursor-pointer">
<td className="px-6 py-3 text-center text-sm text-slate-500 group-hover:text-primary">
<button className="hidden group-hover:inline-flex items-center justify-center size-8 rounded-full bg-primary text-background-dark" type="button" data-nav-type="song" data-id="midnight-city" aria-label="Play song">
<span className="material-symbols-outlined fill-1 text-lg">play_arrow</span>
</button>
<span className="group-hover:hidden">1</span>
</td>
<td className="px-4 py-3">
<div className="flex items-center gap-3">
<div className="size-10 rounded bg-slate-200 dark:bg-slate-800 shrink-0 overflow-hidden">
<img className="object-cover size-full" data-alt="Album art featuring modern typography" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWlFzt9uTD3cCm8ZL33IehSjMNsPkks3EeJZ6Z_-RCli9I4irYVQbAYiYgWlI5Xz1GFniMyOC5QD645CNoXykotomS1SyH9BbimpCfzcAFv0EQCsPY25ZZeu_ckwuiRof6QMlk5ob5THxWWKEGta9lCoAYsoTfV4S3GMDqdnukGN9OKprJTs8AQY46v3IHre7ddx3EMonvRarDVhTKw-47SNQDMJ3W73s8LBVrvA19_r0PmCgd1pI-5PIREj9PO1dsWMwAmgmAXDs"/>
</div>
<div className="flex flex-col min-w-0">
<span className="text-sm font-bold truncate group-hover:text-primary">Midnight City</span>
<span className="text-xs text-slate-500 dark:text-slate-400">M83</span>
</div>
</div>
</td>
<td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">Hurry Up, We're Dreaming</td>
<td className="px-4 py-3 text-sm text-slate-500 text-right pr-12">4:03</td>
</tr>
<tr className="group hover:bg-white/5 transition-colors cursor-pointer">
<td className="px-6 py-3 text-center text-sm text-slate-500 group-hover:text-primary">
<button className="hidden group-hover:inline-flex items-center justify-center size-8 rounded-full bg-primary text-background-dark" type="button" data-nav-type="song" data-id="blinding-lights" aria-label="Play song">
<span className="material-symbols-outlined fill-1 text-lg">play_arrow</span>
</button>
<span className="group-hover:hidden">2</span>
</td>
<td className="px-4 py-3">
<div className="flex items-center gap-3">
<div className="size-10 rounded bg-slate-200 dark:bg-slate-800 shrink-0 overflow-hidden">
<img className="object-cover size-full" data-alt="Minimalist abstract album art design" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbMdEZaK51XyOgnds4gB3fAUXA6ewdRLJczOU7vfEp92Tqd5Zw_48Hf7o9QejYJgLT1Qq_0ww4G50ZcQWqfClr7hhIkDg7epBWR3HypoVozguFEjkhgpkYeRgZN87T_WxIDwLLY2ZVBqOsgAcOkdvwWS5Kmt1HIVi_ixHqdb6riVHuOHkteQN8lcFa7OCAhvSTu6RzrmfQC_yHdZNwgR3_c9M46RjxJUklcdoMZEppcSs1ulABgxkEVgpNdtFDcgatT6vnmyTljQc"/>
</div>
<div className="flex flex-col min-w-0">
<span className="text-sm font-bold truncate group-hover:text-primary">Blinding Lights</span>
<span className="text-xs text-slate-500 dark:text-slate-400">The Weeknd</span>
</div>
</div>
</td>
<td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">After Hours</td>
<td className="px-4 py-3 text-sm text-slate-500 text-right pr-12">3:20</td>
</tr>
<tr className="group hover:bg-white/5 transition-colors cursor-pointer">
<td className="px-6 py-3 text-center text-sm text-slate-500 group-hover:text-primary">
<button className="hidden group-hover:inline-flex items-center justify-center size-8 rounded-full bg-primary text-background-dark" type="button" data-nav-type="song" data-id="nightcall" aria-label="Play song">
<span className="material-symbols-outlined fill-1 text-lg">play_arrow</span>
</button>
<span className="group-hover:hidden">3</span>
</td>
<td className="px-4 py-3">
<div className="flex items-center gap-3">
<div className="size-10 rounded bg-slate-200 dark:bg-slate-800 shrink-0 overflow-hidden">
<img className="object-cover size-full" data-alt="Retro synthwave style album cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnqMI5HYf60qKCO98pDnf8S12f--F__MUYvqFtXd-B5QUrXZOOUmpueKht2TxjlXQrtJXee80i3UzMRk3pabvFbK0YJDypCaWyZVhSaUAl3ad4TAkI2vvbMAPvhEF7s-DfA9vWWXH7IOUDFilMwhk5DCQdlgfIIIokQl0znkwgH3BI9eXnwa5Pn2ZLnd3CxYavTghdPAUTzWUO9BIjfl_wJe0wBuJvPHa4PSJoOBFi4w2ikurtWSbWELI0y1hlAv2d-4K_a03Qdkc"/>
</div>
<div className="flex flex-col min-w-0">
<span className="text-sm font-bold truncate group-hover:text-primary">Nightcall</span>
<span className="text-xs text-slate-500 dark:text-slate-400">Kavinsky</span>
</div>
</div>
</td>
<td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">OutRun</td>
<td className="px-4 py-3 text-sm text-slate-500 text-right pr-12">4:18</td>
</tr>
<tr className="group hover:bg-white/5 transition-colors cursor-pointer">
<td className="px-6 py-3 text-center text-sm text-slate-500 group-hover:text-primary">
<button className="hidden group-hover:inline-flex items-center justify-center size-8 rounded-full bg-primary text-background-dark" type="button" data-nav-type="song" data-id="starboy" aria-label="Play song">
<span className="material-symbols-outlined fill-1 text-lg">play_arrow</span>
</button>
<span className="group-hover:hidden">4</span>
</td>
<td className="px-4 py-3">
<div className="flex items-center gap-3">
<div className="size-10 rounded bg-slate-200 dark:bg-slate-800 shrink-0 overflow-hidden">
<img className="object-cover size-full" data-alt="Dynamic energetic concert crowd silhouette" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtc0d-PnC7qKSPWas0zhlzLSzRb3UHGCP0AKB9DK4VZvq-3jS_m4o9E-7h66aETbdlmww-jYkzEUPvRrggChKrF-RZMrj76thjo1sKVQjMdYcHq1xkN2B9HQELDe4Ma6QRAnlSp1gSKM_ysSkae3WbEw47vPnjIO0tu5QbE6sHxRMbg3Mp_OWxSmLkVDvYb_5iHwUXxlOWR4BprIJZ4x_u1GMFxpZMA1Fpsv8oeWJBtjqBp263DKMBtbpzmhPQp9CPc_RT4oJX35g"/>
</div>
<div className="flex flex-col min-w-0">
<span className="text-sm font-bold truncate group-hover:text-primary">Starboy</span>
<span className="text-xs text-slate-500 dark:text-slate-400">The Weeknd ft. Daft Punk</span>
</div>
</div>
</td>
<td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">Starboy</td>
<td className="px-4 py-3 text-sm text-slate-500 text-right pr-12">3:50</td>
</tr>
</tbody>
</table>
</div>
</section>
</div>
</main>
{/* <!-- Right Side Player Bar (Optional but common in such UIs) --> */}
<Playing/>
</div>
    </>)
}