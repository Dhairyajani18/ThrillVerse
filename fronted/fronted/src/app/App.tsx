import { useState, useEffect, useRef } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";
import { notifyAuthSuccess } from "./utils/toast";
import happyTuesdayImg from "@/imports/image-2.png";
import byeByeExamsImg from "@/imports/image-3.png";
import familyFunImg from "@/imports/image-4.png";
import watAWednesdayImg from "@/imports/image-8.png";
import adventureSavingsImg from "@/imports/image-5.png";
import snowParkImg from "@/imports/image-7.png";
import monsoonImg from "@/imports/monsoon_magic.png";
import goldenHourPassImg from "@/imports/golden_hour_pass.jpg";
import offersBannerImg from "@/imports/offers_banner.png";
import char10Img from "@/imports/image-10.png";
import char11Img from "@/imports/image-11.png";
import char12Img from "@/imports/image-12.png";
import tubbbyImg from "@/imports/image-13.png";
import bowWowImg from "@/imports/image-14.png";
import rajasaurusImg from "@/imports/image-15.png";
import neeraImg from "@/imports/image-16.png";
import nitroImg from "@/assets/nitro.jpg";
import screamImg from "@/assets/scream_machine.jpg";
import dropImg from "@/assets/dare_2_drop.jpg";
import spacexImg from "@/assets/spacex.jpg";
import dinoImg from "@/assets/dino_splashdown.jpg";
import splashAhoyImg from "@/assets/splash_ahoy.jpg";
import cinema360Img from "@/assets/cinema_360.jpg";
import chaiSpinImg from "@/assets/chai_spin_chaos.jpg";
import miniFallImg from "@/assets/mini_fall.jpg";
import alibabaImg from "@/assets/alibaba.jpg";
import bhangarhImg from "@/assets/bhangarh.jpg";
import wrathImg from "@/assets/wrath_of_the_gods.jpg";
import carouselImg from "@/assets/magic_carousel.jpg";
import chhotaBheemImg from "@/assets/chhota_bheem.jpg";
import goldRushImg from "@/assets/gold_rush_express.jpg";
import elephantRideImg from "@/assets/elephant_ride.png";
import pizzaPalaceMenuImg from "@/assets/pizza_palace_menu.png";
import burgerBayMenuImg from "@/assets/burger_bay.png";
import spiceArenaMenuImg from "@/assets/spice_Arena.png";
import splashCafeMenuImg from "@/assets/splash_cafe.png";
import acrobatsImg from "@/assets/acrobats.png";
import bhangraBoysImg from "@/assets/bhangra_boys.png";
import {
  Menu, X, Bell, Search, ChevronRight, Star, Clock, Users, Zap, MapPin,
  Ticket, Gift, Home, Compass, Award, ArrowRight, TrendingUp, CloudSun,
  Wind, Droplets, AlertCircle, CheckCircle, Play, Volume2, Bot, ThumbsUp,
  Navigation, ChevronDown, Flame, Sparkles, ShoppingCart, Heart, Plus,
  Minus, Trash2, Filter, SlidersHorizontal, Package, User, Phone, Mail,
  Lock, Globe, Accessibility, Settings, LogOut, Trophy, Target, Cpu,
  QrCode, Download, Share2, RefreshCw, ChevronLeft, MoreHorizontal,
  Utensils, ShoppingBag, BarChart2, Check, Info, CreditCard, Tag
} from "lucide-react";
import VirtualMap from "./components/map/VirtualMap";
import VirtualQueuePage from "./components/queue/VirtualQueuePage";
import CheckoutPage from "./components/booking/CheckoutPage";
import AdminDashboard from "./components/booking/AdminDashboard";

export const PAGES = {
  HOME: "Home",
  ATTRACTIONS: "Attractions",
  EXPLORE: "Explore",
  VIRTUAL_QUEUE: "Virtual Queue",
  PARK_MAP: "Park Map",
  TICKETS: "Tickets & Offers",
  PROFILE: "Profile",
  CHECKOUT: "Checkout",
  ADMIN: "Admin Panel",
} as const;


const OFFERS_LIST = [
  { title: "Monsoon Magic at ThrillVerse", price: 999 },
  { title: "Happy Tuesday", price: 999 },
  { title: "Wat-A-Wednesday", price: 799 },
  { title: "Bye Bye Exams", price: 749 },
  { title: "Adventure & Savings", price: 999 },
  { title: "Snow Park Ticket", price: 499 }
];

// ─── Palette ────────────────────────────────────────────────────────────────
const BLUE = "#1a6ef5";
const BLUE2 = "#0052cc";
const CYAN = "#06b6d4";
const INDIGO = "#6366f1";
const GREEN = "#10b981";
const ORANGE = "#f97316";
const AMBER = "#f59e0b";
const RED = "#ef4444";
const PURPLE = "#8b5cf6";

const IMG = {
  hero: "https://images.unsplash.com/photo-1601930113377-729966035f34?w=1800&h=900&fit=crop&auto=format",
  nitro: nitroImg,
  scream: screamImg,
  drop: dropImg,
  spacex: spacexImg,
  dino: dinoImg,
  splashAhoy: splashAhoyImg,
  chaiSpin: chaiSpinImg,
  cinema360: cinema360Img,
  miniFall: miniFallImg,
  alibaba: alibabaImg,
  bhangarh: bhangarhImg,
  wrath: wrathImg,
  carousel: carouselImg,
  chhotaBheem: chhotaBheemImg,
  goldRush: goldRushImg,
  elephantRide: elephantRideImg,
  roller: "https://images.unsplash.com/photo-1547675960-7634cf1b0856?w=600&h=400&fit=crop&auto=format",
  water: "https://images.unsplash.com/photo-1760281487360-68bf06368e6d?w=600&h=400&fit=crop&auto=format",
  ferris: "https://images.unsplash.com/photo-1692301311188-bda319576dd1?w=600&h=400&fit=crop&auto=format",
  neon: "https://images.unsplash.com/photo-1761501638917-f6fb28a84adb?w=600&h=400&fit=crop&auto=format",
  swing: "https://images.unsplash.com/photo-1460176449511-ff5fc8e64c35?w=600&h=400&fit=crop&auto=format",
  splash: "https://images.unsplash.com/photo-1631800744177-0e434940e0c8?w=600&h=400&fit=crop&auto=format",
  coaster: "https://images.unsplash.com/photo-1536302996699-caceffbc68df?w=600&h=400&fit=crop&auto=format",
  tower: "https://images.unsplash.com/photo-1668593107037-836e886119fc?w=600&h=400&fit=crop&auto=format",
};

// ─── All 16 Rides ────────────────────────────────────────────────────────────
const ALL_RIDES = [
  // Thriller
  { id: 1, name: "Nitro", category: "Thriller", img: IMG.nitro, wait: 45, rating: 4.9, thrill: 5, duration: "2 min", height: "120 cm", age: "12+", visitors: 148, status: "open", zone: "Zone A", fastPass: true },
  { id: 2, name: "Scream Machine", category: "Thriller", img: IMG.scream, wait: 35, rating: 4.8, thrill: 5, duration: "2 min", height: "130 cm", age: "14+", visitors: 203, status: "open", zone: "Zone A", fastPass: true },
  { id: 3, name: "SpaceX", category: "Thriller", img: IMG.spacex, wait: 28, rating: 4.7, thrill: 5, duration: "1 min", height: "125 cm", age: "14+", visitors: 176, status: "open", zone: "Zone A", fastPass: false },
  { id: 4, name: "Dare 2 Drop", category: "Thriller", img: IMG.drop, wait: 40, rating: 4.6, thrill: 5, duration: "2 min", height: "120 cm", age: "12+", visitors: 132, status: "open", zone: "Zone A", fastPass: true },
  // Water
  { id: 5, name: "Dino Splashdown", category: "Water", img: IMG.dino, wait: 28, rating: 4.7, thrill: 4, duration: "3 min", height: "110 cm", age: "10+", visitors: 132, status: "open", zone: "Zone B", fastPass: true },
  { id: 6, name: "Splash Ahoy!", category: "Water", img: IMG.splashAhoy, wait: 22, rating: 4.6, thrill: 3, duration: "4 min", height: "100 cm", age: "8+", visitors: 89, status: "open", zone: "Zone B", fastPass: false },
  // Family
  { id: 7, name: "Gold Rush Express", category: "Family", img: IMG.goldRush, wait: 15, rating: 4.4, thrill: 2, duration: "5 min", height: "90 cm", age: "5+", visitors: 87, status: "open", zone: "Zone C", fastPass: false },
  { id: 8, name: "Alibaba Aur Chalis Chorr", category: "Family", img: IMG.alibaba, wait: 25, rating: 4.5, thrill: 2, duration: "8 min", height: "80 cm", age: "4+", visitors: 94, status: "open", zone: "Zone C", fastPass: false },
  { id: 9, name: "Bhangarh: The Curse", category: "Family", img: IMG.bhangarh, wait: 12, rating: 4.5, thrill: 2, duration: "8 min", height: "All", age: "All", visitors: 94, status: "open", zone: "Zone C", fastPass: false },
  { id: 10, name: "Chai Spin Chaos", category: "Family", img: IMG.chaiSpin, wait: 10, rating: 4.3, thrill: 1, duration: "5 min", height: "All", age: "All", visitors: 94, status: "open", zone: "Zone C", fastPass: false },
  { id: 11, name: "Wrath of the Gods", category: "Family", img: IMG.wrath, wait: 30, rating: 4.7, thrill: 3, duration: "15 min", height: "100 cm", age: "8+", visitors: 120, status: "open", zone: "Zone C", fastPass: true },
  { id: 12, name: "Magic Carousel", category: "Family", img: IMG.carousel, wait: 5, rating: 4.3, thrill: 1, duration: "6 min", height: "All", age: "3+", visitors: 62, status: "open", zone: "Zone C", fastPass: false },
  // Kids
  { id: 13, name: "Chhota Bheem – The Ride", category: "Kids", img: IMG.chhotaBheem, wait: 10, rating: 4.2, thrill: 1, duration: "3 min", height: "All", age: "2+", visitors: 44, status: "open", zone: "Zone D", fastPass: false },
  { id: 14, name: "Elephant Ride", category: "Kids", img: IMG.elephantRide, wait: 5, rating: 4.1, thrill: 1, duration: "5 min", height: "All", age: "2+", visitors: 52, status: "open", zone: "Zone D", fastPass: false },
  { id: 15, name: "Mini Fall", category: "Kids", img: IMG.miniFall, wait: 15, rating: 4.3, thrill: 2, duration: "4 min", height: "All", age: "4+", visitors: 68, status: "open", zone: "Zone D", fastPass: false },
  { id: 16, name: "Cinema 360 – Prince of the Dark Waters", category: "Kids", img: IMG.cinema360, wait: 10, rating: 4.5, thrill: 2, duration: "10 min", height: "All", age: "4+", visitors: 80, status: "open", zone: "Zone D", fastPass: false },
];

const FOODS = [
  { id: 1, name: "Masala Burger", cat: "Fast Food", price: 180, rating: 4.5, img: IMG.swing, wait: "8 min", popular: true },
  { id: 2, name: "Pepperoni Pizza", cat: "Italian", price: 320, rating: 4.7, img: IMG.ferris, wait: "12 min", popular: true },
  { id: 3, name: "Grilled Chicken", cat: "Grill", price: 280, rating: 4.6, img: IMG.swing, wait: "10 min", popular: false },
  { id: 4, name: "Mango Smoothie", cat: "Beverages", price: 120, rating: 4.8, img: IMG.water, wait: "3 min", popular: true },
  { id: 5, name: "Veg Thali", cat: "Indian", price: 220, rating: 4.4, img: IMG.roller, wait: "15 min", popular: false },
  { id: 6, name: "Cheese Fries", cat: "Fast Food", price: 140, rating: 4.5, img: IMG.splash, wait: "5 min", popular: true },
];

const MERCH = [
  { id: 1, name: "ThrillVerse Tee", cat: "Clothing", price: 599, rating: 4.6, img: IMG.swing, liked: false },
  { id: 2, name: "Roller Coaster Cap", cat: "Clothing", price: 349, rating: 4.4, img: IMG.ferris, liked: true },
  { id: 3, name: "Park Keychain", cat: "Souvenirs", price: 149, rating: 4.7, img: IMG.neon, liked: false },
  { id: 4, name: "Thrillverse Mug", cat: "Souvenirs", price: 299, rating: 4.5, img: IMG.splash, liked: false },
  { id: 5, name: "Adventure Backpack", cat: "Bags", price: 999, rating: 4.8, img: IMG.roller, liked: true },
  { id: 6, name: "Kids Plushie Set", cat: "Toys", price: 449, rating: 4.9, img: IMG.swing, liked: false },
];

const ACHIEVEMENTS = [
  { id: 1, title: "Speed Demon", desc: "Complete 5 Thriller rides", xp: 200, done: true, icon: "⚡" },
  { id: 2, title: "Water Baby", desc: "Try all 4 Water rides", xp: 150, done: true, icon: "🌊" },
  { id: 3, title: "Queue Master", desc: "Use Virtual Queue 10 times", xp: 100, done: false, icon: "🎟️" },
  { id: 4, title: "Foodie", desc: "Order from 3 restaurants", xp: 80, done: false, icon: "🍔" },
  { id: 5, title: "Park Explorer", desc: "Visit all 4 zones", xp: 120, done: true, icon: "🗺️" },
  { id: 6, title: "Social Thrill", desc: "Invite 3 friends", xp: 200, done: false, icon: "👥" },
];

const LEADERBOARD = [
  { rank: 1, name: "Arjun Mehta", xp: 4820, badge: "👑", rides: 34 },
  { rank: 2, name: "Priya Sharma", xp: 4210, badge: "🥈", rides: 29 },
  { rank: 3, name: "Rahul Verma", xp: 3980, badge: "🥉", rides: 27 },
  { rank: 4, name: "You", xp: 2450, badge: "🎢", rides: 18, isMe: true },
  { rank: 5, name: "Sneha Patel", xp: 2310, badge: "⭐", rides: 16 },
];

// ─── Category colors ─────────────────────────────────────────────────────────
const catStyle: Record<string, { bg: string; text: string }> = {
  Thriller: { bg: "#fff0ea", text: ORANGE },
  Water: { bg: "#e0f9ff", text: CYAN },
  Family: { bg: "#eef2ff", text: INDIGO },
  Kids: { bg: "#f0fdf4", text: GREEN },
};

// ─── Ride extra details (description, safety, capacity) ──────────────────────
const RIDE_DETAILS: Record<number, { description: string; safety: string[]; capacity: number; minAge: string }> = {
  1: {
    description: "Nitro is ThrillVerse's flagship hyper-coaster — a steel behemoth that rockets you from 0 to 100 km/h in under 3 seconds. Featuring four inversions, a 90-metre drop, and relentless airtime hills, it's the ultimate thrill for coaster enthusiasts.",
    safety: ["Must be at least 120 cm tall", "Secure all loose articles before boarding", "Not suitable for guests with heart conditions, back/neck issues, or pregnancy", "Keep arms and legs inside the vehicle at all times", "Guests with motion sickness are advised to reconsider"],
    capacity: 24,
    minAge: "12+",
  },
  2: {
    description: "Scream Machine is an inverted coaster where your legs dangle freely as you twist through seven inversions at 95 km/h. The signature 'scream tunnel' at the finale is unforgettable.",
    safety: ["Must be at least 130 cm tall", "Secure all loose articles including glasses and hats", "Not suitable for guests with heart, neck, or back conditions", "No pregnant guests", "Guests prone to motion sickness should exercise caution"],
    capacity: 30,
    minAge: "14+",
  },
  3: {
    description: "SpaceX simulates a rocket launch with a vertical spike that sends you 60 metres skyward before free-falling back down at 100 km/h. Gravity has never felt so real.",
    safety: ["Must be at least 125 cm tall", "Remove all loose items — secure storage provided", "Not suitable for heart, neck, or back conditions", "Pregnant guests cannot ride", "Guests with fear of heights are advised to reconsider"],
    capacity: 20,
    minAge: "14+",
  },
  4: {
    description: "Dare 2 Drop is a free-fall tower that lifts you 55 metres above the park for a 360° panoramic view — then drops you in total silence before the world rushes back at 90 km/h.",
    safety: ["Must be at least 120 cm tall", "Secure all loose articles and empty pockets before boarding", "Not suitable for heart or back conditions", "Pregnant guests cannot ride", "May not be suitable for guests with extreme fear of heights"],
    capacity: 24,
    minAge: "12+",
  },
  5: {
    description: "Dino Splashdown is a log-flume adventure through a prehistoric jungle. Drift past roaring animatronic dinosaurs before a dramatic final plunge that guarantees a soaking.",
    safety: ["Must be at least 110 cm tall", "Expect to get very wet — waterproof bags available at the entrance", "Secure loose articles in the provided storage nets", "Not suitable for guests with back conditions", "Pregnant guests should avoid this ride"],
    capacity: 24,
    minAge: "10+",
  },
  6: {
    description: "Splash Ahoy! is a rapid-river raft ride that spins you through rushing whitewater channels and under surprise water cannons. Perfect for cooling off on a hot day.",
    safety: ["Must be at least 100 cm tall", "All guests will get wet — secure electronics in waterproof pouches", "Distribute weight evenly in the raft", "Not recommended for guests with back conditions", "Pregnant guests are not permitted"],
    capacity: 16,
    minAge: "8+",
  },
  7: {
    description: "Gold Rush Express is a family mine-train coaster that weaves through tunnels and banked turns at a thrilling-yet-accessible speed. Great as a first coaster for older kids.",
    safety: ["Must be at least 90 cm tall", "Secure loose articles before boarding", "Younger children must be accompanied by an adult", "Not suitable for guests with recent surgery or serious back conditions", "Guests with extreme motion sickness should consult with staff"],
    capacity: 30,
    minAge: "5+",
  },
  8: {
    description: "Alibaba Aur Chalis Chorr is an enchanting dark ride through the tales of the Arabian Nights. Motion effects and vivid scenes make it a magical journey for the whole family.",
    safety: ["Must be at least 80 cm tall", "Young children must sit with a guardian", "Mild motion effects — not suitable for guests with severe motion sickness", "Strobe lighting effects are used inside; those with photosensitive epilepsy should take note", "Keep all limbs inside the vehicle"],
    capacity: 50,
    minAge: "4+",
  },
  9: {
    description: "Bhangarh: The Curse is an immersive haunted-house dark ride set in the legendary ruins of Bhangarh Fort. Expect jump scares, atmospheric lighting, and bone-chilling audio.",
    safety: ["No height requirement — open to all ages", "Parental discretion advised for very young or easily frightened children", "Strobe lighting and loud sudden sounds used throughout", "Not recommended for guests with anxiety disorders or photosensitive conditions", "Service animals are not permitted on this attraction"],
    capacity: 40,
    minAge: "All ages",
  },
  10: {
    description: "Chai Spin Chaos is a spinning teacup ride with a desi twist — oversized chai cups that you can control yourself. A gentle, fun classic that the whole family will love.",
    safety: ["No height requirement — open to all ages", "Young children must be accompanied by an adult", "Guests who control the spinning wheel should do so gradually", "Not recommended for guests with severe motion sickness", "Remain seated and hold the safety bar at all times"],
    capacity: 46,
    minAge: "All ages",
  },
  11: {
    description: "Wrath of the Gods is a theatre-based simulator that seats you inside a moving platform for an epic 15-minute battle between ancient deities. Stunning 4D effects, wind, and mist complete the experience.",
    safety: ["Must be at least 100 cm tall", "Young children must sit with a guardian", "4D effects include wind blasts, mist, and sudden movement", "Not suitable for guests with motion sickness, heart conditions, or back problems", "Strobe lighting is used during the storm sequence"],
    capacity: 50,
    minAge: "8+",
  },
  12: {
    description: "Magic Carousel is a beautifully restored classic merry-go-round adorned with hand-painted horses and twinkling lights. A timeless, gentle ride perfect for toddlers and nostalgic adults alike.",
    safety: ["No height requirement — suitable from age 3+", "Very young children must be accompanied by a parent or guardian", "Ensure children are securely seated before the ride begins", "Guests must remain seated throughout the ride", "Standing passengers are not permitted"],
    capacity: 40,
    minAge: "3+",
  },
  13: {
    description: "Chhota Bheem – The Ride takes young guests on a colourful adventure with everyone's favourite cartoon hero. Interactive screens and gentle motion make it perfect for toddlers.",
    safety: ["No height requirement — suitable from age 2+", "Infants and young children must be accompanied by a parent", "Lap bars must be secured before the ride begins", "Mild motion and bright audio-visual effects", "Not recommended for children with sensory sensitivities"],
    capacity: 30,
    minAge: "2+",
  },
  14: {
    description: "Elephant Ride offers gentle, guided circuits on beautifully decorated mechanical elephants through the Kids Zone. A serene and memorable experience for the little ones.",
    safety: ["No height requirement — suitable from age 2+", "Young children must be accompanied by a parent or guardian", "Hold the safety handle at all times", "Do not stand or lean outside the seating area", "Animals are not permitted near the ride area"],
    capacity: 30,
    minAge: "2+",
  },
  15: {
    description: "Mini Fall is a scaled-down drop tower designed specifically for children. It rises gently to 10 metres before a soft, controlled drop — the perfect introduction to thrill rides.",
    safety: ["No height requirement — suitable from age 4+", "Children under 8 must be accompanied by an adult", "Secure loose clothing and accessories before boarding", "Not recommended for children with heart conditions", "Guests must remain seated and hold the safety bar"],
    capacity: 30,
    minAge: "4+",
  },
  16: {
    description: "Cinema 360 – Prince of the Dark Waters is an immersive 360° dome cinema experience. Sit back as the story of a mythical underwater prince unfolds all around you in stunning 4K projection.",
    safety: ["No height requirement — suitable from age 4+", "Guests with severe visual impairments should be accompanied", "No flash photography inside the dome", "Strobe and flickering light effects are used in select scenes", "Guests with photosensitive epilepsy should consult staff before entering"],
    capacity: 80,
    minAge: "4+",
  },
};

// ─── Thrill dots ──────────────────────────────────────────────────────────────
const ThrillDots = ({ level }: { level: number }) => (
  <div className="flex gap-1">
    {Array.from({ length: 5 }, (_, i) => (
      <span key={i} className="w-2 h-2 rounded-full" style={{ background: i < level ? ORANGE : "#fde8d8" }} />
    ))}
  </div>
);

