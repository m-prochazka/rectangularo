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
rectangularo_v3/
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
| **Tech Debt** | Grows passively and from crunch. Slows dev. Testing + DevOps reduce it. |

### Monthly P&L
- Every 600 game ticks = 1 in-game month
- Cash drains silently every tick (proportional)
- At month end: P&L modal pops up showing MRR, salaries, infra costs, net cashflow
- If cash goes negative: warning toast + red flash

### Customers
- Max 60 customers
- 8 plan tiers: Trial Start / Trial Pro / Trial Business / Start (€99) / Pro (€299) / Business (€699) / Ultimate (€2,499) / Enterprise (€4,999)
- Trials can convert to paid at 70%+ satisfaction after 30 ticks
- Churn: trials 4%, low satisfaction 2%
- Satisfaction affected by open tickets and tech debt
- Each active production region multiplies total MRR

### Teams (9 departments)
Each team has: headcount, level, XP, debuffs[], buffs[], efficiency formula:
`eff = debuffMult × (1 + buffs×0.1) × (0.5 + morale/100×0.5)`

| Team | Lead(s) | Function |
|------|---------|----------|
| Sales | Paul White (SD), Lucas Cloakfield | Auto-closes deals, adds customers |
| Support | Kate Shockwell, Michael Stroll | Resolves tickets, improves satisfaction |
| Dev | Dave Rocky McHill, Wes Wonder, Luke Hail | Ships 15-feature backlog |
| DevOps | David Hiswoman | Reduces tech debt, deploys regions |
| Delivery | Atom Kociáš, Michal Patočka, Michael Heelson | On-prem deployments, training |
| QA/Testing | Sarah Lawton | Passively reduces tech debt every 15 ticks |
| Analyst | Barb Wackley | Reviews feature requests (analyze → accept/reject) |
| Finance | Theresa Shackles, Terry Stroll | Slow debt reduction. Terry is NOT HR. |
| Marketing | Luke Oktoberfest, Sharky Simpson | Passive lead gen + manual campaigns |

### Dev Backlog (15 features, in order)
1. E-Signature Core Engine (effort 80) → unlocks esig addon
2. Audit Trail & Logging (90) → unlocks audit addon
3. PDF Certificate Signing (100) → unlocks cert addon
4. Multi-Party Workflows (110)
5. REST API v2 (130) → unlocks api addon, -25 tech debt
6. SAML 2.0 / SSO (120) → unlocks sso addon
7. Custom Branding (80) → unlocks branding addon
8. MS Office 365 Add-On (140) → unlocks ms365 addon
9. On-Prem Deployment Kit (160) → unlocks onprem addon
10. Custom Email Identity (70) → unlocks emailid addon
11. Advanced Reporting (90) → unlocks reporting addon
12. eSealing with Certificates (110) → unlocks eseal addon
13. Mobile App iOS+Android (180) → rep +12, unlocks mobile addon
14. AI Document Analysis (220) → rep +20
15. Custom Workflows Engine (150) → unlocks workflows addon

Dev speed affected by: headcount × level × teamEff × max(0.25, 1 - techDebt/150)

### Add-on Store (5 categories, 15 addons)
Addons unlock when the corresponding feature ships. Selling an addon: charges one-time price + adds monthly rev to a random customer.

| Category | Addons |
|----------|--------|
| Brand & Identity | Custom Branding €149, Custom Email Identity €49, Custom Domain €99 |
| Advanced Security | eSealing €199, SAML/SSO €299, Qualified Timestamps €99 |
| Customization | Custom Signing Cert €299, Custom Workflows €349, Advanced Reporting €99 |
| Enterprise | On-Premise License €4,999 (one-time), REST API €299, Audit Trail Pro €149 |
| Integrations | MS Office 365 €99, E-Signature SDK €199, Mobile SDK €249 |

