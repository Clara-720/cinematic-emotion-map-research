"use client";

import { useEffect, useState, type CSSProperties, type KeyboardEvent } from "react";
import { assetUrl, audienceSignal, countries } from "./data";

type Position = [number, number];
type Geometry = {
  type: "Polygon" | "MultiPolygon";
  coordinates: Position[][] | Position[][][];
};
type Feature = {
  id?: string;
  properties?: { name?: string };
  geometry: Geometry;
};
type FeatureCollection = { type: "FeatureCollection"; features: Feature[] };

type Props = {
  selectedCode: string | null;
  hoveredCode: string | null;
  onSelect: (code: string) => void;
  onHover: (code: string | null) => void;
};

const VIEW_WIDTH = 1200;
const VIEW_HEIGHT = 580;

const markerAnchors: Record<string, [number, number]> = {
  US: [272.2, 163.9],
  BR: [426.9, 335.9],
  DE: [634.8, 125.1],
  EG: [702.7, 203.6],
  CN: [947.3, 174.4],
  AU: [1045.9, 371.4],
};

const connectorAnchors: Record<string, [number, number]> = {
  US: [174, 110], BR: [176, 438], DE: [520, 91],
  EG: [552, 471], CN: [1015, 113], AU: [1002, 447],
};

function project([longitude, latitude]: Position): Position {
  return [
    ((longitude + 180) / 360) * VIEW_WIDTH,
    ((90 - latitude) / 180) * VIEW_HEIGHT,
  ];
}

function ringsForGeometry(geometry: Geometry): Position[][] {
  return geometry.type === "Polygon"
    ? (geometry.coordinates as Position[][])
    : (geometry.coordinates as Position[][][]).flat();
}

