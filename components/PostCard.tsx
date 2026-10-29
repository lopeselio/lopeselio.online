import type { Post } from "@/content/site";
import { LoopVideo } from "./ChapterMedia";

const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K` : String(n));

// A post from X drawn in our own HTML, with its video playing inline on a loop.
// It looks like an embedded post but needs no third-party script.
export default function PostCard({ post }: { post: Post }) {
  const { author, handle, avatar, verified, text, url, date, views, replies, reposts, likes, video, credit } = post;

  return (
    <figure className="post">
      <article className="post-card" aria-label={`Post by ${author} on X`}>
        <header className="post-head">
          <img className="post-avatar" src={avatar} alt="" width={44} height={44} />
          <div className="post-who">
            <span className="post-name">
              {author}
              {verified ? (
                <svg className="post-badge" viewBox="0 0 22 22" aria-label="Verified account" role="img">
                  <path d="M20.4 11c0-1.4-.8-2.6-2-3.2.4-1.3.1-2.8-.9-3.7-1-1-2.4-1.3-3.7-.9C13.2 2 12 1.2 10.6 1.2S8 2 7.4 3.2c-1.3-.4-2.8-.1-3.7.9-1 1-1.3 2.4-.9 3.7C1.6 8.4.8 9.6.8 11s.8 2.6 2 3.2c-.4 1.3-.1 2.8.9 3.7 1 1 2.4 1.3 3.7.9.6 1.2 1.8 2 3.2 2s2.6-.8 3.2-2c1.3.4 2.8.1 3.7-.9 1-1 1.3-2.4.9-3.7 1.2-.6 2-1.8 2-3.2z" fill="#1d9bf0" />
                  <path d="M9.6 14.8 6.3 11.5l1.3-1.3 2 2 4.8-4.8 1.3 1.3z" fill="#fff" />
                </svg>
              ) : null}
            </span>
            <span className="post-handle">@{handle}</span>
          </div>
          <a className="post-x" href={url} target="_blank" rel="noreferrer" aria-label="View the post on X">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.2 2.3h3.4l-7.4 8.4 8.7 11.5h-6.8l-5.3-6.9-6.1 6.9H1.3l7.9-9L.9 2.3h7l4.8 6.3zm-1.2 17.9h1.9L7.1 4.2H5.1z" fill="currentColor" />
            </svg>
          </a>
        </header>

        <p className="post-text">
          {text.split(/(@\w+)/).map((part, i) =>
            part.startsWith("@") ? (
              <a key={i} href={`https://x.com/${part.slice(1)}`} target="_blank" rel="noreferrer">
                {part}
              </a>
            ) : (
              part
            ),
          )}
        </p>

        <div className="post-media">
          <LoopVideo item={video} />
        </div>

        <p className="post-meta">
          <time dateTime={date}>
            {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}
          </time>
          {" · "}
          <b>{views.toLocaleString("en-US")}</b> views
        </p>

        <footer className="post-stats">
          <span>
            <b>{compact(replies)}</b> replies
          </span>
          <span>
            <b>{compact(reposts)}</b> reposts
          </span>
          <span>
            <b>{compact(likes)}</b> likes
          </span>
          <a className="textlink" href={url} target="_blank" rel="noreferrer">
            View on X
          </a>
        </footer>
      </article>
      <figcaption>{credit}</figcaption>
    </figure>
  );
}
