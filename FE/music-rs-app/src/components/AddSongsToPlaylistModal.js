import { useEffect, useMemo, useState } from "react";
import { usePlaylist } from "../context/PlaylistContext";
import { SONGS } from "../data/catalog";

/** Emerald shades only — matches green + black app chrome */
const ROW_TINTS = [
  "from-emerald-600 to-emerald-900",
  "from-teal-600 to-emerald-950",
  "from-emerald-700 to-black",
  "from-cyan-700 to-emerald-950",
  "from-emerald-500 to-teal-900",
];

export default function AddSongsToPlaylistModal({ open, onClose, prefillIds = [] }) {
  const { playlists, addSongsToPlaylist } = usePlaylist();
  const [targetId, setTargetId] = useState("");

  const validPrefill = useMemo(
    () => (prefillIds || []).filter((id) => SONGS[id]),
    [prefillIds]
  );

  useEffect(() => {
    if (!open) return;
    setTargetId(playlists[0]?.id ?? "");
  }, [open, playlists]);

  if (!open) return null;

  const canAdd = Boolean(targetId && validPrefill.length);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-pl-title"
    >
      <div className="w-full max-w-md max-h-[88vh] overflow-hidden flex flex-col rounded-2xl border border-emerald-500/25 bg-background-dark shadow-2xl shadow-black">
        <div className="px-5 pt-5 pb-4 border-b border-emerald-500/20 bg-black/40">
          <h2
            id="add-pl-title"
            className="text-lg font-bold text-white"
          >
            Add to playlist
          </h2>
          {validPrefill.length > 0 ? (
            <p className="text-sm text-emerald-200/70 mt-1.5">
              <span className="text-primary font-semibold">{validPrefill.length}</span>{" "}
              track{validPrefill.length !== 1 ? "s" : ""}
              {validPrefill.length <= 4 && (
                <span className="block text-xs text-emerald-500/80 mt-1 leading-snug">
                  {validPrefill.map((id) => SONGS[id].title).join(" · ")}
                </span>
              )}
            </p>
          ) : (
            <p className="text-sm text-emerald-400/90 mt-1.5">
              Tap + on a song first, then pick a playlist below.
            </p>
          )}
        </div>

        <div className="px-4 py-4 overflow-y-auto custom-scrollbar flex-1 min-h-0 space-y-2 bg-black/30">
          <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-500/70 px-1">
            Choose playlist
          </p>
          {playlists.length === 0 ? (
            <p className="text-sm text-emerald-200/50 px-2 py-2">
              No playlists yet. Create one on the Playlist page.
            </p>
          ) : (
            playlists.map((pl, i) => {
              const grad = ROW_TINTS[i % ROW_TINTS.length];
              const selected = targetId === pl.id;
              return (
                <button
                  key={pl.id}
                  type="button"
                  onClick={() => setTargetId(pl.id)}
                  className={
                    selected
                      ? `w-full text-left rounded-xl px-4 py-3.5 bg-gradient-to-r ${grad} text-white shadow-lg shadow-black/40 ring-2 ring-primary transition-all`
                      : `w-full text-left rounded-xl px-4 py-3.5 bg-gradient-to-r ${grad} text-emerald-100/95 shadow-md hover:brightness-110 border border-emerald-500/20 transition-all`
                  }
                >
                  <span className="block font-bold truncate">{pl.name}</span>
                  <span className="text-xs text-emerald-200/80 font-medium">
                    {pl.songIds.length} tracks
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-3 flex justify-end gap-2 border-t border-emerald-500/30 bg-black">
          <button
            type="button"
            className="rounded-full px-4 py-2 text-sm font-semibold text-primary hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/30"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canAdd}
            className="rounded-full px-5 py-2 text-sm font-bold bg-primary text-background-dark hover:bg-primary/90 shadow-md shadow-emerald-900/50 disabled:opacity-30 disabled:shadow-none"
            onClick={() => {
              if (!canAdd) return;
              addSongsToPlaylist(targetId, validPrefill);
              onClose();
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
