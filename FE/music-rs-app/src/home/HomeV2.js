import { useContext, useEffect, useState } from "react";
import AppHeader from "../appheader/Header";
import Sidebar from "../appsidebar/Sidebar";
import AuthContext from "../AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import AddSongButton from "../components/AddSongButton";
import AddSongsToPlaylistModal from "../components/AddSongsToPlaylistModal";


export default function HomeV2() {
    const [dataTrackHomeTrend, setDataTHT] = useState([]);
    const [dataArtistHomeTrend, setDataAHT] = useState([]);
    const [dataTrackHomeRecommend, setDataTHR] = useState([]);
    const [dataArtistHomeRecommend, setDataAHR] = useState([]);
    const [dataAlbumRecommend, setDataAR] = useState([]);
    const [dataPlaylistRecommend, setDataPLR] = useState([]);
    const { currentUser, setcurrentUser } = useContext(AuthContext);
    const [isOpen,setisOpen]=useState(false)
    const [song,setSong]=useState()
    const navigate = useNavigate();
    useEffect(() => {
        if (!currentUser) {
            navigate('/login')
        }
    })
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/track/track-home-trend/5');
                const result = await response.json();
                setDataTHT(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        const fetchDataAHT = async () => {
            try {
                const response = await fetch('http://localhost:8080/artist/artist-home-trend/5');
                const result = await response.json();
                setDataAHT(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        const fetchDataTHR = async () => {
            try {
                const response = await fetch('http://localhost:8080/track/track-home-trend/5');
                const result = await response.json();
                setDataTHR(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        const fetchDataAHR = async () => {
            try {
                const response = await fetch('http://localhost:8080/artist/artist-home-trend/5');
                const result = await response.json();
                setDataAHR(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        const fetchDataAR = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/recommend/home?limit=5&maxPerArtist=3');
                const result = await response.json();
                setDataAR(result['data']);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        const fetchDataPLR = async () => {
            try {
                const response = await fetch('http://localhost:8080/playlist/playlist-home');
                const result = await response.json();
                setDataPLR(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
        fetchDataAHT();
        fetchDataTHR();
        fetchDataAHR();
        fetchDataAR();
        fetchDataPLR();
    }, []);

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            {/* <div id="app-sidebar"></div> */}
            {/* !-- Main Content -- */}
            <main className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto custom-scrollbar relative">
                {/* <header id="app-header"><AppHeader/></header> */}
                <AppHeader />
                <div className="px-8 py-6 flex flex-col gap-10">
                    {/* !-- Trending Songs Section -- */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold tracking-tight" >Bài hát thịnh hành</h2>
                            <Link className="text-sm font-bold text-slate-500 hover:underline dark:text-slate-400" to="/show_all?section=trending">Show all</Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {/* !-- Song Card 1 -- */}
                            {dataTrackHomeTrend.map((it) => (
                                <div className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer">
                                    <div className="relative aspect-square mb-4 shadow-xl">
                                        <img className="rounded-lg w-full h-full object-cover"
                                            data-alt="Abstract album cover art for Midnight City"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCw4oZwtGKxRHRrk99OCvAZIqla4Bb5yLqxsQTmbF2nlocrXKrmwzVpUXo_8csF-rVF6i2mpOx3RwtPCV5Bu_eY9W_limRvRhPR1HCcmqB-rzsx2WVuSyabrRjfMRnB10-xZ3UbnEhYYMcpHfjJeBF6kqu_VOqxvb20ZcCXJ0POYaL9Jyknst97GtIe6ztd8dBl2C5cGYOouN7YeVjyFwoem9YSVDvoBwR4aLo6s8bBGYC8Qxn6Hli5TAwO5USQshkq3cu4y1_mZJo" />
                                        <button
                                            className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center"
                                            data-nav-type="song"
                                            data-id="midnight-city"
                                            aria-label="Play song">
                                            <span className="material-symbols-outlined fill-1" >play_arrow</span>
                                        </button>
                                        <button className="absolute top-2 left-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center" data-nav-type="song" data-id="midnight-city" aria-label="Play song">
                                            <span className="material-symbols-outlined fill-1" >favorite</span>
                                        </button>
                                        <AddSongButton song={it} setSong={setSong} setisOpen={setisOpen}  />
                                    </div>
                                    <h3 className="font-bold truncate" >{it.track_name}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate" >{it.artist}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                    {/* !-- Popular Artists Section -- */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold tracking-tight" >Nghệ sỹ thịnh hành</h2>
                            <Link className="text-sm font-bold text-slate-500 hover:underline dark:text-slate-400" to="/show_all?section=artists">Show all</Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {/* !-- Artist Card 1 -- */}
                            {dataArtistHomeTrend.map((it) => (
                                <div className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer text-center">
                                    <div className="relative aspect-square mb-4 shadow-xl mx-auto w-full">
                                        <img className="rounded-full w-full h-full object-cover" data-alt="Portrait of Billie Eilish artist" src={it.images} />
                                        <button className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center" data-nav-type="artist" data-id="billie-eilish" aria-label="Open artist">
                                            <span className="material-symbols-outlined fill-1">play_arrow</span>
                                        </button>
                                    </div>
                                    <h3 className="font-bold truncate">{it.artist_name}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400" >Artist</p>
                                </div>
                            ))}
                        </div>
                    </section>
                    {/* Bài hát bạn có thể thích */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold tracking-tight">Bài hát bạn có thể thích</h2>
                            <Link className="text-sm font-bold text-slate-500 hover:underline dark:text-slate-400" to="/show_all?section=for_you">Show all</Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {dataTrackHomeRecommend.map((it) => (
                                <div className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer">
                                    <div className="relative aspect-square mb-4 shadow-xl">
                                        <img className="rounded-lg w-full h-full object-cover" data-alt="Album cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPBD59iOFxQoqwRYOeRh1KY7eX9vFqB_S3DhYFL1OVly8qRp3ltZI3pSQOKsqmpFbmzdbpiJewl77IggEGqdqD6TSoPKY_dpqsIvFd22HhsuO1HSAtdOvOdJAkFzkF0TRey42W1NWsiwnyNB6b6CRflwbiQk4uQAo8M_6pEfNUJE1hpR8ZyTvNBgLYbEvG72m4v__T_rOE2zVZv4SRVYq6WUYyIbGGJdXIKCC6igCaDEvdya-Z4WL4TAGFc3FhD4AYfmanJW6MJSM" />
                                        <button className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center" data-nav-type="song" data-id="save-your-tears" aria-label="Play song">
                                            <span className="material-symbols-outlined fill-1">play_arrow</span>
                                        </button>
                                        <AddSongButton song={it} setSong={setSong} setisOpen={setisOpen} />
                                    </div>
                                    <h3 className="font-bold truncate" >{it.track_name}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{it.artist_name}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                    {/* Nghệ sĩ bạn có thể thích */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold tracking-tight">Nghệ sỹ bạn có thể thích</h2>
                            <Link className="text-sm font-bold text-slate-500 hover:underline dark:text-slate-400" to="/show_all?section=artists_suggested">Show all</Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {dataArtistHomeRecommend.map((it) => (
                                <div className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer text-center">
                                    <div className="relative aspect-square mb-4 shadow-xl mx-auto w-full">
                                        <img className="rounded-full w-full h-full object-cover" data-alt="Artist portrait" src={it.images} />
                                        <button className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center" data-nav-type="artist" data-id="justin-bieber" aria-label="Open artist">
                                            <span className="material-symbols-outlined fill-1">play_arrow</span>
                                        </button>
                                    </div>
                                    <h3 className="font-bold truncate">{it.artist_name}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Artist</p>
                                </div>
                            ))}

                        </div>
                    </section>
                    {/* Album bạn có thể thích */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold tracking-tight">Album bạn có thể thích</h2>
                            <Link className="text-sm font-bold text-slate-500 hover:underline dark:text-slate-400" to="/show_all?section=albums">Show all</Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {dataAlbumRecommend.map((it) => (
                                <div className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer">
                                    <div className="relative aspect-square mb-4 shadow-xl">
                                        <img className="rounded-lg w-full h-full object-cover" data-alt="Album cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJGfkb4-IzZX5_o22Ki9ZkYcD25P3BvsB84O20Pe8gn3CuyQPO84eH5t_sLSdNfUNNInNprst8rYfPs5N-ZvGkM3HlipCA4EB2nAs0SgRjzryuCZu9Zf7nFXpbRpBkyZO4CR98pjwXXG_VgmrOGI1auWD8ZVH_6WcRXqT4UJwBL2Zoa05M7qNjVVUJ2PagKlEdr62Gni1x-sk7wHU2aAzpfxPOCA74omFTtFXBWavgijXgS8uIZotVO86yKaIC1190pfaSdqvzUxk" />
                                        <button className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center" data-nav-type="album" data-id="after-hours" aria-label="Open album">
                                            <span className="material-symbols-outlined fill-1">play_arrow</span>
                                        </button>
                                    </div>
                                    <h3 className="font-bold truncate">{it.album_name}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">Album • {it.artist_name}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                    {/* Playlist bạn có thể thích */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold tracking-tight" >Đề xuất cho bạn</h2>
                            <Link className="text-sm font-bold text-slate-500 hover:underline dark:text-slate-400" to="/show_all?section=recommended">Show all</Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {dataPlaylistRecommend.map((it) => (
                                <div className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer">
                                    <div className="relative aspect-square mb-4 shadow-xl">
                                        <img className="rounded-lg w-full h-full object-cover" data-alt="Recommendation cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCw4oZwtGKxRHRrk99OCvAZIqla4Bb5yLqxsQTmbF2nlocrXKrmwzVpUXo_8csF-rVF6i2mpOx3RwtPCV5Bu_eY9W_limRvRhPR1HCcmqB-rzsx2WVuSyabrRjfMRnB10-xZ3UbnEhYYMcpHfjJeBF6kqu_VOqxvb20ZcCXJ0POYaL9Jyknst97GtIe6ztd8dBl2C5cGYOouN7YeVjyFwoem9YSVDvoBwR4aLo6s8bBGYC8Qxn6Hli5TAwO5USQshkq3cu4y1_mZJo" />
                                        <button className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center" data-nav-type="album" data-id="chill-vibes" aria-label="Open playlist">
                                            <span className="material-symbols-outlined fill-1" >play_arrow</span>
                                        </button>
                                        <AddSongButton songId="chill-vibes" />
                                    </div>
                                    <h3 className="font-bold truncate">Chill Vibes</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">Playlist</p>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>
                {/* !-- Spacer for playback bar -- */}
            </main>
            {/* !-- Playback Bar -- */}
            <AddSongsToPlaylistModal open={isOpen} track={song} onClose={setisOpen}/>
        </div>
    )
}
