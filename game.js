// ═══════════════════════════════════════════════════════
//  RECTANGULARO v3 — GAME ENGINE
// ═══════════════════════════════════════════════════════

// ─── HELPERS ───────────────────────────────────────────
const FMT = n => {
  if (n >= 1e6) return (n/1e6).toFixed(1)+'M';
  if (n >= 1e3) return (n/1e3).toFixed(1)+'K';
  return Math.floor(n).toString();
};

// ─── GAME STATE ─────────────────────────────────────────
const G = {
  tick: 0, speed: 1, paused: false,
  cash: 5000, morale: 100, reputation: 50, techDebt: 0,
  monthTick: 0, monthCount: 0, monthlyBurn: 0,
  docsProcessed: 0, featuresShipped: 0, deployments: 0, ticketsResolved: 0, addonsSold: 0,
  customers: [], tickets: [], featureRequests: [], usedRequests: [],
  won: false,
  activeEvent: null, lastEventTick: 0, lastCrisisTick: {},
  currentView: 'home', notifCount: 0, rpTab: 'tix',
  devProgress: 0, mktCooldown: 0,
  teams: {
    sales:    { level:1, headcount:1, xp:0, xpMax:100, progress:0, debuffs:[], buffs:[] },
    support:  { level:1, headcount:1, xp:0, xpMax:100, progress:0, debuffs:[], buffs:[] },
    dev:      { level:1, headcount:2, xp:0, xpMax:120, progress:0, debuffs:[], buffs:[] },
    devops:   { level:1, headcount:1, xp:0, xpMax:100, debuffs:[], buffs:[] },
    delivery: { level:1, headcount:1, xp:0, xpMax:100, progress:0, debuffs:[], buffs:[] },
    finance:  { level:1, headcount:1, xp:0, xpMax:80,  debuffs:[], buffs:[] },
    analyst:  { level:1, headcount:1, xp:0, xpMax:80,  debuffs:[], buffs:[] },
    testing:  { level:1, headcount:1, xp:0, xpMax:90,  debuffs:[], buffs:[] },
    marketing:{ level:1, headcount:2, xp:0, xpMax:90,  debuffs:[], buffs:[] },
  },
  regions: {
    eu:  { id:'eu',  name:'Europe',        flag:'🇪🇺', active:true,  deploying:false, progress:0, cost:0,     mrrMult:1.00, compliance:['GDPR','eIDAS','ISO 27001'] },
    uae: { id:'uae', name:'UAE / Dubai',   flag:'🇦🇪', active:false, deploying:false, progress:0, cost:8000,  mrrMult:0.25, compliance:['UAE Pass','TDRA'] },
    ksa: { id:'ksa', name:'Saudi Arabia',  flag:'🇸🇦', active:false, deploying:false, progress:0, cost:10000, mrrMult:0.20, compliance:['NAFATH','NCA'] },
    usa: { id:'usa', name:'USA',           flag:'🇺🇸', active:false, deploying:false, progress:0, cost:12000, mrrMult:0.30, compliance:['ESIGN Act','SOC 2'] },
  },
};

// ─── CHARACTERS ─────────────────────────────────────────
const CHARS = {
  joe:      { name:'Joe Newman',          role:'CEO',                       emoji:'👔', color:'#ff9100', team:'leadership' },
  andre:    { name:'Andre Mochalatte',    role:'COO',                       emoji:'⚙️', color:'#64b5f6', team:'leadership' },
  theresa:  { name:'Theresa Shackles',    role:'CFO',                       emoji:'📊', color:'#f48fb1', team:'leadership' },
  paul:     { name:'Paul White',          role:'Sales Director',             emoji:'💼', color:'#80cbc4', team:'sales' },
  lucas:    { name:'Lucas Cloakfield',    role:'Senior Sales',               emoji:'🤑', color:'#ffe082', team:'sales' },
  kate:     { name:'Kate Shockwell',      role:'Customer Lead',              emoji:'🎧', color:'#ffcc80', team:'support' },
  michael_s:{ name:'Michael Stroll',      role:'Support Specialist',         emoji:'🙋', color:'#80cbc4', team:'support' },
  dave:     { name:'Dave Rocky McHill',   role:'Dev Lead',                   emoji:'💻', color:'#a5d6a7', team:'dev' },
  wes:      { name:'Wes Wonder',          role:'Frontend Dev',               emoji:'🎨', color:'#ce93d8', team:'dev' },
  luke_h:   { name:'Luke Hail',           role:'Backend Dev',                emoji:'🔧', color:'#90caf9', team:'dev' },
  david:    { name:'David Hiswoman',      role:'DevOps Lead',                emoji:'🐳', color:'#80deea', team:'devops' },
  atom:     { name:'Atom Kociáš',         role:'Delivery Lead',              emoji:'🚀', color:'#b39ddb', team:'delivery' },
  michael_h:{ name:'Michael Heelson',     role:'Delivery Engineer',          emoji:'📦', color:'#a5d6a7', team:'delivery' },
  sarah:    { name:'Sarah Lawton',        role:'QA Lead',                    emoji:'🧪', color:'#80deea', team:'testing' },
  barb:     { name:'Barb Wackley',        role:'Lead Analyst',               emoji:'🔬', color:'#ce93d8', team:'analyst' },
  luke_o:   { name:'Luke Oktoberfest',    role:'Marketing Lead 🍺',          emoji:'📣', color:'#ffe082', team:'marketing' },
  sharky:   { name:'Sharky Simpson',      role:'Marketing Specialist 🦈',    emoji:'🦈', color:'#80cbc4', team:'marketing' },
  terry:    { name:'Terry Stroll',        role:'Finance (Definitely NOT HR)', emoji:'💹', color:'#f48fb1', team:'finance' },
};

// ─── PLAN TIERS ──────────────────────────────────────────
const TIERS = [
  { id:'ts', label:'Trial Start',    cls:'t-ts', mrr:0,    prob:.22 },
  { id:'tp', label:'Trial Pro',      cls:'t-tp', mrr:0,    prob:.14 },
  { id:'tb', label:'Trial Business', cls:'t-tb', mrr:0,    prob:.10 },
  { id:'st', label:'Start',          cls:'t-st', mrr:99,   prob:.20 },
  { id:'pr', label:'Pro',            cls:'t-pr', mrr:299,  prob:.13 },
  { id:'bu', label:'Business',       cls:'t-bu', mrr:699,  prob:.09 },
  { id:'ul', label:'Ultimate',       cls:'t-ul', mrr:2499, prob:.07 },
  { id:'en', label:'Enterprise',     cls:'t-en', mrr:4999, prob:.05 },
];
function rollTier() {
  const rep = G.reputation/100, roll = Math.random();
  const adj = TIERS.map((t,i) => ({ ...t, a: t.prob*(1+i*rep*.25) }));
  const tot = adj.reduce((s,t)=>s+t.a,0);
  let cum = 0;
  for (const t of adj) { cum += t.a/tot; if (roll<cum) return t; }
  return TIERS[0];
}

// ─── CUSTOMERS ───────────────────────────────────────────
const CNAMES = ['Acme Corp','ByteVault AG','SignumTech','PaperTrail GmbH','VaultSign LLC','DocuFlow','LegalTech s.r.o.','ESignPro','Certify Ltd','SecureDoc','ArchiveNow','FlowSigned','ComplianceCo','TrustArc','NovaDocs','PrismSign','EuroSeal','DocBridge','SignatureFX','ClearSign','ContractPal','SealMaster','ApexDocs','BlueStar Notary','RedLine Legal','IronSign','PeakFlow','NexusDocs','OrionSign','ZeroInk'];
const CREGS = ['EU','UAE','US','KSA','APAC','UK'];
const CINDS = ['Banking','Real Estate','Education','Healthcare','Government','Legal'];

function maxCustomers() {
  // Cap scales with active non-EU regions: 60 / 100 / 150 / 200
  const nonEu=Object.values(G.regions).filter(r=>r.active&&r.id!=='eu').length;
  return [60,100,150,200][nonEu];
}
function addCustomer() {
  if (G.customers.length >= maxCustomers()) return;
  const name = CNAMES[Math.floor(Math.random()*CNAMES.length)] + ' ' + (G.customers.length+1);
  const tier = rollTier();
  G.customers.push({ id:Date.now()+Math.random(), name, tier, mrr:tier.mrr, addons:[], satisfaction:70+Math.floor(Math.random()*30), region:CREGS[Math.floor(Math.random()*CREGS.length)], industry:CINDS[Math.floor(Math.random()*CINDS.length)], age:0 });
  G.reputation = Math.min(100, G.reputation+1);
  G.notifCount++;
  log(`New customer: ${name} [${tier.label}]${tier.mrr?' +€'+tier.mrr+'/mo':' FREE TRIAL'}`, 'gr');
  toast(`🎉 ${name} — ${tier.label}!`, 'gr');
  updBadges();
}

function calcMRR() {
  let base = 0;
  G.customers.forEach(c => { base += c.mrr; c.addons.forEach(a => { base += a.rev||0; }); });
  const mult = Object.values(G.regions).filter(r=>r.active).reduce((s,r)=>s+r.mrrMult,0);
  return Math.round(base * mult);
}

function calcBurn() {
  let b = 0;
  Object.values(G.teams).forEach(t => { b += t.headcount * 200; });
  b += 700; // base infra
  b += Object.values(G.regions).filter(r=>r.active&&r.id!=='eu').length * 300;
  b += G.customers.length * 20; // scaling infra — more customers = more servers
  return b;
}

// ─── TICKETS ─────────────────────────────────────────────
const TKT_POOL = [
  'Login button not working in IE11 (again)','PDF signature appears upside down',
  'Customer says e-signature is "legally haunted"','Certificate expired — nobody noticed for 6 months',
  'API returns 200 OK and also 500 simultaneously','On-prem deployed on a Raspberry Pi 3',
  '"Sign Here" button criminally small on mobile','"It worked on my machine" — the customer, about our cloud',
  'Audit log shows login from the moon','Customer wants Comic Sans as their signature font',
  'Notification emails 100% going to spam','SAML integration exploded during board demo',
  'Customer wants "undo" on a legally binding contract','SSO redirect loop — team logging in for 3h',
  'Admin deleted all users including themselves','Client wants document signed retroactively',
  'Wes Wonder pushed a CSS change that broke IE on mobile','Luke Hail refactored auth at 11pm — prod unhappy',
  'Custom domain is pointing to competitor','Bulk signing timed out on 3 documents, not 3000',
];
let tktSeq = 1;
function genTicket() {
  if (!G.customers.length) return;
  const c = G.customers[Math.floor(Math.random()*G.customers.length)];
  const isUrgent = Math.random()<.2;
  const deadline = isUrgent ? 120 : 250; // Urgent: 120 ticks, Normal: 250 ticks
  G.tickets.unshift({
    id:'TKT-'+String(tktSeq++).padStart(4,'0'),
    text:TKT_POOL[Math.floor(Math.random()*TKT_POOL.length)],
    customer:c.name,
    resolved:false,
    priority:isUrgent?'urgent':'normal',
    age:0,
    deadline: deadline,
    timeLeft: deadline
  });
  if (G.tickets.length > 30) G.tickets.pop();
  G.notifCount++; updBadges();
  log(`🎫 New ticket from ${c.name}`, 'ye');
  renderRP();
}
function resolveTicket(id, manual=false) {
  const t = G.tickets.find(x=>x.id===id);
  if (!t||t.resolved) return;
  t.resolved = true; G.ticketsResolved++;
  G.reputation = Math.min(100, G.reputation+.5);
  const c = G.customers.find(x=>x.name===t.customer);
  if (c) c.satisfaction = Math.min(100, c.satisfaction+5);
  if (manual) toast(`✅ ${t.id} resolved!`, 'gr');
  log(`✅ ${t.id} resolved`, 'gr');
  updBadges(); renderRP();
  if (G.currentView==='inbox') renderInbox();
}

