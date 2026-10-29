"use client";

import { useEffect, useRef, useState } from "react";

type Twttr = { widgets: { createTweet: (id: string, el: HTMLElement, opts: object) => Promise<HTMLElement | undefined> } };

let loader: Promise<Twttr | null> | null = null;
// X's widget script, loaded once and only when an embed comes near the screen.
function loadWidgets() {
  loader ??= new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://platform.twitter.com/widgets.js";
    s.async = true;
    s.onload = () => resolve((window as unknown as { twttr?: Twttr }).twttr ?? null);
    s.onerror = () => resolve(null);
    document.head.appendChild(s);
  });
  return loader;
}

// An embedded post. Until X's widget renders it (or if it's blocked), a plain link to the post is shown.
export default function TweetEmbed({ url, caption }: { url: string; caption?: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);
  const id = url.match(/status\/(\d+)/)?.[1];

  useEffect(() => {
    const box = boxRef.current;
    if (!box || !id) return;
    let done = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done) return;
        done = true;
        observer.disconnect();
        loadWidgets().then((twttr) =>
          twttr?.widgets
            .createTweet(id, box, { theme: "dark", dnt: true, align: "left" })
            .then((el) => setRendered(Boolean(el))),
        );
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(box);
    return () => observer.disconnect();
  }, [id]);

  return (
    <figure className="embed">
      <div ref={boxRef} />
      {!rendered ? (
        <a className="embed-fallback" href={url} target="_blank" rel="noreferrer">
          <span className="textlink">Read the post on X</span>
        </a>
      ) : null}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
