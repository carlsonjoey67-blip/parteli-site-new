import { Check, Package, Wrench, MessageCircle, Send, CalendarDays, UserRound, ArrowUpRight, CheckCheck, Snowflake, Sun, ClipboardCheck, Layers3 } from "lucide-react";
import type { CSSProperties } from "react";

export type StoryFrame = { step: number; chars: number };
export const stories = [
  { id: "handover", label: "The handover", number: "01", word: "GO.", lines: ["A little less admin.", "A lot more", "adventure."], detail: "Every handover is the start of someone’s next adventure. Give your team a clearer view of the vehicles, people, and work behind it.", link: "Keep every handover moving", module: "sales", image: "handover", color: "#eff0eb", note: "EVERY SEASON / ONE CLEAR HANDOVER", season: "All year", beats: ["Connect the details", "Prepare the handover", "Keep everyone in sync"] },
  { id: "motorcycle", label: "Every part", number: "02", word: "RIDE.", lines: ["Every part.", "One bigger", "picture."], detail: "Parts, work orders, and customer conversations belong together. Help the shop stay in sync, so the next ride doesn’t have to wait.", link: "Connect the service floor", module: "service", image: "bike", color: "#ffded3", note: "SPRING TUNE-UPS / EVERYDAY RIDES", season: "Spring into riding", beats: ["Build the ride", "Connect the work", "Update the customer"] },
  { id: "offroad", label: "Off the road", number: "03", word: "PLAY.", lines: ["Built for dirt.", "Without the", "daily friction."], detail: "A busy dealership has plenty of moving parts. Bring inventory and team activity into focus, from the showroom to the service bay.", link: "Put inventory in focus", module: "inventory", image: "utv", color: "#e1efba", note: "TRAIL SEASON / WORK AND PLAY", season: "Trail-ready", beats: ["Meet the machine", "Find the right part", "Keep the bay moving"] },
  { id: "watercraft", label: "On the water", number: "04", word: "FLOW.", lines: ["Make waves.", "Keep business", "flowing."], detail: "From boats and jet skis to the last launch of summer, keep enquiries, bookings, and customer updates connected. Then get a head start on winterization.", link: "See the intelligent next step", module: "intelligence", image: "pwc", color: "#dceaf2", note: "SUMMER LAUNCHES / AUTUMN CARE", season: "From launch to storage", beats: ["Make room for summer", "Connect the booking", "Prepare for next season"] },
  { id: "winter", label: "Ready for snow", number: "05", word: "NEXT.", lines: ["Seasons change.", "Stay a step", "ahead."], detail: "Snowmobiles, preseason checks, and a fresh set of priorities. Bring the right parts, service slots, and customer conversations together before the first snowfall.", link: "Prepare the next season", module: "service", image: "snowmobile", color: "#e9eaf4", note: "AUTUMN PREPARATION / WINTER RIDING", season: "Winter-ready", beats: ["A new season arrives", "Prepare the service bay", "Send a clear next step"] },
];
const workflows = [
  { name: "Alex Morgan", unit: "Adventure 900", title: "One handover. Every detail.", label: "DELIVERY / H-024", rows: ["Vehicle & customer linked", "Inspection completed", "Pickup time confirmed"], incoming: "Is everything ready for pickup?", message: "Yes! Your ride is ready for pickup.", result: "Ready for the next adventure", tags: ["Sales", "Service", "Customer"], part: "Delivery checklist", detail: "One shared record", icon: ClipboardCheck },
  { name: "Jamie Lee", unit: "Adventure 900", title: "From part to pickup.", label: "SERVICE / WO-1042", rows: ["Brake pads reserved", "Fitted to work order", "Service complete"], incoming: "Any update on my bike?", message: "Your bike is ready. See you at 3!", result: "Parts. Service. Customer. Connected.", tags: ["Parts", "Work order", "Customer"], part: "Front brake pad set", detail: "1 set · assigned to WO-1042", icon: Wrench },
  { name: "Sam Taylor", unit: "Utility 700", title: "The right part. Right where it belongs.", label: "INVENTORY / WO-1044", rows: ["Filter found in stock", "Reserved for this job", "Technician updated"], incoming: "Will the part be there for my service?", message: "Your filter is reserved for tomorrow.", result: "One reservation. A team in sync.", tags: ["Inventory", "Service bay", "Customer"], part: "Air filter · Utility 700", detail: "Bin A-12 · 1 reserved", icon: Package },
  { name: "Morgan Chen", unit: "Bowrider 21 / summer service", title: "A smoother season, start to finish.", label: "MARINE / BOOKING-028", rows: ["Summer service booked", "Customer details linked", "Autumn reminder prepared"], incoming: "Can you help with end-of-season care?", message: "Absolutely. Let’s plan your winterization.", result: "Summer booked. Next season considered.", tags: ["Bookings", "Marine service", "Customer"], part: "Summer → autumn", detail: "Launch checks · winterization", icon: CalendarDays },
  { name: "Jordan Wilson", unit: "Summit 850 / preseason check", title: "Ready before the first snowfall.", label: "WINTER / WO-1051", rows: ["Preseason check planned", "Drive belt reserved", "Service slot confirmed"], incoming: "Can we get the sled ready for winter?", message: "You’re booked. Your belt is reserved.", result: "The next season starts with a plan.", tags: ["Winter prep", "Parts", "Customer"], part: "Drive belt · Summit 850", detail: "Reserved for preseason service", icon: Snowflake },
];
export const messageLength = (index: number) => workflows[index].message.length;

