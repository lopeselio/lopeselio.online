import type { Article } from "@/content/site";

// An article I wrote, as a link card with its cover image.
export default function ArticleCard({ article }: { article: Article }) {
  const { title, url, author, date, cover, blurb } = article;
  return (
    <a className="article" href={url} target="_blank" rel="noreferrer">
      <img className="article-cover" src={cover} alt="" loading="lazy" />
      <span className="article-body">
        <span className="article-kicker">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.2 2.3h3.4l-7.4 8.4 8.7 11.5h-6.8l-5.3-6.9-6.1 6.9H1.3l7.9-9L.9 2.3h7l4.8 6.3zm-1.2 17.9h1.9L7.1 4.2H5.1z" fill="currentColor" />
          </svg>
          Article on X
        </span>
        <span className="article-title">{title}</span>
        <span className="article-blurb">{blurb}</span>
        <span className="article-meta">
          @{author} ·{" "}
          {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}
          <span className="article-read">Read it →</span>
        </span>
      </span>
    </a>
  );
}
