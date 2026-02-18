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

// ─── DEV TEAM EVENTS ───────────────────────────────────────
const DEV_EVENTS = [

  { from:'luke_h', badge:'🔧 BACKEND INCIDENT',
    title:'Luke Hail: "The entire backend data model is a 47-tab Excel spreadsheet. One tab is called \'FINAL_v3_REAL_USE_THIS\'."',
    desc:'Luke Hail opened the repository and found an Excel file named `backend_schema_FINAL_v3_REAL_USE_THIS_2022.xlsx`. Tab 1 is users. Tab 23 is "other stuff." Tab 47 is blank except for one cell that says "ask Pavel." Pavel left in 2021.',
    choices:[
      { label:'🔁 Migrate to a real database', cls:'mx',
        effect:'Dev REFACTOR 90s. Debt -30. Luke morale +25. Pavel cannot be asked.',
        action:()=>{ applyDebuff('dev','📊 EXCEL MIGRATION',90); G.techDebt=Math.max(0,G.techDebt-30); G.morale+=25; log('Luke Hail: "It is done. The Excel is gone. I feel like a new man." Dave Rocky McHill is weeping with relief.','gr'); }},
      { label:'🧩 Keep the Excel — it works, technically', cls:'re',
        effect:'Debt +35. Morale -15. But nothing breaks today. Pavel would be proud.',
        action:()=>{ G.techDebt+=35; G.morale-=15; log('Luke Hail: "Fine. I have added FINAL_v3_REAL_USE_THIS_v2.xlsx. I need a drink." The Excel persists.','re'); }},
    ]},

  { from:'luke_h', badge:'🔧 BACKEND INCIDENT',
    title:'Luke Hail: "There is no staging environment. There is only production."',
    desc:'Luke tried to push a fix to staging. There is no staging. There has never been a staging environment. Dave Rocky McHill says "we\'ve been shipping straight to prod since 2020." Luke Hail has opened a new tab with job listings.',
    choices:[
      { label:'🖥️ Set up a proper staging environment', cls:'gr',
        effect:'Cash -€300. Dev debuff 40s (setup time). Debt -10. Future Luke will thank you.',
        action:()=>{ G.cash-=300; applyDebuff('dev','🖥️ STAGING SETUP',40); G.techDebt=Math.max(0,G.techDebt-10); log('Luke Hail: "Staging is live. We are no longer cowboys." Dave Rocky McHill: "I miss the cowboys era."','gr'); }},
      { label:'🤠 Embrace cowboy culture — YOLO to prod', cls:'re',
        effect:'Debt +20. Morale -10 (Luke specifically). But saves €300 and 40 seconds.',
        action:()=>{ G.techDebt+=20; G.morale-=10; log('Luke Hail commits message: "yolo". Dave: "We are professionals." Sarah Lawton has updated her bug count.','re'); }},
    ]},

  { from:'luke_h', badge:'🔧 BACKEND DISCOVERY',
    title:'Luke Hail: "I found the authentication logic. It\'s: if user.email.includes(\'@\') return true."',
    desc:'Luke Hail has been in the auth module for 20 minutes. He has gone very quiet. Dave Rocky McHill asked if he\'s okay. He sent back a screenshot. Dave has also gone very quiet. Sarah Lawton is writing a bug report. It will be long.',
    choices:[
      { label:'🔐 Emergency auth rewrite — NOW', cls:'gr',
        effect:'Dev SECURITY SPRINT 60s. Debt -15. Rep +5. Nobody finds out.',
        action:()=>{ applyDebuff('dev','🔐 AUTH REWRITE',60); G.techDebt=Math.max(0,G.techDebt-15); G.reputation+=5; log('Luke Hail: "Auth is fixed. Real passwords. Real hashing. Real security. I am okay now." Sarah closed 6 bugs.','gr'); }},
      { label:'📋 Log it as a ticket and prioritise Q3', cls:'re',
        effect:'Debt +25. Rep -8 if discovered. Luke morale -20. Ticket is TKT-0001.',
        action:()=>{ G.techDebt+=25; G.reputation-=8; G.morale-=20; log('Luke Hail created TKT-0001: "Auth is broken fundamentally." Priority: Medium. Due date: Q3. Luke Hail is reconsidering his career.','re'); }},
    ]},

  { from:'luke_h', badge:'🔧 DATABASE HORROR',
    title:'Luke Hail: "The production database has zero indexes. I ran EXPLAIN on a query. It\'s scanning 4 million rows to return one user."',
    desc:'Luke sent a screenshot of the query plan. It is entirely red. Dave Rocky McHill looked at it, turned off his monitor, and stared at the blank screen for two minutes. Wes Wonder has offered to help. He does not know what an index is.',
    choices:[
      { label:'📇 Index everything — all night if needed', cls:'gr',
        effect:'Dev debuff 50s. Debt -20. App speed +massive. Customers notice the improvement.',
        action:()=>{ applyDebuff('dev','📇 INDEXING',50); G.techDebt=Math.max(0,G.techDebt-20); G.customers.forEach(c=>c.satisfaction=Math.min(100,c.satisfaction+8)); log('Luke Hail: "Indexed. Queries went from 12s to 40ms. Wes said it was \'the same but snappier\'. He is correct."','gr'); }},
      { label:'🤔 It\'s been fine so far, maybe leave it', cls:'re',
        effect:'Nothing changes. Until traffic spikes. Debt +15.',
        action:()=>{ G.techDebt+=15; log('Luke Hail: "Fine. We will deal with it when we have to." Dave: "When is that?" Luke: "During the worst possible moment."','ye'); }},
    ]},

  { from:'luke_h', badge:'🔧 LEGACY CODE',
    title:'Luke Hail: "I found a TODO comment from 2019. It says \'fix this properly later\'. I am \'later\'."',
    desc:'Line 847 of api/auth/tokens.js reads: `// TODO fix this properly later — Pavel`. Pavel left in 2021. The comment is below code that manually parses JWT tokens using string split. Luke has counted 34 more Pavel TODOs in the codebase. Dave Rocky McHill has found 12 more. This is fine.',
    choices:[
      { label:'🧹 Pavel Sprint — fix every TODO', cls:'mx',
        effect:'Dev debuff 80s. Debt -40. Morale +10 (closure). RIP Pavel.',
        action:()=>{ applyDebuff('dev','🧹 PAVEL SPRINT',80); G.techDebt=Math.max(0,G.techDebt-40); G.morale+=10; log('Luke Hail: "All 46 Pavel TODOs resolved. I feel like I\'ve been exorcising a ghost." Dave: "Pour one out for Pavel."','gr'); }},
      { label:'📝 Add your own TODO and move on', cls:'re',
        effect:'Debt +10. Another engineer inherits the curse. Circle of life.',
        action:()=>{ G.techDebt+=10; log('Luke Hail added: "// TODO fix this properly later — Luke H." He knows what he did. He knows.','ye'); }},
    ]},

  { from:'wes', badge:'🎨 FRONTEND CRISIS',
    title:'Wes Wonder: "The CSS file is 18,000 lines. There is one class called `.thing`. It is used 847 times."',
    desc:'Wes Wonder has opened `style.css`. His screen is entirely purple comments and overrides. One class, `.thing`, appears 847 times. Its definition changes 23 times. At line 14,220 it sets `color: inherit !important`. Wes has closed the file and opened it again, hoping it changed.',
    choices:[
      { label:'🧹 CSS refactor — introduce a design system', cls:'gr',
        effect:'Frontend debuff 70s. Debt -20. Wes morale +30. `.thing` is finally gone.',
        action:()=>{ applyDebuff('dev','🧹 CSS REFACTOR',70); G.techDebt=Math.max(0,G.techDebt-20); G.morale+=30; log('Wes Wonder: "Design system live. `.thing` is dead. I\'ve never felt so clean." Dave: "You look different. Lighter."','gr'); }},
      { label:'💜 It\'s fine. Add more `.thing`.', cls:'re',
        effect:'Debt +15. Wes adds `.thing2`. This is the way.',
        action:()=>{ G.techDebt+=15; log('Wes Wonder: "I have created `.thing2`. And `.thing2-final`. And `.thing2-final-v2`." The cycle continues.','re'); }},
    ]},

  { from:'wes', badge:'🎨 FRONTEND DISCOVERY',
    title:'Wes Wonder: "The entire frontend is jQuery 1.4 wrapped in jQuery 3.6 wrapped in React. They are fighting."',
    desc:'Wes has found three JavaScript frameworks loaded simultaneously. jQuery 1.4 handles the navigation. jQuery 3.6 handles the forms. React handles a single dropdown. They conflict on every click event. The dropdown has never worked correctly. Nobody noticed because it\'s the timezone selector.',
    choices:[
      { label:'⚛️ Migrate to pure React — end the war', cls:'mx',
        effect:'Dev MIGRATION 100s. Debt -25. 3 bundle size. Wes: liberated.',
        action:()=>{ applyDebuff('dev','⚛️ JQUERY MIGRATION',100); G.techDebt=Math.max(0,G.techDebt-25); G.morale+=15; log('Wes Wonder: "jQuery is gone. Both of them. React rules alone now. The timezone selector works." Everyone looks at the timezone selector. It works.','gr'); }},
      { label:'🕊️ Let them coexist — it\'s character', cls:'re',
        effect:'Debt +20. Bundle size stays horrifying. Timezone selector still broken.',
        action:()=>{ G.techDebt+=20; log('Wes Wonder: "Three frameworks. One dropdown. Zero regrets." He has many regrets.','ye'); }},
    ]},

  { from:'wes', badge:'🎨 DESIGN FEEDBACK',
    title:'Wes Wonder: "A client has asked why the button \'feels aggressive\'. It is a button. It says SUBMIT."',
    desc:'45-minute design review call. The button is `#6200ea` with 2px border-radius. The client felt it was "too assertive" and "demanding." They want it to "ask, not tell." Wes Wonder has transcribed the call. He has sent it to Dave. Dave has forwarded it to Barb without comment.',
    choices:[
      { label:'🎨 Redesign — make it gentle', cls:'gr',
        effect:'Cash +€149 (Custom Branding upsell!). Wes: 😐. Customer: 😊.',
        action:()=>{ G.cash+=149; G.morale+=5; log('Wes Wonder changed the button copy to "Please submit when ready 🙂". The client is delighted. Michael Stroll sold a Custom Branding add-on on the same call.','gr'); }},
      { label:'📋 Explain that buttons are inherently assertive', cls:'mx',
        effect:'Rep +2 (honesty). Client slightly confused. Wes feels vindicated.',
        action:()=>{ G.reputation+=2; log('Wes Wonder\'s explanation was 400 words and technically correct. The client said "fair enough." The button stays. Wes has framed the email.','in'); }},
    ]},

  { from:'wes', badge:'🎨 Z-INDEX EMERGENCY',
    title:'Wes Wonder: "I have found 47 z-index values above 9000. The modal is behind the tooltip. The tooltip is behind the navbar. The navbar is behind a div that does nothing."',
    desc:'Wes has drawn a diagram of the stacking context. It looks like a geological cross-section. One layer is `z-index: 99999`. Another is `z-index: 99998`. They overlap. The thing on 99998 wins because of a CSS specificity edge case from 2020. Wes has labelled this diagram "The Nightmare."',
    choices:[
      { label:'📐 Establish a z-index scale and fix it all', cls:'gr',
        effect:'Dev debuff 45s. Debt -15. Modals work. Tooltips work. Peace.',
        action:()=>{ applyDebuff('dev','📐 Z-INDEX WAR',45); G.techDebt=Math.max(0,G.techDebt-15); G.customers.forEach(c=>c.satisfaction=Math.min(100,c.satisfaction+3)); log('Wes Wonder: "z-index is now 10, 20, 30, 40. Nothing above 50. The Nightmare is over." Dave: "What was at 99999?" Wes: "A loading spinner. Nobody saw it."','gr'); }},
      { label:'🔢 Add z-index: 999999 to fix the immediate issue', cls:'re',
        effect:'Debt +12. Wes adds one more layer to The Nightmare.',
        action:()=>{ G.techDebt+=12; log('Wes Wonder: "Fixed. For now." He knows. He always knows. The diagram gains a new layer. It is labelled "THE DEEPER NIGHTMARE."','re'); }},
    ]},

];

