import { Link, useSearchParams } from "react-router-dom";
import AppHeader from "../appheader/Header";
import Sidebar from "../appsidebar/Sidebar";
import { usePersonalize } from "../context/PersonalizeContext";
import { ARTISTS, GENRES, SHOW_SECTIONS, SONGS } from "../data/catalog";

export default function PersonalizeShowAll() {
  const [params] = useSearchParams();
  const section = params.get("section") || "personalize_genres";
  const config = SHOW_SECTIONS[section] || SHOW_SECTIONS.personalize_genres;

  const {
    selectedGenres,
    selectedArtists,
    selectedSongs,
    toggleGenre,
    toggleArtist,
    toggleSong,
  } = usePersonalize();

  const title =
    section === "personalize_genres"
      ? "Choose genres"
      : section === "personalize_artists"
        ? "Choose artists"
        : "Choose songs";

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto custom-scrollbar relative pb-28">
        <AppHeader />
        <div className="px-8 py-6 max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-4 mb-4">
            <Link
              to="/ask_user"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Personalize
            </Link>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 mb-8">
            Tap items to select or deselect. Your choices sync with the Personalize page.
          </p>

          {config.kind === "genres" && (
            <div className="flex flex-wrap gap-3">
              {config.ids.map((id) => {
                const label = GENRES[id];
                if (!label) return null;
                const isSelected = selectedGenres.has(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleGenre(id)}
                    className={
                      isSelected
                        ? "px-6 py-2 rounded-full bg-primary text-background-dark font-bold text-sm shadow-lg shadow-primary/20 flex items-center gap-2"
                        : "px-6 py-2 rounded-full bg-slate-200 dark:bg-primary/10 border-2 border-transparent hover:border-primary/50 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all"
                    }
                  >
                    {isSelected && (
                      <span className="material-symbols-outlined text-sm font-bold">
                        check
                      </span>
                    )}
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          {config.kind === "artists" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {config.ids.map((id) => {
                const a = ARTISTS[id];
                if (!a) return null;
                const isSelected = selectedArtists.has(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleArtist(id)}
                    className="group flex flex-col items-center gap-2 text-left"
                  >
                    <div
                      className={
                        isSelected
                          ? "relative w-full aspect-square max-w-[140px] mx-auto rounded-full overflow-hidden border-4 border-primary shadow-lg shadow-primary/10"
                          : "relative w-full aspect-square max-w-[140px] mx-auto rounded-full overflow-hidden border-4 border-transparent hover:border-primary/30 transition-all"
                      }
                    >
                      <img
                        className={
                          isSelected
                            ? "w-full h-full object-cover"
                            : "w-full h-full object-cover grayscale group-hover:grayscale-0"
                        }
                        src={a.cover}
                        alt={a.name}
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="bg-primary text-background-dark rounded-full p-1.5">
                            <span className="material-symbols-outlined font-bold text-lg">
                              check
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <span
                      className={
                        isSelected
                          ? "font-bold text-sm text-primary text-center"
                          : "font-bold text-sm text-slate-400 group-hover:text-primary transition-colors text-center"
                      }
                    >
                      {a.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {config.kind === "songs" && (
            <div className="space-y-2 max-w-3xl">
              {config.ids.map((id) => {
                const s = SONGS[id];
                if (!s?.cover) return null;
                const isSelected = selectedSongs.has(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleSong(id)}
                    className={
                      isSelected
                        ? "flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/30 w-full text-left"
                        : "flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent transition-all w-full text-left"
                    }
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative size-12 rounded-lg overflow-hidden shrink-0">
                        <img
                          className="w-full h-full object-cover"
                          src={s.cover}
                          alt=""
                        />
                      </div>
                      <div className="min-w-0">
                        <p
                          className={
                            isSelected
                              ? "font-bold text-primary truncate"
                              : "font-bold group-hover:text-primary transition-colors truncate"
                          }
                        >
                          {s.title}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{s.artist}</p>
                      </div>
                    </div>
                    {isSelected ? (
                      <div className="bg-primary text-background-dark rounded-full p-1 shrink-0">
                        <span className="material-symbols-outlined font-bold text-sm">
                          check
                        </span>
                      </div>
                    ) : (
                      <span className="material-symbols-outlined text-slate-600 group-hover:text-primary shrink-0">
                        add_circle
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 left-0 right-0 px-8 py-4 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark">
          <div className="max-w-6xl mx-auto flex justify-end">
            <Link
              to="/ask_user"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-bold text-background-dark hover:bg-primary/90 shadow-lg shadow-primary/25"
            >
              Done
              <span className="material-symbols-outlined text-lg">check</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