function checkTicketExpiry() {
  G.tickets.forEach(t => {
    if (!t.resolved && t.timeLeft !== undefined) {
      t.timeLeft--;
      if (t.timeLeft <= 0 && !t.expired) {
        t.expired = true;
        const repLoss = t.priority === 'urgent' ? 3 : 1.5;
        const moraleLoss = t.priority === 'urgent' ? 2 : 1;
        G.reputation = Math.max(0, G.reputation - repLoss);
        G.morale = Math.max(0, G.morale - moraleLoss);
        const c = G.customers.find(x=>x.name===t.customer);
        if (c) c.satisfaction = Math.max(0, c.satisfaction - 10);
        toast(`⏰ ${t.id} expired! Rep -${repLoss}, Morale -${moraleLoss}`, 're');
        log(`⏰ ${t.id} expired unresolved. Customer unhappy.`, 're');
        updBadges(); renderRP();
        if (G.currentView==='inbox') renderInbox();
      }
    }
  });
}

// ─── FEATURE REQUESTS ─────────────────────────────────────
const REQ_POOL = [
  { name:'Blockchain Signatures',  good:true,  desc:'Trendy. Enterprises love buzzwords.', at:8 },
  { name:'AI Document Review',     good:true,  desc:'Joe DEMANDS it. Barb recommends it.', at:12 },
  { name:'Native Mobile App',      good:true,  desc:'Everyone asks. Wes Wonder excited.',  at:6 },
  { name:'Fax Support',            good:false, desc:'Sir this is 2025.',                   at:3 },
  { name:'Emoji Signatures',       good:false, desc:'Legally no.',                         at:2 },
  { name:'Dark Mode',              good:true,  desc:'Dev team demands it for themselves.',  at:2 },
  { name:'GDPR Export',            good:true,  desc:'Required for EU enterprise deals.',    at:10 },
  { name:'SSO / SAML 2.0',        good:true,  desc:'Deal-breaker for big accounts.',       at:8 },
  { name:'Bulk Signing',           good:true,  desc:'Power users will triple usage.',       at:5 },
  { name:'"Sign with Blood" Option',good:false,desc:'We do not know who sent this.',        at:1 },
  { name:'Offline Mode',           good:true,  desc:'On-prem clients are screaming.',       at:9 },
  { name:'Cert Auto-Renewal',      good:true,  desc:'Stop the 3am panic calls.',            at:7 },
  { name:'MS Teams Integration',   good:true,  desc:'Every enterprise client wants this.',  at:10 },
  { name:'"Undo" Signed Contracts',good:false, desc:'Legal said absolutely not.',           at:1 },
];

// ─── DEV BACKLOG ──────────────────────────────────────────
const DEV_Q = [
  { name:'E-Signature Core Engine',     effort:80,  done:false, cat:'Core',        effect:()=>{ G.reputation+=5; unlockA('esig');     log('E-Signature Core shipped! 🎉','sh'); }},
  { name:'Audit Trail & Logging',       effort:90,  done:false, cat:'Compliance',  effect:()=>{ G.reputation+=8; unlockA('audit');    log('Audit Trail shipped! Enterprise compliance unlocked.','sh'); }},
  { name:'PDF Certificate Signing',     effort:100, done:false, cat:'Core',        effect:()=>{ G.reputation+=4; G.morale+=5; unlockA('cert'); log('Certificate Signing shipped! Rep +4, Morale +5','sh'); }},
  { name:'Multi-Party Workflows',       effort:110, done:false, cat:'Core',        effect:()=>{ G.reputation+=6; G.morale+=8; log('Multi-party workflows live! Team proud. Rep +6, Morale +8','sh'); }},
  { name:'REST API v2',                 effort:130, done:false, cat:'Integration', effect:()=>{ G.techDebt=Math.max(0,G.techDebt-25); G.reputation+=5; unlockA('api'); log('REST API v2 — Tech Debt -25, Rep +5','sh'); }},
  { name:'SAML 2.0 / SSO',            effort:120, done:false, cat:'Security',    effect:()=>{ G.reputation+=10; unlockA('sso'); log('SSO shipped! Enterprise deals unlocked! Rep +10','sh'); }},
  { name:'Custom Branding',            effort:80,  done:false, cat:'Brand',       effect:()=>{ G.reputation+=3; unlockA('branding'); log('Custom Branding shipped! White-label ready. Rep +3','sh'); }},
  { name:'MS Office 365 Add-On',       effort:140, done:false, cat:'Integration', effect:()=>{ G.reputation+=7; G.morale+=6; unlockA('ms365'); log('MS 365 Add-on live! Corporate customers excited. Rep +7, Morale +6','sh'); }},
  { name:'On-Prem Deployment Kit',     effort:160, done:false, cat:'Delivery',    effect:()=>{ G.deployments++; G.reputation+=8; G.morale+=10; unlockA('onprem'); log('On-Prem Kit ready! Atom ecstatic. Rep +8, Morale +10','sh'); }},
  { name:'Custom Email Identity',      effort:70,  done:false, cat:'Brand',       effect:()=>{ G.reputation+=2; unlockA('emailid'); log('Custom Email Identity shipped! Professional touch. Rep +2','sh'); }},
  { name:'Advanced Reporting',         effort:90,  done:false, cat:'Analytics',   effect:()=>{ G.reputation+=4; unlockA('reporting'); log('Advanced Reporting shipped! Data insights unlocked. Rep +4','sh'); }},
  { name:'eSealing with Certificates', effort:110, done:false, cat:'Security',    effect:()=>{ G.reputation+=6; unlockA('eseal'); log('eSealing shipped! Enterprise security certified. Rep +6','sh'); }},
  { name:'Mobile App (iOS + Android)', effort:180, done:false, cat:'Mobile',      effect:()=>{ G.reputation+=12; G.morale+=15; unlockA('mobile'); log('Mobile App launched! 4.8⭐ rating! Rep +12, Morale +15','sh'); }},
  { name:'AI Document Analysis',       effort:220, done:false, cat:'AI',          effect:()=>{ G.reputation+=20; G.morale+=12; log('AI shipped! Joe: "I KNEW it." Rep +20, Morale +12','sh'); }},
  { name:'Custom Workflows Engine',    effort:150, done:false, cat:'Enterprise',  effect:()=>{ G.reputation+=9; G.morale+=8; unlockA('workflows'); log('Custom Workflows Engine shipped! Power users rejoice. Rep +9, Morale +8','sh'); }},
];
let devProgress = 0;

// ─── ADDONS ───────────────────────────────────────────────
const ADDONS = {
  branding: { cat:'brand',       name:'Custom Branding',       price:149,  rev:149,  desc:'White-label with customer colours & logo.',  unlocked:false, sold:0 },
  emailid:  { cat:'brand',       name:'Custom Email Identity', price:49,   rev:49,   desc:'Send from client\'s own email domain.',       unlocked:false, sold:0 },
  domain:   { cat:'brand',       name:'Custom Domain',         price:99,   rev:99,   desc:'Host Rectangularo at client\'s own URL.',     unlocked:false, sold:0 },
  eseal:    { cat:'security',    name:'eSealing with Certs',   price:199,  rev:199,  desc:'Organisation-level electronic seals.',        unlocked:false, sold:0 },
  sso:      { cat:'security',    name:'SAML 2.0 / SSO',       price:299,  rev:299,  desc:'Enterprise single sign-on.',                  unlocked:false, sold:0 },
  ts:       { cat:'security',    name:'Qualified Timestamps',  price:99,   rev:99,   desc:'Certified timestamps for compliance.',        unlocked:false, sold:0 },
  cert:     { cat:'custom',      name:'Custom Signing Cert',   price:299,  rev:299,  desc:'Client\'s own electronic signing cert.',      unlocked:false, sold:0 },
  workflows:{ cat:'custom',      name:'Custom Workflows',      price:349,  rev:349,  desc:'Build any signing/approval workflow.',        unlocked:false, sold:0 },
  reporting:{ cat:'custom',      name:'Advanced Reporting',    price:99,   rev:99,   desc:'Deep analytics beyond standard.',             unlocked:false, sold:0 },
  onprem:   { cat:'enterprise',  name:'On-Premise License',    price:4999, rev:0,    desc:'Full on-prem. One-time fee. Ka-ching!',       unlocked:false, sold:0 },
  api:      { cat:'enterprise',  name:'REST API Access',       price:299,  rev:299,  desc:'Full API for integrations.',                  unlocked:false, sold:0 },
  audit:    { cat:'enterprise',  name:'Audit Trail Pro',       price:149,  rev:149,  desc:'Comprehensive logs & export.',                unlocked:false, sold:0 },
  ms365:    { cat:'integration', name:'MS Office 365 Add-On',  price:99,   rev:99,   desc:'Sign from Word, Outlook, Teams.',             unlocked:false, sold:0 },
  esig:     { cat:'integration', name:'E-Signature SDK',       price:199,  rev:199,  desc:'Embed Rectangularo anywhere.',               unlocked:false, sold:0 },
  mobile:   { cat:'integration', name:'Mobile SDK',            price:249,  rev:249,  desc:'Native iOS & Android signing.',               unlocked:false, sold:0 },
};
const ADDON_CATS = [
  { id:'brand',       label:'🎨 Brand & Identity' },
  { id:'security',    label:'🔒 Advanced Security' },
  { id:'custom',      label:'⚙️ Customization' },
  { id:'enterprise',  label:'🏢 Enterprise' },
  { id:'integration', label:'🔌 Integrations' },
];
function unlockA(id) { if (ADDONS[id]) ADDONS[id].unlocked = true; }