// ─── Shared Navbar ────────────────────────────────────────────────────────────
function Navbar({ page, setPage, scrolled, onBookNowClick }: { page: string; setPage: (p: string) => void; scrolled: boolean; onBookNowClick: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { isAuthenticated, userProfile, logout } = useAuth();

  const baseNavLinks = [PAGES.HOME, PAGES.ATTRACTIONS, PAGES.EXPLORE, PAGES.VIRTUAL_QUEUE, PAGES.PARK_MAP, PAGES.TICKETS];
  const navLinks = userProfile?.role?.toLowerCase() === "admin" ? [...baseNavLinks, PAGES.ADMIN] : baseNavLinks;

  const getInitials = () => {
    const fn = userProfile?.full_name || userProfile?.user?.first_name || userProfile?.first_name || localStorage.getItem("first_name") || "";
    const un = userProfile?.username || userProfile?.user?.username || localStorage.getItem("username") || "";
    if (fn) return fn.trim()[0].toUpperCase();
    if (un) return un.trim()[0].toUpperCase();
    return "U";
  };

  const handleProfileClick = () => {
    setPage(PAGES.PROFILE);
    setProfileDropdownOpen(prev => !prev);
  };

  const handleDropdownItemClick = (targetPage: string) => {
    setPage(targetPage);
    setProfileDropdownOpen(false);
  };

  const handleNavbarLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    setPage(PAGES.HOME);
    notifyAuthSuccess("logout");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.88)",
        backdropFilter: "blur(16px)",
        borderBottom: scrolled ? "1px solid rgba(26,110,245,0.12)" : "none",
        boxShadow: scrolled ? "0 2px 20px rgba(26,110,245,0.08)" : "none",
      }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <button onClick={() => setPage(PAGES.HOME)} className="text-2xl font-black tracking-tight shrink-0 cursor-pointer" style={{ fontFamily: "'Exo 2',sans-serif" }}>
          <span style={{ color: BLUE }}>Thrill</span><span style={{ color: "#0d1f3c" }}>verse</span>
        </button>

        <nav className="hidden lg:flex items-center gap-0.5">
          {navLinks.map(link => (
            <button key={link} onClick={() => setPage(link)}
              className="px-3 py-1.5 rounded-xl text-sm transition-all duration-200 cursor-pointer"
              style={{ color: page === link ? BLUE : "#5a78a8", background: page === link ? "#eef4ff" : "transparent", fontWeight: page === link ? 700 : 500 }}>
              {link}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#eef4ff] transition-colors cursor-pointer"
            style={{ border: "1px solid rgba(26,110,245,0.15)" }} onClick={() => setNotifOpen(v => !v)}>
            <Bell size={15} style={{ color: "#5a78a8" }} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: ORANGE }} />
          </button>

          <button onClick={onBookNowClick}
            className="hidden sm:flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-blue-200 cursor-pointer"
            style={{ background: `linear-gradient(135deg,${BLUE},${BLUE2})` }}>
            <Ticket size={13} /> Book Now
          </button>

          {/* Dynamic Avatar / Profile Button or Sign In Link */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={handleProfileClick}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#eef4ff] transition-all select-none cursor-pointer"
                style={{ border: "1px solid rgba(26,110,245,0.15)" }}
              >
                {userProfile && userProfile.profile_picture ? (
                  <img src={userProfile.profile_picture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full bg-[#1a6ef5] flex items-center justify-center text-white text-xs font-bold font-poppins">
                    {getInitials()}
                  </div>
                )}
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute top-11 right-0 w-44 rounded-2xl overflow-hidden shadow-2xl z-50 bg-white border border-slate-100 p-1 flex flex-col gap-0.5">
                  <button onClick={() => handleDropdownItemClick(PAGES.PROFILE)} className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold text-[#0d1f3c] hover:bg-blue-50/50 hover:text-blue-600 transition-colors cursor-pointer">
                    My Profile
                  </button>
                  <button onClick={() => handleDropdownItemClick(PAGES.TICKETS)} className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold text-[#0d1f3c] hover:bg-blue-50/50 hover:text-blue-600 transition-colors cursor-pointer">
                    My Tickets
                  </button>
                  {userProfile?.role?.toLowerCase() === "admin" && (
                    <button onClick={() => handleDropdownItemClick(PAGES.ADMIN)} className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold text-blue-600 bg-blue-50/60 hover:bg-blue-100/60 transition-colors flex items-center gap-1.5 cursor-pointer">
                      <Shield size={13} /> Admin Panel
                    </button>
                  )}
                  <div className="h-px bg-slate-100 my-1 mx-2" />
                  <button onClick={handleNavbarLogout} className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50/50 transition-colors cursor-pointer">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setPage(PAGES.VIRTUAL_QUEUE)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold transition-colors hover:text-blue-600"
              style={{ color: "#5a78a8" }}
            >
              <User size={16} />
              Sign In
            </button>
          )}

          <button className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center"
            style={{ border: "1px solid rgba(26,110,245,0.15)" }} onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? <X size={15} style={{ color: "#5a78a8" }} /> : <Menu size={15} style={{ color: "#5a78a8" }} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden px-4 pb-4 flex flex-col gap-1 bg-white border-t" style={{ borderColor: "rgba(26,110,245,0.08)" }}>
          {navLinks.map(link => (
            <button key={link} onClick={() => { setPage(link); setMobileOpen(false); }}
              className="text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ color: page === link ? BLUE : "#5a78a8", background: page === link ? "#eef4ff" : "transparent" }}>
              {link}
            </button>
          ))}
          {isAuthenticated ? (
            <>
              <button onClick={() => { setPage(PAGES.PROFILE); setMobileOpen(false); }}
                className="text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ color: page === PAGES.PROFILE ? BLUE : "#5a78a8", background: page === PAGES.PROFILE ? "#eef4ff" : "transparent" }}>
                My Profile
              </button>
              <button onClick={() => { setPage(PAGES.TICKETS); setMobileOpen(false); }}
                className="text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ color: page === PAGES.TICKETS ? BLUE : "#5a78a8", background: page === PAGES.TICKETS ? "#eef4ff" : "transparent" }}>
                My Tickets
              </button>
              {userProfile?.role?.toLowerCase() === "admin" && (
                <button onClick={() => { setPage(PAGES.ADMIN); setMobileOpen(false); }}
                  className="text-left px-4 py-2.5 rounded-xl text-sm font-bold text-blue-600 bg-blue-50">
                  💼 Admin Panel
                </button>
              )}
              <button onClick={() => { handleNavbarLogout(); setMobileOpen(false); }}
                className="text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-red-600">
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => { setMobileOpen(false); setPage(PAGES.VIRTUAL_QUEUE); }}
              className="text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-blue-600">
              Sign In
            </button>
          )}
        </div>
      )}

      {notifOpen && (
        <div className="absolute top-16 right-4 w-80 rounded-2xl overflow-hidden shadow-2xl z-50 bg-white" style={{ border: "1px solid rgba(26,110,245,0.12)" }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(26,110,245,0.08)" }}>
            <span className="font-bold text-sm" style={{ color: BLUE }}>Notifications</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "#fff0ea", color: ORANGE }}>3 new</span>
          </div>
          {[{ icon: "🎢", text: "Your Queue #12 for Nitro is almost ready!", time: "2m ago" },
          { icon: "🎉", text: "Neon Nights Festival starts in 2 hours!", time: "1h ago" },
          { icon: "🌊", text: "Dino Splashdown wait dropped to 18 min.", time: "3h ago" }
          ].map((n, i) => (
            <div key={i} className="px-4 py-3 flex gap-3 cursor-pointer hover:bg-[#f8faff] transition-colors" style={{ borderBottom: "1px solid rgba(26,110,245,0.05)" }}>
              <span className="text-xl">{n.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs leading-relaxed" style={{ color: "#1a3a6e" }}>{n.text}</p>
                <p className="text-xs mt-0.5" style={{ color: "#5a78a8" }}>{n.time}</p>
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
    <div className="sticky top-16 z-40" style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(26,110,245,0.1)", boxShadow: "0 2px 12px rgba(26,110,245,0.06)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center gap-4 sm:gap-8 text-sm">
        <div className="flex items-center gap-2"><CloudSun size={15} style={{ color: AMBER }} /><span className="font-bold text-[#0d1f3c]">32°C</span><span style={{ color: "#5a78a8" }}>Partly Cloudy</span></div>
        <div className="flex items-center gap-1.5"><Wind size={12} style={{ color: "#5a78a8" }} /><span style={{ color: "#5a78a8" }}>14 km/h</span></div>
        <div className="flex items-center gap-1.5"><Droplets size={12} style={{ color: CYAN }} /><span style={{ color: "#5a78a8" }}>68%</span></div>
        <div className="hidden sm:block h-4 w-px bg-[#dbeafe]" />
        <div className="flex items-center gap-2">
          <Users size={14} style={{ color: BLUE }} />
          <span className="font-bold text-[#0d1f3c]">Moderate</span>
          <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1.5 h-3 rounded-sm" style={{ background: i <= 3 ? BLUE : "#dbeafe" }} />)}</div>
        </div>
        <div className="hidden sm:block h-4 w-px bg-[#dbeafe]" />
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" /><span className="font-bold" style={{ color: "#16a34a" }}>Park Open</span><span style={{ color: "#5a78a8" }}>· Closes 10 PM</span></div>
        <div className="ml-auto hidden md:flex items-center gap-1.5"><TrendingUp size={12} style={{ color: ORANGE }} /><span className="text-xs" style={{ color: "#5a78a8" }}>4,821 visitors today</span></div>
      </div>
    </div>
  );
}

// ─── Mobile Bottom Nav ────────────────────────────────────────────────────────
function BottomNav({ page, setPage, setRedirectToAfterLogin }: { page: string; setPage: (p: string) => void; setRedirectToAfterLogin: (p: string | null) => void }) {
  const { isAuthenticated } = useAuth();

  const tabs = [
    { icon: Home, label: PAGES.HOME },
    { icon: Compass, label: PAGES.EXPLORE },
    { icon: Zap, label: PAGES.VIRTUAL_QUEUE, primary: true },
    { icon: User, label: PAGES.PROFILE },
  ];

  const handleTabClick = (label: string) => {
    if (label === PAGES.PROFILE) {
      if (!isAuthenticated) {
        setRedirectToAfterLogin(PAGES.PROFILE);
        setPage(PAGES.VIRTUAL_QUEUE);
      } else {
        setPage(PAGES.PROFILE);
      }
    } else {
      setPage(label);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:hidden flex z-50 bg-white" style={{ borderTop: "1px solid rgba(26,110,245,0.1)", boxShadow: "0 -4px 20px rgba(26,110,245,0.08)" }}>
      {tabs.map(({ icon: Icon, label, primary }) => (
        <button key={label} onClick={() => handleTabClick(label)} className="flex-1 flex flex-col items-center gap-0.5 py-3">
          {primary ? (
            <div className="w-11 h-11 rounded-full -mt-5 flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg,${BLUE},${BLUE2})`, boxShadow: `0 4px 16px ${BLUE}55` }}>
              <Icon size={20} className="text-white" />
            </div>
          ) : (
            <Icon size={20} style={{ color: page === label ? BLUE : "#b8cce8" }} />
          )}
          <span className="text-[10px] font-semibold" style={{ color: (primary || page === label) ? BLUE : "#b8cce8" }}>{label}</span>
        </button>
      ))}
    </nav>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, accent, sub }: { title: string; accent: string; sub?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-black" style={{ fontFamily: "'Exo 2',sans-serif", color: "#0d1f3c" }}>
        {title.split(" ").map((w, i) => i === title.split(" ").length - 1
          ? <span key={i} style={{ color: accent }}>{w} </span>
          : <span key={i}>{w} </span>
        )}
      </h1>
      {sub && <p className="text-sm mt-1" style={{ color: "#5a78a8" }}>{sub}</p>}
    </div>
  );
}

// ─── FAQ Datasets & Component ─────────────────────────────────────────────
interface FaqItem {
  q: string;
  a: string;
}

const HOME_FAQS: FaqItem[] = [
  {
    q: "What are the opening and closing hours of ThrillVerse Park?",
    a: "ThrillVerse Park is open daily from 9:00 AM to 9:00 PM. Water park attractions operate from 10:00 AM to 6:00 PM. Special night parades and fireworks run until 9:30 PM."
  },
  {
    q: "How does the AI Virtual Queue work to skip physical lines?",
    a: "Our AI-driven Virtual Queue lets you reserve ride slots from your phone. Explore the park or watch live shows while waiting, then scan your QR boarding pass when your turn arrives."
  },
  {
    q: "Are there height and safety restrictions for extreme rides?",
    a: "Yes, safety is our top priority. High-thrill rides like Nitro and Dare 2 Drop require a minimum height of 130 cm. Height meters are available at each ride entrance."
  },
  {
    q: "Is parking available at ThrillVerse Park?",
    a: "Yes, we offer multi-level parking for cars and two-wheelers right at the main entrance gate. VIP Ticket holders receive complimentary valet parking."
  },
  {
    q: "What is the ticket rescheduling and cancellation policy?",
    a: "Tickets can be rescheduled up to 24 hours prior to your visit date free of charge via your Profile page. Unused tickets canceled 48 hours in advance are eligible for a 100% refund."
  }
];

const ATTRACTIONS_FAQS: FaqItem[] = [
  {
    q: "Are live shows like Acrobats and Bhangra Boys included in the general day ticket?",
    a: "Yes! All live street performances, Bhangra Boys dance shows, acrobatics, magic performances, and character meet-and-greets are included at no extra cost with any valid ThrillVerse entry ticket."
  },
  {
    q: "What happens if a ride goes under maintenance or bad weather?",
    a: "Outdoor high-thrill rides may pause temporarily during heavy rain. If you hold an active Virtual Queue ticket for an affected ride, your pass automatically converts to a Priority FastPass for any other open ride."
  },
  {
    q: "Is there a limit to how many Virtual Queues I can join at once?",
    a: "You can hold 1 active Virtual Queue reservation at a time. Once you scan your QR code and board the ride, you can immediately join another ride queue."
  },
  {
    q: "Where can I store personal belongings while riding extreme roller coasters?",
    a: "Secure lockers are available at the entrance of all extreme rides (Nitro, Scream Machine, Dare 2 Drop). Free 45-minute locker access is included with your ride reservation."
  },
  {
    q: "What accessibility facilities are provided for guests with special needs?",
    a: "Wheelchairs are available for rent at the main entrance plaza. All major attraction pathways, show arenas, and restaurants feature wheelchair ramps and accessible seating."
  }
];

const TICKETS_FAQS: FaqItem[] = [
  {
    q: "How do I redeem promo discount codes like 'HAPPYTUES' or 'STUDENT50'?",
    a: "Simply enter the promo code in the 'Apply Coupon' box on the Tickets & Offers page or during checkout. Your discount will instantly apply to the subtotal before payment."
  },
  {
    q: "Are group discounts available for school trips, college groups, or corporate outings?",
    a: "Yes! Groups of 10 or more receive up to 25% off regular day passes. Contact our group booking desk via the Contact Us section for customized packages including meal vouchers."
  },
  {
    q: "What is included in the VIP Express Pass?",
    a: "The VIP Express Pass gives you unlimited fast-track entry to all rides with zero wait time, complimentary valet parking, a ₹500 food & beverage voucher, and reserved front-row seating at live entertainment arenas."
  },
  {
    q: "Do children under 3 years old require an entry ticket?",
    a: "Children below 3 feet (or under 3 years of age) enjoy FREE entry into ThrillVerse Park. Height verification is conducted at the ticket turnstiles."
  },
  {
    q: "Can I transfer my ticket to a friend or family member if I cannot attend?",
    a: "Yes! Tickets are transferable. You can update the ticket holder's name and share the QR code directly from the My Profile page or Tickets tab."
  }
];

function FaqSection({ title, sub, faqs }: { title: string; sub: string; faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-12 bg-slate-50/60 border-t border-slate-100 mt-12 rounded-3xl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-xs font-black tracking-widest text-[#1a6ef5] uppercase bg-[#eef4ff] px-3.5 py-1 rounded-full">Got Questions?</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0d1f3c] tracking-tight mt-3" style={{ fontFamily: "'Exo 2', sans-serif" }}>
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-[#5a78a8] mt-1.5 font-medium max-w-xl mx-auto">
            {sub}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition-all duration-200 hover:border-blue-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm text-[#0d1f3c] cursor-pointer"
                  style={{ fontFamily: "'Exo 2', sans-serif" }}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-50 text-[#1a6ef5] text-xs font-black flex items-center justify-center shrink-0">
                      Q
                    </span>
                    {faq.q}
                  </span>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 bg-blue-50 text-[#1a6ef5]" : "bg-slate-100 text-slate-500"}`}>
                    <ChevronDown size={15} />
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-50">
                    <p className="pl-9">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Restaurant Data ─────────────────────────────────────────────────────────
const RESTAURANTS = [
  {
    id: 1, name: "Spice Arena", cuisine: "Indian", tagline: "Authentic Desi Flavours",
    location: "Near Water Zone · Zone B", wait: "12 min", rating: 4.6, reviews: 342,
    hours: "10:00 AM – 9:30 PM", priceRange: "₹150 – ₹400",
    img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop&auto=format",
    desc: "Authentic Indian street food, thalis and refreshing drinks. Perfect for families after an exciting ride in Zone B.",
    popular: [
      { name: "Masala Thali", price: "₹249", tag: "Best Seller" },
      { name: "Paneer Tikka", price: "₹179", tag: "🌶️ Spicy" },
      { name: "Mango Lassi", price: "₹89", tag: "Refreshing" },
      { name: "Veg Burger", price: "₹129", tag: "Quick Bite" },
    ],
    emoji: "🍛", color: ORANGE, bg: "#fff7f0", menuImg: spiceArenaMenuImg,
  },
  {
    id: 2, name: "Burger Bay", cuisine: "Fast Food", tagline: "Quick & Tasty Bites",
    location: "Main Entrance · Zone A", wait: "5 min", rating: 4.5, reviews: 521,
    hours: "9:00 AM – 10:00 PM", priceRange: "₹80 – ₹350",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop&auto=format",
    desc: "Park's fastest quick-service spot. Juicy burgers, crispy fries and cold shakes — the ideal fuel for thrill seekers.",
    popular: [
      { name: "Classic Smash Burger", price: "₹199", tag: "Fan Favourite" },
      { name: "Cheese Fries", price: "₹129", tag: "Must Try" },
      { name: "Chocolate Shake", price: "₹149", tag: "Bestseller" },
      { name: "Chicken Wrap", price: "₹179", tag: "New! 🆕" },
    ],
    emoji: "🍔", color: AMBER, bg: "#fffbeb", menuImg: burgerBayMenuImg,
  },
  {
    id: 3, name: "Pizza Palace", cuisine: "Italian", tagline: "Wood-Fired Perfection",
    location: "Central Plaza · Zone C", wait: "15 min", rating: 4.7, reviews: 289,
    hours: "11:00 AM – 9:00 PM", priceRange: "₹200 – ₹600",
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop&auto=format",
    desc: "Wood-fired pizzas and fresh pastas in a cozy Italian-themed setting at the heart of the park.",
    popular: [
      { name: "Margherita Pizza", price: "₹299", tag: "Classic" },
      { name: "Pepperoni Blast", price: "₹379", tag: "🔥 Hot Pick" },
      { name: "Pasta Arrabbiata", price: "₹249", tag: "Veg Friendly" },
      { name: "Garlic Bread", price: "₹99", tag: "Best Starter" },
    ],
    emoji: "🍕", color: RED, bg: "#fff5f5", menuImg: pizzaPalaceMenuImg,
  },
  {
    id: 4, name: "Splash Café", cuisine: "Café & Beverages", tagline: "Cool Drinks & Snacks",
    location: "Water Zone Entry · Zone B", wait: "3 min", rating: 4.4, reviews: 198,
    hours: "9:00 AM – 10:00 PM", priceRange: "₹50 – ₹250",
    img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop&auto=format",
    desc: "Refreshing cold drinks, ice creams and light snacks right at the Water Zone entry — perfect post-ride cool down.",
    popular: [
      { name: "Fresh Lemonade", price: "₹79", tag: "Park Favourite" },
      { name: "Ice Cream Sundae", price: "₹129", tag: "Kids Love It" },
      { name: "Cold Coffee", price: "₹99", tag: "Bestseller" },
      { name: "Nachos & Dip", price: "₹149", tag: "Snack Attack" },
    ],
    emoji: "☕", color: CYAN, bg: "#f0fbfe", menuImg: splashCafeMenuImg,
  },
];

const RESTAURANT_MENUS: Record<string, string> = {
  "Spice Arena": spiceArenaMenuImg,
  "Burger Bay": burgerBayMenuImg,
  "Pizza Palace": pizzaPalaceMenuImg,
  "Splash Café": splashCafeMenuImg
};

// ═══════════════════════════════════════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════════════════════════════════════
function HomePage({ setPage, rides, restaurants = RESTAURANTS, setSelectedQueueRide, setSelectedPromo, onBookOfferClick, setSelectedRideDetail }: { setPage: (p: string) => void; rides: any[]; restaurants?: any[]; setSelectedQueueRide: (r: any) => void; setSelectedPromo: (p: any) => void; onBookOfferClick: (offerTitle: string) => void; setSelectedRideDetail: (r: any) => void }) {
  const [expandedOffers, setExpandedOffers] = useState<Record<number, boolean>>({});
  const toggleOfferExpand = (index: number) => {
    setExpandedOffers(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const aiEndRef = useRef<HTMLDivElement>(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMsg, setAiMsg] = useState("");
  const [aiChat, setAiChat] = useState<{ role: string; text: string }[]>([
    { role: "bot", text: "Hi! I'm ThrillBot 🎢 Ask me about wait times, ride picks, food, or the fastest park route!" },
  ]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any | null>(null);
  const [showMenuViewer, setShowMenuViewer] = useState(false);
  const [menuZoom, setMenuZoom] = useState(1);

  useEffect(() => {
    if (aiOpen && aiEndRef.current) aiEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [aiChat, aiOpen]);

  const sendAiMsg = () => {
    if (!aiMsg.trim()) return;
    const msg = aiMsg.trim();
    setAiChat(c => [...c, { role: "user", text: msg }]);
    setAiMsg("");
    setTimeout(() => {
      const map: Record<string, string> = {
        wait: "Shortest wait right now: Magic Carousel at 5 min! Nitro 45 min, Dino Splashdown 28 min.",
        ride: "Based on crowd data: Magic Carousel has minimal wait and great views! For thrills, hit Nitro before 2 PM.",
        food: "Spice Arena near Water Zone: 12-min wait. Burger Bay at the entrance is quickest right now.",
        route: "Best route: Nitro → Splash Ahoy! → Magic Carousel. Saves ~40% walking.",
      };
      const lower = msg.toLowerCase();
      const reply = map[Object.keys(map).find(k => lower.includes(k)) || ""] ||
        "The park has 16 rides across 4 zones. Crowd level: Moderate. Need ride info, food tips, or an optimised route?";
      setAiChat(c => [...c, { role: "bot", text: reply }]);
    }, 700);
  };

  const topRides = rides.sort((a, b) => b.rating - a.rating).slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-screen min-h-[620px] flex items-center justify-center overflow-hidden">
        <img src={IMG.hero} alt="ThrillVerse swing ride" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom,rgba(0,40,120,0.55) 0%,rgba(0,60,160,0.3) 40%,rgba(0,30,100,0.75) 80%,#fff 100%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 40%,rgba(26,110,245,0.15) 0%,transparent 65%)" }} />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6 text-white" style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.35)", backdropFilter: "blur(8px)" }}>
            <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />Park Open · 9:00 AM – 10:00 PM
          </div>
          <h1 className="text-5xl sm:text-7xl font-black leading-none mb-5 text-white" style={{ fontFamily: "'Exo 2',sans-serif", textShadow: "0 4px 24px rgba(0,40,120,0.5)" }}>
            Feel The <span style={{ color: "#7dd3fc" }}>Thrill</span>
          </h1>
          <p className="text-lg sm:text-xl mb-8 max-w-xl mx-auto text-white/85">
            Live the amusement with ThrillVerse — 17 rides, AI-powered queues, and unforgettable experiences.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => setPage(PAGES.EXPLORE)} className="px-8 py-3.5 rounded-full font-bold text-base text-white transition-all hover:scale-105" style={{ background: `linear-gradient(135deg,${BLUE},${BLUE2})`, boxShadow: `0 8px 28px rgba(26,110,245,0.45)` }}>Explore Now</button>
            <button onClick={() => setPage(PAGES.VIRTUAL_QUEUE)} className="px-8 py-3.5 rounded-full font-bold text-base text-white transition-all hover:bg-white/20" style={{ border: "2px solid rgba(255,255,255,0.5)", backdropFilter: "blur(8px)" }}>Virtual Queue →</button>
          </div>
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {[{ label: "Rides", value: "17" }, { label: "Avg Wait", value: "22 min" }, { label: "Visitors Today", value: "4,821" }].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-black text-white" style={{ fontFamily: "'Exo 2',sans-serif" }}>{s.value}</p>
                <p className="text-xs text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"><ChevronDown size={22} style={{ color: BLUE }} /></div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-28">
        {/* Quick Actions */}
        <section className="py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Zap, label: "Virtual Queue", sub: "Skip the wait", color: BLUE, bg: "#eef4ff", page: PAGES.VIRTUAL_QUEUE },
              { icon: MapPin, label: "Park Map", sub: "Navigate live", color: INDIGO, bg: "#eef2ff", page: PAGES.PARK_MAP },
              { icon: Ticket, label: "My Tickets", sub: "View & scan", color: AMBER, bg: "#fffbeb", page: PAGES.TICKETS },
              { icon: Gift, label: "Offers", sub: "Exclusive deals", color: GREEN, bg: "#f0fdf4", page: "Offers" },
            ].map(({ icon: Icon, label, sub, color, bg, page: p }) => (
              <button key={label} onClick={() => {
                if (p === "Offers") {
                  setPage(PAGES.HOME);
                  setTimeout(() => {
                    document.getElementById("offers-section")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                } else {
                  setPage(p);
                }
              }} className="group flex flex-col items-center gap-2.5 p-5 rounded-2xl transition-all duration-200 hover:scale-105 hover:shadow-lg text-center" style={{ background: bg, border: `1.5px solid ${color}18` }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: `${color}18` }}><Icon size={22} style={{ color }} /></div>
                <div><p className="font-bold text-sm text-[#0d1f3c]">{label}</p><p className="text-xs mt-0.5" style={{ color: "#5a78a8" }}>{sub}</p></div>
              </button>
            ))}
          </div>
        </section>

        {/* Popular Attractions */}
        <section className="py-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-[#0d1f3c]" style={{ fontFamily: "'Exo 2',sans-serif" }}>Popular <span style={{ color: BLUE }}>Attractions</span></h2>
              <p className="text-xs mt-0.5" style={{ color: "#5a78a8" }}>Live wait times · updated every 2 min</p>
            </div>
            <button onClick={() => setPage("Explore")} className="flex items-center gap-1 text-sm font-bold" style={{ color: BLUE }}>View All <ChevronRight size={14} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topRides.map(ride => {
              const cs = catStyle[ride.category] ?? { bg: "#f0f5ff", text: BLUE };
              const isClosed = ride.status === 'closed' || ride.status === 'maintenance' || ride.status === 'paused' || ride.queue_enabled === false;

              return (
                <div key={ride.id} className="group rounded-2xl overflow-hidden bg-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-100 relative" style={{ border: "1.5px solid rgba(26,110,245,0.1)" }}>
                  <div className="relative h-44 overflow-hidden bg-blue-50">
                    <img src={ride.img} alt={ride.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(13,31,60,0.55) 0%,transparent 55%)" }} />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: cs.bg, color: cs.text }}>{ride.category}</span>

                    {ride.status === 'closed' && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-rose-600 text-white shadow-md">
                        CLOSED 🚫
                      </span>
                    )}
                    {ride.status === 'maintenance' && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-500 text-white shadow-md">
                        MAINTENANCE 🛠️
                      </span>
                    )}
                    {(ride.status === 'paused' || ride.queue_enabled === false) && ride.status !== 'closed' && ride.status !== 'maintenance' && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-yellow-500 text-white shadow-md">
                        PAUSED ⏸️
                      </span>
                    )}

                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5"><Clock size={12} className="text-white" /><span className="text-sm font-bold text-white">{isClosed ? "N/A" : `${ride.wait} min`}</span></div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1.5">
                      <h3 className="font-black text-base text-[#0d1f3c]" style={{ fontFamily: "'Exo 2',sans-serif" }}>{ride.name}</h3>
                      <div className="flex items-center gap-1"><Star size={12} fill={AMBER} style={{ color: AMBER }} /><span className="text-sm font-bold" style={{ color: AMBER }}>{ride.rating}</span></div>
                    </div>
                    <div className="flex items-center gap-2 mb-3"><span className="text-xs" style={{ color: "#5a78a8" }}>Thrill</span><ThrillDots level={ride.thrill} /></div>
                    <div className="flex items-center gap-3 text-xs mb-4" style={{ color: "#5a78a8" }}>
                      <span className="flex items-center gap-1"><Users size={10} />{ride.visitors}</span>
                      <span>↑ {ride.height}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        disabled={isClosed}
                        onClick={() => { if (!isClosed) { setSelectedQueueRide(ride); setPage(PAGES.VIRTUAL_QUEUE); } }}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${isClosed
                            ? "bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300 shadow-none opacity-80"
                            : "text-white hover:shadow-md cursor-pointer"
                          }`}
                        style={{ background: isClosed ? "#e2e8f0" : `linear-gradient(135deg,${BLUE},${BLUE2})` }}
                      >
                        {ride.status === 'closed'
                          ? 'Closed 🚫'
                          : ride.status === 'maintenance'
                            ? 'Under Maintenance 🛠️'
                            : isClosed
                              ? 'Queue Paused ⏸️'
                              : 'Join Queue'}
                      </button>
                      <button onClick={() => setSelectedRideDetail(ride)} className="px-3 py-2 rounded-xl text-xs font-bold transition-all hover:bg-[#eef4ff] cursor-pointer" style={{ border: `1.5px solid ${BLUE}22`, color: BLUE }}>Details</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* AI Banner */}
        <section className="py-8">
          <div className="rounded-3xl p-6 sm:p-8 relative overflow-hidden" style={{ background: "linear-gradient(135deg,#eef4ff 0%,#f0f5ff 50%,#e8f0fe 100%)", border: "1.5px solid rgba(26,110,245,0.15)" }}>
            <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full" style={{ background: "radial-gradient(circle,rgba(26,110,245,0.1) 0%,transparent 70%)" }} />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
              <div className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "white", border: `1.5px solid ${BLUE}22` }}>
                <Sparkles size={26} style={{ color: BLUE }} />
              </div>
              <div>
                <p className="text-xs font-bold mb-1 tracking-widest" style={{ color: BLUE }}>AI PARK ASSISTANT</p>
                <h2 className="text-xl font-black text-[#0d1f3c]" style={{ fontFamily: "'Exo 2',sans-serif" }}>ThrillBot Recommendations</h2>
                <p className="text-sm mt-1" style={{ color: "#5a78a8" }}>Based on current crowd data and your ride history:</p>
              </div>
            </div>
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: Flame, label: "Lowest Wait Now", value: "Magic Carousel · 5 min", color: GREEN },
                { icon: Navigation, label: "Optimal Route", value: "Nitro → Dino → Carousel", color: BLUE },
                { icon: ThumbsUp, label: "Top Pick Today", value: "Nitro · 4.9★", color: ORANGE },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="p-4 rounded-2xl bg-white" style={{ border: `1.5px solid ${color}18` }}>
                  <div className="flex items-center gap-2 mb-2"><Icon size={13} style={{ color }} /><span className="text-xs font-bold" style={{ color: "#5a78a8" }}>{label}</span></div>
                  <p className="font-bold text-sm text-[#0d1f3c]">{value}</p>
                </div>
              ))}
            </div>
            <button className="relative z-10 mt-5 flex items-center gap-2 text-sm font-bold transition-all hover:gap-3" style={{ color: BLUE }} onClick={() => setAiOpen(true)}>
              <Bot size={14} /> Chat with ThrillBot <ArrowRight size={14} />
            </button>
          </div>
        </section>

        {/* ── Visit Our Restaurants ── */}
        <section className="py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] mb-1" style={{ color: ORANGE }}>DINE WITH US</p>
              <h2 className="text-3xl font-black text-[#0d1f3c]" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                Visit Our <span style={{ color: ORANGE }}>Restaurants</span>
              </h2>
              <p className="text-sm mt-1" style={{ color: "#5a78a8" }}>4 dining spots · Fresh food · Quick service inside the park</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {restaurants.map(r => {
              const isRestClosed = r.status === 'closed' || r.status === 'maintenance' || r.is_open === false || r.is_active === false;

              return (
                <div key={r.id} className="group rounded-2xl overflow-hidden bg-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-100 relative" style={{ border: "1.5px solid rgba(26,110,245,0.1)" }}>
                  {/* Image */}
                  <div className="relative h-36 overflow-hidden" style={{ background: r.bg }}>
                    <img src={r.img} alt={r.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.45) 0%,transparent 55%)" }} />
                    <span className="absolute top-3 left-3 text-xl drop-shadow">{r.emoji}</span>

                    {r.status === 'closed' && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-600 text-white shadow-md">
                        CLOSED 🚫
                      </span>
                    )}
                    {r.status === 'maintenance' && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500 text-white shadow-md">
                        MAINTENANCE 🛠️
                      </span>
                    )}
                    {!r.status || (r.status !== 'closed' && r.status !== 'maintenance') && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "rgba(255,255,255,0.92)", color: r.color }}>{r.cuisine}</span>
                    )}

                    <div className="absolute bottom-2 left-3 flex items-center gap-1">
                      <Clock size={10} className="text-white" /><span className="text-[11px] font-bold text-white">{isRestClosed ? "N/A" : `${r.wait} wait`}</span>
                    </div>
                  </div>
                  {/* Body */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-0.5">
                      <h3 className="font-black text-base text-[#0d1f3c]" style={{ fontFamily: "'Exo 2',sans-serif" }}>{r.name}</h3>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <Star size={11} fill={AMBER} style={{ color: AMBER }} /><span className="text-xs font-bold" style={{ color: AMBER }}>{r.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs mb-1 font-medium" style={{ color: r.color }}>{r.tagline}</p>
                    <p className="text-[11px] mb-3 flex items-center gap-1" style={{ color: "#5a78a8" }}>
                      <MapPin size={9} />{r.location}
                    </p>
                    {/* Popular item pills */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(r.popular || r.menu_items || []).slice(0, 2).map((item: any) => (
                        <span key={item.name} className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: r.bg, color: r.color }}>{item.name}</span>
                      ))}
                    </div>
                    <button
                      disabled={isRestClosed}
                      onClick={() => !isRestClosed && setSelectedRestaurant(r)}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${isRestClosed
                          ? "bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300 shadow-none opacity-80"
                          : "text-white hover:shadow-md cursor-pointer"
                        }`}
                      style={{ background: isRestClosed ? "#e2e8f0" : `linear-gradient(135deg,${r.color},${r.color}bb)` }}
                    >
                      {r.status === 'closed'
                        ? 'Closed 🚫'
                        : r.status === 'maintenance'
                          ? 'Under Maintenance 🛠️'
                          : 'View Menu & Info →'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Latest Offers & Promotions ── */}
        <section id="offers-section" className="py-8">
          <div className="text-center mb-8">
            <p className="text-xs font-bold tracking-[0.2em] mb-2" style={{ color: BLUE }}>EXCLUSIVE DEALS</p>
            <h2 className="text-3xl font-black text-[#0d1f3c]" style={{ fontFamily: "'Exo 2',sans-serif" }}>
              Latest Offers &amp; <span style={{ color: BLUE }}>Promotions</span>
            </h2>
            <p className="text-sm mt-2" style={{ color: "#5a78a8" }}>Grab the best deals before they expire</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                img: monsoonImg,
                tag: "🌧️ Monsoon Magic",
                tagBg: "#eef4ff", tagColor: BLUE,
                badge: "SAVE 30%",
                badgeBg: BLUE,
                title: "Monsoon Magic at ThrillVerse",
                desc: "Save Upto 30% on Theme Park & Water Park Tickets",
                code: "MONSOON30",
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
                code: "HAPPYTUES",
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
                code: "WATWED799",
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
                code: "STUDENT50",
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
                code: "BUY4GET1",
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
                code: "SNOW499",
                cta: "Explore",
              },
            ].slice(0, 4).map((offer, i) => (
              <div
                key={i}
                className="group rounded-2xl overflow-hidden bg-white transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-100 cursor-pointer flex flex-col justify-between"
                style={{ border: "1.5px solid rgba(26,110,245,0.1)", boxShadow: "0 4px 16px rgba(26,110,245,0.06)" }}
              >
                {/* Image with overlay badges */}
                <div className="relative h-44 overflow-hidden bg-blue-50">
                  <img
                    src={offer.img}
                    alt={offer.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Dark gradient bottom */}
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(13,31,60,0.45) 0%,transparent 55%)" }} />
                  {/* Badge top-right */}
                  <span
                    className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-black text-white tracking-wide"
                    style={{ background: offer.badgeBg, boxShadow: `0 2px 8px ${offer.badgeBg}66` }}
                  >
                    {offer.badge}
                  </span>
                  {/* Tag top-left */}
                  <span
                    className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold"
                    style={{ background: "rgba(255,255,255,0.92)", color: offer.tagColor }}
                  >
                    {offer.tag}
                  </span>
                </div>

                {/* Card body */}
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h3
                      className="font-black text-base text-[#0d1f3c] mb-1"
                      style={{ fontFamily: "'Exo 2',sans-serif" }}
                    >
                      {offer.title}
                    </h3>
                    <p className="text-sm mb-2 leading-relaxed" style={{ color: "#5a78a8" }}>{offer.desc}</p>
                    <p className="text-xs text-slate-700 font-medium mb-4">
                      Promo Code: <span className="bg-amber-100 text-amber-900 font-mono font-bold px-2 py-0.5 rounded border border-amber-300 select-all tracking-wider">{offer.code}</span>
                    </p>
                  </div>

                  <button
                    className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white transition-all hover:gap-3 hover:shadow-md w-full"
                    style={{ background: `linear-gradient(135deg,${BLUE},${BLUE2})` }}
                    onClick={() => onBookOfferClick(offer.title)}
                  >
                    <Zap size={13} /> Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* View all offers CTA */}
          <div className="text-center mt-8">
            <button
              onClick={() => setPage(PAGES.TICKETS)}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold transition-all hover:shadow-lg hover:shadow-blue-200"
              style={{ backgroundColor: "#ffffff", border: `2px solid ${BLUE}`, color: BLUE }}
            >
              View All Offers <ChevronRight size={15} />
            </button>
          </div>
        </section>
      </main>

      {/* ── Restaurant Modal ── */}
      {selectedRestaurant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedRestaurant(null)}>
          <div className="absolute inset-0" style={{ background: "rgba(13,31,60,0.55)", backdropFilter: "blur(10px)" }} />
          <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl bg-white" style={{ maxHeight: "88vh", overflowY: "auto", scrollbarWidth: "none" }} onClick={e => e.stopPropagation()}>
            {/* Hero */}
            <div className="relative h-52 overflow-hidden">
              <img src={selectedRestaurant.img} alt={selectedRestaurant.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.65) 0%,transparent 50%)" }} />
              <button onClick={() => setSelectedRestaurant(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110" style={{ background: "rgba(255,255,255,0.92)" }}>
                <X size={15} style={{ color: "#0d1f3c" }} />
              </button>
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="text-3xl drop-shadow">{selectedRestaurant.emoji}</span>
                <div>
                  <h2 className="text-xl font-black text-white" style={{ fontFamily: "'Exo 2',sans-serif" }}>{selectedRestaurant.name}</h2>
                  <p className="text-xs text-white/80">{selectedRestaurant.tagline}</p>
                </div>
              </div>
            </div>

            <div className="p-5">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: selectedRestaurant.bg, color: selectedRestaurant.color }}>{selectedRestaurant.cuisine}</span>
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: "#fffbeb", color: AMBER }}>
                  <Star size={10} fill={AMBER} />{selectedRestaurant.rating} · {selectedRestaurant.reviews} reviews
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: "#f0fdf4", color: GREEN }}>⏱️ {selectedRestaurant.wait}</span>
              </div>

              <p className="text-sm leading-relaxed mb-5" style={{ color: "#5a78a8" }}>{selectedRestaurant.desc}</p>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                {[
                  { label: "📍 Location", value: selectedRestaurant.location, bold: false },
                  { label: "🕐 Hours", value: selectedRestaurant.hours, bold: false },
                  { label: "⏱️ Wait", value: selectedRestaurant.wait, bold: true, color: GREEN },
                  { label: "💰 Price", value: selectedRestaurant.priceRange, bold: false },
                ].map(({ label, value, bold, color }) => (
                  <div key={label} className="p-3 rounded-xl" style={{ background: "#f0f5ff" }}>
                    <p className="text-[10px] font-bold text-[#0d1f3c] mb-0.5">{label}</p>
                    <p className="text-xs" style={{ color: bold ? (color || "#0d1f3c") : "#5a78a8", fontWeight: bold ? 700 : 400 }}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Popular menu */}
              <h3 className="font-black text-base text-[#0d1f3c] mb-3" style={{ fontFamily: "'Exo 2',sans-serif" }}>🍽️ Popular Items</h3>
              <div className="flex flex-col gap-2 mb-5">
                {(selectedRestaurant.menu_items || []).map((item: any) => (
                  <div key={item.name} className="flex items-center justify-between p-3 rounded-xl" style={{ background: selectedRestaurant.bg, border: `1px solid ${selectedRestaurant.color}20` }}>
                    <div>
                      <p className="text-sm font-bold text-[#0d1f3c]">{item.name}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: `${selectedRestaurant.color}20`, color: selectedRestaurant.color }}>{item.tag}</span>
                    </div>
                    <p className="font-black text-base shrink-0" style={{ fontFamily: "'Exo 2',sans-serif", color: selectedRestaurant.color }}>
                      {typeof item.price === 'number' ? `₹${item.price}` : item.price}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { if ((selectedRestaurant as any).menuImg || (selectedRestaurant as any).menu_img || RESTAURANT_MENUS[selectedRestaurant.name]) { setShowMenuViewer(true); setMenuZoom(1); } }}
                className="w-full py-3 rounded-2xl font-bold text-sm text-white transition-all hover:shadow-lg hover:opacity-90"
                style={{ background: `linear-gradient(135deg,${selectedRestaurant.color},${selectedRestaurant.color}bb)` }}>
                View Full Menu {((selectedRestaurant as any).menuImg || (selectedRestaurant as any).menu_img || RESTAURANT_MENUS[selectedRestaurant.name]) ? "🍽️" : ""}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Menu Image Viewer ── */}
      {showMenuViewer && selectedRestaurant && ((selectedRestaurant as any).menuImg || (selectedRestaurant as any).menu_img || RESTAURANT_MENUS[selectedRestaurant.name]) && (
        <div
          className="fixed inset-0 z-[60] flex flex-col"
          style={{ background: "rgba(6,13,40,0.96)", backdropFilter: "blur(12px)" }}
          onClick={() => { setShowMenuViewer(false); setMenuZoom(1); }}
        >
          {/* Top bar */}
          <div
            className="shrink-0 flex items-center justify-between px-5 py-3"
            style={{ background: "rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedRestaurant.emoji}</span>
              <div>
                <p className="text-sm font-black text-white" style={{ fontFamily: "'Exo 2',sans-serif" }}>{selectedRestaurant.name}</p>
                <p className="text-xs text-white/50">Full Menu</p>
              </div>
            </div>
            {/* Zoom controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMenuZoom(z => Math.max(0.5, parseFloat((z - 0.25).toFixed(2))))}
                className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg transition-all hover:scale-110"
                style={{ background: "rgba(255,255,255,0.12)", color: "white" }}
                title="Zoom out"
              >−</button>
              <span className="text-xs font-bold text-white/70 w-12 text-center">{Math.round(menuZoom * 100)}%</span>
              <button
                onClick={() => setMenuZoom(z => Math.min(3, parseFloat((z + 0.25).toFixed(2))))}
                className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg transition-all hover:scale-110"
                style={{ background: "rgba(255,255,255,0.12)", color: "white" }}
                title="Zoom in"
              >+</button>
              <button
                onClick={() => setMenuZoom(1)}
                className="px-3 h-9 rounded-xl text-xs font-bold transition-all hover:scale-105"
                style={{ background: "rgba(255,255,255,0.12)", color: "white/70" }}
                title="Reset zoom"
              >Reset</button>
              <button
                onClick={() => { setShowMenuViewer(false); setMenuZoom(1); }}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110 hover:bg-red-500/30 ml-2"
                style={{ background: "rgba(255,255,255,0.12)" }}
                title="Close"
              ><X size={16} className="text-white" /></button>
            </div>
          </div>

          {/* Scrollable image area */}
          <div
            className="flex-1 overflow-auto flex items-start justify-center p-6"
            style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.2) transparent" }}
            onClick={e => e.stopPropagation()}
          >
            <img
              src={(selectedRestaurant as any).menuImg || (selectedRestaurant as any).menu_img || RESTAURANT_MENUS[selectedRestaurant.name]}
              alt={`${selectedRestaurant.name} menu`}
              style={{
                transform: `scale(${menuZoom})`,
                transformOrigin: "top center",
                transition: "transform 0.2s ease",
                borderRadius: 16,
                boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
                maxWidth: "100%",
                display: "block",
              }}
              draggable={false}
            />
          </div>

          {/* Bottom hint */}
          <div className="shrink-0 py-3 text-center" onClick={e => e.stopPropagation()}>
            <p className="text-xs text-white/30">Use + / − to zoom · Click outside to close</p>
          </div>
        </div>
      )}

      {/* AI Chatbot */}
      {aiOpen && (
        <div className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 w-80 rounded-3xl overflow-hidden shadow-2xl z-50 flex flex-col bg-white" style={{ border: "1.5px solid rgba(26,110,245,0.15)", height: "400px" }}>
          <div className="flex items-center gap-3 px-4 py-3" style={{ background: "#eef4ff", borderBottom: "1px solid rgba(26,110,245,0.1)" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg,${BLUE},${BLUE2})` }}><Bot size={15} className="text-white" /></div>
            <div className="flex-1"><p className="text-sm font-bold" style={{ color: BLUE }}>ThrillBot</p><p className="text-xs" style={{ color: "#5a78a8" }}>AI Assistant · Online</p></div>
            <button onClick={() => setAiOpen(false)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-blue-100"><X size={13} style={{ color: "#5a78a8" }} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
            {aiChat.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed" style={{ background: m.role === "user" ? `linear-gradient(135deg,${BLUE},${BLUE2})` : "#f0f5ff", color: m.role === "user" ? "#fff" : "#1a3a6e" }}>{m.text}</div>
              </div>
            ))}
            <div ref={aiEndRef} />
          </div>
          <div className="p-3 flex gap-2" style={{ borderTop: "1px solid rgba(26,110,245,0.08)" }}>
            <input value={aiMsg} onChange={e => setAiMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && sendAiMsg()} placeholder="Ask about rides, waits, food..." className="flex-1 px-3 py-2 rounded-xl text-xs outline-none" style={{ background: "#f0f5ff", color: "#0d1f3c", caretColor: BLUE }} />
            <button onClick={sendAiMsg} className="w-8 h-8 rounded-xl flex items-center justify-center hover:scale-110 transition-transform" style={{ background: `linear-gradient(135deg,${BLUE},${BLUE2})` }}><ArrowRight size={14} className="text-white" /></button>
          </div>
        </div>
      )}
      {!aiOpen && (
        <button onClick={() => setAiOpen(true)} className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-xl z-50 transition-all hover:scale-110" style={{ background: `linear-gradient(135deg,${BLUE},${BLUE2})`, boxShadow: `0 6px 24px ${BLUE}55` }}>
          <Bot size={22} className="text-white" />
        </button>
      )}

      <FaqSection
        title="Frequently Asked Questions"
        sub="Everything you need to know before visiting ThrillVerse Park"
        faqs={HOME_FAQS}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// RIDE DETAIL MODAL
// ═══════════════════════════════════════════════════════════════════════════
function RideDetailModal({ ride, onClose, onJoinQueue }: { ride: any; onClose: () => void; onJoinQueue: () => void }) {
  const cs = catStyle[ride.category] ?? { bg: "#f0f5ff", text: BLUE };
  const extra = RIDE_DETAILS[ride.id as number];

  const thrillLabel = ride.thrill >= 5 ? "Extreme" : ride.thrill === 4 ? "High" : ride.thrill === 3 ? "Medium" : "Low";
  const thrillColor = ride.thrill >= 4 ? RED : ride.thrill === 3 ? AMBER : GREEN;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: "rgba(13,31,60,0.6)", backdropFilter: "blur(10px)" }} />

      {/* Panel */}
      <div
        className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl bg-white"
        style={{ maxHeight: "90vh", overflowY: "auto", scrollbarWidth: "none" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Hero image */}
        <div className="relative h-52 overflow-hidden shrink-0">
          <img src={ride.img} alt={ride.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(13,31,60,0.72) 0%,transparent 55%)" }} />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110"
            style={{ background: "rgba(255,255,255,0.92)" }}
          >
            <X size={15} style={{ color: "#0d1f3c" }} />
          </button>

          {/* Category + status badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold" style={{ background: cs.bg, color: cs.text }}>{ride.category}</span>
            {ride.status === "maintenance" && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-600 flex items-center gap-1">🚧 Under Maintenance</span>
            )}
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-3 left-4 right-14">
            <h2 className="text-xl font-black text-white leading-tight" style={{ fontFamily: "'Exo 2',sans-serif" }}>{ride.name}</h2>
            <p className="text-xs text-white/70 mt-0.5">{ride.zone}</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          {ride.status === "closed" && (
            <div className="mb-5 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col gap-1.5 shadow-sm">
              <div className="flex items-start gap-2 text-rose-800 font-bold text-sm">
                <span>🚫</span>
                <span>Closed for the Day</span>
              </div>
              <p className="text-xs text-rose-700 leading-normal">
                This attraction is currently closed by theme park management.
              </p>
            </div>
          )}

          {ride.status === "maintenance" && (
            <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col gap-1.5 shadow-sm">
              <div className="flex items-start gap-2 text-amber-800 font-bold text-sm">
                <span>🚧</span>
                <span>Under Maintenance</span>
              </div>
              <p className="text-xs text-amber-700 leading-normal">
                This ride is currently under maintenance and is temporarily unavailable.
              </p>
              {ride.expected_reopening_date && (
                <p className="text-[10px] font-bold text-amber-900 bg-amber-100/50 px-2 py-0.5 rounded w-max mt-1">
                  Expected reopening: {ride.expected_reopening_date}
                </p>
              )}
            </div>
          )}

          {/* Stat pills row */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: "#fffbeb", color: AMBER }}>
              <Star size={11} fill={AMBER} /> {ride.rating}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: "#eef4ff", color: BLUE }}>
              <Clock size={11} /> {ride.wait} min wait
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: "#fff0ea", color: thrillColor }}>
              <Flame size={11} /> {thrillLabel} Thrill
            </span>
          </div>

          {/* Description */}
          {extra && (
            <p className="text-sm leading-relaxed mb-5" style={{ color: "#5a78a8" }}>{extra.description}</p>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            {[
              { label: "📏 Height Req.", value: ride.height === "None" ? "No restriction" : `Min ${ride.height}` },
              { label: "🎂 Min Age", value: extra?.minAge ?? ride.age },
              { label: "👥 Capacity", value: extra ? `${extra.capacity} guests / ride` : "—" },
              { label: "📍 Zone", value: ride.zone },
              { label: "🔥 Thrill", value: `${thrillLabel} (${ride.thrill}/5)` },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 rounded-xl" style={{ background: "#f0f5ff" }}>
                <p className="text-[10px] font-bold text-[#0d1f3c] mb-0.5">{label}</p>
                <p className="text-xs font-semibold" style={{ color: "#1a3a6e" }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Thrill visual */}
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xs font-bold" style={{ color: "#5a78a8" }}>Thrill Level</span>
            <ThrillDots level={ride.thrill} />
            <span className="text-xs font-bold" style={{ color: thrillColor }}>{thrillLabel}</span>
          </div>

          {/* Safety instructions */}
          {extra && extra.safety.length > 0 && (
            <div className="mb-5">
              <h3 className="font-black text-sm text-[#0d1f3c] mb-2.5 flex items-center gap-1.5" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                <Info size={14} style={{ color: BLUE }} /> Safety Instructions
              </h3>
              <ul className="flex flex-col gap-1.5">
                {extra.safety.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: "#5a78a8" }}>
                    <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "#eef4ff" }}>
                      <Check size={9} style={{ color: BLUE }} />
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA buttons */}
          {(() => {
            const isClosed = ride.status === 'closed' || ride.status === 'maintenance' || ride.status === 'paused' || ride.queue_enabled === false;
            return (
              <div className="flex gap-2.5">
                <button
                  onClick={() => { if (!isClosed) { onJoinQueue(); onClose(); } }}
                  disabled={isClosed}
                  className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all ${isClosed
                      ? "bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300 shadow-none opacity-80"
                      : "text-white hover:shadow-lg cursor-pointer"
                    }`}
                  style={{ background: isClosed ? "#e2e8f0" : `linear-gradient(135deg,${BLUE},${BLUE2})` }}
                >
                  {ride.status === "closed"
                    ? "Closed 🚫"
                    : ride.status === "maintenance"
                      ? "Under Maintenance 🛠️"
                      : isClosed
                        ? "Queue Paused ⏸️"
                        : "Join Queue"}
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-3 rounded-2xl text-sm font-bold transition-all hover:bg-[#eef4ff] cursor-pointer"
                  style={{ border: `1.5px solid ${BLUE}22`, color: BLUE }}
                >
                  Close
                </button>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPLORE PAGE
// ═══════════════════════════════════════════════════════════════════════════
function ExplorePage({ setPage, rides, setSelectedQueueRide }: { setPage: (p: string) => void; rides: any[]; setSelectedQueueRide: (r: any) => void }) {
  const [search, setSearch] = useState("");
  const [catFilter, setCat] = useState("All");
  const [statusFilter, setStat] = useState("All");
  const [waitFilter, setWait] = useState("All");
  const [thrillFilter, setThrill] = useState("All");
  const [sortBy, setSort] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRideDetail, setSelectedRideDetail] = useState<any | null>(null);

  const cats = ["All", "Thriller", "Water", "Family", "Kids"];
  const statuses = ["All", "Open", "Closed", "Maintenance"];
  const waits = ["All", "Under 15 min", "Under 30 min", "Under 45 min", "Under 60 min"];
  const thrills = ["All", "Low (1-2)", "Medium (3)", "High (4-5)"];

  const filtered = rides.filter(r => {
    const rWait = r.wait !== undefined ? r.wait : (r.current_wait_time !== undefined ? r.current_wait_time : 0);
    const rThrill = r.thrill !== undefined ? r.thrill : (r.thrill_level !== undefined ? r.thrill_level : 1);
    const rCat = r.category ? (r.category.charAt(0).toUpperCase() + r.category.slice(1).toLowerCase()) : "";

    if (catFilter !== "All" && rCat !== catFilter && r.category !== catFilter) return false;
    if (statusFilter === "Open" && r.status !== "open") return false;
    if (statusFilter === "Closed" && r.status !== "closed") return false;
    if (statusFilter === "Maintenance" && r.status !== "maintenance") return false;
    if (waitFilter === "Under 15 min" && rWait >= 15) return false;
    if (waitFilter === "Under 30 min" && rWait >= 30) return false;
    if (waitFilter === "Under 45 min" && rWait >= 45) return false;
    if (waitFilter === "Under 60 min" && rWait >= 60) return false;
    if (thrillFilter === "Low (1-2)" && rThrill > 2) return false;
    if (thrillFilter === "Medium (3)" && rThrill !== 3) return false;
    if (thrillFilter === "High (4-5)" && rThrill < 4) return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    const aWait = a.wait !== undefined ? a.wait : (a.current_wait_time || 0);
    const bWait = b.wait !== undefined ? b.wait : (b.current_wait_time || 0);
    const aThrill = a.thrill !== undefined ? a.thrill : (a.thrill_level || 1);
    const bThrill = b.thrill !== undefined ? b.thrill : (b.thrill_level || 1);

    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "wait") return aWait - bWait;
    if (sortBy === "thrill") return bThrill - aThrill;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28">
      <SectionHeader title="Explore Rides" accent={BLUE} sub={`${filtered.length} of ${rides.length} rides shown`} />

      {/* Search + Filter bar */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white" style={{ border: "1.5px solid rgba(26,110,245,0.15)" }}>
          <Search size={15} style={{ color: "#5a78a8" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search rides…" className="flex-1 text-sm outline-none bg-transparent" style={{ color: "#0d1f3c" }} />
          {search && <button onClick={() => setSearch("")}><X size={13} style={{ color: "#5a78a8" }} /></button>}
        </div>
        <button onClick={() => setShowFilters(v => !v)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all" style={{ background: showFilters ? "#eef4ff" : "white", border: "1.5px solid rgba(26,110,245,0.15)", color: showFilters ? BLUE : "#5a78a8" }}>
          <SlidersHorizontal size={15} /><span className="hidden sm:inline">Filters</span>
        </button>
        <select value={sortBy} onChange={e => setSort(e.target.value)} className="px-3 py-2.5 rounded-xl text-sm font-bold outline-none" style={{ background: "white", border: "1.5px solid rgba(26,110,245,0.15)", color: "#5a78a8" }}>
          <option value="rating">Top Rated</option>
          <option value="wait">Shortest Wait</option>
          <option value="thrill">Most Thrilling</option>
        </select>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {cats.map(c => (
          <button key={c} onClick={() => setCat(c)} className="px-4 py-1.5 rounded-full text-sm font-bold transition-all" style={{ background: catFilter === c ? `linear-gradient(135deg,${BLUE},${BLUE2})` : "white", color: catFilter === c ? "white" : "#5a78a8", border: `1.5px solid ${catFilter === c ? BLUE : "rgba(26,110,245,0.15)"}` }}>
            {c}
          </button>
        ))}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="mb-6 p-5 rounded-2xl bg-white" style={{ border: "1.5px solid rgba(26,110,245,0.12)" }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <p className="text-xs font-bold mb-2 tracking-widest" style={{ color: "#5a78a8" }}>STATUS</p>
              <div className="flex flex-col gap-1.5">{statuses.map(s => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <div onClick={() => setStat(s)} className="w-4 h-4 rounded flex items-center justify-center transition-all" style={{ background: statusFilter === s ? BLUE : "white", border: `2px solid ${statusFilter === s ? BLUE : "#dbeafe"}` }}>
                    {statusFilter === s && <Check size={10} className="text-white" />}
                  </div>
                  <span className="text-sm" style={{ color: "#1a3a6e" }}>{s}</span>
                </label>
              ))}</div>
            </div>
            <div>
              <p className="text-xs font-bold mb-2 tracking-widest" style={{ color: "#5a78a8" }}>WAIT TIME</p>
              <div className="flex flex-col gap-1.5">{waits.map(w => (
                <label key={w} className="flex items-center gap-2 cursor-pointer">
                  <div onClick={() => setWait(w)} className="w-4 h-4 rounded flex items-center justify-center transition-all" style={{ background: waitFilter === w ? BLUE : "white", border: `2px solid ${waitFilter === w ? BLUE : "#dbeafe"}` }}>
                    {waitFilter === w && <Check size={10} className="text-white" />}
                  </div>
                  <span className="text-sm" style={{ color: "#1a3a6e" }}>{w}</span>
                </label>
              ))}</div>
            </div>
            <div>
              <p className="text-xs font-bold mb-2 tracking-widest" style={{ color: "#5a78a8" }}>THRILL LEVEL</p>
              <div className="flex flex-col gap-1.5">{thrills.map(t => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <div onClick={() => setThrill(t)} className="w-4 h-4 rounded flex items-center justify-center transition-all" style={{ background: thrillFilter === t ? BLUE : "white", border: `2px solid ${thrillFilter === t ? BLUE : "#dbeafe"}` }}>
                    {thrillFilter === t && <Check size={10} className="text-white" />}
                  </div>
                  <span className="text-sm" style={{ color: "#1a3a6e" }}>{t}</span>
                </label>
              ))}</div>
            </div>
          </div>
          <button onClick={() => { setCat("All"); setStat("All"); setWait("All"); setThrill("All"); }} className="mt-4 text-xs font-bold" style={{ color: RED }}>Clear All Filters</button>
        </div>
      )}

      {/* Rides grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20"><p className="text-lg font-bold text-[#0d1f3c]">No rides match your filters</p><button onClick={() => { setCat("All"); setStat("All"); setWait("All"); setThrill("All"); setSearch(""); }} className="mt-3 text-sm font-bold" style={{ color: BLUE }}>Reset filters</button></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(ride => {
            const cs = catStyle[ride.category] ?? { bg: "#f0f5ff", text: BLUE };
            const isClosed = ride.status === 'closed' || ride.status === 'maintenance' || ride.status === 'paused' || ride.queue_enabled === false;

            return (
              <div key={ride.id} className="group rounded-2xl overflow-hidden bg-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-100 relative" style={{ border: "1.5px solid rgba(26,110,245,0.1)" }}>
                <div className="relative h-36 overflow-hidden bg-blue-50">
                  <img src={ride.img} alt={ride.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(13,31,60,0.55) 0%,transparent 55%)" }} />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: cs.bg, color: cs.text }}>{ride.category}</span>

                  {ride.status === "closed" && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-600 text-white shadow-md">
                      Closed 🚫
                    </span>
                  )}
                  {ride.status === "maintenance" && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500 text-white shadow-md">
                      Maintenance 🛠️
                    </span>
                  )}
                  {(ride.status === "paused" || ride.queue_enabled === false) && ride.status !== "closed" && ride.status !== "maintenance" && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-yellow-500 text-white shadow-md">
                      Paused ⏸️
                    </span>
                  )}

                  <div className="absolute bottom-2 left-2 flex items-center gap-1"><Clock size={11} className="text-white" /><span className="text-xs font-bold text-white">{isClosed ? "N/A" : `${ride.wait} min`}</span></div>
                </div>
                <div className="p-3">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-black text-sm text-[#0d1f3c]" style={{ fontFamily: "'Exo 2',sans-serif" }}>{ride.name}</h3>
                    <div className="flex items-center gap-0.5"><Star size={10} fill={AMBER} style={{ color: AMBER }} /><span className="text-xs font-bold" style={{ color: AMBER }}>{ride.rating}</span></div>
                  </div>
                  <div className="flex items-center gap-1.5 mb-2"><span className="text-xs" style={{ color: "#5a78a8" }}>Thrill</span><ThrillDots level={ride.thrill} /></div>
                  <div className="flex items-center justify-between text-xs mb-3" style={{ color: "#5a78a8" }}>
                    <span>↑ {ride.height}</span><span>{ride.zone}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled={isClosed}
                      onClick={() => { if (!isClosed) { setSelectedQueueRide(ride); setPage(PAGES.VIRTUAL_QUEUE); } }}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${isClosed
                          ? "bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300 shadow-none opacity-80"
                          : "text-white hover:shadow-md cursor-pointer"
                        }`}
                      style={{ background: isClosed ? "#e2e8f0" : `linear-gradient(135deg,${BLUE},${BLUE2})` }}
                    >
                      {ride.status === "closed"
                        ? "Closed 🚫"
                        : ride.status === "maintenance"
                          ? "Under Maintenance 🛠️"
                          : isClosed
                            ? "Queue Paused ⏸️"
                            : "Join Queue"}
                    </button>
                    <button onClick={() => setSelectedRideDetail(ride)} className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:bg-[#eef4ff] cursor-pointer" style={{ border: `1.5px solid ${BLUE}22`, color: BLUE }}>
                      Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Ride Detail Modal ── */}
      {selectedRideDetail && (
        <RideDetailModal
          ride={selectedRideDetail}
          onClose={() => setSelectedRideDetail(null)}
          onJoinQueue={() => { setSelectedQueueRide(selectedRideDetail); setPage(PAGES.VIRTUAL_QUEUE); }}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// VIRTUAL QUEUE PAGE
// ═══════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════
// TICKETS PAGE
// ═══════════════════════════════════════════════════════════════════════════
function TicketsPage({ selectedPromo, onClearPromo, userTickets, setUserTickets, onBookOfferClick, setPage }: {
  selectedPromo: any | null;
  onClearPromo: () => void;
  userTickets: any[];
  setUserTickets: React.Dispatch<React.SetStateAction<any[]>>;
  onBookOfferClick: (offerTitle: string) => void;
  setPage: (p: string) => void;
}) {
  const { token, isAuthenticated, fetchWithAuth } = useAuth();
  const [activeMainTab, setActiveMainTab] = useState<"offers" | "my_tickets">("offers");
  const [tab, setTab] = useState<"current" | "history" | "fastpass">("current");
  const [selectedPayment, setSelectedPayment] = useState("UPI (GPay/PhonePe)");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [expandedOffers, setExpandedOffers] = useState<Record<number, boolean>>({});
  const [adminOffers, setAdminOffers] = useState<any[]>([]);
  const [isOffersLoaded, setIsOffersLoaded] = useState<boolean>(false);

  const toggleOfferExpand = (index: number) => {
    setExpandedOffers(prev => ({ ...prev, [index]: !prev[index] }));
  };

  useEffect(() => {
    const loadOffers = () => {
      fetch("http://127.0.0.1:8000/queue/offers/")
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          if (Array.isArray(data)) {
            setAdminOffers(data);
            setIsOffersLoaded(true);
          }
        })
        .catch(err => console.error("Error loading admin offers:", err));
    };
    loadOffers();
    const interval = setInterval(loadOffers, 3000);
    return () => clearInterval(interval);
  }, []);

  const defaultOffersList = [
    {
      img: monsoonImg,
      title: "Monsoon Magic at ThrillVerse",
      code: "MONSOON30",
      bullets: [
        "Save Upto 30% on Theme Park & Water Park",
        "Visit Validity : Till 30 Sept'2026",
        "This offer is applicable for online booking",
        "No two offers can be clubbed together",
        "T&C Apply"
      ],
      longDesc: "Experience the magic of the monsoon at ThrillVerse! Enjoy thrilling rides, special entertainment acts, themed food & beverages, and scenic beauty under the rains. Pre-book to claim 30% off.",
    },
    {
      img: happyTuesdayImg,
      title: "Happy Tuesday",
      code: "HAPPYTUES",
      bullets: [
        "Mega Thrills, Mini Bills · Tickets @ ₹999/-* only",
        "Visit Validity: Every Tuesday till 31 Oct'2026",
        "This offer is applicable for online pre-booking"
      ],
      longDesc: "Get access to all major theme park rides at a flat discounted price of ₹999/- on Tuesdays. Plan your mid-week escape with friends and family for maximum fun at minimal cost.",
    },
    {
      img: watAWednesdayImg,
      title: "Wat-A-Wednesday",
      code: "WATWED799",
      bullets: [
        "Soak the Fun this Summer · Tickets @ ₹799/-* only",
        "Visit Validity: Every Wednesday till 31 Oct'2026",
        "This offer is applicable for online booking"
      ],
      longDesc: "Beat the heat with our special water park discount on Wednesdays. Includes access to all high-thrill water slides, wave pools, and lazy rivers. Costume rentals available.",
    },
    {
      img: byeByeExamsImg,
      title: "Bye Bye Exams",
      code: "STUDENT50",
      bullets: [
        "Exams gone, Life's On! Flat 25% Off for Students",
        "Visit Validity: Till 30 Sept'2026",
        "Mandatory requirement: Valid physical Student ID card"
      ],
      longDesc: "Celebrate the end of exams with your friends! Get a flat 25% discount on theme park tickets by showing your valid student identification card at the gate. Pre-book online now.",
    },
    {
      img: adventureSavingsImg,
      title: "Adventure & Savings",
      code: "BUY4GET1",
      bullets: [
        "Buy 4 tickets get 1 FREE · All zones access",
        "Visit Validity: Till 31 Dec'2026",
        "Group offer: Ideal for friends and family road trips"
      ],
      longDesc: "Get one free ticket for every four tickets you purchase in a single transaction. Access all rides and attractions across theme park and water park zones. Perfect for group outings.",
    },
    {
      img: snowParkImg,
      title: "Snow Park Ticket",
      code: "SNOW499",
      bullets: [
        "Fun mein chill ho jao! Snow Park entry starting @ ₹499/-*",
        "Visit Validity: Standalone or Add-on on any booked date",
        "Duration: 45 minutes of snow play with gear included"
      ],
      longDesc: "Experience sub-zero temperatures and real snow in the heart of the city! Slides, snow fights, and dance floors. Winter jackets, boots, and gloves are provided free of charge.",
    },
    {
      img: goldenHourPassImg,
      title: "Golden Hour Pass",
      code: "GOLDEN599",
      bullets: [
        "Visit Validity: Entry from 4:00 PM to Park Closing",
        "Duration: Evening Access (4 PM – 10 PM) · Starting @ ₹599/-",
        "This offer is applicable for online booking",
        "T&C Apply"
      ],
      longDesc: "Experience evening rides under golden sunset skies! Get entry from 4:00 PM to park closing for a special price of ₹599/-. Includes access to major rides and food stalls."
    }
  ];

  const displayOffers = (isOffersLoaded ? adminOffers : defaultOffersList).map((off: any) => {
    const nameLower = (off.name || off.title || '').toLowerCase();
    const codeLower = (off.promo_code || off.code || '').toLowerCase();
    const match = defaultOffersList.find(d => d.code === off.promo_code || d.title.toLowerCase().includes(nameLower) || nameLower.includes(d.title.toLowerCase()));

    let matchedImg = match ? match.img : null;
    if (nameLower.includes('golden') || codeLower.includes('golden')) matchedImg = goldenHourPassImg;

    return {
      id: off.id,
      img: matchedImg || off.banner_image || off.image || monsoonImg,
      title: off.name || off.title || "Special Offer",
      code: off.promo_code || off.code || "PROMO10",
      bullets: off.description ? [
        off.description.slice(0, 70),
        `Special Discount: ${off.discount_percentage ? off.discount_percentage + '% OFF' : 'Flat Savings'}`,
        `Visit Validity: ${off.expiry_date ? 'Till ' + off.expiry_date : 'Limited Period'}`,
        "Applicable for online pre-booking"
      ] : (match ? match.bullets : [
        "Special Online Ticket Discount",
        "Valid for online booking only",
        "T&C Apply"
      ]),
      longDesc: off.description || (match ? match.longDesc : "Exclusive ThrillVerse offer published directly by park administration.")
    };
  });

  // Fetch user tickets from database on mount or when length/auth changes
  useEffect(() => {
    if (token) {
      fetchWithAuth("/queue/tickets/")
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          if (Array.isArray(data)) {
            const mapped = data.map((tk: any) => ({
              id: tk.ticket_id,
              type: tk.ticket_type,
              name: tk.holder_name,
              date: new Date(tk.valid_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
              zones: tk.zones,
              rides: tk.rides,
              qr_code_base64: tk.qr_code_base64,
              color: BLUE,
              gradient: `linear-gradient(135deg,${BLUE},${BLUE2})`
            }));
            setUserTickets(mapped);
          }
        })
        .catch(err => console.error("Error loading tickets:", err));
    } else {
      setUserTickets([]);
    }
  }, [userTickets.length, token]);

  const handleBookPass = () => {
    if (!selectedPromo) return;
    setBookingLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("🔒 Please login or register first via the 'Virtual Queue' page to book tickets!");
      setBookingLoading(false);
      return;
    }

    const payload = {
      ticket_type: selectedPromo.title,
      price: 999,
      payment_method: selectedPayment,
      holder_name: "Rohan Sharma"
    };

    fetch("http://127.0.0.1:8000/queue/tickets/book/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then(async res => {
        const data = await res.json();
        if (res.ok) {
          const newTicket = {
            id: data.ticket_id,
            type: data.ticket_type,
            name: data.holder_name,
            date: new Date(data.valid_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            zones: data.zones,
            rides: data.rides,
            qr_code_base64: data.qr_code_base64,
            color: BLUE,
            gradient: `linear-gradient(135deg,${BLUE},${BLUE2})`
          };
          setUserTickets(prev => [newTicket, ...prev]);
          onClearPromo();
          setTab("current");
          alert("🎉 Booking Successful! Your new pass is ready under 'Current Tickets' and saved to the database.");
        } else {
          alert(`Error: ${data.detail || "Booking failed"}`);
        }
      })
      .catch(err => {
        console.error("Booking error:", err);
        alert("Failed to connect to backend database.");
      })
      .finally(() => {
        setBookingLoading(false);
      });
  };
  const history = [
    { id: "TV-2024-003201", type: "Half Day Pass", date: "Jun 28, 2024", status: "used", amount: "₹699" },
    { id: "TV-2024-002890", type: "Family Package", date: "Jun 15, 2024", status: "used", amount: "₹2,499" },
    { id: "TV-2024-001102", type: "Full Day Pass", date: "May 30, 2024", status: "expired", amount: "₹999" },
  ];
  const fastPasses = [
    { ride: "Nitro", time: "2:00 PM – 2:30 PM", status: "active", color: BLUE },
    { ride: "Scream Machine", time: "4:30 PM – 5:00 PM", status: "active", color: INDIGO },
    { ride: "Dino Splashdown", time: "6:00 PM – 6:30 PM", status: "used", color: GREEN },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28">
      {/* ── Section Header Banner & Continuous Ticker Strip ── */}
      <div className="w-full rounded-2xl overflow-hidden shadow-xl mb-8 border border-slate-200 bg-white">
        <img
          src={offersBannerImg}
          alt="Looking for Best Deals? You've Found It"
          className="w-full h-auto object-cover block"
        />
        <div className="bg-[#c8102e] text-white py-2.5 px-4 overflow-hidden relative border-t border-red-700 shadow-md">
          <div className="animate-marquee font-bold text-xs sm:text-sm md:text-base tracking-wide flex items-center">
            <span className="mx-6 shrink-0">🎟️ Tickets booked at park counter are priced higher. Book online Now to get the best deals!</span>
            <span className="mx-6 shrink-0">🎟️ Tickets booked at park counter are priced higher. Book online Now to get the best deals!</span>
            <span className="mx-6 shrink-0">🎟️ Tickets booked at park counter are priced higher. Book online Now to get the best deals!</span>
            <span className="mx-6 shrink-0">🎟️ Tickets booked at park counter are priced higher. Book online Now to get the best deals!</span>
          </div>
        </div>
      </div>

      {/* Tab selection at the top */}
      <div className="flex gap-6 mb-8 border-b border-slate-200 justify-center sm:justify-start">
        <button
          onClick={() => setActiveMainTab("offers")}
          className="pb-3 text-sm sm:text-base font-black relative transition-all"
          style={{
            color: activeMainTab === "offers" ? BLUE : "#5a78a8",
          }}
        >
          🎟️ Deals &amp; Offers
          {activeMainTab === "offers" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        <button
          onClick={() => setActiveMainTab("my_tickets")}
          className="pb-3 text-sm sm:text-base font-black relative transition-all"
          style={{
            color: activeMainTab === "my_tickets" ? BLUE : "#5a78a8",
          }}
        >
          📂 My Booked Passes
          {activeMainTab === "my_tickets" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
      </div>

      {activeMainTab === "offers" ? (
        <div>
          <div className="text-center mb-10 mt-4">
            <h2 className="text-3xl sm:text-4xl font-black text-[#0d1f3c] mb-2 leading-tight" style={{ fontFamily: "'Exo 2',sans-serif" }}>
              Pre-Book Online &amp; Save More to Enjoy Endless Fun &amp; Thrill
            </h2>
            <p className="text-sm sm:text-base font-semibold" style={{ color: "#5a78a8" }}>
              Online deals, offers, discounts - valid till 8 AM on visit date
            </p>
            <div className="w-20 h-1 bg-[#f97316] mx-auto mt-4 rounded-full" />
          </div>

          {/* List of Offers dynamically fetched from Admin */}
          <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            {displayOffers.map((offer, i) => {
              const isExpanded = !!expandedOffers[i];
              return (
                <div
                  key={i}
                  className="flex flex-col md:flex-row bg-white border border-[#d1d5db] p-3 gap-6 rounded-none transition-all duration-300 animate-fadeIn"
                >
                  <div className="w-full md:w-5/12 h-56 md:h-auto min-h-[220px] relative shrink-0 overflow-hidden bg-slate-100">
                    <img src={offer.img} alt={offer.title} className="w-full h-full object-cover rounded-none" />
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-3" style={{ color: BLUE }}>
                        {offer.title}
                      </h3>
                      <ul className="list-disc pl-5 space-y-1.5 text-slate-700 text-sm mb-4">
                        {offer.bullets.map((b, idx) => (
                          <li key={idx}>{b}</li>
                        ))}
                        <li className="font-semibold text-slate-900">
                          Promo Code: <span className="bg-amber-100 text-amber-900 font-mono font-extrabold px-2 py-0.5 rounded border border-amber-300 select-all tracking-wider ml-1">{offer.code}</span>
                        </li>
                      </ul>
                      <button
                        onClick={() => toggleOfferExpand(i)}
                        className="hover:underline font-semibold text-sm text-left mb-4 focus:outline-none block"
                        style={{ color: BLUE }}
                      >
                        {isExpanded ? "Read Less ↑" : "Read More ↓"}
                      </button>
                      {isExpanded && (
                        <p className="text-xs text-slate-500 mb-4 bg-slate-50 p-4 rounded-none border border-slate-100 leading-relaxed animate-fadeIn">
                          {offer.longDesc}
                        </p>
                      )}
                    </div>
                    <div>
                      <button
                        onClick={() => onBookOfferClick(offer.title)}
                        className="px-6 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98] rounded-none cursor-pointer"
                        style={{ background: `linear-gradient(135deg, ${BLUE}, ${BLUE2})` }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          {!isAuthenticated ? (
            <div className="p-12 rounded-3xl bg-slate-50 text-center border-2 border-dashed border-slate-200 max-w-md mx-auto my-8">
              <span className="text-4xl mb-3 block">🔒</span>
              <h4 className="text-base font-black text-[#0d1f3c] mb-2 font-poppins">Sign In Required</h4>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Please sign in to view your booked tickets, check-in history, and active Fast Passes.
              </p>
              <button
                onClick={() => setPage(PAGES.VIRTUAL_QUEUE)}
                className="px-6 py-2.5 rounded-full font-bold text-xs text-white"
                style={{ background: `linear-gradient(135deg,${BLUE},${BLUE2})` }}
              >
                Sign In Now
              </button>
            </div>
          ) : (
            <div>
              <SectionHeader title="My Booked Tickets" accent={AMBER} sub="View and scan your active park admission tickets" />

              <div className="max-w-sm mx-auto">
                {selectedPromo && (
                  <div className="mb-8 p-6 rounded-3xl bg-gradient-to-tr from-blue-50/70 to-indigo-50/70 border border-blue-100 shadow-lg relative overflow-hidden" style={{ border: "1.5px solid rgba(26,110,245,0.12)" }}>
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-black text-white" style={{ background: selectedPromo.badgeBg || BLUE }}>{selectedPromo.badge}</span>
                      <button onClick={onClearPromo} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
                    </div>
                    <div className="h-40 rounded-2xl overflow-hidden mb-4 bg-slate-100">
                      <img src={selectedPromo.img} alt={selectedPromo.title} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-lg font-black text-[#0d1f3c] mb-1.5" style={{ fontFamily: "'Exo 2',sans-serif" }}>{selectedPromo.title}</h3>
                    <p className="text-xs mb-4" style={{ color: "#5a78a8" }}>{selectedPromo.desc}</p>

                    <div className="p-4 rounded-2xl bg-white border border-slate-100 mb-4 shadow-sm">
                      <p className="text-[10px] font-black tracking-widest text-[#0d1f3c] mb-2 uppercase">SELECT PAYMENT MODE</p>
                      <div className="flex flex-col gap-2 mb-4">
                        {["UPI (GPay/PhonePe/Paytm)", "Credit/Debit Card", "Net Banking"].map(method => (
                          <label key={method} className="flex items-center gap-2 cursor-pointer p-2 rounded-xl border border-slate-100 hover:bg-slate-50">
                            <input type="radio" name="paymethod" checked={selectedPayment === method} onChange={() => setSelectedPayment(method)} className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-bold" style={{ color: "#1a3a6e" }}>{method}</span>
                          </label>
                        ))}
                      </div>
                      <button onClick={handleBookPass} disabled={bookingLoading} className="w-full py-3 rounded-2xl text-xs font-black text-white transition-all hover:opacity-90 flex items-center justify-center gap-1.5" style={{ background: `linear-gradient(135deg,${BLUE},${BLUE2})` }}>
                        {bookingLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          "Confirm & Pay ₹999/-"
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {userTickets.length === 0 ? (
                  <div className="p-8 rounded-3xl bg-white border border-slate-100 text-center shadow-sm">
                    <p className="text-sm font-bold text-slate-700">No active tickets booked.</p>
                    <p className="text-xs text-slate-400 mt-1">Book your park tickets to see them here.</p>
                  </div>
                ) : (
                  userTickets.map(t => (
                    <div key={t.id} className="rounded-3xl overflow-hidden shadow-xl mb-6">
                      <div className="p-6" style={{ background: t.gradient }}>
                        <div className="flex items-center justify-between mb-6">
                          <span className="text-2xl font-black text-white" style={{ fontFamily: "'Exo 2',sans-serif" }}>Thrillverse</span>
                          <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(255,255,255,0.25)", color: "white" }}>{t.type}</span>
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
                      <div className="bg-white px-6 py-2 flex items-center gap-3">
                        <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: "rgba(26,110,245,0.2)" }} />
                        <div className="w-5 h-5 rounded-full" style={{ background: "#f0f5ff" }} />
                        <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: "rgba(26,110,245,0.2)" }} />
                      </div>
                      <div className="bg-white p-6 flex flex-col items-center">
                        <div className="w-36 h-36 rounded-2xl flex items-center justify-center mb-4 bg-[#f0f5ff] p-2 border border-slate-200">
                          {t.qr_code_base64 ? (
                            <img src={t.qr_code_base64} className="w-full h-full object-contain rounded-xl" alt="Ticket QR" />
                          ) : (
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(t.id || 'TV-PASS')}`} className="w-full h-full object-contain rounded-xl" alt="Ticket QR" />
                          )}
                        </div>
                        <p className="text-xs font-bold mb-4" style={{ color: "#5a78a8" }}>Scan at entrance for entry</p>
                        <div className="flex gap-3 w-full">
                          <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold cursor-pointer" style={{ background: "#eef4ff", color: BLUE }}><Download size={13} />Save</button>
                          <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold cursor-pointer" style={{ background: "#eef4ff", color: BLUE }}><Share2 size={13} />Share</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <FaqSection
        title="Frequently Asked Questions"
        sub="Everything you need to know before visiting ThrillVerse Park"
        faqs={HOME_FAQS}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// REWARDS PAGE
// ═══════════════════════════════════════════════════════════════════════════
function RewardsPage() {
  const [tab, setTab] = useState<"overview" | "achievements" | "leaderboard" | "challenges">("overview");
  const xp = 2450; const maxXp = 3000; const level = 8;

  const coupons = [
    { code: "THRILL20", desc: "20% off any ticket", expires: "Jul 15", color: BLUE },
    { code: "FOOD50", desc: "₹50 off food order", expires: "Jul 10", color: GREEN },
    { code: "MERCH15", desc: "15% off merchandise", expires: "Jul 20", color: PURPLE },
  ];
  const challenges = [
    { title: "Ride 3 Thriller rides today", progress: 2, total: 3, xp: 100, icon: "⚡" },
    { title: "Order food from 2 outlets", progress: 1, total: 2, xp: 50, icon: "🍔" },
    { title: "Use Virtual Queue 2 times", progress: 2, total: 2, xp: 80, icon: "🎟️", done: true },
    { title: "Visit Water Zone", progress: 0, total: 1, xp: 60, icon: "🌊" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28">
      <SectionHeader title="My Rewards" accent={GREEN} sub="Earn XP, unlock achievements, and claim coupons" />

      {/* XP Card */}
      <div className="rounded-3xl p-6 mb-6 relative overflow-hidden" style={{ background: `linear-gradient(135deg,${BLUE},${BLUE2})` }}>
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }} />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold text-white/70 mb-0.5">Current Level</p>
              <p className="text-4xl font-black text-white" style={{ fontFamily: "'Exo 2',sans-serif" }}>Level {level}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-white/70 mb-0.5">Total XP</p>
              <p className="text-3xl font-black text-white" style={{ fontFamily: "'Exo 2',sans-serif" }}>{xp.toLocaleString()}</p>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-white/70 mb-1"><span>Level {level}</span><span>{xp}/{maxXp} XP to Level {level + 1}</span></div>
            <div className="h-3 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }}>
              <div className="h-full rounded-full" style={{ width: `${(xp / maxXp) * 100}%`, background: "rgba(255,255,255,0.9)" }} />
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <div className="text-center"><p className="text-xl font-black text-white" style={{ fontFamily: "'Exo 2',sans-serif" }}>18</p><p className="text-xs text-white/70">Rides</p></div>
            <div className="text-center"><p className="text-xl font-black text-white" style={{ fontFamily: "'Exo 2',sans-serif" }}>5</p><p className="text-xs text-white/70">Achievements</p></div>
            <div className="text-center"><p className="text-xl font-black text-white" style={{ fontFamily: "'Exo 2',sans-serif" }}>#4</p><p className="text-xs text-white/70">Rank</p></div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6 p-1 rounded-2xl w-fit" style={{ background: "#f0f5ff" }}>
        {(["overview", "achievements", "leaderboard", "challenges"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className="px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all" style={{ background: tab === t ? "white" : undefined, color: tab === t ? BLUE : "#5a78a8", boxShadow: tab === t ? "0 2px 8px rgba(26,110,245,0.12)" : undefined }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div>
          <h3 className="font-black text-lg text-[#0d1f3c] mb-4" style={{ fontFamily: "'Exo 2',sans-serif" }}>Your Coupons</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {coupons.map(c => (
              <div key={c.code} className="p-5 rounded-2xl bg-white" style={{ border: `1.5px solid ${c.color}25` }}>
                <p className="text-xs font-bold mb-1" style={{ color: "#5a78a8" }}>COUPON CODE</p>
                <p className="text-2xl font-black mb-1" style={{ fontFamily: "'Exo 2',sans-serif", color: c.color }}>{c.code}</p>
                <p className="text-sm mb-1 text-[#0d1f3c]">{c.desc}</p>
                <p className="text-xs mb-3" style={{ color: "#5a78a8" }}>Expires {c.expires}</p>
                <button className="w-full py-2 rounded-xl text-xs font-bold" style={{ background: `${c.color}15`, color: c.color }}>Copy & Use</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "achievements" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACHIEVEMENTS.map(a => (
            <div key={a.id} className="p-5 rounded-2xl bg-white transition-all hover:shadow-md" style={{ border: `1.5px solid ${a.done ? GREEN : BLUE}18`, opacity: a.done ? 1 : 0.7 }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{a.icon}</span>
                {a.done ? <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: "#f0fdf4", color: GREEN }}>✓ Earned</span>
                  : <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: "#eef4ff", color: BLUE }}>+{a.xp} XP</span>}
              </div>
              <p className="font-black text-sm text-[#0d1f3c] mb-1" style={{ fontFamily: "'Exo 2',sans-serif" }}>{a.title}</p>
              <p className="text-xs" style={{ color: "#5a78a8" }}>{a.desc}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "leaderboard" && (
        <div>
          <div className="flex flex-col gap-3">
            {LEADERBOARD.map(l => (
              <div key={l.rank} className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: l.isMe ? "linear-gradient(135deg,#eef4ff,#f0f5ff)" : "white", border: `1.5px solid ${l.isMe ? BLUE : "rgba(26,110,245,0.1)"}`, boxShadow: l.isMe ? `0 4px 20px ${BLUE}18` : "none" }}>
                <span className="text-2xl w-8 text-center">{l.badge}</span>
                <div className="flex-1">
                  <p className="font-bold text-sm" style={{ color: l.isMe ? BLUE : "#0d1f3c" }}>{l.name}{l.isMe && " (You)"}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#5a78a8" }}>{l.rides} rides · {l.xp.toLocaleString()} XP</p>
                </div>
                <span className="font-black text-lg" style={{ fontFamily: "'Exo 2',sans-serif", color: l.isMe ? BLUE : "#0d1f3c" }}>#{l.rank}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "challenges" && (
        <div className="flex flex-col gap-4">
          {challenges.map((c, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white" style={{ border: `1.5px solid ${(c as any).done ? GREEN : BLUE}18` }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{c.icon}</span>
                <div className="flex-1">
                  <p className="font-bold text-sm text-[#0d1f3c]">{c.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#5a78a8" }}>Reward: +{c.xp} XP</p>
                </div>
                {(c as any).done && <CheckCircle size={18} style={{ color: GREEN }} />}
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1" style={{ color: "#5a78a8" }}><span>{c.progress}/{c.total} completed</span></div>
                <div className="h-2 rounded-full" style={{ background: "#f0f5ff" }}>
                  <div className="h-full rounded-full" style={{ width: `${(c.progress / c.total) * 100}%`, background: `linear-gradient(90deg,${(c as any).done ? GREEN : BLUE},${(c as any).done ? "#059669" : BLUE2})` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <FaqSection
        title="Tickets & Offers FAQs"
        sub="Everything about pass booking, discounts, group packages & refunds"
        faqs={TICKETS_FAQS}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FOOD PAGE
// ═══════════════════════════════════════════════════════════════════════════
function FoodPage() {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [catFilter, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  const cats = ["All", "Fast Food", "Italian", "Grill", "Beverages", "Indian"];
  const filtered = FOODS.filter(f => (catFilter === "All" || f.cat === catFilter) && (f.name.toLowerCase().includes(search.toLowerCase())));
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const food = FOODS.find(f => f.id === Number(id));
    return sum + (food?.price || 0) * qty;
  }, 0);

  const restaurants = [
    { name: "Spice Arena", zone: "Water Zone", wait: "12 min", type: "Indian", emoji: "🍛" },
    { name: "Burger Bay", zone: "Entrance", wait: "5 min", type: "Fast Food", emoji: "🍔" },
    { name: "Pizza Palace", zone: "Zone A", wait: "15 min", type: "Italian", emoji: "🍕" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28 relative">
      <div className="flex items-start justify-between mb-6">
        <SectionHeader title="Food & Dining" accent={ORANGE} sub="Order from our restaurants and food stalls" />
        <button onClick={() => setCartOpen(v => !v)} className="relative flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white" style={{ background: `linear-gradient(135deg,${ORANGE},#ea580c)` }}>
          <ShoppingCart size={15} />Cart
          {totalItems > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs font-black flex items-center justify-center" style={{ background: RED, color: "white" }}>{totalItems}</span>}
        </button>
      </div>

      {/* Restaurants */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {restaurants.map(r => (
          <div key={r.name} className="p-4 rounded-2xl bg-white flex items-center gap-3" style={{ border: "1.5px solid rgba(249,115,22,0.12)" }}>
            <span className="text-3xl">{r.emoji}</span>
            <div className="flex-1">
              <p className="font-black text-sm text-[#0d1f3c]" style={{ fontFamily: "'Exo 2',sans-serif" }}>{r.name}</p>
              <p className="text-xs" style={{ color: "#5a78a8" }}>{r.zone} · {r.type}</p>
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: "#fff0ea", color: ORANGE }}>{r.wait}</span>
          </div>
        ))}
      </div>

      {/* Search & filter */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white" style={{ border: "1.5px solid rgba(249,115,22,0.15)" }}>
          <Search size={15} style={{ color: "#5a78a8" }} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search food…" className="flex-1 text-sm outline-none bg-transparent" style={{ color: "#0d1f3c" }} />
        </div>
      </div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {cats.map(c => <button key={c} onClick={() => setCat(c)} className="px-4 py-1.5 rounded-full text-sm font-bold transition-all" style={{ background: catFilter === c ? `linear-gradient(135deg,${ORANGE},#ea580c)` : "white", color: catFilter === c ? "white" : "#5a78a8", border: `1.5px solid ${catFilter === c ? ORANGE : "rgba(249,115,22,0.15)"}` }}>{c}</button>)}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(food => (
          <div key={food.id} className="rounded-2xl overflow-hidden bg-white" style={{ border: "1.5px solid rgba(249,115,22,0.1)" }}>
            <div className="h-36 overflow-hidden bg-orange-50">
              <img src={food.img} alt={food.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h3 className="font-black text-sm text-[#0d1f3c]" style={{ fontFamily: "'Exo 2',sans-serif" }}>{food.name}</h3>
                  <p className="text-xs" style={{ color: "#5a78a8" }}>{food.cat} · Ready in {food.wait}</p>
                </div>
                {food.popular && <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "#fff0ea", color: ORANGE }}>🔥 Popular</span>}
              </div>
              <div className="flex items-center gap-1 mb-3"><Star size={11} fill={AMBER} style={{ color: AMBER }} /><span className="text-xs font-bold" style={{ color: AMBER }}>{food.rating}</span></div>
              <div className="flex items-center justify-between">
                <p className="font-black text-lg" style={{ fontFamily: "'Exo 2',sans-serif", color: ORANGE }}>₹{food.price}</p>
                <div className="flex items-center gap-2">
                  {cart[food.id] && (
                    <>
                      <button onClick={() => setCart(c => ({ ...c, [food.id]: Math.max(0, c[food.id] - 1) }))} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#fff0ea", color: ORANGE }}><Minus size={12} /></button>
                      <span className="font-bold text-sm w-4 text-center text-[#0d1f3c]">{cart[food.id]}</span>
                    </>
                  )}
                  <button onClick={() => setCart(c => ({ ...c, [food.id]: (c[food.id] || 0) + 1 }))} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg,${ORANGE},#ea580c)`, color: "white" }}><Plus size={12} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart drawer */}
      {cartOpen && totalItems > 0 && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setCartOpen(false)}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative w-80 bg-white h-full shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(249,115,22,0.12)" }}>
              <span className="font-black text-base text-[#0d1f3c]" style={{ fontFamily: "'Exo 2',sans-serif" }}>Your Cart ({totalItems})</span>
              <button onClick={() => setCartOpen(false)}><X size={18} style={{ color: "#5a78a8" }} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
              {Object.entries(cart).filter(([, q]) => q > 0).map(([id, qty]) => {
                const food = FOODS.find(f => f.id === Number(id))!;
                return (
                  <div key={id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#fff8f5" }}>
                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0"><img src={food.img} alt={food.name} className="w-full h-full object-cover" /></div>
                    <div className="flex-1"><p className="font-bold text-sm text-[#0d1f3c]">{food.name}</p><p className="text-xs" style={{ color: ORANGE }}>₹{food.price} each</p></div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setCart(c => ({ ...c, [id]: Math.max(0, c[Number(id)] - 1) }))} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#fff0ea", color: ORANGE }}><Minus size={10} /></button>
                      <span className="font-bold text-xs w-3 text-center">{qty}</span>
                      <button onClick={() => setCart(c => ({ ...c, [id]: c[Number(id)] + 1 }))} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg,${ORANGE},#ea580c)`, color: "white" }}><Plus size={10} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="px-5 py-4" style={{ borderTop: "1px solid rgba(249,115,22,0.12)" }}>
              <div className="flex justify-between text-sm font-bold text-[#0d1f3c] mb-4"><span>Total</span><span>₹{totalPrice}</span></div>
              <button className="w-full py-3 rounded-2xl font-bold text-sm text-white" style={{ background: `linear-gradient(135deg,${ORANGE},#ea580c)` }}>Place Order</button>
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
  const [cart, setCart] = useState<number[]>([]);
  const [catFilter, setCat] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const cats = ["All", "Clothing", "Souvenirs", "Bags", "Toys"];
  const filtered = merch.filter(m => catFilter === "All" || m.cat === catFilter);

  const toggleLike = (id: number) => setMerch(prev => prev.map(m => m.id === id ? { ...m, liked: !m.liked } : m));
  const inCart = (id: number) => cart.includes(id);
  const toggleCart = (id: number) => setCart(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28">
      <div className="flex items-start justify-between mb-6">
        <SectionHeader title="Merchandise" accent={PURPLE} sub="Take a piece of ThrillVerse home with you" />
        <button onClick={() => setCartOpen(v => !v)} className="relative flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white" style={{ background: `linear-gradient(135deg,${PURPLE},#7c3aed)` }}>
          <ShoppingBag size={15} />Bag
          {cart.length > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs font-black flex items-center justify-center" style={{ background: RED, color: "white" }}>{cart.length}</span>}
        </button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {cats.map(c => <button key={c} onClick={() => setCat(c)} className="px-4 py-1.5 rounded-full text-sm font-bold transition-all" style={{ background: catFilter === c ? `linear-gradient(135deg,${PURPLE},#7c3aed)` : "white", color: catFilter === c ? "white" : "#5a78a8", border: `1.5px solid ${catFilter === c ? PURPLE : "rgba(99,102,241,0.15)"}` }}>{c}</button>)}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(m => (
          <div key={m.id} className="group rounded-2xl overflow-hidden bg-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl" style={{ border: "1.5px solid rgba(99,102,241,0.1)" }}>
            <div className="relative h-40 overflow-hidden bg-purple-50">
              <img src={m.img} alt={m.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <button onClick={() => toggleLike(m.id)} className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-md">
                <Heart size={14} fill={m.liked ? RED : "none"} style={{ color: m.liked ? RED : "#5a78a8" }} />
              </button>
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "#eef2ff", color: PURPLE }}>{m.cat}</span>
            </div>
            <div className="p-3">
              <h3 className="font-black text-sm text-[#0d1f3c] mb-1" style={{ fontFamily: "'Exo 2',sans-serif" }}>{m.name}</h3>
              <div className="flex items-center gap-1 mb-2"><Star size={10} fill={AMBER} style={{ color: AMBER }} /><span className="text-xs font-bold" style={{ color: AMBER }}>{m.rating}</span></div>
              <div className="flex items-center justify-between">
                <p className="font-black text-base" style={{ fontFamily: "'Exo 2',sans-serif", color: PURPLE }}>₹{m.price}</p>
                <button onClick={() => toggleCart(m.id)} className="px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all" style={{ background: inCart(m.id) ? `linear-gradient(135deg,${PURPLE},#7c3aed)` : "#eef2ff", color: inCart(m.id) ? "white" : PURPLE }}>
                  {inCart(m.id) ? "✓ Added" : "Add"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart drawer */}
      {cartOpen && cart.length > 0 && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setCartOpen(false)}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative w-80 bg-white h-full shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(99,102,241,0.12)" }}>
              <span className="font-black text-base text-[#0d1f3c]" style={{ fontFamily: "'Exo 2',sans-serif" }}>Shopping Bag ({cart.length})</span>
              <button onClick={() => setCartOpen(false)}><X size={18} style={{ color: "#5a78a8" }} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
              {cart.map(id => {
                const m = merch.find(m => m.id === id)!;
                return (
                  <div key={id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#f5f3ff" }}>
                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0"><img src={m.img} alt={m.name} className="w-full h-full object-cover" /></div>
                    <div className="flex-1"><p className="font-bold text-sm text-[#0d1f3c]">{m.name}</p><p className="text-xs" style={{ color: PURPLE }}>₹{m.price}</p></div>
                    <button onClick={() => toggleCart(id)}><Trash2 size={14} style={{ color: "#5a78a8" }} /></button>
                  </div>
                );
              })}
            </div>
            <div className="px-5 py-4" style={{ borderTop: "1px solid rgba(99,102,241,0.12)" }}>
              <div className="flex justify-between text-sm font-bold text-[#0d1f3c] mb-4">
                <span>Total</span><span>₹{cart.reduce((sum, id) => sum + (merch.find(m => m.id === id)?.price || 0), 0)}</span>
              </div>
              <button className="w-full py-3 rounded-2xl font-bold text-sm text-white" style={{ background: `linear-gradient(135deg,${PURPLE},#7c3aed)` }}>Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PROFILE PAGE (Clean Read-Only View)
// ═══════════════════════════════════════════════════════════════════════════
function ProfilePage({ setPage }: { setPage: (p: string) => void }) {
  const { token, userProfile, fetchWithAuth } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [queueStats, setQueueStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTicketForModal, setActiveTicketForModal] = useState<any | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);

    Promise.all([
      fetchWithAuth("/queue/tickets/").then(res => res.ok ? res.json() : []).catch(() => []),
      fetchWithAuth("/queue/stats/").then(res => res.ok ? res.json() : null).catch(() => null)
    ])
      .then(([ticketsData, statsData]) => {
        setTickets(Array.isArray(ticketsData) ? ticketsData : []);
        setQueueStats(statsData);
      })
      .catch(err => console.error("Error loading profile details:", err))
      .finally(() => setLoading(false));
  }, [token]);

  const u = userProfile?.user || userProfile || {};
  const username = u.username || userProfile?.username || localStorage.getItem("username") || "User";
  const email = u.email || userProfile?.email || localStorage.getItem("user_email") || "Not Specified";
  const firstName = u.first_name || userProfile?.first_name || localStorage.getItem("first_name") || "";
  const lastName = u.last_name || userProfile?.last_name || localStorage.getItem("last_name") || "";

  const formatName = (str: string) => {
    if (!str) return "";
    return str
      .replace(/[_.-]+/g, " ")
      .split(" ")
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const rawFullName = `${firstName} ${lastName}`.trim();
  const fullName = userProfile?.full_name || formatName(rawFullName) || formatName(username) || "User";

  const getInitials = () => {
    if (firstName) return firstName[0].toUpperCase();
    if (username) return username[0].toUpperCase();
    if (fullName) return fullName[0].toUpperCase();
    return "U";
  };

  const getDeterministicQrPath = (tokenStr: any) => {
    let hash = 0;
    const str = String(tokenStr || "qr");
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let path = "";
    for (let y = 0; y < 15; y++) {
      for (let x = 0; x < 15; x++) {
        const bit = (Math.abs(hash) >> ((x + y * 15) % 31)) & 1;
        const isCorner =
          (x < 4 && y < 4) ||
          (x > 10 && y < 4) ||
          (x < 4 && y > 10);
        if (bit || isCorner) {
          path += `M${x * 4} ${y * 4}h4v4h-4z`;
        }
      }
    }
    return path;
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-500">Loading your profile details...</p>
      </div>
    );
  }

  const role = userProfile?.role || (u.is_superuser || u.is_staff ? "Admin" : "User");

  // Stat computation
  const safeTickets = Array.isArray(tickets) ? tickets : [];
  const ridesAttended = queueStats ? (queueStats.total_rides || 0) : 0;
  const ticketsBooked = safeTickets.length;
  const upcomingVisits = safeTickets.filter(t => t && (t.status === "active" || t.status === "valid")).length;
  const completedVisits = safeTickets.filter(t => t && (t.status === "used" || t.status === "completed")).length;

  const thrillMap = ["Mild", "Mild", "Moderate", "Extreme"];
  const preferredThrillStr = thrillMap[userProfile?.preferred_thrill ?? 2] || "Moderate";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-28">
      <SectionHeader title="My Profile" accent={BLUE} sub="Manage your ThrillVerse account, tickets, and park stats" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-4">
        {/* Profile Header Sidebar */}
        <div className="md:col-span-1 p-6 rounded-3xl bg-white border border-slate-100 shadow-lg text-center flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full mb-4 flex items-center justify-center border-4 border-blue-50 select-none shadow-md overflow-hidden bg-slate-50">
            {userProfile?.profile_picture ? (
              <img src={userProfile.profile_picture} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-black font-poppins">
                {getInitials()}
              </div>
            )}
          </div>
          <h2 className="text-lg font-black text-[#0d1f3c] mb-1 font-poppins">{fullName}</h2>
          <p className="text-xs text-slate-500 mb-2">{email}</p>
          <span className="px-3 py-1 rounded-full text-[10px] font-black text-blue-600 bg-blue-50 uppercase tracking-wider">
            {role} Member
          </span>
          <p className="text-[10px] text-slate-400 mt-4">Member since 2026</p>
          {role?.toLowerCase() !== "user" && (
            <button
              onClick={() => setPage(PAGES.ADMIN)}
              className="mt-4 w-full bg-[#1a6ef5] hover:bg-[#0052cc] text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              💼 Admin Panel
            </button>
          )}
        </div>

        {/* Account Details & Stats */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Account Details Grid */}
          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-md">
            <h3 className="text-sm font-black text-[#0d1f3c] mb-4 uppercase tracking-wider font-poppins">Account Information</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-400 font-bold mb-1">Username</p>
                <p className="text-[#0d1f3c] font-black">{username}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold mb-1">Full Name</p>
                <p className="text-[#0d1f3c] font-black">{fullName}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold mb-1">Email Address</p>
                <p className="text-[#0d1f3c] font-black">{email}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold mb-1">Phone Number</p>
                <p className="text-[#0d1f3c] font-black">{userProfile?.phone_number || "+91 Not Specified"}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold mb-1">Preferred Thrill Level</p>
                <p className="text-[#0d1f3c] font-black">{preferredThrillStr}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold mb-1">Location</p>
                <p className="text-[#0d1f3c] font-black">
                  {[userProfile?.city, userProfile?.state, userProfile?.country].filter(Boolean).join(", ") || "Not Specified"}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-400">
              <span>🔒 Profile details are read-only</span>
            </div>
          </div>

          {/* Stat Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Rides Attended", count: ridesAttended, color: BLUE, icon: "🎢" },
              { label: "Tickets Booked", count: ticketsBooked, color: AMBER, icon: "🎟️" },
              { label: "Upcoming Visits", count: upcomingVisits, color: GREEN, icon: "📅" },
              { label: "Completed Visits", count: completedVisits, color: RED, icon: "✅" }
            ].map(stat => (
              <div key={stat.label} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
                <span className="absolute -right-2 -bottom-2 text-3xl opacity-10 group-hover:scale-110 transition-transform">{stat.icon}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                <span className="text-2xl font-black mt-2 font-poppins" style={{ color: stat.color }}>{stat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tickets Section */}
      <div className="mt-8">
        <h3 className="text-base font-black text-[#0d1f3c] mb-4 uppercase tracking-wider font-poppins">My Booked Tickets</h3>
        {safeTickets.length === 0 ? (
          <div className="p-12 rounded-3xl bg-slate-50 text-center border-2 border-dashed border-slate-200">
            <span className="text-4xl mb-3 block">🎟️</span>
            <h4 className="text-sm font-black text-[#0d1f3c] mb-1 font-poppins">You haven't booked any tickets yet.</h4>
            <p className="text-xs text-slate-500 mb-6">Explore ThrillVerse attractions and book your day pass instantly.</p>
            <button onClick={() => setPage(PAGES.HOME)} className="px-6 py-2 rounded-full font-bold text-xs text-white" style={{ background: `linear-gradient(135deg,${BLUE},${BLUE2})` }}>
              Book Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {safeTickets.map((ticket, idx) => (
              <div key={ticket.ticket_id || ticket.id || idx} className="p-5 rounded-2xl bg-white border border-slate-150 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-blue-50 text-blue-600 uppercase tracking-wider">
                      {ticket.ticket_type || ticket.type || "Ticket"}
                    </span>
                    <h4 className="text-sm font-black text-[#0d1f3c] mt-1.5 font-poppins">{ticket.holder_name || ticket.name || fullName}</h4>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${ticket.status === "active" || ticket.status === "valid" ? "bg-green-50 text-green-600" :
                    ticket.status === "used" ? "bg-slate-100 text-slate-500" :
                      "bg-red-50 text-red-600"
                    }`}>
                    {ticket.status || "valid"}
                  </span>
                </div>

                <div className="flex gap-4 items-center mt-3 pt-3 border-t border-slate-50">
                  {ticket.qr_code_base64 ? (
                    <img
                      src={ticket.qr_code_base64}
                      className="w-14 h-14 object-contain rounded-lg border border-slate-200 p-0.5 shrink-0 bg-white"
                      alt="Ticket QR"
                    />
                  ) : (
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ticket.ticket_id || ticket.id || "TV-PASS")}`}
                      alt="Scannable QR Code"
                      className="w-14 h-14 object-contain rounded-lg border border-slate-200 p-0.5 shrink-0 bg-white"
                    />
                  )}
                  <div className="flex-1 text-xs">
                    <p className="text-slate-400 font-bold mb-0.5">Ticket ID: <span className="text-[#0d1f3c] font-black">{ticket.ticket_id || ticket.id || "TV-9000"}</span></p>
                    <p className="text-slate-400 font-bold">Valid Date: <span className="text-[#0d1f3c] font-black">{ticket.valid_date || ticket.date || "Today"}</span></p>
                  </div>
                </div>

                <button onClick={() => setActiveTicketForModal(ticket)} className="w-full mt-4 py-2 rounded-xl text-xs font-bold text-center bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors border border-slate-100">
                  View Ticket QR
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ticket Modal Takeover */}
      {activeTicketForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setActiveTicketForModal(null)}>
          <div className="absolute inset-0 bg-[#060d28]/70 backdrop-blur-md" />
          <div className="relative w-full max-w-[340px] rounded-3xl bg-white p-6 shadow-2xl text-center border border-slate-100" onClick={e => e.stopPropagation()}>
            <button onClick={() => setActiveTicketForModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={16} /></button>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-600 uppercase tracking-widest">
              {activeTicketForModal.ticket_type}
            </span>
            <h4 className="text-lg font-black text-[#0d1f3c] mt-2 font-poppins">{activeTicketForModal.holder_name}</h4>
            <p className="text-xs text-slate-400 mt-1 mb-6">ID: {activeTicketForModal.ticket_id} · Valid: {activeTicketForModal.valid_date}</p>

            <div className="w-48 h-48 mx-auto p-2 rounded-3xl border border-slate-100 shadow-inner flex items-center justify-center bg-white mb-6">
              <img
                src={activeTicketForModal.qr_code_base64 || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(activeTicketForModal.ticket_id || "TV-PASS")}`}
                className="w-full h-full object-contain rounded-2xl"
                alt="Ticket QR"
              />
            </div>

            <p className="text-xs text-slate-500 leading-relaxed px-2">
              Scan this ticket QR at the main entrance gate or ride turnstile turners to board immediately.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ATTRACTIONS DATA — Events First, Characters Secondary
// ═══════════════════════════════════════════════════════════════════════════

const EVENTS = [
  {
    id: 1, name: "Sky Spectacular Parade", category: "Parade",
    time: "10:00 AM", endTime: "10:45 AM", duration: "45 min", zone: "Main Boulevard", status: "upcoming",
    description: "The park's flagship morning parade with all ThrillVerse characters on five spectacular themed floats. A full celebration of adventure, colour and imagination.",
    highlights: ["5 Themed Floats", "All 4 Characters", "Live Band", "Confetti Shower"],
    characters: ["Spark", "Nova", "Bolt", "Splash"],
    route: ["Main Gate", "Grand Plaza", "Thriller Zone", "Water Zone Entry", "Central Stage"],
    crowd: "High",
    img: "https://images.unsplash.com/photo-1666272470293-e491e7a289ac?w=700&h=480&fit=crop&auto=format",
  },
  {
    id: 2, name: "Thunder Beats Live Show", category: "Live Show",
    time: "12:30 PM", endTime: "1:30 PM", duration: "60 min", zone: "Central Plaza", status: "live",
    description: "A high-energy live music and dance performance at Central Plaza stage. Features acrobatics, live percussion and an electrifying light show.",
    highlights: ["Live Band", "Acrobatics", "Light Show", "Audience Participation"],
    characters: ["Bolt"],
    route: ["Central Plaza Stage — Fixed Venue"],
    crowd: "Moderate",
    img: "https://images.unsplash.com/photo-1577042816206-2e85c23f2392?w=700&h=480&fit=crop&auto=format",
  },
  {
    id: 3, name: "Fantasy Carnival Parade", category: "Parade",
    time: "4:00 PM", endTime: "4:45 PM", duration: "45 min", zone: "Adventure Street", status: "upcoming",
    description: "The afternoon parade winds through Adventure Street with vibrant floats, stilt walkers, fire performers and interactive moments at every corner.",
    highlights: ["Stilt Walkers", "Fire Performers", "Carnival Floats", "Meet Characters"],
    characters: ["Spark", "Splash"],
    route: ["Carnival Gate", "Adventure Street", "Jungle Path", "Fantasy Square"],
    crowd: "High",
    img: "https://images.unsplash.com/photo-1762639112031-26c76246101f?w=700&h=480&fit=crop&auto=format",
  },
  {
    id: 4, name: "Galaxy Lights Night Parade", category: "Night Parade",
    time: "8:00 PM", endTime: "8:30 PM", duration: "30 min", zone: "Castle Avenue", status: "upcoming",
    description: "The day's spectacular finale. Glowing floats, laser beams, thousands of LED lights and a firework finale transform Castle Avenue into a night to remember.",
    highlights: ["LED Floats", "Laser Show", "Fireworks", "Glowing Characters"],
    characters: ["Nova", "Spark"],
    route: ["Castle Gate", "Galaxy Bridge", "Star Plaza", "Grand Finale Stage"],
    crowd: "Very High",
    img: "https://images.unsplash.com/photo-1761853321810-f4f9b843eda2?w=700&h=480&fit=crop&auto=format",
  },
];

const THRILLVERSE_CHARS = [
  {
    id: 1, name: "Tubbby", role: "The Flying Elephant", color: "#e53e3e", bg: "#fff5f5",
    img: tubbbyImg, imgPos: "center",
    desc: "When Tubbby was little, he dreamt of flying. Even when everyone told him otherwise, he didn't back down. Our flying elephant knows how dearly every kid holds his ambition — so Tubbby is here to give a flight to every kid's dream.",
    personality: "Optimistic, Fearless, Inspiring",
    funFact: "Tubbby is the only elephant in the world who actually achieved his dream of flying!",
    facts: [
      "Tubbby is the only elephant in the world who actually achieved his dream of flying!",
      "He loves meeting kids in the Kids Zone and giving high-fives.",
      "He is known for his colorful parade costume."
    ],
    favoriteRide: "Flying Elephant Ride",
    meet: "Kids Zone — Zone D", meetTime: "11:00 AM & 3:30 PM",
    shows: ["Morning Parade: 10:00 AM", "Kids Show: 2:00 PM", "Evening Parade: 6:00 PM"],
  },
  {
    id: 2, name: "Detective Bow Wow", role: "Park Detective & Comedian", color: "#c05621", bg: "#fffaf0",
    img: bowWowImg, imgPos: "center",
    desc: "Making sure to keep the smiles intact with his toxic enthusiasm and witty comebacks, Detective Bow Wow is ThrillVerse's very own Mr. Funny Bones. But he's more than just a comedian — no mystery can stay unsolved under his keen watch.",
    personality: "Witty, Enthusiastic, Clever",
    funFact: "Detective Bow Wow has solved over 500 park mysteries — all involving missing ice cream!",
    facts: [
      "Detective Bow Wow has solved over 500 park mysteries — all involving missing ice cream!",
      "He uses a magnifying glass to inspect cookies.",
      "He performs a stand-up comedy set twice a day."
    ],
    favoriteRide: "Mystic Manor Maze",
    meet: "Central Plaza", meetTime: "12:00 PM & 4:00 PM",
    shows: ["Comedy Hour: 12:30 PM", "Mystery Show: 5:00 PM"],
  },
  {
    id: 3, name: "Neera & Shera", role: "Mermaid Princess of the Deep", color: "#6b46c1", bg: "#f5f3ff",
    img: neeraImg, imgPos: "center",
    desc: "Brave as a soldier, Neera is the mermaid princess who lives underneath the oceans. She is the most fearless mermaid and doesn't hesitate in taking on new challenges for the ones she loves. She sees through everyone's appearance and recognises their inner goodness.",
    personality: "Brave, Compassionate, Fearless",
    funFact: "Neera can see through anyone's appearance and instantly recognise their inner goodness!",
    facts: [
      "Neera can see through anyone's appearance and instantly recognise their inner goodness!",
      "She is the protector of the underwater kingdom.",
      "She loves collection of shells and ocean relics."
    ],
    favoriteRide: "Tsunami Falls",
    meet: "Water Zone — Zone B", meetTime: "10:30 AM & 3:00 PM",
    shows: ["Water Show: 11:00 AM", "Aqua Performance: 4:30 PM"],
  },
  {
    id: 4, name: "Rajasaurus", role: "Friendliest Dino in the Park", color: "#2b6cb0", bg: "#ebf8ff",
    img: rajasaurusImg, imgPos: "center",
    desc: "Most likely to scare you at first sight, Rajasaurus is the friendliest dino at ThrillVerse. He loves playing the host and having people over for tea parties. No matter who he meets, he'll make sure to compliment them and make their day!",
    personality: "Friendly, Hospitable, Cheerful",
    funFact: "Rajasaurus holds the park record for most tea parties hosted in a single day — 8 parties!",
    facts: [
      "Rajasaurus holds the park record for most tea parties hosted in a single day — 8 parties!",
      "He prefers chamomile tea with honey.",
      "He loves taking goofy group photos with park guests."
    ],
    favoriteRide: "Nitro",
    meet: "Thriller Zone Hub — Zone A", meetTime: "11:30 AM & 5:00 PM",
    shows: ["Dino Show: 1:00 PM", "Evening Parade: 6:00 PM"],
  },
];

const ENTERTAINMENT_ACTS = [
  {
    id: 1, name: "Bhangra Boys", emoji: "🥁",
    desc: "Every move they make will rock you off your feet. Step up with us as the Bhangra Boys compel you to shake a leg. Get Down there!",
    img: bhangraBoysImg,
    color: "#e53e3e", bg: "#fff5f5",
  },
  {
    id: 2, name: "Hip Hop Dancers", emoji: "🎤",
    desc: "These hip hoppers will blow your mind as they work their moves on the grooviest numbers in town. Get your move on already!",
    img: "https://images.unsplash.com/photo-1761882619891-6529ff92df0a?w=500&h=380&fit=crop&auto=format",
    color: "#6b46c1", bg: "#f5f3ff",
  },
  {
    id: 3, name: "Acrobats", emoji: "🎪",
    desc: "You could've never imagined a human doing the tricks with their bodies the way these guys pull off. Don't miss the acrobats for an absolute visual treat!",
    img: acrobatsImg,
    color: "#2b6cb0", bg: "#ebf8ff",
  },
  {
    id: 4, name: "Magic Show", emoji: "🎩",
    desc: "This isn't ThrillVerse without a little bit of Magic! Experience the most out-of-this-world magic tricks, which you might have seen only in movies yet.",
    img: "https://images.unsplash.com/photo-1571235479512-36bb46e1c587?w=500&h=380&fit=crop&auto=format",
    color: "#2d3748", bg: "#f7fafc",
  },
];

const FESTIVALS = [
  {
    id: 1, name: "Summer Splash Festival", dates: "Jun 1 – Aug 31", emoji: "☀️", color: CYAN,
    desc: "All-day water events, splash zones and summer entertainment across Zone B.",
    img: "https://images.unsplash.com/photo-1562874662-050427780b20?w=600&h=380&fit=crop&auto=format",
    fullDetails: "Join us for the ultimate summer celebration at ThrillVerse! Summer Splash Festival brings DJ foam parties, giant water slides, live music stages, refreshing mocktail bars, and exclusive water coaster access. Included free with all General Admission park passes.",
    celebrationInfo: "We celebrate by filling the park with live DJ stages, high-velocity foam cannons, interactive splash battles, tropical food pop-ups, and an evening aquatic laser parade across the lagoon!",
    location: "Water Zone B & Lagoon Stage",
    timings: "10:00 AM – 8:00 PM Daily",
    highlights: ["DJ Foam Parties", "Giant Water Plunge", "Tropical Mocktail Bar", "Sunset Laser Splash"]
  },
  {
    id: 2, name: "Halloween Nights", dates: "Oct 1 – Oct 31", emoji: "🎃", color: ORANGE,
    desc: "Spooky shows, haunted zones, costume parades and themed rides after dark.",
    img: "https://images.unsplash.com/photo-1761853321810-f4f9b843eda2?w=600&h=380&fit=crop&auto=format",
    fullDetails: "When the sun sets, ThrillVerse transforms into a spine-chilling haunted spectacle. Experience 5 haunted houses, scare zones filled with roaming monsters, costume contests, horror mazes, and the iconic Midnight Ghost Parade.",
    celebrationInfo: "We celebrate after dark with atmospheric fog, 5 intense haunted house walkthroughs, monster scare actors roaming the paths, trick-or-treat candy trails, and the midnight ghost costume parade!",
    location: "Park-wide (Focus on Zone A & C)",
    timings: "6:00 PM – 11:00 PM (Oct 1–31)",
    highlights: ["5 Haunted Houses", "Midnight Ghost Parade", "Scare Zones", "Costume Contest"]
  },
  {
    id: 3, name: "Winter Wonderland", dates: "Dec 1 – Dec 31", emoji: "❄️", color: BLUE,
    desc: "Snow effects, holiday shows, festive parades and a magical lights trail through the park.",
    img: "https://images.unsplash.com/photo-1764422474375-97b032a5190d?w=600&h=380&fit=crop&auto=format",
    fullDetails: "Step into a magical snowy fairy tale at ThrillVerse. Enjoy artificial snow showers every hour, hot cocoa huts, ice skating rink, Santa's Workshop meet & greet, and a 50-foot grand LED Christmas tree display.",
    celebrationInfo: "We celebrate with hourly artificial snow showers over Main Plaza, Christmas carol performances, outdoor ice skating, giant festive light trees, and cozy hot chocolate chalets!",
    location: "Main Plaza & Zone C",
    timings: "11:00 AM – 10:00 PM Daily",
    highlights: ["Hourly Snow Showers", "Ice Skating Rink", "Santa Meet & Greet", "50ft LED Tree"]
  },
  {
    id: 4, name: "Festival of Lights", dates: "Jan 14 – Jan 26", emoji: "✨", color: AMBER,
    desc: "Thousands of illuminated installations, light parades and firework shows across all zones.",
    img: "https://images.unsplash.com/photo-1764515836774-eee30a42de1d?w=600&h=380&fit=crop&auto=format",
    fullDetails: "A radiant celebration featuring over 100,000 glowing lanterns, 3D projection mapping on park monuments, nightly grand firework displays, and traditional cultural music & dance performances.",
    celebrationInfo: "We celebrate by illuminating the entire park with over 100,000 glowing lanterns, 3D building projection mapping, live traditional cultural music, and grand fireworks over the central lake!",
    location: "All Park Zones & Main Lake",
    timings: "5:30 PM – 10:00 PM Daily",
    highlights: ["100,000+ Lanterns", "3D Projection Mapping", "Nightly Fireworks", "Cultural Dance"]
  },
];

const ATTR_GALLERY = [
  { src: "https://images.unsplash.com/photo-1666272470293-e491e7a289ac?w=500&h=380&fit=crop&auto=format", label: "Morning Parade" },
  { src: "https://images.unsplash.com/photo-1577042816206-2e85c23f2392?w=500&h=380&fit=crop&auto=format", label: "Live Show" },
  { src: "https://images.unsplash.com/photo-1762639112031-26c76246101f?w=500&h=760&fit=crop&auto=format", label: "Fantasy Carnival" },
  { src: "https://images.unsplash.com/photo-1574504212584-29a03eb6e41e?w=500&h=380&fit=crop&auto=format", label: "Audience" },
  { src: "https://images.unsplash.com/photo-1761853321810-f4f9b843eda2?w=500&h=380&fit=crop&auto=format", label: "Night Parade" },
  { src: "https://images.unsplash.com/photo-1631800744240-d95925aacb01?w=500&h=380&fit=crop&auto=format", label: "Park Crowd" },
  { src: "https://images.unsplash.com/photo-1601930113377-729966035f34?w=500&h=380&fit=crop&auto=format", label: "Swing Ride" },
  { src: "https://images.unsplash.com/photo-1762639111748-982bda14135e?w=500&h=380&fit=crop&auto=format", label: "Night Rides" },
  { src: "https://images.unsplash.com/photo-1760281487360-68bf06368e6d?w=500&h=380&fit=crop&auto=format", label: "Water Zone" },
];

// placeholder so old CHARACTERS references don't break
const CHARACTERS = [
  {
    id: 1, name: "Thunder Wolf", role: "Thriller Zone Guardian", color: ORANGE, zone: "Zone A",
    description: "The fearless guardian who leads every thrill-seeker through the most adrenaline-pumping adventures.",
    image: "https://images.unsplash.com/photo-1547675960-7634cf1b0856?w=400&h=400&fit=crop&auto=format"
  },
  {
    id: 2, name: "Aqua Blue", role: "Water Zone Duchess", color: CYAN, zone: "Zone B",
    description: "The playful spirit who keeps the waves rolling and the splashes flying all day long.",
    image: "https://images.unsplash.com/photo-1760281487360-68bf06368e6d?w=400&h=400&fit=crop&auto=format"
  },
  {
    id: 3, name: "Forest Fairy", role: "Family Zone Guide", color: INDIGO, zone: "Zone C",
    description: "The magical guide who creates unforgettable memories for families with her enchanted touch.",
    image: "https://images.unsplash.com/photo-1534283542176-7cb0c9ac33e0?w=400&h=400&fit=crop&auto=format"
  },
  {
    id: 4, name: "Mini Roar", role: "Kids Zone Hero", color: GREEN, zone: "Zone D",
    description: "The lovable champion who makes every kid feel like a superhero from the moment they arrive.",
    image: "https://images.unsplash.com/photo-1692301311188-bda319576dd1?w=400&h=400&fit=crop&auto=format"
  },
  {
    id: 5, name: "Captain Splash", role: "Water Rides Captain", color: BLUE, zone: "Zone B",
    description: "The daring captain who ensures every splash is more epic than the last.",
    image: "https://images.unsplash.com/photo-1631800744177-0e434940e0c8?w=400&h=400&fit=crop&auto=format"
  },
  {
    id: 6, name: "Star Racer", role: "Speed Zone Champion", color: AMBER, zone: "Zone A",
    description: "The speed demon who holds the record for the fastest lap on every coaster in the park.",
    image: "https://images.unsplash.com/photo-1761501638917-f6fb28a84adb?w=400&h=400&fit=crop&auto=format"
  },
  {
    id: 7, name: "Luna Twist", role: "Night Show Star", color: PURPLE, zone: "Main Stage",
    description: "The dazzling performer who lights up the sky every night with spectacular fireworks.",
    image: "https://images.unsplash.com/photo-1504027973709-58986e840e79?w=400&h=400&fit=crop&auto=format"
  },
  {
    id: 8, name: "Jungle Jack", role: "Safari Explorer", color: GREEN, zone: "Zone C",
    description: "The adventurous explorer who guides families through the wildest jungle safari experience.",
    image: "https://images.unsplash.com/photo-1460176449511-ff5fc8e64c35?w=400&h=400&fit=crop&auto=format"
  },
];

const GALLERY_IMAGES = [
  { id: 1, src: "https://images.unsplash.com/photo-1547675960-7634cf1b0856?w=500&h=380&fit=crop&auto=format", alt: "Nitro" },
  { id: 2, src: "https://images.unsplash.com/photo-1601930113377-729966035f34?w=500&h=380&fit=crop&auto=format", alt: "Swing Ride" },
  { id: 3, src: "https://images.unsplash.com/photo-1760281487360-68bf06368e6d?w=500&h=380&fit=crop&auto=format", alt: "Water Ride" },
  { id: 4, src: "https://images.unsplash.com/photo-1692301311188-bda319576dd1?w=500&h=380&fit=crop&auto=format", alt: "Sky Wheel" },
  { id: 5, src: "https://images.unsplash.com/photo-1761501638917-f6fb28a84adb?w=500&h=380&fit=crop&auto=format", alt: "Night Ride" },
  { id: 6, src: "https://images.unsplash.com/photo-1631800744177-0e434940e0c8?w=500&h=380&fit=crop&auto=format", alt: "Splash Ride" },
  { id: 7, src: "https://images.unsplash.com/photo-1536302996699-caceffbc68df?w=500&h=380&fit=crop&auto=format", alt: "Coaster" },
  { id: 8, src: "https://images.unsplash.com/photo-1504027973709-58986e840e79?w=500&h=380&fit=crop&auto=format", alt: "Night Show" },
  { id: 9, src: "https://images.unsplash.com/photo-1460176449511-ff5fc8e64c35?w=500&h=380&fit=crop&auto=format", alt: "Carnival" },
];

const PARADE_DATA = [
  {
    id: 1,
    title: "Grand ThrillVerse Parade",
    description: "The flagship parade that kicks off every morning with all ThrillVerse characters, spectacular floats, live music, and a non-stop celebration of thrills. Every float is uniquely designed for each zone — from fire-breathing thriller beasts to dancing water sprites. Arrive early for front-row spots!",
    timings: ["10:00 AM", "2:00 PM", "6:00 PM"],
    duration: "45 minutes",
    location: "Main Boulevard",
    img: "https://images.unsplash.com/photo-1631800744240-d95925aacb01?w=700&h=480&fit=crop&auto=format",
    highlights: ["All 8 Characters", "5 Spectacular Floats", "Live Band", "Confetti Shower"],
  },
  {
    id: 2,
    title: "Aqua Splash Night Parade",
    description: "An electrifying night parade through the Water Zone featuring glowing floats, water cannons, and the park's beloved water characters lighting up the evening sky. Bring a raincoat — things get wonderfully wet! The perfect end to a thrilling day at ThrillVerse.",
    timings: ["7:30 PM", "9:00 PM"],
    duration: "30 minutes",
    location: "Water Zone Path",
    img: "https://images.unsplash.com/photo-1764105440301-0869c5cebb9f?w=700&h=480&fit=crop&auto=format",
    highlights: ["Glowing Floats", "Water Cannons", "Laser Show", "Night Fireworks"],
  },
];

const FEATURED_CHARS = [
  {
    id: 1,
    name: "Thunder Wolf",
    title: "Meet the Guardian of Zone A",
    description: "Thunder Wolf is the fearless guardian who has protected the Thriller Zone since the very first day ThrillVerse opened. With lightning-fast reflexes and an unbreakable spirit, he leads every brave adventurer through the most heart-pounding rides. Meet him at the Zone A entrance every morning for a photo and an autograph!",
    img: "https://images.unsplash.com/photo-1547675960-7634cf1b0856?w=700&h=500&fit=crop&auto=format",
    meet: "Zone A Entrance · 11:00 AM & 3:00 PM",
    color: ORANGE,
    bg: "#fff7f0",
  },
  {
    id: 2,
    name: "Luna Twist",
    title: "The Star of Every Night Show",
    description: "Luna Twist transforms ThrillVerse every evening into a world of light, colour and wonder. Her nightly performance at the Main Stage is the most anticipated event — a breathtaking 30-minute show with fireworks, laser beams, and a story that touches every heart. Grab your seats by 7:45 PM!",
    img: "https://images.unsplash.com/photo-1504027973709-58986e840e79?w=700&h=500&fit=crop&auto=format",
    meet: "Main Stage · 8:00 PM Daily",
    color: PURPLE,
    bg: "#f5f3ff",
  },
];

const DAILY_PERFS = [
  { time: "10:00 AM", title: "Morning Grand Parade", venue: "Main Boulevard", duration: "45 min", emoji: "🎉" },
  { time: "12:30 PM", title: "Character Meet & Greet", venue: "Central Plaza", duration: "60 min", emoji: "🤝" },
  { time: "2:00 PM", title: "Stunt Spectacular Show", venue: "Arena East", duration: "25 min", emoji: "🎪" },
  { time: "4:00 PM", title: "Magic & Illusions", venue: "Family Stage", duration: "30 min", emoji: "🎩" },
  { time: "6:00 PM", title: "Afternoon Grand Parade", venue: "Main Boulevard", duration: "45 min", emoji: "🎠" },
  { time: "8:00 PM", title: "Luna's Night Extravaganza", venue: "Main Stage", duration: "30 min", emoji: "🌟" },
];

// ═══════════════════════════════════════════════════════════════════════════
// CharacterCard — reusable card component
// Props: image, name, role, description, color
// ═══════════════════════════════════════════════════════════════════════════
function CharacterCard({ image, name, role, description, color, zone }:
  { image: string; name: string; role: string; description: string; color: string; zone: string }) {
  return (
    <div
      className="group relative flex-shrink-0 w-60 rounded-2xl overflow-hidden bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
      style={{ border: `1.5px solid ${color}22`, boxShadow: `0 4px 16px ${color}10` }}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden" style={{ background: `${color}10` }}>
        <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${color}66 0%, transparent 55%)` }} />
        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: color }}>
          {zone}
        </span>
      </div>
      {/* Body */}
      <div className="p-4">
        <h3 className="font-black text-base text-[#0d1f3c] mb-0.5" style={{ fontFamily: "'Exo 2',sans-serif" }}>{name}</h3>
        <p className="text-xs font-bold mb-2" style={{ color }}>{role}</p>
        <p className="text-xs leading-relaxed" style={{ color: "#5a78a8" }}>{description}</p>
        <button className="mt-3 w-full py-1.5 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
          style={{ background: `linear-gradient(135deg,${color},${color}bb)` }}>
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
  const sliderRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
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
    sliderRef.current.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Left button */}
      <button
        onClick={() => scrollBy(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
        style={{ background: `linear-gradient(135deg,${BLUE},${BLUE2})`, color: "white" }}
      >
        <ChevronLeft size={18} />
      </button>

      {/* Slider container — overflow-x-auto, scrollbar hidden */}
      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto pb-3"
        style={{ scrollbarWidth: "none", scrollBehavior: "auto" }}
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
        style={{ background: `linear-gradient(135deg,${BLUE},${BLUE2})`, color: "white" }}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ParadeSection — two-column: image left / info right (alternates per index)
// ═══════════════════════════════════════════════════════════════════════════
function ParadeSection({ parade, index }: { parade: typeof PARADE_DATA[0]; index: number }) {
  const isEven = index % 2 === 0;
  return (
    <div className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 lg:gap-12 items-center`}>
      {/* Image / video thumbnail */}
      <div className="w-full lg:w-1/2 rounded-3xl overflow-hidden shadow-xl" style={{ aspectRatio: "16/9" }}>
        <img src={parade.img} alt={parade.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
      </div>

      {/* Info */}
      <div className="w-full lg:w-1/2">
        <p className="text-xs font-black tracking-widest mb-2" style={{ color: ORANGE }}>🎠 PARADE</p>
        <h2 className="text-3xl font-black text-[#0d1f3c] mb-4" style={{ fontFamily: "'Exo 2',sans-serif" }}>{parade.title}</h2>
        <p className="text-sm leading-relaxed mb-5" style={{ color: "#5a78a8" }}>{parade.description}</p>

        {/* Highlights */}
        <div className="flex flex-wrap gap-2 mb-5">
          {parade.highlights.map(h => (
            <span key={h} className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: "#fff7f0", color: ORANGE }}>✦ {h}</span>
          ))}
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Duration", value: parade.duration },
            { label: "Location", value: parade.location },
            { label: "Shows/Day", value: `${parade.timings.length}x Daily` },
          ].map(({ label, value }) => (
            <div key={label} className="p-3 rounded-2xl text-center" style={{ background: "#f0f5ff" }}>
              <p className="text-xs font-black text-[#0d1f3c]">{value}</p>
              <p className="text-[10px] mt-0.5" style={{ color: "#5a78a8" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Timings */}
        <div>
          <p className="text-xs font-bold mb-2" style={{ color: "#5a78a8" }}>SHOW TIMINGS</p>
          <div className="flex flex-wrap gap-2">
            {parade.timings.map(t => (
              <span key={t} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold" style={{ background: `${BLUE}15`, color: BLUE }}>
                <Clock size={12} /> {t}
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
function FeaturedCharacter({ char, index }: { char: typeof FEATURED_CHARS[0]; index: number }) {
  const isEven = index % 2 === 0;
  return (
    <div className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-10 lg:gap-16 items-center`}>
      {/* Image */}
      <div className="w-full lg:w-5/12 rounded-3xl overflow-hidden shadow-2xl" style={{ aspectRatio: "4/3" }}>
        <img src={char.img} alt={char.name} className="w-full h-full object-cover" />
      </div>

      {/* Info */}
      <div className="w-full lg:w-7/12">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-black mb-4" style={{ background: char.bg, color: char.color }}>
          ⭐ FEATURED CHARACTER
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#0d1f3c] mb-4 leading-tight" style={{ fontFamily: "'Exo 2',sans-serif" }}>
          {char.title}
        </h2>
        <p className="text-sm leading-relaxed mb-6" style={{ color: "#5a78a8" }}>{char.description}</p>

        {/* Meet info */}
        <div className="flex items-center gap-3 p-4 rounded-2xl mb-6" style={{ background: char.bg, border: `1.5px solid ${char.color}25` }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: char.color }}>
            <MapPin size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold" style={{ color: char.color }}>MEET & GREET</p>
            <p className="text-sm font-bold text-[#0d1f3c]">{char.meet}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white transition-all hover:shadow-lg hover:opacity-90"
            style={{ background: `linear-gradient(135deg,${char.color},${char.color}bb)` }}>
            <MapPin size={14} /> Find on Map
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all hover:shadow-md"
            style={{ background: char.bg, color: char.color, border: `1.5px solid ${char.color}30` }}>
            <Star size={14} /> Learn More
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
  const [selected, setSelected] = useState<typeof GALLERY_IMAGES[0] | null>(null);
  return (
    <div>
      {/* Grid: 3 cols desktop, 2 tablet, 1 mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GALLERY_IMAGES.map(img => (
          <div
            key={img.id}
            className="group relative rounded-2xl overflow-hidden cursor-pointer"
            style={{ aspectRatio: "4/3", boxShadow: "0 4px 16px rgba(26,110,245,0.08)" }}
            onClick={() => setSelected(img)}
          >
            <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "rgba(13,31,60,0.5)" }}>
              <span className="px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}>
                View Photo
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
              style={{ background: "linear-gradient(to top,rgba(13,31,60,0.8),transparent)" }}>
              <p className="text-xs font-bold text-white">{img.alt}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)" }} />
          <div className="relative max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <img src={selected.src.replace("w=500&h=380", "w=900&h=600")} alt={selected.alt} className="w-full object-cover" />
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.9)" }}>
              <X size={16} style={{ color: "#0d1f3c" }} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-5" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.7),transparent)" }}>
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
    <div className="rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg,#eef4ff,#f0f5ff)", border: "1.5px solid rgba(26,110,245,0.15)" }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Left: schedule */}
        <div className="p-8">
          <p className="text-xs font-black tracking-widest mb-2" style={{ color: BLUE }}>TODAY'S SCHEDULE</p>
          <h2 className="text-3xl font-black text-[#0d1f3c] mb-6" style={{ fontFamily: "'Exo 2',sans-serif" }}>
            Daily <span style={{ color: BLUE }}>Performances</span>
          </h2>
          <div className="flex flex-col gap-3">
            {DAILY_PERFS.map((p, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-white transition-all hover:shadow-md"
                style={{ border: "1px solid rgba(26,110,245,0.08)" }}>
                <span className="text-xl w-8 text-center">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-[#0d1f3c] truncate">{p.title}</p>
                  <p className="text-[11px]" style={{ color: "#5a78a8" }}>{p.venue} · {p.duration}</p>
                </div>
                <span className="text-sm font-black shrink-0" style={{ fontFamily: "'Exo 2',sans-serif", color: BLUE }}>{p.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: CTA */}
        <div className="p-8 flex flex-col justify-center" style={{ background: `linear-gradient(135deg,${BLUE},${BLUE2})` }}>
          <p className="text-xs font-black tracking-widest mb-3 text-white/70">PLAN YOUR VISIT</p>
          <h3 className="text-3xl font-black text-white mb-4" style={{ fontFamily: "'Exo 2',sans-serif" }}>
            Never Miss a Show
          </h3>
          <p className="text-sm text-white/80 mb-6 leading-relaxed">
            Download the ThrillVerse app to get real-time notifications for all shows, parades, and character meet & greet sessions.
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.15)" }}>
              <Bell size={18} className="text-white shrink-0" />
              <p className="text-sm font-bold text-white">Show reminders & alerts</p>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.15)" }}>
              <MapPin size={18} className="text-white shrink-0" />
              <p className="text-sm font-bold text-white">Live venue navigation</p>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.15)" }}>
              <Zap size={18} className="text-white shrink-0" />
              <p className="text-sm font-bold text-white">Virtual Queue integration</p>
            </div>
          </div>
          <button className="mt-6 w-full py-3.5 rounded-2xl font-bold text-sm transition-all hover:shadow-xl hover:scale-105"
            style={{ background: "white", color: BLUE }}>
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
function FlipCard({ char, onSelect }: { char: typeof THRILLVERSE_CHARS[0]; onSelect: () => void }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div style={{ perspective: "1000px", height: "480px" }}>
      <div style={{
        position: "relative", width: "100%", height: "100%",
        transformStyle: "preserve-3d",
        transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
      }}>

        {/* ── FRONT ── */}
        <div style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden",
          borderRadius: 20, overflow: "hidden",
          background: "white",
          border: `1.5px solid ${char.color}28`,
          boxShadow: `0 8px 32px ${char.color}15`,
        }}>
          {/* Character image */}
          <div style={{ height: 248, background: char.bg, overflow: "hidden", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={char.img} alt={char.name}
              className="w-full h-full object-contain block mx-auto"
              style={{ objectPosition: char.imgPos }} />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${char.color}55 0%, transparent 60%)` }} />
            <span style={{
              position: "absolute", top: 12, left: 12, padding: "3px 10px",
              borderRadius: 999, fontSize: 10, fontWeight: 800,
              background: char.color, color: "white",
            }}>{char.role}</span>
          </div>
          {/* Front body */}
          <div style={{ padding: "18px 20px 20px" }}>
            <h3 style={{ fontFamily: "'Exo 2',sans-serif", fontWeight: 900, fontSize: 20, color: "#0d1f3c", marginBottom: 4 }}>{char.name}</h3>
            <p style={{ fontSize: 12, color: "#5a78a8", marginBottom: 16, lineHeight: 1.5 }}>
              {char.desc.slice(0, 90)}…
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setFlipped(true)}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 12, fontSize: 13, fontWeight: 700,
                  background: `linear-gradient(135deg,${char.color},${char.color}bb)`, color: "white", border: "none", cursor: "pointer",
                  transition: "opacity 0.2s, transform 0.2s"
                }}>
                See Details →
              </button>
              <div style={{
                padding: "10px 14px", borderRadius: 12, fontSize: 11, fontWeight: 700,
                background: char.bg, color: char.color, display: "flex", alignItems: "center", gap: 6
              }}>
                📍 {char.meet.split("—")[0].trim()}
              </div>
            </div>
          </div>
        </div>

        {/* ── BACK ── */}
        <div style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          borderRadius: 20,
          background: char.bg,
          border: `1.5px solid ${char.color}30`,
          boxShadow: `0 8px 32px ${char.color}20`,
          overflow: "hidden", overflowY: "auto",
          scrollbarWidth: "none",
        }}>
          {/* Back header stripe */}
          <div style={{ background: `linear-gradient(135deg,${char.color},${char.color}cc)`, padding: "16px 20px" }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.75)", letterSpacing: "0.1em" }}>THRILLVERSE CHARACTER</span>
            <h3 style={{ fontFamily: "'Exo 2',sans-serif", fontWeight: 900, fontSize: 20, color: "white", marginTop: 2 }}>{char.name}</h3>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>{char.role}</p>
          </div>

          <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>

            {/* View Full Profile Modal button */}
            <button onClick={onSelect}
              style={{
                width: "100%", padding: "10px 0", borderRadius: 12, fontSize: 12, fontWeight: 800,
                background: `linear-gradient(135deg,${char.color},${char.color}cc)`, color: "white", border: "none",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 4
              }}>
              ⭐ Open Profile Modal
            </button>
            {/* Description */}
            <p style={{ fontSize: 11, color: "#5a78a8", lineHeight: 1.6, margin: "2px 0" }}>{char.desc}</p>

            {/* Info cards */}
            {[
              { label: "PERSONALITY", val: char.personality },
              { label: "FUN FACT", val: char.funFact },
              { label: "MEET & GREET", val: `${char.meet} · ${char.meetTime}` },
            ].map(({ label, val }) => (
              <div key={label} style={{ padding: "9px 11px", borderRadius: 10, background: "white", border: `1px solid ${char.color}18` }}>
                <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", color: "#5a78a8", marginBottom: 2 }}>{label}</p>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#0d1f3c", lineHeight: 1.5 }}>{val}</p>
              </div>
            ))}

            {/* Show timings */}
            <div style={{ padding: "9px 11px", borderRadius: 10, background: "white", border: `1px solid ${char.color}18` }}>
              <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", color: "#5a78a8", marginBottom: 3 }}>PERFORMANCE TIMINGS</p>
              {char.shows.map((s, i) => (
                <p key={i} style={{ fontSize: 11, color: "#5a78a8", lineHeight: 1.6 }}>• {s}</p>
              ))}
            </div>

            {/* ← Back button — BOTTOM after all details */}
            <button onClick={() => setFlipped(false)}
              style={{
                width: "100%", padding: "8px 0", borderRadius: 10, fontSize: 12, fontWeight: 700,
                background: "white", color: char.color, border: `1.5px solid ${char.color}50`,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                marginTop: 4
              }}>
              ← Back to {char.name}
            </button>
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
function AttractionsPage({ setPage }: { setPage: (p: string) => void }) {
  const [selectedEvent, setEvent] = useState<typeof EVENTS[0] | null>(null);
  const [selectedFestival, setFestival] = useState<typeof FESTIVALS[0] | null>(null);
  const [selectedChar, setChar] = useState<typeof THRILLVERSE_CHARS[0] | null>(null);
  const [galleryImg, setGallery] = useState<typeof ATTR_GALLERY[0] | null>(null);
  const [reminder, setReminder] = useState<number | null>(null);

  return (
    <div className="bg-white min-h-screen">

      {/* ═══ 1. HERO ═══ */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1631800744240-d95925aacb01?w=1800&h=900&fit=crop&auto=format"
          alt="ThrillVerse Attractions"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom,rgba(6,13,40,0.65) 0%,rgba(6,13,40,0.38) 45%,rgba(6,13,40,0.82) 88%,#ffffff 100%)" }} />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black tracking-widest text-white mb-5"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.28)", backdropFilter: "blur(8px)" }}>
            THRILLVERSE LIVE ENTERTAINMENT
          </span>
          <h1 className="text-5xl sm:text-7xl font-black text-white mb-5 leading-tight"
            style={{ fontFamily: "'Exo 2',sans-serif", textShadow: "0 4px 32px rgba(0,0,0,0.4)" }}>
            World of <span style={{ color: "#7dd3fc" }}>Attractions</span>
          </h1>
          <p className="text-base sm:text-xl text-white/85 max-w-2xl mx-auto mb-8 leading-relaxed">
            Experience spectacular parades, live entertainment, family shows, seasonal festivals, and meet original ThrillVerse characters throughout the day.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button className="px-8 py-3.5 rounded-full font-bold text-sm text-white transition-all hover:scale-105"
              style={{ background: `linear-gradient(135deg,${BLUE},${BLUE2})`, boxShadow: "0 8px 28px rgba(26,110,245,0.45)" }}>
              Explore Schedule
            </button>
            <button onClick={() => setPage(PAGES.PARK_MAP)}
              className="px-8 py-3.5 rounded-full font-bold text-sm text-white transition-all hover:bg-white/20"
              style={{ border: "2px solid rgba(255,255,255,0.5)", backdropFilter: "blur(8px)" }}>
              View Park Map
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {[{ val: "17", label: "Rides" }, { val: "4", label: "Zones" }, { val: "6", label: "Daily Shows" }, { val: "4", label: "Original Characters" }].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-black text-white" style={{ fontFamily: "'Exo 2',sans-serif" }}>{s.val}</p>
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
              <p className="text-xs font-black tracking-widest mb-2" style={{ color: ORANGE }}>LIVE ENTERTAINMENT</p>
              <h2 className="text-4xl font-black text-[#0d1f3c]" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                Today's <span style={{ color: BLUE }}>Upcoming Events</span>
              </h2>
              <p className="text-sm mt-2" style={{ color: "#5a78a8" }}>All times are local park time · Updated live</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shrink-0"
              style={{ background: "#f0fdf4", color: GREEN, border: "1px solid rgba(16,185,129,0.2)" }}>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />Park Open · 9 AM – 10 PM
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {EVENTS.map(ev => (
              <div key={ev.id} className="group rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300 hover:-translate-y-1"
                style={{ border: "1.5px solid rgba(26,110,245,0.1)" }}>
                <div className="relative overflow-hidden" style={{ height: 220 }}>
                  <img src={ev.img} alt={ev.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(13,31,60,0.88) 0%,rgba(13,31,60,0.12) 55%,transparent 100%)" }} />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black"
                      style={{ background: ev.status === "live" ? "#fef2f2" : "rgba(255,255,255,0.93)", color: ev.status === "live" ? RED : BLUE }}>
                      <span className={`w-2 h-2 rounded-full ${ev.status === "live" ? "bg-red-500 animate-pulse" : "bg-blue-500"}`} />
                      {ev.status === "live" ? "LIVE NOW" : "UPCOMING"}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white"
                      style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)" }}>{ev.category}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-black text-white" style={{ fontFamily: "'Exo 2',sans-serif" }}>{ev.time}</p>
                        <p className="text-xs text-white/70">ends {ev.endTime} · {ev.duration}</p>
                      </div>
                      <p className="text-xs font-bold text-white/80">📍 {ev.zone}</p>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-black text-xl text-[#0d1f3c] mb-2" style={{ fontFamily: "'Exo 2',sans-serif" }}>{ev.name}</h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "#5a78a8" }}>{ev.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {ev.highlights.map(h => (
                      <span key={h} className="px-2.5 py-1 rounded-lg text-[11px] font-bold" style={{ background: "#f0f5ff", color: BLUE }}>✦ {h}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => setEvent(ev)} className="py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
                      style={{ background: `linear-gradient(135deg,${BLUE},${BLUE2})` }}>View Details</button>
                    <button onClick={() => setPage(PAGES.PARK_MAP)} className="py-2 rounded-xl text-xs font-bold transition-all"
                      style={{ background: "#f0f5ff", color: BLUE }}>View on Map</button>
                    <button onClick={() => setReminder(ev.id)} className="py-2 rounded-xl text-xs font-bold transition-all"
                      style={{ background: reminder === ev.id ? "#f0fdf4" : "#f0f5ff", color: reminder === ev.id ? GREEN : "#5a78a8", border: reminder === ev.id ? "1px solid rgba(16,185,129,0.3)" : "none" }}>
                      {reminder === ev.id ? "✓ Set" : "Set Reminder"}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ 3. FEATURED PARADE ═══ */}
        <section className="py-6">
          <div className="rounded-3xl overflow-hidden shadow-xl" style={{ border: "1.5px solid rgba(249,115,22,0.15)" }}>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative overflow-hidden" style={{ minHeight: 420 }}>
                <img src={EVENTS[0].img} alt={EVENTS[0].name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to right,transparent 65%,white 100%)" }} />
                <div className="absolute top-5 left-5">
                  <span className="px-3 py-1.5 rounded-full text-xs font-black text-white" style={{ background: ORANGE }}>🎠 FEATURED PARADE</span>
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center bg-white">
                <p className="text-xs font-black tracking-widest mb-3" style={{ color: ORANGE }}>TODAY'S HIGHLIGHT</p>
                <h2 className="text-3xl font-black text-[#0d1f3c] mb-3" style={{ fontFamily: "'Exo 2',sans-serif" }}>{EVENTS[0].name}</h2>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "#5a78a8" }}>{EVENTS[0].description}</p>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[{ label: "Duration", val: EVENTS[0].duration }, { label: "Location", val: EVENTS[0].zone }, { label: "Timings", val: `${EVENTS[0].time}, 2:00 PM, 6:00 PM` }, { label: "Crowd", val: `${EVENTS[0].crowd} Expected` }].map(({ label, val }) => (
                    <div key={label} className="p-3 rounded-xl" style={{ background: "#f0f5ff" }}>
                      <p className="text-[10px] font-black tracking-wider mb-0.5" style={{ color: "#5a78a8" }}>{label.toUpperCase()}</p>
                      <p className="text-sm font-bold text-[#0d1f3c]">{val}</p>
                    </div>
                  ))}
                </div>
                <div className="mb-5">
                  <p className="text-[10px] font-black tracking-widest mb-2" style={{ color: "#5a78a8" }}>PARADE ROUTE</p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {EVENTS[0].route.map((stop, i) => (
                      <span key={i} className="flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ background: "#fff7f0", color: ORANGE }}>{stop}</span>
                        {i < EVENTS[0].route.length - 1 && <span style={{ color: ORANGE }}>→</span>}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setEvent(EVENTS[0])} className="flex-1 py-3 rounded-2xl font-bold text-sm text-white transition-all hover:shadow-lg hover:opacity-90"
                    style={{ background: `linear-gradient(135deg,${ORANGE},#ea580c)` }}>View Parade Route</button>
                  <button onClick={() => setReminder(1)} className="px-5 py-3 rounded-2xl font-bold text-sm transition-all"
                    style={{ background: reminder === 1 ? "#f0fdf4" : "#f0f5ff", color: reminder === 1 ? GREEN : "#5a78a8" }}>
                    {reminder === 1 ? "✓ Set" : "⏰ Remind"}</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 4. MEET THE STARS — 3D Flip Cards ═══ */}
        <section className="py-14">
          <div className="text-center mb-12">
            <p className="text-xs font-black tracking-widest mb-2" style={{ color: ORANGE }}>ORIGINAL CHARACTERS</p>
            <h2 className="text-4xl font-black text-[#0d1f3c]" style={{ fontFamily: "'Exo 2',sans-serif" }}>
              Meet the <span style={{ color: BLUE }}>Stars of ThrillVerse</span>
            </h2>
            <p className="text-sm mt-3 max-w-lg mx-auto leading-relaxed" style={{ color: "#5a78a8" }}>
              Four original ThrillVerse characters — each with their own story, personality and daily shows. Click <b style={{ color: BLUE }}>See Details</b> to flip the card and discover their world.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {THRILLVERSE_CHARS.map(ch => (
              <FlipCard key={ch.id} char={ch} onSelect={() => setChar(ch)} />
            ))}
          </div>

        </section>

        {/* ═══ 5. ENTERTAINMENT ACTS ═══ */}
        <section className="py-10">
          <div className="text-center mb-10">
            <p className="text-xs font-black tracking-widest mb-2" style={{ color: PURPLE }}>LIVE PERFORMANCES</p>
            <h2 className="text-3xl font-black text-[#0d1f3c]" style={{ fontFamily: "'Exo 2',sans-serif" }}>
              Entertainment Acts Featuring <span style={{ color: BLUE }}>Talented Performers</span>
            </h2>
            <p className="text-sm mt-2 max-w-lg mx-auto" style={{ color: "#5a78a8" }}>
              World-class live entertainment spread across the park — from heart-pumping dance to mind-bending magic.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ENTERTAINMENT_ACTS.map(act => (
              <div key={act.id} className="group rounded-2xl overflow-hidden bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                style={{ border: `1.5px solid ${act.color}20`, boxShadow: `0 4px 16px ${act.color}0d` }}>
                {/* Image */}
                <div className="relative overflow-hidden" style={{ height: 200 }}>
                  <img src={act.img} alt={act.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to top,rgba(0,0,0,0.65) 0%,transparent 55%)` }} />
                  {/* Emoji badge */}
                  <div className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ background: "rgba(255,255,255,0.92)" }}>
                    {act.emoji}
                  </div>
                  {/* Act name overlay */}
                  <div className="absolute bottom-3 left-3">
                    <h3 className="font-black text-base text-white" style={{ fontFamily: "'Exo 2',sans-serif" }}>{act.name}</h3>
                  </div>
                </div>
                {/* Body */}
                <div className="p-4">
                  <p className="text-xs leading-relaxed mb-3" style={{ color: "#5a78a8" }}>{act.desc}</p>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{ background: act.bg, border: `1px solid ${act.color}25` }}>
                    <span className="text-base shrink-0">🎠</span>
                    <p className="text-xs font-bold" style={{ color: act.color }}>
                      You can see this act in the parade!
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Entertainment schedule strip */}
          <div className="mt-8 p-5 rounded-2xl" style={{ background: "linear-gradient(135deg,#f0f5ff,#eef4ff)", border: "1.5px solid rgba(26,110,245,0.12)" }}>
            <p className="text-xs font-black tracking-widest mb-4" style={{ color: BLUE }}>TODAY'S PERFORMANCE SCHEDULE</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { act: "Bhangra Boys", time: "11:00 AM & 3:00 PM", venue: "Main Stage", color: "#e53e3e" },
                { act: "Hip Hop Crew", time: "12:00 PM & 4:30 PM", venue: "Central Plaza", color: "#6b46c1" },
                { act: "Acrobats", time: "1:00 PM & 5:30 PM", venue: "Arena East", color: "#2b6cb0" },
                { act: "Magic Show", time: "2:30 PM & 7:00 PM", venue: "Family Stage", color: "#2d3748" },
              ].map(p => (
                <div key={p.act} className="p-3 rounded-xl bg-white" style={{ border: `1px solid ${p.color}18` }}>
                  <span className="text-lg">{ENTERTAINMENT_ACTS.find(a => a.name.includes(p.act.split(" ")[0]))?.emoji}</span>
                  <p className="font-black text-sm text-[#0d1f3c] mt-1" style={{ fontFamily: "'Exo 2',sans-serif" }}>{p.act}</p>
                  <p className="text-xs font-bold mt-0.5" style={{ color: p.color }}>{p.time}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "#5a78a8" }}>📍 {p.venue}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 6. FESTIVALS ═══ */}
        <section className="py-10">
          <div className="text-center mb-8">
            <p className="text-xs font-black tracking-widest mb-2" style={{ color: AMBER }}>ALL YEAR ROUND</p>
            <h2 className="text-3xl font-black text-[#0d1f3c]" style={{ fontFamily: "'Exo 2',sans-serif" }}>
              Upcoming <span style={{ color: BLUE }}>Festivals</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FESTIVALS.map(f => (
              <div key={f.id} className="group rounded-2xl overflow-hidden bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
                style={{ border: `1.5px solid ${f.color}20` }}>
                <div>
                  <div className="relative h-36 overflow-hidden">
                    <img src={f.img} alt={f.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to top,${f.color}cc 0%,transparent 60%)` }} />
                    <span className="absolute bottom-3 left-3 text-2xl">{f.emoji}</span>
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                      style={{ background: "rgba(0,0,0,0.35)" }}>{f.dates}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-black text-base text-[#0d1f3c] mb-1" style={{ fontFamily: "'Exo 2',sans-serif" }}>{f.name}</h3>
                    <p className="text-xs leading-relaxed mb-3" style={{ color: "#5a78a8" }}>{f.desc}</p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <button
                    onClick={() => setFestival(f)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 cursor-pointer shadow-sm"
                    style={{ background: f.color }}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ 6.5 FAQ SECTION ═══ */}
        <FaqSection
          title="Attractions & Shows FAQs"
          sub="Everything you need to know about our rides, live shows, parades & height policies"
          faqs={ATTRACTIONS_FAQS}
        />

        {/* ═══ 7. CTA ═══ */}
        <section className="py-6">
          <div className="rounded-3xl overflow-hidden relative" style={{ background: `linear-gradient(135deg,${BLUE} 0%,${BLUE2} 60%,#003d99 100%)` }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1762639111748-982bda14135e?w=1200&h=400&fit=crop)", backgroundSize: "cover", backgroundPosition: "center" }} />
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-12">
              <div>
                <p className="text-xs font-black tracking-widest text-white/70 mb-2">TODAY ONLY</p>
                <h2 className="text-3xl font-black text-white" style={{ fontFamily: "'Exo 2',sans-serif" }}>Don't Miss Today's Entertainment</h2>
                <p className="text-sm text-white/80 mt-2 max-w-md leading-relaxed">
                  From morning parades to the Galaxy Lights Night Parade — every hour brings a new spectacular experience.
                </p>
              </div>
              <div className="flex flex-col gap-3 shrink-0">
                <button className="px-8 py-3.5 rounded-2xl font-bold text-sm transition-all hover:scale-105 hover:shadow-xl"
                  style={{ background: "white", color: BLUE }}>View Full Schedule</button>
                <button onClick={() => setPage(PAGES.TICKETS)} className="px-8 py-3.5 rounded-2xl font-bold text-sm text-white transition-all hover:scale-105"
                  style={{ background: "rgba(255,255,255,0.18)", border: "2px solid rgba(255,255,255,0.4)", backdropFilter: "blur(8px)" }}>Book Tickets</button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Festival Details Modal */}
      {selectedFestival && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setFestival(null)}>
          <div className="absolute inset-0 bg-[#060d28]/75 backdrop-blur-md" />
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 overflow-hidden" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setFestival(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer z-20"
            >
              <X size={16} />
            </button>

            <div className="relative h-48 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-6 overflow-hidden">
              <img src={selectedFestival.img} alt={selectedFestival.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${selectedFestival.color}ee 0%, transparent 60%)` }} />
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white">
                <div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/40 backdrop-blur-md border border-white/20">
                    {selectedFestival.dates}
                  </span>
                  <h3 className="text-2xl font-black mt-1 font-poppins">{selectedFestival.emoji} {selectedFestival.name}</h3>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-left">
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {selectedFestival.fullDetails || selectedFestival.desc}
              </p>

              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Location</span>
                  <strong className="text-slate-800 font-bold mt-0.5 block">{selectedFestival.location || "Park-wide"}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Festival Timings</span>
                  <strong className="text-slate-800 font-bold mt-0.5 block">{selectedFestival.timings || "All Day"}</strong>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Festival Highlights</h4>
                <div className="flex flex-wrap gap-2">
                  {(selectedFestival.highlights || ["Special Shows", "Parades", "Themed Food"]).map((h, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl text-xs font-bold bg-blue-50 text-[#1a6ef5] border border-blue-100">
                      ✦ {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* How We Celebrate Section */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-left space-y-1">
                <h4 className="text-xs font-black text-amber-800 uppercase tracking-widest flex items-center gap-1.5">
                  🎉 How We Celebrate This Festival
                </h4>
                <p className="text-xs text-amber-950 font-medium leading-relaxed pt-0.5">
                  {selectedFestival.celebrationInfo}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setFestival(null)}
                  className="w-full py-3 rounded-xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Close Festival Info
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ EVENT DETAIL MODAL ═══ */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setEvent(null)}>
          <div className="absolute inset-0" style={{ background: "rgba(6,13,40,0.72)", backdropFilter: "blur(10px)" }} />
          <div className="relative w-full max-w-xl rounded-3xl overflow-hidden bg-white shadow-2xl"
            style={{ maxHeight: "88vh", overflowY: "auto", scrollbarWidth: "none" }} onClick={e => e.stopPropagation()}>
            <div className="relative h-52 overflow-hidden">
              <img src={selectedEvent.img} alt={selectedEvent.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(13,31,60,0.88) 0%,transparent 55%)" }} />
              <button onClick={() => setEvent(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.95)" }}>
                <X size={14} style={{ color: "#0d1f3c" }} />
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black"
                    style={{ background: selectedEvent.status === "live" ? "#fef2f2" : "rgba(255,255,255,0.2)", color: selectedEvent.status === "live" ? RED : "white", backdropFilter: "blur(8px)" }}>
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedEvent.status === "live" ? "bg-red-500 animate-pulse" : "bg-white"}`} />
                    {selectedEvent.status === "live" ? "LIVE NOW" : "UPCOMING"}
                  </span>
                  <span className="text-xs text-white/80">{selectedEvent.category}</span>
                </div>
                <h2 className="text-xl font-black text-white" style={{ fontFamily: "'Exo 2',sans-serif" }}>{selectedEvent.name}</h2>
              </div>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[{ label: "Start", val: selectedEvent.time }, { label: "End", val: selectedEvent.endTime }, { label: "Duration", val: selectedEvent.duration }].map(({ label, val }) => (
                  <div key={label} className="p-3 rounded-xl text-center" style={{ background: "#f0f5ff" }}>
                    <p className="text-sm font-black" style={{ fontFamily: "'Exo 2',sans-serif", color: BLUE }}>{val}</p>
                    <p className="text-[10px]" style={{ color: "#5a78a8" }}>{label}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#5a78a8" }}>{selectedEvent.description}</p>
              <p className="text-[10px] font-black tracking-widest mb-2" style={{ color: "#5a78a8" }}>HIGHLIGHTS</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {selectedEvent.highlights.map(h => (
                  <span key={h} className="px-2.5 py-1 rounded-lg text-[11px] font-bold" style={{ background: "#f0f5ff", color: BLUE }}>✦ {h}</span>
                ))}
              </div>
              <p className="text-[10px] font-black tracking-widest mb-2" style={{ color: "#5a78a8" }}>PERFORMANCE ROUTE</p>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {selectedEvent.route.map((stop, i) => (
                  <span key={i} className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0" style={{ background: BLUE }}>{i + 1}</span>
                      <span className="text-xs font-bold text-[#0d1f3c]">{stop}</span>
                    </span>
                    {i < selectedEvent.route.length - 1 && <span style={{ color: BLUE }}>→</span>}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl mb-5" style={{ background: "#eef4ff" }}>
                <MapPin size={18} style={{ color: BLUE }} /><span className="text-sm font-bold text-[#0d1f3c]">{selectedEvent.zone}</span>
                <span className="text-xs ml-auto" style={{ color: "#5a78a8" }}>Crowd: <b style={{ color: ORANGE }}>{selectedEvent.crowd}</b></span>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setReminder(selectedEvent.id)} className="flex-1 py-2.5 rounded-2xl font-bold text-sm transition-all"
                  style={{ background: reminder === selectedEvent.id ? "#f0fdf4" : "#f0f5ff", color: reminder === selectedEvent.id ? GREEN : "#5a78a8" }}>
                  {reminder === selectedEvent.id ? "✓ Reminder Set" : "Set Reminder"}</button>
                <button onClick={() => setPage(PAGES.PARK_MAP)} className="flex-1 py-2.5 rounded-2xl font-bold text-sm text-white"
                  style={{ background: `linear-gradient(135deg,${BLUE},${BLUE2})` }}>View on Map</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ CHARACTER DETAIL MODAL ═══ */}
      {selectedChar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setChar(null)}>
          <div className="absolute inset-0" style={{ background: "rgba(6,13,40,0.72)", backdropFilter: "blur(10px)" }} />
          <div className="relative w-full max-w-md rounded-3xl overflow-hidden bg-white shadow-2xl"
            style={{ maxHeight: "88vh", overflowY: "auto", scrollbarWidth: "none" }} onClick={e => e.stopPropagation()}>
            <div className="relative h-48 overflow-hidden" style={{ background: selectedChar.bg }}>
              <img src={selectedChar.img} alt={selectedChar.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(to top,${selectedChar.color}99 0%,transparent 55%)` }} />
              <button onClick={() => setChar(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.95)" }}><X size={14} style={{ color: "#0d1f3c" }} /></button>
            </div>
            <div className="p-5">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3" style={{ background: selectedChar.bg, color: selectedChar.color }}>{selectedChar.role}</span>
              <h2 className="text-2xl font-black text-[#0d1f3c] mb-2" style={{ fontFamily: "'Exo 2',sans-serif" }}>{selectedChar.name}</h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#5a78a8" }}>{selectedChar.desc}</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[{ label: "Meet Location", val: selectedChar.meet }, { label: "Meet Timings", val: selectedChar.meetTime }, { label: "Favourite Ride", val: selectedChar.favoriteRide }, { label: "Zone", val: selectedChar.meet }].map(({ label, val }) => (
                  <div key={label} className="p-3 rounded-xl" style={{ background: "#f0f5ff" }}>
                    <p className="text-[10px] font-bold mb-0.5" style={{ color: "#5a78a8" }}>{label.toUpperCase()}</p>
                    <p className="text-xs font-bold text-[#0d1f3c]">{val}</p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-black tracking-widest mb-2" style={{ color: "#5a78a8" }}>FUN FACTS</p>
              <div className="flex flex-col gap-2 mb-5">
                {selectedChar.facts.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm" style={{ color: "#1a3a6e" }}>
                    <span className="font-black shrink-0" style={{ color: selectedChar.color }}>→</span>{f}
                  </div>
                ))}
              </div>
              <button className="w-full py-3 rounded-2xl font-bold text-sm text-white transition-all hover:opacity-90"
                style={{ background: `linear-gradient(135deg,${selectedChar.color},${selectedChar.color}bb)` }}>
                Plan Your Meet & Greet</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ GALLERY LIGHTBOX ═══ */}
      {galleryImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setGallery(null)}>
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.9)" }} />
          <div className="relative max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <img src={galleryImg.src.replace("w=500&h=380", "w=900&h=600").replace("w=500&h=760", "w=900&h=1100")} alt={galleryImg.label} className="w-full object-cover" />
            <button onClick={() => setGallery(null)} className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.9)" }}><X size={16} style={{ color: "#0d1f3c" }} /></button>
            <div className="absolute bottom-0 left-0 right-0 p-5" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.7),transparent)" }}>
              <p className="font-bold text-white">{galleryImg.label}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// VirtualMap component replaces the legacy mockup SVG page.

// ═══════════════════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════════════════
function Footer({ setPage }: { setPage: (p: string) => void }) {
  return (
    <footer style={{ background: "#f0f5ff", borderTop: "1px solid rgba(26,110,245,0.1)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <button onClick={() => setPage(PAGES.HOME)} className="text-2xl font-black mb-3" style={{ fontFamily: "'Exo 2',sans-serif" }}>
            <span style={{ color: BLUE }}>Thrill</span><span style={{ color: "#0d1f3c" }}>verse</span>
          </button>
          <p className="text-sm leading-relaxed" style={{ color: "#5a78a8" }}>India's most thrilling AI-powered amusement park. 17 rides. Zero waiting.</p>
          <div className="flex gap-2 mt-4">
            {["𝕏", "f", "▶", "📷"].map(s => <button key={s} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-white" style={{ border: `1px solid ${BLUE}22`, color: BLUE }}>{s}</button>)}
          </div>
        </div>
        {[
          { title: "Explore", links: [["All Rides", PAGES.EXPLORE], ["Virtual Queue", PAGES.VIRTUAL_QUEUE], ["Park Map", PAGES.EXPLORE], ["Shows", PAGES.HOME]] },
          { title: "Services", links: [["Tickets & Offers", PAGES.TICKETS], ["Fast Pass", PAGES.TICKETS], ["Food", "Food"], ["Merchandise", "Merchandise"]] },
          { title: "Support", links: [["Help Center", PAGES.HOME], ["Accessibility", PAGES.PROFILE], ["Contact Us", PAGES.HOME], ["Emergency", PAGES.HOME]] },
        ].map(({ title, links }) => (
          <div key={title}>
            <p className="font-bold text-sm mb-3" style={{ fontFamily: "'Exo 2',sans-serif", color: "#1a3a6e" }}>{title}</p>
            <ul className="flex flex-col gap-2">
              {links.map(([label, p]) => <li key={label}><button onClick={() => setPage(p)} className="text-sm transition-colors hover:text-[#1a6ef5]" style={{ color: "#5a78a8" }}>{label}</button></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs" style={{ borderTop: "1px solid rgba(26,110,245,0.08)", color: "#5a78a8" }}>
        <span>© 2025 ThrillVerse. All rights reserved.</span>
        <span>Privacy · Terms · Cookies</span>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════════
function AppContent() {
  const [page, setPage] = useState<string>(PAGES.HOME);
  const [rides, setRides] = useState(ALL_RIDES);
  const [restaurants, setRestaurants] = useState<any[]>(RESTAURANTS);
  const [selectedQueueRide, setSelectedQueueRide] = useState<any | null>(null);
  const [selectedHomeRide, setSelectedHomeRide] = useState<any | null>(null);
  const [selectedPromo, setSelectedPromo] = useState<any | null>(null);
  const [hasRedirectedAdmin, setHasRedirectedAdmin] = useState(false);
  const [userTickets, setUserTickets] = useState([
    { id: "TV-2024-004821", type: "Full Day Pass", name: "Rohan Sharma", date: "Jul 6, 2024", zones: "All Zones", rides: "Unlimited", color: "#1a6ef5", gradient: "linear-gradient(135deg,#1a6ef5,#0a41c9)" },
  ]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingOffer, setBookingOffer] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingMobile, setBookingMobile] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // Post-login redirection states
  const [redirectToAfterLogin, setRedirectToAfterLogin] = useState<string | null>(null);
  const [postLoginAction, setPostLoginAction] = useState<{ type: "open_booking" } | null>(null);

  // Authentication Context integration
  const {
    token,
    userProfile,
    loading,
    isAuthenticated,
    login,
    register
  } = useAuth();

  // Protected route guard
  useEffect(() => {
    const protectedPages = [PAGES.PROFILE];
    if (protectedPages.includes(page) && !isAuthenticated && !loading) {
      setRedirectToAfterLogin(page);
      setPage(PAGES.VIRTUAL_QUEUE);
    }
  }, [page, isAuthenticated, loading]);

  // Post-Login Restoration Hook
  useEffect(() => {
    if (isAuthenticated && userProfile) {
      const role = userProfile?.role?.toLowerCase();

      // Handle any pending post-login actions (e.g. open booking modal)
      if (postLoginAction) {
        if (postLoginAction.type === "open_booking") {
          setIsBookingModalOpen(true);
        }
        setPostLoginAction(null);
      }

      // Handle target page redirection after explicit login request
      if (redirectToAfterLogin) {
        setPage(redirectToAfterLogin);
        setRedirectToAfterLogin(null);
        if (role === "admin") {
          setHasRedirectedAdmin(true);
        }
      } else if (role === "admin" && !hasRedirectedAdmin) {
        setHasRedirectedAdmin(true);
        setPage(PAGES.ADMIN);
      }
    }
    if (!isAuthenticated) {
      setHasRedirectedAdmin(false);
    }
  }, [isAuthenticated, userProfile, redirectToAfterLogin, postLoginAction, hasRedirectedAdmin]);

  const fetchParkData = () => {
    const token = localStorage.getItem("access_token");
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    fetch("http://127.0.0.1:8000/queue/rides/", { headers })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map(r => {
            const defaultInfo = ALL_RIDES.find(item => item.id === r.id || item.name.toLowerCase() === r.name?.toLowerCase());
            const catLower = (r.category || '').toLowerCase();
            const zone = r.zone || defaultInfo?.zone || (
              catLower === 'thrill' || catLower === 'thriller' ? 'Zone A' :
              catLower === 'water' ? 'Zone B' :
              catLower === 'kids' ? 'Zone D' : 'Zone C'
            );
            const duration = r.duration || (r.duration_minutes ? `${r.duration_minutes} min` : defaultInfo?.duration || "2 min");
            const height = r.height || (r.min_height_cm ? `${r.min_height_cm} cm` : defaultInfo?.height || "None");

            return {
              ...r,
              thrill: r.thrill_level ?? r.thrill,
              duration,
              height,
              zone,
              wait: r.current_wait_time ?? r.wait,
              img: r.id === 1 ? IMG.nitro :
                r.id === 2 ? IMG.scream :
                  r.id === 3 ? IMG.spacex :
                    r.id === 4 ? IMG.drop :
                      r.id === 5 ? IMG.dino :
                        r.id === 6 ? IMG.splashAhoy :
                          r.id === 7 ? IMG.goldRush :
                            r.id === 8 ? IMG.alibaba :
                              r.id === 9 ? IMG.bhangarh :
                                r.id === 10 ? IMG.chaiSpin :
                                  r.id === 11 ? IMG.wrath :
                                    r.id === 12 ? IMG.carousel :
                                      r.id === 13 ? IMG.chhotaBheem :
                                        r.id === 14 ? IMG.elephantRide :
                                          r.id === 15 ? IMG.miniFall :
                                            r.id === 16 ? IMG.cinema360 : (r.img || defaultInfo?.img)
            };
          });
          setRides(mapped);
        }
      })
      .catch(err => console.error("Error fetching rides:", err));

    fetch("http://127.0.0.1:8000/queue/restaurants/")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setRestaurants(data);
        }
      })
      .catch(err => console.error("Error fetching restaurants:", err));
  };

  useEffect(() => {
    fetchParkData();
    const interval = setInterval(fetchParkData, 5000);
    window.addEventListener("park_data_updated", fetchParkData);
    return () => {
      clearInterval(interval);
      window.removeEventListener("park_data_updated", fetchParkData);
    };
  }, [page]);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);

  const handleBookPassModal = () => {
    if (!bookingOffer) {
      alert("Please select an offer!");
      return;
    }
    if (!bookingDate) {
      alert("Please select a date!");
      return;
    }
    const cleanMobile = bookingMobile.replace(/\D/g, "");
    if (cleanMobile.length !== 10) {
      alert("Mobile number must be exactly 10 digits!");
      return;
    }

    if (!isAuthenticated) {
      alert("🔒 JWT authentication required! Please sign in or create an account.");
      setRedirectToAfterLogin(page);
      setPostLoginAction({ type: "open_booking" });
      setIsBookingModalOpen(false);
      setPage(PAGES.VIRTUAL_QUEUE);
      return;
    }

    setIsBookingModalOpen(false);
    setPage(PAGES.CHECKOUT);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070e28] flex items-center justify-center text-white">
        <div className="text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-full border-4 border-blue-500/20 border-t-[#1a6ef5] animate-spin mb-4" />
          <h2 className="text-lg font-black tracking-wide font-poppins" style={{ fontFamily: "'Exo 2',sans-serif" }}>ThrillVerse</h2>
          <p className="text-xs text-slate-400 mt-1">Verifying secure credentials...</p>
        </div>
      </div>
    );
  }

  const showStatus = ![PAGES.HOME, PAGES.PARK_MAP, PAGES.ATTRACTIONS].includes(page);

  return (
    <div className="min-h-screen bg-white text-foreground" style={{ fontFamily: "'Inter',sans-serif" }}>
      <Toaster position="top-right" richColors />
      <Navbar
        page={page}
        setPage={setPage}
        scrolled={scrolled}
        onBookNowClick={() => {
          setBookingOffer("");
          setBookingDate("");
          setBookingMobile("");
          setIsBookingModalOpen(true);
        }}
      />
      <div className={showStatus ? "pt-16" : "pt-0"}>
        {showStatus && <StatusBar />}
        {page === PAGES.HOME && <HomePage setPage={setPage} rides={rides} restaurants={restaurants} setSelectedQueueRide={setSelectedQueueRide} setSelectedPromo={setSelectedPromo} onBookOfferClick={(offerTitle) => { setBookingOffer(offerTitle); setBookingDate(""); setBookingMobile(""); setIsBookingModalOpen(true); }} setSelectedRideDetail={setSelectedHomeRide} />}
        {page === PAGES.EXPLORE && <ExplorePage setPage={setPage} rides={rides} setSelectedQueueRide={setSelectedQueueRide} />}
        {page === PAGES.VIRTUAL_QUEUE && <VirtualQueuePage selectedRideProp={selectedQueueRide} onClearSelectedRide={() => setSelectedQueueRide(null)} />}
        {page === PAGES.TICKETS && (
          <TicketsPage
            selectedPromo={selectedPromo}
            onClearPromo={() => setSelectedPromo(null)}
            userTickets={userTickets}
            setUserTickets={setUserTickets}
            onBookOfferClick={(offerTitle) => {
              setBookingOffer(offerTitle);
              setBookingDate("");
              setBookingMobile("");
              setIsBookingModalOpen(true);
            }}
            setPage={setPage}
          />
        )}
        {page === PAGES.ATTRACTIONS && <AttractionsPage setPage={setPage} />}
        {page === PAGES.PARK_MAP && (
          <div className="pt-20 sm:pt-24 pb-8 px-2 sm:px-4 w-full">
            <VirtualMap rides={rides} />
          </div>
        )}
        {page === PAGES.PROFILE && <ProfilePage setPage={setPage} />}
        {page === PAGES.CHECKOUT && (
          <CheckoutPage
            bookingOffer={bookingOffer}
            bookingDate={bookingDate}
            bookingMobile={bookingMobile}
            token={token || ""}
            userProfile={userProfile}
            onClose={() => setPage(PAGES.HOME)}
            setPage={setPage}
            setUserTickets={setUserTickets}
          />
        )}
        {page === PAGES.ADMIN && (
          <AdminDashboard
            token={token || ""}
            onClose={() => setPage(PAGES.PROFILE)}
          />
        )}
      </div>
      <Footer setPage={setPage} />
      <BottomNav page={page} setPage={setPage} setRedirectToAfterLogin={setRedirectToAfterLogin} />

      {/* ── Home Page Ride Detail Modal ── */}
      {selectedHomeRide && (
        <RideDetailModal
          ride={selectedHomeRide}
          onClose={() => setSelectedHomeRide(null)}
          onJoinQueue={() => { setSelectedQueueRide(selectedHomeRide); setPage(PAGES.VIRTUAL_QUEUE); }}
        />
      )}

      {/* Custom Booking Modal matching user's requested layout */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setIsBookingModalOpen(false)}>
          <div className="absolute inset-0 bg-[#060d28]/70 backdrop-blur-md" />

          <div
            className="relative w-full max-w-[420px] rounded-3xl bg-[#1a6ef5] p-7 shadow-2xl text-white select-none border border-blue-400/20"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-white/80 transition-all"
            >
              <X size={20} />
            </button>

            {/* Offer dropdown selection */}
            <div className="mb-5">
              <label className="block text-sm font-semibold tracking-wide text-white mb-2">
                Offer <span className="text-red-500 font-bold">*</span>
              </label>
              <div className="relative">
                <select
                  value={bookingOffer}
                  onChange={e => setBookingOffer(e.target.value)}
                  className="w-full bg-white text-slate-800 rounded-lg px-4 py-3 text-sm font-semibold border-none focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="" disabled className="text-slate-400">Select Offer</option>
                  {OFFERS_LIST.map(o => (
                    <option key={o.title} value={o.title} className="text-slate-800">
                      {o.title} (₹{o.price}/-)
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            {/* Date input */}
            <div className="mb-5">
              <label className="block text-sm font-semibold tracking-wide text-white mb-2">
                Date <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="date"
                value={bookingDate}
                onChange={e => setBookingDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full bg-white text-slate-800 rounded-lg px-4 py-3 text-sm font-semibold border-none focus:outline-none cursor-pointer"
              />
            </div>

            {/* Mobile number input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold tracking-wide text-white mb-2">
                Mobile Number (10 Digits) <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="tel"
                maxLength={10}
                placeholder="Enter 10-Digit Mobile"
                value={bookingMobile}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setBookingMobile(val);
                }}
                className="w-full bg-white text-slate-800 rounded-lg px-4 py-3 text-sm font-semibold border-none focus:outline-none placeholder:text-slate-400"
              />
            </div>

            {/* Proceed button */}
            <div className="flex justify-center">
              <button
                onClick={handleBookPassModal}
                disabled={bookingLoading}
                className="bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold px-10 py-3 rounded-lg shadow-md transition-all hover:scale-[1.03] active:scale-[0.98] disabled:opacity-50 text-sm tracking-wide"
              >
                {bookingLoading ? "Processing..." : "Proceed"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
