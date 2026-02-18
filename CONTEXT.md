# RECTANGULARO — Project Context
> Drop this file in your project root and paste it to any Claude instance to resume with zero re-explaining.
> Last updated: v3.7 — February 2026

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
| **Cash** | Main currency. Starts €12,000. Goes negative = danger. |
| **MRR** | Monthly Recurring Revenue from paying customers × region multiplier |
| **BURN/mo** | Monthly costs: salaries (€450/headcount) + base infra (€2,000) + regional server (€3,000/active non-EU region) + €70/customer |
| **Reputation** | 0–100. Affects tier of incoming customers. Passive decay -1/350t. Ticket backlog (>15) and severe tech debt (>80) accelerate decay. |
| **Morale** | 0–100. Multiplies all team efficiency. Heals +1/200t (cap 80). Drains passively from tech debt >60 and open ticket backlog >10. |
| **Tech Debt** | Grows passively (+2.0 + monthCount×0.08 every 25 ticks, capped at 5.0). Slows dev. Testing + DevOps reduce it (nerfed — debt wins without investment). |

### Monthly P&L
- Every 600 game ticks = 1 in-game month
- Cash drains silently every tick (proportional)
- At month end: P&L modal pops up showing MRR, salaries, infra costs, net cashflow
- If cash goes negative: warning toast + red flash