// ─── TOOLS / PROCESS EVENTS ────────────────────────────────
const TOOLS_EVENTS = [

  { from:'joe', badge:'📋 JIRA CHAOS',
    title:'Joe Newman: "I\'ve created 63 Jira tickets since Monday. All marked CRITICAL. All assigned to Dave."',
    desc:'63 tickets. Since Monday. It is Wednesday. None have descriptions. Titles include: "Make it better," "The thing from the meeting," "AI (urgent)," and "???" Dave Rocky McHill\'s Jira notification badge shows 63. He has not opened Jira. He knows.',
    choices:[
      { label:'📋 Dave triages every ticket with Joe', cls:'mx',
        effect:'Dev debuff 40s (triage hell). Morale -10. 60 tickets closed as duplicate. 3 are real.',
        action:()=>{ applyDebuff('dev','📋 JIRA TRIAGE',40); G.morale-=10; log('Dave Rocky McHill: "Of 63 tickets, 3 are real, 12 are duplicates, and one says \'make the logo bigger\' in a font size of 36pt." Joe: "Which one is the AI one?"','ye'); }},
      { label:'🗑️ Close all 63 — Wontfix', cls:'gr',
        effect:'Dev morale +20 (cathartic). Joe morale -5. Tickets: gone.',
        action:()=>{ G.morale+=20; log('Dave Rocky McHill closed 63 tickets as "Won\'t Fix - Insufficient Description." Joe: "I can\'t find my tickets." Dave: "Correct."','gr'); }},
    ]},

  { from:'dave', badge:'📋 JIRA VELOCITY',
    title:'Dave Rocky McHill: "The Jira board has 340 tickets In Progress. Our velocity report says we\'re the most productive team in Europe."',
    desc:'340 tickets have been In Progress for an average of 4 months. The Jira velocity algorithm counts them as active work. The dashboard is green. All KPIs are green. Theresa Shackles showed it to investors. Sarah Lawton has submitted a bug report about the Jira velocity algorithm.',
    choices:[
      { label:'✅ Move real tickets to Done, close the rest', cls:'gr',
        effect:'Debt -10 (honest backlog). Morale +15 (fresh start). Dashboard goes amber. Investors less happy.',
        action:()=>{ G.techDebt=Math.max(0,G.techDebt-10); G.morale+=15; G.reputation-=3; log('Dave Rocky McHill has performed The Great Jira Purge. 280 tickets closed. 60 real. The dashboard is amber. Theresa: "It was greener before." Dave: "It was also lying."','ye'); }},
      { label:'📊 Leave it — the green dashboard is load-bearing', cls:'re',
        effect:'Dashboard stays green. Debt +10 (real work buried). Investors reassured.',
        action:()=>{ G.techDebt+=10; G.cash+=2000; log('The Jira board remains 340 In Progress. The velocity chart is beautiful. Nobody looks too closely. This is fine.','ye'); }},
    ]},

  { from:'sarah', badge:'📋 JIRA INCIDENT',
    title:'Sarah Lawton: "Someone has set every ticket\'s story points to 1. The sprint is \'complete\'. Nothing is done."',
    desc:'Sprint planning this morning: 140 story points committed. Sprint review this afternoon: 140 points "done." Sarah Lawton ran a diff. Every ticket was changed to 1 point at 9:03 AM. The git blame shows the change came from Joe Newman\'s account. Joe says he was "cleaning up."',
    choices:[
      { label:'🔍 Audit and restore real estimates', cls:'gr',
        effect:'Dev debuff 30s. Morale +5 (justice). The sprint is revealed: 12% done.',
        action:()=>{ applyDebuff('dev','🔍 SPRINT AUDIT',30); G.morale+=5; log('Sarah Lawton restored all story points. Actual sprint completion: 12%. Dave Rocky McHill is calm in the way that is not calm. Joe: "12 is close to 100 if you think about it." Joe is incorrect.','ye'); }},
      { label:'🏆 Accept the "completed" sprint — nobody checks', cls:'re',
        effect:'Morale +10 (fake win). Debt +15 (real work ignored). Velocity: impeccable.',
        action:()=>{ G.morale+=10; G.techDebt+=15; log('The sprint was accepted as complete. Velocity: 140 points. Everything is fine. Nothing is fine. Sarah has updated her CV.','re'); }},
    ]},

  { from:'terry', badge:'🙃 TERRY STRIKES AGAIN',
    title:'Terry Stroll (Finance) has discovered Confluence. She has documented The Feelings. In Confluence.',
    desc:'"I know I\'m Finance," Terry wrote in the company Confluence, "but I made a space called \'People & Culture\' because nobody else did 😊." It has 14 pages. One is titled \'How to Tell Someone Their PR Feedback Was Hurtful.\' It has 200 views. Theresa has not been informed.',
    choices:[
      { label:'💜 Terry\'s Confluence space stays — it\'s needed', cls:'gr',
        effect:'Morale +20. Rep +3. Terry: "I am still Finance, this is a side project."',
        action:()=>{ G.morale+=20; G.reputation+=3; log('Terry Stroll\'s Confluence space: 14 pages, 847 total views. The most-read page is \'It\'s Okay to Cry During Retrospectives\'. Dave Rocky McHill has read it 3 times.','mo'); }},
      { label:'📋 Remind Terry that Confluence is for technical docs', cls:'mx',
        effect:'Terry creates a technical doc. It is about feelings. She tried.',
        action:()=>{ G.morale+=5; log('Terry Stroll: "Okay! Here is a technical document." The document is titled \'API Design Best Practices\' and opens with: \'First, how are we FEELING about the API?\'','mo'); }},
    ]},

  { from:'andre', badge:'📚 CONFLUENCE INCIDENT',
    title:'Andre Mochalatte: "Our entire architecture documentation is one Confluence page. Last edited 2021. Section on auth says \'TBD\'."',
    desc:'Andre was onboarding a new client. He opened the architecture doc. It is titled "System Overview (DRAFT)." It has three diagrams. Two are broken image links. The third is a Visio file from 2019. The auth section has said "TBD" for three years. Luke Hail has just learned this exists.',
    choices:[
      { label:'📝 Documentation sprint — rewrite everything', cls:'gr',
        effect:'Dev debuff 50s. Debt -10. Future devs can find things. Luke morale +15.',
        action:()=>{ applyDebuff('dev','📝 DOCS SPRINT',50); G.techDebt=Math.max(0,G.techDebt-10); G.morale+=15; log('Luke Hail and Dave Rocky McHill rewrote the entire architecture doc. 40 pages. Real diagrams. Auth section no longer says TBD. It now accurately says "it\'s complicated."','gr'); }},
      { label:'✏️ Update the date so it looks recent', cls:'re',
        effect:'Nothing changes. Andre is briefly satisfied. TBD persists.',
        action:()=>{ log('Andre Mochalatte updated the "Last Reviewed" date to today. The auth section still says TBD. The Visio file still cannot open. The broken images remain broken. This is the way.','ye'); }},
    ]},

  { from:'dave', badge:'📚 CONFLUENCE LOOP',
    title:'Dave Rocky McHill: "Our onboarding doc links to another doc. That doc links back to the first one. New hires have been going in circles for a week."',
    desc:'Dave traced the onboarding journey. Step 3: "See the Setup Guide." The Setup Guide says "See the Onboarding Doc for prerequisites." Dave has drawn the loop on a whiteboard with an arrow labelled "NEW HIRE IS TRAPPED HERE." Wes Wonder completed onboarding in this loop. He came out different.',
    choices:[
      { label:'🔗 Fix the loop — linear onboarding doc', cls:'gr',
        effect:'Dev debuff 20s. Morale +10. New hires escape. Wes Wonder gets closure.',
        action:()=>{ applyDebuff('dev','📚 DOC SURGERY',20); G.morale+=10; log('Dave Rocky McHill linearised the onboarding docs. The loop is broken. Wes Wonder reread them. "Oh," he said. "Oh no." He is okay.','gr'); }},
      { label:'🧭 Add a warning: "This is a loop. It is intentional."', cls:'mx',
        effect:'Morale +5 (honesty). The loop persists but is now documented.',
        action:()=>{ G.morale+=5; log('Dave added: "⚠️ Note: Steps 3 and 7 reference each other. This is known. Start with Setup Guide." Nobody reads the note. The loop continues.','ye'); }},
    ]},

  { from:'theresa', badge:'📦 ODOO INCIDENT',
    title:'Theresa Shackles: "I have evaluated our tooling. We are moving everything to Odoo. CRM, HR, code reviews, standups, and the feelings channel."',
    desc:'Theresa has sent a 22-slide deck. Slide 1: "Why Odoo." Slides 2–21: Odoo feature list with checkboxes. Slide 22: "Questions?" There are many questions. Dave Rocky McHill\'s question is "what is Odoo." Terry Stroll is excited because Odoo has an HR module.',
    choices:[
      { label:'📦 Pilot Odoo for CRM and finance only', cls:'mx',
        effect:'Cash -€800 (license). Theresa satisfied. Dev team spared. Terry discovers the HR module.',
        action:()=>{ G.cash-=800; G.morale+=5; log('Odoo is live for finance and CRM. Terry Stroll has already found the HR module and onboarded herself. Theresa: "This was not the plan." Terry: "😊"','ye'); }},
      { label:'🚫 Politely decline — we have tools that work', cls:'gr',
        effect:'Theresa morale -10. Dev team morale +15. Existing tools remain. Terry is briefly sad.',
        action:()=>{ G.morale+=15; log('Dave Rocky McHill: "With respect, Jira and Confluence are already broken in ways we understand. Odoo would be broken in ways we do not." Theresa: "That is not a compelling argument." Dave: "I know."','gr'); }},
    ]},

  { from:'atom', badge:'📦 ODOO INCIDENT',
    title:'Atom Kociáš: "The Odoo integration is sending deployment invoices to the wrong customers. Three different banks have called us."',
    desc:'Odoo has been live for two weeks. The invoice automation mapped "customer" to "last alphabetical entry in CRM." Every Rectangularo deployment invoice has gone to Acme Corp. Acme Corp is a trial customer. They have received €47,000 in invoices. They are confused but politely curious.',
    choices:[
      { label:'🔧 Fix the mapping, refund Acme Corp', cls:'gr',
        effect:'Cash -€200 (goodwill credit). Rep +5. Atom fixes it in 20 minutes. Theresa watches silently.',
        action:()=>{ G.cash-=200; G.reputation+=5; log('Atom Kociáš fixed the Odoo mapping. Acme Corp received a €200 credit and a very apologetic email. Acme Corp converted to Pro tier. Worst case becomes best case.','gr'); }},
      { label:'💡 Sell Acme Corp on what they\'ve received', cls:'mx',
        effect:'Cash +€1,500 if they convert. Morale +10. Legally grey.',
        action:()=>{ G.cash+=1500; G.morale+=10; log('Lucas Cloakfield called Acme Corp. "How\'d you like to formalise this arrangement?" Acme Corp signed. Lucas claims this was his plan. It was not his plan.','ye'); }},
    ]},

  { from:'joe', badge:'📋 JIRA EPIC',
    title:'"I\'ve added BLOCKCHAIN INTEGRATION as a Jira Epic. Q1 delivery. 0 user stories. Dave\'s team is assigned."',
    desc:'The epic exists. It has a priority of BLOCKER. It has a due date of end of Q1. It has zero tickets, zero acceptance criteria, and zero definition of what blockchain means in this context. Dave Rocky McHill has read it 6 times. Each time he finds it less clear. Luke Hail has typed and deleted a Slack message 4 times.',
    choices:[
      { label:'🔗 Ask Joe what blockchain means here, specifically', cls:'gr',
        effect:'Joe explains for 40 minutes. The epic becomes clearer: it means "distributed ledger for signatures." This is 3 existing features rebranded.',
        action:()=>{ G.morale+=5; log('Joe Newman explained blockchain for 40 minutes. Summary: he wants immutable audit logs with a fancy name. Luke Hail: "We have that. It ships in 2 weeks." Joe: "Call it blockchain."','gr'); }},
      { label:'💀 Start scoping it — estimate 500 points', cls:'mx',
        effect:'Dev debuff 35s (scoping theatre). Morale -10. The epic now has tickets. Nobody is happier.',
        action:()=>{ applyDebuff('dev','🔗 BLOCKCHAIN SCOPE',35); G.morale-=10; G.techDebt+=10; log('Luke Hail created 23 tickets in the blockchain epic. Ticket 1: "Define blockchain." Ticket 2: "Confirm what blockchain is." Ticket 23: "Reconsider." Dave approved all of them.','re'); }},
    ]},

  { from:'andre', badge:'📚 CONFLUENCE EXCELLENCE',
    title:'Andre Mochalatte: "I\'ve written our Operational Excellence Framework. In Confluence. It is 4 words: \'Do better. Work smarter.\'"',
    desc:'Andre published the framework at 8am. It is pinned to the company Confluence homepage. It has 4 words across 2 sentences. There are 3 comments. Kate Shockwell: "Love this! 🙌". Dave Rocky McHill: "What does this mean operationally." Terry Stroll: "I added an HR appendix 😊".',
    choices:[
      { label:'📋 Ask Andre to expand — with specifics', cls:'gr',
        effect:'Andre produces a 30-page addendum. 28 pages are process diagrams. 2 pages are "Do better." expanded.',
        action:()=>{ G.morale+=5; log('Andre Mochalatte\'s addendum: 30 pages. Page 1: executive summary ("Do better."). Pages 2–29: frameworks for betterment. Page 30: "Work smarter." defined across 14 sub-bullet points. Kate has starred it.','in'); }},
      { label:'✅ Adopt it — clear, concise, memorable', cls:'mx',
        effect:'Morale +10. Rep +2. The company now has a framework. It has 4 words.',
        action:()=>{ G.morale+=10; G.reputation+=2; log('The Operational Excellence Framework is now company policy. All-hands kick-off this Thursday. Slide 1: "Do better." Slide 2: "Work smarter." Luke Hail: "This is a two-slide deck." Andre: "Exactly."','in'); }},
    ]},

  { from:'luke_h', badge:'🔧 INFRASTRUCTURE HORROR',
    title:'Luke Hail: "Our production database is running on someone\'s local Docker container. That someone no longer works here."',
    desc:'Luke traced a latency spike to a container that hasn\'t been updated in 14 months. The container belongs to a dev account. The dev left in Q3 2023. The container is still running. On their personal laptop. Which is apparently still on and connected to the internet. Somewhere. Luke has called it "Pavel\'s Ghost."',
    choices:[
      { label:'🐳 Migrate to proper cloud hosting — immediately', cls:'gr',
        effect:'Cash -€400/mo (hosting). Dev debuff 60s. Debt -20. Pavel\'s Ghost is exorcised.',
        action:()=>{ G.cash-=400; applyDebuff('dev','🐳 DB MIGRATION',60); G.techDebt=Math.max(0,G.techDebt-20); log('Luke Hail: "Database is on RDS. Pavel\'s Ghost is gone. I hope Pavel\'s laptop battery is okay." The latency dropped 80%. David Hiswoman is very happy.','gr'); }},
      { label:'🕯️ Do not disturb Pavel\'s Ghost — it has 99.2% uptime', cls:'re',
        effect:'Nothing changes. The ghost persists. Debt +20. Luke morale -15.',
        action:()=>{ G.techDebt+=20; G.morale-=15; log('Luke Hail: "We are leaving it." He has lit a candle for Pavel. The database uptime is 99.2%. Nobody asks how. Nobody wants to know.','re'); }},
    ]},

];

