import { useState, useEffect, useRef } from "react";
import happyTuesdayImg from "@/imports/image-2.png";
import byeByeExamsImg from "@/imports/image-3.png";
import familyFunImg from "@/imports/image-4.png";
import watAWednesdayImg from "@/imports/image-8.png";
import adventureSavingsImg from "@/imports/image-5.png";
import snowParkImg from "@/imports/image-7.png";
import char10Img from "@/imports/image-10.png";
import char11Img from "@/imports/image-11.png";
import char12Img from "@/imports/image-12.png";
import tubbbyImg    from "@/imports/image-13.png";
import bowWowImg    from "@/imports/image-14.png";
import rajasaurusImg from "@/imports/image-15.png";
import neeraImg     from "@/imports/image-16.png";
import {
  Menu, X, Bell, Search, ChevronRight, Star, Clock, Users, Zap, MapPin,
  Ticket, Gift, Home, Compass, Award, ArrowRight, TrendingUp, CloudSun,
  Wind, Droplets, AlertCircle, CheckCircle, Play, Volume2, Bot, ThumbsUp,
  Navigation, ChevronDown, Flame, Sparkles, ShoppingCart, Heart, Plus,
  Minus, Trash2, Filter, SlidersHorizontal, Package, User, Phone, Mail,
  Lock, Globe, Accessibility, Settings, LogOut, Trophy, Target, Cpu,
  QrCode, Download, Share2, RefreshCw, ChevronLeft, MoreHorizontal,
  Utensils, ShoppingBag, BarChart2, Check, Info, CreditCard
} from "lucide-react";

// ─── Palette ────────────────────────────────────────────────────────────────
const BLUE   = "#1a6ef5";
const BLUE2  = "#0052cc";
const CYAN   = "#06b6d4";
const INDIGO = "#6366f1";
const GREEN  = "#10b981";
const ORANGE = "#f97316";
const AMBER  = "#f59e0b";
const RED    = "#ef4444";
const PURPLE = "#8b5cf6";

// ─── Images ─────────────────────────────────────────────────────────────────
const IMG = {
  hero:    "https://images.unsplash.com/photo-1601930113377-729966035f34?w=1800&h=900&fit=crop&auto=format",
  roller:  "https://images.unsplash.com/photo-1547675960-7634cf1b0856?w=600&h=400&fit=crop&auto=format",
  water:   "https://images.unsplash.com/photo-1760281487360-68bf06368e6d?w=600&h=400&fit=crop&auto=format",
  ferris:  "https://images.unsplash.com/photo-1692301311188-bda319576dd1?w=600&h=400&fit=crop&auto=format",
  neon:    "https://images.unsplash.com/photo-1761501638917-f6fb28a84adb?w=600&h=400&fit=crop&auto=format",
  swing:   "https://images.unsplash.com/photo-1460176449511-ff5fc8e64c35?w=600&h=400&fit=crop&auto=format",
  splash:  "https://images.unsplash.com/photo-1631800744177-0e434940e0c8?w=600&h=400&fit=crop&auto=format",
  coaster: "https://images.unsplash.com/photo-1536302996699-caceffbc68df?w=600&h=400&fit=crop&auto=format",
  tower:   "https://images.unsplash.com/photo-1668593107037-836e886119fc?w=600&h=400&fit=crop&auto=format",
};

// ─── All 17 Rides ────────────────────────────────────────────────────────────
const ALL_RIDES = [
  // Thriller
  { id:1,  name:"Thunder Loop",      category:"Thriller", img:IMG.roller,  wait:22, rating:4.9, thrill:5, duration:"2 min",   height:"120 cm", age:"12+", visitors:148, status:"open",        zone:"Zone A", fastPass:true  },
  { id:2,  name:"Sky Screamer",      category:"Thriller", img:IMG.neon,    wait:35, rating:4.8, thrill:5, duration:"1.5 min", height:"130 cm", age:"14+", visitors:203, status:"open",        zone:"Zone A", fastPass:true  },
  { id:3,  name:"Vortex Drop",       category:"Thriller", img:IMG.tower,   wait:28, rating:4.7, thrill:5, duration:"1 min",   height:"125 cm", age:"14+", visitors:176, status:"open",        zone:"Zone A", fastPass:false },
  { id:4,  name:"Cyclone Rush",      category:"Thriller", img:IMG.coaster, wait:40, rating:4.6, thrill:4, duration:"3 min",   height:"115 cm", age:"12+", visitors:132, status:"open",        zone:"Zone A", fastPass:true  },
  { id:5,  name:"Gravity Spin",      category:"Thriller", img:IMG.roller,  wait:18, rating:4.5, thrill:4, duration:"2.5 min", height:"120 cm", age:"12+", visitors:98,  status:"maintenance", zone:"Zone A", fastPass:false },
  { id:6,  name:"Fire Storm",        category:"Thriller", img:IMG.neon,    wait:32, rating:4.7, thrill:5, duration:"2 min",   height:"130 cm", age:"16+", visitors:156, status:"open",        zone:"Zone A", fastPass:true  },
  // Water
  { id:7,  name:"Splash River",      category:"Water",    img:IMG.water,   wait:18, rating:4.7, thrill:3, duration:"4 min",   height:"100 cm", age:"6+",  visitors:176, status:"open",        zone:"Zone B", fastPass:false },
  { id:8,  name:"Aqua Twister",      category:"Water",    img:IMG.splash,  wait:28, rating:4.6, thrill:4, duration:"3 min",   height:"110 cm", age:"10+", visitors:132, status:"open",        zone:"Zone B", fastPass:true  },
  { id:9,  name:"Wave Racer",        category:"Water",    img:IMG.water,   wait:22, rating:4.4, thrill:3, duration:"5 min",   height:"105 cm", age:"8+",  visitors:89,  status:"open",        zone:"Zone B", fastPass:false },
  { id:10, name:"Tsunami Falls",     category:"Water",    img:IMG.splash,  wait:45, rating:4.8, thrill:4, duration:"4 min",   height:"120 cm", age:"12+", visitors:201, status:"open",        zone:"Zone B", fastPass:true  },
  // Family
  { id:11, name:"Adventure Express", category:"Family",   img:IMG.swing,   wait:15, rating:4.4, thrill:2, duration:"5 min",   height:"90 cm",  age:"5+",  visitors:87,  status:"maintenance", zone:"Zone C", fastPass:false },
  { id:12, name:"Magic Carousel",    category:"Family",   img:IMG.ferris,  wait:8,  rating:4.3, thrill:1, duration:"6 min",   height:"None",   age:"3+",  visitors:62,  status:"open",        zone:"Zone C", fastPass:false },
  { id:13, name:"Jungle Safari",     category:"Family",   img:IMG.swing,   wait:12, rating:4.5, thrill:2, duration:"8 min",   height:"80 cm",  age:"4+",  visitors:94,  status:"open",        zone:"Zone C", fastPass:false },
  { id:14, name:"Sky Wheel",         category:"Family",   img:IMG.ferris,  wait:10, rating:4.5, thrill:1, duration:"8 min",   height:"None",   age:"All", visitors:94,  status:"open",        zone:"Zone C", fastPass:false },
  // Kids
  { id:15, name:"Mini Dragon",       category:"Kids",     img:IMG.swing,   wait:5,  rating:4.2, thrill:1, duration:"3 min",   height:"None",   age:"2+",  visitors:44,  status:"open",        zone:"Zone D", fastPass:false },
  { id:16, name:"Happy Train",       category:"Kids",     img:IMG.ferris,  wait:6,  rating:4.1, thrill:1, duration:"5 min",   height:"None",   age:"2+",  visitors:52,  status:"open",        zone:"Zone D", fastPass:false },
  { id:17, name:"Pirate Ship",       category:"Kids",     img:IMG.roller,  wait:10, rating:4.3, thrill:2, duration:"4 min",   height:"None",   age:"4+",  visitors:68,  status:"open",        zone:"Zone D", fastPass:false },
];

const FOODS = [
  { id:1, name:"Masala Burger",    cat:"Fast Food",  price:180, rating:4.5, img:IMG.swing,  wait:"8 min",  popular:true  },
  { id:2, name:"Pepperoni Pizza",  cat:"Italian",    price:320, rating:4.7, img:IMG.ferris, wait:"12 min", popular:true  },
  { id:3, name:"Grilled Chicken",  cat:"Grill",      price:280, rating:4.6, img:IMG.swing,  wait:"10 min", popular:false },
  { id:4, name:"Mango Smoothie",   cat:"Beverages",  price:120, rating:4.8, img:IMG.water,  wait:"3 min",  popular:true  },
  { id:5, name:"Veg Thali",        cat:"Indian",     price:220, rating:4.4, img:IMG.roller, wait:"15 min", popular:false },
  { id:6, name:"Cheese Fries",     cat:"Fast Food",  price:140, rating:4.5, img:IMG.splash, wait:"5 min",  popular:true  },
];

const MERCH = [
  { id:1, name:"ThrillVerse Tee",     cat:"Clothing",  price:599,  rating:4.6, img:IMG.swing,  liked:false },
  { id:2, name:"Roller Coaster Cap",  cat:"Clothing",  price:349,  rating:4.4, img:IMG.ferris, liked:true  },
  { id:3, name:"Park Keychain",       cat:"Souvenirs", price:149,  rating:4.7, img:IMG.neon,   liked:false },
  { id:4, name:"Thrillverse Mug",     cat:"Souvenirs", price:299,  rating:4.5, img:IMG.splash, liked:false },
  { id:5, name:"Adventure Backpack",  cat:"Bags",      price:999,  rating:4.8, img:IMG.roller, liked:true  },
  { id:6, name:"Kids Plushie Set",    cat:"Toys",      price:449,  rating:4.9, img:IMG.swing,  liked:false },
];

const ACHIEVEMENTS = [
  { id:1, title:"Speed Demon",    desc:"Complete 5 Thriller rides",    xp:200, done:true,  icon:"⚡" },
  { id:2, title:"Water Baby",     desc:"Try all 4 Water rides",        xp:150, done:true,  icon:"🌊" },
  { id:3, title:"Queue Master",   desc:"Use Virtual Queue 10 times",   xp:100, done:false, icon:"🎟️" },
  { id:4, title:"Foodie",         desc:"Order from 3 restaurants",     xp:80,  done:false, icon:"🍔" },
  { id:5, title:"Park Explorer",  desc:"Visit all 4 zones",            xp:120, done:true,  icon:"🗺️" },
  { id:6, title:"Social Thrill",  desc:"Invite 3 friends",             xp:200, done:false, icon:"👥" },
];

const LEADERBOARD = [
  { rank:1, name:"Arjun Mehta",    xp:4820, badge:"👑", rides:34 },
  { rank:2, name:"Priya Sharma",   xp:4210, badge:"🥈", rides:29 },
  { rank:3, name:"Rahul Verma",    xp:3980, badge:"🥉", rides:27 },
  { rank:4, name:"You",            xp:2450, badge:"🎢", rides:18, isMe:true },
  { rank:5, name:"Sneha Patel",    xp:2310, badge:"⭐", rides:16 },
];

// ─── Category colors ─────────────────────────────────────────────────────────
const catStyle: Record<string, { bg:string; text:string }> = {
  Thriller: { bg:"#fff0ea", text:ORANGE },
  Water:    { bg:"#e0f9ff", text:CYAN   },
  Family:   { bg:"#eef2ff", text:INDIGO },
  Kids:     { bg:"#f0fdf4", text:GREEN  },
};

// ─── Thrill dots ──────────────────────────────────────────────────────────────
const ThrillDots = ({ level }: { level:number }) => (
  <div className="flex gap-1">
    {Array.from({length:5},(_,i) => (
      <span key={i} className="w-2 h-2 rounded-full" style={{ background: i < level ? ORANGE : "#fde8d8" }} />
    ))}
  </div>
);

