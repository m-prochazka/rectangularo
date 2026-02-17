// ═══════════════════════════════════════════════════════
//  RECTANGULARO v3 — EVENTS
//  Edit this file to add/change/remove game events.
//  Each event: { from, badge, title, desc, choices[] }
//  choices: { label, cls ('gr'|'re'|'mx'), effect, action }
//  'from' must match a key in CHARS in game.js
// ═══════════════════════════════════════════════════════

const CEO_EVENTS = [

  { from:'joe', badge:'📣 CEO DECREE',
    title:'"WE NEED AI IN THE APP. I SAW A LINKEDIN POST. WE\'RE BEHIND."',
    desc:'Joe Newman forwarded a 4-tweet thread to the entire company at 11:47 PM. Subject: "Read this. This is us." Dave Rocky McHill has gone offline.',
    choices:[
      { label:'🤖 "On it, Joe! AI sprint starts Monday!"', cls:'mx',
        effect:'Dev CRUNCH 60s. Tech debt +20. AI ships faster. Rep +5.',
        action:()=>{ applyDebuff('dev','🔥 AI CRUNCH',60); G.techDebt+=20; G.reputation+=5; skipFeats(1); log('Dave Rocky McHill: "Fine. AI sprint. Wes Wonder and Luke Hail have been warned."','ye'); }},
      { label:'🛡️ "Q3 at earliest, Joe. We\'re busy."', cls:'mx',
        effect:'Joe mood: 😤. Morale -8. BUT: Cash +€500 (saved from rushed dev). Slower but fiscally responsible.',
        action:()=>{ G.morale-=8; G.cash+=500; log('Joe Newman: 😤 "Quarterly thinkers." Dev team does their job properly. Saved development costs: €500. Worth it.','ye'); }},
    ]},

  { from:'joe', badge:'💼 SALES INCIDENT',
    title:'Lucas Cloakfield promised a feature that doesn\'t exist to close a €15K deal.',
    desc:'"Real-time AR collaborative signing with blockchain" promised to BigCorp by Tuesday. Lucas said "it\'s basically done." Dave Rocky McHill has been informed. He is staring at the wall.',
    choices:[
      { label:'🏃 Crunch it — ship something!', cls:'mx',
        effect:'Cash +€15K. Dev CRUNCH 45s. Tech debt +25.',
        action:()=>{ G.cash+=15000; G.techDebt+=25; applyDebuff('dev','💀 LUCAS PROMISED',45); log('Dave Rocky McHill: "What even IS AR signing. I am begging someone."','re'); }},
      { label:'📞 Theresa renegotiates the contract', cls:'mx',
        effect:'Deal €8K. Rep -5. Theresa Shackles earns her salary today.',
        action:()=>{ G.cash+=8000; G.reputation-=5; log('Theresa Shackles: "I fixed it. This will not happen again." Lucas Cloakfield: 😅','ye'); }},
    ]},

  { from:'joe', badge:'💰 INVESTOR MEETING',
    title:'"VC calls in 2 hours. Make the demo AMAZING. Add big numbers. Round up."',
    desc:'Joe is stress-ironing his shirt in the bathroom. The demo environment just crashed. Andre Mochalatte is making "we\'ll figure it out" faces at no one.',
    choices:[
      { label:'🎭 Polish the demo — demo mode ON', cls:'mx',
        effect:'Cash +€8K. Rep -5. Tech debt +10. "Numbers were directionally accurate."',
        action:()=>{ G.cash+=8000; G.reputation-=5; G.techDebt+=10; log('Andre Mochalatte: "The numbers were directionally accurate." Sequoia is calling back.','ye'); }},
      { label:'✅ Show the real product — it\'s good!', cls:'gr',
        effect:'Cash +€3K. Rep +10. Investors respect honesty. Refreshing.',
        action:()=>{ G.cash+=3000; G.reputation+=10; log('Investors: "Refreshing honesty." Joe takes full credit in the debrief.','gr'); }},
    ]},

  { from:'joe', badge:'📰 COMPETITOR ALERT',
    title:'"SIGNMASTER 3000 launched with 50 features, a free tier and a Super Bowl ad."',
    desc:'Joe burst in holding a printout. Lucas Cloakfield sent "we are cooked" in the team channel. Sharky Simpson is already drafting a competitor teardown post.',
    choices:[
      { label:'🚀 Double down — ship faster', cls:'gr',
        effect:'Rep +12. Emergency feature shipped. Morale +8. Sharky writes a killer response.',
        action:()=>{ G.reputation+=12; G.morale+=8; skipFeats(1); log('Sharky Simpson\'s teardown got 50K LinkedIn impressions. Luke Oktoberfest: "That\'s my boy."','gr'); }},
      { label:'😤 Joe subtweets them on LinkedIn', cls:'mx',
        effect:'Morale +15 (team loved it). Rep -10 (everyone saw it).',
        action:()=>{ G.morale+=15; G.reputation-=10; log('Joe Newman: "Some companies launch fast. We build RIGHT 🤔" — 847 reactions.','ye'); }},
    ]},

  { from:'joe', badge:'✈️ JOE\'S CONFERENCE',
    title:'"I\'m at SaaStock. Promised 3 enterprises features we don\'t have yet."',
    desc:'Joe sent a voice memo from the conference bar. Background: jazz. He committed to "AI-native quantum signing" for three Fortune 500s by Q1. Dave Rocky McHill is breathing into a paper bag.',
    choices:[
      { label:'😤 Build what Joe promised (somehow)', cls:'re',
        effect:'Dev + DevOps crunch 50s. Cash +€20K pipeline. Tech debt +30.',
        action:()=>{ applyDebuff('dev','✈️ JOE PROMISES',50); applyDebuff('devops','✈️ JOE PROMISES',50); G.cash+=20000; G.techDebt+=30; log('Dave Rocky McHill: "What is quantum signing. I am BEGGING you."','re'); }},
      { label:'📋 Andre manages expectations', cls:'gr',
        effect:'Cash +€12K. Rep +3. Andre calls back. Joe is mildly embarrassed.',
        action:()=>{ G.cash+=12000; G.reputation+=3; log('Andre Mochalatte: "The pipeline is healthy and the roadmap is intact." Joe learned nothing.','gr'); }},
    ]},

];

