import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppHeader from "../appheader/Header";
import Sidebar from "../appsidebar/Sidebar";
import Playing from "./SongPlay";
import { useLocation, useNavigate } from "react-router-dom";
import { usePlaylist } from "../context/PlaylistContext";
import CreatePlaylistModal from "../components/CreatePlaylistModal";
import { SONGS } from "../data/catalog";

export default function PlayList() {
  const location = useLocation();
  const navigate = useNavigate();
  const id = new URLSearchParams(location.search).get("id");
  const { playlists } = usePlaylist();
  const [createOpen, setCreateOpen] = useState(false);

  const selectedPlaylist = useMemo(
    () => (id ? playlists.find((p) => p.id === id) : null),
    [id, playlists]
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden relative bg-background-light dark:bg-background-dark">
        <AppHeader />
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <section className="mb-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Playlists
                </h2>
                {!selectedPlaylist && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {playlists.length} playlist{playlists.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-background-dark hover:bg-primary/90"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                  New playlist
                </button>
              </div>
            </div>

            {!selectedPlaylist && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {playlists.length === 0 ? (
                  <p className="col-span-full text-slate-500 dark:text-slate-400 text-sm">
                    No playlists yet. Create one with <strong className="text-primary">New playlist</strong>.
                  </p>
                ) : (
                  playlists.map((pl) => (
                    <div
                      key={pl.id}
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        navigate(`/playlist?id=${encodeURIComponent(pl.id)}`)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          navigate(
                            `/playlist?id=${encodeURIComponent(pl.id)}`
                          );
                        }
                      }}
                      className="group relative bg-card-bg p-4 rounded-xl hover:bg-white/5 transition-all cursor-pointer border border-primary/10"
                    >
                      <div className="relative aspect-square rounded-lg mb-4 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-lg">
                        <span className="material-symbols-outlined text-white text-5xl">
                          queue_music
                        </span>
                      </div>
                      <h3 className="font-bold text-base mb-1 text-white truncate">
                        {pl.name}
                      </h3>
                      <p className="text-slate-400 text-xs">
                        {pl.songIds.length} tracks
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </section>

          {selectedPlaylist && (
            <section>
              <div className="mb-6">
                <Link
                  to="/playlist"
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                >
                  <span className="material-symbols-outlined text-lg">
                    arrow_back
                  </span>
                  All playlists
                </Link>
              </div>
              <div className="flex items-end gap-6 mb-8">
                <div className="size-48 rounded-lg shadow-2xl bg-gradient-to-br from-emerald-600 to-emerald-900 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <span className="material-symbols-outlined text-white text-7xl">
                    queue_music
                  </span>
                </div>
                <div className="flex flex-col gap-2 min-w-0">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-primary/60">
                    Playlist
                  </span>
                  <h2 className="text-4xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white truncate">
                    {selectedPlaylist.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                    <span>{selectedPlaylist.songIds.length} tracks</span>
                  </div>
                </div>
              </div>

              <div className="bg-background-light dark:bg-background-dark/50 rounded-xl overflow-hidden border border-primary/5">
                {selectedPlaylist.songIds.length === 0 ? (
                  <p className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                    No tracks yet. Add songs from <strong className="text-primary">Home</strong> or use <strong className="text-primary">Save to Library</strong> on Now Playing.
                  </p>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-white/5">
                        <th className="px-6 py-4 font-semibold w-12 text-center">
                          #
                        </th>
                        <th className="px-4 py-4 font-semibold">Title</th>
                        <th className="px-4 py-4 font-semibold">Artist</th>
                        <th className="px-4 py-4 font-semibold text-right pr-12">
                          <span className="material-symbols-outlined text-base">
                            schedule
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/5">
                      {selectedPlaylist.songIds.filter((sid) => SONGS[sid]).map((sid, index) => {
                        const meta = SONGS[sid];
                        return (
                          <tr
                            key={`${sid}-${index}`}
                            className="group hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            <td className="px-6 py-3 text-center text-sm text-slate-500 group-hover:text-primary">
                              <button
                                className="hidden group-hover:inline-flex items-center justify-center size-8 rounded-full bg-primary text-background-dark"
                                type="button"
                                data-nav-type="song"
                                data-id={sid}
                                aria-label="Play song"
                              >
                                <span className="material-symbols-outlined fill-1 text-lg">
                                  play_arrow
                                </span>
                              </button>
                              <span className="group-hover:hidden">
                                {index + 1}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="size-10 rounded bg-slate-200 dark:bg-slate-800 shrink-0 overflow-hidden">
                                  {meta.cover ? (
                                    <img
                                      className="object-cover size-full"
                                      alt=""
                                      src={meta.cover}
                                    />
                                  ) : (
                                    <div className="size-full bg-slate-700" />
                                  )}
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="text-sm font-bold truncate group-hover:text-primary text-slate-900 dark:text-white">
                                    {meta.title}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                              {meta.artist}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-500 text-right pr-12">
                              —
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          )}

          {id && !selectedPlaylist && (
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              Playlist not found.{" "}
              <Link to="/playlist" className="text-primary font-bold hover:underline">
                Back to all playlists
              </Link>
            </p>
          )}
        </div>
      </main>
      <Playing />
      <CreatePlaylistModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
