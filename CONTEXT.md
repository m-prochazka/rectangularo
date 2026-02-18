# RECTANGULARO — Project Context
> Drop this file in your project root and paste it to any Claude instance to resume with zero re-explaining.
> Last updated: v3.0 — February 2026

---

## What is this?

**Rectangularo** is a satirical browser-based idle/management game modelled after [Circularo](https://circularo.com) — a real Slovak eSignature SaaS product. The game UI mimics the Circularo web app (purple sidebar, white content area, Circularo-style navigation) but rendered in 8-bit pixel art style with `Press Start 2P` and `VT323` fonts.

The player manages a fictional SaaS company, hiring teams, shipping features, acquiring customers, handling CEO chaos events, deploying to new regions, and staying cash-positive while burn rate climbs.

**Inspiration / parody target:** Circularo.com — real features, real pricing tiers, real addon names are used satirically.

---

## Project Structure

```
rectangularo/
├── index.html    — HTML structure only, no inline JS or CSS
├── style.css     — All styles, full scale system (--s variable)
├── game.js       — Game engine: state, loops, render functions
└── events.js     — All events in named arrays, easily editable
```

**To run:** Open `index.html` in a browser. All 4 files must be in the same folder. No build step, no dependencies, no server needed.

---

## Visual Design

- **Purple sidebar** (`#1e1145`) matching Circularo app screenshot
- **Dark content area** (`#0f0a1e`)
- **Top bar** with: logo, fake search bar, resource chips (Cash, MRR, BURN/mo, Rep, Morale, Tech Debt), notification bell, admin account chip
- **Right panel** with 3 tabs: Tickets · Requests · Pipeline
- **Bottom ticker** scrolling company messages
- **CRT scanline overlay** via `body::after`
- **8-bit fonts:** `Press Start 2P` (headings/buttons) + `VT323` (body/mono text)
- **Scale system:** Everything derives from `--s: 1.5` CSS variable. Default is L (= "150% zoom"). Controls: S / M / L / XL / 2X in sidebar.

---

## Game Mechanics

### Resources (shown in topbar)
| Resource | Description |
|----------|-------------|
| **Cash** | Main currency. Starts €5,000. Goes negative = danger. |
| **MRR** | Monthly Recurring Revenue from paying customers × region multiplier |
| **BURN/mo** | Monthly costs: salaries (€200/headcount) + infra (€500) + regional infra (€300/active non-EU region) |
| **Reputation** | 0–100. Affects tier of incoming customers. Rises with good events, falls with bad ones. |
| **Morale** | 0–100. Multiplies all team efficiency. Falls from crunch debuffs, rises from good events/upgrades. |
| **Tech Debt** | Grows passively (+0.5 every 25 ticks) and from crunch. Slows dev. Testing + DevOps reduce it. |

### Monthly P&L
- Every 600 game ticks = 1 in-game month
- Cash drains silently every tick (proportional)
- At month end: P&L modal pops up showing MRR, salaries, infra costs, net cashflow
- If cash goes negative: warning toast + red flash

### Customers
- Max 60 customers
- 8 plan tiers: Trial Start / Trial Pro / Trial Business / Start (€99) / Pro (€299) / Business (€699) / Ultimate (€2,499) / Enterprise (€4,999)
- Trials can convert to paid at 70%+ satisfaction after 30 ticks (1% chance/tick)
- Churn: trials 4%, satisfaction <20 → 2%, satisfaction <40 → 0.5%
- Satisfaction affected by open tickets (-0.8 per open ticket/tick) and tech debt (-0.03×debt/tick)
- Each active production region adds its `mrrMult` to the total MRR multiplier

### Teams (9 departments)
Each team has: headcount, level, XP, debuffs[], buffs[], efficiency formula:
`eff = debuffMult × (1 + buffs×0.1) × (0.5 + morale/100×0.5)`

| Team | Lead(s) | Function |
|------|---------|----------|
| Sales | Paul White (SD), Lucas Cloakfield | Auto-closes deals, adds customers |
| Support | Kate Shockwell, Michael Stroll | Resolves tickets, improves satisfaction |
| Dev | Dave Rocky McHill, Wes Wonder, Luke Hail | Ships feature backlog (15 core + analyst-queued) |
| DevOps | David Hiswoman | Reduces tech debt, deploys regions |
| Delivery | Atom Kociáš, Michael Heelson | On-prem deployments, training |
| QA/Testing | Sarah Lawton | Passively reduces tech debt every 15 ticks |
| Analyst | Barb Wackley | Analyzes feature requests → auto-queues to dev |
| Finance | Theresa Shackles, Terry Stroll | Slow debt reduction. Terry is NOT HR. |
| Marketing | Luke Oktoberfest, Sharky Simpson | Passive lead gen + manual campaigns |

### Feature Request Workflow (Analyst → Dev)
Feature requests arrive automatically (0.4% × customers/tick, max 10 pending).

**Flow:**
1. Request arrives in Requests view → player clicks **🔬 ANALYZE**
2. Barb Wackley reviews it (progress: `headcount × level × 0.4` per tick)
3. Analysis completes → **automatically pushed to DEV_Q** (no manual accept/reject)
   - Good request (`good: true`): Rep +3, effort = `at×10 + rand(0–20)`. Ships → Rep +, Morale +5
   - Bad request (`good: false`): Morale -10, Tech Debt +10, still queued. Ships → Morale +3

**Request pool (14 entries):**
Blockchain Sigs (good), AI Document Review (good), Native Mobile App (good), Fax Support (bad), Emoji Signatures (bad), Dark Mode (good), GDPR Export (good), SSO/SAML (good), Bulk Signing (good), Sign with Blood (bad), Offline Mode (good), Cert Auto-Renewal (good), MS Teams Integration (good), Undo Signed Contracts (bad)

### Dev Backlog (15 core features + analyst-queued additions)
Dev speed: `headcount × level × teamEff × max(0.25, 1 - techDebt/150) × 0.28`

Core features in order:
1. E-Signature Core Engine (effort 80) → unlocks esig addon, Rep +5
2. Audit Trail & Logging (90) → unlocks audit addon, Rep +8
3. PDF Certificate Signing (100) → unlocks cert addon, Rep +4, Morale +5
4. Multi-Party Workflows (110) → Rep +6, Morale +8
5. REST API v2 (130) → unlocks api addon, Tech Debt -25, Rep +5
6. SAML 2.0 / SSO (120) → unlocks sso addon, Rep +10
7. Custom Branding (80) → unlocks branding addon, Rep +3
8. MS Office 365 Add-On (140) → unlocks ms365 addon, Rep +7, Morale +6
9. On-Prem Deployment Kit (160) → unlocks onprem addon, Deployments+1, Rep +8, Morale +10
10. Custom Email Identity (70) → unlocks emailid addon, Rep +2
11. Advanced Reporting (90) → unlocks reporting addon, Rep +4
12. eSealing with Certificates (110) → unlocks eseal addon, Rep +6
13. Mobile App iOS+Android (180) → unlocks mobile addon, Rep +12, Morale +15
14. AI Document Analysis (220) → Rep +20, Morale +12
15. Custom Workflows Engine (150) → unlocks workflows addon, Rep +9, Morale +8

Analyst-accepted feature requests are appended to DEV_Q after the 15 core items. **Win condition checks all items in DEV_Q** (including analyst additions).

### Add-on Store (5 categories, 15 addons)
Addons unlock when the corresponding feature ships. Selling an addon: charges one-time price + adds monthly rev to a random customer.

| Category | Addons |
|----------|--------|
| Brand & Identity | Custom Branding €149+/mo, Custom Email Identity €49+/mo, Custom Domain €99+/mo |
| Advanced Security | eSealing €199+/mo, SAML/SSO €299+/mo, Qualified Timestamps €99+/mo |
| Customization | Custom Signing Cert €299+/mo, Custom Workflows €349+/mo, Advanced Reporting €99+/mo |
| Enterprise | On-Premise License €4,999 (one-time), REST API €299+/mo, Audit Trail Pro €149+/mo |
| Integrations | MS Office 365 €99+/mo, E-Signature SDK €199+/mo, Mobile SDK €249+/mo |

Custom Domain unlocks via ISO 27001 upgrade (not a dev feature).

### Company Upgrades (12)
| Upgrade | Cost | Effect |
|---------|------|--------|
| CRM System | €800 | Sales level+1, buff |
| Knowledge Base | €600 | Support buff |
| CI/CD Pipeline | €1,500 | Dev + DevOps buffs |
| SLA Agreements | €700 | Rep +10 |
| Observability Stack | €1,200 | Debt -20, DevOps buff |
| HR & People Ops | €1,800 | Morale +15 (Terry relieved) |
| ISO 27001 Cert | €4,000 | Rep +20, unlocks Custom Domain addon |
| Internal AI Tools | €2,500 | All teams get AI buff (+10% eff), Morale +8 |
| Remote-First Policy | €500 | Morale +20 |
| Hackathon | €1,200 | Skip 2 dev features instantly |
| Channel Partner Program | €3,000 | Sales buff (PARTNERS) |
| EU Data Residency | €5,000 | Rep +15 |

### Production Regions
| Region | Cost | MRR Bonus | Compliance |
|--------|------|-----------|------------|
| 🇪🇺 Europe | FREE (home) | ×1.00 (base) | GDPR, eIDAS, ISO 27001 |
| 🇦🇪 UAE/Dubai | €8,000 | +25% to total mult | UAE Pass, TDRA |
| 🇸🇦 Saudi Arabia | €10,000 | +20% to total mult | NAFATH, NCA |
| 🇺🇸 USA | €12,000 | +30% to total mult | ESIGN Act, SOC 2 |

MRR = base revenue × sum of all active region mrrMults. All-regions-active → ×1.75 total.
David Hiswoman's DevOps team deploys regions. Progress bar shown during deployment (rate: `headcount × level × eff × 0.3`/tick).

### Tickets
- Generated at `0.6% × customers/tick` probability
- 20% chance of urgent (deadline: 120 ticks) vs normal (250 ticks)
- Expired urgent ticket: Rep -3, Morale -2, customer satisfaction -10
- Expired normal ticket: Rep -1.5, Morale -1, customer satisfaction -10
- Support team resolves automatically; player can manually resolve via Inbox

### Marketing Campaigns
Luke Oktoberfest + Sharky Simpson run campaigns with a shared cooldown:
- LinkedIn Thought Leadership (€300, 2 leads, 120s cooldown)
- Product Hunt Launch (€500, 4 leads, 200s)
- Industry Conference Booth (€1,200, 6 leads, 300s)
- Cold Email Sequence (€200, 3 leads, 100s)
- Webinar: eSign in 2025 (€400, 4 leads, 150s)

Passive lead gen: Marketing level × 5% chance per 200 ticks.

### Win Condition
All items in DEV_Q done (15 core + any analyst-queued) + all 4 regions active + 15+ customers

---

## All Characters (18 total)

### Leadership
| Key | Name | Role | Emoji | Color |
|-----|------|------|-------|-------|
| joe | Joe Newman | CEO | 👔 | #ff9100 |
| andre | Andre Mochalatte | COO | ⚙️ | #64b5f6 |
| theresa | Theresa Shackles | CFO | 📊 | #f48fb1 |

### Sales
| Key | Name | Role | Emoji |
|-----|------|------|-------|
| paul | Paul White | Sales Director | 💼 |
| lucas | Lucas Cloakfield | Senior Sales | 🤑 |

### Support
| Key | Name | Role | Emoji |
|-----|------|------|-------|
| kate | Kate Shockwell | Customer Lead | 🎧 |
| michael_s | Michael Stroll | Support Specialist | 🙋 |

### Dev
| Key | Name | Role | Emoji |
|-----|------|------|-------|
| dave | Dave Rocky McHill | Dev Lead | 💻 |
| wes | Wes Wonder | Frontend Dev | 🎨 |
| luke_h | Luke Hail | Backend Dev | 🔧 |

### DevOps
| Key | Name | Role | Emoji |
|-----|------|------|-------|
| david | David Hiswoman | DevOps Lead | 🐳 |

### Delivery
| Key | Name | Role | Emoji |
|-----|------|------|-------|
| atom | Atom Kociáš | Delivery Lead | 🚀 |
| michael_h | Michael Heelson | Delivery Engineer | 📦 |

### Other Teams
| Key | Name | Role | Emoji | Notes |
|-----|------|------|-------|-------|
| sarah | Sarah Lawton | QA Lead | 🧪 | Leads Testing team |
| barb | Barb Wackley | Lead Analyst | 🔬 | Analyzes feature requests → auto-queues |
| luke_o | Luke Oktoberfest | Marketing Lead | 📣 | 🍺 |
| sharky | Sharky Simpson | Marketing Specialist | 🦈 | |
| terry | Terry Stroll | Finance (Definitely NOT HR) | 💹 | Running joke: keeps doing HR things |

---

## Events System

Events are in `events.js` split into named arrays — **easy to add new ones**:

```js
const CEO_EVENTS = [...]          // Joe / Andre / Theresa initiated
const LEADERSHIP_EVENTS = [...]   // Dave, Barb, Sarah, Terry, Andre, Theresa
const DELIVERY_EVENTS = [...]     // Atom, David
const SUPPORT_EVENTS = [...]      // Kate, Michael Stroll
const MARKETING_EVENTS = [...]    // Luke O, Sharky
const DEV_EVENTS = [...]          // Luke Hail, Wes Wonder — backend/frontend disasters
const TOOLS_EVENTS = [...]        // Jira, Confluence, Odoo chaos — various characters

const ALL_EVENTS = [...CEO_EVENTS, ...LEADERSHIP_EVENTS, ...]  // 44 total, randomly triggered

const THRESHOLD_EVENTS = { ... }  // 4 events, triggered by metric thresholds (NOT in ALL_EVENTS)
```

### Event structure
```js
{
  from: 'atom',                    // key in CHARS object
  badge: '🚀 DELIVERY INCIDENT',  // shown in modal header
  title: '"Short punchy headline"',
  desc: 'Longer narrative paragraph.',
  choices: [
    {
      label: '🔑 Do the thing',
      cls: 'gr' | 're' | 'mx',    // green/red/mixed (orange)
      effect: 'Short description of consequences',
      action: () => { /* mutate G state */ }
    }
  ]
}
```

### Current events (44 random + 4 threshold = 48 total)
**CEO Events (5):** AI LinkedIn decree, Lucas promised a non-existent feature, VC demo, SignMaster 3000 competitor, SaaStock conference promises

**Leadership Events (7):** Andre's RTO mandate, Theresa cancels Christmas party, Terry approves vacations nobody asked for, Terry creates "Feelings Anonymous" Slack channel, Dave's tech debt crisis, Barb's 40-slide "No" deck, Sarah finds 14 bugs (Dave says 3 are features)

**Delivery Events (6):** VPN expired mid-deployment, customer wants on-prem on iPhone, deployment via MS Teams live stream, Atom joins UAE standup at 3am Prague time, David — client IT blocked port 443, Atom discovers production server is a Samsung smart fridge

**Support Events (2):** Michael Stroll — bank wants beige app (sell branding addon!), Kate at her limit after colour complaint tickets

**Marketing Events (2):** Luke's post accidentally promoted a competitor, Sharky's legally questionable competitor teardown

**Dev Events (9):** Luke Hail — backend is a 47-tab Excel file, no staging (only production), auth is `email.includes('@')`, zero DB indexes, Pavel's 2019 TODO comment, Pavel's Ghost (DB in ex-employee's Docker), Wes Wonder — 18K-line CSS with `.thing`, jQuery triple-stacked on React, z-index disaster (47 values above 9000), aggressive button complaint

**Tools Events (9):** Joe creates 63 undescribed Jira tickets (all CRITICAL), 340 In Progress tickets / fake velocity, someone sets all story points to 1, Terry discovers Confluence (documents the feelings), Andre's architecture doc says TBD since 2021, Confluence onboarding loop, Theresa moves everything to Odoo, Odoo sends invoices to wrong customers, Joe's Blockchain Epic (0 user stories), Andre's 4-word Operational Excellence Framework

**Threshold Events (4, metric-triggered):**
- Tech Debt Crisis (debt > 100): Dave emergency refactor
- Morale Crisis (morale < 30): Andre — team wants a meeting
- High Reputation (rep > 80): Joe — Forbes profile / growth choices
- Low Reputation (rep < 20): Theresa — NPS spiral / damage control

Threshold events have a 3,000–5,000 tick cooldown before re-triggering.

---

## Key Design Decisions

1. **Whole game UI styled like Circularo app** — not just themed, the layout IS the fake Circularo interface
2. **Plan tiers = customer segments** — different customers arrive on different tiers based on reputation
3. **All 18 characters have portraits** in the home screen characters row
4. **Scale system** — `--s: 1.5` default = "150% zoom" equivalent. All px values are `calc(Xpx * var(--s))`
5. **Monthly burn is silent** — cash drains every tick, P&L modal at month end
6. **Terry Stroll meme** — role shows as "Finance (Definitely NOT HR)", two dedicated events where she does HR things unprompted
7. **Andre Mochalatte** is COO — Paul White is Sales Director
8. **Delivery events are the funniest** — Atom Kociáš deploying on a Samsung smart fridge is canon
9. **Events split into separate file** `events.js` — intentional, easy to add/edit
10. **No build tools** — pure vanilla HTML/CSS/JS, open in browser directly
11. **Analyst auto-queue** — once Barb finishes analysis, feature goes straight to dev queue (no manual accept/reject). Good → Rep +3; Bad → Morale -10, Debt +10.
12. **Save/load via localStorage** — autosaves every 30s while unpaused. Manual save/load/delete in Admin view. Note: dynamically added feature requests are not persisted in save (only the 15 core items' done-state is saved).

---

## Known Issues / TODO

- [ ] `Documents` view stats — wired in `renderTopbar()`, verify they update correctly in-game
- [ ] Win condition checks `DEV_Q.every(f=>f.done)` — includes dynamically added analyst items, so player must also ship those to win
- [ ] Feature requests added via analyst are not saved/restored by the save system (only original 15 tracked by index)
- [ ] No sound effects
- [ ] No achievements system
- [x] Wes Wonder and Luke Hail have unique events (DEV_EVENTS array)
- [ ] Lucas Cloakfield could have more sales-related events
- [ ] Marketing campaigns don't affect reputation (only customer count)
- [ ] Terry Stroll events could trigger more frequently (they're beloved)

---

## How to Add a New Event

Open `events.js`, pick the right array (or add a new one), add your event object, done. The engine picks randomly from `ALL_EVENTS`. Example:

```js
// Add to DELIVERY_EVENTS in events.js:
{ from: 'michael_h', badge: '📦 DELIVERY INCIDENT',
  title: 'Michael Heelson: "I shipped to the wrong country again."',
  desc: 'The package arrived in Latvia. The client is in Slovakia. Michael has sent a very apologetic email.',
  choices: [
    { label: '✈️ Emergency courier', cls: 'mx',
      effect: 'Cash -€300. Deployment still happens. Atom pretends not to know.',
      action: () => { G.cash-=300; G.deployments++; log('Michael Heelson: "Delivered. Eventually."','de'); }},
    { label: '🗺️ Make this a Latvian expansion', cls: 'gr',
      effect: 'Morale +15. A new market is born by accident.',
      action: () => { G.morale+=15; log('Michael: "Latvia is actually a great market." Atom: "..."','gr'); }},
  ]},
```

---

## Game State Object Reference (`G`)

```js
G.tick           // current game tick (2 ticks/second at 1x speed)
G.speed          // 0.5 / 1 / 2 / 5
G.paused         // bool
G.cash           // current cash (€)
G.morale         // 0–100
G.reputation     // 0–100
G.techDebt       // 0–∞ (slows dev above 0, caps dev at 0.25× when ≥150)
G.monthTick      // ticks since last month end (resets at 600)
G.monthCount     // how many months have passed
G.monthlyBurn    // last calculated burn
G.customers[]    // array of customer objects
G.tickets[]      // array of ticket objects
G.featureRequests[] // array of feature request objects
G.teams          // { sales, support, dev, devops, delivery, finance, analyst, testing, marketing }
G.regions        // { eu, uae, ksa, usa }
G.devProgress    // current feature progress (resets per feature)
G.mktCooldown    // ticks remaining on marketing campaign cooldown
G.currentView    // active sidebar view
G.activeEvent    // currently showing event (null if none)
G.lastEventTick  // tick when last event fired
G.lastCrisisTick // { techDebt, morale, reputation, lowRep } — threshold cooldowns
```

### Team object shape
```js
G.teams.dev = {
  level: 1,
  headcount: 2,   // dev starts with 2, others start with 1 (marketing starts with 2)
  xp: 0,
  xpMax: 120,
  progress: 0,       // loop accumulator (sales, support, dev, delivery)
  debuffs: [{ label: '🔥 AI CRUNCH', expires: 340 }],
  buffs: ['CI/CD', 'AI']
}
```

### DEV_Q shape
```js
DEV_Q = [
  // 15 static core features (always present)
  { name: 'E-Signature Core Engine', effort: 80, done: false, cat: 'Core', effect: () => {...} },
  // ... 14 more ...

  // Analyst-accepted requests pushed at runtime:
  { name: 'Dark Mode', effort: 22, done: false, cat: 'Feature Request', effect: () => {...} },
]
```

---

## Resuming in Claude Code

You're working in VS Code with Claude Code. The project is a vanilla HTML/CSS/JS game.

**When asking Claude Code for help, you can say things like:**

- *"Add a new delivery event where Michael Heelson accidentally ships to the wrong country"*
- *"Balance the sales loop — customers are coming in too fast early game"*
- *"Add an achievements panel"*
- *"Add more Terry Stroll HR meme events"*
- *"Add Wes Wonder or Luke Hail specific events"*
- *"Fix the save system to persist dynamically added feature requests"*
- *"Add reputation effects to marketing campaigns"*

Claude Code can read the files directly — you don't need to paste code. Just say `read the project files and...`

---

*Built in a single claude.ai conversation, February 2026. Game based on Circularo.com.*