function ringToPath(ring: Position[]) {
  let previousX: number | null = null;
  return ring.map((position, index) => {
    const [x, y] = project(position);
    const crossesDateLine = previousX !== null && Math.abs(x - previousX) > VIEW_WIDTH / 2;
    previousX = x;
    return `${index === 0 || crossesDateLine ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ");
}

function featureToPath(feature: Feature) {
  return ringsForGeometry(feature.geometry).map(ringToPath).join(" ");
}

export function WorldMap2D({ selectedCode, hoveredCode, onSelect, onHover }: Props) {
  const [world, setWorld] = useState<FeatureCollection | null>(null);
  const [countryFeatures, setCountryFeatures] = useState<Map<string, Feature>>(new Map());

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch(assetUrl("/data/world.geo.json")).then((response) => response.json() as Promise<FeatureCollection>),
      ...countries.map((country) => fetch(assetUrl(`/data/${country.code}.geo.json`)).then((response) => response.json() as Promise<FeatureCollection>)),
    ])
      .then(([worldCollection, ...featuredCollections]) => {
        if (cancelled) return;
        setWorld(worldCollection);
        setCountryFeatures(new Map(countries.flatMap((country, index) => {
          const feature = featuredCollections[index]?.features[0];
          return feature ? [[country.code, feature] as [string, Feature]] : [];
        })));
      })
      .catch(() => { if (!cancelled) setWorld({ type: "FeatureCollection", features: [] }); });
    return () => { cancelled = true; };
  }, []);

  const onRegionKeyDown = (event: KeyboardEvent<SVGGElement>, code: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(code);
    }
  };

  return (
    <div className="world-map-shell">
      {!world && <div className="map-loading"><span className="empty-signal" /><strong>Drawing the world map</strong></div>}
      {world && world.features.length === 0 && <div className="map-loading"><strong>Map unavailable</strong><span>Use a country card to continue exploring.</span></div>}
      {world && world.features.length > 0 && (
        <svg className="world-map-svg" viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} role="img" aria-labelledby="map-title map-description" preserveAspectRatio="xMidYMid meet">
          <title id="map-title">Interactive two-dimensional world sentiment map</title>
          <desc id="map-description">Select one of six highlighted countries to compare official film narratives with English audience reviews.</desc>
          <defs>
            <filter id="map-soft-glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="7" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <filter id="map-line-glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="2.8" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <filter id="world-aura-blur" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="8" /></filter>
            <radialGradient id="map-ocean" cx="52%" cy="48%" r="62%"><stop offset="0" stopColor="#07305e" stopOpacity=".48" /><stop offset=".55" stopColor="#03182e" stopOpacity=".34" /><stop offset="1" stopColor="#010915" stopOpacity="0" /></radialGradient>
            <linearGradient id="world-land-gradient" gradientUnits="userSpaceOnUse" x1="40" y1="70" x2="1160" y2="490">
              <stop offset="0" stopColor="#1b66ff" />
              <stop offset=".21" stopColor="#24dcff" />
              <stop offset=".43" stopColor="#725eff" />
              <stop offset=".62" stopColor="#f04ed9" />
              <stop offset=".79" stopColor="#ff9d2e" />
              <stop offset="1" stopColor="#ff462f" />
            </linearGradient>
            <pattern id="world-stars" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="5" cy="7" r=".65" fill="#dff8ff" opacity=".72" /><circle cx="18" cy="17" r=".42" fill="#89d5ff" opacity=".56" /></pattern>
          </defs>

          <ellipse className="map-ocean-glow" cx="600" cy="292" rx="570" ry="258" fill="url(#map-ocean)" />
          <g className="map-grid" aria-hidden="true">
            {[180, 360, 540, 720, 900, 1080].map((x) => <line key={`x-${x}`} x1={x} y1="44" x2={x} y2="536" />)}
            {[145, 290, 435].map((y) => <line key={`y-${y}`} x1="35" y1={y} x2="1165" y2={y} />)}
          </g>
          <g className="world-aura" aria-hidden="true">
            {world.features.map((feature, index) => <path key={`aura-${feature.id ?? feature.properties?.name ?? "feature"}-${index}`} d={featureToPath(feature)} />)}
          </g>
          <g className="world-base" aria-hidden="true">
            {world.features.map((feature, index) => <path key={`base-${feature.id ?? feature.properties?.name ?? "feature"}-${index}`} d={featureToPath(feature)} />)}
          </g>
          <g className="world-sparkle" aria-hidden="true">
            {world.features.map((feature, index) => <path key={`sparkle-${feature.id ?? feature.properties?.name ?? "feature"}-${index}`} d={featureToPath(feature)} />)}
          </g>

          <g className="map-connectors" aria-hidden="true">
            {countries.map((country) => {
              const active = country.code === selectedCode || country.code === hoveredCode;
              const signal = audienceSignal(country.audienceValence);
              const [x1, y1] = connectorAnchors[country.code];
              const [x2, y2] = markerAnchors[country.code];
              return <line key={country.code} className={active ? "active" : ""} x1={x1} y1={y1} x2={x2} y2={y2} style={{ "--map-color": signal.color } as CSSProperties} />;
            })}
          </g>

          <g className="featured-countries">
            {countries.map((country) => {
              const feature = countryFeatures.get(country.code);
              if (!feature) return null;
              const active = country.code === selectedCode || country.code === hoveredCode;
              const signal = audienceSignal(country.audienceValence);
              const [markerX, markerY] = markerAnchors[country.code];
              return (
                <g
                  key={country.code}
                  className={active ? "map-country active" : "map-country"}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select ${country.name}`}
                  aria-pressed={country.code === selectedCode}
                  style={{ "--map-color": signal.color, "--signal-strength": signal.intensity } as CSSProperties}
                  onClick={() => onSelect(country.code)}
                  onMouseEnter={() => onHover(country.code)}
                  onMouseLeave={() => onHover(null)}
                  onFocus={() => onHover(country.code)}
                  onBlur={() => onHover(null)}
                  onKeyDown={(event) => onRegionKeyDown(event, country.code)}
                >
                  <path className="country-halo" d={featureToPath(feature)} />
                  <path className="country-shape" d={featureToPath(feature)} />
                  <circle className="signal-ring signal-ring-wide" cx={markerX} cy={markerY} r="15" />
                  <circle className="signal-ring" cx={markerX} cy={markerY} r="8" />
                  <circle className="signal-core" cx={markerX} cy={markerY} r="3.4" />
                </g>
              );
            })}
          </g>
        </svg>
      )}
    </div>
  );
}
