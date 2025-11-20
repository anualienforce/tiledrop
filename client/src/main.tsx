import { createRoot } from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./index.css";

// Set viewport height CSS variable for mobile browsers
// This handles address bar showing/hiding on mobile devices
function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set on load
setViewportHeight();

// Update on resize and orientation change
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);

// Prevent pull-to-refresh on mobile
let lastTouchY = 0;
let preventPullToRefresh = false;

document.addEventListener('touchstart', (e) => {
  if (e.touches.length !== 1) return;
  lastTouchY = e.touches[0].clientY;
  preventPullToRefresh = window.scrollY === 0;
}, { passive: false });

document.addEventListener('touchmove', (e) => {
  const touchY = e.touches[0].clientY;
  const touchYDelta = touchY - lastTouchY;
  lastTouchY = touchY;

  if (preventPullToRefresh && touchYDelta > 0) {
    e.preventDefault();
  }
}, { passive: false });

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