### Company Upgrades (12)
CRM (+sales level), Knowledge Base (+support), CI/CD (+dev+devops), SLA (rep+10), Observability Stack (debt-20), HR & People Ops (morale+15 — Terry relieved), ISO 27001 (rep+20 + unlocks Custom Domain), Internal AI Tools (all teams +10%), Remote-First (morale+20), Hackathon (skip 2 features), Channel Partners (+sales), EU Data Residency (rep+15)

### Production Regions
| Region | Cost | MRR Bonus | Compliance |
|--------|------|-----------|------------|
| 🇪🇺 Europe | FREE (home) | ×1.00 | GDPR, eIDAS, ISO 27001 |
| 🇦🇪 UAE/Dubai | €8,000 | +25% | UAE Pass, TDRA |
| 🇸🇦 Saudi Arabia | €10,000 | +20% | NAFATH, NCA |
| 🇺🇸 USA | €12,000 | +30% | ESIGN Act, SOC 2 |

David Hiswoman's DevOps team deploys regions. Progress bar shown during deployment.

### Marketing Campaigns
Luke Oktoberfest + Sharky Simpson run campaigns with a cooldown system:
- LinkedIn Thought Leadership (€300, 2 leads, 120s cooldown)
- Product Hunt Launch (€500, 4 leads, 200s)
- Industry Conference Booth (€1,200, 6 leads, 300s)
- Cold Email Sequence (€200, 3 leads, 100s)
- Webinar: eSign in 2025 (€400, 4 leads, 150s)

Passive lead gen: Marketing level × 5% chance per 200 ticks.

### Win Condition
All 15 features shipped + all 4 regions active + 15+ customers

---

## All Characters

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
| michal_p | Michal Patočka | Solutions Architect | 🏗️ |
| michael_h | Michael Heelson | Delivery Engineer | 📦 |

### Other Teams
| Key | Name | Role | Emoji | Notes |
|-----|------|------|-------|-------|
| sarah | Sarah Lawton | QA Lead | 🧪 | Leads Testing team |
| barb | Barb Wackley | Lead Analyst | 🔬 | Reviews feature requests |
| luke_o | Luke Oktoberfest | Marketing Lead | 📣 | 🍺 |
| sharky | Sharky Simpson | Marketing Specialist | 🦈 | |
| terry | Terry Stroll | Finance (Definitely NOT HR) | 💹 | Running joke: keeps doing HR things |

---

## Events System

Events are in `events.js` split into named arrays — **easy to add new ones**:

