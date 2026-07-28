import type { ReactNode } from "react";

// Minimal markdown renderer for Coach replies. Plans arrive as tables with numbered
// supersets, so tables are the load-bearing feature here.
//
// Builds React elements rather than HTML strings — model output is never passed
// through dangerouslySetInnerHTML, so there is no XSS surface.

/** Inline: **bold**, *italic*, `code`. */
function inline(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`\n]+`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    const key = `${keyPrefix}-i${i++}`;
    if (tok.startsWith("**")) out.push(<strong key={key}>{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith("`")) out.push(<code key={key}>{tok.slice(1, -1)}</code>);
    else out.push(<em key={key}>{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const splitRow = (line: string): string[] =>
  line.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim());

const isDivider = (line: string): boolean => /^\s*\|?[\s:-]*-[\s|:-]*\|?\s*$/.test(line);

export function Markdown({ source }: { source: string }) {
  const lines = source.split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blank
    if (!line.trim()) {
      i++;
      continue;
    }

    // Table: a pipe row followed by a --- divider row
    if (line.includes("|") && i + 1 < lines.length && isDivider(lines[i + 1])) {
      const head = splitRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim()) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      blocks.push(
        <div className="coach-table-wrap" key={`k${key++}`}>
          <table className="coach-table">
            <thead>
              <tr>
                {head.map((h, hi) => (
                  <th key={hi}>{inline(h, `h${key}-${hi}`)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri}>
                  {r.map((c, ci) => (
                    <td key={ci}>{inline(c, `c${key}-${ri}-${ci}`)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Heading
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      const content = inline(h[2], `hd${key}`);
      const cls = `coach-h${level}`;
      blocks.push(
        level <= 2 ? (
          <h3 className={cls} key={`k${key++}`}>
            {content}
          </h3>
        ) : (
          <h4 className={cls} key={`k${key++}`}>
            {content}
          </h4>
        )
      );
      i++;
      continue;
    }

    // Horizontal rule
    if (/^\s*(---|___|\*\*\*)\s*$/.test(line)) {
      blocks.push(<hr className="coach-hr" key={`k${key++}`} />);
      i++;
      continue;
    }

    // List (bullet or ordered)
    if (/^\s*([-*+]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items: string[] = [];
      while (i < lines.length && /^\s*([-*+]|\d+\.)\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*([-*+]|\d+\.)\s+/, ""));
        i++;
      }
      const li = items.map((t, ii) => <li key={ii}>{inline(t, `l${key}-${ii}`)}</li>);
      blocks.push(
        ordered ? (
          <ol className="coach-list" key={`k${key++}`}>
            {li}
          </ol>
        ) : (
          <ul className="coach-list" key={`k${key++}`}>
            {li}
          </ul>
        )
      );
      continue;
    }

    // Paragraph — consume until a blank line or a block-level construct
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,4})\s/.test(lines[i]) &&
      !/^\s*([-*+]|\d+\.)\s+/.test(lines[i]) &&
      !(lines[i].includes("|") && i + 1 < lines.length && isDivider(lines[i + 1]))
    ) {
      para.push(lines[i]);
      i++;
    }
    blocks.push(
      <p className="coach-p" key={`k${key++}`}>
        {inline(para.join(" "), `p${key}`)}
      </p>
    );
  }

  return <>{blocks}</>;
}