// ─── UPGRADES ─────────────────────────────────────────────
const UPGRADES = [
  { id:'crm',   name:'CRM System',           cost:800,  done:false, desc:'Sales closes 25% more deals.',               apply:()=>{ G.teams.sales.buffs.push('CRM'); G.teams.sales.level++; }},
  { id:'kb',    name:'Knowledge Base',        cost:600,  done:false, desc:'Support resolves tickets 30% faster.',       apply:()=>{ G.teams.support.buffs.push('KB'); }},
  { id:'cicd',  name:'CI/CD Pipeline',        cost:1500, done:false, desc:'Dev ships 25% faster. DevOps rejoices.',     apply:()=>{ G.teams.dev.buffs.push('CI/CD'); G.teams.devops.buffs.push('CI/CD'); }},
  { id:'sla',   name:'SLA Agreements',        cost:700,  done:false, desc:'Churn -15%. Rep +10.',                       apply:()=>{ G.reputation=Math.min(100,G.reputation+10); }},
  { id:'mon',   name:'Observability Stack',   cost:1200, done:false, desc:'Catch bugs first. Debt -20.',                apply:()=>{ G.techDebt=Math.max(0,G.techDebt-20); G.teams.devops.buffs.push('MONITORING'); }},
  { id:'hr',    name:'HR & People Ops',       cost:1800, done:false, desc:'Hire costs -20%. Morale +15. (Terry relieved.)',apply:()=>{ G.morale=Math.min(100,G.morale+15); }},
  { id:'iso',   name:'ISO 27001 Cert',        cost:4000, done:false, desc:'Enterprise deals unlock. Rep +20.',           apply:()=>{ G.reputation=Math.min(100,G.reputation+20); unlockA('domain'); }},
  { id:'ai',    name:'Internal AI Tools',     cost:2500, done:false, desc:'All teams +10% eff.',                        apply:()=>{ G.morale=Math.min(100,G.morale+8); Object.values(G.teams).forEach(t=>t.buffs.push('AI')); }},
  { id:'remote',name:'Remote-First Policy',   cost:500,  done:false, desc:'Morale +20. Dave stops complaining.',        apply:()=>{ G.morale=Math.min(100,G.morale+20); }},
  { id:'hack',  name:'Hackathon',             cost:1200, done:false, desc:'Dave\'s team ships 2 features instantly.',   apply:()=>{ skipFeats(2); }},
  { id:'part',  name:'Channel Partner Program',cost:3000,done:false, desc:'+30% sales reach via resellers.',             apply:()=>{ G.teams.sales.buffs.push('PARTNERS'); }},
  { id:'data',  name:'EU Data Residency',     cost:5000, done:false, desc:'GDPR badge. EU enterprise deals +50%.',      apply:()=>{ G.reputation=Math.min(100,G.reputation+15); }},
];
function buyUpgrade(id) {
  const u = UPGRADES.find(x=>x.id===id); if (!u||u.done) return;
  if (G.cash<u.cost) { toast('Not enough cash!','re'); return; }
  G.cash-=u.cost; u.done=true; u.apply();
  log(`⬆️ Upgrade: ${u.name}`, 'gr'); toast(`⬆️ ${u.name} unlocked!`, 'gr');
  if (G.currentView==='upgrades') renderUpgrades();
}
function skipFeats(n) { let c=0; for (const f of DEV_Q) { if (!f.done&&c<n) { f.done=true; f.effect(); G.featuresShipped++; c++; } } }

// ─── DEBUFFS ──────────────────────────────────────────────
function applyDebuff(teamId, label, dur) { const t=G.teams[teamId]; if(t) t.debuffs.push({label,expires:G.tick+dur}); }
function tickDebuffs() { Object.values(G.teams).forEach(t=>{ t.debuffs=t.debuffs.filter(d=>d.expires>G.tick); }); }
function teamEff(id) {
  const t=G.teams[id]; if(!t) return 1;
  const db = t.debuffs.length>0 ? Math.max(.2,1-t.debuffs.length*.3) : 1;
  const bf = 1+t.buffs.length*.1;
  const mf = .5+(G.morale/100)*.5;
  return db*bf*mf;
}

// ─── MARKETING CAMPAIGNS ──────────────────────────────────
const MKT_CAMPAIGNS = [
  { name:'LinkedIn Thought Leadership', cost:300,  leads:2, cooldown:120, desc:'"Rectangularo is the future." — Luke Oktoberfest on LinkedIn at 11pm.' },
  { name:'Product Hunt Launch',         cost:500,  leads:4, cooldown:200, desc:'Sharky Simpson designed the assets. Luke wrote the tagline 5 times.' },
  { name:'Industry Conference Booth',   cost:1200, leads:6, cooldown:300, desc:'Luke wore the branded shirt. Sharky brought holographic stickers.' },
  { name:'Cold Email Sequence',         cost:200,  leads:3, cooldown:100, desc:'Lucas Cloakfield wrote the templates. 40% open rate (he claims).' },
  { name:'Webinar: eSign in 2025',      cost:400,  leads:4, cooldown:150, desc:'Joe Newman wants to present. Barb Wackley fact-checks in real time.' },
];
function runCampaign(idx) {
  const c = MKT_CAMPAIGNS[idx];
  if (G.cash<c.cost) { toast('Not enough cash!','re'); return; }
  if (G.mktCooldown>0) { toast(`Cooldown! ${G.mktCooldown}s remaining`,'ye'); return; }
  G.cash-=c.cost; G.mktCooldown=c.cooldown;
  for (let i=0;i<c.leads;i++) setTimeout(()=>addCustomer(), i*600);
  log(`📣 Campaign: ${c.name} — ${c.leads} leads incoming!`, 'in');
  toast(`📣 ${c.name} launched!`, 'in');
  renderMarketing();
}

// ─── REGIONS ──────────────────────────────────────────────
function deployRegion(id) {
  const r=G.regions[id]; if(!r||r.active||r.deploying) return;
  if (G.cash<r.cost) { toast('Not enough cash!','re'); return; }
  G.cash-=r.cost; r.deploying=true; r.progress=0;
  log(`🌍 David Hiswoman: Deploying ${r.name} region...`,'in');
  toast(`🌍 Deploying to ${r.name}...`,'in');
  if (G.currentView==='regions') renderRegions();
}

// ─── MONTHLY P&L ──────────────────────────────────────────
const MONTH_TICKS = 600;
function monthEnd() {
  G.monthCount++;
  const mrr = calcMRR(), burn = calcBurn(), net = mrr-burn;
  G.cash += net; G.monthlyBurn = burn;
  const headcount = Object.values(G.teams).reduce((s,t)=>s+t.headcount,0);
  const salaries  = headcount * 200;
  const infraCost = 500;
  const regionInfra = Object.values(G.regions).filter(r=>r.active&&r.id!=='eu').length * 300;
  const rows = [
    { label:`Monthly Recurring Revenue (×${Object.values(G.regions).filter(r=>r.active).reduce((s,r)=>s+r.mrrMult,0).toFixed(2)} region mult)`, val:mrr, pos:true },
    { label:`Team Salaries (${headcount} people × €200)`, val:-salaries, pos:false },
    { label:'Infrastructure & Servers', val:-infraCost, pos:false },
    { label:'Regional Infrastructure', val:-regionInfra, pos:false },
  ];
  document.getElementById('pl-rows').innerHTML =
    rows.map(r=>`<div class="pl-row"><span>${r.label}</span><span class="${r.pos?'pl-pos':'pl-neg'}">€${FMT(Math.abs(r.val))}</span></div>`).join('') +
    `<div class="pl-row mt6" style="border-top:2px solid var(--bo);padding-top:calc(5px*var(--s))"><span>NET CASHFLOW</span><span class="pl-tot">€${FMT(net)} ${net>=0?'✅':'⚠️'}</span></div>` +
    (G.cash<0 ? `<div class="pl-warn">⚠️ CASH IS NEGATIVE — get more MRR fast!</div>` : '');
  document.getElementById('pl-modal').classList.add('show');
  log(`📅 Month ${G.monthCount} — MRR €${FMT(mrr)} | Burn €${FMT(burn)} | Net €${FMT(net)}`,'in');
  if (G.cash<0) toast('⚠️ Cash negative! Generate more MRR!','re');
}
function closePL() { document.getElementById('pl-modal').classList.remove('show'); }

