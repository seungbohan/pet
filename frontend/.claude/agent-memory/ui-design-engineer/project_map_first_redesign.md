---
name: Map-first redesign
description: WithPet frontend redesigned to map-first UX inspired by 거지맵.com - map is landing page, bottom nav on mobile, detail panel pattern
type: project
---

WithPet frontend was redesigned from homepage-first to map-first architecture (April 2026).

**Why:** To match the UX pattern of 거지맵.com where the map is the primary interaction surface, not a secondary page.

**How to apply:**
- `/` and `/map` both render MapPage (full-screen map as landing)
- App.jsx conditionally hides TopNav on map pages (map has its own overlay controls)
- BottomNav.jsx provides mobile tab navigation (지도, 피드, 마이) - visible on all pages on mobile
- TopNav.jsx is a slim h-14 sticky nav for non-map pages
- MapPage has: desktop left sidebar (340px place list), right detail panel (420px), mobile bottom sheet with drag states (peek/half/full)
- HomePage.jsx is no longer imported in router but file still exists
- Design tokens in index.css under @theme - pet-orange, pet-cream, pet-brown, etc.
- Tailwind v4 via @tailwindcss/vite plugin (no tailwind.config.js)