const LEADERSHIP_EVENTS = [

  { from:'andre', badge:'⚙️ COO INITIATIVE',
    title:'Andre Mochalatte: "New policy — 5 days/week in office. For culture."',
    desc:'Half the team is remote. The Prague office has 8 desks for 22 people. David Hiswoman already opened LinkedIn. Luke Hail has updated his CV.',
    choices:[
      { label:'🏢 Enforce 5 days — save office culture', cls:'re',
        effect:'Morale -25. DevOps team protesting. BUT: Rep +3 from decisive leadership. Risk of key departures.',
        action:()=>{ G.morale-=25; applyDebuff('devops','RTO PROTEST',60); G.reputation+=3; log('David Hiswoman: "I live in Brno." Andre: "That\'s fine." David: "It is not fine. I live two hours away." Leadership style: controversial but resolute.','re'); }},
      { label:'🏠 Hybrid — 2 days/week compromise', cls:'gr',
        effect:'Morale +10. Nobody fully happy but stable. Rep +5 for pragmatism.',
        action:()=>{ G.morale+=10; G.reputation+=5; log('Hybrid policy adopted. Nobody is perfectly happy. That is the definition of fair leadership.','in'); }},
    ]},

  { from:'theresa', badge:'📉 CFO BUDGET REVIEW',
    title:'Theresa Shackles: "I\'ve reviewed Q3 spend. The Christmas party is cancelled."',
    desc:'The memo arrived at 4:59 PM Friday. #general fills with 🙃. Luke Oktoberfest is furious — he was planning an Oktoberfest theme. Sharky Simpson has filed a formal objection.',
    choices:[
      { label:'🎉 Overrule — party ON!', cls:'gr',
        effect:'Morale +25. Cash -€600. Theresa updates LinkedIn to "Open to Opportunities." Worth it.',
        action:()=>{ G.morale+=25; G.cash-=600; log('Party ON. Theresa did not attend. Luke Oktoberfest brought actual beer. Legendary. Runway is tighter but morale is legendary.','gr'); }},
      { label:'📉 Support Theresa — save runway', cls:'mx',
        effect:'Morale -12 (compromise). Cash saved: €600. Offer team lunch instead (€80). Net: -€80 but realistic.',
        action:()=>{ G.morale-=12; G.cash-=80; log('No party but Luke Oktoberfest got a formal team lunch. Sharky\'s memo: "This is... acceptable." Runway extended slightly.','ye'); }},
    ]},

  { from:'terry', badge:'🙃 TERRY STRIKES AGAIN',
    title:'Terry Stroll (Finance) has approved 4 vacation requests. Nobody asked her to.',
    desc:'Terry sent a company-wide email: "Vacation approved for next week! Enjoy! 😊" She attached a spreadsheet. The spreadsheet is an HR budget template. Terry is NOT HR.',
    choices:[
      { label:'😂 Let it go — morale boost', cls:'gr',
        effect:'Morale +15. Terry is everyone\'s favourite. Finance is briefly chaotic.',
        action:()=>{ G.morale+=15; log('Terry Stroll: "I was just being helpful 😊" Everyone: "We love Terry." Theresa Shackles: 😰','mo'); }},
      { label:'📋 Gently remind Terry she\'s Finance', cls:'mx',
        effect:'Morale +5. Terry: "Oh right! But also, your Q3 budget looks great ✅"',
        action:()=>{ G.morale+=5; log('Terry Stroll: "My mistake! But I did check your leave balances and everyone looks fine 😊"','mo'); }},
    ]},

  { from:'terry', badge:'🙃 TERRY IS HR NOW',
    title:'Terry Stroll has set up a "Feelings Anonymous" Slack channel. Morale is through the roof.',
    desc:'"I know I\'m Finance," Terry wrote, "but Wes Wonder looked sad yesterday so I made a safe space 💜" There are 47 messages already. Theresa Shackles has not been informed.',
    choices:[
      { label:'💜 Bless this. Keep the channel.', cls:'gr',
        effect:'Morale +20. Reputation +3. Terry: "I am still Finance, this is just a hobby."',
        action:()=>{ G.morale+=20; G.reputation+=3; log('Terry Stroll\'s Slack channel: 47 messages. Wes Wonder posted a drawing of a smiling fridge. Morale is exceptional.','mo'); }},
      { label:'📋 Escalate to actual HR', cls:'re',
        effect:'Morale -5. Terry: "Oh right, we don\'t have HR." Awkward silence.',
        action:()=>{ G.morale-=5; log('There is no HR department. Andre Mochalatte googles "how to be HR" for 15 minutes. Terry keeps the channel.','ye'); }},
    ]},

  { from:'dave', badge:'🐛 TECH DEBT CRISIS',
    title:'Dave Rocky McHill: "We need to talk. The codebase is 60% duct tape and prayer."',
    desc:'Dave arrived with a whiteboard. Every box says "here be dragons." One arrow just says "??" with a sad face. Wes Wonder and Luke Hail are nodding very seriously. Sarah Lawton already knew.',
    choices:[
      { label:'🧹 Refactor sprint — 2 weeks, no features', cls:'mx',
        effect:'Dev REFACTOR 70s. Debt -50. Velocity up. Morale +10.',
        action:()=>{ applyDebuff('dev','🔧 REFACTOR SPRINT',70); G.techDebt=Math.max(0,G.techDebt-50); G.morale+=10; log('Dave: "Thank you. Wes Wonder has started humming. That\'s a good sign."','gr'); }},
      { label:'🚀 Ship features — refactor later', cls:'mx',
        effect:'Debt +25. Cash +€3K from faster delivery. Morale -15 (Dave stressed). Quick wins now, consequences later.',
        action:()=>{ G.techDebt+=25; G.cash+=3000; G.morale-=15; log("Dave Rocky McHill's commits: \"fine\", \"working\", \"this is temporary\". It is not temporary. The cash flow this quarter helps though.",'ye'); }},
    ]},

  { from:'barb', badge:'🔬 ANALYST ALERT',
    title:'Barb Wackley: "I\'ve analysed 47 feature requests. 31 are nonsense. 12 are from the CEO."',
    desc:'Barb prepared a 40-slide deck. Slide 1 is titled "No." Slides 2–40 explain why. She is requesting an urgent meeting with Dave Rocky McHill and Sarah Lawton.',
    choices:[
      { label:'📋 Schedule the meeting — Barb deserves this', cls:'gr',
        effect:'Tech debt -15. Bad requests removed. Roadmap cleaned. Barb morale +10.',
        action:()=>{ G.techDebt=Math.max(0,G.techDebt-15); G.reputation+=3; G.morale+=5; log('Barb Wackley has been listened to. The roadmap is 40% cleaner. Dave: \"Finally. FINALLY.\"','gr'); }},
      { label:'🚀 Ship everything — backlog complete', cls:'mx',
        effect:'Debt +15 (bad features). Features skip 3 in backlog. Cash +€2K. Barb morale -15. Speed over quality.',
        action:()=>{ G.techDebt+=15; G.morale-=15; G.cash+=2000; skipFeats(3); applyDebuff('dev','💩 BAD FEATURES',40); log('Barb Wackley: "Fine. I am taking an early lunch." Bad features ship faster. Customers complain later. But you got the cash now.','ye'); }},
    ]},

  { from:'sarah', badge:'🧪 QA ALERT',
    title:'Sarah Lawton: "I found 14 bugs in the release candidate. Dave says 3 are features."',
    desc:'Sarah\'s bug report is detailed. Dave reviewed it and marked 3 as "designed behaviour." Sarah sent back a 12-page counter-analysis. Wes Wonder is staying very far out of it.',
    choices:[
      { label:'✅ Fix all 14 — ship quality', cls:'gr',
        effect:'Dev debuff 25s (bug fixing). Tech debt -15. Rep +5. Morale +8 (doing it right).',
        action:()=>{ applyDebuff('dev','🐛 BUG FIX SPRINT',25); G.techDebt=Math.max(0,G.techDebt-15); G.reputation+=5; G.morale+=8; log('Sarah Lawton: "All 14 fixed. Shipping clean." Dave: "She was right about 11 of them." Team morale: ✅','gr'); }},
      { label:'🚀 Ship it now — fix later', cls:'mx',
        effect:'Debt +12. Cash +€1.5K (fast delivery bonus). Rep -3. Sarah morale -8 (frustrated). Speed has consequences.',
        action:()=>{ G.techDebt+=12; G.cash+=1500; G.reputation-=3; G.morale-=8; log('Sarah updated the bug tracker. Every "won\'t fix" now says "customer will find this (if they pay enough)." Faster release. Consequences next sprint.','ye'); }},
    ]},

];

