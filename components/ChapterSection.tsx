import type { Chapter } from "@/content/site";
import ChapterMedia from "./ChapterMedia";
import Counter from "./Counter";
import LaunchField from "./LaunchField";
import WidenTitle from "./WidenTitle";

export default function ChapterSection({ chapter, index }: { chapter: Chapter; index: number }) {
  const { id, when, title, story, facts, stats, links, media, mediaLayout, gold, feature } = chapter;

  return (
    <article id={id} className="chapter" data-gold={Boolean(gold)} data-feature={Boolean(feature)}>
      {feature ? <LaunchField /> : null}
      <header className="chapter-head">
        <p className="chapter-when">
          <span className="sr-only">Split {index + 1}, </span>
          {when}
        </p>
        <WidenTitle className="chapter-title">{title}</WidenTitle>
      </header>

      <div className="chapter-body">
        <div className="story">
          {story.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>

        {Boolean(facts?.length || links?.length) && (
          <aside className="chapter-aside">
            {facts?.length ? (
              <ul className="factlist">
                {facts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            ) : null}
            {links?.length ? (
              <ul className="linklist">
                {links.map((link) => (
                  <li key={link.href}>
                    <a className="textlink" href={link.href} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </aside>
        )}
      </div>

      {stats?.length ? (
        <dl className="stats">
          {stats.map((stat) => (
            <div className="stat" key={stat.label}>
              <dt className="stat-l">{stat.label}</dt>
              <dd className="stat-n">
                <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      {media?.length ? <ChapterMedia items={media} layout={mediaLayout} /> : null}
    </article>
  );
}