// ─── TEAM LOOPS ───────────────────────────────────────────
function salesLoop() {
  const t=G.teams.sales;
  t.progress += t.headcount*t.level*teamEff('sales')*.45;
  if (t.progress>=100) {
    t.progress=0;
    if (Math.random()<.25+G.reputation/250) addCustomer();
    // Sales team pitches unlocked addons to customers who don't have them yet
    const targets=Object.entries(ADDONS).filter(([id,a])=>a.unlocked&&G.customers.some(c=>!c.addons.find(x=>x.id===id)));
    if (targets.length&&Math.random()<.4) {
      const [id,a]=targets[Math.floor(Math.random()*targets.length)];
      const eligible=G.customers.filter(c=>!c.addons.find(x=>x.id===id));
      const c=eligible[Math.floor(Math.random()*eligible.length)];
      c.addons.push({id,name:a.name,rev:a.rev}); a.sold++; G.cash+=a.price; G.addonsSold++;
      log(`💎 Sales: ${a.name} → ${c.name} (+€${a.price}${a.rev?' +€'+a.rev+'/mo':''})`, 'gr');
      toast(`💎 ${a.name} → ${c.name}!`, 'gr');
      if(G.currentView==='addons') renderAddons();
    }
    t.xp+=10; if(t.xp>=t.xpMax){t.xp=0;t.xpMax=Math.floor(t.xpMax*1.6);t.level++;log(`Sales Lv.${t.level}!`,'gr');}
  }
}
function supportLoop() {
  const t=G.teams.support;
  const open=G.tickets.filter(x=>!x.resolved); if(!open.length) return;
  t.progress += t.headcount*t.level*teamEff('support')*.55;
  if (t.progress>=100) {
    t.progress=0; resolveTicket(open[Math.floor(Math.random()*open.length)].id);
    t.xp+=8; if(t.xp>=t.xpMax){t.xp=0;t.xpMax=Math.floor(t.xpMax*1.6);t.level++;log(`Support Lv.${t.level}!`,'gr');}
  }
}
function devLoop() {
  const t=G.teams.dev;
  const f=DEV_Q.find(x=>!x.done); if(!f) return;
  const debtFactor=Math.max(.25,1-G.techDebt/150);
  devProgress += t.headcount*t.level*teamEff('dev')*debtFactor*.28;
  if (devProgress>=f.effort) {
    devProgress=0; f.done=true; f.effect(); G.featuresShipped++; G.techDebt+=6;
    t.xp+=15; if(t.xp>=t.xpMax){t.xp=0;t.xpMax=Math.floor(t.xpMax*1.6);t.level++;log(`Dev Lv.${t.level}!`,'gr');}
    if(G.currentView==='features') renderFeatures();
  }
}
function testingLoop() {
  const t=G.teams.testing;
  if (G.tick%15===0) G.techDebt=Math.max(0,G.techDebt-t.headcount*t.level*teamEff('testing')*.5);
  t.xp+=.25; if(t.xp>=t.xpMax){t.xp=0;t.xpMax=Math.floor(t.xpMax*1.6);t.level++;log(`Testing Lv.${t.level}!`,'gr');}
}
function devopsLoop() {
  const t=G.teams.devops;
  if (G.tick%20===0) G.techDebt=Math.max(0,G.techDebt-t.headcount*t.level*teamEff('devops')*.4);
  t.xp+=.3; if(t.xp>=t.xpMax){t.xp=0;t.xpMax=Math.floor(t.xpMax*1.6);t.level++;log(`DevOps Lv.${t.level}!`,'gr');}
}
function deliveryLoop() {
  const t=G.teams.delivery;
  t.progress+=t.headcount*t.level*teamEff('delivery')*.35;
  if (t.progress>=100) {
    t.progress=0; G.deployments++; G.docsProcessed+=Math.floor(Math.random()*4)+1;
    const msgs=['☁️ Cloud org deployed','📋 Onboarding complete','🔒 Cert installed','🎓 Training done'];
    log(msgs[Math.floor(Math.random()*msgs.length)],'de');
    t.xp+=12; if(t.xp>=t.xpMax){t.xp=0;t.xpMax=Math.floor(t.xpMax*1.6);t.level++;log(`Delivery Lv.${t.level}!`,'gr');}
  }
}
function analystLoop() {
  G.featureRequests.forEach(r=>{
    if(r.analyzing&&!r.analyzed){
      r.progress+=G.teams.analyst.headcount*G.teams.analyst.level*.4;
      if(r.progress>=r.at*10){
        r.analyzing=false; r.analyzed=true; r.accepted=true;
        G.usedRequests.push(r.name);
        const effort=r.at*10+Math.floor(Math.random()*20);
        if(r.good){
          G.reputation+=3;
          DEV_Q.push({name:r.name,effort:effort,done:false,cat:'Feature Request',effect:()=>{G.reputation+=Math.floor(effort/20);G.morale+=5;log(`✨ "${r.name}" shipped! Morale +5, Rep +${Math.floor(effort/20)}`,'sh');}});
          log(`🔬 Barb: "${r.name}" — RECOMMENDED ✅ → Queued for dev (effort: ${effort})`,'gr');
        } else {
          G.morale-=10; G.techDebt+=10;
          DEV_Q.push({name:r.name,effort:effort,done:false,cat:'Feature Request',effect:()=>{G.morale+=3;log(`✨ "${r.name}" shipped (management insisted).`,'ye');}});
          log(`🔬 Barb: "${r.name}" — NOT RECOMMENDED ⚠️ → Queued anyway (Morale -10, Debt +10)`,'ye');
        }
        updBadges(); renderRP();
        if(G.currentView==='features') renderFeatures();
      }
    }
  });
  // Keep pending + last 3 analyzed (for display only) — usedRequests blocks permanent recycling
  const pend=G.featureRequests.filter(r=>r.accepted===null);
  const done=G.featureRequests.filter(r=>r.accepted!==null).slice(-3);
  if(pend.length+done.length<G.featureRequests.length) G.featureRequests=[...pend,...done];
  G.teams.analyst.xp+=.2; const at=G.teams.analyst; if(at.xp>=at.xpMax){at.xp=0;at.xpMax=Math.floor(at.xpMax*1.6);at.level++;log(`Analyst Lv.${at.level}!`,'gr');}
}
function marketingLoop() {
  const t=G.teams.marketing;
  if (G.mktCooldown>0) G.mktCooldown--;
  // passive lead bonus based on marketing level
  if (G.tick%200===0 && Math.random()<t.level*.05) addCustomer();
  t.xp+=.15; if(t.xp>=t.xpMax){t.xp=0;t.xpMax=Math.floor(t.xpMax*1.6);t.level++;log(`Marketing Lv.${t.level}!`,'gr');}
}
function financeLoop() {
  const t=G.teams.finance;
  if (G.tick%30===0) G.techDebt=Math.max(0,G.techDebt-t.headcount*.3);
  t.xp+=.15; if(t.xp>=t.xpMax){t.xp=0;t.xpMax=Math.floor(t.xpMax*1.6);t.level++;log(`Finance Lv.${t.level}!`,'gr');}
}
function churnLoop() {
  G.customers = G.customers.filter(c=>{
    c.age++;
    const openTkts=G.tickets.filter(t=>!t.resolved&&t.customer===c.name).length;
    c.satisfaction = Math.max(0,Math.min(100,c.satisfaction-openTkts*1.0-G.techDebt*.05));
    const isTrial=c.tier.id.startsWith('t');
    const baseChurn=Math.min(G.monthCount*.00003,.002); // market pressure ramps slowly, caps at 0.2%
    const churn=isTrial?.04:c.satisfaction<20?.02:c.satisfaction<40?.008:baseChurn;
    if (Math.random()<churn) {
      log(`😢 ${c.name} churned [${c.tier.label}]`,'re');
      toast(`😢 ${c.name} cancelled`,'re');
      return false;
    }
    // trial conversion
    if (isTrial&&c.satisfaction>70&&c.age>30&&Math.random()<.01) {
      const paid=TIERS.filter(t=>!t.id.startsWith('t'));
      c.tier=paid[Math.floor(Math.random()*paid.length)]; c.mrr=c.tier.mrr;
      log(`🎉 ${c.name} converted → ${c.tier.label}!`,'gr');
      toast(`🎉 ${c.name} went PAID!`,'gr');
    }
    return true;
  });
}
function resourcesLoop() {
  G.reputation=Math.max(0,Math.min(100,G.reputation));
  G.morale=Math.max(0,Math.min(100,G.morale));
  if (G.tick%25===0) G.techDebt+=Math.min(.8+G.monthCount*.05, 3.0); // ramps to 3× by month ~44
  if (G.tick%80===0&&G.morale<80) G.morale+=1;
}
function ticketGenLoop() {
  const ageFactor=Math.min(1+G.monthCount*.04, 3.0); // ramps to 3× by month ~50
  if (G.customers.length&&Math.random()<.006*G.customers.length*ageFactor) genTicket();
}
function featureReqLoop() {
  const pending=G.featureRequests.filter(r=>r.accepted===null);
  if (G.customers.length<2||pending.length>=10) return;
  if (Math.random()<.004*G.customers.length) {
    const pool=REQ_POOL.filter(r=>!G.usedRequests.includes(r.name)&&!pend.find(x=>x.name===r.name));
    if (!pool.length) return;
    const r={...pool[Math.floor(Math.random()*pool.length)],analyzed:false,analyzing:false,accepted:null,progress:0};
    G.featureRequests.unshift(r); G.notifCount++;
    log(`💡 Feature request: "${r.name}"`,'in');
    updBadges(); renderRP();
  }
}
function regionsLoop() {
  Object.values(G.regions).forEach(r=>{
    if (!r.deploying) return;
    r.progress+=G.teams.devops.headcount*G.teams.devops.level*teamEff('devops')*.3;
    if (r.progress>=100) {
      r.progress=100; r.deploying=false; r.active=true; G.deployments++; G.reputation=Math.min(100,G.reputation+5);
      log(`✅ ${r.flag} ${r.name} LIVE! MRR +${Math.round(r.mrrMult*100)}%`,'sh');
      toast(`🎉 ${r.flag} ${r.name} online!`,'gr');
      if(G.currentView==='regions') renderRegions();
    }
  });
}
function eventLoop() {
  if (G.paused) return; // Don't trigger events while paused
  const interval=Math.max(50,120-G.customers.length*2);
  if (G.tick-G.lastEventTick>interval&&!G.activeEvent&&Math.random()<.55) {
    if(typeof ALL_EVENTS === 'undefined' || !ALL_EVENTS || ALL_EVENTS.length === 0) {
      console.error('ALL_EVENTS is not defined or empty!');
      return;
    }
    triggerEvent();
  }
}

// ─── THRESHOLD CHECK ───────────────────────────────────────
function checkThresholds() {
  if (G.paused||G.activeEvent) return;
  
  // Tech Debt Crisis: trigger when debt > 100 and hasn't triggered recently
  if (G.techDebt>100&&(!G.lastCrisisTick.techDebt||G.tick-G.lastCrisisTick.techDebt>3000)) {
    G.activeEvent=THRESHOLD_EVENTS.techDebtCrisis;
    triggerThresholdEvent();
    return;
  }
  
  // Morale Crisis: trigger when morale < 30 and hasn't triggered recently
  if (G.morale<30&&(!G.lastCrisisTick.morale||G.tick-G.lastCrisisTick.morale>3000)) {
    G.activeEvent=THRESHOLD_EVENTS.moraleCrisis;
    triggerThresholdEvent();
    return;
  }
  
  // High Reputation: trigger when reputation > 80 and hasn't triggered recently
  if (G.reputation>80&&(!G.lastCrisisTick.reputation||G.tick-G.lastCrisisTick.reputation>5000)) {
    G.activeEvent=THRESHOLD_EVENTS.highReputation;
    triggerThresholdEvent();
    return;
  }
  
  // Low Reputation: trigger when reputation < 20 and hasn't triggered recently
  if (G.reputation<20&&(!G.lastCrisisTick.lowRep||G.tick-G.lastCrisisTick.lowRep>3000)) {
    G.activeEvent=THRESHOLD_EVENTS.lowReputation;
    triggerThresholdEvent();
    return;
  }
}

function triggerThresholdEvent() {
  const ev=G.activeEvent;
  const ch=CHARS[ev.from]||CHARS.joe;
  document.getElementById('ev-av').textContent=ch.emoji;
  document.getElementById('ev-nm').textContent=ch.name;
  document.getElementById('ev-rl').textContent=ch.role;
  document.getElementById('ev-bg').textContent=ev.badge;
  document.getElementById('ev-ti').textContent=ev.title;
  document.getElementById('ev-de').textContent=ev.desc;
  const el=document.getElementById('ev-ch'); el.innerHTML='';
  ev.choices.forEach(c=>{
    const d=document.createElement('div'); d.className='ev-c';
    d.innerHTML=`<span class="ev-cl">${c.label}</span><span class="ev-ce ${c.cls}">${c.effect}</span>`;
    d.onclick=()=>{ c.action(); G.activeEvent=null; G.lastEventTick=G.tick; document.getElementById('ev-modal').classList.remove('show'); };
    el.appendChild(d);
  });
  document.getElementById('ev-modal').classList.add('show');
  toast(`⚠️ CRISIS! ${ch.name} needs you IMMEDIATELY.`,'re');
  log(`⚠️ CRISIS — ${ch.name}: "${ev.title.substring(0,50)}..."`,'re');
}

// ─── EVENT TRIGGER ─────────────────────────────────────────
function triggerEvent() {
  if (G.activeEvent||!ALL_EVENTS?.length) return;
  const ev=ALL_EVENTS[Math.floor(Math.random()*ALL_EVENTS.length)];
  G.activeEvent=ev;
  const ch=CHARS[ev.from]||CHARS.joe;
  document.getElementById('ev-av').textContent=ch.emoji;
  document.getElementById('ev-nm').textContent=ch.name;
  document.getElementById('ev-rl').textContent=ch.role;
  document.getElementById('ev-bg').textContent=ev.badge;
  document.getElementById('ev-ti').textContent=ev.title;
  document.getElementById('ev-de').textContent=ev.desc;
  const el=document.getElementById('ev-ch'); el.innerHTML='';
  ev.choices.forEach(c=>{
    const d=document.createElement('div'); d.className='ev-c';
    d.innerHTML=`<span class="ev-cl">${c.label}</span><span class="ev-ce ${c.cls}">${c.effect}</span>`;
    d.onclick=()=>{ c.action(); G.activeEvent=null; G.lastEventTick=G.tick; document.getElementById('ev-modal').classList.remove('show'); };
    el.appendChild(d);
  });
  document.getElementById('ev-modal').classList.add('show');
  toast(`📣 Event! ${ch.name} needs you.`,'ce');
  log(`📣 EVENT — ${ch.name}: "${ev.title.substring(0,50)}..."`,'ce');
}