const DELIVERY_EVENTS = [

  { from:'atom', badge:'🔑 VPN EXPIRED',
    title:'Atom Kociáš: "Client VPN expired mid-deployment. I cannot push. I am just sitting here."',
    desc:'Atom has been on-site for 3 hours. The VPN certificate expired in 2022 and IT left for lunch. He sent a photo of himself with a coffee and a 🙃 face. Michael Heelson is on standby.',
    choices:[
      { label:'🔑 Rush emergency VPN cert renewal', cls:'mx',
        effect:'Cash -€200. Deployment done. Atom relieved. Client surprised it worked.',
        action:()=>{ G.cash-=200; G.deployments++; log('Atom Kociáš: "VPN renewed. Deployed. Adding this to my therapy log."','de'); }},
      { label:'📞 Tell Atom to come back tomorrow', cls:'mx',
        effect:'Delivery delayed. Customer satisfaction -10. Atom gets a break.',
        action:()=>{ const c=G.customers[Math.floor(Math.random()*G.customers.length||0)]; if(c)c.satisfaction=Math.max(0,c.satisfaction-10); log('Atom drove home. "Same time tomorrow. Hopefully VPN will exist."','ye'); }},
    ]},

  { from:'atom', badge:'📱 ON-PREM ON A PHONE',
    title:'Customer: "Can you deploy the on-prem version to my iPhone 14 Pro?"',
    desc:'The request came via support. Kate Shockwell forwarded it to Atom Kociáš with just: "👁️👄👁️". Atom has read it four times and is still processing.',
    choices:[
      { label:'📱 "We will... look into it."', cls:'mx',
        effect:'Delivery debuff 20s (Atom confused). Morale +10 (everyone laughed).',
        action:()=>{ applyDebuff('delivery','📱 PHONE DEPLOY???',20); G.morale+=10; log('Michael Heelson is crying laughing. Michael Stroll is writing it up. They have both seen worse things.','mo'); }},
      { label:'🚫 Politely explain how servers work', cls:'gr',
        effect:'Client calm. Rep +3. Educational moment. Everyone\'s dignity: preserved.',
        action:()=>{ G.reputation+=3; log('Kate Shockwell wrote the most diplomatic explanation in company history. Client understood. Morale +5 internally.','gr'); }},
    ]},

  { from:'atom', badge:'💬 DEPLOYMENT ON TEAMS',
    title:'Atom Kociáš: "Client wants the full on-prem deployment done live on MS Teams during their board meeting."',
    desc:'3-hour deployment. Live on Teams. With the client\'s entire IT board watching. And their CEO, who will ask questions. Atom has requested hazard pay and strong coffee.',
    choices:[
      { label:'🎥 Do it live — it\'s showtime', cls:'mx',
        effect:'Delivery debuff 50s. Cash +€1,500 premium. Rep +5. Atom is stressed but wealthy.',
        action:()=>{ applyDebuff('delivery','🎥 LIVE ON TEAMS',50); G.cash+=1500; G.reputation+=5; log('Atom Kociáš: "We are live." Client CEO: "Is this like Zoom?" Atom has muted his mic and is screaming internally.','ye'); }},
      { label:'📋 Require async runbook instead', cls:'gr',
        effect:'Atom relieved. Michael Heelson writes excellent docs. Rep +3. Slower but sane.',
        action:()=>{ G.reputation+=3; log('Atom wrote a 15-page deployment runbook that is actually clear. The client probably read all of it. Probably.','gr'); }},
    ]},

  { from:'atom', badge:'🕐 TIMEZONE DISASTER',
    title:'Atom Kociáš joined the UAE client standup at 3am Prague time.',
    desc:'Atom sent "I am here 🙂" at 3:07am. He attended. He took notes. The coffee was imaginary. Michael Stroll found him asleep on his keyboard at 4am. The notes are surprisingly good.',
    choices:[
      { label:'☕ Set up a coffee subscription for Atom', cls:'gr',
        effect:'Cash -€50. Delivery morale +20. Atom will survive.',
        action:()=>{ G.cash-=50; G.morale+=20; G.teams.delivery.buffs.push('CAFFEINE'); log('Atom Kociáš: "The coffee is real. I am real. Let\'s deploy." Michael Stroll is emotional.','gr'); }},
      { label:'🗓️ Fix the calendar invites (finally)', cls:'gr',
        effect:'Morale +10. Timezone issues resolved forever (probably).',
        action:()=>{ G.morale+=10; log('Andre Mochalatte: "All meetings now show timezone explicitly. This took 2 years and a 3am incident."','in'); }},
    ]},

  { from:'david', badge:'🔒 PORT 443 BLOCKED',
    title:'David Hiswoman: "Client IT blocked ALL outbound ports. Including 443. I don\'t know why."',
    desc:'David tried everything. He sent 4 emails. They all bounced — the email server uses port 443. Michael Heelson is on-site and cannot reach the internet to ask for help about not having internet.',
    choices:[
      { label:'📞 Emergency call to their IT director', cls:'mx',
        effect:'DevOps debuff 30s. Rep -3. Eventually resolved.',
        action:()=>{ applyDebuff('devops','🔒 PORT WAR',30); G.reputation-=3; log('David Hiswoman: "Port 443 is now open." IT team: "We thought that was optional."','ye'); }},
      { label:'🛰️ Mobile hotspot VPN workaround', cls:'gr',
        effect:'Debt +5. Morale +10. David Hiswoman: legend status.',
        action:()=>{ G.techDebt+=5; G.morale+=10; log('David Hiswoman used a hotspot, a VPN tunnel, and hope. It worked. He is a god.','gr'); }},
    ]},

  { from:'atom', badge:'🧊 SMART FRIDGE SERVER',
    title:'Atom Kociáš: "I\'m at the client. Their production server is a Samsung smart fridge."',
    desc:'Atom sent a photo. It is a fridge. It shows a gazpacho recipe. There is a sticky note: "DO NOT DEFROST." The IT manager calls this their "production environment." It has 99.2% uptime.',
    choices:[
      { label:'🍕 Deploy on the fridge. Atom is a professional.', cls:'gr',
        effect:'Deployment +1. Legendary forever. Morale +25. Tech debt +10.',
        action:()=>{ G.deployments++; G.morale+=25; G.techDebt+=10; log('Atom Kociáš: "Rectangularo is now running on a Samsung smart fridge. Uptime is surprisingly good." — Hall of fame.','sh'); }},
      { label:'🖥️ Require proper server first', cls:'mx',
        effect:'Deployment delayed. Customer satisfaction -8. Atom\'s dignity: intact.',
        action:()=>{ const c=G.customers[Math.floor(Math.random()*G.customers.length||0)]; if(c)c.satisfaction=Math.max(0,c.satisfaction-8); log('Atom sent minimum server specs. Client is "reviewing options." The fridge feels betrayed.','ye'); }},
    ]},

];

