import { chapters, closing, community, moments, profile, work } from "@/content/site";
import ChapterSection from "@/components/ChapterSection";
import Journey3D from "@/components/Journey3D";
import Moments3D from "@/components/Moments3D";
import Run from "@/components/Run";

const [first, middle, last] = profile.name.split(" ");

export default function Home() {
  const splits = chapters.map(({ id, split, when, gold }) => ({ id, split, when, gold }));

  return (
    <>
      <Journey3D splits={splits} />
      <header className="topbar">
        <a className="wordmark" href="/">
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
          <h1 id="name" className="hero-name">
            <span>{first}</span>
            <span>{middle}</span>
            <span>{last}</span>
          </h1>
          <div className="hero-side">
            <img className="hero-portrait" src={profile.portrait.src} alt={profile.portrait.alt} />
            <p className="hero-intro">{profile.intro}</p>
            <dl className="facts">
              <dt>Now</dt>
              <dd>Building Terrace, on my own</dd>
              <dt>Before</dt>
              <dd>Co-founder, CEO and CTO of IntoTheVerse</dd>
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
            Start the run: {chapters.length} splits, {chapters[0].when} to now
          </a>
          <span className="start-hint">Move to look around. Click a checkpoint ring to jump to its chapter.</span>
        </p>

        <Run splits={splits}>
          {chapters.map((chapter, i) => (
            <ChapterSection key={chapter.id} chapter={chapter} index={i} />
          ))}

        <section id="work" className="section" aria-labelledby="work-title">
          <h2 id="work-title" className="section-title">
            Everything I&apos;ve shipped
          </h2>
          <ul className="work">
            {work.map((item) => (
              <li key={item.name}>
                <span className="y">{item.year}</span>
                <span className="nm">{item.name}</span>
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
          <p className="moments-intro">Conferences, retreats and a few places in between.</p>
          <Moments3D items={moments} />
        </section>

        <section id="contact" className="section closing" aria-labelledby="contact-title">
          <div className="closing-grid">
            <div>
              <h2 id="contact-title" className="section-title">
                {closing.title}
              </h2>
              <p className="closing-body">{closing.body}</p>
              <a className="mail" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </div>
            <div>
              <h3>Around the work</h3>
              <ul className="factlist">
                {community.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        </Run>
      </main>

      <footer className="footer">
        <span>{profile.name}, {profile.location}</span>
        <span>
          <a className="textlink" href={profile.cv} download>
            Full CV (PDF)
          </a>
        </span>
      </footer>
    </>
  );
}
