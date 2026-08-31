# Content maintenance guide / 内容维护指南

## Publications / 论文

Edit `src/data/publications.json`. Every record needs a unique lowercase `id`, accurate title and author order, venue or manuscript status, year, publication status, bilingual summary, BibTeX, and descriptive image alt text. Use an empty DOI and `null` paper link for accepted or under-review work that is not yet online; never invent a URL.

编辑 `src/data/publications.json`。每条记录必须包含唯一的小写 `id`、准确的标题与作者顺序、期刊/会议或稿件状态、年份、发表状态、中英文摘要、BibTeX 与有意义的图片替代文本。尚未上线的已接收论文或在投稿件可保留空 DOI，并将论文链接设为 `null`；不要猜测链接。

Allowed publication statuses are `Published`, `Accepted`, `In Press`, `Preprint`, and `Under Review`. A paper is `featured` only when it is appropriate to highlight it on the home page. Mark `first_author` and `co_first_author` independently and set `equal_contribution` only for authors explicitly identified by the source.

## Projects / 项目

Edit `src/data/projects.json`. Project descriptions should state the clinical motivation and technical focus without claiming unverified outcomes. Every ID in `related_publications` must exist in the publications file.

编辑 `src/data/projects.json`。项目描述应说明临床动机与技术重点，不得声称未经核验的结果。`related_publications` 中的每个 ID 都必须在论文数据中存在。

Long-form project narratives live in `src/data/researchDetails.ts`. Keep the English and Chinese versions aligned and link only public code, model, or data resources that already exist.

研究详情页的长文位于 `src/data/researchDetails.ts`。中英文内容应保持一致，代码、模型与数据链接只能指向已经公开存在的资源。

## Presentations / 会议报告

Edit `src/data/presentations.json` for conference participation, oral presentations, posters, and presentation awards. Conference papers remain publication records in `src/data/publications.json`; presentation records must not be inserted between publication lists. Each presentation needs an exact date or month, venue, location, format, title, bilingual description, and source-grounded award wording.

Each event contains one or more presentation items linked through `related_publication`. The event image is the reviewed public poster or title-slide preview used by the lightbox. If a future poster PDF, slides PDF, or video is approved for public release, add an optional field to the data, component, validation script, and both language labels together; omit the button when no real public file exists.

会议参会、口头报告、海报与报告奖项维护在 `src/data/presentations.json`。会议论文仍属于 `src/data/publications.json`；会议展示记录不得重新插入论文列表之间。每条记录须包含准确日期或月份、会议、地点、形式、题目、中英文说明和有来源支持的获奖表述。

## Resources / 公开资源

Edit `src/data/resources.ts`. List only links that already resolve to public code, model, data, evaluation, or citation resources. Do not add placeholder or “coming soon” entries.

公开资源维护在 `src/data/resources.ts`。只收录已经存在并可公开访问的代码、模型、数据、评估或引用资源，不添加占位或“即将发布”条目。

## Profile, education, and news / 简介、教育与动态

Profile copy lives in `src/data/profile.ts`; education in `src/data/education.ts`; honors in `src/data/honors.ts`; presentations in `src/data/presentations.json`; news in `src/data/news.ts`. Add matching English and Chinese text. Dates use ISO format (`YYYY-MM-DD` or `YYYY-MM`) in data and are rendered for each locale.

个人简介位于 `src/data/profile.ts`，教育经历位于 `src/data/education.ts`，动态位于 `src/data/news.ts`。请同时维护中英文内容；数据中的日期使用 ISO 格式（`YYYY-MM-DD`）。

## Images / 图片

Use WebP for content imagery, SVG for conceptual source graphics, PNG for social previews, and a square PNG for the Apple touch icon. Author-provided, already-published paper figures may be extracted as tightly cropped, attribution-labelled WebP assets when the figure is methodologically representative and contains no identifying clinical data. Avoid standalone patient scans, result-only clinical examples, full journal-page screenshots, and unrelated publisher artwork. Keep descriptive English and Chinese alt text beside the related content record.

Existing images under `public/assets/publications/` are a preserved set and must remain byte-for-byte unchanged. Run `npm run verify-preserved-images` after any asset work. Do not add source PDFs to the public repository.

`dcm-ai-review` is a frozen review record. Do not alter any field in that publication object unless the author explicitly supplies a factual correction and authorizes replacing the baseline. Run `npm run verify-frozen-review` after publication edits.

## Verification checklist / 核验清单

1. Confirm DOI, author order, venue, year, and status against the publisher or PubMed.
2. Confirm code links from the author or project repository.
3. Run `npm run validate-content` and `npm run check-doi`.
4. Run `npm run verify-invariants`.
5. Run the full quality sequence in README.
6. Inspect both language routes at desktop and 390 px mobile widths.