// ─── RENDER FUNCTIONS ──────────────────────────────────────
function renderTopbar() {
  const mrr=calcMRR(), burn=calcBurn();
  document.getElementById('t-cash').textContent='€'+FMT(G.cash);
  document.getElementById('t-mrr').textContent='€'+FMT(mrr);
  document.getElementById('t-burn').textContent='€'+FMT(burn);
  document.getElementById('t-rep').textContent=Math.round(G.reputation);
  document.getElementById('t-mor').textContent=Math.round(G.morale);
  document.getElementById('t-dbt').textContent=Math.round(G.techDebt);
  document.getElementById('tb-notif-n').textContent=G.notifCount;
  // documents stats
  const dp=document.getElementById('doc-proc'); if(dp) dp.textContent=G.docsProcessed;
  const dd=document.getElementById('doc-dep');  if(dd) dd.textContent=G.deployments;
  const df=document.getElementById('doc-feat'); if(df) df.textContent=G.featuresShipped;
  const da=document.getElementById('doc-add');  if(da) da.textContent=G.addonsSold;
}
function updBadges() {
  const open=G.tickets.filter(t=>!t.resolved).length;
  const setB=(id,n,hide0=true)=>{ const el=document.getElementById(id); if(el){el.textContent=n;el.style.display=(hide0&&!n)?'none':'';} };
  setB('bd-tix',open); setB('bd-custs',G.customers.length,false);
  setB('bd-docs',G.docsProcessed,false);
  setB('bd-reqs',G.featureRequests.filter(r=>r.accepted===null&&!r.analyzing).length);
}
function renderHome() {
  const open=G.tickets.filter(t=>!t.resolved).length;
  const wait=G.customers.reduce((s,c)=>s+c.addons.length,0);
  document.getElementById('ov-inbox').textContent=open;
  document.getElementById('ov-wait').textContent=wait;
  document.getElementById('ov-done').textContent=G.ticketsResolved;
  document.getElementById('ov-urg').textContent=G.tickets.filter(t=>!t.resolved&&t.priority==='urgent').length;
  // characters
  const row=document.getElementById('char-row');
  row.innerHTML=Object.entries(CHARS).map(([id,c])=>{
    const tm=G.teams[c.team];
    const dbuff=tm&&tm.debuffs.length>0;
    const buff=tm&&tm.buffs.length>0&&!dbuff;
    return `<div class="ch" onclick="sv('teams')">
      <div class="ch-av ${dbuff?'db':buff?'bf':''}" style="border-color:${c.color}50">${c.emoji}</div>
      <div class="ch-nm">${c.name.split(' ').slice(0,2).join(' ')}</div>
      <div class="ch-rl" style="color:${c.color}">${c.role.split(' ').slice(0,2).join(' ')}</div>
      ${dbuff?`<span class="ft b" style="font-size:calc(3px*var(--s))">${tm.debuffs[0].label.substring(0,12)}</span>`:''}
    </div>`;
  }).join('');
}

function renderTeams() {
  const defs=[
    {id:'sales',    name:'Sales',         leads:['Paul White (SD)','Lucas Cloakfield'],   color:'#ffe082', desc:'Closes deals, generates MRR.'},
    {id:'support',  name:'Support',       leads:['Kate Shockwell','Michael Stroll'],       color:'#ffcc80', desc:'Resolves tickets, customer happiness.'},
    {id:'dev',      name:'Development',   leads:['Dave Rocky McHill','Wes Wonder','Luke Hail'],color:'#a5d6a7',desc:'Ships product features.'},
    {id:'devops',   name:'DevOps',        leads:['David Hiswoman'],                        color:'#80deea', desc:'Infrastructure, CI/CD, uptime.'},
    {id:'delivery', name:'Delivery',      leads:['Atom Kociáš','Michael Heelson'],color:'#b39ddb',desc:'On-prem, deployments, training.'},
    {id:'testing',  name:'QA & Testing',  leads:['Sarah Lawton'],                          color:'#80deea', desc:'Reduces bugs & tech debt passively.'},
    {id:'analyst',  name:'Analyst',       leads:['Barb Wackley'],                          color:'#ce93d8', desc:'Reviews feature requests.'},
    {id:'finance',  name:'Finance',       leads:['Theresa Shackles','Terry Stroll 🙃'],    color:'#f48fb1', desc:'Budget, cost mgmt. Terry is NOT HR.'},
    {id:'marketing',name:'Marketing',     leads:['Luke Oktoberfest 🍺','Sharky Simpson 🦈'],color:'#ffe082', desc:'Campaigns, brand, leads.'},
  ];
  const el=document.getElementById('teams-content');
  el.innerHTML=defs.map(td=>{
    const t=G.teams[td.id];
    const hireCost=Math.round(200*Math.pow(1.5,t.headcount));
    const lvlCost=Math.round(500*Math.pow(2,t.level));
    const eff=Math.round(teamEff(td.id)*100);
    return `<div class="tp" style="border-left:3px solid ${td.color}40">
      <div class="tp-hdr">
        <div class="tp-nm" style="color:${td.color}">${td.name}</div>
        <div class="tp-ld">${td.leads.join(' · ')}</div>
      </div>
      <div style="font-family:var(--mo);font-size:var(--fmn);color:var(--tm);margin-bottom:calc(5px*var(--s))">${td.desc}</div>
      <div class="g3 mb3">
        <div><span class="pl">HEADCOUNT</span><span class="pv">${t.headcount}</span></div>
        <div><span class="pl">LEVEL</span><span class="pv ye">Lv.${t.level}</span></div>
        <div><span class="pl">EFF.</span><span class="pv ${eff>70?'gr':eff>40?'':'re'}">${eff}%</span></div>
      </div>
      <div class="mb3"><span class="pl">XP</span><div class="pw pw6"><div class="pf pu" style="width:${(t.xp/t.xpMax)*100}%"></div></div></div>
      ${t.debuffs.length||t.buffs.length?`<div class="fx mb3">${t.debuffs.map(d=>`<span class="ft b">${d.label}</span>`).join('')}${t.buffs.map(b=>`<span class="ft g">${b}</span>`).join('')}</div>`:''}
      <div class="fr">
        <button class="btn ${G.cash>=hireCost?'gr':'dis'}" onclick="hireTeam('${td.id}',${hireCost})">➕ HIRE <span style="color:var(--tm)">€${FMT(hireCost)}</span></button>
        <button class="btn ${G.cash>=lvlCost?'pu':'dis'}" onclick="levelTeam('${td.id}',${lvlCost})">⬆ LEVEL <span style="color:var(--tm)">€${FMT(lvlCost)}</span></button>
      </div>
    </div>`;
  }).join('');
}
function hireTeam(id,cost) {
  if(G.cash<cost){toast('Not enough cash!','re');return;}
  G.cash-=cost; G.teams[id].headcount++;
  log(`👤 Hired for ${id}. Headcount: ${G.teams[id].headcount}`,'gr');
  toast(`👤 New hire in ${id}!`,'gr');
  renderTeams();
}
function levelTeam(id,cost) {
  if(G.cash<cost){toast('Not enough cash!','re');return;}
  G.cash-=cost; G.teams[id].level++; G.morale+=5;
  log(`⬆️ ${id} → Lv.${G.teams[id].level}!`,'gr');
  toast(`⬆️ ${id} leveled up!`,'gr');
  renderTeams();
}

function renderCustomers() {
  document.getElementById('c-tot').textContent=`${G.customers.length} / ${maxCustomers()}`;
  document.getElementById('c-mrr').textContent='€'+FMT(calcMRR());
  const el=document.getElementById('cust-list');
  if(!G.customers.length){el.innerHTML=`<div style="font-family:var(--mo);font-size:var(--fmn);color:var(--tm);padding:calc(6px*var(--s))">No customers yet. Sales team on it...</div>`;return;}
  el.innerHTML=G.customers.map((c,i)=>`<div class="cr">
    <span style="font-family:var(--mo);font-size:var(--fmn);color:var(--tm);min-width:calc(24px*var(--s))">#${i+1}</span>
    <span class="cr-name">${c.name}</span>
    <span class="tb- ${c.tier.cls}">${c.tier.label}</span>
    <span style="font-family:var(--mo);font-size:calc(11px*var(--s));color:var(--tm)">${c.region} · ${c.industry}</span>
    <span class="cr-mrr">${c.mrr?'€'+FMT(c.mrr)+'/mo':'TRIAL'}</span>
    <span style="font-family:var(--mo);font-size:calc(12px*var(--s));color:${c.satisfaction>70?'var(--gr)':c.satisfaction>40?'var(--ye)':'var(--re)'}">😊${Math.round(c.satisfaction)}%</span>
    <span style="font-family:var(--mo);font-size:calc(11px*var(--s));color:var(--tm)">${c.addons.length} add-ons</span>
  </div>`).join('');
}

function renderInbox() {
  const open=G.tickets.filter(t=>!t.resolved);
  document.getElementById('ix-open').textContent=open.length;
  const el=document.getElementById('inbox-list');
  el.innerHTML=G.tickets.slice(0,20).map(t=>{
    const timeColor = t.timeLeft > 100 ? 'var(--gr)' : t.timeLeft > 50 ? 'var(--ye)' : 'var(--re)';
    const timerText = t.timeLeft !== undefined ? `⏰ ${t.timeLeft}s` : '';
    return `<div class="tkr ${t.priority==='urgent'?'urg':''} ${t.expired?'expired':''}">
      <div class="tkr-hdr">
        <span class="tkr-id">${t.id}${t.priority==='urgent'?' 🔴':''}</span>
        <span class="tkr-cu">${t.customer}</span>
        ${t.resolved?'<span style="color:var(--gr);font-size:var(--fxs)">✓ RESOLVED</span>':''}
        ${!t.resolved && t.timeLeft !== undefined?`<span style="color:${timeColor};font-size:var(--fxs);margin-left:auto">${timerText}</span>`:''}
      </div>
      <div class="tkr-tx">${t.text}${t.expired?' <span style="color:var(--re)">(EXPIRED)</span>':''}</div>
      ${!t.resolved?`<div class="tkr-ac"><button class="btn gr" onclick="resolveTicket('${t.id}',true)">✓ RESOLVE</button></div>`:''}
    </div>`;
  }).join('')||`<div style="font-family:var(--mo);font-size:var(--fmn);color:var(--gr);padding:calc(6px*var(--s))">🎉 No open tickets! Kate and Michael are pleased.</div>`;
}

function renderFeatures() {
  const queued=DEV_Q.filter(f=>!f.done), done=DEV_Q.filter(f=>f.done), active=queued[0];
  document.getElementById('feat-q').innerHTML=queued.map((f,i)=>`<div class="ftr ${i===0?'ip':''}">
    <div class="fr fb"><div class="ftr-nm">${f.name}${i===0?' ⟳':''}</div><span style="font-size:var(--fxs);color:var(--tm)">${f.cat}</span></div>
    <div class="ftr-mt">Effort: ${f.effort}</div>
    ${i===0?`<div class="pw pw8 mt3"><div class="pf pu" style="width:${Math.min(100,(devProgress/f.effort)*100)}%"></div></div>`:''}
  </div>`).join('')||`<div style="color:var(--gr);font-family:var(--mo);font-size:var(--fmn);padding:calc(6px*var(--s))">🎉 ALL FEATURES SHIPPED! Dave Rocky McHill is crying (happily).</div>`;
  document.getElementById('feat-d').innerHTML=done.map(f=>`<div class="ftr dn"><div class="ftr-nm">${f.name} ✓</div><div class="ftr-mt">${f.cat}</div></div>`).join('');
}

