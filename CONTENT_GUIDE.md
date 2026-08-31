# Content maintenance guide / 内容维护指南

## Publications / 论文

Edit `src/data/publications.json`. Every record needs a unique lowercase `id`, accurate title and author order, venue or manuscript status, year, publication status, bilingual summary, BibTeX, and descriptive image alt text. Use an empty DOI and `null` paper link for accepted or under-review work that is not yet online; never invent a URL.

编辑 `src/data/publications.json`。每条记录必须包含唯一的小写 `id`、准确的标题与作者顺序、期刊/会议或稿件状态、年份、发表状态、中英文摘要、BibTeX 与有意义的图片替代文本。尚未上线的已接收论文或在投稿件可保留空 DOI，并将论文链接设为 `null`；不要猜测链接。

Allowed publication statuses are `Published`, `Accepted`, `In Press`, `Preprint`, and `Under Review`. A paper is `featured` only when it is appropriate to highlight it on the home page. Mark `first_author` and `co_first_author` independently and set `equal_contribution` only for authors explicitly identified by the source.

## Projects / 项目

Edit `src/data/projects.json`. Project descriptions should state the clinical motivation and technical focus without claiming unverified outcomes. Every ID in `related_publications` must exist in the publications file.

编辑 `src/data/projects.json`。项目描述应说明临床动机与技术重点，不得声称未经核验的结果。`related_publications` 中的每个 ID 都必须在论文数据中存在。

## Profile, education, and news / 简介、教育与动态

Profile copy lives in `src/data/profile.ts`; education in `src/data/education.ts`; honors in `src/data/honors.ts`; conferences in `src/data/conferences.ts`; news in `src/data/news.ts`. Add matching English and Chinese text. Dates use ISO format (`YYYY-MM-DD` or `YYYY-MM`) in data and are rendered for each locale.

个人简介位于 `src/data/profile.ts`，教育经历位于 `src/data/education.ts`，动态位于 `src/data/news.ts`。请同时维护中英文内容；数据中的日期使用 ISO 格式（`YYYY-MM-DD`）。

## Images / 图片

Use WebP for content imagery, SVG for conceptual source graphics, PNG for social previews, and a square PNG for the Apple touch icon. Author-provided, already-published paper figures may be extracted as tightly cropped, attribution-labelled WebP assets when the figure is methodologically representative and contains no identifying clinical data. Avoid standalone patient scans, result-only clinical examples, full journal-page screenshots, and unrelated publisher artwork. Keep descriptive English and Chinese alt text beside the related content record.

## Verification checklist / 核验清单

1. Confirm DOI, author order, venue, year, and status against the publisher or PubMed.
2. Confirm code links from the author or project repository.
3. Run `npm run validate-content` and `npm run check-doi`.
4. Run the full quality sequence in README.
5. Inspect both language routes at desktop and 390 px mobile widths.
