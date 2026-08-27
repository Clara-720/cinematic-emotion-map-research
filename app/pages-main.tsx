import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CinematicMap } from "./CinematicMap";
import "./globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CinematicMap />
  </StrictMode>,
);
