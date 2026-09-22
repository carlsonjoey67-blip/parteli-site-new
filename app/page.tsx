"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { ArrowUpRight, ArrowDown, Layers3, CircleGauge, Wrench, Sparkles, Command, Check, Menu, Sun, Snowflake, Leaf, Sprout } from "lucide-react";
import { StoryScene, stories, messageLength, type StoryFrame } from "./story-scene";
import { sceneState, conversationFrame } from "./story-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const modules = [
  { id: "inventory", name: "Inventory", icon: Layers3, title: "Every machine. Every detail.", description: "A clear view of what is on the floor, what is reserved, and what needs attention. Built to keep the right inventory moving.", metric: "36", metricLabel: "Units in stock", secondary: "8", secondaryLabel: "Reserved", columns: ["Unit", "Category", "Status"], rows: [["Summit 850", "Snowmobile", "Available"], ["Wave 180", "Watercraft", "Reserved"], ["Utility 700", "Side-by-side", "Available"]] },
  { id: "sales", name: "Sales", icon: CircleGauge, title: "Keep the conversation moving.", description: "Bring leads, follow-ups, and deals into one view. Give your team the context to pick up exactly where the last conversation left off.", metric: "18", metricLabel: "Open opportunities", secondary: "5", secondaryLabel: "Follow-ups due", columns: ["Opportunity", "Interest", "Stage"], rows: [["Alex Morgan", "Bowrider 21", "New enquiry"], ["Jamie Lee", "Adventure 900", "Quote sent"], ["Sam Taylor", "Wave 180", "Demo booked"]] },
  { id: "service", name: "Service", icon: Wrench, title: "A clearer path through the shop.", description: "Connect work orders, parts, and service updates. Help your front desk and technicians see what is happening and what comes next.", metric: "12", metricLabel: "Active work orders", secondary: "4", secondaryLabel: "Ready for pickup", columns: ["Work order", "Service", "Status"], rows: [["WO-1042", "Scheduled maintenance", "In progress"], ["WO-1043", "Tire replacement", "Ready"], ["WO-1044", "Diagnostic check", "Awaiting parts"]] },
  { id: "intelligence", name: "Intelligence", icon: Sparkles, title: "See the next move sooner.", description: "An AI direction focused on useful signals: inventory that needs attention, follow-ups worth prioritizing, and friction across your operation.", metric: "3", metricLabel: "Suggested priorities", secondary: "1", secondaryLabel: "Inventory review", columns: ["Signal", "Area", "Next step"], rows: [["Aging unit", "Inventory", "Review listing"], ["Open quote", "Sales", "Follow up"], ["Parts delay", "Service", "Check order"]] },
];
const signals = [
  { title: "Inventory that needs a second look.", label: "Inventory opportunity", text: "Adventure 900 has been in stock for 62 days.", action: "Review the listing, pricing, and recent enquiries.", context: "62 days in stock", icon: Layers3 },
  { title: "The right follow-up, at the right time.", label: "Sales opportunity", text: "An open quote has had no follow-up for 3 days.", action: "Reconnect with the buyer and answer any outstanding questions.", context: "3 days since last contact", icon: CircleGauge },
  { title: "Spot a delay before it compounds.", label: "Service opportunity", text: "Two work orders are waiting on the same part.", action: "Check the supplier update and keep both customers informed.", context: "2 work orders affected", icon: Wrench },
];
const chapters = stories;
const clamp = (n: number) => Math.max(0, Math.min(1, n));
function Brand({compact = false}: {compact?: boolean}) { return <img className={compact ? "brand brand-compact" : "brand"} src="/brand/parteli-primary-lockup.svg" alt="Parteli" width="170" height="70"/>; }

