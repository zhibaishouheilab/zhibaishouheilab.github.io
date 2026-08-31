import publications from "../data/publications.json";

export const prerender = true;

export function GET() {
  const bibliography = `${publications.map((item) => item.bibtex.trim()).join("\n\n")}\n`;
  return new Response(bibliography, {
    headers: {
      "Content-Type": "application/x-bibtex; charset=utf-8",
      "Content-Disposition": 'attachment; filename="qi-zhang-publications.bib"',
    },
  });
}
