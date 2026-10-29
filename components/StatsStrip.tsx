"use client";

import type { Stat } from "@/content/site";
import { MovingStrip } from "./ChapterMedia";
import Counter from "./Counter";

// A chapter's numbers as a moving strip you can drag; each still counts up when it comes into view.
export default function StatsStrip({ stats }: { stats: Stat[] }) {
  return (
    <MovingStrip
      items={stats}
      render={(stat, copy, i) => (
        <div className="stat" key={`${stat.label}-${i}`} aria-hidden={copy || undefined}>
          <p className="stat-n">
            <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
          </p>
          <p className="stat-l">{stat.label}</p>
        </div>
      )}
    />
  );
}