function renderAddons() {
  const el=document.getElementById('addon-list');
  el.innerHTML=ADDON_CATS.map(cat=>{
    const items=Object.entries(ADDONS).filter(([,a])=>a.cat===cat.id);
    return `<div style="margin-bottom:calc(12px*var(--s))">
      <div class="adr-cat">${cat.label}</div>
      ${items.map(([id,a])=>{
        let status;
        if (!a.unlocked) status=`<span style="font-size:calc(10px*var(--s));color:var(--tm)">🔒 Ship to unlock</span>`;
        else if (!G.customers.length) status=`<span style="font-size:calc(10px*var(--s));color:var(--tm)">No customers yet</span>`;
        else if (G.customers.some(c=>!c.addons.find(x=>x.id===id))) status=`<span style="font-size:calc(10px*var(--s));color:var(--ye)">📞 Sales pitching</span>`;
        else status=`<span style="font-size:calc(10px*var(--s));color:var(--gr)">✓ All customers covered</span>`;
        return `<div class="adr ${a.unlocked?'':'lk'}">
          <div class="adr-nm">${a.name}</div>
          <div class="adr-ds">${a.desc}</div>
          <div class="adr-ft">
            <div><span class="adr-pr">€${a.price}${a.rev?' + €'+a.rev+'/mo':''}</span><span style="font-size:calc(10px*var(--s));color:var(--tm);margin-left:calc(6px*var(--s))">Sold: ${a.sold}</span></div>
            ${status}
          </div>
        </div>`;
      }).join('')}
    </div>`;
  }).join('');
}

function renderUpgrades() {
  document.getElementById('upgr-list').innerHTML=UPGRADES.map(u=>`<div class="ugr ${u.done?'dn':''}">
    <div class="ugr-hd"><div class="ugr-nm">${u.name}${u.done?' <span style="color:var(--gr);font-size:var(--fxs)">✓</span>':''}</div>
    ${!u.done?`<button class="btn ye ${G.cash<u.cost?'dis':''}" onclick="buyUpgrade('${u.id}')">€${FMT(u.cost)}</button>`:''}</div>
    <div class="ugr-ds">${u.desc}</div>
  </div>`).join('');
}

function renderRequests() {
  const el=document.getElementById('req-list');
  el.innerHTML=G.featureRequests.map((r,i)=>`<div class="rer" style="border-left:3px solid ${r.analyzed?(r.good?'var(--gd)':'var(--rd)'):'var(--bo)'}">
    <div class="rer-nm">${r.name}</div>
    <div class="rer-ds">${r.desc}</div>
    ${r.analyzing?`<div class="pw pw6 mb3"><div class="pf pc" style="width:${Math.min(100,(r.progress/(r.at*10))*100)}%"></div></div><div style="font-family:var(--mo);font-size:var(--fmn);color:var(--cy)">Barb Wackley reviewing...</div>`:''}
    ${r.accepted===true?`<div style="font-family:var(--mo);font-size:var(--fmn);color:${r.good?'var(--gr)':'var(--ye)'};margin-top:calc(3px*var(--s))">${r.good?'✅ RECOMMENDED → queued for dev':'⚠️ NOT RECOMMENDED → queued anyway (Morale -10, Debt +10)'}</div>`:''}
    ${!r.analyzed&&!r.analyzing&&r.accepted===null?`<button class="btn cy mt3" onclick="analyzeReq(${i})">🔬 ANALYZE</button>`:''}
  </div>`).join('')||`<div style="font-family:var(--mo);font-size:var(--fmn);color:var(--tm);padding:calc(6px*var(--s))">No requests yet. Get more customers!</div>`;
}
function analyzeReq(i){const r=G.featureRequests[i];if(!r||r.analyzing||r.analyzed)return;r.analyzing=true;log(`🔬 Barb Wackley analysing: "${r.name}"`,'in');renderRequests();renderRP();}

function renderMarketing() {
  const el=document.getElementById('mkt-content');
  const t=G.teams.marketing;
  el.innerHTML=`
    <div class="g2 mb6">
      <div class="tp"><span class="pl">MARKETING LEVEL</span><span class="pv ye">Lv.${t.level}</span><span style="font-family:var(--mo);font-size:var(--fmn);color:var(--tm)">Passive lead generation active</span></div>
      <div class="tp"><span class="pl">CAMPAIGN COOLDOWN</span><span class="pv ${G.mktCooldown>0?'re':'gr'}">${G.mktCooldown>0?G.mktCooldown+'s':'READY'}</span></div>
    </div>
    <div class="sech">▸ CAMPAIGNS</div>
    ${MKT_CAMPAIGNS.map((c,i)=>`<div class="mkr">
      <div class="mkr-nm">${c.name}</div>
      <div class="mkr-ds">${c.desc}</div>
      <div class="mkr-ft">
        <div style="font-family:var(--mo);font-size:var(--fmn)">Cost: <span style="color:var(--ye)">€${c.cost}</span> · Leads: <span style="color:var(--gr)">+${c.leads}</span> · Cooldown: <span style="color:var(--tm)">${c.cooldown}s</span></div>
        <button class="btn ${G.cash>=c.cost&&G.mktCooldown===0?'or':'dis'}" onclick="runCampaign(${i})">▶ LAUNCH</button>
      </div>
    </div>`).join('')}
    <div class="sech">▸ TEAM</div>
    <div style="font-family:var(--mo);font-size:var(--fmn);color:var(--td)">
      Luke Oktoberfest 🍺 — ${t.headcount>=1?'Active':'Not hired'}<br>
      Sharky Simpson 🦈 — ${t.headcount>=2?'Active':'Not hired'}<br>
      <span style="color:var(--tm)">Hire more in Teams tab to boost passive lead gen.</span>
    </div>`;
}

function renderRegions() {
  const el=document.getElementById('reg-content');
  const activeCount=Object.values(G.regions).filter(r=>r.active).length;
  const mrrMult=Object.values(G.regions).filter(r=>r.active).reduce((s,r)=>s+r.mrrMult,0);
  el.innerHTML=`
    <div class="g2 mb6">
      <div class="tp"><span class="pl">ACTIVE REGIONS</span><span class="pv ye">${activeCount} / 4</span></div>
      <div class="tp"><span class="pl">GLOBAL MRR MULTIPLIER</span><span class="pv gr">×${mrrMult.toFixed(2)}</span></div>
    </div>
    <div class="g2">
      ${Object.values(G.regions).map(r=>`<div class="rc ${r.active?'ron':r.deploying?'':''}" style="${r.deploying?'border-color:var(--cy)':''}">
        <div class="rc-nm"><span class="rc-flag">${r.flag}</span><span style="color:${r.active?'var(--gr)':r.deploying?'var(--cy)':'var(--tx)'}">${r.name} ${r.active?'✓ LIVE':r.deploying?'⟳ DEPLOYING':''}</span></div>
        <div class="rc-ds">${r.compliance.map(c=>`<span class="ft g">${c}</span>`).join(' ')}</div>
        <div style="font-family:var(--mo);font-size:var(--fmn);color:var(--tm)">MRR bonus: <span style="color:var(--ye)">+${Math.round(r.mrrMult*100)}%</span></div>
        ${r.deploying?`<div class="pw pw8 mt3"><div class="pf pc" style="width:${r.progress}%"></div></div><div style="font-family:var(--mo);font-size:var(--fmn);color:var(--cy);margin-top:calc(2px*var(--s))">David Hiswoman: ${Math.round(r.progress)}%...</div>`:''}
        ${!r.active&&!r.deploying?`<button class="btn ${G.cash>=r.cost?'cy':'dis'} mt3 full" onclick="deployRegion('${r.id}')">🚀 DEPLOY — €${FMT(r.cost)}</button>`:''}
        ${r.active&&r.id==='eu'?`<div style="font-family:var(--mo);font-size:var(--fmn);color:var(--gr);margin-top:calc(3px*var(--s))">🏠 Home — Prague DC. Always active.</div>`:''}
        ${r.active&&r.id!=='eu'?`<div style="font-family:var(--mo);font-size:var(--fmn);color:var(--gr);margin-top:calc(3px*var(--s))">✅ ${r.name} data center online.</div>`:''}
      </div>`).join('')}
    </div>
    <div style="font-family:var(--mo);font-size:var(--fmn);color:var(--tm);margin-top:calc(10px*var(--s));border-top:1px solid var(--bo);padding-top:calc(7px*var(--s))">
      💡 Each region multiplies your MRR and boosts customer acquisition. David Hiswoman manages all infrastructure. Regional servers cost €300/month each in burn.
    </div>`;
}

function renderLeadership() {
  const el=document.getElementById('lead-content');
  el.innerHTML=`<div class="g3 mb6">
    ${['joe','andre','theresa'].map(id=>{
      const c=CHARS[id];
      return `<div class="tp" style="text-align:center;border-top:3px solid ${c.color}">
        <div style="font-size:calc(28px*var(--s));margin-bottom:calc(5px*var(--s))">${c.emoji}</div>
        <div style="font-size:var(--fsm);color:${c.color};margin-bottom:calc(3px*var(--s))">${c.name}</div>
        <div style="font-family:var(--mo);font-size:var(--fmn);color:var(--tm)">${c.role}</div>
        ${id==='joe'?`<div class="mt3"><span class="pl">CEO CHAOS</span><span class="pv" style="font-size:var(--fmn)">${['LOW','MED','HIGH','CRITICAL','DEFCON 1'][Math.min(4,Math.floor(G.techDebt/20))]}</span></div>`:''}
        ${id==='theresa'?`<div class="mt3"><span class="pl">BUDGET MOOD</span><span class="pv" style="font-size:var(--fmn)">${G.cash>5000?'😊':G.cash>1000?'😐':'😰'}</span></div>`:''}
        ${id==='andre'?`<div class="mt3"><span class="pl">OP. EFFICIENCY</span><span class="pv" style="font-size:var(--fmn)">${Math.round(G.morale)}%</span></div>`:''}
      </div>`;
    }).join('')}
  </div>
  <div class="sech">▸ TEAM LEADS</div>
  <div class="g4">
    ${['paul','dave','david','atom','kate','sarah','barb','luke_o','terry'].map(id=>{
      const c=CHARS[id]; const tm=G.teams[c.team];
      return `<div class="tp" style="text-align:center;border-top:3px solid ${c.color}">
        <div style="font-size:calc(20px*var(--s));margin-bottom:calc(3px*var(--s))">${c.emoji}</div>
        <div style="font-size:calc(5px*var(--s));color:${c.color}">${c.name.split(' ')[0]}</div>
        <div style="font-family:var(--mo);font-size:calc(11px*var(--s));color:var(--tm)">${c.role}</div>
        <div class="mt3"><span class="pl">TEAM LV.</span><span class="pv ye" style="font-size:var(--fmn)">Lv.${tm?tm.level:1}</span></div>
        ${tm&&tm.debuffs.length?`<span class="ft b mt3">${tm.debuffs[0].label.substring(0,14)}</span>`:''}
      </div>`;
    }).join('')}
  </div>`;
}