```js
const CEO_EVENTS = [...]          // Joe / Andre / Theresa initiated
const LEADERSHIP_EVENTS = [...]   // Dave, Barb, Sarah, Terry
const DELIVERY_EVENTS = [...]     // Atom, David, Michal, Michael H
const SUPPORT_EVENTS = [...]      // Kate, Michael Stroll
const MARKETING_EVENTS = [...]    // Luke O, Sharky

const ALL_EVENTS = [...CEO_EVENTS, ...LEADERSHIP_EVENTS, ...]
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

### Current events (29 total)
**CEO Events (5):** AI LinkedIn decree, Lucas promised a non-existent feature, VC demo, SignMaster 3000 competitor, SaaStock conference promises

**Leadership Events (6):** Andre's RTO mandate, Theresa cancels Christmas party, Terry approves vacations nobody asked for, Terry creates "Feelings Anonymous" Slack channel, Dave's tech debt crisis, Barb's 40-slide "No" deck, Sarah finds 14 bugs (Dave says 3 are features)

**Delivery Events (6):** VPN expired mid-deployment, customer wants on-prem on iPhone, deployment via MS Teams live stream, Atom joins UAE standup at 3am Prague time, David — client IT blocked port 443, Atom discovers production server is a Samsung smart fridge

**Support Events (2):** Michael Stroll — bank wants beige app (sell branding addon!), Kate at her limit after colour complaint tickets

**Marketing Events (2):** Luke's post accidentally promoted a competitor, Sharky's legally questionable competitor teardown

---

## Key Design Decisions (from conversation)

1. **Whole game UI styled like Circularo app** — not just themed, the layout IS the fake Circularo interface
2. **Plan tiers = customer segments** — different customers arrive on different tiers based on reputation
3. **All 19 characters have portraits** in the home screen characters row
4. **Scale system** — `--s: 1.5` default = "150% zoom" equivalent. All px values are `calc(Xpx * var(--s))`
5. **Monthly burn is silent** — cash drains every tick, P&L modal at month end
6. **Terry Stroll meme** — role shows as "Finance (Definitely NOT HR)", two dedicated events where she does HR things unprompted
7. **Andre Mochalatte** replaced Paul White as COO — Paul became Sales Director
8. **Delivery events are the funniest** — Atom Kociáš deploying on a smart fridge is canon
9. **Events split into separate file** `events.js` — intentional, easy to add/edit
10. **No build tools** — pure vanilla HTML/CSS/JS, open in browser directly

---

## Known Issues / TODO (as of v3)

- [ ] `Documents` view stats update (doc-proc, doc-dep etc.) — wired in renderTopbar(), verify it works
- [ ] Feature request flow: `analyzeReq` → `acceptReq/rejectReq` could add to dev queue directly
- [ ] Win condition currently: all features + all regions + 15 customers — may want to tune
- [ ] No save/load system yet — game resets on refresh
- [ ] No sound effects
- [ ] No achievements system
- [ ] Wes Wonder and Luke Hail don't have unique events yet
- [ ] Lucas Cloakfield could have more sales-related events
- [ ] Marketing campaigns don't affect reputation (only customer count)
- [ ] Terry Stroll events could trigger more frequently (they're beloved)

---

## How to Add a New Event

Open `events.js`, pick the right array (or add a new one), add your event object, done. The engine picks randomly from `ALL_EVENTS`. Example:

```js
// Add to DELIVERY_EVENTS in events.js:
{ from: 'michal_p', badge: '🏗️ ARCHITECTURE INCIDENT',
  title: 'Michal Patočka: "The client wants to host on their company Alexa."',
  desc: 'An Amazon Echo. In the boardroom. 4GB storage. Michal has sent a photo.',
  choices: [
    { label: '🎙️ Deploy it. Michal is a professional.', cls: 'gr',
      effect: 'Deployment +1. Morale +20. Tech debt +8.',
      action: () => { G.deployments++; G.morale += 20; G.techDebt += 8;
        log('Michal Patočka: "It runs. Do not ask how."', 'sh'); }},
    { label: '🖥️ Require proper infrastructure', cls: 'mx',
      effect: 'Client annoyed. Atom sends minimum server specs.',
      action: () => { G.reputation -= 2;
        log('Michal sent the minimum hardware requirements. The Alexa is sad.', 'ye'); }},
  ]},
```

---

## Game State Object Reference (`G`)

```js
G.tick           // current game tick
G.speed          // 0.5 / 1 / 2 / 5
G.cash           // current cash (€)
G.morale         // 0–100
G.reputation     // 0–100
G.techDebt       // 0–∞ (slows dev above 75)
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
```

### Team object shape
```js
G.teams.dev = {
  level: 1,
  headcount: 2,
  xp: 0,
  xpMax: 120,
  progress: 0,       // loop accumulator (not all teams have this)
  debuffs: [{ label: '🔥 AI CRUNCH', expires: 340 }],
  buffs: ['CI/CD', 'AI']
}
```

---

## Resuming in Claude Code

You're working in VS Code with Claude Code. The project is a vanilla HTML/CSS/JS game.

**When asking Claude Code for help, you can say things like:**

- *"Add a new delivery event where Michael Heelson accidentally ships to the wrong country"*
- *"Balance the sales loop — customers are coming in too fast early game"*
- *"Add a save/load system using localStorage"*
- *"Add an achievements panel"*
- *"Wire up the feature request accept flow to optionally push to the dev queue"*
- *"Add more Terry Stroll HR meme events"*
- *"Add Wes Wonder or Luke Hail specific events"*

Claude Code can read the files directly — you don't need to paste code. Just say `read the project files and...`

---

*Built in a single claude.ai conversation, February 2026. Game based on Circularo.com.*
