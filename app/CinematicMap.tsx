"use client";

import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import { audienceSignal, countries, globalFinding, valenceColor } from "./data";
import { WorldMap2D } from "./WorldMap2D";

function formatSigned(value: number, digits = 3) {
  return `${value >= 0 ? "+" : "−"}${Math.abs(value).toFixed(digits)}`;
}

function sentimentPosition(value: number) {
  return `${((Math.max(-1, Math.min(1, value)) + 1) / 2) * 100}%`;
}

function gapReading(value: number) {
  if (value > 0.02) return "Reception more joy-leaning";
  if (value < -0.02) return "Narrative more joy-leaning";
  return "Narrative and reception closely align";
}

const comparisonOrder = ["AU", "BR", "CN", "EG", "DE", "US"];
const forestTicks = [0, 0.05, 0.1, 0.15, 0.2, 0.25];
const forestMin = -0.025;
const forestMax = 0.26;
const forestStart = 150;
const forestEnd = 560;

function forestPosition(value: number) {
  return forestStart + ((value - forestMin) / (forestMax - forestMin)) * (forestEnd - forestStart);
}

function CountryEstimatePlot() {
  const orderedCountries = comparisonOrder
    .map((code) => countries.find((country) => country.code === code))
    .filter((country): country is (typeof countries)[number] => Boolean(country));
  const zeroX = forestPosition(0);

  return (
    <svg className="estimate-plot" viewBox="0 0 690 430" role="img" aria-label="Year-adjusted Narrative–Reception Gap estimates with 95 percent confidence intervals for six countries">
      <text className="plot-title" x="18" y="29">Year-adjusted Narrative–Reception Gap by Country</text>
      <text className="plot-subtitle" x="18" y="49">Adjusted mean with 95% confidence interval</text>
      <line className="plot-zero-line" x1={zeroX} x2={zeroX} y1="65" y2="357" />
      {forestTicks.map((tick) => {
        const x = forestPosition(tick);
        return <g key={tick}><line className="plot-grid-line" x1={x} x2={x} y1="65" y2="357" /><text className="plot-tick" x={x} y="382" textAnchor="middle">{tick.toFixed(2)}</text></g>;
      })}
      <text className="plot-zero-label" x={zeroX + 5} y="78">Gap = 0</text>
      {orderedCountries.map((country, index) => {
        const y = 102 + index * 48;
        const [lower, upper] = country.ci;
        return (
          <g key={country.code}>
            <text className="plot-country" x="132" y={y + 4} textAnchor="end">{country.name}</text>
            <line className="plot-ci" x1={forestPosition(lower)} x2={forestPosition(upper)} y1={y} y2={y} />
            <line className="plot-cap" x1={forestPosition(lower)} x2={forestPosition(lower)} y1={y - 5} y2={y + 5} />
            <line className="plot-cap" x1={forestPosition(upper)} x2={forestPosition(upper)} y1={y - 5} y2={y + 5} />
            <circle className="plot-point" cx={forestPosition(country.adjustedGap)} cy={y} r="5" />
            <text className="plot-value" x="675" y={y + 4} textAnchor="end">{formatSigned(country.adjustedGap)}</text>
          </g>
        );
      })}
      <text className="plot-axis" x={(forestStart + forestEnd) / 2} y="415" textAnchor="middle">Year-adjusted Narrative–Reception Gap</text>
    </svg>
  );
}