function renderReports() {
  const mrr=calcMRR(), burn=calcBurn();
  document.getElementById('rep-content').innerHTML=`
    <div class="g4 mb6">
      <div class="sb-stat"><div class="sl">MRR</div><div class="sv gr">€${FMT(mrr)}</div></div>
      <div class="sb-stat"><div class="sl">ARR</div><div class="sv gr">€${FMT(mrr*12)}</div></div>
      <div class="sb-stat"><div class="sl">CASH</div><div class="sv ye">€${FMT(G.cash)}</div></div>
      <div class="sb-stat"><div class="sl">BURN/mo</div><div class="sv re">€${FMT(burn)}</div></div>
      <div class="sb-stat"><div class="sl">CUSTOMERS</div><div class="sv bl">${G.customers.length}</div></div>
      <div class="sb-stat"><div class="sl">FEATURES</div><div class="sv">${G.featuresShipped}/${DEV_Q.length}</div></div>
      <div class="sb-stat"><div class="sl">DEPLOYMENTS</div><div class="sv te">${G.deployments}</div></div>
      <div class="sb-stat"><div class="sl">TECH DEBT</div><div class="sv re">${Math.round(G.techDebt)}</div></div>
    </div>
    <div class="sech">▸ CUSTOMERS BY TIER</div>
    ${TIERS.map(t=>{const cs=G.customers.filter(c=>c.tier.id===t.id);if(!cs.length)return '';return `<div class="cr"><span class="tb- ${t.cls}">${t.label}</span><span class="cr-name">${cs.length} customers</span><span class="cr-mrr">€${FMT(cs.reduce((s,c)=>s+c.mrr,0))}/mo</span></div>`;}).join('')||`<div style="font-family:var(--mo);font-size:var(--fmn);color:var(--tm)">No customers yet.</div>`}
    <div class="sech">▸ ADD-ON REVENUE</div>
    ${Object.values(ADDONS).filter(a=>a.sold>0).map(a=>`<div class="cr"><span class="cr-name">${a.name}</span><span style="font-family:var(--mo);font-size:var(--fmn);color:var(--tm)">${a.sold} sold</span><span class="cr-mrr">€${FMT(a.rev*a.sold)}/mo</span></div>`).join('')||`<div style="font-family:var(--mo);font-size:var(--fmn);color:var(--tm)">No add-ons sold yet.</div>`}`;
}

function renderAdmin() {
  document.getElementById('adm-content').innerHTML=`
    <div style="font-family:var(--mo);font-size:var(--fmn);color:var(--tm);margin-bottom:calc(8px*var(--s))">Administration panel — Rectangularo internal instance.</div>
    <div class="g2 mb6">
      <div class="tp"><span class="pl">CURRENT PLAN</span><span class="pv ye">ULTIMATE (Internal)</span></div>
      <div class="tp"><span class="pl">ENVIRONMENT</span><span class="pv gr">PRODUCTION ✅</span></div>
      <div class="tp"><span class="pl">API STATUS</span><span class="pv gr">OPERATIONAL</span></div>
      <div class="tp"><span class="pl">DATA REGION</span><span class="pv">EU 🇪🇺</span></div>
    </div>
    <div class="sech">▸ QUICK ACTIONS</div>
    <div class="fr" style="flex-wrap:wrap">
      <button class="btn pu" onclick="sv('upgrades')">⬆️ Upgrades</button>
      <button class="btn cy" onclick="sv('teams')">🏢 Teams</button>
      <button class="btn ye" onclick="sv('reports')">📊 Reports</button>
      <button class="btn gr" onclick="sv('addons')">🧩 Add-ons</button>
      <button class="btn or" onclick="sv('marketing')">📣 Marketing</button>
    </div>
    <div class="sech">▸ SAVE / LOAD GAME</div>
    <div class="fr" style="flex-wrap:wrap">
      <button class="btn gr" onclick="saveGame()">💾 SAVE GAME</button>
      <button class="btn cy" onclick="loadGame()">📂 LOAD GAME</button>
      <button class="btn re" onclick="deleteSave()">🗑️ DELETE SAVE</button>
    </div>
    <div style="font-family:var(--mo);font-size:var(--fxs);color:var(--tm);margin-top:calc(8px*var(--s));padding-top:calc(8px*var(--s));border-top:1px solid var(--bo)">
      💾 Your game is saved to the browser's local storage. Save files persist until deleted.
    </div>`;
}

// ─── RIGHT PANEL ───────────────────────────────────────────
function setRPTab(id) {
  G.rpTab=id;
  document.querySelectorAll('.rpt').forEach((t,i)=>t.classList.toggle('act',['tix','req','pipe'][i]===id));
  document.querySelectorAll('.rpc').forEach(c=>c.classList.remove('act'));
  document.getElementById('rp-'+id).classList.add('act');
  renderRP(id);
}
function renderRP(tab) {
  tab=tab||G.rpTab;
  // Tickets
  const open=G.tickets.filter(t=>!t.resolved).slice(0,10);
  document.getElementById('rp-tix').innerHTML=open.map(t=>{
    const timeColor = t.timeLeft > 100 ? 'var(--gr)' : t.timeLeft > 50 ? 'var(--ye)' : 'var(--re)';
    const timerText = t.timeLeft !== undefined ? `⏰${t.timeLeft}s` : '';
    return `<div class="tkr ${t.priority==='urgent'?'urg':''}">
      <div class="tkr-hdr">
        <span class="tkr-id">${t.id}</span>
        <span class="tkr-cu">${t.customer.split(' ').slice(0,2).join(' ')}</span>
        ${t.timeLeft !== undefined?`<span style="color:${timeColor};font-size:var(--fxs);margin-left:auto">${timerText}</span>`:''}
      </div>
      <div class="tkr-tx">${t.text.substring(0,55)}${t.text.length>55?'...':''}</div>
      <div class="tkr-ac"><button class="btn gr" onclick="resolveTicket('${t.id}',true)" style="padding:calc(2px*var(--s)) calc(5px*var(--s))">✓ FIX</button></div>
    </div>`;
  }).join('')||`<div style="font-family:var(--mo);font-size:var(--fmn);color:var(--gr);padding:calc(5px*var(--s))">🎉 Inbox zero!</div>`;
  // Requests
  const pend=G.featureRequests.filter(r=>r.accepted===null).slice(0,8);
  document.getElementById('rp-req').innerHTML=pend.map((r,i)=>{
    const ri=G.featureRequests.indexOf(r);
    return `<div class="rer" style="border-left:3px solid ${r.analyzed?(r.good?'var(--gd)':'var(--rd)'):'var(--bo)'}">
      <div style="font-size:var(--fsm)">${r.name}</div>
      <div style="font-family:var(--mo);font-size:var(--fmn);color:var(--tm);margin-top:calc(2px*var(--s))">${r.desc}</div>
      ${r.analyzing?`<div class="pw pw6 mt3"><div class="pf pc" style="width:${Math.min(100,(r.progress/(r.at*10))*100)}%"></div></div>`:''}
      ${r.accepted===true?`<div style="font-family:var(--mo);font-size:calc(9px*var(--s));color:${r.good?'var(--gr)':'var(--ye)'};margin-top:calc(2px*var(--s))">${r.good?'✅ Queued for dev':'⚠️ Queued (Barb warned us)'}</div>`:''}
      ${!r.analyzed&&!r.analyzing?`<button class="btn cy mt3" onclick="analyzeReq(${ri})" style="padding:calc(2px*var(--s)) calc(5px*var(--s))">🔬 ANALYZE</button>`:''}
    </div>`;
  }).join('')||`<div style="font-family:var(--mo);font-size:var(--fmn);color:var(--tm);padding:calc(5px*var(--s))">No pending requests.</div>`;
  // Pipeline
  const top=[...G.customers].sort((a,b)=>b.mrr-a.mrr).slice(0,8);
  document.getElementById('rp-pipe').innerHTML=`
    <div class="mb3"><span class="pl">MRR</span><span class="pv gr">€${FMT(calcMRR())}</span></div>
    <div class="mb6"><span class="pl">CUSTOMERS</span><span class="pv">${G.customers.length}</span></div>
    ${top.map((c,i)=>`<div class="cr" style="font-size:calc(11px*var(--s))"><span style="color:var(--tm);min-width:calc(16px*var(--s))">#${i+1}</span><span style="flex:1">${c.name.split(' ').slice(0,2).join(' ')}</span><span class="tb- ${c.tier.cls}">${c.tier.label}</span><span style="color:var(--gr)">${c.mrr?'€'+FMT(c.mrr):'TRIAL'}</span></div>`).join('')||`<div style="font-family:var(--mo);font-size:var(--fmn);color:var(--tm)">No customers yet.</div>`}`;
}

// ─── VIEW SYSTEM ───────────────────────────────────────────
function sv(id) {
  G.currentView=id;
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('act'));
  document.getElementById('v-'+id)?.classList.add('act');
  document.querySelectorAll('.si').forEach(s=>s.classList.remove('act'));
  document.getElementById('n-'+id)?.classList.add('act');
  G.notifCount=Math.max(0,G.notifCount-1); updBadges();
  if(id==='teams')      renderTeams();
  if(id==='customers')  renderCustomers();
  if(id==='inbox')      renderInbox();
  if(id==='features')   renderFeatures();
  if(id==='addons')     renderAddons();
  if(id==='upgrades')   renderUpgrades();
  if(id==='requests')   renderRequests();
  if(id==='marketing')  renderMarketing();
  if(id==='regions')    renderRegions();
  if(id==='leadership') renderLeadership();
  if(id==='reports')    renderReports();
  if(id==='admin')      renderAdmin();
}

// ─── ACTION CARD CLICKS ────────────────────────────────────
function doSign(type) {
  G.docsProcessed++;
  if(type==='now'){G.cash+=5;toast('✍️ Signed! +€5','gr');log('✍️ SIGN NOW: Document processed.','gr');}
  else if(type==='we'){G.docsProcessed++;G.cash+=15;toast('🤝 Multi-party done! +€15','gr');log('🤝 WE SIGN: Multi-party document processed.','gr');}
  else{if(G.customers.length){const c=G.customers[Math.floor(Math.random()*G.customers.length)];c.satisfaction=Math.min(100,c.satisfaction+3);}toast('📨 Sent for signing!','in');log('📨 THEY SIGN: Document sent.','in');}
}

// ─── LOG & TOAST ───────────────────────────────────────────
const MAX_LOG=30;
function log(msg, type='in') {
  const el=document.getElementById('act-log');
  if(!el) return;
  const d=document.createElement('div'); d.className='lr';
  const t=new Date().toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  d.innerHTML=`<span class="lt">${t}</span><span class="lm ${type}">${msg}</span>`;
  el.prepend(d);
  while(el.children.length>MAX_LOG) el.removeChild(el.lastChild);
}
function toast(msg, type='in') {
  const w=document.getElementById('toasts');
  const d=document.createElement('div'); d.className=`tst ${type}`; d.textContent=msg;
  w.appendChild(d); setTimeout(()=>d.remove(),3200);
}

// ─── SPEED / SCALE ─────────────────────────────────────────
function setSpd(s) {
  G.speed=s;
  document.querySelectorAll('.ctrlbtn').forEach(b=>{if(['½x','1x','2x','5x'].includes(b.textContent))b.classList.remove('act');});
  document.querySelectorAll('.ctrlbtn').forEach(b=>{if(b.textContent==={'0.5':'½x',1:'1x',2:'2x',5:'5x'}[s])b.classList.add('act');});
}
function setScale(s) {
  document.documentElement.style.setProperty('--s',s);
  ['s','m','l','xl','xx'].forEach(id=>document.getElementById('sc-'+id)?.classList.remove('act'));
  ({1.0:'s',1.25:'m',1.5:'l',1.75:'xl',2.0:'xx'}[s]) && document.getElementById('sc-'+({1.0:'s',1.25:'m',1.5:'l',1.75:'xl',2.0:'xx'}[s]))?.classList.add('act');
}

