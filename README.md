# Cinematic Emotion Map

An interactive research visualization of the emotional shift between official
film narratives and English-language IMDb audience reception in six national
film samples (2010–2020).

**Live site:** https://clara-720.github.io/cinematic-emotion-map-research/

## Research question

How does the emotional valence expressed in a film's official narrative differ
from the emotional valence expressed in its English-language audience reviews?

The map presents 209 films and 4,680 matched reviews from Australia, Brazil,
China, Egypt, Germany, and the United States. Country is used to organize the
film sample geographically; it does not identify reviewers' nationality.

## Method

For each film, the analysis estimates joy and sadness probabilities with
`j-hartmann/emotion-english-distilroberta-base`.

- **Narrative valence:** P(joy | official TMDB synopsis) − P(sadness | synopsis)
- **Reception valence:** mean P(joy | IMDb reviews) − mean P(sadness | reviews)
- **Sentiment gap:** (reception valence − narrative valence) ÷ 2

The country estimates use `Gap ~ country + centered release year`, evaluated at
the sample mean release year (2015.0), with HC3 robust 95% confidence intervals.

## Main finding

Across the sample, IMDb audience reception shifts modestly toward joy relative
to official film narratives (mean gap = +0.089, 95% CI +0.062 to +0.116).
The year-adjusted joint country effect is not statistically significant
(HC3 Wald p = .559), so country comparisons are descriptive rather than
evidence of national differences.

## Limitations

- The model estimates emotion expressed in text; it does not measure viewers'
  psychological states.
- The review sample is English-language IMDb content and is not representative
  of all audiences.
- Official TMDB synopses and audience reviews serve different communicative
  purposes, so the gap is a directional comparison rather than agreement
  between two equivalent texts.

## Data and visual sources

- TMDB: film metadata and official synopses
- IMDb: matched English-language audience reviews
- Natural Earth: country boundaries
- NASA Black Marble: visual inspiration and attribution
- Poster artwork remains the property of its respective rights holders

Asset-level source notes are included under `public/data`, `public/flags`, and
`public/posters`.

## Local development

Requires Node.js 22+ and pnpm 11.

```bash
pnpm install
pnpm run dev
pnpm run build
```

The site is deployed automatically to GitHub Pages when `main` is updated.
