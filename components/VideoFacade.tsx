"use client";

import { useState } from "react";

/**
 * A YouTube facade: a still and a play button, with nothing loaded from Google
 * until the reader actually asks for the video.
 *
 * This matters beyond weight. An ordinary YouTube embed sets cookies on load,
 * which would oblige the site to carry a consent banner — the one thing the
 * whole analytics and tracking approach here was designed to avoid. Deferring
 * the iframe until a click keeps the page cookie-free for everyone who never
 * presses play, and the nocookie host covers those who do.
 */
export function VideoFacade({
  id,
  title,
  poster,
}: {
  id: string;
  title: string;
  /** Local still. Never hot-linked from YouTube, which is itself a request. */
  poster?: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="video">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="video">
      {poster ? (
        <img src={poster} alt="" width={1280} height={720} loading="lazy" decoding="async" />
      ) : null}
      <button
        type="button"
        className="video__play"
        onClick={() => setPlaying(true)}
      >
        <span>Play: {title}</span>
      </button>
    </div>
  );
}
