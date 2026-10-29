import { afk, brands, chapters, closing, extraSplits, moments, profile, work } from "@/content/site";
import ChapterSection from "@/components/ChapterSection";
import Journey3D from "@/components/Journey3D";
import Mentions from "@/components/Mentions";
import Moments3D from "@/components/Moments3D";
import Run from "@/components/Run";

const [first, middle, last] = profile.name.split(" ");

// Outline icons drawn in the page's text colour, so they match the theme. Picked by the link's site.
function SocialIcon({ href }: { href: string }) {
  const name = href.includes("instagram.com") ? "Instagram" : href.includes("linkedin.com") ? "LinkedIn" : href.includes("x.com") ? "X" : href.includes("github.com") ? "GitHub" : "";
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, "aria-hidden": true } as const;
  if (name === "Instagram")
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  if (name === "LinkedIn")
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M8 10.5V16.5M8 7.6v.1M11.5 16.5v-6M11.5 13c0-1.6 1-2.6 2.4-2.6s2.1 1 2.1 2.6v3.5" strokeLinecap="round" />
      </svg>
    );
  if (name === "GitHub")
    return (
      <svg {...common}>
        <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (name === "X")
    return (
      <svg {...common} fill="currentColor" stroke="none">
        <path d="M18.2 2.3h3.4l-7.4 8.4 8.7 11.5h-6.8l-5.3-6.9-6.1 6.9H1.3l7.9-9L.9 2.3h7l4.8 6.3zm-1.2 17.9h1.9L7.1 4.2H5.1z" />
      </svg>
    );
  return null;
}

export default function Home() {
  const splits = [...chapters.map(({ id, split, when, gold }) => ({ id, split, when, gold })), ...extraSplits];

  return (
    <>
      <Journey3D splits={splits} />
      <header className="topbar">
        <a className="wordmark" href="/">
          <img src="/media/lion-mark.png" alt="" width={28} height={28} />
          lopeselio
        </a>
        <nav aria-label="Quick links">
          <a href="#run">Story</a>
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
          <a href={profile.cv} download>
            CV
          </a>
        </nav>
      </header>

      <main>
        <section className="hero" aria-labelledby="name">
          <div className="hero-title">
            <p className="hero-kicker">{profile.tagline}</p>
            <h1 id="name" className="hero-name">
              <span>{first}</span>
              <span>{middle}</span>
              <span>{last}</span>
            </h1>
          </div>
          <div className="hero-side">
            <img className="hero-portrait" src={profile.portrait.src} alt={profile.portrait.alt} />
            <p className="hero-intro">{profile.intro}</p>
            <dl className="facts">
              <dt>Now</dt>
              <dd>
                <Mentions text="Building Terrace Social, on my own" />
              </dd>
              <dt>Before</dt>
              <dd>
                <Mentions text="Co-founder, CEO and CTO of IntoTheVerse" />
              </dd>
              <dt>Community</dt>
              <dd>{profile.community}</dd>
              <dt>Open to</dt>
              <dd>{profile.openTo}</dd>
              <dt>Based in</dt>
              <dd>{profile.location}</dd>
            </dl>
            <div className="actions">
              <a className="btn btn-solid" href={profile.cv} download>
                Download CV
              </a>
              <a className="btn btn-ghost" href={`mailto:${profile.email}`}>
                Email me
              </a>
            </div>
            <ul className="sociallinks">
              {profile.links.map((link) => (
                <li key={link.href}>
                  <a className="textlink" href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <p className="start">
          <a href={`#${chapters[0].id}`}>
            <span className="tick" aria-hidden="true" />
            Start the ride: {splits.length} checkpoints, {chapters[0].when} to now
          </a>
          <span className="start-hint">Move to look around. Click a checkpoint ring to jump to its chapter.</span>
        </p>

        <Run splits={splits}>
          {chapters.map((chapter, i) => (
            <ChapterSection key={chapter.id} chapter={chapter} index={i} />
          ))}

        <section id="work" className="section" aria-labelledby="work-title">
          <h2 id="work-title" className="section-title">
            I write code
          </h2>
          <p className="work-more">
            Most of the code is open.{" "}
            <a className="btn btn-ghost" href={profile.github} target="_blank" rel="noreferrer">
              Check out my GitHub
            </a>
          </p>
          <ul className="work">
            {work.map((item) => (
              <li key={item.name}>
                <span className="y">{item.year}</span>
                <span className="nm">
                  {(() => {
                    const brand = brands.find((b) => b.name === item.name);
                    return brand ? <img src={brand.logo} alt="" width={22} height={22} /> : null;
                  })()}
                  {item.name}
                </span>
                <span className="wt">{item.what}</span>
                <span className="lk">
                  {item.links.map((link) => (
                    <a key={link.href} className="textlink" href={link.href} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section id="moments" className="section moments" aria-labelledby="moments-title">
          <h2 id="moments-title" className="section-title">
            Away from the keyboard
          </h2>
          <p className="afk-subtitle">{afk.subtitle}</p>
          <div className="afk-intro">
            {afk.intro.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <Moments3D items={moments} />
          <div className="afk-grid">
            {afk.groups.map((g) => (
              <article key={g.title} className="afk-card">
                <h3>
                  {g.title} <span aria-hidden="true">{g.emoji}</span>
                </h3>
                {g.paragraphs?.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
                {g.listIntro ? <p className="afk-listintro">{g.listIntro}</p> : null}
                {g.list ? (
                  <ul className={`afk-list afk-${g.listStyle ?? "places"}`}>
                    {g.list.map((item) => (
                      <li key={item.label}>
                        {g.listStyle === "books" ? <i>{item.label}</i> : <b>{item.label}</b>}
                        {item.text ? <span>{g.listStyle === "books" ? `, ${item.text}` : ` ${item.text}`}</span> : null}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="section closing" aria-labelledby="contact-title">
          <h2 id="contact-title" className="section-title">
            {closing.title}
          </h2>
          <p className="closing-body">{closing.body}</p>
          <a className="mail" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </section>
        </Run>
      </main>

      <footer className="footer">
        <span>{profile.name}, {profile.location}</span>
        <ul className="footer-social">
          {profile.socials.map((link) => (
            <li key={link.href}>
              <a href={link.href} target="_blank" rel="noreferrer">
                <SocialIcon href={link.href} />
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a className="textlink" href={profile.cv} download>
              Full CV (PDF)
            </a>
          </li>
        </ul>
      </footer>
    </>
  );
}
