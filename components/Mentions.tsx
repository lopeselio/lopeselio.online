import { brands, type Brand } from "@/content/site";

const pattern = new RegExp(`\\b(${brands.map((b) => b.name).join("|")})\\b`);

// The logo and name of one of my projects, linking to its X account.
export function BrandLink({ brand }: { brand: Brand }) {
  return (
    <a className="brand" href={brand.x} target="_blank" rel="noreferrer" title={`${brand.name} on X`}>
      <img src={brand.logo} alt="" width={18} height={18} />
      {brand.name}
    </a>
  );
}

// Text where the first mention of each of my projects becomes a logo link to its X account.
export default function Mentions({ text }: { text: string }) {
  const seen = new Set<string>();
  const out: React.ReactNode[] = [];
  let rest = text;
  let key = 0;
  for (;;) {
    const m = rest.match(new RegExp(pattern.source));
    if (!m || m.index === undefined) break;
    const name = m[1];
    const brand = brands.find((b) => b.name === name)!;
    out.push(rest.slice(0, m.index));
    out.push(seen.has(name) ? name : <BrandLink key={key++} brand={brand} />);
    seen.add(name);
    rest = rest.slice(m.index + name.length);
  }
  out.push(rest);
  return <>{out}</>;
}