// ─── Shared Navbar ────────────────────────────────────────────────────────────
function Navbar({ page, setPage, scrolled }: { page:string; setPage:(p:string)=>void; scrolled:boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen]   = useState(false);
  const navLinks = ["Home","Attractions","Explore","Virtual Queue","Park Map","Tickets","Rewards","Profile"];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.88)",
        backdropFilter:"blur(16px)",
        borderBottom: scrolled ? "1px solid rgba(26,110,245,0.12)" : "none",
        boxShadow: scrolled ? "0 2px 20px rgba(26,110,245,0.08)" : "none",
      }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <button onClick={()=>setPage("Home")} className="text-2xl font-black tracking-tight shrink-0" style={{ fontFamily:"'Exo 2',sans-serif" }}>
          <span style={{color:BLUE}}>Thrill</span><span style={{color:"#0d1f3c"}}>verse</span>
        </button>

        <nav className="hidden lg:flex items-center gap-0.5">
          {navLinks.map(link => (
            <button key={link} onClick={()=>setPage(link)}
              className="px-3 py-1.5 rounded-xl text-sm transition-all duration-200"
              style={{ color: page===link ? BLUE : "#5a78a8", background: page===link ? "#eef4ff":"transparent", fontWeight: page===link ? 700:500 }}>
              {link}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#eef4ff] transition-colors"
            style={{ border:"1px solid rgba(26,110,245,0.15)" }} onClick={()=>setNotifOpen(v=>!v)}>
            <Bell size={15} style={{color:"#5a78a8"}} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{background:ORANGE}} />
          </button>
          <button onClick={()=>setPage("Tickets")}
            className="hidden sm:flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-blue-200"
            style={{ background:`linear-gradient(135deg,${BLUE},${BLUE2})` }}>
            <Ticket size={13}/> Book Now
          </button>
          <button className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center"
            style={{ border:"1px solid rgba(26,110,245,0.15)" }} onClick={()=>setMobileOpen(v=>!v)}>
            {mobileOpen ? <X size={15} style={{color:"#5a78a8"}}/> : <Menu size={15} style={{color:"#5a78a8"}}/>}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden px-4 pb-4 flex flex-col gap-1 bg-white border-t" style={{borderColor:"rgba(26,110,245,0.08)"}}>
          {navLinks.map(link => (
            <button key={link} onClick={()=>{setPage(link);setMobileOpen(false);}}
              className="text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ color:page===link?BLUE:"#5a78a8", background:page===link?"#eef4ff":"transparent" }}>
              {link}
            </button>
          ))}
        </div>
      )}

      {notifOpen && (
        <div className="absolute top-16 right-4 w-80 rounded-2xl overflow-hidden shadow-2xl z-50 bg-white" style={{border:"1px solid rgba(26,110,245,0.12)"}}>
          <div className="px-4 py-3 flex items-center justify-between" style={{borderBottom:"1px solid rgba(26,110,245,0.08)"}}>
            <span className="font-bold text-sm" style={{color:BLUE}}>Notifications</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{background:"#fff0ea",color:ORANGE}}>4 new</span>
          </div>
          {[{icon:"☁️",text:"Friday 2:00 PM Update: Cloudy weather with 465 crowd inside the park.",time:"Friday 2:00 PM"},
            {icon:"🎢",text:"Your Queue #12 for Thunder Loop is almost ready!",time:"2m ago"},
            {icon:"🎉",text:"Neon Nights Festival starts in 2 hours!",time:"1h ago"},
            {icon:"🌊",text:"Splash River wait dropped to 18 min.",time:"3h ago"}
          ].map((n,i)=>(
            <div key={i} className="px-4 py-3 flex gap-3 cursor-pointer hover:bg-[#f8faff] transition-colors" style={{borderBottom:"1px solid rgba(26,110,245,0.05)"}}>
              <span className="text-xl">{n.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs leading-relaxed" style={{color:"#1a3a6e"}}>{n.text}</p>
                <p className="text-xs mt-0.5" style={{color:"#5a78a8"}}>{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}

// ─── Status Bar ───────────────────────────────────────────────────────────────
function StatusBar() {
  return (
    <div className="sticky top-16 z-40" style={{background:"rgba(255,255,255,0.97)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(26,110,245,0.1)",boxShadow:"0 2px 12px rgba(26,110,245,0.06)"}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center gap-4 sm:gap-8 text-sm">
        <div className="flex items-center gap-2"><CloudSun size={15} style={{color:AMBER}}/><span className="font-bold text-[#0d1f3c]">32°C</span><span style={{color:"#5a78a8"}}>Partly Cloudy</span></div>
        <div className="flex items-center gap-1.5"><Wind size={12} style={{color:"#5a78a8"}}/><span style={{color:"#5a78a8"}}>14 km/h</span></div>
        <div className="flex items-center gap-1.5"><Droplets size={12} style={{color:CYAN}}/><span style={{color:"#5a78a8"}}>68%</span></div>
        <div className="hidden sm:block h-4 w-px bg-[#dbeafe]"/>
        <div className="flex items-center gap-2">
          <Users size={14} style={{color:BLUE}}/>
          <span className="font-bold text-[#0d1f3c]">Moderate</span>
          <div className="flex gap-0.5">{[1,2,3,4,5].map(i=><div key={i} className="w-1.5 h-3 rounded-sm" style={{background:i<=3?BLUE:"#dbeafe"}}/>)}</div>
        </div>
        <div className="hidden sm:block h-4 w-px bg-[#dbeafe]"/>
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse"/><span className="font-bold" style={{color:"#16a34a"}}>Park Open</span><span style={{color:"#5a78a8"}}>· Closes 10 PM</span></div>
        <div className="ml-auto hidden md:flex items-center gap-1.5"><TrendingUp size={12} style={{color:ORANGE}}/><span className="text-xs" style={{color:"#5a78a8"}}>4,821 visitors today</span></div>
      </div>
    </div>
  );
}

// ─── Mobile Bottom Nav ────────────────────────────────────────────────────────
function BottomNav({ page, setPage }: { page:string; setPage:(p:string)=>void }) {
  const tabs = [
    {icon:Home,    label:"Home"},
    {icon:Compass, label:"Explore"},
    {icon:Zap,     label:"Virtual Queue", primary:true},
    {icon:Award,   label:"Rewards"},
    {icon:User,    label:"Profile"},
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:hidden flex z-50 bg-white" style={{borderTop:"1px solid rgba(26,110,245,0.1)",boxShadow:"0 -4px 20px rgba(26,110,245,0.08)"}}>
      {tabs.map(({icon:Icon,label,primary})=>(
        <button key={label} onClick={()=>setPage(label)} className="flex-1 flex flex-col items-center gap-0.5 py-3">
          {primary ? (
            <div className="w-11 h-11 rounded-full -mt-5 flex items-center justify-center shadow-lg" style={{background:`linear-gradient(135deg,${BLUE},${BLUE2})`,boxShadow:`0 4px 16px ${BLUE}55`}}>
              <Icon size={20} className="text-white"/>
            </div>
          ) : (
            <Icon size={20} style={{color:page===label?BLUE:"#b8cce8"}}/>
          )}
          <span className="text-[10px] font-semibold" style={{color:(primary||page===label)?BLUE:"#b8cce8"}}>{label}</span>
        </button>
      ))}
    </nav>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, accent, sub }: { title:string; accent:string; sub?:string }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-black" style={{fontFamily:"'Exo 2',sans-serif",color:"#0d1f3c"}}>
        {title.split(" ").map((w,i)=> i===title.split(" ").length-1
          ? <span key={i} style={{color:accent}}>{w} </span>
          : <span key={i}>{w} </span>
        )}
      </h1>
      {sub && <p className="text-sm mt-1" style={{color:"#5a78a8"}}>{sub}</p>}
    </div>
  );
}

// ─── Restaurant Data ─────────────────────────────────────────────────────────
const RESTAURANTS = [
  {
    id:1, name:"Spice Arena",   cuisine:"Indian",          tagline:"Authentic Desi Flavours",
    location:"ThrillVerse Castle", wait:"12 min", rating:4.6, reviews:342,
    hours:"10:00 AM – 9:30 PM", priceRange:"₹150 – ₹400",
    img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop&auto=format",
    desc:"Authentic Indian street food, thalis and refreshing drinks. Located at ThrillVerse Castle.",
    popular:[
      {name:"Masala Thali",   price:"₹249", tag:"Best Seller"},
      {name:"Paneer Tikka",   price:"₹179", tag:"🌶️ Spicy"  },
      {name:"Mango Lassi",    price:"₹89",  tag:"Refreshing" },
      {name:"Veg Burger",     price:"₹129", tag:"Quick Bite" },
    ],
    emoji:"🍛", color:ORANGE, bg:"#fff7f0",
  },
  {
    id:2, name:"Burger Bay",    cuisine:"Fast Food",        tagline:"Quick & Tasty Bites",
    location:"Family Zone", wait:"5 min", rating:4.5, reviews:521,
    hours:"9:00 AM – 10:00 PM", priceRange:"₹80 – ₹350",
    img:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop&auto=format",
    desc:"Park's fastest quick-service spot. Juicy burgers, crispy fries and cold shakes — located in the Family Zone.",
    popular:[
      {name:"Classic Smash Burger", price:"₹199", tag:"Fan Favourite"},
      {name:"Cheese Fries",         price:"₹129", tag:"Must Try"     },
      {name:"Chocolate Shake",      price:"₹149", tag:"Bestseller"   },
      {name:"Chicken Wrap",         price:"₹179", tag:"New! 🆕"      },
    ],
    emoji:"🍔", color:AMBER, bg:"#fffbeb",
  },
  {
    id:3, name:"Pizza Palace",  cuisine:"Italian",          tagline:"Wood-Fired Perfection",
    location:"Water Zone", wait:"15 min", rating:4.7, reviews:289,
    hours:"11:00 AM – 9:00 PM", priceRange:"₹200 – ₹600",
    img:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop&auto=format",
    desc:"Wood-fired pizzas and fresh pastas in a cozy Italian-themed setting located in the Water Zone.",
    popular:[
      {name:"Margherita Pizza",   price:"₹299", tag:"Classic"      },
      {name:"Pepperoni Blast",    price:"₹379", tag:"🔥 Hot Pick"  },
      {name:"Pasta Arrabbiata",   price:"₹249", tag:"Veg Friendly" },
      {name:"Garlic Bread",       price:"₹99",  tag:"Best Starter" },
    ],
    emoji:"🍕", color:RED, bg:"#fff5f5",
  },
  {
    id:4, name:"Splash Café",   cuisine:"Café & Beverages", tagline:"Cool Drinks & Snacks",
    location:"Kids Zone", wait:"3 min", rating:4.4, reviews:198,
    hours:"9:00 AM – 10:00 PM", priceRange:"₹50 – ₹250",
    img:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop&auto=format",
    desc:"Refreshing cold drinks, ice creams and light snacks located in the Kids Zone.",
    popular:[
      {name:"Fresh Lemonade",   price:"₹79",  tag:"Park Favourite"},
      {name:"Ice Cream Sundae", price:"₹129", tag:"Kids Love It"  },
      {name:"Cold Coffee",      price:"₹99",  tag:"Bestseller"    },
      {name:"Nachos & Dip",     price:"₹149", tag:"Snack Attack"  },
    ],
    emoji:"☕", color:CYAN, bg:"#f0fbfe",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════════════════════════════════════
function HomePage({ setPage }: { setPage:(p:string)=>void }) {
  const aiEndRef = useRef<HTMLDivElement>(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMsg, setAiMsg] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiChat, setAiChat] = useState<{ role: string; text: string }[]>([
    { role: "bot", text: "Hi! I'm ThrillBot 🎢 Powered by Gemini AI. Ask me about wait times, ride picks, food, or the fastest park route!" },
  ]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<typeof RESTAURANTS[0]|null>(null);

  useEffect(() => {
    if (aiOpen && aiEndRef.current) aiEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [aiChat, aiOpen, aiLoading]);

  const callGeminiForThrillBot = async (userMsg: string, chatHistory: { role: string; text: string }[]): Promise<string> => {
    const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || "AIzaSyDTUw0ApJ1ZS02GAwpiSExjPY7hotQsYBA";
    const systemPrompt = `You are ThrillBot 🎢, the friendly, helpful, and intelligent AI concierge for ThrillVerse Amusement Park.

CRITICAL THRILLVERSE RIDES KNOWLEDGE (ALL 16 RIDES ARE REAL, ACTIVE & ICONIC):
- Thriller Zone (Zone A):
  1. Nitro (Flagship hyper-coaster, extreme thrill, 45 min wait, 130cm min height)
  2. Scream Machine (360° pendulum ride, extreme thrill, 35 min wait, 135cm min height)
  3. SpaceX (High-speed indoor dark coaster, 28 min wait, 125cm min height)
  4. Dare 2 Drop (148ft drop tower, 40 min wait, 120cm min height)
- Water Zone (Zone B):
  5. Dino Splashdown (Mega water coaster with massive splash, 28 min wait, 110cm min height)
  6. Splash Ahoy! (Pirate water splash ride, 22 min wait, 100cm min height)
- Family Zone (Zone C):
  7. Gold Rush Express (Mine train family coaster, 15 min wait, 90cm min height)
  8. Alibaba Aur Chalis Chorr (Iconic Arabian Nights dark ride & laser shooting, 25 min wait - ONE OF THE BEST & MOST POPULAR FAMILY RIDES IN THRILLVERSE!)
  9. Bhangarh: The Curse (Immersive haunted dark ride, 12 min wait)
  10. Chai Spin Chaos (Spinning giant teacups ride, 10 min wait)
  11. Wrath of the Gods (Spectacular live-action & special fx dark show/ride, 30 min wait)
  12. Magic Carousel (Classic grand carousel, 5 min wait)
- Kids Zone (Zone D):
  13. Chhota Bheem – The Ride (Flagship Dholakpur adventure coaster/ride, 10 min wait - EXTREMELY POPULAR & ONE OF THE BEST KIDS/FAMILY RIDES IN THRILLVERSE!)
  14. Elephant Ride (Flying elephant ride, 5 min wait)
  15. Mini Fall (Junior drop tower, 15 min wait)
  16. Cinema 360 – Prince of the Dark Waters (360° dome theater experience, 10 min wait)

MAP, ROUTE & NAVIGATION INSTRUCTIONS:
- Whenever a user asks for directions, routes, how to go between rides (e.g. "Chhota Bheem ride to Alibaba"), or location maps, YOU MUST ALWAYS SAY:
  "You can use our Virtual Map feature in ThrillVerse to view interactive paths, live walk times, and turn-by-turn navigation!"
- Give accurate distance/route guidance. For instance, to go from Chhota Bheem – The Ride (Kids Zone D) to Alibaba Aur Chalis Chorr (Family Zone C), walk North past the Kids Hub into the Family Promenade (approx 3 min walk).

PARK INFORMATION:
- Hours: 9:00 AM – 10:00 PM daily.
- Tone: Enthusiastic, friendly, park-savvy, concise (2-4 sentences), with fun emojis! NEVER claim a ThrillVerse ride does not exist!`;

    const contents: any[] = [
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "Understood! I'm ThrillBot 🎢, your personal ThrillVerse guide powered by Gemini AI! I know all 16 rides like Chhota Bheem – The Ride and Alibaba Aur Chalis Chorr, and I will always guide guests to use our Virtual Map feature for navigation!" }] }
    ];

    chatHistory.slice(-6).forEach(m => {
      contents.push({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      });
    });

    contents.push({ role: "user", parts: [{ text: userMsg }] });

    const models = ["gemini-3.6-flash", "gemini-3.5-flash", "gemini-2.0-flash"];

    for (const model of models) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents })
        });
        const data = await res.json();
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          return data.candidates[0].content.parts[0].text;
        }
      } catch (e) {
        console.warn(`Gemini model ${model} error:`, e);
      }
    }

    const lower = userMsg.toLowerCase();
    if (lower.includes("map") || lower.includes("route") || lower.includes("direction") || lower.includes("bheem") || lower.includes("alibaba") || lower.includes("where")) {
      return "You can use our Virtual Map feature in ThrillVerse to view interactive 3D paths, live walk times, and turn-by-turn navigation! 🗺️ Chhota Bheem – The Ride (Zone D) and Alibaba Aur Chalis Chorr (Zone C) are two of our absolute best rides. To walk from Chhota Bheem to Alibaba, head North through the Family Zone promenade (approx 3 min walk)!";
    }

    const map: Record<string, string> = {
      wait: "Shortest wait right now: Magic Carousel at 5 min, Chhota Bheem at 10 min! Nitro 45 min, Alibaba 25 min.",
      ride: "Chhota Bheem – The Ride (Kids Zone) and Alibaba Aur Chalis Chorr (Family Zone) are two of ThrillVerse's top flagship rides! Nitro is great for extreme thrill-seekers.",
      food: "Spice Arena near Water Zone: 12-min wait. Burger Bay at the entrance is quickest right now.",
      route: "You can use our Virtual Map feature in ThrillVerse for live route navigation! Recommended route: Nitro → Alibaba → Chhota Bheem.",
    };
    return map[Object.keys(map).find(k => lower.includes(k)) || ""] ||
      "ThrillVerse has 16 amazing rides across 4 zones! You can use our Virtual Map feature for live navigation. Need ride info, wait times, or food tips?";
  };

  const sendAiMsg = async () => {
    if (!aiMsg.trim() || aiLoading) return;
    const msg = aiMsg.trim();
    const historyBefore = [...aiChat];
    setAiChat(c => [...c, { role: "user", text: msg }]);
    setAiMsg("");
    setAiLoading(true);

    try {
      const reply = await callGeminiForThrillBot(msg, historyBefore);
      setAiChat(c => [...c, { role: "bot", text: reply }]);
    } catch {
      setAiChat(c => [...c, { role: "bot", text: "I'm having a brief connection issue. Please try asking me again! 🎢" }]);
    } finally {
      setAiLoading(false);
    }
  };

  const topRides = ALL_RIDES.filter(r=>r.status==="open").sort((a,b)=>b.rating-a.rating).slice(0,6);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-screen min-h-[620px] flex items-center justify-center overflow-hidden">
        <img src={IMG.hero} alt="ThrillVerse swing ride" className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0" style={{background:"linear-gradient(to bottom,rgba(0,40,120,0.55) 0%,rgba(0,60,160,0.3) 40%,rgba(0,30,100,0.75) 80%,#fff 100%)"}}/>
        <div className="absolute inset-0" style={{background:"radial-gradient(ellipse at 50% 40%,rgba(26,110,245,0.15) 0%,transparent 65%)"}}/>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6 text-white" style={{background:"rgba(255,255,255,0.18)",border:"1px solid rgba(255,255,255,0.35)",backdropFilter:"blur(8px)"}}>
            <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse"/>Park Open · 9:00 AM – 10:00 PM
          </div>
          <h1 className="text-5xl sm:text-7xl font-black leading-none mb-5 text-white" style={{fontFamily:"'Exo 2',sans-serif",textShadow:"0 4px 24px rgba(0,40,120,0.5)"}}>
            Feel The <span style={{color:"#7dd3fc"}}>Thrill</span>
          </h1>
          <p className="text-lg sm:text-xl mb-8 max-w-xl mx-auto text-white/85">
            Live the amusement with ThrillVerse — 17 rides, AI-powered queues, and unforgettable experiences.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={()=>setPage("Explore")} className="px-8 py-3.5 rounded-full font-bold text-base text-white transition-all hover:scale-105" style={{background:`linear-gradient(135deg,${BLUE},${BLUE2})`,boxShadow:`0 8px 28px rgba(26,110,245,0.45)`}}>Explore Now</button>
            <button onClick={()=>setPage("Virtual Queue")} className="px-8 py-3.5 rounded-full font-bold text-base text-white transition-all hover:bg-white/20" style={{border:"2px solid rgba(255,255,255,0.5)",backdropFilter:"blur(8px)"}}>Virtual Queue →</button>
          </div>
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {[{label:"Rides",value:"17"},{label:"Avg Wait",value:"22 min"},{label:"Visitors Today",value:"4,821"}].map(s=>(
              <div key={s.label} className="text-center">
                <p className="text-2xl font-black text-white" style={{fontFamily:"'Exo 2',sans-serif"}}>{s.value}</p>
                <p className="text-xs text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"><ChevronDown size={22} style={{color:BLUE}}/></div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-28">
        {/* Quick Actions */}
        <section className="py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {icon:Zap,     label:"Virtual Queue",  sub:"Skip the wait",  color:BLUE,   bg:"#eef4ff", page:"Virtual Queue"},
              {icon:MapPin,  label:"Park Map",        sub:"Navigate live",  color:INDIGO, bg:"#eef2ff", page:"Explore"},
              {icon:Ticket,  label:"My Tickets",      sub:"View & scan",    color:AMBER,  bg:"#fffbeb", page:"Tickets"},
              {icon:Gift,    label:"Rewards",         sub:"240 XP earned",  color:GREEN,  bg:"#f0fdf4", page:"Rewards"},
            ].map(({icon:Icon,label,sub,color,bg,page:p})=>(
              <button key={label} onClick={()=>setPage(p)} className="group flex flex-col items-center gap-2.5 p-5 rounded-2xl transition-all duration-200 hover:scale-105 hover:shadow-lg text-center" style={{background:bg,border:`1.5px solid ${color}18`}}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{background:`${color}18`}}><Icon size={22} style={{color}}/></div>
                <div><p className="font-bold text-sm text-[#0d1f3c]">{label}</p><p className="text-xs mt-0.5" style={{color:"#5a78a8"}}>{sub}</p></div>
              </button>
            ))}
          </div>
        </section>

        {/* Popular Attractions */}
        <section className="py-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-[#0d1f3c]" style={{fontFamily:"'Exo 2',sans-serif"}}>Popular <span style={{color:BLUE}}>Attractions</span></h2>
              <p className="text-xs mt-0.5" style={{color:"#5a78a8"}}>Live wait times · updated every 2 min</p>
            </div>
            <button onClick={()=>setPage("Explore")} className="flex items-center gap-1 text-sm font-bold" style={{color:BLUE}}>View All <ChevronRight size={14}/></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topRides.map(ride=>{
              const cs=catStyle[ride.category]??{bg:"#f0f5ff",text:BLUE};
              return (
                <div key={ride.id} className="group rounded-2xl overflow-hidden bg-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-100" style={{border:"1.5px solid rgba(26,110,245,0.1)"}}>
                  <div className="relative h-44 overflow-hidden bg-blue-50">
                    <img src={ride.img} alt={ride.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                    <div className="absolute inset-0" style={{background:"linear-gradient(to top,rgba(13,31,60,0.55) 0%,transparent 55%)"}}/>
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold" style={{background:cs.bg,color:cs.text}}>{ride.category}</span>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5"><Clock size={12} className="text-white"/><span className="text-sm font-bold text-white">{ride.wait} min</span></div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1.5">
                      <h3 className="font-black text-base text-[#0d1f3c]" style={{fontFamily:"'Exo 2',sans-serif"}}>{ride.name}</h3>
                      <div className="flex items-center gap-1"><Star size={12} fill={AMBER} style={{color:AMBER}}/><span className="text-sm font-bold" style={{color:AMBER}}>{ride.rating}</span></div>
                    </div>
                    <div className="flex items-center gap-2 mb-3"><span className="text-xs" style={{color:"#5a78a8"}}>Thrill</span><ThrillDots level={ride.thrill}/></div>
                    <div className="flex items-center gap-3 text-xs mb-4" style={{color:"#5a78a8"}}>
                      <span className="flex items-center gap-1"><Play size={10}/>{ride.duration}</span>
                      <span className="flex items-center gap-1"><Users size={10}/>{ride.visitors}</span>
                      <span>↑ {ride.height}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={()=>setPage("Virtual Queue")} className="flex-1 py-2 rounded-xl text-xs font-bold text-white transition-all hover:shadow-md" style={{background:`linear-gradient(135deg,${BLUE},${BLUE2})`}}>Join Queue</button>
                      <button onClick={()=>setPage("Explore")} className="px-3 py-2 rounded-xl text-xs font-bold transition-all hover:bg-[#eef4ff]" style={{border:`1.5px solid ${BLUE}22`,color:BLUE}}>Details</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* AI Banner */}
        <section className="py-8">
          <div className="rounded-3xl p-6 sm:p-8 relative overflow-hidden" style={{background:"linear-gradient(135deg,#eef4ff 0%,#f0f5ff 50%,#e8f0fe 100%)",border:"1.5px solid rgba(26,110,245,0.15)"}}>
            <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full" style={{background:"radial-gradient(circle,rgba(26,110,245,0.1) 0%,transparent 70%)"}}/>
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
              <div className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center" style={{background:"white",border:`1.5px solid ${BLUE}22`}}>
                <Sparkles size={26} style={{color:BLUE}}/>
              </div>
              <div>
                <p className="text-xs font-bold mb-1 tracking-widest" style={{color:BLUE}}>AI PARK ASSISTANT</p>
                <h2 className="text-xl font-black text-[#0d1f3c]" style={{fontFamily:"'Exo 2',sans-serif"}}>ThrillBot Recommendations</h2>
                <p className="text-sm mt-1" style={{color:"#5a78a8"}}>Based on current crowd data and your ride history:</p>
              </div>
            </div>
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {icon:Flame,     label:"Lowest Wait Now",  value:"Sky Wheel · 10 min", color:GREEN},
                {icon:Navigation,label:"Optimal Route",    value:"Loop → Splash → Wheel",color:BLUE},
                {icon:ThumbsUp,  label:"Top Pick Today",   value:"Thunder Loop · 4.9★", color:ORANGE},
              ].map(({icon:Icon,label,value,color})=>(
                <div key={label} className="p-4 rounded-2xl bg-white" style={{border:`1.5px solid ${color}18`}}>
                  <div className="flex items-center gap-2 mb-2"><Icon size={13} style={{color}}/><span className="text-xs font-bold" style={{color:"#5a78a8"}}>{label}</span></div>
                  <p className="font-bold text-sm text-[#0d1f3c]">{value}</p>
                </div>
              ))}
            </div>
            <button className="relative z-10 mt-5 flex items-center gap-2 text-sm font-bold transition-all hover:gap-3" style={{color:BLUE}} onClick={()=>setAiOpen(true)}>
              <Bot size={14}/> Chat with ThrillBot <ArrowRight size={14}/>
            </button>
          </div>
        </section>

        {/* ── Visit Our Restaurants ── */}
        <section className="py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] mb-1" style={{color:ORANGE}}>DINE WITH US</p>
              <h2 className="text-3xl font-black text-[#0d1f3c]" style={{fontFamily:"'Exo 2',sans-serif"}}>
                Visit Our <span style={{color:ORANGE}}>Restaurants</span>
              </h2>
              <p className="text-sm mt-1" style={{color:"#5a78a8"}}>4 dining spots · Fresh food · Quick service inside the park</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {RESTAURANTS.map(r=>(
              <div key={r.id} className="group rounded-2xl overflow-hidden bg-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-100 cursor-pointer" style={{border:"1.5px solid rgba(26,110,245,0.1)"}}>
                {/* Image */}
                <div className="relative h-36 overflow-hidden" style={{background:r.bg}}>
                  <img src={r.img} alt={r.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                  <div className="absolute inset-0" style={{background:"linear-gradient(to top,rgba(0,0,0,0.45) 0%,transparent 55%)"}}/>
                  <span className="absolute top-3 left-3 text-xl drop-shadow">{r.emoji}</span>
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{background:"rgba(255,255,255,0.92)",color:r.color}}>{r.cuisine}</span>
                  <div className="absolute bottom-2 left-3 flex items-center gap-1">
                    <Clock size={10} className="text-white"/><span className="text-[11px] font-bold text-white">{r.wait} wait</span>
                  </div>
                </div>
                {/* Body */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-0.5">
                    <h3 className="font-black text-base text-[#0d1f3c]" style={{fontFamily:"'Exo 2',sans-serif"}}>{r.name}</h3>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <Star size={11} fill={AMBER} style={{color:AMBER}}/><span className="text-xs font-bold" style={{color:AMBER}}>{r.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs mb-1 font-medium" style={{color:r.color}}>{r.tagline}</p>
                  <p className="text-[11px] mb-3 flex items-center gap-1" style={{color:"#5a78a8"}}>
                    <MapPin size={9}/>{r.location}
                  </p>
                  {/* Popular item pills */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {r.popular.slice(0,2).map(item=>(
                      <span key={item.name} className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{background:r.bg,color:r.color}}>{item.name}</span>
                    ))}
                  </div>
                  <button
                    onClick={()=>setSelectedRestaurant(r)}
                    className="w-full py-2 rounded-xl text-xs font-bold text-white transition-all hover:shadow-md hover:opacity-90"
                    style={{background:`linear-gradient(135deg,${r.color},${r.color}bb)`}}
                  >
                    View Menu &amp; Info →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Latest Offers & Promotions ── */}
        <section className="py-8">
          <div className="text-center mb-8">
            <p className="text-xs font-bold tracking-[0.2em] mb-2" style={{color:BLUE}}>EXCLUSIVE DEALS</p>
            <h2 className="text-3xl font-black text-[#0d1f3c]" style={{fontFamily:"'Exo 2',sans-serif"}}>
              Latest Offers &amp; <span style={{color:BLUE}}>Promotions</span>
            </h2>
            <p className="text-sm mt-2" style={{color:"#5a78a8"}}>Grab the best deals before they expire</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                img: familyFunImg,
                tag: "🔥 Hot Deal",
                tagBg: "#fff0ea", tagColor: ORANGE,
                badge: "SAVE 30%",
                badgeBg: ORANGE,
                title: "Family Fun Bundle",
                desc: "Save upto 30% on Theme & Water Park Tickets",
                cta: "Explore",
              },
              {
                img: happyTuesdayImg,
                tag: "⏰ Today Only",
                tagBg: "#eef4ff", tagColor: BLUE,
                badge: "MEGA DEAL",
                badgeBg: BLUE,
                title: "Happy Tuesday",
                desc: "Mega Thrills, Mini Bills · Tickets @ ₹999/-*",
                cta: "Explore",
              },
              {
                img: watAWednesdayImg,
                tag: "🌊 Water Special",
                tagBg: "#e0f9ff", tagColor: CYAN,
                badge: "WED ONLY",
                badgeBg: CYAN,
                title: "Wat-A-Wednesday",
                desc: "Soak the Fun this Summer · Tickets @ ₹799/-*",
                cta: "Explore",
              },
              {
                img: byeByeExamsImg,
                tag: "🎓 Student Offer",
                tagBg: "#f0fdf4", tagColor: GREEN,
                badge: "25% OFF",
                badgeBg: GREEN,
                title: "Bye Bye Exams",
                desc: "Exams gone, Life's On! Valid Student ID required",
                cta: "Explore",
              },
              {
                img: adventureSavingsImg,
                tag: "🚗 Drive & Thrill",
                tagBg: "#eef2ff", tagColor: INDIGO,
                badge: "4+1 FREE",
                badgeBg: INDIGO,
                title: "Adventure & Savings",
                desc: "Buy 4 tickets get 1 FREE · All zones access",
                cta: "Explore",
              },
              {
                img: snowParkImg,
                tag: "❄️ Snow Special",
                tagBg: "#e0f9ff", tagColor: CYAN,
                badge: "ADD-ON",
                badgeBg: CYAN,
                title: "Snow Park Ticket",
                desc: "Fun mein chill ho jao! Book as Standalone or Add-on",
                cta: "Explore",
              },
            ].map((offer, i) => (
              <div
                key={i}
                className="group rounded-2xl overflow-hidden bg-white transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-100 cursor-pointer"
                style={{border:"1.5px solid rgba(26,110,245,0.1)",boxShadow:"0 4px 16px rgba(26,110,245,0.06)"}}
              >
                {/* Image with overlay badges */}
                <div className="relative h-44 overflow-hidden bg-blue-50">
                  <img
                    src={offer.img}
                    alt={offer.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Dark gradient bottom */}
                  <div className="absolute inset-0" style={{background:"linear-gradient(to top,rgba(13,31,60,0.45) 0%,transparent 55%)"}}/>
                  {/* Badge top-right */}
                  <span
                    className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-black text-white tracking-wide"
                    style={{background:offer.badgeBg,boxShadow:`0 2px 8px ${offer.badgeBg}66`}}
                  >
                    {offer.badge}
                  </span>
                  {/* Tag top-left */}
                  <span
                    className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold"
                    style={{background:"rgba(255,255,255,0.92)",color:offer.tagColor}}
                  >
                    {offer.tag}
                  </span>
                </div>

                {/* Card body */}
                <div className="p-4">
                  <h3
                    className="font-black text-base text-[#0d1f3c] mb-1"
                    style={{fontFamily:"'Exo 2',sans-serif"}}
                  >
                    {offer.title}
                  </h3>
                  <p className="text-sm mb-4 leading-relaxed" style={{color:"#5a78a8"}}>{offer.desc}</p>
                  <button
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white transition-all hover:gap-3 hover:shadow-md"
                    style={{background:`linear-gradient(135deg,${BLUE},${BLUE2})`}}
                    onClick={()=>{}}
                  >
                    <Zap size={13}/> {offer.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* View all offers CTA */}
          <div className="text-center mt-8">
            <button
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold transition-all hover:shadow-lg hover:shadow-blue-200"
              style={{border:`2px solid ${BLUE}`,color:BLUE}}
            >
              View All Offers <ChevronRight size={15}/>
            </button>
          </div>
        </section>
      </main>

      {/* ── Restaurant Modal ── */}
      {selectedRestaurant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={()=>setSelectedRestaurant(null)}>
          <div className="absolute inset-0" style={{background:"rgba(13,31,60,0.55)",backdropFilter:"blur(10px)"}}/>
          <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl bg-white" style={{maxHeight:"88vh",overflowY:"auto",scrollbarWidth:"none"}} onClick={e=>e.stopPropagation()}>
            {/* Hero */}
            <div className="relative h-52 overflow-hidden">
              <img src={selectedRestaurant.img} alt={selectedRestaurant.name} className="w-full h-full object-cover"/>
              <div className="absolute inset-0" style={{background:"linear-gradient(to top,rgba(0,0,0,0.65) 0%,transparent 50%)"}}/>
              <button onClick={()=>setSelectedRestaurant(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110" style={{background:"rgba(255,255,255,0.92)"}}>
                <X size={15} style={{color:"#0d1f3c"}}/>
              </button>
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="text-3xl drop-shadow">{selectedRestaurant.emoji}</span>
                <div>
                  <h2 className="text-xl font-black text-white" style={{fontFamily:"'Exo 2',sans-serif"}}>{selectedRestaurant.name}</h2>
                  <p className="text-xs text-white/80">{selectedRestaurant.tagline}</p>
                </div>
              </div>
            </div>

            <div className="p-5">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{background:selectedRestaurant.bg,color:selectedRestaurant.color}}>{selectedRestaurant.cuisine}</span>
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold" style={{background:"#fffbeb",color:AMBER}}>
                  <Star size={10} fill={AMBER}/>{selectedRestaurant.rating} · {selectedRestaurant.reviews} reviews
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{background:"#f0fdf4",color:GREEN}}>⏱️ {selectedRestaurant.wait}</span>
              </div>

              <p className="text-sm leading-relaxed mb-5" style={{color:"#5a78a8"}}>{selectedRestaurant.desc}</p>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                {[
                  {label:"📍 Location",  value:selectedRestaurant.location,  bold:false},
                  {label:"🕐 Hours",     value:selectedRestaurant.hours,     bold:false},
                  {label:"⏱️ Wait",      value:selectedRestaurant.wait,      bold:true, color:GREEN},
                  {label:"💰 Price",     value:selectedRestaurant.priceRange,bold:false},
                ].map(({label,value,bold,color})=>(
                  <div key={label} className="p-3 rounded-xl" style={{background:"#f0f5ff"}}>
                    <p className="text-[10px] font-bold text-[#0d1f3c] mb-0.5">{label}</p>
                    <p className="text-xs" style={{color: bold?(color||"#0d1f3c"):"#5a78a8", fontWeight:bold?700:400}}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Popular menu */}
              <h3 className="font-black text-base text-[#0d1f3c] mb-3" style={{fontFamily:"'Exo 2',sans-serif"}}>🍽️ Popular Items</h3>
              <div className="flex flex-col gap-2 mb-5">
                {selectedRestaurant.popular.map(item=>(
                  <div key={item.name} className="flex items-center justify-between p-3 rounded-xl" style={{background:selectedRestaurant.bg,border:`1px solid ${selectedRestaurant.color}20`}}>
                    <div>
                      <p className="text-sm font-bold text-[#0d1f3c]">{item.name}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{background:`${selectedRestaurant.color}20`,color:selectedRestaurant.color}}>{item.tag}</span>
                    </div>
                    <p className="font-black text-base shrink-0" style={{fontFamily:"'Exo 2',sans-serif",color:selectedRestaurant.color}}>{item.price}</p>
                  </div>
                ))}
              </div>

              <button className="w-full py-3 rounded-2xl font-bold text-sm text-white transition-all hover:shadow-lg hover:opacity-90" style={{background:`linear-gradient(135deg,${selectedRestaurant.color},${selectedRestaurant.color}bb)`}}>
                View Full Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Chatbot */}
      {aiOpen && (
        <div className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 w-80 rounded-3xl overflow-hidden shadow-2xl z-50 flex flex-col bg-white" style={{border:"1.5px solid rgba(26,110,245,0.15)",height:"400px"}}>
          <div className="flex items-center gap-3 px-4 py-3" style={{background:"#eef4ff",borderBottom:"1px solid rgba(26,110,245,0.1)"}}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:`linear-gradient(135deg,${BLUE},${BLUE2})`}}><Bot size={15} className="text-white"/></div>
            <div className="flex-1"><p className="text-sm font-bold" style={{color:BLUE}}>ThrillBot</p><p className="text-xs" style={{color:"#5a78a8"}}>AI Assistant · Online</p></div>
            <button onClick={()=>setAiOpen(false)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-blue-100"><X size={13} style={{color:"#5a78a8"}}/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{scrollbarWidth:"none"}}>
            {aiChat.map((m,i)=>(
              <div key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}>
                <div className="max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed" style={{background:m.role==="user"?`linear-gradient(135deg,${BLUE},${BLUE2})`:"#f0f5ff",color:m.role==="user"?"#fff":"#1a3a6e"}}>{m.text}</div>
              </div>
            ))}
            {aiLoading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-2xl text-xs bg-[#f0f5ff] text-[#5a78a8] flex items-center gap-1.5 animate-pulse">
                  <span>ThrillBot is thinking...</span>
                </div>
              </div>
            )}
            <div ref={aiEndRef}/>
          </div>
          <div className="p-3 flex gap-2" style={{borderTop:"1px solid rgba(26,110,245,0.08)"}}>
            <input value={aiMsg} onChange={e=>setAiMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendAiMsg()} disabled={aiLoading} placeholder={aiLoading ? "Gemini is typing..." : "Ask about rides, waits, food..."} className="flex-1 px-3 py-2 rounded-xl text-xs outline-none disabled:opacity-50" style={{background:"#f0f5ff",color:"#0d1f3c",caretColor:BLUE}}/>
            <button onClick={sendAiMsg} disabled={aiLoading} className="w-8 h-8 rounded-xl flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50" style={{background:`linear-gradient(135deg,${BLUE},${BLUE2})`}}><ArrowRight size={14} className="text-white"/></button>
          </div>
        </div>
      )}
      {!aiOpen && (
        <button onClick={()=>setAiOpen(true)} className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-xl z-50 transition-all hover:scale-110" style={{background:`linear-gradient(135deg,${BLUE},${BLUE2})`,boxShadow:`0 6px 24px ${BLUE}55`}}>
          <Bot size={22} className="text-white"/>
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPLORE PAGE
// ═══════════════════════════════════════════════════════════════════════════
function ExplorePage({ setPage }: { setPage:(p:string)=>void }) {
  const [search, setSearch]     = useState("");
  const [catFilter, setCat]     = useState("All");
  const [statusFilter, setStat] = useState("All");
  const [waitFilter, setWait]   = useState("All");
  const [thrillFilter, setThrill] = useState("All");
  const [sortBy, setSort]       = useState("rating");
  const [showFilters, setShowFilters] = useState(false);

  const cats    = ["All","Thriller","Water","Family","Kids"];
  const statuses = ["All","Open","Maintenance"];
  const waits   = ["All","Under 15 min","Under 30 min","Under 45 min","Under 60 min"];
  const thrills = ["All","Low (1-2)","Medium (3)","High (4-5)"];

  const filtered = ALL_RIDES.filter(r=>{
    if(catFilter!=="All" && r.category!==catFilter) return false;
    if(statusFilter==="Open" && r.status!=="open") return false;
    if(statusFilter==="Maintenance" && r.status!=="maintenance") return false;
    if(waitFilter==="Under 15 min" && r.wait>=15) return false;
    if(waitFilter==="Under 30 min" && r.wait>=30) return false;
    if(waitFilter==="Under 45 min" && r.wait>=45) return false;
    if(waitFilter==="Under 60 min" && r.wait>=60) return false;
    if(thrillFilter==="Low (1-2)" && r.thrill>2) return false;
    if(thrillFilter==="Medium (3)" && r.thrill!==3) return false;
    if(thrillFilter==="High (4-5)" && r.thrill<4) return false;
    if(search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a,b)=>{
    if(sortBy==="rating") return b.rating-a.rating;
    if(sortBy==="wait") return a.wait-b.wait;
    if(sortBy==="thrill") return b.thrill-a.thrill;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28">
      <SectionHeader title="Explore Rides" accent={BLUE} sub={`${filtered.length} of ${ALL_RIDES.length} rides shown`}/>

      {/* Search + Filter bar */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white" style={{border:"1.5px solid rgba(26,110,245,0.15)"}}>
          <Search size={15} style={{color:"#5a78a8"}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search rides…" className="flex-1 text-sm outline-none bg-transparent" style={{color:"#0d1f3c"}}/>
          {search && <button onClick={()=>setSearch("")}><X size={13} style={{color:"#5a78a8"}}/></button>}
        </div>
        <button onClick={()=>setShowFilters(v=>!v)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all" style={{background:showFilters?"#eef4ff":"white",border:"1.5px solid rgba(26,110,245,0.15)",color:showFilters?BLUE:"#5a78a8"}}>
          <SlidersHorizontal size={15}/><span className="hidden sm:inline">Filters</span>
        </button>
        <select value={sortBy} onChange={e=>setSort(e.target.value)} className="px-3 py-2.5 rounded-xl text-sm font-bold outline-none" style={{background:"white",border:"1.5px solid rgba(26,110,245,0.15)",color:"#5a78a8"}}>
          <option value="rating">Top Rated</option>
          <option value="wait">Shortest Wait</option>
          <option value="thrill">Most Thrilling</option>
        </select>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {cats.map(c=>(
          <button key={c} onClick={()=>setCat(c)} className="px-4 py-1.5 rounded-full text-sm font-bold transition-all" style={{background:catFilter===c?`linear-gradient(135deg,${BLUE},${BLUE2})`:"white",color:catFilter===c?"white":"#5a78a8",border:`1.5px solid ${catFilter===c?BLUE:"rgba(26,110,245,0.15)"}`}}>
            {c}
          </button>
        ))}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="mb-6 p-5 rounded-2xl bg-white" style={{border:"1.5px solid rgba(26,110,245,0.12)"}}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <p className="text-xs font-bold mb-2 tracking-widest" style={{color:"#5a78a8"}}>STATUS</p>
              <div className="flex flex-col gap-1.5">{statuses.map(s=>(
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <div onClick={()=>setStat(s)} className="w-4 h-4 rounded flex items-center justify-center transition-all" style={{background:statusFilter===s?BLUE:"white",border:`2px solid ${statusFilter===s?BLUE:"#dbeafe"}`}}>
                    {statusFilter===s && <Check size={10} className="text-white"/>}
                  </div>
                  <span className="text-sm" style={{color:"#1a3a6e"}}>{s}</span>
                </label>
              ))}</div>
            </div>
            <div>
              <p className="text-xs font-bold mb-2 tracking-widest" style={{color:"#5a78a8"}}>WAIT TIME</p>
              <div className="flex flex-col gap-1.5">{waits.map(w=>(
                <label key={w} className="flex items-center gap-2 cursor-pointer">
                  <div onClick={()=>setWait(w)} className="w-4 h-4 rounded flex items-center justify-center transition-all" style={{background:waitFilter===w?BLUE:"white",border:`2px solid ${waitFilter===w?BLUE:"#dbeafe"}`}}>
                    {waitFilter===w && <Check size={10} className="text-white"/>}
                  </div>
                  <span className="text-sm" style={{color:"#1a3a6e"}}>{w}</span>
                </label>
              ))}</div>
            </div>
            <div>
              <p className="text-xs font-bold mb-2 tracking-widest" style={{color:"#5a78a8"}}>THRILL LEVEL</p>
              <div className="flex flex-col gap-1.5">{thrills.map(t=>(
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <div onClick={()=>setThrill(t)} className="w-4 h-4 rounded flex items-center justify-center transition-all" style={{background:thrillFilter===t?BLUE:"white",border:`2px solid ${thrillFilter===t?BLUE:"#dbeafe"}`}}>
                    {thrillFilter===t && <Check size={10} className="text-white"/>}
                  </div>
                  <span className="text-sm" style={{color:"#1a3a6e"}}>{t}</span>
                </label>
              ))}</div>
            </div>
          </div>
          <button onClick={()=>{setCat("All");setStat("All");setWait("All");setThrill("All");}} className="mt-4 text-xs font-bold" style={{color:RED}}>Clear All Filters</button>
        </div>
      )}

      {/* Rides grid */}
      {filtered.length===0 ? (
        <div className="text-center py-20"><p className="text-lg font-bold text-[#0d1f3c]">No rides match your filters</p><button onClick={()=>{setCat("All");setStat("All");setWait("All");setThrill("All");setSearch("");}} className="mt-3 text-sm font-bold" style={{color:BLUE}}>Reset filters</button></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(ride=>{
            const cs=catStyle[ride.category]??{bg:"#f0f5ff",text:BLUE};
            return (
              <div key={ride.id} className="group rounded-2xl overflow-hidden bg-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-100" style={{border:"1.5px solid rgba(26,110,245,0.1)"}}>
                <div className="relative h-36 overflow-hidden bg-blue-50">
                  <img src={ride.img} alt={ride.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                  <div className="absolute inset-0" style={{background:"linear-gradient(to top,rgba(13,31,60,0.55) 0%,transparent 55%)"}}/>
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold" style={{background:cs.bg,color:cs.text}}>{ride.category}</span>
                  {ride.status==="maintenance" && <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold" style={{background:"#fffbeb",color:AMBER}}>⚠ Closed</span>}
                  {ride.fastPass && <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold" style={{background:`${BLUE}ee`,color:"white"}}>Fast Pass</span>}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1"><Clock size={11} className="text-white"/><span className="text-xs font-bold text-white">{ride.wait} min</span></div>
                </div>
                <div className="p-3">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-black text-sm text-[#0d1f3c]" style={{fontFamily:"'Exo 2',sans-serif"}}>{ride.name}</h3>
                    <div className="flex items-center gap-0.5"><Star size={10} fill={AMBER} style={{color:AMBER}}/><span className="text-xs font-bold" style={{color:AMBER}}>{ride.rating}</span></div>
                  </div>
                  <div className="flex items-center gap-1.5 mb-2"><span className="text-xs" style={{color:"#5a78a8"}}>Thrill</span><ThrillDots level={ride.thrill}/></div>
                  <div className="flex items-center justify-between text-xs mb-3" style={{color:"#5a78a8"}}>
                    <span>{ride.duration}</span><span>↑ {ride.height}</span><span>{ride.zone}</span>
                  </div>
                  <button onClick={()=>setPage("Virtual Queue")} disabled={ride.status==="maintenance"} className="w-full py-1.5 rounded-xl text-xs font-bold text-white transition-all hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed" style={{background:`linear-gradient(135deg,${BLUE},${BLUE2})`}}>
                    {ride.status==="maintenance"?"Under Maintenance":"Join Queue"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// VIRTUAL QUEUE PAGE
// ═══════════════════════════════════════════════════════════════════════════
function VirtualQueuePage() {
  const [tab, setTab]       = useState<"dashboard"|"join"|"history">("dashboard");
  const [joinStep, setJoinStep] = useState(0);
  const [selectedRide, setSelectedRide] = useState<typeof ALL_RIDES[0]|null>(null);
  const [joined, setJoined] = useState(false);

  const activeQueues = [
    {id:1, name:"Thunder Loop",  position:12, ahead:11, est:"22 min", status:"active", color:BLUE,   progress:75, token:"TL-2024-0012"},
    {id:2, name:"Sky Screamer",  position:34, ahead:33, est:"35 min", status:"active", color:INDIGO, progress:30, token:"SS-2024-0034"},
  ];
  const readyQueues = [
    {id:3, name:"Splash River",  position:8,  ahead:0,  est:"NOW!",   status:"ready",  color:GREEN,  progress:100,token:"SR-2024-0008"},
  ];
  const history = [
    {name:"Sky Wheel",     date:"Jul 6",  time:"11:30 AM", status:"completed", token:"SW-2024-0005"},
    {name:"Thunder Loop",  date:"Jul 5",  time:"3:00 PM",  status:"completed", token:"TL-2024-0009"},
    {name:"Aqua Twister",  date:"Jul 5",  time:"1:00 PM",  status:"cancelled", token:"AT-2024-0003"},
  ];

  const openRides = ALL_RIDES.filter(r=>r.status==="open").slice(0,6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28">
      <SectionHeader title="Virtual Queue" accent={BLUE} sub="AI-powered queue management · zero physical waiting"/>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 rounded-2xl w-fit" style={{background:"#f0f5ff"}}>
        {(["dashboard","join","history"] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)} className="px-5 py-2 rounded-xl text-sm font-bold capitalize transition-all" style={{background:tab===t?"white":undefined,color:tab===t?BLUE:"#5a78a8",boxShadow:tab===t?"0 2px 8px rgba(26,110,245,0.12)":undefined}}>
            {t==="join"?"Join Queue":t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Dashboard ── */}
      {tab==="dashboard" && (
        <div>
          {/* Ready alert */}
          {readyQueues.map(q=>(
            <div key={q.id} className="mb-4 p-4 rounded-2xl flex items-center gap-4 animate-pulse" style={{background:"#f0fdf4",border:`2px solid ${GREEN}40`}}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{background:`${GREEN}20`}}><CheckCircle size={20} style={{color:GREEN}}/></div>
              <div className="flex-1">
                <p className="font-black text-base text-[#0d1f3c]">🟢 {q.name} — Your turn is NOW!</p>
                <p className="text-sm" style={{color:GREEN}}>Token: {q.token} · Head to the boarding gate immediately</p>
              </div>
              <button className="px-4 py-2 rounded-xl text-sm font-bold text-white" style={{background:`linear-gradient(135deg,${GREEN},#059669)`}}>Show QR</button>
            </div>
          ))}

          {/* Active queues */}
          <h3 className="text-lg font-black text-[#0d1f3c] mb-4" style={{fontFamily:"'Exo 2',sans-serif"}}>Active Queues</h3>
          {activeQueues.length===0 ? (
            <div className="text-center py-12 rounded-2xl bg-white" style={{border:"1.5px solid rgba(26,110,245,0.1)"}}>
              <p className="text-4xl mb-3">🎢</p>
              <p className="font-bold text-[#0d1f3c]">No active queues</p>
              <button onClick={()=>setTab("join")} className="mt-3 px-5 py-2 rounded-xl text-sm font-bold text-white" style={{background:`linear-gradient(135deg,${BLUE},${BLUE2})`}}>Join a Queue</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {activeQueues.map(q=>(
                <div key={q.id} className="p-5 rounded-2xl bg-white" style={{border:`1.5px solid ${q.color}22`,boxShadow:`0 4px 20px ${q.color}10`}}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-black text-base text-[#0d1f3c]" style={{fontFamily:"'Exo 2',sans-serif"}}>{q.name}</h4>
                      <p className="text-xs mt-0.5" style={{color:"#5a78a8"}}>Token: {q.token}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold" style={{background:"#eef4ff",color:q.color}}>In Queue</span>
                  </div>
                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1" style={{color:"#5a78a8"}}>
                      <span>Progress</span><span>{q.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full" style={{background:"#f0f5ff"}}>
                      <div className="h-full rounded-full transition-all duration-500" style={{width:`${q.progress}%`,background:`linear-gradient(90deg,${q.color},${q.color}aa)`}}/>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 mb-4">
                    {/* Ring */}
                    <div className="relative w-16 h-16 shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="26" fill="none" stroke="#f0f5ff" strokeWidth="6"/>
                        <circle cx="32" cy="32" r="26" fill="none" stroke={q.color} strokeWidth="6" strokeDasharray={`${163*(q.progress/100)} 163`} strokeLinecap="round"/>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-base font-black" style={{fontFamily:"'Exo 2',sans-serif",color:q.color}}>#{q.position}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-2xl font-black" style={{fontFamily:"'Exo 2',sans-serif",color:q.color}}>{q.est}</p>
                      <p className="text-xs mt-0.5" style={{color:"#5a78a8"}}>{q.ahead} people ahead</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 rounded-xl text-xs font-bold transition-all" style={{background:"#eef4ff",color:q.color,border:`1px solid ${q.color}30`}}>View QR</button>
                    <button className="px-3 py-2 rounded-xl text-xs font-bold" style={{border:"1px solid #e2eaf5",color:"#5a78a8"}}>Cancel</button>
                    <button className="px-3 py-2 rounded-xl text-xs font-bold" style={{background:"#eef4ff",color:BLUE}}><Share2 size={12}/></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AI Wait Prediction */}
          <div className="p-5 rounded-2xl" style={{background:"linear-gradient(135deg,#eef4ff,#f0f5ff)",border:"1.5px solid rgba(26,110,245,0.15)"}}>
            <div className="flex items-center gap-3 mb-3">
              <Cpu size={18} style={{color:BLUE}}/><span className="font-black text-sm text-[#0d1f3c]">AI Wait Prediction</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[{name:"Thunder Loop",now:"22 min",pred:"18 min in 30 min"},{name:"Sky Screamer",now:"35 min",pred:"28 min after 4 PM"},{name:"Aqua Twister",now:"28 min",pred:"45 min at peak (2 PM)"}].map(p=>(
                <div key={p.name} className="p-3 rounded-xl bg-white">
                  <p className="text-xs font-bold text-[#0d1f3c] mb-1">{p.name}</p>
                  <p className="text-lg font-black" style={{fontFamily:"'Exo 2',sans-serif",color:BLUE}}>{p.now}</p>
                  <p className="text-xs mt-0.5" style={{color:"#5a78a8"}}>{p.pred}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Join Queue ── */}
      {tab==="join" && (
        <div>
          {joinStep===0 && !joined && (
            <div>
              <h3 className="text-lg font-black text-[#0d1f3c] mb-4" style={{fontFamily:"'Exo 2',sans-serif"}}>Select a Ride</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {openRides.map(ride=>{
                  const cs=catStyle[ride.category]??{bg:"#f0f5ff",text:BLUE};
                  return (
                    <button key={ride.id} onClick={()=>{setSelectedRide(ride);setJoinStep(1);}} className="group text-left rounded-2xl overflow-hidden bg-white transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-100" style={{border:`2px solid ${selectedRide?.id===ride.id?BLUE:"rgba(26,110,245,0.1)"}`}}>
                      <div className="relative h-32 overflow-hidden bg-blue-50">
                        <img src={ride.img} alt={ride.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                        <div className="absolute inset-0" style={{background:"linear-gradient(to top,rgba(13,31,60,0.55),transparent 55%)"}}/>
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold" style={{background:cs.bg,color:cs.text}}>{ride.category}</span>
                        <div className="absolute bottom-2 left-2 flex items-center gap-1"><Clock size={11} className="text-white"/><span className="text-xs font-bold text-white">{ride.wait} min wait</span></div>
                      </div>
                      <div className="p-3">
                        <p className="font-black text-sm text-[#0d1f3c]" style={{fontFamily:"'Exo 2',sans-serif"}}>{ride.name}</p>
                        <div className="flex items-center gap-2 mt-1"><ThrillDots level={ride.thrill}/><span className="text-xs" style={{color:"#5a78a8"}}>{ride.zone}</span></div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {joinStep===1 && selectedRide && !joined && (
            <div className="max-w-md mx-auto">
              <button onClick={()=>setJoinStep(0)} className="flex items-center gap-1 text-sm font-bold mb-6" style={{color:BLUE}}><ChevronLeft size={14}/> Back</button>
              <div className="p-6 rounded-2xl bg-white mb-4" style={{border:"1.5px solid rgba(26,110,245,0.12)"}}>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden"><img src={selectedRide.img} alt={selectedRide.name} className="w-full h-full object-cover"/></div>
                  <div>
                    <h3 className="font-black text-lg text-[#0d1f3c]" style={{fontFamily:"'Exo 2',sans-serif"}}>{selectedRide.name}</h3>
                    <p className="text-sm" style={{color:"#5a78a8"}}>{selectedRide.category} · {selectedRide.zone}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    {label:"Est. Wait",   value:`${selectedRide.wait} min`, color:BLUE},
                    {label:"People Ahead",value:"~42",                      color:INDIGO},
                    {label:"Duration",    value:selectedRide.duration,       color:GREEN},
                    {label:"Height",      value:selectedRide.height,         color:ORANGE},
                  ].map(({label,value,color})=>(
                    <div key={label} className="p-3 rounded-xl" style={{background:"#f0f5ff"}}>
                      <p className="text-xs mb-0.5" style={{color:"#5a78a8"}}>{label}</p>
                      <p className="font-black text-base" style={{fontFamily:"'Exo 2',sans-serif",color}}>{value}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-xl mb-5 flex items-center gap-2" style={{background:"#fffbeb",border:"1px solid rgba(245,158,11,0.3)"}}>
                  <Info size={14} style={{color:AMBER}}/><p className="text-xs" style={{color:"#92400e"}}>You'll receive a notification when it's your turn. Stay within the park.</p>
                </div>
                <button onClick={()=>setJoined(true)} className="w-full py-3.5 rounded-2xl font-bold text-white text-base transition-all hover:shadow-lg" style={{background:`linear-gradient(135deg,${BLUE},${BLUE2})`}}>
                  Confirm & Join Queue
                </button>
              </div>
            </div>
          )}

          {joined && (
            <div className="max-w-sm mx-auto text-center py-8">
              <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-5" style={{background:"#f0fdf4",border:`3px solid ${GREEN}`}}>
                <CheckCircle size={36} style={{color:GREEN}}/>
              </div>
              <h3 className="text-2xl font-black text-[#0d1f3c] mb-2" style={{fontFamily:"'Exo 2',sans-serif"}}>You're In! 🎉</h3>
              <p className="text-sm mb-1" style={{color:"#5a78a8"}}>Queue Token</p>
              <p className="text-2xl font-black mb-4" style={{fontFamily:"'Exo 2',sans-serif",color:BLUE}}>TL-2024-0043</p>
              {/* Mock QR */}
              <div className="w-36 h-36 mx-auto rounded-2xl flex items-center justify-center mb-4" style={{background:"#eef4ff",border:`2px solid ${BLUE}22`}}>
                <QrCode size={80} style={{color:BLUE}}/>
              </div>
              <p className="text-sm mb-4" style={{color:"#5a78a8"}}>Show this QR at the boarding gate when called</p>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="p-3 rounded-xl" style={{background:"#eef4ff"}}>
                  <p className="text-xs mb-0.5" style={{color:"#5a78a8"}}>Position</p>
                  <p className="font-black text-xl" style={{fontFamily:"'Exo 2',sans-serif",color:BLUE}}>#43</p>
                </div>
                <div className="p-3 rounded-xl" style={{background:"#eef4ff"}}>
                  <p className="text-xs mb-0.5" style={{color:"#5a78a8"}}>Est. Wait</p>
                  <p className="font-black text-xl" style={{fontFamily:"'Exo 2',sans-serif",color:BLUE}}>22 min</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 py-2.5 rounded-xl text-sm font-bold" style={{background:"#eef4ff",color:BLUE}}><Download size={13} className="inline mr-1"/>Save QR</button>
                <button onClick={()=>{setJoined(false);setJoinStep(0);setSelectedRide(null);setTab("dashboard");}} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white" style={{background:`linear-gradient(135deg,${BLUE},${BLUE2})`}}>Track Queue</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── History ── */}
      {tab==="history" && (
        <div>
          <h3 className="text-lg font-black text-[#0d1f3c] mb-4" style={{fontFamily:"'Exo 2',sans-serif"}}>Queue History</h3>
          <div className="flex flex-col gap-3">
            {history.map((h,i)=>(
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white" style={{border:"1.5px solid rgba(26,110,245,0.1)"}}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{background:h.status==="completed"?"#f0fdf4":"#fff0ea"}}>
                  {h.status==="completed" ? <CheckCircle size={18} style={{color:GREEN}}/> : <X size={18} style={{color:ORANGE}}/>}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-[#0d1f3c]">{h.name}</p>
                  <p className="text-xs mt-0.5" style={{color:"#5a78a8"}}>{h.date} · {h.time} · Token: {h.token}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold capitalize" style={{background:h.status==="completed"?"#f0fdf4":"#fff0ea",color:h.status==="completed"?GREEN:ORANGE}}>{h.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TICKETS PAGE
// ═══════════════════════════════════════════════════════════════════════════
function TicketsPage() {
  const [tab, setTab] = useState<"current"|"history"|"fastpass">("current");

  const tickets = [
    {id:"TV-2024-004821", type:"Full Day Pass", name:"Rohan Sharma", date:"Jul 6, 2024", zones:"All Zones", rides:"Unlimited", color:BLUE, gradient:`linear-gradient(135deg,${BLUE},${BLUE2})`},
  ];
  const history = [
    {id:"TV-2024-003201", type:"Half Day Pass",  date:"Jun 28, 2024", status:"used",    amount:"₹699" },
    {id:"TV-2024-002890", type:"Family Package",  date:"Jun 15, 2024", status:"used",    amount:"₹2,499"},
    {id:"TV-2024-001102", type:"Full Day Pass",   date:"May 30, 2024", status:"expired", amount:"₹999" },
  ];
  const fastPasses = [
    {ride:"Thunder Loop", time:"2:00 PM – 2:30 PM", status:"active",  color:BLUE},
    {ride:"Sky Screamer", time:"4:30 PM – 5:00 PM", status:"active",  color:INDIGO},
    {ride:"Tsunami Falls",time:"6:00 PM – 6:30 PM", status:"used",    color:GREEN},
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28">
      <SectionHeader title="My Tickets" accent={AMBER} sub="View, scan and manage your park tickets"/>

      <div className="flex gap-2 mb-6 p-1 rounded-2xl w-fit" style={{background:"#f0f5ff"}}>
        {(["current","history","fastpass"] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)} className="px-5 py-2 rounded-xl text-sm font-bold capitalize transition-all" style={{background:tab===t?"white":undefined,color:tab===t?BLUE:"#5a78a8",boxShadow:tab===t?"0 2px 8px rgba(26,110,245,0.12)":undefined}}>
            {t==="fastpass"?"Fast Pass":t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {tab==="current" && (
        <div className="max-w-sm mx-auto">
          {tickets.map(t=>(
            <div key={t.id} className="rounded-3xl overflow-hidden shadow-xl mb-6">
              {/* Card top */}
              <div className="p-6" style={{background:t.gradient}}>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-black text-white" style={{fontFamily:"'Exo 2',sans-serif"}}>Thrillverse</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold" style={{background:"rgba(255,255,255,0.25)",color:"white"}}>{t.type}</span>
                </div>
                <div className="text-white mb-4">
                  <p className="text-xs opacity-70 mb-0.5">Ticket Holder</p>
                  <p className="font-bold text-lg">{t.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-white">
                  <div><p className="text-xs opacity-70 mb-0.5">Valid Date</p><p className="font-bold">{t.date}</p></div>
                  <div><p className="text-xs opacity-70 mb-0.5">Zones</p><p className="font-bold">{t.zones}</p></div>
                  <div><p className="text-xs opacity-70 mb-0.5">Rides</p><p className="font-bold">{t.rides}</p></div>
                  <div><p className="text-xs opacity-70 mb-0.5">Ticket ID</p><p className="font-bold text-xs">{t.id}</p></div>
                </div>
              </div>
              {/* Dashed separator */}
              <div className="bg-white px-6 py-2 flex items-center gap-3">
                <div className="flex-1 border-t-2 border-dashed" style={{borderColor:"rgba(26,110,245,0.2)"}}/>
                <div className="w-5 h-5 rounded-full" style={{background:"#f0f5ff"}}/>
                <div className="flex-1 border-t-2 border-dashed" style={{borderColor:"rgba(26,110,245,0.2)"}}/>
              </div>
              {/* QR section */}
              <div className="bg-white p-6 flex flex-col items-center">
                <div className="w-36 h-36 rounded-2xl flex items-center justify-center mb-4" style={{background:"#f0f5ff",border:`2px solid ${BLUE}18`}}>
                  <QrCode size={80} style={{color:BLUE}}/>
                </div>
                <p className="text-xs font-bold mb-4" style={{color:"#5a78a8"}}>Scan at entrance for entry</p>
                <div className="flex gap-3 w-full">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold" style={{background:"#eef4ff",color:BLUE}}><Download size={13}/>Save</button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold" style={{background:"#eef4ff",color:BLUE}}><Share2 size={13}/>Share</button>
                </div>
              </div>
            </div>
          ))}

          {/* Upgrade */}
          <div className="p-5 rounded-2xl" style={{background:"linear-gradient(135deg,#fffbeb,#fef3c7)",border:`1.5px solid ${AMBER}30`}}>
            <p className="font-black text-base text-[#0d1f3c] mb-1" style={{fontFamily:"'Exo 2',sans-serif"}}>Upgrade to Premium</p>
            <p className="text-sm mb-4" style={{color:"#92400e"}}>Add Fast Passes, priority boarding, and exclusive lounge access</p>
            <button className="w-full py-2.5 rounded-xl font-bold text-sm" style={{background:`linear-gradient(135deg,${AMBER},#d97706)`,color:"white"}}>Upgrade Now — ₹499</button>
          </div>
        </div>
      )}

      {tab==="history" && (
        <div className="flex flex-col gap-3">
          {history.map(h=>(
            <div key={h.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white" style={{border:"1.5px solid rgba(26,110,245,0.1)"}}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{background:h.status==="used"?"#eef4ff":"#fff0ea"}}>
                <Ticket size={18} style={{color:h.status==="used"?BLUE:ORANGE}}/>
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-[#0d1f3c]">{h.type}</p>
                <p className="text-xs mt-0.5" style={{color:"#5a78a8"}}>{h.date} · {h.id}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-[#0d1f3c]">{h.amount}</p>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold capitalize" style={{background:h.status==="used"?"#eef4ff":"#fff0ea",color:h.status==="used"?BLUE:ORANGE}}>{h.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="fastpass" && (
        <div>
          <div className="p-4 rounded-2xl mb-5 flex items-center gap-3" style={{background:"#eef4ff",border:`1.5px solid ${BLUE}22`}}>
            <Zap size={18} style={{color:BLUE}}/>
            <p className="text-sm font-medium" style={{color:"#1a3a6e"}}>Fast Pass lets you skip the regular queue. 2 Fast Passes remaining today.</p>
          </div>
          <div className="flex flex-col gap-3">
            {fastPasses.map((fp,i)=>(
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white" style={{border:`1.5px solid ${fp.color}22`}}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{background:`${fp.color}15`}}>
                  <Zap size={18} style={{color:fp.color}}/>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-[#0d1f3c]">{fp.ride}</p>
                  <p className="text-xs mt-0.5" style={{color:"#5a78a8"}}>Window: {fp.time}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold capitalize" style={{background:`${fp.color}15`,color:fp.color}}>{fp.status}</span>
              </div>
            ))}
          </div>
          <button className="mt-5 w-full py-3 rounded-2xl font-bold text-sm text-white transition-all hover:shadow-lg" style={{background:`linear-gradient(135deg,${BLUE},${BLUE2})`}}>
            + Buy Fast Pass — ₹199 each
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// REWARDS PAGE
// ═══════════════════════════════════════════════════════════════════════════
function RewardsPage() {
  const [tab, setTab] = useState<"overview"|"achievements"|"leaderboard"|"challenges">("overview");
  const xp = 2450; const maxXp = 3000; const level = 8;

  const coupons = [
    {code:"THRILL20",  desc:"20% off any ticket",     expires:"Jul 15", color:BLUE  },
    {code:"FOOD50",    desc:"₹50 off food order",     expires:"Jul 10", color:GREEN },
    {code:"MERCH15",   desc:"15% off merchandise",    expires:"Jul 20", color:PURPLE},
  ];
  const challenges = [
    {title:"Ride 3 Thriller rides today",  progress:2, total:3, xp:100, icon:"⚡"},
    {title:"Order food from 2 outlets",    progress:1, total:2, xp:50,  icon:"🍔"},
    {title:"Use Virtual Queue 2 times",    progress:2, total:2, xp:80,  icon:"🎟️", done:true},
    {title:"Visit Water Zone",             progress:0, total:1, xp:60,  icon:"🌊"},
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28">
      <SectionHeader title="My Rewards" accent={GREEN} sub="Earn XP, unlock achievements, and claim coupons"/>

      {/* XP Card */}
      <div className="rounded-3xl p-6 mb-6 relative overflow-hidden" style={{background:`linear-gradient(135deg,${BLUE},${BLUE2})`}}>
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full" style={{background:"rgba(255,255,255,0.07)"}}/>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold text-white/70 mb-0.5">Current Level</p>
              <p className="text-4xl font-black text-white" style={{fontFamily:"'Exo 2',sans-serif"}}>Level {level}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-white/70 mb-0.5">Total XP</p>
              <p className="text-3xl font-black text-white" style={{fontFamily:"'Exo 2',sans-serif"}}>{xp.toLocaleString()}</p>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-white/70 mb-1"><span>Level {level}</span><span>{xp}/{maxXp} XP to Level {level+1}</span></div>
            <div className="h-3 rounded-full" style={{background:"rgba(255,255,255,0.2)"}}>
              <div className="h-full rounded-full" style={{width:`${(xp/maxXp)*100}%`,background:"rgba(255,255,255,0.9)"}}/>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <div className="text-center"><p className="text-xl font-black text-white" style={{fontFamily:"'Exo 2',sans-serif"}}>18</p><p className="text-xs text-white/70">Rides</p></div>
            <div className="text-center"><p className="text-xl font-black text-white" style={{fontFamily:"'Exo 2',sans-serif"}}>5</p><p className="text-xs text-white/70">Achievements</p></div>
            <div className="text-center"><p className="text-xl font-black text-white" style={{fontFamily:"'Exo 2',sans-serif"}}>#4</p><p className="text-xs text-white/70">Rank</p></div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6 p-1 rounded-2xl w-fit" style={{background:"#f0f5ff"}}>
        {(["overview","achievements","leaderboard","challenges"] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)} className="px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all" style={{background:tab===t?"white":undefined,color:tab===t?BLUE:"#5a78a8",boxShadow:tab===t?"0 2px 8px rgba(26,110,245,0.12)":undefined}}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {tab==="overview" && (
        <div>
          <h3 className="font-black text-lg text-[#0d1f3c] mb-4" style={{fontFamily:"'Exo 2',sans-serif"}}>Your Coupons</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {coupons.map(c=>(
              <div key={c.code} className="p-5 rounded-2xl bg-white" style={{border:`1.5px solid ${c.color}25`}}>
                <p className="text-xs font-bold mb-1" style={{color:"#5a78a8"}}>COUPON CODE</p>
                <p className="text-2xl font-black mb-1" style={{fontFamily:"'Exo 2',sans-serif",color:c.color}}>{c.code}</p>
                <p className="text-sm mb-1 text-[#0d1f3c]">{c.desc}</p>
                <p className="text-xs mb-3" style={{color:"#5a78a8"}}>Expires {c.expires}</p>
                <button className="w-full py-2 rounded-xl text-xs font-bold" style={{background:`${c.color}15`,color:c.color}}>Copy & Use</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="achievements" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACHIEVEMENTS.map(a=>(
            <div key={a.id} className="p-5 rounded-2xl bg-white transition-all hover:shadow-md" style={{border:`1.5px solid ${a.done?GREEN:BLUE}18`,opacity:a.done?1:0.7}}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{a.icon}</span>
                {a.done ? <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{background:"#f0fdf4",color:GREEN}}>✓ Earned</span>
                  : <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{background:"#eef4ff",color:BLUE}}>+{a.xp} XP</span>}
              </div>
              <p className="font-black text-sm text-[#0d1f3c] mb-1" style={{fontFamily:"'Exo 2',sans-serif"}}>{a.title}</p>
              <p className="text-xs" style={{color:"#5a78a8"}}>{a.desc}</p>
            </div>
          ))}
        </div>
      )}

      {tab==="leaderboard" && (
        <div>
          <div className="flex flex-col gap-3">
            {LEADERBOARD.map(l=>(
              <div key={l.rank} className="flex items-center gap-4 p-4 rounded-2xl" style={{background:l.isMe?"linear-gradient(135deg,#eef4ff,#f0f5ff)":"white",border:`1.5px solid ${l.isMe?BLUE:"rgba(26,110,245,0.1)"}`,boxShadow:l.isMe?`0 4px 20px ${BLUE}18`:"none"}}>
                <span className="text-2xl w-8 text-center">{l.badge}</span>
                <div className="flex-1">
                  <p className="font-bold text-sm" style={{color:l.isMe?BLUE:"#0d1f3c"}}>{l.name}{l.isMe && " (You)"}</p>
                  <p className="text-xs mt-0.5" style={{color:"#5a78a8"}}>{l.rides} rides · {l.xp.toLocaleString()} XP</p>
                </div>
                <span className="font-black text-lg" style={{fontFamily:"'Exo 2',sans-serif",color:l.isMe?BLUE:"#0d1f3c"}}>#{l.rank}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="challenges" && (
        <div className="flex flex-col gap-4">
          {challenges.map((c,i)=>(
            <div key={i} className="p-4 rounded-2xl bg-white" style={{border:`1.5px solid ${(c as any).done?GREEN:BLUE}18`}}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{c.icon}</span>
                <div className="flex-1">
                  <p className="font-bold text-sm text-[#0d1f3c]">{c.title}</p>
                  <p className="text-xs mt-0.5" style={{color:"#5a78a8"}}>Reward: +{c.xp} XP</p>
                </div>
                {(c as any).done && <CheckCircle size={18} style={{color:GREEN}}/>}
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1" style={{color:"#5a78a8"}}><span>{c.progress}/{c.total} completed</span></div>
                <div className="h-2 rounded-full" style={{background:"#f0f5ff"}}>
                  <div className="h-full rounded-full" style={{width:`${(c.progress/c.total)*100}%`,background:`linear-gradient(90deg,${(c as any).done?GREEN:BLUE},${(c as any).done?"#059669":BLUE2})`}}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FOOD PAGE
// ═══════════════════════════════════════════════════════════════════════════
function FoodPage() {
  const [cart, setCart] = useState<Record<number,number>>({});
  const [catFilter, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  const cats = ["All","Fast Food","Italian","Grill","Beverages","Indian"];
  const filtered = FOODS.filter(f=>(catFilter==="All"||f.cat===catFilter)&&(f.name.toLowerCase().includes(search.toLowerCase())));
  const totalItems = Object.values(cart).reduce((a,b)=>a+b,0);
  const totalPrice = Object.entries(cart).reduce((sum,[id,qty])=>{
    const food = FOODS.find(f=>f.id===Number(id));
    return sum+(food?.price||0)*qty;
  },0);

  const restaurants = [
    {name:"Spice Arena",  zone:"Water Zone", wait:"12 min", type:"Indian", emoji:"🍛"},
    {name:"Burger Bay",   zone:"Entrance",   wait:"5 min",  type:"Fast Food", emoji:"🍔"},
    {name:"Pizza Palace", zone:"Zone A",      wait:"15 min", type:"Italian", emoji:"🍕"},
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28 relative">
      <div className="flex items-start justify-between mb-6">
        <SectionHeader title="Food & Dining" accent={ORANGE} sub="Order from our restaurants and food stalls"/>
        <button onClick={()=>setCartOpen(v=>!v)} className="relative flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white" style={{background:`linear-gradient(135deg,${ORANGE},#ea580c)`}}>
          <ShoppingCart size={15}/>Cart
          {totalItems>0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs font-black flex items-center justify-center" style={{background:RED,color:"white"}}>{totalItems}</span>}
        </button>
      </div>

      {/* Restaurants */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {restaurants.map(r=>(
          <div key={r.name} className="p-4 rounded-2xl bg-white flex items-center gap-3" style={{border:"1.5px solid rgba(249,115,22,0.12)"}}>
            <span className="text-3xl">{r.emoji}</span>
            <div className="flex-1">
              <p className="font-black text-sm text-[#0d1f3c]" style={{fontFamily:"'Exo 2',sans-serif"}}>{r.name}</p>
              <p className="text-xs" style={{color:"#5a78a8"}}>{r.zone} · {r.type}</p>
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-full" style={{background:"#fff0ea",color:ORANGE}}>{r.wait}</span>
          </div>
        ))}
      </div>

      {/* Search & filter */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white" style={{border:"1.5px solid rgba(249,115,22,0.15)"}}>
          <Search size={15} style={{color:"#5a78a8"}}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search food…" className="flex-1 text-sm outline-none bg-transparent" style={{color:"#0d1f3c"}}/>
        </div>
      </div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {cats.map(c=><button key={c} onClick={()=>setCat(c)} className="px-4 py-1.5 rounded-full text-sm font-bold transition-all" style={{background:catFilter===c?`linear-gradient(135deg,${ORANGE},#ea580c)`:"white",color:catFilter===c?"white":"#5a78a8",border:`1.5px solid ${catFilter===c?ORANGE:"rgba(249,115,22,0.15)"}`}}>{c}</button>)}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(food=>(
          <div key={food.id} className="rounded-2xl overflow-hidden bg-white" style={{border:"1.5px solid rgba(249,115,22,0.1)"}}>
            <div className="h-36 overflow-hidden bg-orange-50">
              <img src={food.img} alt={food.name} className="w-full h-full object-cover"/>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h3 className="font-black text-sm text-[#0d1f3c]" style={{fontFamily:"'Exo 2',sans-serif"}}>{food.name}</h3>
                  <p className="text-xs" style={{color:"#5a78a8"}}>{food.cat} · Ready in {food.wait}</p>
                </div>
                {food.popular && <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{background:"#fff0ea",color:ORANGE}}>🔥 Popular</span>}
              </div>
              <div className="flex items-center gap-1 mb-3"><Star size={11} fill={AMBER} style={{color:AMBER}}/><span className="text-xs font-bold" style={{color:AMBER}}>{food.rating}</span></div>
              <div className="flex items-center justify-between">
                <p className="font-black text-lg" style={{fontFamily:"'Exo 2',sans-serif",color:ORANGE}}>₹{food.price}</p>
                <div className="flex items-center gap-2">
                  {cart[food.id] && (
                    <>
                      <button onClick={()=>setCart(c=>({...c,[food.id]:Math.max(0,c[food.id]-1)}))} className="w-7 h-7 rounded-full flex items-center justify-center" style={{background:"#fff0ea",color:ORANGE}}><Minus size={12}/></button>
                      <span className="font-bold text-sm w-4 text-center text-[#0d1f3c]">{cart[food.id]}</span>
                    </>
                  )}
                  <button onClick={()=>setCart(c=>({...c,[food.id]:(c[food.id]||0)+1}))} className="w-7 h-7 rounded-full flex items-center justify-center" style={{background:`linear-gradient(135deg,${ORANGE},#ea580c)`,color:"white"}}><Plus size={12}/></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart drawer */}
      {cartOpen && totalItems>0 && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={()=>setCartOpen(false)}>
          <div className="absolute inset-0 bg-black/20"/>
          <div className="relative w-80 bg-white h-full shadow-2xl flex flex-col" onClick={e=>e.stopPropagation()}>
            <div className="px-5 py-4 flex items-center justify-between" style={{borderBottom:"1px solid rgba(249,115,22,0.12)"}}>
              <span className="font-black text-base text-[#0d1f3c]" style={{fontFamily:"'Exo 2',sans-serif"}}>Your Cart ({totalItems})</span>
              <button onClick={()=>setCartOpen(false)}><X size={18} style={{color:"#5a78a8"}}/></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
              {Object.entries(cart).filter(([,q])=>q>0).map(([id,qty])=>{
                const food=FOODS.find(f=>f.id===Number(id))!;
                return (
                  <div key={id} className="flex items-center gap-3 p-3 rounded-xl" style={{background:"#fff8f5"}}>
                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0"><img src={food.img} alt={food.name} className="w-full h-full object-cover"/></div>
                    <div className="flex-1"><p className="font-bold text-sm text-[#0d1f3c]">{food.name}</p><p className="text-xs" style={{color:ORANGE}}>₹{food.price} each</p></div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={()=>setCart(c=>({...c,[id]:Math.max(0,c[Number(id)]-1)}))} className="w-6 h-6 rounded-full flex items-center justify-center" style={{background:"#fff0ea",color:ORANGE}}><Minus size={10}/></button>
                      <span className="font-bold text-xs w-3 text-center">{qty}</span>
                      <button onClick={()=>setCart(c=>({...c,[id]:c[Number(id)]+1}))} className="w-6 h-6 rounded-full flex items-center justify-center" style={{background:`linear-gradient(135deg,${ORANGE},#ea580c)`,color:"white"}}><Plus size={10}/></button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="px-5 py-4" style={{borderTop:"1px solid rgba(249,115,22,0.12)"}}>
              <div className="flex justify-between text-sm font-bold text-[#0d1f3c] mb-4"><span>Total</span><span>₹{totalPrice}</span></div>
              <button className="w-full py-3 rounded-2xl font-bold text-sm text-white" style={{background:`linear-gradient(135deg,${ORANGE},#ea580c)`}}>Place Order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MERCHANDISE PAGE
// ═══════════════════════════════════════════════════════════════════════════
function MerchandisePage() {
  const [merch, setMerch] = useState(MERCH);
  const [cart, setCart]   = useState<number[]>([]);
  const [catFilter, setCat] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const cats = ["All","Clothing","Souvenirs","Bags","Toys"];
  const filtered = merch.filter(m=>catFilter==="All"||m.cat===catFilter);

  const toggleLike = (id:number) => setMerch(prev=>prev.map(m=>m.id===id?{...m,liked:!m.liked}:m));
  const inCart = (id:number) => cart.includes(id);
  const toggleCart = (id:number) => setCart(prev=>prev.includes(id)?prev.filter(i=>i!==id):[...prev,id]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28">
      <div className="flex items-start justify-between mb-6">
        <SectionHeader title="Merchandise" accent={PURPLE} sub="Take a piece of ThrillVerse home with you"/>
        <button onClick={()=>setCartOpen(v=>!v)} className="relative flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white" style={{background:`linear-gradient(135deg,${PURPLE},#7c3aed)`}}>
          <ShoppingBag size={15}/>Bag
          {cart.length>0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs font-black flex items-center justify-center" style={{background:RED,color:"white"}}>{cart.length}</span>}
        </button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {cats.map(c=><button key={c} onClick={()=>setCat(c)} className="px-4 py-1.5 rounded-full text-sm font-bold transition-all" style={{background:catFilter===c?`linear-gradient(135deg,${PURPLE},#7c3aed)`:"white",color:catFilter===c?"white":"#5a78a8",border:`1.5px solid ${catFilter===c?PURPLE:"rgba(99,102,241,0.15)"}`}}>{c}</button>)}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(m=>(
          <div key={m.id} className="group rounded-2xl overflow-hidden bg-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl" style={{border:"1.5px solid rgba(99,102,241,0.1)"}}>
            <div className="relative h-40 overflow-hidden bg-purple-50">
              <img src={m.img} alt={m.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
              <button onClick={()=>toggleLike(m.id)} className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-md">
                <Heart size={14} fill={m.liked?RED:"none"} style={{color:m.liked?RED:"#5a78a8"}}/>
              </button>
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold" style={{background:"#eef2ff",color:PURPLE}}>{m.cat}</span>
            </div>
            <div className="p-3">
              <h3 className="font-black text-sm text-[#0d1f3c] mb-1" style={{fontFamily:"'Exo 2',sans-serif"}}>{m.name}</h3>
              <div className="flex items-center gap-1 mb-2"><Star size={10} fill={AMBER} style={{color:AMBER}}/><span className="text-xs font-bold" style={{color:AMBER}}>{m.rating}</span></div>
              <div className="flex items-center justify-between">
                <p className="font-black text-base" style={{fontFamily:"'Exo 2',sans-serif",color:PURPLE}}>₹{m.price}</p>
                <button onClick={()=>toggleCart(m.id)} className="px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all" style={{background:inCart(m.id)?`linear-gradient(135deg,${PURPLE},#7c3aed)`:"#eef2ff",color:inCart(m.id)?"white":PURPLE}}>
                  {inCart(m.id)?"✓ Added":"Add"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart drawer */}
      {cartOpen && cart.length>0 && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={()=>setCartOpen(false)}>
          <div className="absolute inset-0 bg-black/20"/>
          <div className="relative w-80 bg-white h-full shadow-2xl flex flex-col" onClick={e=>e.stopPropagation()}>
            <div className="px-5 py-4 flex items-center justify-between" style={{borderBottom:"1px solid rgba(99,102,241,0.12)"}}>
              <span className="font-black text-base text-[#0d1f3c]" style={{fontFamily:"'Exo 2',sans-serif"}}>Shopping Bag ({cart.length})</span>
              <button onClick={()=>setCartOpen(false)}><X size={18} style={{color:"#5a78a8"}}/></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
              {cart.map(id=>{
                const m=merch.find(m=>m.id===id)!;
                return (
                  <div key={id} className="flex items-center gap-3 p-3 rounded-xl" style={{background:"#f5f3ff"}}>
                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0"><img src={m.img} alt={m.name} className="w-full h-full object-cover"/></div>
                    <div className="flex-1"><p className="font-bold text-sm text-[#0d1f3c]">{m.name}</p><p className="text-xs" style={{color:PURPLE}}>₹{m.price}</p></div>
                    <button onClick={()=>toggleCart(id)}><Trash2 size={14} style={{color:"#5a78a8"}}/></button>
                  </div>
                );
              })}
            </div>
            <div className="px-5 py-4" style={{borderTop:"1px solid rgba(99,102,241,0.12)"}}>
              <div className="flex justify-between text-sm font-bold text-[#0d1f3c] mb-4">
                <span>Total</span><span>₹{cart.reduce((sum,id)=>sum+(merch.find(m=>m.id===id)?.price||0),0)}</span>
              </div>
              <button className="w-full py-3 rounded-2xl font-bold text-sm text-white" style={{background:`linear-gradient(135deg,${PURPLE},#7c3aed)`}}>Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PROFILE PAGE
// ═══════════════════════════════════════════════════════════════════════════
function ProfilePage({ setPage }: { setPage:(p:string)=>void }) {
  const [editOpen, setEditOpen] = useState(false);

  const menuItems = [
    {icon:User,         label:"Personal Information",   sub:"Name, DOB, gender",          color:BLUE},
    {icon:Phone,        label:"Emergency Contact",       sub:"Contact for emergencies",     color:RED},
    {icon:CreditCard,   label:"Membership Plan",         sub:"Full Day Pass · Active",      color:AMBER},
    {icon:Globe,        label:"Language",                sub:"English (India)",             color:CYAN},
    {icon:Accessibility,label:"Accessibility",           sub:"Mobility, hearing, vision",   color:GREEN},
    {icon:Bell,         label:"Notifications",           sub:"Push, SMS, email alerts",     color:PURPLE},
    {icon:Lock,         label:"Privacy & Security",      sub:"Password, 2FA settings",      color:INDIGO},
    {icon:LogOut,       label:"Log Out",                 sub:"Sign out of this device",     color:RED},
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-28">
      <SectionHeader title="My Profile" accent={BLUE}/>

      {/* Avatar card */}
      <div className="p-6 rounded-3xl mb-6 text-center relative overflow-hidden" style={{background:`linear-gradient(135deg,${BLUE},${BLUE2})`}}>
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full" style={{background:"rgba(255,255,255,0.06)"}}/>
        <div className="relative z-10">
          <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-4xl" style={{background:"rgba(255,255,255,0.2)"}}>👤</div>
          <h2 className="text-xl font-black text-white mb-0.5" style={{fontFamily:"'Exo 2',sans-serif"}}>Rohan Sharma</h2>
          <p className="text-sm text-white/75 mb-1">rohan.sharma@email.com</p>
          <div className="flex items-center justify-center gap-1 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold" style={{background:"rgba(255,255,255,0.2)",color:"white"}}>Level 8 · Thrill Seeker</span>
          </div>
          <div className="flex justify-center gap-8">
            <div><p className="text-xl font-black text-white" style={{fontFamily:"'Exo 2',sans-serif"}}>18</p><p className="text-xs text-white/70">Rides</p></div>
            <div><p className="text-xl font-black text-white" style={{fontFamily:"'Exo 2',sans-serif"}}>2,450</p><p className="text-xs text-white/70">XP</p></div>
            <div><p className="text-xl font-black text-white" style={{fontFamily:"'Exo 2',sans-serif"}}>#4</p><p className="text-xs text-white/70">Rank</p></div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="flex flex-col gap-2">
        {menuItems.map(({icon:Icon,label,sub,color})=>(
          <button key={label} className="flex items-center gap-4 p-4 rounded-2xl bg-white text-left transition-all hover:shadow-md hover:scale-[1.01]" style={{border:"1.5px solid rgba(26,110,245,0.08)"}}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{background:`${color}15`}}>
              <Icon size={18} style={{color}}/>
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-[#0d1f3c]">{label}</p>
              <p className="text-xs mt-0.5" style={{color:"#5a78a8"}}>{sub}</p>
            </div>
            <ChevronRight size={16} style={{color:"#c7d8f0"}}/>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-2xl text-center" style={{background:"#f0f5ff",border:"1.5px solid rgba(26,110,245,0.1)"}}>
        <p className="text-xs" style={{color:"#5a78a8"}}>ThrillVerse App v2.4.1 · Member since Jan 2024</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ATTRACTIONS DATA — Events First, Characters Secondary
// ═══════════════════════════════════════════════════════════════════════════

const EVENTS = [
  { id:1, name:"Sky Spectacular Parade", category:"Parade",
    time:"10:00 AM", endTime:"10:45 AM", duration:"45 min", zone:"Main Boulevard", status:"upcoming",
    description:"The park's flagship morning parade with all ThrillVerse characters on five spectacular themed floats. A full celebration of adventure, colour and imagination.",
    highlights:["5 Themed Floats","All 4 Characters","Live Band","Confetti Shower"],
    characters:["Spark","Nova","Bolt","Splash"],
    route:["Main Gate","Grand Plaza","Thriller Zone","Water Zone Entry","Central Stage"],
    crowd:"High",
    img:"https://images.unsplash.com/photo-1666272470293-e491e7a289ac?w=700&h=480&fit=crop&auto=format",
  },
  { id:2, name:"Thunder Beats Live Show", category:"Live Show",
    time:"12:30 PM", endTime:"1:30 PM", duration:"60 min", zone:"Central Plaza", status:"live",
    description:"A high-energy live music and dance performance at Central Plaza stage. Features acrobatics, live percussion and an electrifying light show.",
    highlights:["Live Band","Acrobatics","Light Show","Audience Participation"],
    characters:["Bolt"],
    route:["Central Plaza Stage — Fixed Venue"],
    crowd:"Moderate",
    img:"https://images.unsplash.com/photo-1577042816206-2e85c23f2392?w=700&h=480&fit=crop&auto=format",
  },
  { id:3, name:"Fantasy Carnival Parade", category:"Parade",
    time:"4:00 PM", endTime:"4:45 PM", duration:"45 min", zone:"Adventure Street", status:"upcoming",
    description:"The afternoon parade winds through Adventure Street with vibrant floats, stilt walkers, fire performers and interactive moments at every corner.",
    highlights:["Stilt Walkers","Fire Performers","Carnival Floats","Meet Characters"],
    characters:["Spark","Splash"],
    route:["Carnival Gate","Adventure Street","Jungle Path","Fantasy Square"],
    crowd:"High",
    img:"https://images.unsplash.com/photo-1762639112031-26c76246101f?w=700&h=480&fit=crop&auto=format",
  },
  { id:4, name:"Galaxy Lights Night Parade", category:"Night Parade",
    time:"8:00 PM", endTime:"8:30 PM", duration:"30 min", zone:"Castle Avenue", status:"upcoming",
    description:"The day's spectacular finale. Glowing floats, laser beams, thousands of LED lights and a firework finale transform Castle Avenue into a night to remember.",
    highlights:["LED Floats","Laser Show","Fireworks","Glowing Characters"],
    characters:["Nova","Spark"],
    route:["Castle Gate","Galaxy Bridge","Star Plaza","Grand Finale Stage"],
    crowd:"Very High",
    img:"https://images.unsplash.com/photo-1761853321810-f4f9b843eda2?w=700&h=480&fit=crop&auto=format",
  },
];

const THRILLVERSE_CHARS = [
  {
    id:1, name:"Tubbby", role:"The Flying Elephant", color:"#e53e3e", bg:"#fff5f5",
    img:tubbbyImg, imgPos:"center",
    desc:"When Tubbby was little, he dreamt of flying. Even when everyone told him otherwise, he didn't back down. Our flying elephant knows how dearly every kid holds his ambition — so Tubbby is here to give a flight to every kid's dream.",
    personality:"Optimistic, Fearless, Inspiring",
    funFact:"Tubbby is the only elephant in the world who actually achieved his dream of flying!",
    meet:"Kids Zone — Zone D", meetTime:"11:00 AM & 3:30 PM",
    shows:["Morning Parade: 10:00 AM","Kids Show: 2:00 PM","Evening Parade: 6:00 PM"],
  },
  {
    id:2, name:"Detective Bow Wow", role:"Park Detective & Comedian", color:"#c05621", bg:"#fffaf0",
    img:bowWowImg, imgPos:"center",
    desc:"Making sure to keep the smiles intact with his toxic enthusiasm and witty comebacks, Detective Bow Wow is ThrillVerse's very own Mr. Funny Bones. But he's more than just a comedian — no mystery can stay unsolved under his keen watch.",
    personality:"Witty, Enthusiastic, Clever",
    funFact:"Detective Bow Wow has solved over 500 park mysteries — all involving missing ice cream!",
    meet:"Central Plaza", meetTime:"12:00 PM & 4:00 PM",
    shows:["Comedy Hour: 12:30 PM","Mystery Show: 5:00 PM"],
  },
  {
    id:3, name:"Neera & Shera", role:"Mermaid Princess of the Deep", color:"#6b46c1", bg:"#f5f3ff",
    img:neeraImg, imgPos:"center",
    desc:"Brave as a soldier, Neera is the mermaid princess who lives underneath the oceans. She is the most fearless mermaid and doesn't hesitate in taking on new challenges for the ones she loves. She sees through everyone's appearance and recognises their inner goodness.",
    personality:"Brave, Compassionate, Fearless",
    funFact:"Neera can see through anyone's appearance and instantly recognise their inner goodness!",
    meet:"Water Zone — Zone B", meetTime:"10:30 AM & 3:00 PM",
    shows:["Water Show: 11:00 AM","Aqua Performance: 4:30 PM"],
  },
  {
    id:4, name:"Rajasaurus", role:"Friendliest Dino in the Park", color:"#2b6cb0", bg:"#ebf8ff",
    img:rajasaurusImg, imgPos:"center",
    desc:"Most likely to scare you at first sight, Rajasaurus is the friendliest dino at ThrillVerse. He loves playing the host and having people over for tea parties. No matter who he meets, he'll make sure to compliment them and make their day!",
    personality:"Friendly, Hospitable, Cheerful",
    funFact:"Rajasaurus holds the park record for most tea parties hosted in a single day — 8 parties!",
    meet:"Thriller Zone Hub — Zone A", meetTime:"11:30 AM & 5:00 PM",
    shows:["Dino Show: 1:00 PM","Evening Parade: 6:00 PM"],
  },
];

const ENTERTAINMENT_ACTS = [
  {
    id:1, name:"Bhangra Boys", emoji:"🥁",
    desc:"Every move they make will rock you off your feet. Step up with us as the Bhangra Boys compel you to shake a leg. Get Down there!",
    img:"https://images.unsplash.com/photo-1759738102510-ec524f666274?w=500&h=380&fit=crop&auto=format",
    color:"#e53e3e", bg:"#fff5f5",
  },
  {
    id:2, name:"Hip Hop Dancers", emoji:"🎤",
    desc:"These hip hoppers will blow your mind as they work their moves on the grooviest numbers in town. Get your move on already!",
    img:"https://images.unsplash.com/photo-1761882619891-6529ff92df0a?w=500&h=380&fit=crop&auto=format",
    color:"#6b46c1", bg:"#f5f3ff",
  },
  {
    id:3, name:"Acrobats", emoji:"🎪",
    desc:"You could've never imagined a human doing the tricks with their bodies the way these guys pull off. Don't miss the acrobats for an absolute visual treat!",
    img:"https://images.unsplash.com/photo-1738681172508-12b39b19ffd2?w=500&h=380&fit=crop&auto=format",
    color:"#2b6cb0", bg:"#ebf8ff",
  },
  {
    id:4, name:"Magic Show", emoji:"🎩",
    desc:"This isn't ThrillVerse without a little bit of Magic! Experience the most out-of-this-world magic tricks, which you might have seen only in movies yet.",
    img:"https://images.unsplash.com/photo-1571235479512-36bb46e1c587?w=500&h=380&fit=crop&auto=format",
    color:"#2d3748", bg:"#f7fafc",
  },
];

const FESTIVALS = [
  { id:1, name:"Summer Splash Festival",  dates:"Jun 1 – Aug 31",  emoji:"☀️", color:CYAN,
    desc:"All-day water events, splash zones and summer entertainment across Zone B.",
    img:"https://images.unsplash.com/photo-1562874662-050427780b20?w=600&h=380&fit=crop&auto=format" },
  { id:2, name:"Halloween Nights",         dates:"Oct 1 – Oct 31",  emoji:"🎃", color:ORANGE,
    desc:"Spooky shows, haunted zones, costume parades and themed rides after dark.",
    img:"https://images.unsplash.com/photo-1761853321810-f4f9b843eda2?w=600&h=380&fit=crop&auto=format" },
  { id:3, name:"Winter Wonderland",        dates:"Dec 1 – Dec 31",  emoji:"❄️", color:BLUE,
    desc:"Snow effects, holiday shows, festive parades and a magical lights trail through the park.",
    img:"https://images.unsplash.com/photo-1764422474375-97b032a5190d?w=600&h=380&fit=crop&auto=format" },
  { id:4, name:"Festival of Lights",       dates:"Jan 14 – Jan 26", emoji:"✨", color:AMBER,
    desc:"Thousands of illuminated installations, light parades and firework shows across all zones.",
    img:"https://images.unsplash.com/photo-1764515836774-eee30a42de1d?w=600&h=380&fit=crop&auto=format" },
];

const ATTR_GALLERY = [
  { src:"https://images.unsplash.com/photo-1666272470293-e491e7a289ac?w=500&h=380&fit=crop&auto=format", label:"Morning Parade"   },
  { src:"https://images.unsplash.com/photo-1577042816206-2e85c23f2392?w=500&h=380&fit=crop&auto=format", label:"Live Show"        },
  { src:"https://images.unsplash.com/photo-1762639112031-26c76246101f?w=500&h=760&fit=crop&auto=format", label:"Fantasy Carnival" },
  { src:"https://images.unsplash.com/photo-1574504212584-29a03eb6e41e?w=500&h=380&fit=crop&auto=format", label:"Audience"         },
  { src:"https://images.unsplash.com/photo-1761853321810-f4f9b843eda2?w=500&h=380&fit=crop&auto=format", label:"Night Parade"     },
  { src:"https://images.unsplash.com/photo-1631800744240-d95925aacb01?w=500&h=380&fit=crop&auto=format", label:"Park Crowd"       },
  { src:"https://images.unsplash.com/photo-1601930113377-729966035f34?w=500&h=380&fit=crop&auto=format", label:"Swing Ride"       },
  { src:"https://images.unsplash.com/photo-1762639111748-982bda14135e?w=500&h=380&fit=crop&auto=format", label:"Night Rides"      },
  { src:"https://images.unsplash.com/photo-1760281487360-68bf06368e6d?w=500&h=380&fit=crop&auto=format", label:"Water Zone"       },
];

// placeholder so old CHARACTERS references don't break
const CHARACTERS = [
  { id:1, name:"Thunder Wolf",  role:"Thriller Zone Guardian",  color:ORANGE, zone:"Zone A",
    description:"The fearless guardian who leads every thrill-seeker through the most adrenaline-pumping adventures.",
    image:"https://images.unsplash.com/photo-1547675960-7634cf1b0856?w=400&h=400&fit=crop&auto=format" },
  { id:2, name:"Aqua Blue",     role:"Water Zone Duchess",       color:CYAN,   zone:"Zone B",
    description:"The playful spirit who keeps the waves rolling and the splashes flying all day long.",
    image:"https://images.unsplash.com/photo-1760281487360-68bf06368e6d?w=400&h=400&fit=crop&auto=format" },
  { id:3, name:"Forest Fairy",  role:"Family Zone Guide",        color:INDIGO, zone:"Zone C",
    description:"The magical guide who creates unforgettable memories for families with her enchanted touch.",
    image:"https://images.unsplash.com/photo-1534283542176-7cb0c9ac33e0?w=400&h=400&fit=crop&auto=format" },
  { id:4, name:"Mini Roar",     role:"Kids Zone Hero",           color:GREEN,  zone:"Zone D",
    description:"The lovable champion who makes every kid feel like a superhero from the moment they arrive.",
    image:"https://images.unsplash.com/photo-1692301311188-bda319576dd1?w=400&h=400&fit=crop&auto=format" },
  { id:5, name:"Captain Splash",role:"Water Rides Captain",      color:BLUE,   zone:"Zone B",
    description:"The daring captain who ensures every splash is more epic than the last.",
    image:"https://images.unsplash.com/photo-1631800744177-0e434940e0c8?w=400&h=400&fit=crop&auto=format" },
  { id:6, name:"Star Racer",    role:"Speed Zone Champion",      color:AMBER,  zone:"Zone A",
    description:"The speed demon who holds the record for the fastest lap on every coaster in the park.",
    image:"https://images.unsplash.com/photo-1761501638917-f6fb28a84adb?w=400&h=400&fit=crop&auto=format" },
  { id:7, name:"Luna Twist",    role:"Night Show Star",          color:PURPLE, zone:"Main Stage",
    description:"The dazzling performer who lights up the sky every night with spectacular fireworks.",
    image:"https://images.unsplash.com/photo-1504027973709-58986e840e79?w=400&h=400&fit=crop&auto=format" },
  { id:8, name:"Jungle Jack",   role:"Safari Explorer",          color:GREEN,  zone:"Zone C",
    description:"The adventurous explorer who guides families through the wildest jungle safari experience.",
    image:"https://images.unsplash.com/photo-1460176449511-ff5fc8e64c35?w=400&h=400&fit=crop&auto=format" },
];

const GALLERY_IMAGES = [
  { id:1, src:"https://images.unsplash.com/photo-1547675960-7634cf1b0856?w=500&h=380&fit=crop&auto=format", alt:"Thunder Loop" },
  { id:2, src:"https://images.unsplash.com/photo-1601930113377-729966035f34?w=500&h=380&fit=crop&auto=format", alt:"Swing Ride"  },
  { id:3, src:"https://images.unsplash.com/photo-1760281487360-68bf06368e6d?w=500&h=380&fit=crop&auto=format", alt:"Water Ride"  },
  { id:4, src:"https://images.unsplash.com/photo-1692301311188-bda319576dd1?w=500&h=380&fit=crop&auto=format", alt:"Sky Wheel"   },
  { id:5, src:"https://images.unsplash.com/photo-1761501638917-f6fb28a84adb?w=500&h=380&fit=crop&auto=format", alt:"Night Ride"  },
  { id:6, src:"https://images.unsplash.com/photo-1631800744177-0e434940e0c8?w=500&h=380&fit=crop&auto=format", alt:"Splash Ride" },
  { id:7, src:"https://images.unsplash.com/photo-1536302996699-caceffbc68df?w=500&h=380&fit=crop&auto=format", alt:"Coaster"     },
  { id:8, src:"https://images.unsplash.com/photo-1504027973709-58986e840e79?w=500&h=380&fit=crop&auto=format", alt:"Night Show"  },
  { id:9, src:"https://images.unsplash.com/photo-1460176449511-ff5fc8e64c35?w=500&h=380&fit=crop&auto=format", alt:"Carnival"    },
];

const PARADE_DATA = [
  {
    id:1,
    title:"Grand ThrillVerse Parade",
    description:"The flagship parade that kicks off every morning with all ThrillVerse characters, spectacular floats, live music, and a non-stop celebration of thrills. Every float is uniquely designed for each zone — from fire-breathing thriller beasts to dancing water sprites. Arrive early for front-row spots!",
    timings:["10:00 AM","2:00 PM","6:00 PM"],
    duration:"45 minutes",
    location:"Main Boulevard",
    img:"https://images.unsplash.com/photo-1631800744240-d95925aacb01?w=700&h=480&fit=crop&auto=format",
    highlights:["All 8 Characters","5 Spectacular Floats","Live Band","Confetti Shower"],
  },
  {
    id:2,
    title:"Aqua Splash Night Parade",
    description:"An electrifying night parade through the Water Zone featuring glowing floats, water cannons, and the park's beloved water characters lighting up the evening sky. Bring a raincoat — things get wonderfully wet! The perfect end to a thrilling day at ThrillVerse.",
    timings:["7:30 PM","9:00 PM"],
    duration:"30 minutes",
    location:"Water Zone Path",
    img:"https://images.unsplash.com/photo-1764105440301-0869c5cebb9f?w=700&h=480&fit=crop&auto=format",
    highlights:["Glowing Floats","Water Cannons","Laser Show","Night Fireworks"],
  },
];

const FEATURED_CHARS = [
  {
    id:1,
    name:"Thunder Wolf",
    title:"Meet the Guardian of Zone A",
    description:"Thunder Wolf is the fearless guardian who has protected the Thriller Zone since the very first day ThrillVerse opened. With lightning-fast reflexes and an unbreakable spirit, he leads every brave adventurer through the most heart-pounding rides. Meet him at the Zone A entrance every morning for a photo and an autograph!",
    img:"https://images.unsplash.com/photo-1547675960-7634cf1b0856?w=700&h=500&fit=crop&auto=format",
    meet:"Zone A Entrance · 11:00 AM & 3:00 PM",
    color:ORANGE,
    bg:"#fff7f0",
  },
  {
    id:2,
    name:"Luna Twist",
    title:"The Star of Every Night Show",
    description:"Luna Twist transforms ThrillVerse every evening into a world of light, colour and wonder. Her nightly performance at the Main Stage is the most anticipated event — a breathtaking 30-minute show with fireworks, laser beams, and a story that touches every heart. Grab your seats by 7:45 PM!",
    img:"https://images.unsplash.com/photo-1504027973709-58986e840e79?w=700&h=500&fit=crop&auto=format",
    meet:"Main Stage · 8:00 PM Daily",
    color:PURPLE,
    bg:"#f5f3ff",
  },
];

const DAILY_PERFS = [
  { time:"10:00 AM", title:"Morning Grand Parade",      venue:"Main Boulevard", duration:"45 min", emoji:"🎉" },
  { time:"12:30 PM", title:"Character Meet & Greet",    venue:"Central Plaza",  duration:"60 min", emoji:"🤝" },
  { time:"2:00 PM",  title:"Stunt Spectacular Show",    venue:"Arena East",     duration:"25 min", emoji:"🎪" },
  { time:"4:00 PM",  title:"Magic & Illusions",         venue:"Family Stage",   duration:"30 min", emoji:"🎩" },
  { time:"6:00 PM",  title:"Afternoon Grand Parade",    venue:"Main Boulevard", duration:"45 min", emoji:"🎠" },
  { time:"8:00 PM",  title:"Luna's Night Extravaganza", venue:"Main Stage",     duration:"30 min", emoji:"🌟" },
];

// ═══════════════════════════════════════════════════════════════════════════
// CharacterCard — reusable card component
// Props: image, name, role, description, color
// ═══════════════════════════════════════════════════════════════════════════
function CharacterCard({ image, name, role, description, color, zone }:
  { image:string; name:string; role:string; description:string; color:string; zone:string }) {
  return (
    <div
      className="group relative flex-shrink-0 w-60 rounded-2xl overflow-hidden bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
      style={{ border:`1.5px solid ${color}22`, boxShadow:`0 4px 16px ${color}10` }}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden" style={{ background:`${color}10` }}>
        <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
        <div className="absolute inset-0" style={{ background:`linear-gradient(to top, ${color}66 0%, transparent 55%)` }}/>
        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background:color }}>
          {zone}
        </span>
      </div>
      {/* Body */}
      <div className="p-4">
        <h3 className="font-black text-base text-[#0d1f3c] mb-0.5" style={{ fontFamily:"'Exo 2',sans-serif" }}>{name}</h3>
        <p className="text-xs font-bold mb-2" style={{ color }}>{role}</p>
        <p className="text-xs leading-relaxed" style={{ color:"#5a78a8" }}>{description}</p>
        <button className="mt-3 w-full py-1.5 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
          style={{ background:`linear-gradient(135deg,${color},${color}bb)` }}>
          Meet {name.split(" ")[0]}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CharacterSlider — infinite auto-scroll horizontal slider
// useRef for container + interval, useEffect for auto-scroll
// ═══════════════════════════════════════════════════════════════════════════
function CharacterSlider() {
  const sliderRef  = useRef<HTMLDivElement>(null);
  const timerRef   = useRef<ReturnType<typeof setInterval>|null>(null);
  const [paused, setPaused] = useState(false);

  // Duplicate cards for infinite loop effect
  const doubled = [...CHARACTERS, ...CHARACTERS];

  const startScroll = () => {
    timerRef.current = setInterval(() => {
      if (!sliderRef.current) return;
      const el = sliderRef.current;
      el.scrollLeft += 1;
      // Reset to start when reaching halfway (duplicated content)
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = 0;
      }
    }, 20);
  };

  const stopScroll = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (!paused) startScroll();
    else stopScroll();
    return stopScroll;
  }, [paused]);

  const scrollBy = (dir: number) => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: dir * 280, behavior:"smooth" });
  };

  return (
    <div className="relative">
      {/* Left button */}
      <button
        onClick={() => scrollBy(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
        style={{ background:`linear-gradient(135deg,${BLUE},${BLUE2})`, color:"white" }}
      >
        <ChevronLeft size={18}/>
      </button>

      {/* Slider container — overflow-x-auto, scrollbar hidden */}
      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto pb-3"
        style={{ scrollbarWidth:"none", scrollBehavior:"auto" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {doubled.map((char, idx) => (
          <CharacterCard
            key={`${char.id}-${idx}`}
            image={char.image}
            name={char.name}
            role={char.role}
            description={char.description}
            color={char.color}
            zone={char.zone}
          />
        ))}
      </div>

      {/* Right button */}
      <button
        onClick={() => scrollBy(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
        style={{ background:`linear-gradient(135deg,${BLUE},${BLUE2})`, color:"white" }}
      >
        <ChevronRight size={18}/>
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ParadeSection — two-column: image left / info right (alternates per index)
// ═══════════════════════════════════════════════════════════════════════════
function ParadeSection({ parade, index }: { parade:typeof PARADE_DATA[0]; index:number }) {
  const isEven = index % 2 === 0;
  return (
    <div className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 lg:gap-12 items-center`}>
      {/* Image / video thumbnail */}
      <div className="w-full lg:w-1/2 rounded-3xl overflow-hidden shadow-xl" style={{ aspectRatio:"16/9" }}>
        <img src={parade.img} alt={parade.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"/>
      </div>

      {/* Info */}
      <div className="w-full lg:w-1/2">
        <p className="text-xs font-black tracking-widest mb-2" style={{ color:ORANGE }}>🎠 PARADE</p>
        <h2 className="text-3xl font-black text-[#0d1f3c] mb-4" style={{ fontFamily:"'Exo 2',sans-serif" }}>{parade.title}</h2>
        <p className="text-sm leading-relaxed mb-5" style={{ color:"#5a78a8" }}>{parade.description}</p>

        {/* Highlights */}
        <div className="flex flex-wrap gap-2 mb-5">
          {parade.highlights.map(h => (
            <span key={h} className="px-3 py-1 rounded-full text-xs font-bold" style={{ background:"#fff7f0", color:ORANGE }}>✦ {h}</span>
          ))}
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label:"Duration",  value:parade.duration },
            { label:"Location",  value:parade.location },
            { label:"Shows/Day", value:`${parade.timings.length}x Daily` },
          ].map(({ label, value }) => (
            <div key={label} className="p-3 rounded-2xl text-center" style={{ background:"#f0f5ff" }}>
              <p className="text-xs font-black text-[#0d1f3c]">{value}</p>
              <p className="text-[10px] mt-0.5" style={{ color:"#5a78a8" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Timings */}
        <div>
          <p className="text-xs font-bold mb-2" style={{ color:"#5a78a8" }}>SHOW TIMINGS</p>
          <div className="flex flex-wrap gap-2">
            {parade.timings.map(t => (
              <span key={t} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold" style={{ background:`${BLUE}15`, color:BLUE }}>
                <Clock size={12}/> {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FeaturedCharacter — large image one side, info other side (alternates)
// ═══════════════════════════════════════════════════════════════════════════
function FeaturedCharacter({ char, index }: { char:typeof FEATURED_CHARS[0]; index:number }) {
  const isEven = index % 2 === 0;
  return (
    <div className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-10 lg:gap-16 items-center`}>
      {/* Image */}
      <div className="w-full lg:w-5/12 rounded-3xl overflow-hidden shadow-2xl" style={{ aspectRatio:"4/3" }}>
        <img src={char.img} alt={char.name} className="w-full h-full object-cover"/>
      </div>

      {/* Info */}
      <div className="w-full lg:w-7/12">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-black mb-4" style={{ background:char.bg, color:char.color }}>
          ⭐ FEATURED CHARACTER
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#0d1f3c] mb-4 leading-tight" style={{ fontFamily:"'Exo 2',sans-serif" }}>
          {char.title}
        </h2>
        <p className="text-sm leading-relaxed mb-6" style={{ color:"#5a78a8" }}>{char.description}</p>

        {/* Meet info */}
        <div className="flex items-center gap-3 p-4 rounded-2xl mb-6" style={{ background:char.bg, border:`1.5px solid ${char.color}25` }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background:char.color }}>
            <MapPin size={18} className="text-white"/>
          </div>
          <div>
            <p className="text-xs font-bold" style={{ color:char.color }}>MEET & GREET</p>
            <p className="text-sm font-bold text-[#0d1f3c]">{char.meet}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white transition-all hover:shadow-lg hover:opacity-90"
            style={{ background:`linear-gradient(135deg,${char.color},${char.color}bb)` }}>
            <MapPin size={14}/> Find on Map
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all hover:shadow-md"
            style={{ background:char.bg, color:char.color, border:`1.5px solid ${char.color}30` }}>
            <Star size={14}/> Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Gallery — CSS Grid, responsive columns
// ═══════════════════════════════════════════════════════════════════════════
function GallerySection() {
  const [selected, setSelected] = useState<typeof GALLERY_IMAGES[0]|null>(null);
  return (
    <div>
      {/* Grid: 3 cols desktop, 2 tablet, 1 mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GALLERY_IMAGES.map(img => (
          <div
            key={img.id}
            className="group relative rounded-2xl overflow-hidden cursor-pointer"
            style={{ aspectRatio:"4/3", boxShadow:"0 4px 16px rgba(26,110,245,0.08)" }}
            onClick={() => setSelected(img)}
          >
            <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background:"rgba(13,31,60,0.5)" }}>
              <span className="px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ background:"rgba(255,255,255,0.2)", backdropFilter:"blur(8px)" }}>
                View Photo
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
              style={{ background:"linear-gradient(to top,rgba(13,31,60,0.8),transparent)" }}>
              <p className="text-xs font-bold text-white">{img.alt}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="absolute inset-0" style={{ background:"rgba(0,0,0,0.85)", backdropFilter:"blur(10px)" }}/>
          <div className="relative max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <img src={selected.src.replace("w=500&h=380","w=900&h=600")} alt={selected.alt} className="w-full object-cover"/>
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background:"rgba(255,255,255,0.9)" }}>
              <X size={16} style={{ color:"#0d1f3c" }}/>
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-5" style={{ background:"linear-gradient(to top,rgba(0,0,0,0.7),transparent)" }}>
              <p className="font-bold text-white">{selected.alt}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PerformanceSection — daily schedule + CTA
// ═══════════════════════════════════════════════════════════════════════════
function PerformanceSection() {
  return (
    <div className="rounded-3xl overflow-hidden" style={{ background:"linear-gradient(135deg,#eef4ff,#f0f5ff)", border:"1.5px solid rgba(26,110,245,0.15)" }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Left: schedule */}
        <div className="p-8">
          <p className="text-xs font-black tracking-widest mb-2" style={{ color:BLUE }}>TODAY'S SCHEDULE</p>
          <h2 className="text-3xl font-black text-[#0d1f3c] mb-6" style={{ fontFamily:"'Exo 2',sans-serif" }}>
            Daily <span style={{ color:BLUE }}>Performances</span>
          </h2>
          <div className="flex flex-col gap-3">
            {DAILY_PERFS.map((p, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-white transition-all hover:shadow-md"
                style={{ border:"1px solid rgba(26,110,245,0.08)" }}>
                <span className="text-xl w-8 text-center">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-[#0d1f3c] truncate">{p.title}</p>
                  <p className="text-[11px]" style={{ color:"#5a78a8" }}>{p.venue} · {p.duration}</p>
                </div>
                <span className="text-sm font-black shrink-0" style={{ fontFamily:"'Exo 2',sans-serif", color:BLUE }}>{p.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: CTA */}
        <div className="p-8 flex flex-col justify-center" style={{ background:`linear-gradient(135deg,${BLUE},${BLUE2})` }}>
          <p className="text-xs font-black tracking-widest mb-3 text-white/70">PLAN YOUR VISIT</p>
          <h3 className="text-3xl font-black text-white mb-4" style={{ fontFamily:"'Exo 2',sans-serif" }}>
            Never Miss a Show
          </h3>
          <p className="text-sm text-white/80 mb-6 leading-relaxed">
            Download the ThrillVerse app to get real-time notifications for all shows, parades, and character meet & greet sessions.
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background:"rgba(255,255,255,0.15)" }}>
              <Bell size={18} className="text-white shrink-0"/>
              <p className="text-sm font-bold text-white">Show reminders & alerts</p>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background:"rgba(255,255,255,0.15)" }}>
              <MapPin size={18} className="text-white shrink-0"/>
              <p className="text-sm font-bold text-white">Live venue navigation</p>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background:"rgba(255,255,255,0.15)" }}>
              <Zap size={18} className="text-white shrink-0"/>
              <p className="text-sm font-bold text-white">Virtual Queue integration</p>
            </div>
          </div>
          <button className="mt-6 w-full py-3.5 rounded-2xl font-bold text-sm transition-all hover:shadow-xl hover:scale-105"
            style={{ background:"white", color:BLUE }}>
            📱 Download App — Free
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FlipCard — 3D rotateY flip card component
// ═══════════════════════════════════════════════════════════════════════════
function FlipCard({ char }: { char: typeof THRILLVERSE_CHARS[0] }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div style={{perspective:"1000px", height:"480px"}}>
      <div style={{
        position:"relative", width:"100%", height:"100%",
        transformStyle:"preserve-3d",
        transition:"transform 0.7s cubic-bezier(0.4,0,0.2,1)",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
      }}>

        {/* ── FRONT ── */}
        <div style={{
          position:"absolute", inset:0,
          backfaceVisibility:"hidden",
          borderRadius:20, overflow:"hidden",
          background:"white",
          border:`1.5px solid ${char.color}28`,
          boxShadow:`0 8px 32px ${char.color}15`,
        }}>
          {/* Character image */}
          <div style={{height:248, background:char.bg, overflow:"hidden", position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>
            <img src={char.img} alt={char.name}
              style={{width:"90%", height:"100%", objectFit:"contain", objectPosition:char.imgPos}}/>
            <div style={{position:"absolute", inset:0, background:`linear-gradient(to top, ${char.color}55 0%, transparent 60%)`}}/>
            <span style={{
              position:"absolute", top:12, left:12, padding:"3px 10px",
              borderRadius:999, fontSize:10, fontWeight:800,
              background:char.color, color:"white",
            }}>{char.role}</span>
          </div>
          {/* Front body */}
          <div style={{padding:"18px 20px 20px"}}>
            <h3 style={{fontFamily:"'Exo 2',sans-serif", fontWeight:900, fontSize:20, color:"#0d1f3c", marginBottom:4}}>{char.name}</h3>
            <p style={{fontSize:12, color:"#5a78a8", marginBottom:16, lineHeight:1.5}}>
              {char.desc.slice(0,90)}…
            </p>
            <div style={{display:"flex", gap:8}}>
              <button onClick={()=>setFlipped(true)}
                style={{flex:1, padding:"10px 0", borderRadius:12, fontSize:13, fontWeight:700,
                  background:`linear-gradient(135deg,${char.color},${char.color}bb)`, color:"white", border:"none", cursor:"pointer",
                  transition:"opacity 0.2s, transform 0.2s"}}>
                See Details →
              </button>
              <div style={{padding:"10px 14px", borderRadius:12, fontSize:11, fontWeight:700,
                background:char.bg, color:char.color, display:"flex", alignItems:"center", gap:6}}>
                📍 {char.meet.split("—")[0].trim()}
              </div>
            </div>
          </div>
        </div>

        {/* ── BACK ── */}
        <div style={{
          position:"absolute", inset:0,
          backfaceVisibility:"hidden",
          transform:"rotateY(180deg)",
          borderRadius:20,
          background:char.bg,
          border:`1.5px solid ${char.color}30`,
          boxShadow:`0 8px 32px ${char.color}20`,
          overflow:"hidden", overflowY:"auto",
          scrollbarWidth:"none",
        }}>
          {/* Back header stripe */}
          <div style={{background:`linear-gradient(135deg,${char.color},${char.color}cc)`, padding:"16px 20px"}}>
            <span style={{fontSize:10, fontWeight:800, color:"rgba(255,255,255,0.75)", letterSpacing:"0.1em"}}>THRILLVERSE CHARACTER</span>
            <h3 style={{fontFamily:"'Exo 2',sans-serif", fontWeight:900, fontSize:20, color:"white", marginTop:2}}>{char.name}</h3>
            <p style={{fontSize:11, color:"rgba(255,255,255,0.8)", marginTop:2}}>{char.role}</p>
          </div>

          <div style={{padding:"14px 16px", display:"flex", flexDirection:"column", gap:8}}>

            {/* ← Back button — TOP for easy access */}
            <button onClick={()=>setFlipped(false)}
              style={{width:"100%", padding:"8px 0", borderRadius:10, fontSize:12, fontWeight:700,
                background:"white", color:char.color, border:`1.5px solid ${char.color}50`,
                cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:4}}>
              ← Back to {char.name}
            </button>

            {/* Description */}
            <p style={{fontSize:11, color:"#5a78a8", lineHeight:1.6, margin:"2px 0"}}>{char.desc}</p>

            {/* Info cards */}
            {[
              {label:"PERSONALITY",  val:char.personality},
              {label:"FUN FACT",     val:char.funFact},
              {label:"MEET & GREET", val:`${char.meet} · ${char.meetTime}`},
            ].map(({label,val})=>(
              <div key={label} style={{padding:"9px 11px", borderRadius:10, background:"white", border:`1px solid ${char.color}18`}}>
                <p style={{fontSize:9, fontWeight:800, letterSpacing:"0.12em", color:"#5a78a8", marginBottom:2}}>{label}</p>
                <p style={{fontSize:11, fontWeight:600, color:"#0d1f3c", lineHeight:1.5}}>{val}</p>
              </div>
            ))}

            {/* Show timings */}
            <div style={{padding:"9px 11px", borderRadius:10, background:"white", border:`1px solid ${char.color}18`}}>
              <p style={{fontSize:9, fontWeight:800, letterSpacing:"0.12em", color:"#5a78a8", marginBottom:3}}>PERFORMANCE TIMINGS</p>
              {char.shows.map((s,i)=>(
                <p key={i} style={{fontSize:11, color:"#5a78a8", lineHeight:1.6}}>• {s}</p>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ATTRACTIONS PAGE — Premium Disney/Universal style
// Order: Hero → Events (primary) → Featured Parade → Characters → Gallery → Festivals → CTA
// ═══════════════════════════════════════════════════════════════════════════
function AttractionsPage({ setPage }: { setPage:(p:string)=>void }) {
  const [selectedEvent, setEvent]    = useState<typeof EVENTS[0]|null>(null);
  const [selectedChar,  setChar]     = useState<typeof THRILLVERSE_CHARS[0]|null>(null);
  const [galleryImg,    setGallery]  = useState<typeof ATTR_GALLERY[0]|null>(null);
  const [reminder,      setReminder] = useState<number|null>(null);

  return (
    <div className="bg-white min-h-screen">

      {/* ═══ 1. HERO ═══ */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1631800744240-d95925aacb01?w=1800&h=900&fit=crop&auto=format"
          alt="ThrillVerse Attractions"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{background:"linear-gradient(to bottom,rgba(6,13,40,0.65) 0%,rgba(6,13,40,0.38) 45%,rgba(6,13,40,0.82) 88%,#ffffff 100%)"}}/>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black tracking-widest text-white mb-5"
            style={{background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.28)",backdropFilter:"blur(8px)"}}>
            THRILLVERSE LIVE ENTERTAINMENT
          </span>
          <h1 className="text-5xl sm:text-7xl font-black text-white mb-5 leading-tight"
            style={{fontFamily:"'Exo 2',sans-serif",textShadow:"0 4px 32px rgba(0,0,0,0.4)"}}>
            World of <span style={{color:"#7dd3fc"}}>Attractions</span>
          </h1>
          <p className="text-base sm:text-xl text-white/85 max-w-2xl mx-auto mb-8 leading-relaxed">
            Experience spectacular parades, live entertainment, family shows, seasonal festivals, and meet original ThrillVerse characters throughout the day.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button className="px-8 py-3.5 rounded-full font-bold text-sm text-white transition-all hover:scale-105"
              style={{background:`linear-gradient(135deg,${BLUE},${BLUE2})`,boxShadow:"0 8px 28px rgba(26,110,245,0.45)"}}>
              Explore Schedule
            </button>
            <button onClick={()=>setPage("Park Map")}
              className="px-8 py-3.5 rounded-full font-bold text-sm text-white transition-all hover:bg-white/20"
              style={{border:"2px solid rgba(255,255,255,0.5)",backdropFilter:"blur(8px)"}}>
              View Park Map
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {[{val:"17",label:"Rides"},{val:"4",label:"Zones"},{val:"6",label:"Daily Shows"},{val:"4",label:"Original Characters"}].map(s=>(
              <div key={s.label} className="text-center">
                <p className="text-3xl font-black text-white" style={{fontFamily:"'Exo 2',sans-serif"}}>{s.val}</p>
                <p className="text-xs text-white/60 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-28">

        {/* ═══ 2. TODAY'S EVENTS — highest visual priority ═══ */}
        <section className="py-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-black tracking-widest mb-2" style={{color:ORANGE}}>LIVE ENTERTAINMENT</p>
              <h2 className="text-4xl font-black text-[#0d1f3c]" style={{fontFamily:"'Exo 2',sans-serif"}}>
                Today's <span style={{color:BLUE}}>Upcoming Events</span>
              </h2>
              <p className="text-sm mt-2" style={{color:"#5a78a8"}}>All times are local park time · Updated live</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shrink-0"
              style={{background:"#f0fdf4",color:GREEN,border:"1px solid rgba(16,185,129,0.2)"}}>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>Park Open · 9 AM – 10 PM
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {EVENTS.map(ev=>(
              <div key={ev.id} className="group rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300 hover:-translate-y-1"
                style={{border:"1.5px solid rgba(26,110,245,0.1)"}}>
                <div className="relative overflow-hidden" style={{height:220}}>
                  <img src={ev.img} alt={ev.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                  <div className="absolute inset-0" style={{background:"linear-gradient(to top,rgba(13,31,60,0.88) 0%,rgba(13,31,60,0.12) 55%,transparent 100%)"}}/>
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black"
                      style={{background:ev.status==="live"?"#fef2f2":"rgba(255,255,255,0.93)",color:ev.status==="live"?RED:BLUE}}>
                      <span className={`w-2 h-2 rounded-full ${ev.status==="live"?"bg-red-500 animate-pulse":"bg-blue-500"}`}/>
                      {ev.status==="live"?"LIVE NOW":"UPCOMING"}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white"
                      style={{background:"rgba(0,0,0,0.35)",backdropFilter:"blur(6px)"}}>{ev.category}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-black text-white" style={{fontFamily:"'Exo 2',sans-serif"}}>{ev.time}</p>
                        <p className="text-xs text-white/70">ends {ev.endTime} · {ev.duration}</p>
                      </div>
                      <p className="text-xs font-bold text-white/80">📍 {ev.zone}</p>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-black text-xl text-[#0d1f3c] mb-2" style={{fontFamily:"'Exo 2',sans-serif"}}>{ev.name}</h3>
                  <p className="text-sm leading-relaxed mb-4" style={{color:"#5a78a8"}}>{ev.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {ev.highlights.map(h=>(
                      <span key={h} className="px-2.5 py-1 rounded-lg text-[11px] font-bold" style={{background:"#f0f5ff",color:BLUE}}>✦ {h}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mb-4 text-xs" style={{color:"#5a78a8"}}>
                    <span className="font-bold">Characters:</span>
                    {ev.characters.map(c=>(
                      <span key={c} className="px-2 py-0.5 rounded-full font-bold" style={{background:"#fff7f0",color:ORANGE}}>{c}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={()=>setEvent(ev)} className="py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
                      style={{background:`linear-gradient(135deg,${BLUE},${BLUE2})`}}>View Details</button>
                    <button onClick={()=>setPage("Park Map")} className="py-2 rounded-xl text-xs font-bold transition-all"
                      style={{background:"#f0f5ff",color:BLUE}}>View on Map</button>
                    <button onClick={()=>setReminder(ev.id)} className="py-2 rounded-xl text-xs font-bold transition-all"
                      style={{background:reminder===ev.id?"#f0fdf4":"#f0f5ff",color:reminder===ev.id?GREEN:"#5a78a8",border:reminder===ev.id?"1px solid rgba(16,185,129,0.3)":"none"}}>
                      {reminder===ev.id?"✓ Set":"Set Reminder"}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ 3. FEATURED PARADE ═══ */}
        <section className="py-6">
          <div className="rounded-3xl overflow-hidden shadow-xl" style={{border:"1.5px solid rgba(249,115,22,0.15)"}}>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative overflow-hidden" style={{minHeight:420}}>
                <img src={EVENTS[0].img} alt={EVENTS[0].name} className="absolute inset-0 w-full h-full object-cover"/>
                <div className="absolute inset-0" style={{background:"linear-gradient(to right,transparent 65%,white 100%)"}}/>
                <div className="absolute top-5 left-5">
                  <span className="px-3 py-1.5 rounded-full text-xs font-black text-white" style={{background:ORANGE}}>🎠 FEATURED PARADE</span>
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center bg-white">
                <p className="text-xs font-black tracking-widest mb-3" style={{color:ORANGE}}>TODAY'S HIGHLIGHT</p>
                <h2 className="text-3xl font-black text-[#0d1f3c] mb-3" style={{fontFamily:"'Exo 2',sans-serif"}}>{EVENTS[0].name}</h2>
                <p className="text-sm leading-relaxed mb-5" style={{color:"#5a78a8"}}>{EVENTS[0].description}</p>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[{label:"Duration",val:EVENTS[0].duration},{label:"Location",val:EVENTS[0].zone},{label:"Timings",val:`${EVENTS[0].time}, 2:00 PM, 6:00 PM`},{label:"Crowd",val:`${EVENTS[0].crowd} Expected`}].map(({label,val})=>(
                    <div key={label} className="p-3 rounded-xl" style={{background:"#f0f5ff"}}>
                      <p className="text-[10px] font-black tracking-wider mb-0.5" style={{color:"#5a78a8"}}>{label.toUpperCase()}</p>
                      <p className="text-sm font-bold text-[#0d1f3c]">{val}</p>
                    </div>
                  ))}
                </div>
                <div className="mb-5">
                  <p className="text-[10px] font-black tracking-widest mb-2" style={{color:"#5a78a8"}}>PARADE ROUTE</p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {EVENTS[0].route.map((stop,i)=>(
                      <span key={i} className="flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{background:"#fff7f0",color:ORANGE}}>{stop}</span>
                        {i<EVENTS[0].route.length-1&&<span style={{color:ORANGE}}>→</span>}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-5">
                  <p className="text-[10px] font-black tracking-widest mb-2" style={{color:"#5a78a8"}}>CHARACTERS APPEARING</p>
                  <div className="flex gap-2">
                    {EVENTS[0].characters.map(c=>(
                      <span key={c} className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{background:ORANGE}}>{c}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={()=>setEvent(EVENTS[0])} className="flex-1 py-3 rounded-2xl font-bold text-sm text-white transition-all hover:shadow-lg hover:opacity-90"
                    style={{background:`linear-gradient(135deg,${ORANGE},#ea580c)`}}>View Parade Route</button>
                  <button onClick={()=>setReminder(1)} className="px-5 py-3 rounded-2xl font-bold text-sm transition-all"
                    style={{background:reminder===1?"#f0fdf4":"#f0f5ff",color:reminder===1?GREEN:"#5a78a8"}}>
                    {reminder===1?"✓ Set":"⏰ Remind"}</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 4. MEET THE STARS — 3D Flip Cards ═══ */}
        <section className="py-14">
          <div className="text-center mb-12">
            <p className="text-xs font-black tracking-widest mb-2" style={{color:ORANGE}}>ORIGINAL CHARACTERS</p>
            <h2 className="text-4xl font-black text-[#0d1f3c]" style={{fontFamily:"'Exo 2',sans-serif"}}>
              Meet the <span style={{color:BLUE}}>Stars of ThrillVerse</span>
            </h2>
            <p className="text-sm mt-3 max-w-lg mx-auto leading-relaxed" style={{color:"#5a78a8"}}>
              Four original ThrillVerse characters — each with their own story, personality and daily shows. Click <b style={{color:BLUE}}>See Details</b> to flip the card and discover their world.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {THRILLVERSE_CHARS.map(ch=>(
              <FlipCard key={ch.id} char={ch}/>
            ))}
          </div>

        </section>

        {/* ═══ 5. ENTERTAINMENT ACTS ═══ */}
        <section className="py-10">
          <div className="text-center mb-10">
            <p className="text-xs font-black tracking-widest mb-2" style={{color:PURPLE}}>LIVE PERFORMANCES</p>
            <h2 className="text-3xl font-black text-[#0d1f3c]" style={{fontFamily:"'Exo 2',sans-serif"}}>
              Entertainment Acts Featuring <span style={{color:BLUE}}>Talented Performers</span>
            </h2>
            <p className="text-sm mt-2 max-w-lg mx-auto" style={{color:"#5a78a8"}}>
              World-class live entertainment spread across the park — from heart-pumping dance to mind-bending magic.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ENTERTAINMENT_ACTS.map(act=>(
              <div key={act.id} className="group rounded-2xl overflow-hidden bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                style={{border:`1.5px solid ${act.color}20`,boxShadow:`0 4px 16px ${act.color}0d`}}>
                {/* Image */}
                <div className="relative overflow-hidden" style={{height:200}}>
                  <img src={act.img} alt={act.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                  <div className="absolute inset-0" style={{background:`linear-gradient(to top,rgba(0,0,0,0.65) 0%,transparent 55%)`}}/>
                  {/* Emoji badge */}
                  <div className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{background:"rgba(255,255,255,0.92)"}}>
                    {act.emoji}
                  </div>
                  {/* Act name overlay */}
                  <div className="absolute bottom-3 left-3">
                    <h3 className="font-black text-base text-white" style={{fontFamily:"'Exo 2',sans-serif"}}>{act.name}</h3>
                  </div>
                </div>
                {/* Body */}
                <div className="p-4">
                  <p className="text-xs leading-relaxed mb-3" style={{color:"#5a78a8"}}>{act.desc}</p>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{background:act.bg, border:`1px solid ${act.color}25`}}>
                    <span className="text-base shrink-0">🎠</span>
                    <p className="text-xs font-bold" style={{color:act.color}}>
                      You can see this act in the parade!
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Entertainment schedule strip */}
          <div className="mt-8 p-5 rounded-2xl" style={{background:"linear-gradient(135deg,#f0f5ff,#eef4ff)",border:"1.5px solid rgba(26,110,245,0.12)"}}>
            <p className="text-xs font-black tracking-widest mb-4" style={{color:BLUE}}>TODAY'S PERFORMANCE SCHEDULE</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {act:"Bhangra Boys",  time:"11:00 AM & 3:00 PM", venue:"Main Stage",    color:"#e53e3e"},
                {act:"Hip Hop Crew",  time:"12:00 PM & 4:30 PM", venue:"Central Plaza", color:"#6b46c1"},
                {act:"Acrobats",      time:"1:00 PM & 5:30 PM",  venue:"Arena East",    color:"#2b6cb0"},
                {act:"Magic Show",    time:"2:30 PM & 7:00 PM",  venue:"Family Stage",  color:"#2d3748"},
              ].map(p=>(
                <div key={p.act} className="p-3 rounded-xl bg-white" style={{border:`1px solid ${p.color}18`}}>
                  <span className="text-lg">{ENTERTAINMENT_ACTS.find(a=>a.name.includes(p.act.split(" ")[0]))?.emoji}</span>
                  <p className="font-black text-sm text-[#0d1f3c] mt-1" style={{fontFamily:"'Exo 2',sans-serif"}}>{p.act}</p>
                  <p className="text-xs font-bold mt-0.5" style={{color:p.color}}>{p.time}</p>
                  <p className="text-[10px] mt-0.5" style={{color:"#5a78a8"}}>📍 {p.venue}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 6. FESTIVALS ═══ */}
        <section className="py-10">
          <div className="text-center mb-8">
            <p className="text-xs font-black tracking-widest mb-2" style={{color:AMBER}}>ALL YEAR ROUND</p>
            <h2 className="text-3xl font-black text-[#0d1f3c]" style={{fontFamily:"'Exo 2',sans-serif"}}>
              Upcoming <span style={{color:BLUE}}>Festivals</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FESTIVALS.map(f=>(
              <div key={f.id} className="group rounded-2xl overflow-hidden bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{border:`1.5px solid ${f.color}20`}}>
                <div className="relative h-36 overflow-hidden">
                  <img src={f.img} alt={f.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                  <div className="absolute inset-0" style={{background:`linear-gradient(to top,${f.color}cc 0%,transparent 60%)`}}/>
                  <span className="absolute bottom-3 left-3 text-2xl">{f.emoji}</span>
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                    style={{background:"rgba(0,0,0,0.35)"}}>{f.dates}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-black text-base text-[#0d1f3c] mb-1" style={{fontFamily:"'Exo 2',sans-serif"}}>{f.name}</h3>
                  <p className="text-xs leading-relaxed mb-3" style={{color:"#5a78a8"}}>{f.desc}</p>
                  <button className="w-full py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
                    style={{background:f.color}}>Learn More</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ 7. CTA ═══ */}
        <section className="py-6">
          <div className="rounded-3xl overflow-hidden relative" style={{background:`linear-gradient(135deg,${BLUE} 0%,${BLUE2} 60%,#003d99 100%)`}}>
            <div className="absolute inset-0 opacity-10" style={{backgroundImage:"url(https://images.unsplash.com/photo-1762639111748-982bda14135e?w=1200&h=400&fit=crop)",backgroundSize:"cover",backgroundPosition:"center"}}/>
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-12">
              <div>
                <p className="text-xs font-black tracking-widest text-white/70 mb-2">TODAY ONLY</p>
                <h2 className="text-3xl font-black text-white" style={{fontFamily:"'Exo 2',sans-serif"}}>Don't Miss Today's Entertainment</h2>
                <p className="text-sm text-white/80 mt-2 max-w-md leading-relaxed">
                  From morning parades to the Galaxy Lights Night Parade — every hour brings a new spectacular experience.
                </p>
              </div>
              <div className="flex flex-col gap-3 shrink-0">
                <button className="px-8 py-3.5 rounded-2xl font-bold text-sm transition-all hover:scale-105 hover:shadow-xl"
                  style={{background:"white",color:BLUE}}>View Full Schedule</button>
                <button onClick={()=>setPage("Tickets")} className="px-8 py-3.5 rounded-2xl font-bold text-sm text-white transition-all hover:scale-105"
                  style={{background:"rgba(255,255,255,0.18)",border:"2px solid rgba(255,255,255,0.4)",backdropFilter:"blur(8px)"}}>Book Tickets</button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ═══ EVENT DETAIL MODAL ═══ */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={()=>setEvent(null)}>
          <div className="absolute inset-0" style={{background:"rgba(6,13,40,0.72)",backdropFilter:"blur(10px)"}}/>
          <div className="relative w-full max-w-xl rounded-3xl overflow-hidden bg-white shadow-2xl"
            style={{maxHeight:"88vh",overflowY:"auto",scrollbarWidth:"none"}} onClick={e=>e.stopPropagation()}>
            <div className="relative h-52 overflow-hidden">
              <img src={selectedEvent.img} alt={selectedEvent.name} className="w-full h-full object-cover"/>
              <div className="absolute inset-0" style={{background:"linear-gradient(to top,rgba(13,31,60,0.88) 0%,transparent 55%)"}}/>
              <button onClick={()=>setEvent(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center" style={{background:"rgba(255,255,255,0.95)"}}>
                <X size={14} style={{color:"#0d1f3c"}}/>
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black"
                    style={{background:selectedEvent.status==="live"?"#fef2f2":"rgba(255,255,255,0.2)",color:selectedEvent.status==="live"?RED:"white",backdropFilter:"blur(8px)"}}>
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedEvent.status==="live"?"bg-red-500 animate-pulse":"bg-white"}`}/>
                    {selectedEvent.status==="live"?"LIVE NOW":"UPCOMING"}
                  </span>
                  <span className="text-xs text-white/80">{selectedEvent.category}</span>
                </div>
                <h2 className="text-xl font-black text-white" style={{fontFamily:"'Exo 2',sans-serif"}}>{selectedEvent.name}</h2>
              </div>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[{label:"Start",val:selectedEvent.time},{label:"End",val:selectedEvent.endTime},{label:"Duration",val:selectedEvent.duration}].map(({label,val})=>(
                  <div key={label} className="p-3 rounded-xl text-center" style={{background:"#f0f5ff"}}>
                    <p className="text-sm font-black" style={{fontFamily:"'Exo 2',sans-serif",color:BLUE}}>{val}</p>
                    <p className="text-[10px]" style={{color:"#5a78a8"}}>{label}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{color:"#5a78a8"}}>{selectedEvent.description}</p>
              <p className="text-[10px] font-black tracking-widest mb-2" style={{color:"#5a78a8"}}>HIGHLIGHTS</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {selectedEvent.highlights.map(h=>(
                  <span key={h} className="px-2.5 py-1 rounded-lg text-[11px] font-bold" style={{background:"#f0f5ff",color:BLUE}}>✦ {h}</span>
                ))}
              </div>
              <p className="text-[10px] font-black tracking-widest mb-2" style={{color:"#5a78a8"}}>PERFORMANCE ROUTE</p>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {selectedEvent.route.map((stop,i)=>(
                  <span key={i} className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0" style={{background:BLUE}}>{i+1}</span>
                      <span className="text-xs font-bold text-[#0d1f3c]">{stop}</span>
                    </span>
                    {i<selectedEvent.route.length-1&&<span style={{color:BLUE}}>→</span>}
                  </span>
                ))}
              </div>
              <p className="text-[10px] font-black tracking-widest mb-2" style={{color:"#5a78a8"}}>CHARACTERS APPEARING</p>
              <div className="flex gap-2 mb-5">
                {selectedEvent.characters.map(c=>(
                  <span key={c} className="px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{background:ORANGE}}>{c}</span>
                ))}
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl mb-5" style={{background:"#eef4ff"}}>
                <MapPin size={18} style={{color:BLUE}}/><span className="text-sm font-bold text-[#0d1f3c]">{selectedEvent.zone}</span>
                <span className="text-xs ml-auto" style={{color:"#5a78a8"}}>Crowd: <b style={{color:ORANGE}}>{selectedEvent.crowd}</b></span>
              </div>
              <div className="flex gap-3">
                <button onClick={()=>setReminder(selectedEvent.id)} className="flex-1 py-2.5 rounded-2xl font-bold text-sm transition-all"
                  style={{background:reminder===selectedEvent.id?"#f0fdf4":"#f0f5ff",color:reminder===selectedEvent.id?GREEN:"#5a78a8"}}>
                  {reminder===selectedEvent.id?"✓ Reminder Set":"Set Reminder"}</button>
                <button onClick={()=>setPage("Park Map")} className="flex-1 py-2.5 rounded-2xl font-bold text-sm text-white"
                  style={{background:`linear-gradient(135deg,${BLUE},${BLUE2})`}}>View on Map</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ CHARACTER DETAIL MODAL ═══ */}
      {selectedChar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={()=>setChar(null)}>
          <div className="absolute inset-0" style={{background:"rgba(6,13,40,0.72)",backdropFilter:"blur(10px)"}}/>
          <div className="relative w-full max-w-md rounded-3xl overflow-hidden bg-white shadow-2xl"
            style={{maxHeight:"88vh",overflowY:"auto",scrollbarWidth:"none"}} onClick={e=>e.stopPropagation()}>
            <div className="relative h-48 overflow-hidden" style={{background:selectedChar.bg}}>
              <img src={selectedChar.img} alt={selectedChar.name} className="w-full h-full object-cover"/>
              <div className="absolute inset-0" style={{background:`linear-gradient(to top,${selectedChar.color}99 0%,transparent 55%)`}}/>
              <button onClick={()=>setChar(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                style={{background:"rgba(255,255,255,0.95)"}}><X size={14} style={{color:"#0d1f3c"}}/></button>
            </div>
            <div className="p-5">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3" style={{background:selectedChar.bg,color:selectedChar.color}}>{selectedChar.role}</span>
              <h2 className="text-2xl font-black text-[#0d1f3c] mb-2" style={{fontFamily:"'Exo 2',sans-serif"}}>{selectedChar.name}</h2>
              <p className="text-sm leading-relaxed mb-4" style={{color:"#5a78a8"}}>{selectedChar.desc}</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[{label:"Meet Location",val:selectedChar.meet},{label:"Meet Timings",val:selectedChar.meetTime},{label:"Favourite Ride",val:selectedChar.favoriteRide},{label:"Zone",val:selectedChar.meet}].map(({label,val})=>(
                  <div key={label} className="p-3 rounded-xl" style={{background:"#f0f5ff"}}>
                    <p className="text-[10px] font-bold mb-0.5" style={{color:"#5a78a8"}}>{label.toUpperCase()}</p>
                    <p className="text-xs font-bold text-[#0d1f3c]">{val}</p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-black tracking-widest mb-2" style={{color:"#5a78a8"}}>FUN FACTS</p>
              <div className="flex flex-col gap-2 mb-5">
                {selectedChar.facts.map((f,i)=>(
                  <div key={i} className="flex items-start gap-2 text-sm" style={{color:"#1a3a6e"}}>
                    <span className="font-black shrink-0" style={{color:selectedChar.color}}>→</span>{f}
                  </div>
                ))}
              </div>
              <button className="w-full py-3 rounded-2xl font-bold text-sm text-white transition-all hover:opacity-90"
                style={{background:`linear-gradient(135deg,${selectedChar.color},${selectedChar.color}bb)`}}>
                Plan Your Meet & Greet</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ GALLERY LIGHTBOX ═══ */}
      {galleryImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={()=>setGallery(null)}>
          <div className="absolute inset-0" style={{background:"rgba(0,0,0,0.9)"}}/>
          <div className="relative max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl" onClick={e=>e.stopPropagation()}>
            <img src={galleryImg.src.replace("w=500&h=380","w=900&h=600").replace("w=500&h=760","w=900&h=1100")} alt={galleryImg.label} className="w-full object-cover"/>
            <button onClick={()=>setGallery(null)} className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
              style={{background:"rgba(255,255,255,0.9)"}}><X size={16} style={{color:"#0d1f3c"}}/></button>
            <div className="absolute bottom-0 left-0 right-0 p-5" style={{background:"linear-gradient(to top,rgba(0,0,0,0.7),transparent)"}}>
              <p className="font-bold text-white">{galleryImg.label}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PARK MAP DATA
// ═══════════════════════════════════════════════════════════════════════════
const PARK_MARKERS = [
  // ── THRILLER ZONE A ──
  {id:"thunder-loop",      name:"Thunder Loop",      type:"thriller", x:12, y:22, status:"open",   wait:22, rating:4.9, img:IMG.roller,  icon:"🎢", color:ORANGE, zone:"Zone A", rideId:1 },
  {id:"sky-screamer",      name:"Sky Screamer",      type:"thriller", x:20, y:10, status:"open",   wait:35, rating:4.8, img:IMG.neon,    icon:"😱", color:ORANGE, zone:"Zone A", rideId:2 },
  {id:"vortex-drop",       name:"Vortex Drop",       type:"thriller", x:28, y:20, status:"queue",  wait:28, rating:4.7, img:IMG.tower,   icon:"⬇️", color:ORANGE, zone:"Zone A", rideId:3 },
  {id:"cyclone-rush",      name:"Cyclone Rush",      type:"thriller", x:8,  y:32, status:"open",   wait:40, rating:4.6, img:IMG.coaster, icon:"🌀", color:ORANGE, zone:"Zone A", rideId:4 },
  {id:"gravity-spin",      name:"Gravity Spin",      type:"thriller", x:18, y:38, status:"closed", wait:0,  rating:4.5, img:IMG.roller,  icon:"🔄", color:RED,    zone:"Zone A", rideId:5 },
  {id:"fire-storm",        name:"Fire Storm",        type:"thriller", x:10, y:46, status:"open",   wait:32, rating:4.7, img:IMG.neon,    icon:"🔥", color:ORANGE, zone:"Zone A", rideId:6 },
  // ── WATER ZONE B ──
  {id:"splash-river",      name:"Splash River",      type:"water",    x:70, y:12, status:"open",   wait:18, rating:4.7, img:IMG.water,   icon:"🌊", color:CYAN,   zone:"Zone B", rideId:7 },
  {id:"aqua-twister",      name:"Aqua Twister",      type:"water",    x:82, y:20, status:"queue",  wait:28, rating:4.6, img:IMG.splash,  icon:"💧", color:CYAN,   zone:"Zone B", rideId:8 },
  {id:"wave-racer",        name:"Wave Racer",         type:"water",    x:72, y:30, status:"open",   wait:22, rating:4.4, img:IMG.water,   icon:"🏄", color:CYAN,   zone:"Zone B", rideId:9 },
  {id:"tsunami-falls",     name:"Tsunami Falls",     type:"water",    x:84, y:36, status:"busy",   wait:45, rating:4.8, img:IMG.splash,  icon:"🌧️", color:AMBER,  zone:"Zone B", rideId:10},
  // ── FAMILY ZONE C ──
  {id:"sky-wheel",         name:"Sky Wheel",         type:"family",   x:46, y:18, status:"open",   wait:10, rating:4.5, img:IMG.ferris,  icon:"🎡", color:INDIGO, zone:"Zone C", rideId:14},
  {id:"magic-carousel",    name:"Magic Carousel",    type:"family",   x:54, y:26, status:"open",   wait:8,  rating:4.3, img:IMG.ferris,  icon:"🎠", color:INDIGO, zone:"Zone C", rideId:12},
  {id:"adventure-express", name:"Adventure Express", type:"family",   x:40, y:40, status:"closed", wait:0,  rating:4.4, img:IMG.swing,   icon:"🚂", color:RED,    zone:"Zone C", rideId:11},
  {id:"jungle-safari",     name:"Jungle Safari",     type:"family",   x:56, y:44, status:"open",   wait:12, rating:4.5, img:IMG.swing,   icon:"🦁", color:INDIGO, zone:"Zone C", rideId:13},
  // ── KIDS ZONE D ──
  {id:"mini-dragon",       name:"Mini Dragon",       type:"kids",     x:68, y:62, status:"open",   wait:5,  rating:4.2, img:IMG.swing,   icon:"🐉", color:GREEN,  zone:"Zone D", rideId:15},
  {id:"happy-train",       name:"Happy Train",       type:"kids",     x:78, y:68, status:"open",   wait:6,  rating:4.1, img:IMG.ferris,  icon:"🚂", color:GREEN,  zone:"Zone D", rideId:16},
  {id:"pirate-ship",       name:"Pirate Ship",       type:"kids",     x:64, y:74, status:"open",   wait:10, rating:4.3, img:IMG.roller,  icon:"🏴‍☠️",color:GREEN, zone:"Zone D", rideId:17},
  // ── FACILITIES ──
  {id:"main-entrance",     name:"Main Entrance",     type:"entrance", x:46, y:93, icon:"🚪", color:"#1a3a6e" },
  {id:"exit-gate",         name:"Exit Gate",          type:"facility", x:60, y:93, icon:"🚶", color:"#5a78a8" },
  {id:"parking-a",         name:"Parking A",          type:"parking",  x:22, y:93, icon:"🅿️", color:"#5a78a8" },
  {id:"parking-b",         name:"Parking B",          type:"parking",  x:78, y:93, icon:"🅿️", color:"#5a78a8" },
  {id:"food-court-1",      name:"Food Court",         type:"food",     x:36, y:56, icon:"🍔", color:ORANGE   },
  {id:"food-court-2",      name:"Food Court East",    type:"food",     x:62, y:60, icon:"🍕", color:ORANGE   },
  {id:"washroom-1",        name:"Washroom",           type:"washroom", x:26, y:28, icon:"🚻", color:"#5a78a8" },
  {id:"washroom-2",        name:"Washroom",           type:"washroom", x:66, y:50, icon:"🚻", color:"#5a78a8" },
  {id:"washroom-3",        name:"Washroom",           type:"washroom", x:48, y:78, icon:"🚻", color:"#5a78a8" },
  {id:"medical",           name:"Medical Center",     type:"medical",  x:88, y:50, icon:"🏥", color:RED      },
  {id:"first-aid",         name:"First Aid",          type:"medical",  x:34, y:72, icon:"⛑️", color:RED      },
  {id:"info-desk",         name:"Info Desk",          type:"facility", x:46, y:82, icon:"ℹ️", color:BLUE    },
  {id:"lockers",           name:"Lockers",            type:"facility", x:38, y:86, icon:"🔒", color:"#5a78a8" },
  {id:"souvenir",          name:"Souvenir Shop",      type:"facility", x:60, y:84, icon:"🛍️", color:PURPLE  },
];

const QUICK_ROUTES = [
  {
    label:"Entrance → Thunder Loop",  from:"Main Entrance", to:"Thunder Loop",
    time:"8 min", distance:"450m", steps:6, difficulty:"Easy",
    path:[[46,93],[46,82],[38,72],[26,56],[18,40],[12,22]] as [number,number][],
    directions:[
      "Start at the Main Entrance gate and head north.",
      "Walk straight up the Central Boulevard (~120 m).",
      "At the Info Desk, turn left toward Zone A (Thriller).",
      "Pass Washroom 1 on your left (~150 m).",
      "Enter Zone A — follow the orange markers along the path.",
      "Thunder Loop will be on your right. Enjoy the ride! 🎢",
    ],
  },
  {
    label:"Entrance → Aqua Twister",  from:"Main Entrance", to:"Aqua Twister",
    time:"10 min", distance:"580m", steps:6, difficulty:"Easy",
    path:[[46,93],[46,82],[48,68],[58,50],[72,32],[82,20]] as [number,number][],
    directions:[
      "Start at the Main Entrance and walk north.",
      "Continue up the Central Boulevard to Central Plaza (~120 m).",
      "At Central Plaza, bear right toward Zone B (Water Zone).",
      "Pass Food Court East on your left (~200 m).",
      "Enter Zone B — follow the blue wave markers.",
      "Aqua Twister is straight ahead. Get ready to splash! 💧",
    ],
  },
  {
    label:"Parking → Food Court",     from:"Parking A", to:"Food Court",
    time:"4 min", distance:"200m", steps:4, difficulty:"Easy",
    path:[[22,93],[36,93],[36,78],[36,56]] as [number,number][],
    directions:[
      "Exit Parking Area A through the main pedestrian gate.",
      "Walk east along the Park Boundary Road (~80 m).",
      "Turn right at the park entrance junction.",
      "Food Court will be straight ahead on your left. 🍔",
    ],
  },
  {
    label:"Thunder Loop → Sky Wheel", from:"Thunder Loop", to:"Sky Wheel",
    time:"6 min", distance:"320m", steps:5, difficulty:"Easy",
    path:[[12,22],[22,32],[34,40],[40,32],[46,18]] as [number,number][],
    directions:[
      "Exit Thunder Loop through the ride exit gate.",
      "Walk east along the Zone A internal path (~100 m).",
      "At the Zone A–C junction, turn right toward Family Zone.",
      "Continue south-east through the open plaza.",
      "Sky Wheel observation wheel will be directly ahead. 🎡",
    ],
  },
  {
    label:"Sky Wheel → Exit Gate",    from:"Sky Wheel", to:"Exit Gate",
    time:"7 min", distance:"400m", steps:5, difficulty:"Easy",
    path:[[46,18],[48,38],[48,60],[56,76],[60,93]] as [number,number][],
    directions:[
      "Exit Sky Wheel observation platform, head south.",
      "Walk south on the Central Boulevard (~150 m).",
      "Pass the Souvenir Shop on your right.",
      "Continue straight past the Info Desk and Washroom 3.",
      "Exit Gate is directly ahead. Safe travels! 👋",
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// PARK MAP PAGE
// ═══════════════════════════════════════════════════════════════════════════
function ParkMapPage({ setPage }: { setPage:(p:string)=>void }) {
  const [activeFilter, setFilter]     = useState("All");
  const [searchQuery,  setSearch]     = useState("");
  const [selectedMarker, setMarker]   = useState<typeof PARK_MARKERS[0]|null>(null);
  const [fromLoc, setFrom]            = useState("Main Entrance");
  const [toLoc,   setTo]              = useState("");
  const [routeData, setRoute]         = useState<typeof QUICK_ROUTES[0]|null>(null);
  const [showDirs, setShowDirs]       = useState(false);

  const filterMap: Record<string,string[]> = {
    "All":["thriller","water","family","kids","food","washroom","medical","entrance","parking","facility"],
    "Thriller":["thriller"], "Water":["water"], "Family":["family"], "Kids":["kids"],
    "Restaurants":["food"], "Washrooms":["washroom"], "Medical":["medical"], "Parking":["parking"],
  };

  const visibleMarkers = PARK_MARKERS.filter(m => {
    if (searchQuery && !m.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return (filterMap[activeFilter]||[]).includes(m.type);
  });

  const statusColor = (s?:string) =>
    s==="open"?"#10b981":s==="busy"?"#f59e0b":s==="closed"?"#ef4444":s==="queue"?"#1a6ef5":"#5a78a8";

  const statusLabel = (s?:string) =>
    s==="open"?"🟢 Open":s==="busy"?"🟡 High Wait":s==="closed"?"🔴 Closed":s==="queue"?"🔵 Queue Available":"";

  const svgPath = (pts:[number,number][]) =>
    pts.map((p,i)=>`${i===0?"M":"L"} ${p[0]} ${p[1]}`).join(" ");

  const handleFindRoute = (overrideTo?:string) => {
    const dest = overrideTo || toLoc;
    const r = QUICK_ROUTES.find(r=>
      (r.from===fromLoc&&r.to===dest)||(r.from===dest&&r.to===fromLoc)
    ) ?? QUICK_ROUTES[0];
    setRoute(r); setShowDirs(true);
  };

  const isRide = (type:string) => ["thriller","water","family","kids"].includes(type);
  const fromOptions = ["Main Entrance","Parking A","Parking B","Medical Center","Food Court","Info Desk"];
  const toOptions   = PARK_MARKERS.filter(m=>isRide(m.type)||["food","facility","entrance"].includes(m.type)).map(m=>m.name);

  return (
    <div className="flex flex-col bg-white" style={{height:"calc(100vh - 64px)"}}>

      {/* ── Page Header ── */}
      <div className="shrink-0 bg-white px-4 sm:px-6 py-3 border-b" style={{borderColor:"rgba(26,110,245,0.1)",boxShadow:"0 2px 12px rgba(26,110,245,0.06)"}}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div>
            <h1 className="text-xl font-black text-[#0d1f3c]" style={{fontFamily:"'Exo 2',sans-serif"}}>
              🗺️ Smart <span style={{color:BLUE}}>Park Map</span>
            </h1>
            <p className="text-xs mt-0.5" style={{color:"#5a78a8"}}>Live navigation · 17 rides · All facilities</p>
          </div>
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl" style={{background:"#f0f5ff",border:"1.5px solid rgba(26,110,245,0.15)"}}>
              <Search size={14} style={{color:"#5a78a8"}}/>
              <input value={searchQuery} onChange={e=>setSearch(e.target.value)} placeholder="Search rides, facilities…" className="flex-1 text-sm outline-none bg-transparent" style={{color:"#0d1f3c"}}/>
              {searchQuery && <button onClick={()=>setSearch("")}><X size={12} style={{color:"#5a78a8"}}/></button>}
            </div>
          </div>
        </div>
        {/* Filter chips */}
        <div className="max-w-7xl mx-auto flex gap-2 mt-2 flex-wrap">
          {Object.keys(filterMap).map(f=>(
            <button key={f} onClick={()=>setFilter(f)} className="px-3 py-1 rounded-full text-xs font-bold transition-all"
              style={{background:activeFilter===f?`linear-gradient(135deg,${BLUE},${BLUE2})`:"#f0f5ff",color:activeFilter===f?"white":"#5a78a8",border:`1px solid ${activeFilter===f?BLUE:"rgba(26,110,245,0.12)"}`}}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Body: Sidebar + Map ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left Sidebar ── */}
        <div className="hidden lg:flex flex-col w-80 shrink-0 bg-white border-r overflow-y-auto" style={{borderColor:"rgba(26,110,245,0.08)",scrollbarWidth:"none"}}>

          {/* Navigation */}
          <div className="p-4 border-b" style={{borderColor:"rgba(26,110,245,0.08)"}}>
            <p className="text-[10px] font-black tracking-widest mb-3" style={{color:BLUE}}>NAVIGATION</p>
            {/* FROM */}
            <div className="mb-2">
              <label className="text-[10px] font-bold mb-1 block" style={{color:"#5a78a8"}}>FROM</label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{background:"#f0f5ff",border:"1.5px solid rgba(26,110,245,0.15)"}}>
                <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{background:GREEN}}><div className="w-1.5 h-1.5 rounded-full bg-white"/></div>
                <select value={fromLoc} onChange={e=>setFrom(e.target.value)} className="flex-1 text-sm font-medium outline-none bg-transparent" style={{color:"#0d1f3c"}}>
                  {fromOptions.map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            {/* Swap */}
            <div className="flex justify-center my-1.5">
              <button onClick={()=>{const t=fromLoc;setFrom(toLoc||fromLoc);setTo(t);}} className="w-7 h-7 rounded-full flex items-center justify-center border-2 text-sm transition-colors hover:bg-[#eef4ff]" style={{borderColor:`${BLUE}33`,color:BLUE}}>⇅</button>
            </div>
            {/* TO */}
            <div className="mb-3">
              <label className="text-[10px] font-bold mb-1 block" style={{color:"#5a78a8"}}>TO</label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{background:"#f0f5ff",border:"1.5px solid rgba(26,110,245,0.15)"}}>
                <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{background:RED}}><div className="w-1.5 h-1.5 rounded-full bg-white"/></div>
                <select value={toLoc} onChange={e=>setTo(e.target.value)} className="flex-1 text-sm font-medium outline-none bg-transparent" style={{color:"#0d1f3c"}}>
                  <option value="">Select destination…</option>
                  {toOptions.map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <button onClick={()=>handleFindRoute()} disabled={!toLoc} className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:shadow-lg disabled:opacity-40"
              style={{background:`linear-gradient(135deg,${BLUE},${BLUE2})`}}>
              🗺️ Find Route
            </button>
          </div>

          {/* Route result */}
          {routeData && showDirs && (
            <div className="p-4 border-b" style={{borderColor:"rgba(26,110,245,0.08)"}}>
              <div className="p-3 rounded-2xl mb-3" style={{background:"linear-gradient(135deg,#eef4ff,#f0f5ff)",border:"1.5px solid rgba(26,110,245,0.15)"}}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-black tracking-widest" style={{color:BLUE}}>ROUTE FOUND ✓</p>
                  <button onClick={()=>{setRoute(null);setShowDirs(false);}} className="text-[10px] font-bold" style={{color:"#5a78a8"}}>✕ Clear</button>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[{label:"Walk",val:routeData.time,color:BLUE},{label:"Distance",val:routeData.distance,color:GREEN},{label:"Steps",val:`${routeData.steps}`,color:ORANGE}].map(({label,val,color})=>(
                    <div key={label} className="p-2 bg-white rounded-xl">
                      <p className="text-sm font-black" style={{fontFamily:"'Exo 2',sans-serif",color}}>{val}</p>
                      <p className="text-[10px]" style={{color:"#5a78a8"}}>{label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-[10px]" style={{color:"#5a78a8"}}>
                  <span>Difficulty: <b style={{color:GREEN}}>Easy</b></span>
                  <span>🚶 Walking Route</span>
                </div>
              </div>
              {/* Directions */}
              <p className="text-[10px] font-black tracking-widest mb-2" style={{color:"#5a78a8"}}>TURN-BY-TURN DIRECTIONS</p>
              <div className="flex flex-col gap-1.5">
                {routeData.directions.map((step,i)=>(
                  <div key={i} className="flex gap-2 p-2.5 rounded-xl" style={{background:i===0?"#eef4ff":"white",border:"1px solid rgba(26,110,245,0.07)"}}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black" style={{background:i===0?BLUE:"#f0f5ff",color:i===0?"white":BLUE}}>{i+1}</div>
                    <p className="text-[11px] leading-relaxed" style={{color:"#1a3a6e"}}>{step}</p>
                  </div>
                ))}
              </div>
              {/* Nearby */}
              <div className="mt-3 p-3 rounded-xl" style={{background:"#f0f5ff"}}>
                <p className="text-[10px] font-black tracking-widest mb-2" style={{color:"#5a78a8"}}>NEARBY AT DESTINATION</p>
                {[{icon:"🚻",label:"Washroom",dist:"60m"},{icon:"🍔",label:"Food Court",dist:"80m"},{icon:"⛑️",label:"First Aid",dist:"120m"}].map(n=>(
                  <div key={n.label} className="flex items-center justify-between py-1 text-[11px]">
                    <span style={{color:"#1a3a6e"}}>{n.icon} {n.label}</span>
                    <span className="font-bold" style={{color:BLUE}}>{n.dist}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick routes */}
          <div className="p-4 border-b" style={{borderColor:"rgba(26,110,245,0.08)"}}>
            <p className="text-[10px] font-black tracking-widest mb-3" style={{color:"#5a78a8"}}>POPULAR ROUTES</p>
            <div className="flex flex-col gap-2">
              {QUICK_ROUTES.map((qr,i)=>(
                <button key={i} onClick={()=>{setFrom(qr.from);setTo(qr.to);setRoute(qr);setShowDirs(true);}}
                  className="text-left p-3 rounded-xl transition-all hover:shadow-md"
                  style={{background:routeData?.label===qr.label?"#eef4ff":"white",border:`1.5px solid ${routeData?.label===qr.label?BLUE:"rgba(26,110,245,0.1)"}`}}>
                  <p className="text-xs font-bold text-[#0d1f3c]">{qr.label}</p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-[10px]" style={{color:BLUE}}>🚶 {qr.time}</span>
                    <span className="text-[10px]" style={{color:"#5a78a8"}}>{qr.distance}</span>
                    <span className="text-[10px]" style={{color:GREEN}}>{qr.difficulty}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="p-4">
            <p className="text-[10px] font-black tracking-widest mb-3" style={{color:"#5a78a8"}}>MAP LEGEND</p>
            <div className="grid grid-cols-2 gap-y-2 gap-x-2">
              {[
                {color:GREEN,  label:"Open"},
                {color:AMBER,  label:"High Wait"},
                {color:RED,    label:"Closed"},
                {color:BLUE,   label:"Queue Available"},
                {color:ORANGE, label:"Zone A · Thriller"},
                {color:CYAN,   label:"Zone B · Water"},
                {color:INDIGO, label:"Zone C · Family"},
                {color:GREEN,  label:"Zone D · Kids"},
              ].map(({color,label})=>(
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{background:color}}/>
                  <span className="text-[10px]" style={{color:"#5a78a8"}}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Map Area ── */}
        <div className="flex-1 relative overflow-hidden" style={{background:"linear-gradient(135deg,#e8f5e9 0%,#f1f8e9 60%,#e3f2fd 100%)"}}>

          {/* Zone backgrounds */}
          {/* Zone A Thriller */}
          <div className="absolute rounded-3xl" style={{left:"2%",top:"3%",width:"32%",height:"53%",background:"linear-gradient(135deg,rgba(249,115,22,0.13),rgba(249,115,22,0.05))",border:"2px dashed rgba(249,115,22,0.35)"}}>
            <span className="absolute top-2 left-3 text-[10px] font-black" style={{color:ORANGE}}>⚡ ZONE A · THRILLER</span>
          </div>
          {/* Zone B Water */}
          <div className="absolute rounded-3xl" style={{left:"60%",top:"2%",width:"38%",height:"50%",background:"linear-gradient(135deg,rgba(6,182,212,0.13),rgba(6,182,212,0.05))",border:"2px dashed rgba(6,182,212,0.35)"}}>
            <span className="absolute top-2 left-3 text-[10px] font-black" style={{color:CYAN}}>🌊 ZONE B · WATER</span>
          </div>
          {/* Zone C Family */}
          <div className="absolute rounded-3xl" style={{left:"34%",top:"8%",width:"28%",height:"46%",background:"linear-gradient(135deg,rgba(99,102,241,0.1),rgba(99,102,241,0.04))",border:"2px dashed rgba(99,102,241,0.28)"}}>
            <span className="absolute top-2 left-2 text-[10px] font-black" style={{color:INDIGO}}>🎡 ZONE C · FAMILY</span>
          </div>
          {/* Zone D Kids */}
          <div className="absolute rounded-3xl" style={{left:"56%",top:"55%",width:"36%",height:"33%",background:"linear-gradient(135deg,rgba(16,185,129,0.1),rgba(16,185,129,0.04))",border:"2px dashed rgba(16,185,129,0.28)"}}>
            <span className="absolute top-2 left-3 text-[10px] font-black" style={{color:GREEN}}>🐣 ZONE D · KIDS</span>
          </div>

          {/* Central Plaza */}
          <div className="absolute" style={{left:"48%",top:"62%",transform:"translate(-50%,-50%)"}}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-white shadow-md" style={{background:"rgba(255,255,255,0.85)"}}>
              <span className="text-center font-black leading-tight" style={{fontSize:8,color:"#0d1f3c"}}>CENTRAL{"\n"}PLAZA</span>
            </div>
          </div>

          {/* SVG Walking paths + active route */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" style={{zIndex:2,pointerEvents:"none"}}>
            {/* Static paths */}
            <path d="M 46 93 L 46 82 L 46 62 L 46 18" stroke="#b8cce8" strokeWidth="0.5" fill="none" strokeDasharray="2 1.5" opacity="0.7"/>
            <path d="M 5 62 L 95 62" stroke="#b8cce8" strokeWidth="0.4" fill="none" strokeDasharray="2 1.5" opacity="0.6"/>
            <path d="M 46 62 L 32 44 L 20 30 L 12 22" stroke="#b8cce8" strokeWidth="0.45" fill="none" strokeDasharray="2 1.5" opacity="0.65"/>
            <path d="M 46 62 L 58 46 L 70 30 L 82 20" stroke="#b8cce8" strokeWidth="0.45" fill="none" strokeDasharray="2 1.5" opacity="0.65"/>
            <path d="M 46 62 L 56 68 L 70 72" stroke="#b8cce8" strokeWidth="0.4" fill="none" strokeDasharray="2 1.5" opacity="0.6"/>
            <path d="M 22 93 L 46 93 L 60 93 L 78 93" stroke="#b8cce8" strokeWidth="0.4" fill="none" opacity="0.6"/>
            <path d="M 46 82 L 36 72 L 36 56" stroke="#b8cce8" strokeWidth="0.4" fill="none" strokeDasharray="2 1.5" opacity="0.55"/>
            <path d="M 60 84 L 62 60" stroke="#b8cce8" strokeWidth="0.4" fill="none" strokeDasharray="2 1.5" opacity="0.55"/>
            <path d="M 88 50 L 84 36" stroke="#fca5a5" strokeWidth="0.4" fill="none" strokeDasharray="2 1.5" opacity="0.6"/>
            {/* Active route glow */}
            {routeData && (
              <path d={svgPath(routeData.path)} stroke={BLUE} strokeWidth="3" fill="none" opacity="0.12" strokeLinecap="round" strokeLinejoin="round"/>
            )}
            {/* Active route animated */}
            {routeData && (
              <path d={svgPath(routeData.path)} stroke={BLUE} strokeWidth="1.4" fill="none" strokeDasharray="4 2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{animation:"dashRoute 0.7s linear infinite"}}/>
            )}
            {/* Route waypoint dots */}
            {routeData && routeData.path.map(([x,y],i)=>(
              <circle key={i} cx={x} cy={y} r={i===0||i===routeData.path.length-1?1.4:0.8}
                fill={i===0?GREEN:i===routeData.path.length-1?RED:BLUE} opacity="0.95"/>
            ))}
          </svg>

          {/* Markers */}
          {visibleMarkers.map(m=>{
            const sel = selectedMarker?.id===m.id;
            const big = isRide(m.type);
            return (
              <div key={m.id} className="absolute cursor-pointer"
                style={{left:`${m.x}%`,top:`${m.y}%`,zIndex:sel?30:isRide(m.type)?12:8,transform:"translate(-50%,-100%)"}}
                onClick={()=>setMarker(sel?null:m)}
              >
                <div className="flex flex-col items-center transition-transform duration-200" style={{transform:sel?"scale(1.35)":"scale(1)"}}>
                  {/* Pin circle */}
                  <div className="flex items-center justify-center rounded-full shadow-lg border-2 border-white"
                    style={{width:big?30:22,height:big?30:22,background:sel?m.color:`${m.color}cc`}}>
                    <span style={{fontSize:big?14:10}}>{m.icon}</span>
                  </div>
                  {/* Pin stem */}
                  <div className="w-0.5 h-2" style={{background:m.color}}/>
                  {/* Label for facilities */}
                  {!isRide(m.type) && (
                    <div className="-mt-1 px-1.5 py-0.5 rounded text-[8px] font-bold whitespace-nowrap shadow-sm" style={{background:"rgba(255,255,255,0.95)",color:m.color}}>
                      {m.name}
                    </div>
                  )}
                  {/* Wait time badge */}
                  {(m as any).wait > 0 && !sel && (
                    <div className="absolute -top-1 -right-1 px-1 py-0.5 rounded text-[7px] font-black text-white leading-none" style={{background:statusColor((m as any).status)}}>
                      {(m as any).wait}m
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Popup */}
          {selectedMarker && (
            <div className="absolute z-40 w-52 rounded-2xl overflow-hidden shadow-2xl"
              style={{
                left:`${Math.min(Math.max(selectedMarker.x,22),72)}%`,
                top:`${selectedMarker.y>58?selectedMarker.y-54:selectedMarker.y+6}%`,
                transform:"translateX(-50%)",
                background:"white",
                border:`2px solid ${selectedMarker.color}33`,
              }}>
              {/* Image */}
              {(selectedMarker as any).img && (
                <div className="h-24 overflow-hidden bg-blue-50">
                  <img src={(selectedMarker as any).img} alt={selectedMarker.name} className="w-full h-full object-cover"/>
                </div>
              )}
              <div className="p-3">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="font-black text-sm text-[#0d1f3c]" style={{fontFamily:"'Exo 2',sans-serif"}}>{selectedMarker.name}</p>
                    {(selectedMarker as any).zone && <p className="text-[10px]" style={{color:"#5a78a8"}}>{(selectedMarker as any).zone}</p>}
                  </div>
                  <button onClick={()=>setMarker(null)} className="hover:bg-gray-100 rounded-full p-0.5"><X size={11} style={{color:"#5a78a8"}}/></button>
                </div>
                {(selectedMarker as any).status && <p className="text-[11px] font-bold mb-1">{statusLabel((selectedMarker as any).status)}</p>}
                {(selectedMarker as any).wait > 0 && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <Clock size={10} style={{color:BLUE}}/><span className="text-[11px] font-bold" style={{color:BLUE}}>{(selectedMarker as any).wait} min wait</span>
                    <span className="text-[10px]" style={{color:"#5a78a8"}}>· ~200m</span>
                  </div>
                )}
                {(selectedMarker as any).rating && (
                  <div className="flex items-center gap-1 mb-2">
                    <Star size={9} fill={AMBER} style={{color:AMBER}}/><span className="text-[11px] font-bold" style={{color:AMBER}}>{(selectedMarker as any).rating}</span>
                  </div>
                )}
                <div className="flex gap-1.5 mt-2">
                  <button onClick={()=>{setTo(selectedMarker.name);handleFindRoute(selectedMarker.name);}}
                    className="flex-1 py-1.5 rounded-lg text-[10px] font-bold text-white"
                    style={{background:`linear-gradient(135deg,${BLUE},${BLUE2})`}}>
                    🗺️ Navigate
                  </button>
                  {isRide(selectedMarker.type) && (
                    <button onClick={()=>setPage("Virtual Queue")} className="flex-1 py-1.5 rounded-lg text-[10px] font-bold" style={{background:"#eef4ff",color:BLUE}}>
                      Join Queue
                    </button>
                  )}
                </div>
                {isRide(selectedMarker.type) && (
                  <button onClick={()=>setPage("Explore")} className="w-full mt-1 py-1.5 rounded-lg text-[10px] font-bold" style={{background:"#f0f5ff",color:"#5a78a8"}}>
                    View Details
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Live status chips */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-20">
            {[
              {icon:"🟢",label:"Park Open",  color:"#16a34a"},
              {icon:"👥",label:"Moderate",   color:"#0d1f3c"},
              {icon:"📍",label:`${visibleMarkers.length} shown`,color:"#0d1f3c"},
            ].map(c=>(
              <div key={c.label} className="px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 text-[11px] font-bold shadow-md"
                style={{background:"rgba(255,255,255,0.94)",color:c.color}}>
                <span>{c.icon}</span><span>{c.label}</span>
              </div>
            ))}
          </div>

          {/* Zoom controls */}
          <div className="absolute bottom-5 right-4 flex flex-col gap-1.5 z-20">
            {["+","−"].map(s=>(
              <button key={s} className="w-8 h-8 rounded-xl bg-white flex items-center justify-center font-bold shadow-md text-sm" style={{border:"1px solid rgba(26,110,245,0.15)",color:"#0d1f3c"}}>{s}</button>
            ))}
            <button className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-md" style={{border:"1px solid rgba(26,110,245,0.15)"}}>
              <Navigation size={13} style={{color:BLUE}}/>
            </button>
          </div>

          {/* Mobile bottom hint */}
          <div className="lg:hidden absolute bottom-4 left-4 right-16 z-20">
            <div className="p-3 rounded-2xl flex items-center gap-3 shadow-lg" style={{background:"rgba(255,255,255,0.96)"}}>
              <div className="flex-1">
                <p className="text-xs font-bold text-[#0d1f3c]">Tap any marker to navigate</p>
                <p className="text-[10px]" style={{color:"#5a78a8"}}>{visibleMarkers.length} locations visible</p>
              </div>
              <button onClick={()=>setPage("Virtual Queue")} className="px-3 py-1.5 rounded-xl text-xs font-bold text-white shrink-0" style={{background:`linear-gradient(135deg,${BLUE},${BLUE2})`}}>
                Queue
              </button>
            </div>
          </div>

          {/* Route CSS animation */}
          <style>{`@keyframes dashRoute { to { stroke-dashoffset: -6.5; } }`}</style>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════════════════
function Footer({ setPage }: { setPage:(p:string)=>void }) {
  return (
    <footer style={{background:"#f0f5ff",borderTop:"1px solid rgba(26,110,245,0.1)"}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <button onClick={()=>setPage("Home")} className="text-2xl font-black mb-3" style={{fontFamily:"'Exo 2',sans-serif"}}>
            <span style={{color:BLUE}}>Thrill</span><span style={{color:"#0d1f3c"}}>verse</span>
          </button>
          <p className="text-sm leading-relaxed" style={{color:"#5a78a8"}}>India's most thrilling AI-powered amusement park. 17 rides. Zero waiting.</p>
          <div className="flex gap-2 mt-4">
            {["𝕏","f","▶","📷"].map(s=><button key={s} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-white" style={{border:`1px solid ${BLUE}22`,color:BLUE}}>{s}</button>)}
          </div>
        </div>
        {[
          {title:"Explore",  links:[["All Rides","Explore"],["Virtual Queue","Virtual Queue"],["Park Map","Explore"],["Shows","Home"]]},
          {title:"Services", links:[["Tickets","Tickets"],["Fast Pass","Tickets"],["Food","Food"],["Merchandise","Merchandise"]]},
          {title:"Support",  links:[["Help Center","Home"],["Accessibility","Profile"],["Contact Us","Home"],["Emergency","Home"]]},
        ].map(({title,links})=>(
          <div key={title}>
            <p className="font-bold text-sm mb-3" style={{fontFamily:"'Exo 2',sans-serif",color:"#1a3a6e"}}>{title}</p>
            <ul className="flex flex-col gap-2">
              {links.map(([label,p])=><li key={label}><button onClick={()=>setPage(p)} className="text-sm transition-colors hover:text-[#1a6ef5]" style={{color:"#5a78a8"}}>{label}</button></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs" style={{borderTop:"1px solid rgba(26,110,245,0.08)",color:"#5a78a8"}}>
        <span>© 2025 ThrillVerse. All rights reserved.</span>
        <span>Privacy · Terms · Cookies</span>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage]       = useState("Home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(()=>{
    const onScroll=()=>setScrolled(window.scrollY>60);
    window.addEventListener("scroll",onScroll);
    return ()=>window.removeEventListener("scroll",onScroll);
  },[]);

  useEffect(()=>{ window.scrollTo({top:0,behavior:"smooth"}); },[page]);

  const showStatus = !["Home","Park Map","Attractions"].includes(page);

  return (
    <div className="min-h-screen bg-white text-foreground" style={{fontFamily:"'Inter',sans-serif"}}>
      <Navbar page={page} setPage={setPage} scrolled={scrolled}/>
      <div className={showStatus ? "pt-16":"pt-0"}>
        {showStatus && <StatusBar/>}
        {page==="Home"          && <HomePage         setPage={setPage}/>}
        {page==="Explore"       && <ExplorePage      setPage={setPage}/>}
        {page==="Virtual Queue" && <VirtualQueuePage/>}
        {page==="Tickets"       && <TicketsPage/>}
        {page==="Rewards"       && <RewardsPage/>}
        {page==="Attractions"   && <AttractionsPage    setPage={setPage}/>}
        {page==="Park Map"      && <ParkMapPage       setPage={setPage}/>}
        {page==="Profile"       && <ProfilePage      setPage={setPage}/>}
      </div>
      {page!=="Home" && page!=="Park Map" && page!=="Attractions" && <Footer setPage={setPage}/>}
      <BottomNav page={page} setPage={setPage}/>
    </div>
  );
}