const SUPPORT_EVENTS = [

  { from:'michael_s', badge:'🎧 SUPPORT CALL',
    title:'Michael Stroll: "Customer called to say the app is too purple. They want beige."',
    desc:'45-minute call. Michael listened professionally the entire time. The client is a bank. Beige brand palette. They want Rectangularo to match. Michael sent the recording to Kate Shockwell with caption: "I need a moment."',
    choices:[
      { label:'🎨 Sell them Custom Branding add-on!', cls:'gr',
        effect:'Cash +€149. Michael Stroll: accidental business development hero.',
        action:()=>{ G.cash+=149; G.addonsSold++; G.morale+=5; log('Michael Stroll sold a Custom Branding add-on from a colour complaint. Lucas Cloakfield: "I taught him that." He did not.','gr'); }},
      { label:'😅 Explain that purple is the brand', cls:'mx',
        effect:'Customer stays (barely). Michael needs a break. Morale -5.',
        action:()=>{ G.morale-=5; log('Michael Stroll: "The app is purple. That is the brand. I am also slightly purple from this call."','ye'); }},
    ]},

  { from:'kate', badge:'😤 KATE\'S LIMIT',
    title:'Kate Shockwell: "If one more person asks why we don\'t have a beige version, I am leaving."',
    desc:'Kate has handled 14 tickets today. Three were about colour. Two were asking if Rectangularo can be used as a PDF reader (it cannot). One person wanted to sign a photo of their cat.',
    choices:[
      { label:'💆 Give Kate a break — support coverage shuffle', cls:'gr',
        effect:'Morale +15. Michael Stroll steps up. Support slightly slower for 30s.',
        action:()=>{ G.morale+=15; applyDebuff('support','KATE\'S DAY OFF',30); log('Kate Shockwell has gone for a walk. Michael Stroll and Michael Heelson are holding the fort. Support is fine.','gr'); }},
      { label:'💪 Kate is built for this — keep going', cls:'mx',
        effect:'Support speed maintained. Kate morale -10. BUT: Rep +5 from exceptional customer handling.',
        action:()=>{ G.morale-=10; G.reputation+=5; log('Kate Shockwell: 🫠 She is fine. She is totally fine. She is not fine. But her tickets are resolved exceptionally. Customers notice.','ye'); }},
    ]},

];

