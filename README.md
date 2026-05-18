# CrickPulse

**Your Second Screen, Your Game.**

CrickPulse is a live cricket streaming companion app built for IPL fans who want more than just watching. It layers a real-time simulated match stream with nine interactive games and features — all visible simultaneously on a single screen. Built with React, TypeScript, Tailwind CSS, and Supabase.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Layout & Responsive Design](#layout--responsive-design)
- [Video Player](#video-player)
- [Score Header](#score-header)
- [Match Simulation Engine](#match-simulation-engine)
- [Gamification & Rewards](#gamification--rewards)
- [Features & Tabs](#features--tabs)
  - [1. Ball Prediction](#1-ball-prediction)
  - [2. Quick XI](#2-quick-xi)
  - [3. Quiz](#3-quiz)
  - [4. Tic-Tac-Toe](#4-tic-tac-toe)
  - [5. Housie (Bingo)](#5-housie-bingo)
  - [6. AI Talk](#6-ai-talk)
  - [7. Player Stocks](#7-player-stocks)
  - [8. Shop](#8-shop)
  - [9. Leaderboard](#9-leaderboard)
- [Notifications](#notifications)
- [Design System](#design-system)
- [Getting Started](#getting-started)

---

## Overview

CrickPulse transforms passive cricket viewing into an active, competitive experience. While a live match plays in the video player, users can predict ball outcomes, build their dream XI, answer cricket trivia, play mini-games, trade virtual player stocks, and compete on a live leaderboard — all without leaving the screen.

The app is designed to feel like a premium streaming service with a built-in gaming layer. Every ball bowled in the match feeds directly into multiple features simultaneously: stocks update, Housie numbers are called, AI commentary refreshes, and the prediction timer resets.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS + custom CSS animations |
| Icons | Lucide React |
| Database | Supabase |
| State Management | React Context + useReducer |
| Fonts | System + custom heading font |

---

## Layout & Responsive Design

CrickPulse adapts its entire layout based on device orientation. No manual toggle is required — it detects orientation automatically and transitions instantly.

### Portrait Mode (Phone / Vertical)

The screen is split into two locked zones:

1. **Fixed header** pinned to the top — always visible, never scrolls away:
   - Video player (16:9 aspect ratio)
   - Live score header with match stats
   - Horizontal tab navigation strip
2. **Scrollable content area** — fills all remaining space below the header down to the bottom navigation bar. Only this zone scrolls; the video is always in view.
3. **Fixed bottom navigation bar** — 5 primary tabs with emoji icons and labels.

A `ResizeObserver` measures the exact pixel height of the header block so the scroll area starts precisely at its bottom edge, regardless of content reflow.

### Landscape Mode (Desktop / Horizontal)

The video expands to fill the entire screen. A persistent **52px icon bar** hugs the right edge at all times, showing:

- A teal circular toggle arrow (`‹ ›`) to open/close the panel
- Emoji icons for all 9 tabs with short labels
- Coin and streak counters at the bottom

Tapping any icon **slides in a 320px glass panel** from the right. The panel contains:
- App header with coin/streak stats and a close button
- A compact horizontal tab strip for switching between features
- Full scrollable tab content

The panel closes smoothly with a `cubic-bezier` slide animation, leaving the icon bar visible as a persistent teaser — the video is never fully obscured. This mirrors the UX pattern of services like JioHotstar where the full-screen experience is preserved while features remain one tap away.

---

## Video Player

The video player is the anchor of the entire layout.

- **Portrait**: occupies the full width at the top of the fixed header block
- **Landscape**: fills the entire screen as a background layer

**Controls:**
- Play / Pause toggle (center overlay, appears on hover)
- Mute / Unmute (top right)
- Fullscreen toggle (top right)

**Overlays:**
- Top gradient fade with a live status badge (pulsing red dot + LIVE / TIMEOUT / INNINGS BREAK text) and a glass-morphism score pill
- Bottom gradient fade with team names, current run rate, and an HD badge

---

## Score Header

Displayed immediately below the video player in portrait mode. Contains:

- **Left**: Batting team emoji, name, and current score (runs/wickets) in large bold type
- **Center**: Phase badge (LIVE / TIMEOUT / INNINGS BREAK), match separator ("vs"), and over count in monospace
- **Right**: Bowling team emoji, name, and current run rate in teal
- **Stats strip**: Horizontally scrollable badges showing the user's current coins, streak, and total points

---

## Match Simulation Engine

CrickPulse simulates a live IPL match in real time. A new ball is generated every 5 seconds automatically.

**Teams**: CSK (batting) vs RCB (bowling)

**Ball outcomes and their weighted probability:**

| Outcome | Weight | Probability |
|---|---|---|
| Dot | 3 | ~23% |
| Single | 4 | ~31% |
| Two | 1 | ~8% |
| Four | 1 | ~8% |
| Six | 1 | ~8% |
| Wicket | 1 | ~8% |
| Wide | 1 | ~8% |

Each ball outcome cascades through the entire app simultaneously: score updates, stocks reprice, Housie calls a number, AI commentary generates a new line, and the prediction cycle resets.

**Innings ends** when 120 balls (20 overs) are bowled or 10 wickets fall.

**Run rate** is calculated as `(score / balls) × 6`.

---

## Gamification & Rewards

A unified reward system ties all features together.

### Currency: CrickCoins (CC)
Virtual coins earned across all tabs. Starting balance: 250 CC.

### Points
Cumulative score used for leaderboard ranking. Starting points: 120.

### Streak
Tracks consecutive correct ball predictions.

| Streak | Multiplier |
|---|---|
| 1–2 | 1× |
| 3–4 | 2× |
| 5+ | 3× |

A wrong prediction or timeout resets the streak to zero.

### Rewards Summary

| Action | Reward |
|---|---|
| Correct ball prediction | 10 pts + 5 CC (× streak multiplier) |
| Lock Quick XI team | +10 CC |
| Quiz answer (fast, < 5 sec) | +10 CC |
| Quiz answer (normal) | +5 CC |
| Win Tic-Tac-Toe | +15 CC |
| Housie First Line | +50 CC |
| Housie Full House | +200 CC + match ticket notification |
| Shop purchase | 5% cashback in CC |

---

## Features & Tabs

### 1. Ball Prediction

The core game. Before each ball is bowled, a 10-second countdown begins.

**How it works:**
- A countdown ring (SVG animated stroke) counts down from 10 seconds
- The ring turns red in the final 3 seconds
- The user taps one of 6 outcome buttons: Dot, Single, Two, Four, Six, Wicket, Wide
- Once tapped, the prediction locks (cannot be changed)
- When the ball is bowled, the result is revealed

**Feedback:**
- Correct: confetti particle burst, teal flash, coins/points added, streak increments
- Incorrect: shake animation, red flash, streak resets, toast shows actual outcome
- Community prediction percentage displayed (what % of players chose each option)

**Stats card** below the predictor shows:
- Total predictions made
- Correct predictions
- Best streak ever
- Total points
- Accuracy percentage bar

**Incentive footer**: Top predictors win real IPL match tickets every week.

---

### 2. Quick XI

Build your match-day dream team under a coin budget.

**Rules:**
- Budget: 100 CC
- Maximum 5 players
- Must assign a captain before locking
- Minimum 3 players + captain to be able to lock

**Player pool (10 players):**

| Player | Team | Cost |
|---|---|---|
| Ruturaj Gaikwad | CSK | 28 CC |
| Devon Conway | CSK | 25 CC |
| MS Dhoni | CSK | 22 CC |
| Ravindra Jadeja | CSK | 26 CC |
| Matheesha Pathirana | CSK | 24 CC |
| Virat Kohli | RCB | 30 CC |
| Faf du Plessis | RCB | 24 CC |
| Glenn Maxwell | RCB | 27 CC |
| Jasprit Bumrah | RCB | 29 CC |
| Mohammed Siraj | RCB | 22 CC |

Tapping a player selects them (teal border + glow). Tapping the "C" button assigns captaincy (2× points multiplier). Locking the team awards +10 CC and freezes the selection.

---

### 3. Quiz

A 10-question cricket trivia sprint during the match.

**Format:**
- 15 seconds per question
- 4 multiple-choice options
- Instant feedback after each answer

**Scoring:**
- Answer within 5 seconds: +10 CC
- Answer within 15 seconds: +5 CC
- Timeout: +0 CC

A countdown ring (red when ≤ 5 seconds) adds urgency. After all 10 questions, a results screen shows final score and total CC earned.

**Topics covered:** IPL records, player stats, historical firsts, ground records, 2025 season data.

---

### 4. Tic-Tac-Toe

Classic 3×3 Tic-Tac-Toe against an AI opponent.

**AI logic (priority order):**
1. Win if possible (complete own 3-in-a-row)
2. Block the player from winning
3. Take center
4. Take any random empty cell

**Rewards:** +15 CC for winning (once per game).

Winning cells highlight with a teal glow for the player and a contrasting color for the AI. The result banner shows Win / Lose / Draw with a Play Again button.

---

### 5. Housie (Bingo)

A cricket-synced bingo game that uses live match data to call numbers.

**How it works:**
- Each player gets a ticket: 15 numbers arranged in 3 rows of 5
- Numbers are drawn from a pool of 90
- Numbers are called automatically after each ball, derived from:
  - Current score modulo 90
  - Current ball count modulo 90
  - 40% chance of a random uncalled number

**Marking:** Tap a called number to mark it on your ticket. Called but unmarked numbers highlight in yellow; marked numbers turn teal.

**Prize tiers:**

| Prize | Condition | Reward |
|---|---|---|
| First Line | Complete any single row | +50 CC |
| Full House | Mark all 15 numbers | +200 CC + match ticket alert |

The last 5 called numbers display in a scrollable row above the ticket, with the most recent one enlarged and gradient-highlighted.

---

### 6. AI Talk

Live match commentary from five wildly different personas.

**Personas:**

| Persona | Style | Example |
|---|---|---|
| Bollywood Bhai | Dramatic Hindi with film references | "CHHHAKKAAA! YE TOH BLOCKBUSTER HIT HAI!" |
| Comedy Uncle | Sarcastic English | "SIX! Now THAT'S content! Finally something to tweet about!" |
| The Professor | Tactical cricket analysis | "Magnificent strike! Estimated 94 meters. Outstanding blend of power and timing." |
| Dadi Maa | Loving grandmother in Hindi | "CHHAKKA! CHHAKKA! Dadi ka dil khush ho gaya!" |
| Hype Beast | Gen-Z slang | "BRUHHH THATS OUTTA HERE! ABSOLUTELY GOATED NO CAP" |

Tap any persona to switch. Commentary generates instantly after every ball with 2–4 variations per outcome per persona (155+ unique lines total). The feed auto-scrolls to the newest entry and retains the last 30 lines.

---

### 7. Player Stocks

A virtual stock market where player prices move in real time based on match events.

**Tracked players:**

| Player | Team | Starting Price |
|---|---|---|
| R. Gaikwad | CSK | 128 |
| MS Dhoni | CSK | 145 |
| R. Jadeja | CSK | 112 |
| V. Kohli | RCB | 162 |
| G. Maxwell | RCB | 134 |
| J. Bumrah | RCB | 155 |

**Price movement rules:**

| Ball Outcome | Price Change |
|---|---|
| Six | +8 to +10 |
| Four | +4 to +6 |
| Wicket | -6 to -9 |
| Dot | -2 to -3 |
| Other | -2 to +2 random |

Each stock also receives ±2 individual noise per ball. Prices are floored at 50. Each card displays the current price, absolute change, percentage change, and a directional arrow (green up / red down).

---

### 8. Shop

A flash sale store with IPL merchandise available during the match.

**Products:**

| Item | Sale Price | Original Price | Discount |
|---|---|---|---|
| CSK Home Jersey 2026 | ₹999 | ₹1,499 | 33% off |
| RCB Cap — Official | ₹299 | ₹499 | 40% off |
| Kohli Phone Case | ₹199 | ₹399 | 50% off |
| CSK Laptop Stickers | ₹99 | ₹149 | 34% off |
| RCB Home Jersey 2026 | ₹999 | ₹1,499 | 33% off |
| CSK Champions Mug | ₹249 | ₹349 | 29% off |

Purchasing any item returns 5% of the sale price as CrickCoins. A "Timeout Deal" badge with countdown creates urgency. The Buy Now button changes to a checkmark confirmation after purchase.

---

### 9. Leaderboard

A live competitive ranking board for the current match.

**How ranking works:**
- Every point earned (predictions, quiz, games) adds to your match score
- Leaderboard sorts all players by points in real time
- Your row is highlighted with a teal border and gradient background so you can find it instantly

**Weekly prizes:**

| Rank | Prize |
|---|---|
| #1 | 2× VIP Match Tickets |
| #2–5 | Premium Stand Tickets |
| #6–20 | Signed Merchandise |
| #21–100 | 500 CrickCoins |

Top 3 positions show medal badges (Gold / Silver / Bronze) instead of numbers.

---

## Notifications

A toast notification system provides instant feedback for every action.

- Toasts appear at the top center of the screen
- Auto-dismiss after 2.5 seconds
- Maximum 3 visible at once (oldest removed first)
- Three types: success (teal), error (red), info (blue)

Examples:
- `Correct! +20 pts • +10 CC` (with 2× streak multiplier)
- `Wrong! It was FOUR. Streak reset.`
- `You win! +15 CrickCoins!`
- `First Line! +50 CrickCoins!`
- `Quiz Complete! +75 CrickCoins`

---

## Design System

### Colors

| Role | Value |
|---|---|
| Primary gradient | Teal #00d4aa → Purple #7c5cfc |
| CSK | Amber #f59e0b |
| RCB | Red #ef4444 |
| Background | Navy #0a0e1a |
| Success | Green #22c55e |
| Warning | Yellow #fbbf24 |
| Coins | Yellow #fbbf24 |
| Streak | Orange #f97316 |

### Glass-morphism
Cards and panels use `rgba(148,163,184,0.1)` backgrounds with `backdrop-filter: blur()` for a layered depth effect throughout.

### Animations

| Class | Effect |
|---|---|
| `animate-fade-in` | Opacity 0 → 1 |
| `animate-slide-up` | Translate + fade on tab switch |
| `animate-shake` | Wiggle on wrong prediction |
| `animate-bounce-in` | Scale bounce for rewards |
| `animate-slide-down` | Toast entrance |
| Countdown ring | SVG stroke-dashoffset interpolation |
| Panel slide | CSS transform + cubic-bezier easing |

### Spacing
8px base unit throughout. Consistent padding and gap values at multiples of 8px (8, 16, 24, 32).

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck
```

Environment variables are configured in `.env`. A Supabase instance is provisioned and ready — no additional database setup required.

---

## Project Structure

```
src/
├── App.tsx                  # Root layout, orientation detection, portrait/landscape layouts
├── main.tsx                 # React entry point
├── index.css                # Global styles, animations, design tokens
├── types.ts                 # TypeScript interfaces and type aliases
├── context/
│   └── GameContext.tsx      # Global state: match simulation, stats, toasts, stocks, commentary
├── components/
│   ├── VideoPlayer.tsx      # Video player with overlays and controls
│   ├── ScoreHeader.tsx      # Live score strip and user stats badges
│   ├── TabNav.tsx           # Horizontal tab navigation (portrait)
│   ├── BottomNav.tsx        # Fixed bottom navigation bar (portrait)
│   ├── ToastContainer.tsx   # Toast notification system
│   └── SplashScreen.tsx     # Animated app intro screen
├── tabs/
│   ├── PredictTab.tsx       # Ball prediction game
│   ├── QuickXITab.tsx       # Dream team builder
│   ├── QuizTab.tsx          # Cricket trivia quiz
│   ├── TicTacToeTab.tsx     # Tic-Tac-Toe vs AI
│   ├── HousieTab.tsx        # Match-synced bingo
│   ├── AITalkTab.tsx        # Multi-persona live commentary
│   ├── StocksTab.tsx        # Virtual player stock market
│   ├── ShopTab.tsx          # IPL merchandise flash sale
│   └── LeaderboardTab.tsx   # Live match leaderboard
└── data/
    ├── players.ts           # Player data, quiz questions, shop products, leaderboard seeds
    └── commentary.ts        # Commentary lines for all personas and ball outcomes
```