export function CinematicMap() {
  const [selectedCode, setSelectedCode] = useState<string | null>("DE");
  const [methodOpen, setMethodOpen] = useState(false);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);
  const selected = useMemo(() => countries.find((country) => country.code === selectedCode) ?? null, [selectedCode]);
  const selectCountry = useCallback((code: string) => setSelectedCode(code), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (methodOpen) setMethodOpen(false);
      else if (comparisonOpen) setComparisonOpen(false);
      else setSelectedCode(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [comparisonOpen, methodOpen]);

  return (
    <main className="app-shell">
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />

      <header className="topbar">
        <div className="title-lockup">
          <div className="eyebrow"><span /> CROSS-COUNTRY SAMPLE · 2010–2020 <span /></div>
          <h1 aria-label="Cinematic Emotion Map">
            <span className="title-word title-cinematic">CINEMATIC</span>
            <span className="title-word title-emotion">EMOTION</span>
            <span className="title-word title-map">MAP</span>
          </h1>
          <p>Where narrative representation meets audience reception</p>
        </div>
        <div className="topbar-actions">
          <button className="method-button" type="button" onClick={() => setMethodOpen(true)}><span className="method-icon">i</span>Method &amp; finding</button>
          <button className="compare-button" type="button" onClick={() => setComparisonOpen(true)}><span className="compare-icon">↔</span>Compare estimates</button>
        </div>
      </header>

      <section className="workspace" aria-label="Cinematic emotion world map explorer">
        <div className="map-stage">
          <WorldMap2D selectedCode={selectedCode} hoveredCode={hoveredCode} onSelect={selectCountry} onHover={setHoveredCode} />

          <nav className="country-rail" aria-label="Select a country">
            {countries.map((country) => {
              const signal = audienceSignal(country.audienceValence);
              return (
                <button
                  key={country.code}
                  type="button"
                  data-country-card={country.code}
                  className={`country-card${country.code === selectedCode ? " active" : ""}${country.code === hoveredCode ? " linked" : ""}`}
                  onClick={() => selectCountry(country.code)}
                  onMouseEnter={() => setHoveredCode(country.code)}
                  onMouseLeave={() => setHoveredCode(null)}
                  onFocus={() => setHoveredCode(country.code)}
                  onBlur={() => setHoveredCode(null)}
                  aria-pressed={country.code === selectedCode}
                  style={{ "--signal-color": signal.color, "--signal-strength": signal.intensity } as CSSProperties}
                >
                  <span className="card-heading">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="flag" src={country.flagUrl} alt={`${country.name} flag`} /><b>{country.name}</b><i className="country-signal" />
                  </span>
                  <span className="card-gap-label">SENTIMENT GAP</span>
                  <strong className="card-gap">{formatSigned(country.adjustedGap)}</strong>
                  <span className="card-scale-row"><em>Narrative</em><i className="card-scale"><b style={{ left: sentimentPosition(country.officialValence) }} /></i><strong>{formatSigned(country.officialValence)}</strong></span>
                  <span className="card-scale-row"><em>Reception</em><i className="card-scale"><b style={{ left: sentimentPosition(country.audienceValence), background: signal.color }} /></i><strong>{formatSigned(country.audienceValence)}</strong></span>
                  <span className="card-keywords">{country.keywords.slice(0, 3).join(" · ")}</span>
                </button>
              );
            })}
          </nav>

          <div className="legend-card glass-panel">
            <div className="legend-heading"><span>Sentiment Valence</span></div>
            <div className="gradient-bar" />
            <div className="gradient-labels"><span>−1 More sadness</span><span>0 Joy = sadness</span><span>+1 More joy</span></div>
          </div>
        </div>

        <aside className={selected ? "detail-panel glass-panel open" : "detail-panel glass-panel"} aria-live="polite">
          {selected ? (
            <>
              <div className="detail-header">
                <div className="detail-country">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="detail-flag" src={selected.flagUrl} alt={`${selected.name} flag`} /><div><h2>{selected.name}</h2><p>{selected.movies} films · {selected.reviews.toLocaleString()} English reviews</p></div>
                </div>
                <button className="close-button" type="button" onClick={() => setSelectedCode(null)} aria-label="Close country details">×</button>
              </div>

              <section className="metric-block">
                <div className="metric-kicker">SENTIMENT GAP</div>
                <div className="gap-line"><strong>{formatSigned(selected.adjustedGap)}</strong><span>{gapReading(selected.adjustedGap)}</span></div>
                <div className="ci-label">95% CI&nbsp; {formatSigned(selected.ci[0])} to {formatSigned(selected.ci[1])}</div>
                <div className="comparison-bars">
                  <div className="bar-row"><span>Narrative</span><div className="bar-track"><i style={{ left: sentimentPosition(selected.officialValence), background: valenceColor(selected.officialValence) }} /></div><strong>{formatSigned(selected.officialValence)}</strong></div>
                  <div className="bar-row"><span>Reception</span><div className="bar-track"><i style={{ left: sentimentPosition(selected.audienceValence), background: valenceColor(selected.audienceValence) }} /></div><strong>{formatSigned(selected.audienceValence)}</strong></div>
                </div>
              </section>

              <section className="keywords-block">
                <span className="section-kicker">KEYBERT KEYWORDS</span>
                <div className="keyword-cloud">{selected.keywords.map((keyword, index) => <span key={keyword} className={`keyword keyword-${index + 1}`}>{keyword}</span>)}</div>
              </section>

              <section className="movies-block">
                <div className="section-title-row"><div><span className="section-kicker">TOP-VOTED IN SAMPLE</span><h3>Selected films</h3></div><small>TMDB snapshot</small></div>
                <div className="movie-grid">
                  {selected.topMovies.map((movie, index) => (
                    <article className={`movie-card movie-tone-${index + 1}`} key={movie.title}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="movie-poster" src={movie.posterUrl} alt={`${movie.title} film poster`} />
                      <span className="movie-rank">0{index + 1}</span>
                      <div className="movie-copy"><h4>{movie.title}</h4><p>{movie.year} · ★ {movie.rating.toFixed(1)}</p></div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="case-block">
                <div className="section-title-row"><div><span className="section-kicker">EXTREME-GAP CASES</span><h3>Largest sentiment-gap examples</h3></div></div>
                <div className="case-list">
                  {selected.cases.map((caseItem) => (
                    <article className="case-card" key={caseItem.title}>
                      <div className="case-heading"><strong>{caseItem.title}</strong><span className={caseItem.gap >= 0 ? "case-gap positive" : "case-gap negative"}>{formatSigned(caseItem.gap)}</span></div>
                      <p>{caseItem.gap >= 0 ? "Largest positive gap" : "Largest negative gap"}</p>
                      <div className="phrase-columns">
                        <div><span className="phrase-label official">Official Narrative<small>TMDB synopsis</small></span>{caseItem.officialPhrases.map((phrase) => <i key={phrase}>{phrase}</i>)}</div>
                        <div><span className="phrase-label audience">Audience Reception<small>IMDb reviews</small></span>{caseItem.audiencePhrases.map((phrase) => <i key={phrase}>{phrase}</i>)}</div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </>
          ) : <div className="empty-detail"><span className="empty-signal" /><h2>Select a country</h2><p>Choose a card or a beacon to compare the two voices.</p></div>}
        </aside>
      </section>

      <section className="finding-strip glass-panel" aria-label="Main statistical finding">
        <div className="finding-primary"><span className="finding-orbit" aria-hidden="true"><i /></span><div><span className="finding-kicker">MAIN FINDING</span><strong>IMDb audience reception shifts toward joy relative to the official narrative.</strong></div></div>
        <div className="finding-stat"><span>MEAN GAP</span><strong>{formatSigned(globalFinding.meanGap)}</strong><small>95% CI {formatSigned(globalFinding.ci[0])} to {formatSigned(globalFinding.ci[1])}</small></div>
        <div className="finding-positive"><span>POSITIVE-GAP FILMS</span><strong>144 / 209 · 68.9%</strong></div>
        <div className="finding-country"><span>COUNTRY EFFECT</span><strong>Wald p = .559</strong><small>Not significant · HC3</small></div>
        <div className="finding-counts"><strong>{globalFinding.movies}</strong><span>films</span><i /> <strong>{globalFinding.reviews.toLocaleString()}</strong><span>reviews</span></div>
      </section>

      <footer><span>TMDB metadata &amp; official narratives · IMDb audience reception · Python emotion analysis</span><span>NASA Black Marble · Natural Earth boundaries · Poster artwork © respective rights holders</span></footer>

      {methodOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setMethodOpen(false); }}>
          <section className="method-modal glass-panel" role="dialog" aria-modal="true" aria-labelledby="method-title">
            <button className="close-button" type="button" onClick={() => setMethodOpen(false)} aria-label="Close method dialog">×</button>
            <div className="modal-eyebrow">HOW TO READ THE MAP</div>
            <h2 id="method-title">The map traces the shift from narrative to reception.</h2>
            <section className="gap-matters">
              <span>WHY THIS GAP MATTERS</span>
              <p>A film’s narrative can express loss, conflict, or sadness while its audience reception may still be warm, appreciative, or joy-leaning. The Narrative–Reception Gap captures this shift between how a film is represented in its official synopsis and how it is received in IMDb review text.</p>
            </section>
            <p className="method-context">Country refers to film origin, not reviewer nationality. For each film, an English-language emotion model estimates joy and sadness in the official narrative (TMDB synopsis) and matched English IMDb audience reception. Reception refers to emotion expressed in matched English IMDb reviews, not reviewers’ actual psychological states.</p>
            <div className="formula formula-stack">
              <div className="model-line">MODEL = j-hartmann/emotion-english-distilroberta-base</div>
              <div>NARRATIVE VALENCE = P(joy | official) − P(sadness | official)</div>
              <div>RECEPTION VALENCE = mean P(joy | reviews) − mean P(sadness | reviews)</div>
              <div>SENTIMENT GAP = (RECEPTION VALENCE − NARRATIVE VALENCE) ÷ 2</div>
              <span>The Gap represents a directional shift in emotional expression from narrative representation to audience reception, rather than a measure of agreement between two texts. Dividing by 2 keeps the Gap on a −1 to +1 scale for consistent interpretation.</span>
            </div>
            <div className="method-steps">
              <article><strong>01</strong><div><span>Narrative and reception</span><p>Official TMDB descriptions represent the film narrative. Matched English IMDb reviews represent audience reception. The analysis keeps these text sources distinct.</p></div></article>
              <article><strong>02</strong><div><span>Direction of the Gap</span><p>A positive Gap indicates a shift toward joy in reception relative to the narrative; a negative Gap indicates a shift toward sadness in reception relative to the narrative. Values near zero indicate little directional shift.</p></div></article>
            </div>
            <section className="adjustment-note">
              <span>HOW THE COUNTRY ESTIMATE IS YEAR-ADJUSTED</span>
              <p>Country estimates come from <b>Gap ~ country + centered release year</b>, with the United States as the treatment reference. Release year is centered on the sample mean (2015.0), so each displayed country Gap is the model-predicted value at the same release year. The 95% confidence intervals use HC3 robust standard errors.</p>
            </section>
            <div className="method-findings">
              <article><strong>A</strong><div><span>Systematic narrative–reception shift</span><p>Across 209 films and 4,680 reviews, Mean Gap = +0.0889, 95% CI [+0.0619, +0.1159], paired t-test p &lt; .001. IMDb audience reception shifts modestly toward joy overall relative to the official narrative.</p></div></article>
              <article><strong>B</strong><div><span>No reliable country effect</span><p>The year-adjusted joint country comparison is not significant (HC3 Wald p = .559). Country estimates therefore support exploration and organization, not claims of national difference.</p></div></article>
            </div>
            <p className="modal-footnote">The six locations organize the sample geographically. Apparent spatial patterns are hypotheses for further study, not evidence that film emotion clusters geographically.</p>
          </section>
        </div>
      )}

      {comparisonOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setComparisonOpen(false); }}>
          <section className="comparison-modal glass-panel" role="dialog" aria-modal="true" aria-labelledby="comparison-title">
            <button className="close-button" type="button" onClick={() => setComparisonOpen(false)} aria-label="Close country estimates dialog">×</button>
            <div className="modal-eyebrow">COMPARE COUNTRY ESTIMATES</div>
            <h2 id="comparison-title">Adjusted Gap estimates with 95% CI</h2>
            <p>Each point is the country estimate at the sample mean release year (2015.0); horizontal lines show HC3 robust 95% confidence intervals.</p>
            <CountryEstimatePlot />
            <p className="modal-footnote">The joint country effect is not significant (HC3 Wald p = .559); the country estimates should therefore be interpreted descriptively.</p>
          </section>
        </div>
      )}
    </main>
  );
}