function Workflow({index,frame}: {index:number; frame:StoryFrame}) {
  const w = workflows[index]; const Icon = w.icon;
  return <div className="workflow-composition" data-step={frame.step} aria-hidden="true">
    <div className="workflow-window">
      <div className="workflow-top"><img src="/brand/parteli-icon-color.svg" alt=""/><span>PARTELI <small>{w.label}</small></span><span className="workflow-demo">Concept</span></div>
      <div className="workflow-heading"><span className="workflow-season">{index===4?<Snowflake size={14}/>:index===3?<Sun size={14}/>:<Layers3 size={14}/>} {stories[index].season}</span><h3>{w.title}</h3></div>
      <div className="work-identity"><span className="work-avatar"><UserRound size={18}/></span><div><strong>{w.name}</strong><span>{w.unit}</span></div><span className="record-link"><Check size={14}/> Linked</span></div>
      <div className="work-part"><span><Icon size={22}/></span><div><strong>{w.part}</strong><small>{w.detail}</small></div><Check size={17}/></div>
      <div className="work-checklist">{w.rows.map((r,j)=><div key={r} className={frame.step>=j+1?"done":""}><span className="work-check">{frame.step>=j+1?<Check size={12}/>:j+1}</span><span>{r}</span><small>{frame.step>=j+1?"Done":"Pending"}</small></div>)}</div>
      <div className="work-sync"><span className="work-sync-line"/>{w.tags.map(t=><span className={frame.step>=3?"synced":""} key={t}>{frame.step>=3?<CheckCheck size={13}/>:<span className="sync-node"/>}{t}</span>)}</div>
    </div>
    <div className="conversation-card">
      <div className="conversation-top"><MessageCircle size={16}/><strong>Customer conversation</strong></div>
      <p className="chat-incoming">{w.incoming}</p>
      <div className="chat-compose" data-sent={frame.step>=3}><span>{frame.step>=3?w.message:w.message.slice(0,frame.chars)}{frame.step<3&&<i className="typing-caret"/>}</span><Send size={15}/></div>
      <div className="chat-status">{frame.step>=3?<><CheckCheck size={13}/> Sent · linked to the customer record</>:"Preparing an update…"}</div>
    </div>
    <div className="workflow-result" data-complete={frame.step>=3}><span><Check size={18}/></span>{w.result}</div>
  </div>;
}
export function StoryScene({index,frame}:{index:number; frame:StoryFrame}) {
 const c=stories[index];
 return <div className={`story-stage story-stage-${c.image}`} role="img" aria-label={`${c.label}: ${workflows[index].rows.join(', ')}. ${workflows[index].result}. Illustrative product concept.`}>
   {index!==0&&<div className="story-vehicle-scene" aria-hidden="true"><div className="story-ground"/>{c.image==="bike"?<div className="bike-assembly">{Array.from({length:6},(_,part)=><div key={part} className="bike-piece" style={{"--piece-x":`${(part%2===0?-1:1)*(100+part*22)}px`,"--piece-y":`${(part<3?-1:1)*(75+part*18)}px`,"--piece-r":`${(part%2===0?-1:1)*9}deg`,clipPath:`inset(${part<3?0:50}% ${100-(part%3+1)*100/3}% ${part<3?50:0}% ${(part%3)*100/3}%)`} as CSSProperties}><img src="/images/bike.webp" alt="" width="1536" height="1024" loading="eager"/></div>)}</div>:c.image==="pwc"?<div className="marine-pair"><img className="marine-boat" src="/images/boat.webp" alt="" width="1536" height="1024" loading="eager"/><img className="marine-jetski" src="/images/pwc.webp" alt="" width="1536" height="1024" loading="eager"/><div className="marine-names"><span>Boats</span><span>Jet skis</span></div></div>:<img className="story-vehicle" src={`/images/${c.image}.webp`} alt="" width="1536" height="1024" loading="eager"/>}<span className="vehicle-scene-label">{index===1?"MOTORCYCLES":index===2?"ATVs + SIDE-BY-SIDES":index===3?"BOATS + JET SKIS":"SNOWMOBILES"}<ArrowUpRight size={16}/></span></div>}
   <Workflow index={index} frame={frame}/>
 </div>;
}