const MARKETING_EVENTS = [

  { from:'luke_o', badge:'📣 MARKETING WIN',
    title:'Luke Oktoberfest: "Our LinkedIn post got 10K impressions! Unfortunately about the wrong product."',
    desc:'Luke\'s post promoted "CircularO" — a rival. Sharky Simpson says autocomplete did it. 200 comments. Half confused, half interested in the competitor. Luke has not made eye contact with anyone.',
    choices:[
      { label:'⚡ Recovery thread — pivot to Rectangularo', cls:'gr',
        effect:'Rep +8. Morale +10. Cash +€500 from curious leads. Sharky saves the day.',
        action:()=>{ G.reputation+=8; G.morale+=10; G.cash+=500; log('Sharky Simpson wrote a comeback thread. 15K impressions. Luke Oktoberfest: "I planned this." Sharky: "You absolutely did not."','gr'); }},
      { label:'📌 Lean into it — share your story', cls:'mx',
        effect:'Rep +2. Morale +5 (honesty). No cash loss. Authentic but slower recovery.',
        action:()=>{ G.reputation+=2; G.morale+=5; log('Luke posted the honest story: "I fat-fingered it." 3K reactions. Humans relate to humans. Slower but builds real engagement.','in'); }},
    ]},

  { from:'sharky', badge:'🦈 SHARKY\'S CAMPAIGN',
    title:'Sharky Simpson: "I wrote a competitor teardown. Legal says I can\'t publish it. I\'m going to publish it."',
    desc:'The document is 12 pages and titled "Why SignMaster 3000 is Just a PDF Reader With Delusions." It is very funny. It is also possibly defamatory. Sharky has scheduled it for 9am.',
    choices:[
      { label:'🚀 Publish it — Sharky knows the industry', cls:'mx',
        effect:'Rep +15 (community loved it). Cash -€2K (legal fees). Morale +20.',
        action:()=>{ G.reputation+=15; G.cash-=2000; G.morale+=20; log('Sharky\'s teardown: 100K impressions. SignMaster 3000 responded. Sharky responded to their response. This is great.','gr'); }},
      { label:'🛑 Edit it to something legally safe', cls:'gr',
        effect:'Morale +10. Rep +5. Sharky happy enough. Legal team relieved.',
        action:()=>{ G.morale+=10; G.reputation+=5; log('Sharky published an edited version titled "A Thoughtful Comparison." Still devastating. Legally fine.','gr'); }},
    ]},

];