// ─── TICKER ────────────────────────────────────────────────
function updateTicker() {
  document.getElementById('ticker-inner').textContent=[
    `📈 MRR: €${FMT(calcMRR())} ★`,`🔥 BURN: €${FMT(calcBurn())}/mo ★`,
    `👥 CUSTOMERS: ${G.customers.length} ★`,`🐛 DEBT: ${Math.round(G.techDebt)} ★`,
    `🧠 MORALE: ${Math.round(G.morale)}% ★`,`✅ FEATURES: ${G.featuresShipped}/${DEV_Q.length} ★`,
    `🚀 DEPLOYMENTS: ${G.deployments} ★`,`💰 CASH: €${FMT(G.cash)} ★`,
    `📣 JOE NEWMAN: "MAKE THE NUMBERS GO UP" ★`,
    `📊 THERESA SHACKLES: "THAT IS NOT IN THE BUDGET" ★`,
    `🙃 TERRY STROLL: "I AM DEFINITELY STILL FINANCE" ★`,
    `⚙️ ANDRE MOCHALATTE: "FOR CULTURE" ★`,
    `💻 DAVE ROCKY MCHILL: CURRENTLY IN A MERGE CONFLICT ★`,
    `🐳 DAVID HISWOMAN: "WHO TOUCHED THE CONFIG" ★`,
    `🚀 ATOM KOCIÁŠ: DEPLOYING ON A SAMSUNG SMART FRIDGE ★`,
    `🎧 KATE SHOCKWELL: "WE DO NOT DO THAT FOR FREE" ★`,
    `📣 LUKE OKTOBERFEST: "IT WAS AUTOCOMPLETE I SWEAR" ★`,
    `🦈 SHARKY SIMPSON: "MY TEARDOWN WAS LEGALLY REVIEWED" ★`,
    `🧪 SARAH LAWTON: "THOSE ARE BUGS, DAVE. BUGS." ★`,
    `🔬 BARB WACKLEY: "NO." ★`,
    `🤑 LUCAS CLOAKFIELD: "IT IS BASICALLY DONE" ★`,
  ].join(' ');
}

// ─── WIN CHECK ─────────────────────────────────────────────
function checkWin() {
  if (G.won) return;
  if (DEV_Q.every(f=>f.done)&&G.customers.length>=15&&Object.values(G.regions).every(r=>r.active)) {
    G.won=true;
    const ws=document.getElementById('win-screen');
    ws.classList.add('show');
    document.getElementById('win-stats').textContent=`MRR: €${FMT(calcMRR())} | Customers: ${G.customers.length} | Regions: 4/4 | Cash: €${FMT(G.cash)}`;
  }
}

// ─── MAIN LOOP ─────────────────────────────────────────────
let lastLoop = Date.now();
function gameLoop() {
  const now=Date.now(), elapsed=(now-lastLoop)/1000;
  lastLoop=now;
  const ticks=G.paused?0:Math.round(elapsed*G.speed*2);
  for(let i=0;i<ticks;i++){
    G.tick++;
    salesLoop(); supportLoop(); devLoop(); testingLoop();
    devopsLoop(); deliveryLoop(); analystLoop(); marketingLoop(); financeLoop();
    tickDebuffs(); resourcesLoop(); ticketGenLoop(); featureReqLoop(); regionsLoop(); checkThresholds(); eventLoop(); checkTicketExpiry();
    // monthly P&L
    G.monthTick++;
    if(G.monthTick>=MONTH_TICKS){G.monthTick=0;monthEnd();}
  }
  renderTopbar(); renderHome(); updBadges();
  if(G.currentView==='customers') renderCustomers();
  if(G.currentView==='teams')     renderTeams();
  if(G.currentView==='features')  { renderFeatures(); renderRequests(); }
  if(G.currentView==='marketing') renderMarketing();
  if(G.currentView==='leadership')renderLeadership();
  if(G.currentView==='reports')   renderReports();
  if(G.currentView==='regions')   renderRegions();
  if(G.currentView==='addons')    renderAddons();
  if(G.tick%5===0) renderRP();
  if(G.tick%35===0){updateTicker();checkWin();}
}

// ─── SAVE / LOAD / PAUSE ───────────────────────────────────
function togglePause() {
  G.paused=!G.paused;
  document.getElementById('pause-btn').textContent=G.paused?'▶️ RESUME':'⏸️ PAUSE';
  document.getElementById('pause-btn').classList.toggle('paused');
  if(G.paused) log('⏸️ Game paused.','ye');
  else log('▶️ Game resumed.','gr');
}

function saveGame() {
  try {
    const state={
      tick:G.tick, speed:G.speed, cash:G.cash, morale:G.morale, reputation:G.reputation, techDebt:G.techDebt,
      monthTick:G.monthTick, monthCount:G.monthCount, monthlyBurn:G.monthlyBurn,
      docsProcessed:G.docsProcessed, featuresShipped:G.featuresShipped, deployments:G.deployments,
      ticketsResolved:G.ticketsResolved, addonsSold:G.addonsSold,
      customers:G.customers, tickets:G.tickets, featureRequests:G.featureRequests,
      usedRequests:G.usedRequests, won:G.won,
      lastEventTick:G.lastEventTick, lastCrisisTick:G.lastCrisisTick,
      teams:JSON.parse(JSON.stringify(G.teams)), regions:JSON.parse(JSON.stringify(G.regions)),
      devProgress:G.devProgress, mktCooldown:G.mktCooldown, currentView:G.currentView,
      rpTab:G.rpTab, notifCount:G.notifCount,
      devQState:DEV_Q.map(f=>({name:f.name,done:f.done})),
      addonsState:Object.keys(ADDONS).map(k=>({key:k,unlocked:ADDONS[k].unlocked,sold:ADDONS[k].sold}))
    };
    localStorage.setItem('rectangularo_save',JSON.stringify(state));
    toast('💾 Game saved to browser storage.','gr');
    log('💾 Save complete.','gr');
  }catch(e){
    toast('❌ Save failed: '+e.message,'re');
    log('❌ Save error: '+e.message,'re');
  }
}

function loadGame() {
  try {
    const saved=localStorage.getItem('rectangularo_save');
    if(!saved) { toast('❌ No save file found.','re'); return; }
    const state=JSON.parse(saved);
    
    // Restore game state
    G.tick=state.tick;
    G.speed=state.speed;
    G.cash=state.cash;
    G.morale=state.morale;
    G.reputation=state.reputation;
    G.techDebt=state.techDebt;
    G.monthTick=state.monthTick;
    G.monthCount=state.monthCount;
    G.monthlyBurn=state.monthlyBurn;
    G.docsProcessed=state.docsProcessed;
    G.featuresShipped=state.featuresShipped;
    G.deployments=state.deployments;
    G.ticketsResolved=state.ticketsResolved;
    G.addonsSold=state.addonsSold;
    G.customers=state.customers;
    G.tickets=state.tickets;
    G.featureRequests=state.featureRequests;
    G.usedRequests=state.usedRequests||[];
    G.won=state.won||false;
    G.lastEventTick=state.lastEventTick;
    G.lastCrisisTick=state.lastCrisisTick;
    G.devProgress=state.devProgress;
    G.mktCooldown=state.mktCooldown;
    G.currentView=state.currentView;
    G.rpTab=state.rpTab;
    G.notifCount=state.notifCount;
    
    // Restore teams and regions
    Object.keys(G.teams).forEach(t=>{ G.teams[t]=state.teams[t]; });
    Object.keys(G.regions).forEach(r=>{ G.regions[r]=state.regions[r]; });
    
    // Restore dev queue state
    if(state.devQState) {
      state.devQState.forEach((saved,idx)=>{
        if(DEV_Q[idx]) DEV_Q[idx].done=saved.done;
      });
    }
    
    // Restore addon state
    if(state.addonsState) {
      state.addonsState.forEach(saved=>{
        if(ADDONS[saved.key]) {
          ADDONS[saved.key].unlocked=saved.unlocked;
          ADDONS[saved.key].sold=saved.sold;
        }
      });
    }
    
    G.paused=false;
    document.getElementById('pause-btn').textContent='⏸️ PAUSE';
    document.getElementById('pause-btn').classList.remove('paused');
    
    toast('✅ Game loaded! Welcome back.','gr');
    log('✅ Save file loaded.','gr');
    sv(G.currentView);
    renderTopbar();
  }catch(e){
    toast('❌ Load failed: '+e.message,'re');
    log('❌ Load error: '+e.message,'re');
  }
}

function deleteSave() {
  if(confirm('Are you SURE? This will delete your save file permanently.')) {
    localStorage.removeItem('rectangularo_save');
    toast('🗑️ Save file deleted.','ye');
    log('🗑️ Save deleted.','ye');
  }
}

// ─── BOOT ──────────────────────────────────────────────────
log('🚀 Rectangularo v3.0 — engine online.','in');
log('👔 Joe Newman: "We are going to change the world. Also where is my coffee."','ce');
log('⚙️ Andre Mochalatte: "I have optimised the optimisation process."','in');
log('📊 Theresa Shackles has approved the budget. Under protest.','ye');
log('🙃 Terry Stroll: "Hi! I\'m Finance! I\'m DEFINITELY not HR!"','mo');
log('🍺 Luke Oktoberfest: "The campaign deck is almost ready."','in');
log('🦈 Sharky Simpson: "The deck is ready. Luke changed the font."','in');

setTimeout(()=>{addCustomer();addCustomer();},2500);
setTimeout(()=>{genTicket();},7000);
updateTicker();
sv('home');
setInterval(gameLoop,500);

// ─── AUTOSAVE ────────────────────────────────────────────────
setInterval(()=>{
  if(!G.paused) {
    try {
      const state={
        tick:G.tick, speed:G.speed, cash:G.cash, morale:G.morale, reputation:G.reputation, techDebt:G.techDebt,
        monthTick:G.monthTick, monthCount:G.monthCount, monthlyBurn:G.monthlyBurn,
        docsProcessed:G.docsProcessed, featuresShipped:G.featuresShipped, deployments:G.deployments,
        ticketsResolved:G.ticketsResolved, addonsSold:G.addonsSold,
        customers:G.customers, tickets:G.tickets, featureRequests:G.featureRequests,
        usedRequests:G.usedRequests, won:G.won,
        lastEventTick:G.lastEventTick, lastCrisisTick:G.lastCrisisTick,
        teams:JSON.parse(JSON.stringify(G.teams)), regions:JSON.parse(JSON.stringify(G.regions)),
        devProgress:G.devProgress, mktCooldown:G.mktCooldown, currentView:G.currentView,
        rpTab:G.rpTab, notifCount:G.notifCount,
        devQState:DEV_Q.map(f=>({name:f.name,done:f.done})),
        addonsState:Object.keys(ADDONS).map(k=>({key:k,unlocked:ADDONS[k].unlocked,sold:ADDONS[k].sold}))
      };
      localStorage.setItem('rectangularo_save',JSON.stringify(state));
    }catch(e){
      console.error('Autosave failed:',e);
    }
  }
},30000); // Every 30 seconds
