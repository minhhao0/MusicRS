import { useMemo } from "react";
import { Link } from "react-router-dom";
import AppHeader from "../appheader/Header";
import Sidebar from "../appsidebar/Sidebar";
import { usePersonalize } from "../context/PersonalizeContext";
import { ARTISTS, GENRES, SONGS } from "../data/catalog";

export default function AskUser(){
    const {
      selectedGenres,
      selectedArtists,
      selectedSongs,
      toggleGenre,
      toggleArtist,
      toggleSong,
    } = usePersonalize();

    const canSave = useMemo(() => {
      return selectedGenres.size >= 2 && selectedArtists.size >= 2 && selectedSongs.size >= 2;
    }, [selectedGenres, selectedArtists, selectedSongs]);

    const genreOptions = useMemo(
      () =>
        Object.keys(GENRES)
          .slice(0, 6)
          .map((key) => ({ key, label: GENRES[key] })),
      []
    );

    const artistOptions = useMemo(
      () =>
        Object.entries(ARTISTS)
          .slice(0, 5)
          .map(([key, a]) => ({ key, label: a.name, img: a.cover })),
      []
    );

    const songOptions = useMemo(
      () =>
        Object.entries(SONGS)
          .filter(([, s]) => s.cover)
          .slice(0, 3)
          .map(([key, s]) => ({
            key,
            title: s.title,
            sub: s.artist,
            img: s.cover,
          })),
      []
    );

    return (
    <>
<div className="flex h-screen overflow-hidden">
{/* <div id="app-sidebar"></div> */}
<Sidebar/>
<main className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto custom-scrollbar relative">
{/* <header id="app-header"></header> */}
<AppHeader/>
<div className="max-w-5xl mx-auto px-4 pb-32">
    {/* <!-- Progress Stepper --> */}
<div className="py-8">
<h2 className="text-3xl font-extrabold mb-2">Build your vibe</h2>
<p className="text-slate-500 dark:text-slate-400">Select at least 2 items from each category to customize your feed.</p>
</div>
{/* <!-- 1. Favorite Genres --> */}
<section className="mb-12">
<div className="flex items-center justify-between mb-4">
<h3 className="text-xl font-bold">Favorite Genres</h3>
<Link to="/show_all?section=personalize_genres" className="text-primary text-sm font-semibold hover:underline">Show all</Link>
</div>
<div className="flex flex-wrap gap-3">
{genreOptions.map((opt) => {
  const isSelected = selectedGenres.has(opt.key);
  return (
    <button
      key={opt.key}
      type="button"
      onClick={() => toggleGenre(opt.key)}
      className={
        isSelected
          ? "px-6 py-2 rounded-full bg-primary text-background-dark font-bold text-sm shadow-lg shadow-primary/20 flex items-center gap-2"
          : "px-6 py-2 rounded-full bg-slate-200 dark:bg-primary/10 border-2 border-transparent hover:border-primary/50 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all"
      }
    >
      {isSelected && <span className="material-symbols-outlined text-sm font-bold">check</span>}
      {opt.label}
    </button>
  );
})}
</div>
</section>
{/* <!-- 2. Favorite Artists --> */}
<section className="mb-12">
<div className="flex items-center justify-between mb-4">
<h3 className="text-xl font-bold">Who are your favorite artists?</h3>
<Link to="/show_all?section=personalize_artists" className="text-primary text-sm font-semibold hover:underline">Show all</Link>
</div>
<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 sm:gap-6">
{artistOptions.map((opt) => {
  const isSelected = selectedArtists.has(opt.key);
  return (
    <button
      key={opt.key}
      type="button"
      onClick={() => toggleArtist(opt.key)}
      className="group flex flex-col items-center gap-2"
    >
      <div
        className={
          isSelected
            ? "relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-primary shadow-lg shadow-primary/10"
            : "relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-transparent hover:border-primary/30 transition-all"
        }
      >
        <img
          className={isSelected ? "w-full h-full object-cover" : "w-full h-full object-cover grayscale group-hover:grayscale-0"}
          src={opt.img}
          alt={opt.label}
        />
        {isSelected && (
          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
            <div className="bg-primary text-background-dark rounded-full p-1.5">
              <span className="material-symbols-outlined font-bold text-lg">check</span>
            </div>
          </div>
        )}
      </div>
      <span
        className={
          isSelected
            ? "font-bold text-xs sm:text-sm text-primary"
            : "font-bold text-xs sm:text-sm text-slate-400 group-hover:text-primary transition-colors"
        }
      >
        {opt.label}
      </span>
    </button>
  );
})}
</div>
</section>
{/* <!-- 3. Songs You Love --> */}
<section className="mb-10">
<div className="flex items-center justify-between mb-4">
<h3 className="text-xl font-bold">Songs you love</h3>
<Link to="/show_all?section=personalize_songs" className="text-primary text-sm font-semibold hover:underline">Show all</Link>
</div>
<div className="space-y-2">
  {songOptions.map((opt) => {
    const isSelected = selectedSongs.has(opt.key);
    return (
      <button
        key={opt.key}
        type="button"
        onClick={() => toggleSong(opt.key)}
        className={
          isSelected
            ? "flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/30 group cursor-pointer w-full"
            : "flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent transition-all group cursor-pointer w-full"
        }
      >
        <div className="flex items-center gap-4">
          <div className="relative size-12 rounded-lg overflow-hidden">
            <img className="w-full h-full object-cover" src={opt.img} alt={opt.title} />
          </div>
          <div>
            <p className={isSelected ? "font-bold text-primary" : "font-bold group-hover:text-primary transition-colors"}>
              {opt.title}
            </p>
            <p className="text-xs text-slate-500">{opt.sub}</p>
          </div>
        </div>

        {isSelected ? (
          <div className="bg-primary text-background-dark rounded-full p-1">
            <span className="material-symbols-outlined font-bold text-sm">check</span>
          </div>
        ) : (
          <span className="material-symbols-outlined text-slate-600 group-hover:text-primary">add_circle</span>
        )}
      </button>
    );
  })}
</div>
</section></div>
</main>
{/* <!-- Fixed Bottom Action Bar --> */}
<footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark dark:to-transparent pt-12 pb-8 px-4 flex justify-center pointer-events-none">
<div className="max-w-md w-full pointer-events-auto">
<button
  type="button"
  disabled={!canSave}
  onClick={() => {
    if (!canSave) return;
    // Chỗ này có thể gọi API/đẩy user tới trang tiếp theo.
    // Hiện tại chỉ cần đảm bảo UI cho phép chọn/tắt và bật Save đúng điều kiện.
    // eslint-disable-next-line no-console
    console.log({
      genres: Array.from(selectedGenres),
      artists: Array.from(selectedArtists),
      songs: Array.from(selectedSongs),
    });
  }}
  className={
    canSave
      ? "w-full bg-primary text-background-dark py-4 rounded-full font-extrabold text-lg shadow-[0_0_40px_-10px_rgba(29,185,84,0.6)] hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
      : "w-full bg-primary text-background-dark py-4 rounded-full font-extrabold text-lg opacity-50 cursor-not-allowed shadow-[0_0_40px_-10px_rgba(29,185,84,0.6)] flex items-center justify-center gap-2"
  }
>
  Save
  <br />
  <span className="material-symbols-outlined font-bold">arrow_forward</span>
</button>
</div>
</footer>
</div>
    </>)
}import { useMemo, useState } from "react";
import AppHeader from "../appheader/Header";
import Sidebar from "../appsidebar/Sidebar";