### Customers
- **Max customers scales with active regions:** EU only → 60, +UAE → 100, +KSA → 150, +USA → 200. `maxCustomers()` helper computes this from active non-EU region count.
- 8 plan tiers: Trial Start / Trial Pro / Trial Business / Start (€99) / Pro (€299) / Business (€699) / Ultimate (€2,499) / Enterprise (€4,999)
- Trials can convert to paid at 70%+ satisfaction after 30 ticks (1% chance/tick)
- **Churn (v3.5+):** trials 4%, satisfaction <20 → 2%, satisfaction <40 → 0.8%, satisfied paid → `monthCount×0.00003` (market pressure baseline, caps at 0.2%)
- **Satisfaction decay:** open tickets (-1.0/ticket/tick), tech debt (-0.05×debt/tick)
- **Ticket generation** scales with time: `0.006 × customers × (1 + monthCount×0.04)`, capped at 3× base rate
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
Addons unlock when the corresponding feature ships. **The sales team automatically pitches and sells unlocked addons** — no manual action required. Each time the sales loop cycle fires, there is a 40% chance of selling a randomly chosen unlocked addon to a random eligible customer (one that doesn't have it yet). One-time price charged on sale, monthly `rev` added to customer MRR.

The addon store view shows status:
- `🔒 Ship to unlock` — feature not yet shipped by dev
- `📞 Sales pitching` — unlocked, at least one customer is eligible
- `✓ All customers covered` — every customer has this addon

| Category | Addons |
|----------|--------|
| Brand & Identity | Custom Branding €149+/mo, Custom Email Identity €49+/mo, Custom Domain €99+/mo |
| Advanced Security | eSealing €199+/mo, SAML/SSO €299+/mo, Qualified Timestamps €99+/mo |
| Customization | Custom Signing Cert €299+/mo, Custom Workflows €349+/mo, Advanced Reporting €99+/mo |
| Enterprise | On-Premise License €4,999 (one-time, no monthly rev), REST API €299+/mo, Audit Trail Pro €149+/mo |
| Integrations | MS Office 365 €99+/mo, E-Signature SDK €199+/mo, Mobile SDK €249+/mo |

Custom Domain unlocks via ISO 27001 upgrade (not a dev feature).

### Company Upgrades (12)
| Upgrade | Cost | Effect |
|---------|------|--------|
| CRM System | €3,200 | Sales level+1, buff |
| Knowledge Base | €2,500 | Support buff |
| CI/CD Pipeline | €6,000 | Dev + DevOps buffs |
| SLA Agreements | €2,800 | Rep +10 |
| Observability Stack | €5,000 | Debt -20, DevOps buff |
| HR & People Ops | €7,000 | Morale +15 (Terry relieved) |
| ISO 27001 Cert | €16,000 | Rep +20, unlocks Custom Domain addon |
| Internal AI Tools | €10,000 | All teams get AI buff (+10% eff), Morale +8 |
| Remote-First Policy | €2,000 | Morale +20 |
| Hackathon | €5,000 | Skip 2 dev features instantly |
| Channel Partner Program | €12,000 | Sales buff (PARTNERS) |
| EU Data Residency | €20,000 | Rep +15 |

### Production Regions
| Region | Deploy Cost | Ongoing Cost | MRR Bonus | Compliance |
|--------|-------------|--------------|-----------|------------|
| 🇪🇺 Europe | FREE (home) | €0/mo | ×1.00 (base) | GDPR, eIDAS, ISO 27001 |
| 🇦🇪 UAE/Dubai | €25,000 | €3,000/mo | +25% to total mult | UAE Pass, TDRA |
| 🇸🇦 Saudi Arabia | €40,000 | €3,000/mo | +20% to total mult | NAFATH, NCA |
| 🇺🇸 USA | €60,000 | €3,000/mo | +30% to total mult | ESIGN Act, SOC 2 |

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
- LinkedIn Thought Leadership (€1,200, 2 leads, 120s cooldown)
- Product Hunt Launch (€2,000, 4 leads, 200s)
- Industry Conference Booth (€5,000, 6 leads, 300s)
- Cold Email Sequence (€800, 3 leads, 100s)
- Webinar: eSign in 2025 (€1,500, 4 leads, 150s)

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
const ANDRE_EVENTS = [...]        // Andre COO fighting Joe/Theresa/Lucas — the good guy

const ALL_EVENTS = [...CEO_EVENTS, ...LEADERSHIP_EVENTS, ...]  // 53 total, randomly triggered

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

### Current events (53 random + 4 threshold = 57 total)
**CEO Events (5):** AI LinkedIn decree, Lucas promised a non-existent feature, VC demo, SignMaster 3000 competitor, SaaStock conference promises

**Leadership Events (7):** Andre's RTO mandate, Theresa cancels Christmas party, Terry approves vacations nobody asked for, Terry creates "Feelings Anonymous" Slack channel, Dave's tech debt crisis, Barb's 40-slide "No" deck, Sarah finds 14 bugs (Dave says 3 are features)

**Delivery Events (6):** VPN expired mid-deployment, customer wants on-prem on iPhone, deployment via MS Teams live stream, Atom joins UAE standup at 3am Prague time, David — client IT blocked port 443, Atom discovers production server is a Samsung smart fridge

**Support Events (2):** Michael Stroll — bank wants beige app (sell branding addon!), Kate at her limit after colour complaint tickets

**Marketing Events (2):** Luke's post accidentally promoted a competitor, Sharky's legally questionable competitor teardown

**Dev Events (9):** Luke Hail — backend is a 47-tab Excel file, no staging (only production), auth is `email.includes('@')`, zero DB indexes, Pavel's 2019 TODO comment, Pavel's Ghost (DB in ex-employee's Docker), Wes Wonder — 18K-line CSS with `.thing`, jQuery triple-stacked on React, z-index disaster (47 values above 9000), aggressive button complaint

**Tools Events (10):** Joe creates 63 undescribed Jira tickets (all CRITICAL), 340 In Progress tickets / fake velocity, someone sets all story points to 1, Terry discovers Confluence (documents the feelings), Andre's architecture doc says TBD since 2021, Confluence onboarding loop, Andre's 4-word Operational Excellence Framework, Theresa moves everything to Odoo, Odoo sends invoices to wrong customers, Joe's Blockchain Epic (0 user stories)

**Andre COO Events (9):** Sprint lockdown (Andre locks sprint after Joe adds tickets at 11pm), Sales intervention (André calls Lucas's client to walk back an impossible ERP promise), CFO standoff (blocks Theresa from dissolving QA), Conference ambush (Joe volunteered dev for live coding demo without telling anyone), Budget war (6-week fight with Theresa for €12K tooling budget), CEO AI decree (Joe announces "AI-first pivot" on LinkedIn at 11pm), Contract cleanup (Andre quietly rewrites 7 Lucas contracts with "unlimited custom development"), The quiet win (Andre silently blocks Joe's mandatory 7am daily culture standup), Hiring freeze (Andre wins 1 approved hire; Joe immediately posts 6 roles on LinkedIn)

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
13. **Addon auto-selling by sales team** — no manual SELL button. Sales team passively pitches unlocked addons each cycle (40% chance per sales loop completion). Addon store shows live status per addon.
14. **Andre as the "good COO"** — 9 dedicated events where Andre acts as the competent pragmatist fighting Joe's chaos, Theresa's cuts, and Lucas's impossible promises. Outcomes are always better when you side with Andre.

---

## Known Issues / TODO

**Confirmed bugs:**
- [x] **Analyst progress bar not updating live** — fixed v3.4: `renderRequests()` now runs alongside `renderFeatures()` in the game loop each frame.
- [x] **Feature requests duplicating** — fixed v3.4: dedup in `featureReqLoop()` checks full `G.featureRequests` (not just pending), blocking same-name re-entry until it falls off the 5-slot done list.

**Other issues:**
- [ ] `Documents` view stats — wired in `renderTopbar()`, verify they update correctly in-game
- [ ] Win condition checks `DEV_Q.every(f=>f.done)` — includes dynamically added analyst items, so player must also ship those to win
- [ ] Feature requests added via analyst are not saved/restored by the save system (only original 15 tracked by index)
- [ ] No sound effects - not nescessary right now
- [ ] No achievements system - not nescessary right now
- [x] Wes Wonder and Luke Hail have unique events (DEV_EVENTS array)
- [x] Addons sold manually with SELL button → now auto-sold by sales team passively
- [x] Andre Mochalatte has dedicated COO events (ANDRE_EVENTS, 9 events)
- [ ] Lucas Cloakfield could have more sales-related events
- [ ] Marketing campaigns don't affect reputation (only customer count)
- [ ] Terry Stroll events could trigger more frequently (they're beloved)
- [ ] Addon sell rate could scale with sales team level (currently flat 40% per cycle)
- [x] Win screen appears multiple times after "Continue to grow" — fixed v3.5: `G.won` flag prevents re-triggering once win condition is met
- [x] MRR too high vs burn — fixed v3.5/v3.7: full economy rebalance in v3.7 (see changelog)
- [x] Tickets clear too fast with many support staff — fixed v3.5: support multiplier 0.9→0.55
- [x] Morale/tech debt/reputation too easy to maintain — fixed v3.5/v3.7: deeper rebalance in v3.7 (passive drains, slower heal, nerfed team reduction)
- [x] Feature requests recycling after analysis — fixed v3.5: `G.usedRequests[]` permanently tracks analyzed names; once seen, a request never regenerates
- [x] Event's are clearly good/bad with no push to pick bad — fixed v3.7: all `cls:'re'` choices now have real short-term temptation (cash, rep, morale upside) with deferred consequences
- [x] Feature requests not generating — fixed v3.7: `pend` → `pending` typo in `featureReqLoop()` was silently crashing the function every call
- [x] Game doesn't pause during events — fixed v3.7: game auto-pauses on event show, restores prior pause state on choice

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

---

## Feature Backlog

Planned features and improvements. Implement these in future sessions.

### Gameplay / Balance
- [x] **Increase max customers** — implemented v3.6: cap scales with active regions (60/100/150/200). `maxCustomers()` helper, displayed as `count / cap` in customers view.
- [x] **Progressive difficulty** — implemented v3.6: ticket gen ×(1+month×0.04), tech debt passive +(month×0.05) per 25t, paid churn baseline +(month×0.00003). All capped at reasonable maximums.

### Content
- [ ] **More ticket templates** — `TKT_POOL` currently has ~15 entries. Add 20–30 more. Mix of: billing/invoice issues, GDPR data requests, "my signature doesn't look like me", enterprise compliance demands, API errors, mobile app crashes, white-label logo complaints, integration failures (MS365, Odoo), SLA breach warnings.
- [ ] **More feature request templates** — `REQ_POOL` currently has 14 entries. Add 10–15 more. Mix of good/bad. Ideas: Zapier Integration (good), Physical Signature Notary (bad), "Add a Confetti Animation on Sign" (bad/fun), Webhook Support (good), Multi-language UI (good), "Make it Feel More Premium" (bad/vague), HIPAA Compliance Mode (good), Print & Sign Support (bad/anachronistic), 2FA / MFA (good), Salesforce CRM Integration (good).
- [ ] Tickets should be linked to certain customers, custoemrs have their own happines implemented, that should changed based on the tickets
- [ ] You should be able to lose customers

### Technical
- [ ] **Save system for analyst-queued items** — dynamically added feature requests via analyst are lost on reload. Needs custom serialization since they have closures as `effect()` functions.
- [ ] **Achievements system** — milestones: first customer, 10 customers, first region, ship all core features, 0 tech debt, etc.

---

## Changelog

### v3.7 — February 2026
- **Event rebalancing — red choices**: All `cls:'re'` choices now have genuine short-term appeal. Pattern: immediate cash/rep/morale upside NOW, deferred consequences. Key changes: Let Joe add sprint tickets (+€10K cash, +5 rep), Honor ERP promise (+€180K deal), Enforce 5-day office (+12 rep instead of +3), Buy Confluence/Jira (+5 rep), Commit to AI pivot (+€30K investor + 15 rep upfront), Fill 6 roles (+20 morale +8 rep), Escalate to HR (+€900 unclaimed budget), Ignore tech debt crisis (+€10K), Motivational meeting (+€3K saved), Joe's conference (+€60K from 3 Fortune 500s). Dev/tools red choices get small cash amounts for saved costs.
- **Region costs drastically increased**: UAE €8K→**€25K** (deploy) + €3K/mo ongoing; KSA €10K→**€40K** + €3K/mo; USA €12K→**€60K** + €3K/mo. Total to unlock all: €125K deploy + €9K/mo ongoing. Regions are now major strategic commitments.
- **Economy rebalance — recurring costs**: Starting cash €5K→**€12K**. Salaries €200→**€450**/headcount. Base infra €700→**€2,000**. Customer infra €20→**€70**/customer. Regional servers €300→**€3,000**/region/mo. Starting burn (12 staff, EU, 0 customers): ~€7,400/mo.
- **Economy rebalance — one-time costs**: All upgrades ~4×. CRM €800→€3,200; KB €600→€2,500; CI/CD €1.5K→€6K; SLA €700→€2,800; Observability €1.2K→€5K; HR €1.8K→€7K; ISO 27001 €4K→€16K; AI Tools €2.5K→€10K; Remote-First €500→€2K; Hackathon €1.2K→€5K; Partners €3K→€12K; EU Data €5K→€20K. Marketing campaigns ~4×: Cold Email €200→€800, LinkedIn €300→€1,200, Webinar €400→€1,500, Product Hunt €500→€2K, Conference €1.2K→€5K. Hire cost base €200→€500 (same 1.5× exponential). Level-up base €500→€800.
- **Tech debt deeper rebalance**: Passive growth 0.8+month×0.05 → **2.0+month×0.08** (cap 5.0). Testing reduction ×0.5→**×0.2**. DevOps reduction ×0.4→**×0.15**. Finance reduction ×0.3→**×0.1**. Debt now wins at low team investment; only actively leveled teams can fight it.
- **Morale passive drain added**: Heal rate 80t→**200t**. Tech debt >60 drains -1 morale every 150t. Open tickets >10 drains -1 morale every 120t.
- **Reputation passive decay added**: -1 rep every 350t (floors at 30). Open tickets >15: -1 rep every 180t. Tech debt >80: -1 rep every 250t. Reputation now requires active management.
- **Bug fix — feature requests**: `pend` undefined variable in `featureReqLoop()` → `pending`. Was silently throwing a ReferenceError every call, completely preventing new feature requests from generating.
- **Event auto-pause**: Game pauses automatically when an event modal appears (`G.paused=true`). Choosing an option restores prior pause state via closure (`wasAlreadyPaused`). Manual pause before event is respected.

### v3.6 — February 2026
- **Scaling customer cap**: `maxCustomers()` function replaces hardcoded 60. Cap: EU only=60, +UAE=100, +KSA=150, +USA=200. Displayed as `count / cap` in customers view. Rewards unlocking regions beyond MRR gains.
- **Progressive difficulty — tickets**: `ticketGenLoop()` multiplies rate by `(1 + monthCount×0.04)`, capped at 3×. By month 12: +48% more tickets. By month 25: 2× tickets.
- **Progressive difficulty — tech debt**: Passive debt per 25 ticks scales from 0.8 to `0.8 + monthCount×0.05`, capped at 3.0. By month 12: 1.4/tick. By month 24: 2.0/tick. Forces ongoing investment in testing/devops.
- **Progressive difficulty — churn**: Satisfied paid customers now have a baseline churn of `monthCount×0.00003` per tick (caps at 0.2%). Simulates market competition and rising expectations. Month 6 = ~0.018%/tick; month 20 = ~0.06%/tick.
- **Churn tightened**: Mid-satisfaction churn (sat<40) raised from 0.5% to 0.8%.
- **Version header**: Updated to v3.5 in prior session; now v3.6.

### v3.5 — February 2026
- **No-recycle feature requests**: `G.usedRequests[]` added to state. Once a request is analyzed, its name is permanently recorded and never regenerates from `REQ_POOL`. Pool exhausts after all 14 entries are seen.
- **Win screen fix**: `G.won` flag added. `checkWin()` sets it on first trigger and returns early on all subsequent calls — "Continue to grow" no longer re-shows the win screen.
- **Balance — burn**: Base infra cost €500→€700. Added `+€20 × customers` scaling infra to `calcBurn()`. At 30 customers: +€1,300/mo extra total burn vs before.
- **Balance — tech debt**: Passive growth +0.8 per 25 ticks (was +0.5, +60% faster). Testing debt reduction 0.9→0.5. DevOps debt reduction 0.8→0.4. Net effect: small teams barely hold debt steady; investment in testing/devops required to drive it down.
- **Balance — morale**: Auto-heal now +1 every 80 ticks (was 60), cap 80 (was 85). Takes longer to recover from events and can't reach as high passively.
- **Balance — satisfaction**: Tech debt satisfaction penalty per tick 0.03→0.05. Open ticket penalty 0.8→1.0 per ticket per tick. Customers lose faith faster when the product is buggy or understaffed.
- **Balance — support**: Support team multiplier 0.9→0.55. Tickets take ~64% longer to resolve per headcount; large support teams no longer trivialize the ticket queue.
- **Save/load**: `usedRequests` and `won` added to both manual save and autosave. Backwards-compatible with old saves (defaults to `[]` and `false`).

### v3.4 — February 2026
- **Bug fix — analyst bar**: `renderRequests()` added to the game loop render block alongside `renderFeatures()`. Analysis progress bar now updates live every frame while features view is open.
- **Bug fix — request duplication**: `featureReqLoop()` dedup now checks all of `G.featureRequests` (not just pending items). Same-named request can't regenerate while an analyzed copy still exists in the 5-slot done list.

### v3.3 — February 2026
- **Andre COO events** (`ANDRE_EVENTS`, 9 events): Andre as the competent pragmatist fighting Joe (CEO), Theresa (CFO), and Lucas (Sales). Events: sprint lockdown, sales intervention, CFO standoff over QA, conference ambush, budget war, CEO AI decree, contract cleanup, the quiet win (7am standup blocked), hiring freeze aftermath.
- **Addon auto-selling**: Removed manual SELL button from addon store. Sales team now automatically pitches unlocked addons each loop cycle (40% chance per completion). Addon view shows live status per addon: `🔒 Ship to unlock` / `📞 Sales pitching` / `✓ All customers covered`. Addon view added to main game loop render calls.
- **Tools Events count corrected**: 10 events (not 9 as previously stated).
- **Total events**: 53 random + 4 threshold = 57.

### v3.2 — February 2026
- **DEV_EVENTS** (9 events): Luke Hail backend disasters (47-tab Excel backend, no staging env, `email.includes('@')` auth, zero DB indexes, Pavel's 2019 TODOs, Pavel's Ghost DB in ex-employee Docker). Wes Wonder frontend chaos (18K-line CSS, jQuery triple-stacked on React, z-index >9000 disaster, aggressive button complaint).
- **TOOLS_EVENTS** (10 events): Jira chaos (Joe's 63 CRITICAL tickets, 340 In Progress, story points all set to 1), Confluence chaos (Terry documents feelings, Andre's TBD architecture doc, onboarding loop, Andre's 4-word framework), Odoo chaos (Theresa moves everything to Odoo, wrong invoices bug, Joe's Blockchain Epic).
- **Bug fix**: Feature requests stopped generating after auto-queue change. Root cause: cap check and pool dedup both operated on full `featureRequests` array (including processed items). Fixed to scope both to `pending` (accepted===null) only. Added array trim in `analystLoop()` to keep pending + last 5 done.

### v3.1 — February 2026
- **Analyst auto-queue**: Removed manual ACCEPT/REJECT buttons. `analystLoop()` now pushes directly to `DEV_Q` on analysis completion. Good requests: Rep +3. Bad requests: Morale -10, Debt +10, queued anyway. `acceptReq()` and `rejectReq()` functions deleted.

### v3.0 — February 2026
- Initial commit: full game engine, 9 teams, 18 characters, 15 core dev features, 15 addons, 12 upgrades, 4 regions, event system, save/load via localStorage, win condition, monthly P&L modal, ticket expiry system, marketing campaigns, customer satisfaction/churn, tech debt passive growth.

---

*Built in VS Code with Claude Code, February 2026. Game based on Circularo.com.*