// ─── THRESHOLD EVENTS ──────────────────────────────────────
// These are triggered automatically when metrics reach critical thresholds
// They are NOT part of ALL_EVENTS (randomly triggered events)
const THRESHOLD_EVENTS = {

  // TechDebt Crisis: Triggered when techDebt > 100
  techDebtCrisis: {
    from: 'dave',
    badge: '🔥 TECH DEBT EMERGENCY',
    title: 'Dave Rocky McHill: "I cannot work like this. The codebase is actively collapsing."',
    desc: 'Dave has called an all-hands. The whiteboard shows 17 boxes labeled "APOCALYPSE." Wes Wonder and Luke Hail are already updating their CVs. This HAS to be addressed now.',
    choices: [
      { label: '💰 Pay for emergency refactoring sprint (€5K)', cls: 'mx',
        effect: 'Debt -60. Cash -€5K. Dev team: relieved. 3-week crunch.',
        action: ()=>{ G.cash-=5000; G.techDebt=Math.max(0,G.techDebt-60); applyDebuff('dev','💻 EMERGENCY REFACTOR',80); G.morale+=10; G.reputation+=5; G.lastCrisisTick={'techDebt':G.tick}; log('Dave Rocky McHill: "THANK YOU. We are saved."','gr'); }},
      { label: '⏱️ Ignore and ship faster (Quick fix only)', cls: 're',
        effect: 'Debt +40 (short-term band-aid). Cash +€2K (faster velocity). Dave morale -20. Long-term disaster.',
        action: ()=>{ G.techDebt+=40; G.cash+=2000; G.morale-=20; G.reputation-=5; G.lastCrisisTick={'techDebt':G.tick}; log('Dave Rocky McHill: "This is fine 🔥 Not fine. This is bad."','re'); }},
    ]
  },

  // Morale Crisis: Triggered when morale < 30
  moraleCrisis: {
    from: 'andre',
    badge: '😤 MORALE CRISIS',
    title: 'Andre Mochalatte: "The team wants a meeting. They are serious."',
    desc: 'Burnout is real. Kate wants a week off. Dave is committing code with commit messages that are just crying emojis. Michael Stroll sent an email titled "Let\'s Talk." Nobody is okay.',
    choices: [
      { label: '🏖️ Emergency shutdown (1-week company break)', cls: 'gr',
        effect: 'Morale +30. Dev progress paused 200s. Team returns peaceful.',
        action: ()=>{ G.morale=Math.min(100,G.morale+30); applyDebuff('dev','🏖️ COMPANY BREAK',200); applyDebuff('support','🏖️ COMPANY BREAK',200); applyDebuff('sales','🏖️ COMPANY BREAK',200); G.cash-=3000; G.lastCrisisTick={'morale':G.tick}; log('Everyone came back to clean desks and a fruit basket. Joe was confused. Theresa is recalculating burn.','gr'); }},
      { label: '💪 Motivational meeting — push through', cls: 're',
        effect: 'Morale -10 more (backfired). Multiple people resign. Rep -10.',
        action: ()=>{ G.morale=Math.max(0,G.morale-10); G.reputation-=10; const departed=Math.floor(Math.random()*3)+1; G.teams.dev.headcount=Math.max(1,G.teams.dev.headcount-1); log(`${departed} people left the company. Their exit interviews: "I was not heard."`, 're'); G.lastCrisisTick={'morale':G.tick}; }},
    ]
  },

  // High Reputation: Triggered when reputation > 80
  highReputation: {
    from: 'joe',
    badge: '⭐ MARKET LEADER',
    title: 'Joe Newman: "Forbes called. They want to profile us as an innovator."',
    desc: 'Rectangularo is suddenly the industry darling. Enterprise deals are flooding in. Investors are circling. But competition is intensifying. You have THREE choices. Pick wisely.',
    choices: [
      { label: '🚀 Accelerate hiring (rep stays high, costs spike)', cls: 'gr',
        effect: 'Teams +2 headcount each. Cash -€3K/month. Market influence: strong.',
        action: ()=>{ Object.keys(G.teams).forEach(t=>{ G.teams[t].headcount+=2; }); G.reputation=Math.min(100,G.reputation+5); log('Hiring spree. The Prague office now has 40+ people. Andre is happy. Theresa is not.','gr'); G.lastCrisisTick={'reputation':G.tick}; }},
      { label: '💎 Premium positioning (higher prices, lower volume)', cls: 'mx',
        effect: 'Customer acquisition -50%. ASP +€500. Rep +8. Profit margin: better.',
        action: ()=>{ G.reputation+=8; log('Rectangularo is now "premium." Sales cycle 3x longer. But margins are gorgeous.','ye'); G.lastCrisisTick={'reputation':G.tick}; }},
      { label: '🎯 Focus on partnerships (expand influence)', cls: 'gr',
        effect: 'Rep +10. Cash +€5K from partnership deals. New integrations unlock.',
        action: ()=>{ G.reputation+=10; G.cash+=5000; log('Strategic partnerships signed. Rectangularo is now integrated with BIG NAME platforms. Competitors are nervous.','gr'); G.lastCrisisTick={'reputation':G.tick}; }},
    ]
  },

  // Low Reputation: Triggered when reputation < 20
  lowReputation: {
    from: 'theresa',
    badge: '📉 REPUTATION SPIRAL',
    title: 'Theresa Shackles: "Our NPS score is negative. Customers are leaving reviews. Not good reviews."',
    desc: 'Rectangularo\'s reputation is tanking. Support backlog is critical. Bugs are public. The team is exhausted. You need to act NOW before it becomes irreversible.',
    choices: [
      { label: '🛡️ Quality offensive (fix everything, lose speed)', cls: 'gr',
        effect: 'QA sprint 100s. Rep +15. Customer satisfaction +20. No new features this month.',
        action: ()=>{ applyDebuff('dev','🛡️ QUALITY SPRINT',100); applyDebuff('support','🛡️ QUALITY SPRINT',100); G.reputation=Math.min(100,G.reputation+15); G.customers.forEach(c=>{ c.satisfaction=Math.min(100,c.satisfaction+20); }); log('Rectangularo went silent. They fixed EVERYTHING. Customers noticed. Reviews improved.','gr'); G.lastCrisisTick={'reputation':G.tick}; }},
      { label: '📢 PR damage control (spend cash, gain rep fast)', cls: 'mx',
        effect: 'Cash -€2K. Rep +12. Luke and Sharky: PR blitz. Faster but expensive.',
        action: ()=>{ G.cash-=2000; G.reputation=Math.min(100,G.reputation+12); log('Luke Oktoberfest and Sharky Simpson on full PR offense. Industry articles reframed the narrative. Not cheap but effective.','ye'); G.lastCrisisTick={'reputation':G.tick}; }},
      { label: '⚡ Radical move: Free upgrade (appease customers immediately)', cls: 're',
        effect: 'MRR -30%. Rep +8. Customer churn stops. Long-term: margin pressure.',
        action: ()=>{ G.reputation=Math.min(100,G.reputation+8); log('Free Enterprise tier offered to all existing customers. Churn stopped. Revenue: hurt. But company still exists.','ye'); G.lastCrisisTick={'reputation':G.tick}; }},
    ]
  }
};

// Merge all events into one array used by the engine
// To add a new event, add it to the appropriate array above
const ALL_EVENTS = [
  ...CEO_EVENTS,
  ...LEADERSHIP_EVENTS,
  ...DELIVERY_EVENTS,
  ...SUPPORT_EVENTS,
  ...MARKETING_EVENTS,
];