export default function AskUser(){
    const [selectedGenres, setSelectedGenres] = useState(() => new Set(["all", "hip_hop"]));
    const [selectedArtists, setSelectedArtists] = useState(() => new Set(["arctic_monkeys", "lana_del_rey"]));
    const [selectedSongs, setSelectedSongs] = useState(() => new Set(["midnight_city"]));

    const toggleInSet = (setSetter, key) => {
      setSetter((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        return next;
      });
    };

    const canSave = useMemo(() => {
      return selectedGenres.size >= 2 && selectedArtists.size >= 2 && selectedSongs.size >= 2;
    }, [selectedGenres, selectedArtists, selectedSongs]);

    const genreOptions = useMemo(
      () => [
        { key: "all", label: "All Genres" },
        { key: "hip_hop", label: "Hip Hop" },
        { key: "indie_pop", label: "Indie Pop" },
        { key: "techno", label: "Techno" },
        { key: "jazz_fusion", label: "Jazz Fusion" },
        { key: "modern_rock", label: "Modern Rock" },
      ],
      []
    );

    const artistOptions = useMemo(
      () => [
        {
          key: "arctic_monkeys",
          label: "Arctic Monkeys",
          img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHe_Agg4EhbW_nuU3Wi0x3oAO9T7UodyJ51yBMpCTndLPbBjrCo_9TXVt6_9PPkv_6enT5Hpor3-OL0Kh7fxPEAXqeYuKPpIfaiZjBE9ItY7nRr91P2vD5EojGyVyHMlZvAO7oAtgUBdIlOoblw5d7nlSUG1KdMftE0mnVZe0F6cP-u3Arue1MyKD1cc1FOJglhfUx461JahnKHDv7Pa7X2WiqdkMN6OLYSu54rygrRYEDHi57Lw0cGjlBodEiv_3M-s8ujt1sPU8",
        },
        {
          key: "the_weeknd",
          label: "The Weeknd",
          img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCPgq9zu2cstmVFwSsCcQRA3s6S_G3d-OPTnHJwX3iN8bcsR0PeHJ49kcfsY2DQCZZOBNFS0Qs0Ezx1sCQukEvLPowlGyVKFOT2STrYM2jgRwusQ7t7qpwdm6O8ZZ3bO_ghSyxnrqJcO3ucRLBGZxUR6v083lHFifvv9M8W3mabZ5gRYVhNpy-wmJKNK8WThXIoMkRDmjUYS1zJs7Y3zVDTy08Q1mv3viU2JpGdCd_NETRZbaMtBdToRs66NHq6uPv4vmpPevzyG68",
        },
        {
          key: "lana_del_rey",
          label: "Lana Del Rey",
          img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCd9Lag7U2_vXodOKUTiCxx4B9f-clDmYeicvCcczDJRvmVrJFkwHLUMxFjY76jtqfTUdQWn5jvMxG93FFfJFIyzibNa3C4rChb1wiG8QIhjuVVwOyeZ0SLw3_aOXjz4b8G54FYS9HHfrpWIBUIgEPLj6Oj9o_h4sCvXTQuqPINT3GbPjqcu_WHsLjDMY7iaPxopFRsMfwJFDMtyUeyVwLg08NouHcmgRJ6Imx3BuXzCmEGylnjNxoT1gVsVvGRukp6W6Q_-aKMmIA",
        },
        {
          key: "glass_animals",
          label: "Glass Animals",
          img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsFLUHKyV8l44CxSyiVrLPDpxiwHqXRI54Z8WYSQOsEWxiHEQ1fQdi5_fdbh9Mm6mal0FX_IbCisUHpbRat-FxkBydctt4yO9acZdMtSe2AwE7ujX0hOd9p3wW_PQqHDwJwAyACDTy4DQgBs_mISEunK8Jko-fGzzyxKvcyx8cYZBR5HPx-VxvlNqbUTadrGiy4Hsi37lXbKsfOpUmtS5plHPKzdRLxrb7avWOealI-oj6dTMB_Zg75rCkxplM00AuxPNxtdGSEl0",
        },
        {
          key: "kendrick_lamar",
          label: "Kendrick Lamar",
          img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbD8UipFW5Jg5UmOFQzmalnGaj_t_wSQgtLmB72ak-V_5Myxmv4_8I-j_91AP5DwUU_8BoZkjvZueDcSkF9nCni3Fxc6ACnbFsp7Dd-gCJz1W1Oo2e8G8K--ulY0rBmBUg_qRIr9OVhef1eIHWcIxH1oaNZbudMr9BeK3Mkcr_XgNI85GnTXXd-NoCciq7KwJn6mEpnyHPbT3T-uY6f_kaoqLHGUkLfeSVCT4OD4A_03TNtySnFc4NBiV9al8EsDizo-L5RbX8roI",
        },
      ],
      []
    );

    const songOptions = useMemo(
      () => [
        {
          key: "midnight_city",
          title: "Midnight City",
          sub: "M83 • Hurry Up, We're Dreaming",
          img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqEX5ICG28JVjR4kLN6gjqc72rBQ1QyZOczRF3dvEMRZKhw8cgWOccNOHiV1Ej0nqEo3SHNztsT0QzNKNynq1joHNReUyUOhnYoZ8QD_AJUEHpu5bK5-922usQCT6TWezFLW14vjyGpH5vItRzm2yW_1DLNI9mdGuIVolDqpt5Tupr3dhT4mkcDOjy9EHetuSvMiCqAdW5x36rDyDEWCVwy5a8asOn1Uw1TN28DiqNV0dlTO85Iwb36EuafyfOYn3iQCT5Ot5XxnI",
        },
        {
          key: "harder_better_faster_stronger",
          title: "Harder, Better, Faster, Stronger",
          sub: "Daft Punk • Discovery",
          img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaVNfLjpmDjzUvPJL0mwt4ii4g0Ts1U5LqAkYdtfvhLnPkKyuK3YYxMs5VEecXpZ28VOKe8CgTW1b1zgoTqmy--t9D98zSEHldpchQKQ3Jk7dx83WPhdSaeP2RJouutu0Uf3nlikWYmJkO5Fxb9O_xY4kygkyXGFlYWcrF7u7Xp8ToniHk-KrZU51GfQ9T16NSxbMtVNGTcXEOvI2qaCCWaKNsO5q14SYAK-vQu8by-8pYMjXADYuFW_FBDfWtYqPpWuLjW9R7isg",
        },
        {
          key: "creep",
          title: "Creep",
          sub: "Radiohead • Pablo Honey",
          img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlWTqUytnE-LozY_RRys5c1y1JA4rHcLZtwgLcnvmjtCbL9VEfvXKwj0KW2sMbiTsTZMbECFq7iZ4hTjZUYHflYUGNqWuxluuTYiMHA74gFKGC8JfbJxhOahxJ8pIWKxG1WS6Vk6_X1LbhxA5pIsuJbPfR_Pwqp8Ckke_JTn2NfdY8KJ9HFaGSIoSvViPSWlcmmffChMsT7Qkh9VF98GnyoO3xDHHJwU2475VSzQwyGvcjgWYDMXEweOWVynPHgtsUq_gPha2BBRU",
        },
      ],
      []
    );

    // Cập nhật: file UI cũ có 3 bài trong "Songs you love" (2 bài chưa rõ ràng, 1 bài đang hiển thị check).
    // Để đảm bảo người dùng "chọn giữa các lựa chọn", mình cho phép toggle chọn cả 3 bài.

    return (
    <>
<div className="flex h-screen overflow-hidden">
{/* <div id="app-sidebar"></div> */}
<Sidebar/>
<main className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto custom-scrollbar relative">
{/* <header id="app-header"></header> */}
<AppHeader/>
<div className="max-w-5xl mx-auto px-4 pb-32">
    {/* <!-- Progress Stepper --> */}
<div className="py-8">
<h2 className="text-3xl font-extrabold mb-2">Build your vibe</h2>
<p className="text-slate-500 dark:text-slate-400">Select at least 2 items from each category to customize your feed.</p>
</div>
{/* <!-- 1. Favorite Genres --> */}
<section className="mb-12">
<div className="flex items-center justify-between mb-4">
<h3 className="text-xl font-bold">Favorite Genres</h3>
<button className="text-primary text-sm font-semibold hover:underline">View all</button>
</div>
<div className="flex flex-wrap gap-3">
{genreOptions.map((opt) => {
  const isSelected = selectedGenres.has(opt.key);
  return (
    <button
      key={opt.key}
      type="button"
      onClick={() => toggleInSet(setSelectedGenres, opt.key)}
      className={
        isSelected
          ? "px-6 py-2 rounded-full bg-primary text-background-dark font-bold text-sm shadow-lg shadow-primary/20 flex items-center gap-2"
          : "px-6 py-2 rounded-full bg-slate-200 dark:bg-primary/10 border-2 border-transparent hover:border-primary/50 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all"
      }
    >
      {isSelected && <span className="material-symbols-outlined text-sm font-bold">check</span>}
      {opt.label}
    </button>
  );
})}
</div>
</section>
{/* <!-- 2. Favorite Artists --> */}
<section className="mb-12">
<div className="flex items-center justify-between mb-4">
<h3 className="text-xl font-bold">Who are your favorite artists?</h3>
<button className="text-primary text-sm font-semibold hover:underline">View all</button>
</div>
<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 sm:gap-6">
{artistOptions.map((opt) => {
  const isSelected = selectedArtists.has(opt.key);
  return (
    <button
      key={opt.key}
      type="button"
      onClick={() => toggleInSet(setSelectedArtists, opt.key)}
      className="group flex flex-col items-center gap-2"
    >
      <div
        className={
          isSelected
            ? "relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-primary shadow-lg shadow-primary/10"
            : "relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-transparent hover:border-primary/30 transition-all"
        }
      >
        <img
          className={isSelected ? "w-full h-full object-cover" : "w-full h-full object-cover grayscale group-hover:grayscale-0"}
          src={opt.img}
          alt={opt.label}
        />
        {isSelected && (
          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
            <div className="bg-primary text-background-dark rounded-full p-1.5">
              <span className="material-symbols-outlined font-bold text-lg">check</span>
            </div>
          </div>
        )}
      </div>
      <span
        className={
          isSelected
            ? "font-bold text-xs sm:text-sm text-primary"
            : "font-bold text-xs sm:text-sm text-slate-400 group-hover:text-primary transition-colors"
        }
      >
        {opt.label}
      </span>
    </button>
  );
})}
</div>
</section>
{/* <!-- 3. Songs You Love --> */}
<section className="mb-10">
<div className="flex items-center justify-between mb-4">
<h3 className="text-xl font-bold">Songs you love</h3>
<button className="text-primary text-sm font-semibold hover:underline">View all</button>
</div>
<div className="space-y-2">
  {songOptions.map((opt) => {
    const isSelected = selectedSongs.has(opt.key);
    return (
      <button
        key={opt.key}
        type="button"
        onClick={() => toggleInSet(setSelectedSongs, opt.key)}
        className={
          isSelected
            ? "flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/30 group cursor-pointer w-full"
            : "flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent transition-all group cursor-pointer w-full"
        }
      >
        <div className="flex items-center gap-4">
          <div className="relative size-12 rounded-lg overflow-hidden">
            <img className="w-full h-full object-cover" src={opt.img} alt={opt.title} />
          </div>
          <div>
            <p className={isSelected ? "font-bold text-primary" : "font-bold group-hover:text-primary transition-colors"}>
              {opt.title}
            </p>
            <p className="text-xs text-slate-500">{opt.sub}</p>
          </div>
        </div>

        {isSelected ? (
          <div className="bg-primary text-background-dark rounded-full p-1">
            <span className="material-symbols-outlined font-bold text-sm">check</span>
          </div>
        ) : (
          <span className="material-symbols-outlined text-slate-600 group-hover:text-primary">add_circle</span>
        )}
      </button>
    );
  })}
</div>
</section></div>
</main>
{/* <!-- Fixed Bottom Action Bar --> */}
<footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark dark:to-transparent pt-12 pb-8 px-4 flex justify-center pointer-events-none">
<div className="max-w-md w-full pointer-events-auto">
<button
  type="button"
  disabled={!canSave}
  onClick={() => {
    if (!canSave) return;
    // Chỗ này có thể gọi API/đẩy user tới trang tiếp theo.
    // Hiện tại chỉ cần đảm bảo UI cho phép chọn/tắt và bật Save đúng điều kiện.
    // eslint-disable-next-line no-console
    console.log({
      genres: Array.from(selectedGenres),
      artists: Array.from(selectedArtists),
      songs: Array.from(selectedSongs),
    });
  }}
  className={
    canSave
      ? "w-full bg-primary text-background-dark py-4 rounded-full font-extrabold text-lg shadow-[0_0_40px_-10px_rgba(29,185,84,0.6)] hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
      : "w-full bg-primary text-background-dark py-4 rounded-full font-extrabold text-lg opacity-50 cursor-not-allowed shadow-[0_0_40px_-10px_rgba(29,185,84,0.6)] flex items-center justify-center gap-2"
  }
>
  Save
  <br />
  <span className="material-symbols-outlined font-bold">arrow_forward</span>
</button>
</div>
</footer>
</div>
    </>)
}