// Andre Mochalatte — COO events (the good guy fighting Joe/Theresa/Lucas)
const ANDRE_EVENTS = [

  { from:'andre', badge:'🛡️ SPRINT LOCKDOWN',
    title:'Andre Mochalatte: "Joe, I\'ve locked the sprint. No more mid-sprint \'AI features\'. The team ships this Friday. Touch the board and I will find you."',
    desc:'Joe Newman added 4 new tickets to the active sprint at 11pm last night. Luke Hail discovered them at standup. He went quiet for 17 seconds. Dave Rocky McHill checked his blood pressure app. Andre found out at 8:45am, removed all 4 tickets, locked the board, and sent Joe a calendar invite titled "Sprint integrity: a one-on-one."',
    choices:[
      { label:'✅ Back Andre — protected sprint, full delivery', cls:'gr',
        effect:'Dev morale +15. Sprint ships on time. Joe\'s one-on-one lasts 2 hours.',
        action:()=>{ G.morale+=15; log('The sprint shipped. All 8 tickets. On Friday. On time. Luke Hail said "thank you" to Andre in a Slack DM. Andre replied with a thumbs up. Dave Rocky McHill cried a little.','gr'); }},
      { label:'🤷 Let Joe add the tickets — \'it\'s just 4 things\'', cls:'re',
        effect:'Dev debuff 40s. Morale -15. Nothing ships.',
        action:()=>{ applyDebuff('dev','🔥 MID-SPRINT CHAOS',40); G.morale-=15; log('The sprint did not ship. 2 of Joe\'s 4 tickets were duplicates of existing features. 1 was "make it pop." Luke Hail has requested a 1-week vacation, effective immediately.','re'); }},
    ]},

  { from:'andre', badge:'📞 SALES INTERVENTION',
    title:'Andre Mochalatte just called Lucas Cloakfield\'s client and apologized. Apparently Lucas promised "full ERP integration in 6 weeks." That feature does not exist. It has never existed.',
    desc:'Lucas closed a €180K enterprise deal. The contract mentions "complete ERP integration via open API" by end of Q1. Andre read the contract at 9am. He Slacked Luke Hail. Luke Hail replied with a photo of his own face. Andre then called the client directly, explained the timeline was "aspirational," and negotiated a phased delivery plan. Lucas is furious.',
    choices:[
      { label:'👏 Support Andre\'s fix — phased delivery plan', cls:'gr',
        effect:'Rep +3. Morale +10. The client stays. Lucas is not pleased.',
        action:()=>{ G.reputation+=3; G.morale+=10; log('The client accepted a phased ERP delivery plan. Q1: data export API. Q2: import hooks. Q3: actual integration. They are satisfied. Lucas Cloakfield has described Andre\'s intervention as "frankly unnecessary." Andre has said nothing.','gr'); }},
      { label:'💸 Honor Lucas\'s promise — all-hands on ERP', cls:'re',
        effect:'Dev debuff 60s. Morale -20. Debt +25. All other work stops.',
        action:()=>{ applyDebuff('dev','🔗 ERP DEATH MARCH',60); G.morale-=20; G.techDebt+=25; log('The team dropped everything for ERP integration. 6 weeks of work delivered an API that connects to one ERP system. The client uses a different one. Lucas: "I said open API. That\'s open." Luke Hail has submitted his notice. Dave got him to stay. Barely.','re'); }},
    ]},

  { from:'andre', badge:'✂️ CFO STANDOFF',
    title:'Theresa Shackles wants to eliminate the QA team. "Testing can be crowdsourced. The customers will find the bugs." Andre is blocking her.',
    desc:'Theresa presented a cost reduction slide at the leadership meeting. Slide 7: "QA team — redundant function, €18K/month savings." Sarah Frost was in the meeting. She has not spoken since. Andre stood up and delivered a 12-minute rebuttal. He cited 3 incidents from last quarter where QA caught critical bugs before production. Theresa called this "anecdotal." Andre called her spreadsheet "dangerous."',
    choices:[
      { label:'🛡️ Back Andre — QA stays', cls:'gr',
        effect:'Morale +15. Rep +2. Theresa\'s slide is shelved.',
        action:()=>{ G.morale+=15; G.reputation+=2; log('QA stays. Sarah Frost sent Andre a Slack message: "Thank you." Andre replied: "Don\'t thank me, ship faster." Sarah Frost has increased test coverage to 87%. Theresa\'s slide has been archived. Theresa is not done.','gr'); }},
      { label:'💀 Side with Theresa — save €18K/month', cls:'re',
        effect:'QA dissolved. Cash +€18K/mo. But bugs hit prod. Rep -10. Morale -25.',
        action:()=>{ G.cash+=18000; G.reputation-=10; G.morale-=25; G.techDebt+=30; log('QA team is dissolved. Month 1: 3 critical bugs in production. One customer lost. Month 2: a login bug exposes user emails for 6 hours. Lucas calls it "a learning opportunity." Andre has gone very quiet.','re'); }},
    ]},

  { from:'andre', badge:'🎤 CONFERENCE AMBUSH',
    title:'Andre just found out Joe volunteered the dev team for a live coding demo at EuroTech Summit. In 3 weeks. Nobody told the dev team.',
    desc:'Joe Newman\'s LinkedIn post (47 likes): "Thrilled to announce Rectangularo will be doing a LIVE coding demo at EuroTech Summit 2025 🚀 Watch our incredible engineers build features in real time! This is innovation in motion." Luke Hail saw it via a Google Alert. He forwarded it to Andre with the subject line "please help." Andre has requested an emergency meeting with Joe.',
    choices:[
      { label:'🤝 Andre negotiates — pre-recorded demo, not live', cls:'gr',
        effect:'Morale +5. Rep +3. Team gets 3 weeks to prep a clean recording.',
        action:()=>{ G.morale+=5; G.reputation+=3; log('Andre negotiated with Joe: pre-recorded demo, 8-minute reel, professionally edited. Luke Hail builds a clean demo environment. The audience sees a flawless product. Joe introduces it as "live." Andre lets it go.','gr'); }},
      { label:'🎲 Let it happen — live coding, raw and real', cls:'mx',
        effect:'50/50: Rep +10 & Morale +20 on triumph, or Rep -15 & Morale -20 on disaster.',
        action:()=>{ if(Math.random()<.5){ G.reputation+=10; G.morale+=20; log('The live demo worked. Luke Hail typed flawlessly. Wes Wonder\'s CSS was immaculate. The crowd cheered. Joe took a bow. Andre stood at the back. Luke Hail: "Never again." Andre: "Agreed."','gr'); } else { G.reputation-=15; G.morale-=20; log('The live demo broke 4 minutes in. Luke Hail\'s laptop lost WiFi. Wes Wonder\'s CSS was on the wrong branch. Joe said "this is real engineering, folks." The crowd was not convinced. Andre drove home in silence.','re'); } }},
    ]},

  { from:'andre', badge:'📊 BUDGET WAR',
    title:'Andre Mochalatte won a budget negotiation with Theresa Shackles. Engineering gets €12K for tooling. It took 6 weeks and 4 spreadsheets.',
    desc:'Andre submitted the tooling budget request on January 14th. Theresa returned it with 23 comments. Andre revised. Theresa added 11 more comments. Andre revised again. Theresa said it lacked "strategic alignment." Andre wrote a 3-page strategic alignment document. Theresa approved €10K. Andre negotiated to €12K. He sent the team a Slack message: "Tools budget approved. Don\'t waste it."',
    choices:[
      { label:'🛠️ Invest in dev tooling — CI/CD, monitoring, infrastructure', cls:'gr',
        effect:'Debt -15. Dev morale +20. Everything gets faster.',
        action:()=>{ G.techDebt=Math.max(0,G.techDebt-15); G.morale+=20; log('The €12K is spent: new CI/CD pipeline, error monitoring, load testing suite. Luke Hail: "The pipeline is beautiful." Dave Rocky McHill: "We ship twice as fast." Theresa: "I\'d like to see the ROI in Q3."','gr'); }},
      { label:'📋 Buy Confluence Premium + Jira Advanced', cls:'re',
        effect:'Morale -10. Nothing improves. Joe loves the new dashboards.',
        action:()=>{ G.morale-=10; log('The budget goes to Confluence Premium and Jira Advanced Roadmaps. There are now 14 new dashboard views. Joe made a custom Epic velocity chart. Nothing is faster. Luke Hail has looked at the pipeline and then at the dashboards and said nothing for a long time.','re'); }},
    ]},

  { from:'andre', badge:'📢 CEO AI DECREE',
    title:'Joe Newman announced a company pivot to "AI-first" on LinkedIn at 11pm. Andre found out at 6am. The engineering team found out via a client email.',
    desc:'Joe\'s LinkedIn post got 312 likes and 4 press mentions. By 7am, two enterprise clients emailed asking about the AI roadmap. Luke Hail Slacked Andre: "What is our AI roadmap." Andre had no answer. He called Joe. Joe said "it\'s a direction, not a product." Andre: "Our clients are asking for a product." Joe: "Tell them it\'s coming." Andre: "When?" Joe: "Q2." Andre: "It is Q1." Joe: "Q2 is soon."',
    choices:[
      { label:'🤝 Andre manages clients — honest framing, buys time', cls:'gr',
        effect:'Rep holds. Morale +5. Andre writes a real AI strategy doc.',
        action:()=>{ G.morale+=5; log('Andre sent each client a calm email: "Our AI integration is in scoping phase. We\'ll share a roadmap by Q2." He then wrote a 4-page AI strategy doc. It contains 2 real ideas. Luke Hail called them "actually doable." This is the first time Luke has called anything doable.','gr'); }},
      { label:'🚀 Commit to the pivot — AI features by Q2', cls:'re',
        effect:'Morale -20. Debt +30. Rep -5. Q2 arrives. Nothing is AI.',
        action:()=>{ G.morale-=20; G.techDebt+=30; G.reputation-=5; log('Q2 arrived. The AI feature is a keyword search with "AI-powered" in the label. One client noticed. Joe called it "a foundation." Andre did not attend that call.','re'); }},
    ]},

  { from:'andre', badge:'📋 CONTRACT CLEANUP',
    title:'Andre discovered Lucas Cloakfield has been signing clients to contracts that include "unlimited custom development." Andre has quietly been rewriting them for 3 weeks.',
    desc:'During a quarterly legal review, Andre found 7 active contracts with the clause "unlimited customisation as required by client." Lucas wrote this clause himself. He calls it "a relationship builder." Andre has been individually renegotiating each contract. He is on client 5. He has not told Joe. He has not told Lucas. He told Dave Rocky McHill, who said "I knew something was wrong" and then sat down.',
    choices:[
      { label:'✅ Let Andre finish quietly — fix all 7 contracts', cls:'gr',
        effect:'Rep +5. Morale +10. Lucas never knows. The team is safe.',
        action:()=>{ G.reputation+=5; G.morale+=10; log('All 7 contracts rewritten. 6 clients accepted revised scoping language. 1 client pushed back and got a 10% discount. Andre absorbed it from contingency. Lucas Cloakfield signed 2 new contracts this week. Andre has requested read-only access to Lucas\'s Docusign account.','gr'); }},
      { label:'🔥 Surface it — confront Lucas and Joe in a meeting', cls:'mx',
        effect:'Morale -5. Debt -10 (scope clarified). Rep +2. Lucas is officially angry.',
        action:()=>{ G.morale-=5; G.techDebt=Math.max(0,G.techDebt-10); G.reputation+=2; log('Andre presented the 7 contracts in a leadership meeting. Lucas called it "a process issue." Joe called it "a growth mindset." Theresa asked why it took 3 weeks to surface. The contracts were fixed. Lucas now sends all contracts to Andre before signing. He is not happy about it. Andre is fine.','in'); }},
    ]},

  { from:'andre', badge:'🧘 THE QUIET WIN',
    title:'Andre blocked Joe from adding a mandatory 7am "culture standup" to the entire company calendar. Nobody knows he did this.',
    desc:'Joe drafted a recurring calendar event: "Company Culture Kick-Off Standup — 7:00am, daily, all staff, cameras on." Andre found it in the shared calendar draft queue. He declined it, spoke to Joe privately, and proposed a bi-weekly all-hands at 10am instead. Joe agreed. The event was never sent. The team does not know it was nearly their reality. Terry Stroll: "Joe seems more energized lately." Andre: "Yes."',
    choices:[
      { label:'🤫 Keep it quiet — Andre protects and says nothing', cls:'gr',
        effect:'Morale +20. Nobody burns out. The team never knows what was avoided.',
        action:()=>{ G.morale+=20; log('The 7am standup never happened. The team ships normally. Luke Hail arrives at 9:30am as usual. Wes Wonder: "Things feel good lately." Dave Rocky McHill: "I know." He doesn\'t know. Andre knows. Andre says nothing.','gr'); }},
      { label:'📣 Tell the team — let them know Andre saved them', cls:'mx',
        effect:'Morale +10. Rep +2. Joe is embarrassed. Andre is uncomfortable.',
        action:()=>{ G.morale+=10; G.reputation+=2; log('Andre mentioned it in a team retrospective: "I blocked a 7am daily standup last month. You\'re welcome." Silence. Then Luke Hail started clapping. Then everyone clapped. Joe was not in the retro. He found out via a Slack thread. He posted "leadership is hard 💪" on LinkedIn. 89 likes.','in'); }},
    ]},

  { from:'andre', badge:'💰 HIRING FREEZE',
    title:'Theresa announced a hiring freeze. Andre negotiated one exception: a senior backend hire. Theresa approved it. Joe then announced 4 open roles on LinkedIn.',
    desc:'Theresa\'s hiring freeze memo: "Effective immediately, no new headcount. Exceptions require CFO sign-off and a business case of >6 pages." Andre wrote 8 pages and got one senior backend role approved. Three hours later, Joe posted "We\'re hiring! 4 senior engineers, 1 product manager, 1 DevOps lead 🚀" on LinkedIn. Theresa called Andre. Andre did not answer immediately.',
    choices:[
      { label:'🛡️ Andre manages Joe — pulls the posts, keeps the 1 real hire', cls:'gr',
        effect:'Morale +10. The approved hire happens. Joe\'s posts come down quietly.',
        action:()=>{ G.morale+=10; log('Andre spoke to Joe privately. The 5 extra job posts were removed "due to restructuring." Andre\'s approved backend hire started 6 weeks later. Luke Hail described them as "competent and calm." This is the best review Luke gives. Theresa asked why the posts were up. Andre: "Miscommunication." Joe posted "great things coming 👀" on LinkedIn. 104 likes.','gr'); }},
      { label:'🤷 Let all 6 roles be filled — growth is good', cls:'re',
        effect:'Cash -€80K/mo. Theresa furious. Budget crisis next quarter.',
        action:()=>{ G.cash-=80000; G.morale-=10; log('All 6 roles were filled. Monthly burn increased by €80K. Theresa presented a revised runway slide in Q2. It was not optimistic. Joe called it "an investment in talent." Andre stared at the slide for a long time and said nothing. The new hires are good. The runway is not.','re'); }},
    ]},

];

// Merge all events into one array used by the engine
// To add a new event, add it to the appropriate array above
const ALL_EVENTS = [
  ...CEO_EVENTS,
  ...LEADERSHIP_EVENTS,
  ...DELIVERY_EVENTS,
  ...SUPPORT_EVENTS,
  ...MARKETING_EVENTS,
  ...DEV_EVENTS,
  ...TOOLS_EVENTS,
  ...ANDRE_EVENTS,
];