export default function Home() {
  const root = useRef<HTMLElement>(null);
  const hero = useRef<HTMLElement>(null);
  const anchors = useRef<(HTMLDivElement | null)[]>([]);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const [storyFrames, setStoryFrames] = useState<StoryFrame[]>(chapters.map(()=>({step:0,chars:0})));
  const [active, setActive] = useState("inventory");
  const [signal, setSignal] = useState("0");
  const [currentChapter, setCurrentChapter] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const elements = root.current?.querySelectorAll(".reveal") || [];
    if (!("IntersectionObserver" in window)) { elements.forEach(el => el.classList.add("visible")); return; }
    const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } }), { threshold: .1 });
    elements.forEach(el => { if (el.getBoundingClientRect().top > innerHeight) el.classList.remove("visible"); observer.observe(el); });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    let frame = 0;
    let lastPaint = 0;
    const playing = chapters.map(() => 0);
    const old = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    const paint = (now: number) => {
      frame = 0; const h = innerHeight;
      const elapsed = Math.min(1000, Math.max(0, now - lastPaint)); lastPaint = now;
      let keepPlaying = false;
      if (root.current) root.current.dataset.enhanced = "true";
      root.current?.style.setProperty("--read", String(scrollY / Math.max(1, document.documentElement.scrollHeight - h)));
      hero.current?.style.setProperty("--hero-scroll", String(clamp(scrollY / h)));
      let selected = 0;
      const nextFrames: StoryFrame[] = [];
      anchors.current.forEach((anchor, i) => {
        const card = cards.current[i]; if (!anchor || !card) return;
        const top = anchor.getBoundingClientRect().top;
        // Tall panels scroll normally until their entire content has been visible, then pin.
        const pin = Math.min(innerWidth <= 800 ? 133 : 149, h - card.offsetHeight - 18);
        card.style.setProperty("--pin", `${pin}px`);
        const scene = card.querySelector(".story-stage")!.getBoundingClientRect();
        const nextTop = anchors.current[i+1]?.getBoundingClientRect().top ?? Infinity;
        const header = innerWidth <= 800 ? 125 : 140;
        const visibleHeight = Math.max(0, Math.min(scene.bottom, h, nextTop) - Math.max(scene.top, header));
        const inView = scene.top < Math.max(header+24,h*.4) && visibleHeight >= Math.min(scene.height*.6,(h-header)*.6);
        // Scrolling only brings a scene on stage. Its entire performance runs on time.
        // Replay on a fresh visit, but never loop while someone is reading the result.
        if (scene.top > h+40 || scene.bottom < header || nextTop < header) playing[i] = 0;
        const duration = i===0 ? 6800 : 10300;
        if (inView && !document.hidden && playing[i] < duration) {
          playing[i] += elapsed;
          keepPlaying = true;
        }
        const sceneMotion = sceneState(playing[i], false, i===0);
        const {workflow,arrival} = sceneMotion;
        const next = anchors.current[i+1];
        const cover = !next ? 0 : clamp((h*.75-next.getBoundingClientRect().top)/(h*.65));
        card.style.setProperty("--arrival", String(arrival));
        card.style.setProperty("--assembly", String(1-arrival));
        card.style.setProperty("--word-y", `${(1-arrival)*22}px`);
        card.style.setProperty("--depart", `${sceneMotion.depart}%`);
        card.style.setProperty("--vehicle-alpha", String(sceneMotion.vehicleOpacity));
        card.style.setProperty("--workflow-alpha", String(workflow));
        card.style.setProperty("--workflow-y", `${sceneMotion.workflowY}px`);
        card.style.setProperty("--stack-scale", String(1-cover*.025));
        card.style.setProperty("--story-progress", String(sceneMotion.progress));
        card.dataset.workflow = workflow>.01 ? "visible" : "hidden";
        card.dataset.phase = sceneMotion.phase;
        nextFrames.push(conversationFrame(sceneMotion.conversationElapsed, messageLength(i)));
        if(top<h*.55) selected=i;
      });
      setStoryFrames(previous => JSON.stringify(previous)===JSON.stringify(nextFrames) ? previous : nextFrames);
      setCurrentChapter(previous => previous === selected ? previous : selected);
      if (keepPlaying) frame = requestAnimationFrame(paint);
    };
    const update = () => { if (!frame) { lastPaint = performance.now(); frame = requestAnimationFrame(paint); } };
    const sizes = new ResizeObserver(update); cards.current.forEach(card=>{if(card)sizes.observe(card);});
    update(); window.addEventListener("scroll", update, {passive:true}); window.addEventListener("resize", update); document.addEventListener("visibilitychange", update);
    return () => { cancelAnimationFrame(frame); sizes.disconnect(); document.documentElement.style.scrollBehavior = old; window.removeEventListener("scroll", update); window.removeEventListener("resize", update); document.removeEventListener("visibilitychange", update); };
  }, []);
  const tilt = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const r = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--rx", `${(event.clientY-r.top-r.height/2)/r.height*-8}deg`);
    event.currentTarget.style.setProperty("--ry", `${(event.clientX-r.left-r.width/2)/r.width*8}deg`);
  };
  const resetTilt = (e: PointerEvent<HTMLDivElement>) => { e.currentTarget.style.setProperty("--rx", "0deg");e.currentTarget.style.setProperty("--ry", "0deg"); };

  return <main ref={root} data-motion="on">
    <a href="#platform" className="skip-link">Skip to the platform</a><div className="reading-progress" aria-hidden="true"/>
    <header className="site-header"><nav className="nav shell" aria-label="Main navigation">
      <a href="#top" aria-label="Parteli home"><Brand/></a>
      <div className="nav-links"><a href="#world">Our world</a><a href="#platform">The platform</a><a href="#intelligence">Intelligence</a></div>
      <div className="nav-actions"><a href="#contact" className="button button-dark nav-cta">Let’s talk <ArrowUpRight size={17}/></a><button className="mobile-menu-toggle" aria-label="Toggle navigation" aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={()=>setMenuOpen(!menuOpen)}><Menu size={23}/></button></div>
      {menuOpen && <div className="mobile-nav" id="mobile-nav">{[["Our world","world"],["The platform","platform"],["Intelligence","intelligence"],["Let’s talk","contact"]].map(([name,id])=><a href={`#${id}`} key={id} onClick={()=>setMenuOpen(false)}>{name}<ArrowUpRight size={17}/></a>)}</div>}
    </nav></header>

    <section className="hero" id="top" ref={hero}>
      <div className="shell hero-top"><span className="eyebrow"><i/> THE OPERATION BEHIND THE ADVENTURE</span><span className="hero-small">Powersports. Recreation.<br/>A whole world in motion.</span></div>
      <h1><span className="hero-line">Built for what</span><span className="hero-line">moves <em>you.</em><svg className="headline-spark" width="60" height="60" viewBox="0 0 60 60" aria-hidden="true"><path d="M30 1v58M1 30h58M9 9l42 42M9 51L51 9" stroke="currentColor" strokeWidth="7"/></svg></span></h1>
      <div className="hero-showroom" aria-label="Motorcycles, off-road vehicles, boats, jet skis, and snowmobiles">
        <div className="showroom-grid" aria-hidden="true"/>
        <img className="hero-vehicle hero-marine" src="/images/pwc.webp" alt="A blue and white jet ski" fetchPriority="high" width="1536" height="1024"/>
        <img className="hero-vehicle hero-utv" src="/images/utv.webp" alt="An off-road side-by-side" fetchPriority="high" width="1536" height="1024"/>
        <img className="hero-vehicle hero-bike" src="/images/bike.webp" alt="An adventure motorcycle" fetchPriority="high" width="1536" height="1024"/>
        <span className="hero-label hero-label-one"><span>01</span> FROM TRAIL TO WATER</span><span className="hero-label hero-label-two"><span>05</span> AND INTO WINTER</span>
        <div className="hero-feature hero-feature-one"><Layers3 size={17}/><span>Every part.<br/><b>Connected.</b></span><Check size={15}/></div>
        <div className="hero-feature hero-feature-two"><Wrench size={17}/><span>The whole shop.<br/><b>In sync.</b></span></div>
      </div>
      <div className="shell hero-bottom"><p>A new operating system for the dealers<br/>who keep adventure moving.</p><a href="#world" className="button button-red">Step into our world <ArrowDown size={17}/></a><span className="hero-index">SCROLL TO FEEL THE DIFFERENCE<br/><b>01 — 05</b></span></div>
    </section>

    <section className="world-intro shell" id="world"><div className="section-meta reveal"><span className="eyebrow">ONE WORLD. MANY WAYS TO MOVE.</span><span className="tiny">EVERY MACHINE. EVERY SEASON.</span></div><h2 className="reveal">The machines are different.<br/>The feeling is <em>the same.</em></h2><div className="world-intro-bottom reveal"><p>Freedom out there starts with the people back here.<br/>We’re building Parteli for the work behind every adventure, in every season.</p><a href="#handover" className="circle-link" aria-label="Begin the vehicle story"><ArrowDown size={23}/></a></div><div className="season-ribbon" aria-label="A year at the dealership"><span><Sprout size={18}/><b>Spring</b> Tune up</span><span><Sun size={18}/><b>Summer</b> Get out there</span><span><Leaf size={18}/><b>Autumn</b> Prepare & store</span><span><Snowflake size={18}/><b>Winter</b> Keep riding</span></div></section>

    <div className="chapter-stack" aria-label="The Parteli powersports story">
      <nav className="chapter-nav" aria-label="Dealership stories">{chapters.map((c,i)=><a href={`#${c.id}`} aria-label={`${c.number} ${c.label}`} className={currentChapter===i?"active":""} key={c.id} aria-current={currentChapter===i?"step":undefined}>{c.number}<span>{c.label}</span></a>)}</nav>
      {chapters.map((c,i)=><Fragment key={c.id}>
        <div className="chapter-anchor" id={c.id} ref={el=>{anchors.current[i]=el;}}/>
        <section className={`chapter chapter-${c.image}`} ref={el=>{cards.current[i]=el;}} style={{"--scene":c.color,"--level":i+1} as CSSProperties} aria-labelledby={`${c.id}-title`}>
          <div className="chapter-top"><span className="eyebrow">{c.number} / {c.label}</span><span className="chapter-kicker">{c.note}</span></div>
          <span className="chapter-backword" aria-hidden="true">{c.word}</span>
          <div className="chapter-copy"><h2 id={`${c.id}-title`}>{c.lines.map((line,j)=><span className={`punchline punchline-${j}`} key={line}><span>{line}</span></span>)}</h2><p>{c.detail}</p><a className="text-link" href="#platform" onClick={()=>setActive(c.module)}>{c.link}<ArrowUpRight size={18}/></a></div>
          <StoryScene index={i} frame={storyFrames[i] || {step:0,chars:0}}/>
          <div className="chapter-bottom"><div className="story-beats">{c.beats.map((beat,j)=><span key={beat} className={(i===0 ? storyFrames[i]?.step>=j : j===0 || (j===1 && storyFrames[i]?.step>=1) || (j===2 && storyFrames[i]?.step>=3))?"beat-active":""}><b>0{j+1}</b>{beat}</span>)}</div><span className="story-concept">Illustrative concept</span></div>
          <div className="chapter-meter" aria-hidden="true"/>
        </section>
        <div className="chapter-space" aria-hidden="true"/>
      </Fragment>)}
    </div>

    <section className="connection shell"><div className="connection-heading reveal"><span className="eyebrow">BEHIND EVERY GREAT ESCAPE</span><h2>A dealership with<br/>everything <em>together.</em></h2><p>That’s the idea behind Parteli. Connect the work.<br/>Give your team more room to do what they do best.</p></div><div className="connection-parts reveal"><div className="part-chip part-chip-one"><Layers3/>Inventory</div><div className="part-chip part-chip-two"><Wrench/>Service</div><img src="/brand/parteli-icon-color.svg" alt="Parteli connects the dealership"/><div className="part-chip part-chip-three"><CircleGauge/>Sales</div><div className="part-chip part-chip-four"><Sparkles/>Intelligence</div></div></section>

    <section className="platform-section shell" id="platform"><div className="section-meta reveal"><span className="eyebrow">THE PLATFORM / IN DEVELOPMENT</span><span className="tiny">LESS FRICTION. MORE FORWARD.</span></div><div className="section-heading reveal"><h2>Big adventures.<br/><em>Small details, handled.</em></h2><p>Explore the connected dealership we’re building.<br/>Select a workspace to see the concept.</p></div>
      <Tabs value={active} onValueChange={setActive} className="product-tabs"><TabsList className="product-tab-list" aria-label="Explore dealership departments">{modules.map(m=><TabsTrigger className="product-tab" key={m.id} value={m.id}><m.icon size={18}/>{m.name}<ArrowUpRight size={15}/></TabsTrigger>)}</TabsList>{modules.map(m=><TabsContent className="product-panel" key={m.id} value={m.id}><div className="product-story"><span className="eyebrow">{m.name} / CONNECTED</span><h3>{m.title}</h3><p>{m.description}</p><span className="concept-label">Interactive concept · Illustrative data</span></div><div className="product-window-wrap" onPointerMove={tilt} onPointerLeave={resetTilt}><div className="product-window"><div className="window-top"><Brand compact/><span>YOUR DEALERSHIP</span><span className="avatar">JD</span></div><div className="window-body"><aside aria-hidden="true"><Command size={19}/><Layers3 size={19}/><CircleGauge size={19}/><Wrench size={19}/><Sparkles size={19}/></aside><div className="workspace"><div className="workspace-title"><h4>{m.name} overview</h4><span className="demo-badge">Concept preview</span></div><div className="metrics"><div><span>{m.metricLabel}</span><strong>{m.metric}<i>↗</i></strong></div><div><span>{m.secondaryLabel}</span><strong>{m.secondary}</strong></div></div><div className="preview-table" role="table" aria-label={`${m.name} sample records`}><div className="table-heading" role="row">{m.columns.map(col=><span role="columnheader" key={col}>{col}</span>)}</div>{m.rows.map((row,j)=><div className="table-row" role="row" key={row[0]} style={{"--row":j} as CSSProperties}>{row.map((cell,k)=><span role="cell" key={k}>{k===2?<b className="status-chip">{cell}</b>:cell}</span>)}</div>)}</div><div className="workspace-bottom"><Check size={14}/>Everything in one view</div></div></div></div></div></TabsContent>)}</Tabs>
    </section>

    <section className="intelligence-section shell" id="intelligence"><div className="section-meta reveal"><span className="eyebrow">INTELLIGENCE / WITH PURPOSE</span><span className="tiny">YOUR NEXT MOVE, IN FOCUS.</span></div><Tabs value={signal} onValueChange={setSignal} className="intelligence-layout"><div className="intelligence-copy reveal"><h2>A little foresight.<br/><em>A lot of possibility.</em></h2><p>Our AI vision starts with everyday dealer questions. What needs attention? What is being missed? What should happen next?</p><TabsList className="signal-list" aria-label="Explore AI scenarios">{signals.map((s,i)=><TabsTrigger className="signal-trigger" key={s.label} value={String(i)}><span>0{i+1}</span>{s.title}<ArrowUpRight size={17}/></TabsTrigger>)}</TabsList></div><div className="signal-stage">{signals.map((s,i)=><TabsContent className="signal-panel" key={s.label} value={String(i)}><div className="signal-card"><div className="signal-card-top"><Sparkles size={22}/><span>PARTELI INTELLIGENCE<small>Illustrative scenario</small></span></div><span className="signal-category"><s.icon size={15}/>{s.label}</span><h3>{s.text}</h3><p>{s.action}</p><div className="signal-context">{s.context}<ArrowUpRight size={17}/></div></div><div className="human-note"><Check size={15}/>Useful suggestions. Your team makes the call.</div></TabsContent>)}</div></Tabs></section>

    <section className="contact-section" id="contact"><div className="shell contact-inner"><span className="eyebrow reveal">LET’S BUILD WHAT MOVES NEXT.</span><h2 className="reveal">The next chapter?<br/><em>It starts with you.</em></h2><div className="contact-bottom"><p>We’re building with powersports dealers.<br/>Bring your workflows. Tell us where things get stuck.</p><a href="mailto:support@parteli.ca?subject=Parteli%20dealer%20conversation" className="button button-dark">Start a conversation<ArrowUpRight size={20}/></a></div><div className="contact-vehicles" aria-hidden="true"><img src="/images/bike.webp" alt="" loading="lazy"/><img src="/images/utv.webp" alt="" loading="lazy"/><img src="/images/pwc.webp" alt="" loading="lazy"/><img src="/images/boat.webp" alt="" loading="lazy"/><img src="/images/snowmobile.webp" alt="" loading="lazy"/></div></div></section>
    <footer className="shell footer"><a href="#top" aria-label="Back to Parteli home"><Brand/></a><p>Built for what moves you.</p><span>© 2026 PARTELI</span><a className="circle-link" href="#top" aria-label="Back to top"><ArrowUpRight size={20}/></a></footer>
  </main>;
}
