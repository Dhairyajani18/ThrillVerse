import { useState, useEffect, useRef } from "react";
import {
  Clock, Users, Zap, Sparkles, QrCode, Share2, Download,
  ChevronLeft, Rocket, Check, CheckCircle, AlertCircle, X,
  Lock, User, Mail, Phone, SlidersHorizontal, Info, ChevronRight, Award, Trophy, Trash2, Ticket
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { notifyAuthSuccess } from "../../utils/toast";

// Explore Page Matching Asset Images
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

const RIDE_ASSET_IMAGES: Record<string, string> = {
  "Nitro": nitroImg,
  "Scream Machine": screamImg,
  "SpaceX": spacexImg,
  "Dare 2 Drop": dropImg,
  "Dino Splashdown": dinoImg,
  "Splash Ahoy!": splashAhoyImg,
  "Gold Rush Express": goldRushImg,
  "Alibaba Aur Chalis Chorr": alibabaImg,
  "Bhangarh: The Curse": bhangarhImg,
  "Chai Spin Chaos": chaiSpinImg,
  "Wrath of the Gods": wrathImg,
  "Magic Carousel": carouselImg,
  "Chhota Bheem – The Ride": chhotaBheemImg,
  "Elephant Ride": elephantRideImg,
  "Mini Fall": miniFallImg,
  "Cinema 360": cinema360Img,
  "Cinema 360 – Prince of the Dark Waters": cinema360Img
};

const getRideImage = (ride: any) => {
  if (!ride) return "";
  if (RIDE_ASSET_IMAGES[ride.name]) return RIDE_ASSET_IMAGES[ride.name];
  const key = Object.keys(RIDE_ASSET_IMAGES).find(k => ride.name?.includes(k) || k.includes(ride.name));
  if (key) return RIDE_ASSET_IMAGES[key];
  return ride.img || "";
};

// API Base URL
const API_URL = "http://127.0.0.1:8000";

// Custom Toast component helper
const triggerConfetti = () => { };

export default function VirtualQueuePage({ selectedRideProp, onClearSelectedRide }: { selectedRideProp?: any; onClearSelectedRide?: () => void }) {
  const { token, userProfile, isAuthenticated, login, register, logout, fetchWithAuth } = useAuth();

  // Page states
  const [tab, setTab] = useState<"dashboard" | "join" | "history" | "passes">("dashboard");
  const [historyTab, setHistoryTab] = useState<"all" | "completed" | "cancelled">("all");

  // Auth states
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [height, setHeight] = useState<number | "">("");
  const [age, setAge] = useState<number | "">("");
  const [preferredThrill, setPreferredThrill] = useState<number>(2);
  const [errorMsg, setErrorMsg] = useState("");

  // App data states
  const [rides, setRides] = useState<any[]>([]);
  const [selectedRide, setSelectedRide] = useState<any | null>(null);
  const [activeQueue, setActiveQueue] = useState<any | null>(null);
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  // Modals & Takeovers
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isBoardingTakeover, setIsBoardingTakeover] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Loading states
  const [loadingRides, setLoadingRides] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  // Countdown and ticker refs/states
  const [tickerIndex, setTickerIndex] = useState(0);
  const tickerMessages = [
    "Queue moving steadily...",
    "2 groups just boarded!",
    "Estimated wait decreasing...",
    "AI optimization active for ThrillVerse queues...",
    "Please stay near your current attraction area."
  ];

  // Boarding countdown timer state
  const [boardingTimeRemaining, setBoardingTimeRemaining] = useState(300); // 5 minutes in seconds

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Auth operations
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const res = await login(username, password);
    if (res.success) {
      notifyAuthSuccess("login", username);
      setIsAuthModalOpen(false);
      loadAllData();
    } else {
      setErrorMsg(res.error || "Invalid credentials.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanPhone = phoneNumber.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setErrorMsg("Mobile number must be exactly 10 digits.");
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    const payload = {
      first_name: firstName,
      last_name: lastName,
      username,
      email,
      phone_number: phoneNumber,
      height: height ? Number(height) : null,
      password,
      confirm_password: confirmPassword || password,
      age: age ? Number(age) : null,
      preferred_thrill: preferredThrill
    };
    const res = await register(payload);
    if (res.success) {
      notifyAuthSuccess("login", username);
      setIsAuthModalOpen(false);
      loadAllData();
    } else {
      setErrorMsg(res.error || "Registration failed.");
    }
  };

  const handleLogout = () => {
    logout();
    setActiveQueue(null);
    setStats(null);
    notifyAuthSuccess("logout");
  };

  // Data loading
  const loadRides = async () => {
    setLoadingRides(true);
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const res = await fetch(`${API_URL}/queue/rides/`, { headers });
      if (res.ok) {
        const data = await res.json();
        setRides(data);
      }
    } catch (e) {
      console.error("Error loading rides:", e);
    } finally {
      setLoadingRides(false);
    }
  };

  const loadActiveQueue = async () => {
    try {
      const res = await fetchWithAuth("/queue/my-queue/");
      if (res.ok) {
        const data = await res.json();
        setActiveQueue(data);
      } else {
        setActiveQueue(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadHistory = async () => {
    try {
      let url = "/queue/history/?status=all&limit=20";
      if (historyTab !== "all") {
        url = `/queue/history/?status=${historyTab}&limit=20`;
      }
      const res = await fetchWithAuth(url);
      if (res.ok) {
        const data = await res.json();
        setHistoryList(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadStats = async () => {
    try {
      const res = await fetchWithAuth("/queue/stats/");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadAllData = () => {
    loadRides();
    if (token) {
      loadActiveQueue();
      loadHistory();
      loadStats();
    }
  };

  useEffect(() => {
    loadAllData();
  }, [token]);

  useEffect(() => {
    if (token) {
      loadHistory();
    }
  }, [historyTab, token]);

  // Real-Time Synchronization Engine (SSE Stream + Backend Sync)
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource(`${API_URL}/queue/stream/`);
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.rides) {
            setRides(data.rides);
          }
        } catch (e) {
          console.error("SSE parse error:", e);
        }
      };
    } catch (e) {
      console.error("SSE Connection error:", e);
    }

    // 2-second interval sync for active queue and live tickers
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerMessages.length);
      if (token) {
        loadActiveQueue();
      } else {
        loadRides();
      }
    }, 2000);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(interval);
    };
  }, [token]);

  // Handle automatic boarding takeover when backend reports user status as 'boarding'
  useEffect(() => {
    if (activeQueue && activeQueue.status === "boarding" && !isBoardingTakeover) {
      setIsBoardingTakeover(true);
      showToast("Your ride is ready! Head to the gate immediately.");
      triggerConfetti();
    }
  }, [activeQueue, isBoardingTakeover]);

  // Boarding takeover countdown timer
  useEffect(() => {
    if (!isBoardingTakeover) return;

    const interval = setInterval(() => {
      setBoardingTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsBoardingTakeover(false);
          // Auto cancel if they miss boarding window
          handleLeaveQueue();
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBoardingTakeover]);

  // Format boarding countdown
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Actions
  const handleJoinQueue = async () => {
    if (!selectedRide) return;
    if (!token) {
      showToast("Please log in to join the virtual queue.");
      setIsAuthModalOpen(true);
      return;
    }
    setLoadingAction(true);
    try {
      const res = await fetchWithAuth("/queue/join/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ride_id: selectedRide.id })
      });
      const data = await res.json();
      if (res.ok) {
        setActiveQueue(data.queue);
        triggerConfetti();
        setIsQrOpen(true);
        showToast("Successfully joined virtual queue!");
        setTab("dashboard");
        setSelectedRide(null);
        loadStats();
      } else {
        showToast(data.error || data.detail || "Failed to join queue.");
      }
    } catch (e: any) {
      showToast(e.message || "Network error joining queue.");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleLeaveQueue = async () => {
    setLoadingAction(true);
    try {
      const res = await fetchWithAuth("/queue/leave/", {
        method: "DELETE"
      });
      if (res.ok) {
        setActiveQueue(null);
        setIsBoardingTakeover(false);
        showToast("Left queue successfully.");
        loadHistory();
        loadStats();
      } else {
        showToast("Failed to leave queue.");
      }
    } catch (e) {
      showToast("Network error cancelling queue.");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleConfirmBoarding = async () => {
    setLoadingAction(true);
    try {
      const res = await fetchWithAuth("/queue/complete/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queue_id: activeQueue?.id })
      });
      const data = await res.json();
      if (res.ok) {
        setActiveQueue(null);
        setIsBoardingTakeover(false);
        showToast(`Enjoy the ride! Earned ${data.xp_earned} XP!`);
        triggerConfetti();
        setTab("history");
        loadHistory();
        loadStats();
      } else {
        showToast("Could not confirm boarding.");
      }
    } catch (e) {
      showToast("Network error completing boarding.");
    } finally {
      setLoadingAction(false);
    }
  };

  // QR Code path details generator
  const getDeterministicQrPath = (text: string) => {
    // Generate simple geometric path for a custom QR code look
    let path = "";
    let seed = 0;
    for (let i = 0; i < text.length; i++) {
      seed += text.charCodeAt(i);
    }

    // Draw 3 square target locators
    path += "M 10 10 H 45 V 45 H 10 Z M 20 20 H 35 V 35 H 20 Z ";
    path += "M 135 10 H 170 V 45 H 135 Z M 145 20 H 160 V 35 H 145 Z ";
    path += "M 10 135 H 45 V 170 H 10 Z M 20 145 H 35 V 160 H 20 Z ";

    // Fill details randomly based on seed
    for (let x = 10; x < 170; x += 8) {
      for (let y = 10; y < 170; y += 8) {
        // Skip target locator regions
        if (x < 55 && y < 55) continue;
        if (x > 125 && y < 55) continue;
        if (x < 55 && y > 125) continue;

        const val = Math.sin(x * seed + y) * 10000;
        if (Math.floor(val) % 2 === 0) {
          path += `M ${x} ${y} H ${x + 5} V ${y + 5} H ${x} Z `;
        }
      }
    }
    return path;
  };

  // Auth Required Guard UI - direct sign in page when not logged in
  if (!token) {
    return (
      <div className={`${authMode === "register" ? "max-w-2xl" : "max-w-md"} mx-auto my-8 px-6 sm:px-10 py-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-blue-100 shadow-2xl relative overflow-hidden transition-all duration-300`} style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-blue-400/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-cyan-400/10 rounded-full blur-2xl" />

        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex w-16 h-16 bg-gradient-to-tr from-[#1a6ef5] to-[#0052cc] rounded-2xl items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-blue-500/30 mb-4" style={{ fontFamily: "'Exo 2', sans-serif" }}>TV</div>
          <h2 className="text-2xl font-black text-[#0d1f3c] tracking-tight" style={{ fontFamily: "'Exo 2', sans-serif" }}>
            {authMode === "login" ? "ThrillVerse Club Sign In" : "Create ThrillVerse Account"}
          </h2>
          <p className="text-sm text-[#5a78a8] mt-1">Unlock virtual queues, instant boarding passes, and live ride timing</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3.5 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <p className="text-xs text-rose-700 leading-normal">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={authMode === "login" ? handleLogin : handleRegister} className="space-y-4 relative z-10">
          {authMode === "login" ? (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Username</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="rohan123"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6ef5]/20 focus:border-[#1a6ef5] bg-slate-50/50"
                  />
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6ef5]/20 focus:border-[#1a6ef5] bg-slate-50/50"
                  />
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                </div>
              </div>
            </>
          ) : (
            /* Responsive 2-column Registration Form */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">First Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Rohan"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6ef5]/20 focus:border-[#1a6ef5] bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Last Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Sharma"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6ef5]/20 focus:border-[#1a6ef5] bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Username *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="rohan123"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6ef5]/20 focus:border-[#1a6ef5] bg-slate-50/50"
                  />
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Email Address *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="rohan@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6ef5]/20 focus:border-[#1a6ef5] bg-slate-50/50"
                  />
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Mobile Number (10 Digits) *</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    value={phoneNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setPhoneNumber(val);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6ef5]/20 focus:border-[#1a6ef5] bg-slate-50/50"
                  />
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Age (Yrs) *</label>
                  <input
                    type="number"
                    required
                    placeholder="22"
                    value={age}
                    onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6ef5]/20 focus:border-[#1a6ef5] bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Height (cm) *</label>
                  <input
                    type="number"
                    required
                    placeholder="175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : "")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6ef5]/20 focus:border-[#1a6ef5] bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Password *</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6ef5]/20 focus:border-[#1a6ef5] bg-slate-50/50"
                  />
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Confirm Password *</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6ef5]/20 focus:border-[#1a6ef5] bg-slate-50/50"
                  />
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Thrill Level Preference</label>
                <div className="flex gap-2">
                  {[
                    { level: 1, label: "Mild" },
                    { level: 2, label: "Moderate" },
                    { level: 3, label: "Extreme" }
                  ].map(({ level, label }) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setPreferredThrill(level)}
                      className="flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer"
                      style={{
                        background: preferredThrill === level ? "linear-gradient(135deg, #1a6ef5, #0052cc)" : "white",
                        color: preferredThrill === level ? "white" : "#64748b",
                        borderColor: preferredThrill === level ? "#1a6ef5" : "rgba(26, 110, 245, 0.15)"
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.01] cursor-pointer mt-4"
            style={{ background: "linear-gradient(135deg, #1a6ef5, #0052cc)" }}
          >
            {authMode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-500 relative z-10">
          {authMode === "login" ? (
            <p>
              New to ThrillVerse?{" "}
              <button onClick={() => setAuthMode("register")} className="text-[#1a6ef5] font-bold hover:underline cursor-pointer">
                Create an account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button onClick={() => setAuthMode("login")} className="text-[#1a6ef5] font-bold hover:underline cursor-pointer">
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28 relative" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-2xl bg-slate-900 text-white flex items-center gap-3 shadow-2xl animate-[slideIn_0.3s_ease-out] max-w-sm">
          <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
          <p className="text-xs font-semibold leading-relaxed">{toastMessage}</p>
        </div>
      )}

      {/* Screen Title & Profile Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#0d1f3c] tracking-tight flex items-center gap-2" style={{ fontFamily: "'Exo 2', sans-serif" }}>
            ThrillVerse <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a6ef5] to-[#0052cc]">Virtual Queue</span>
          </h1>
          <p className="text-sm text-[#5a78a8] mt-1">Smart AI-powered park boarding, zero physical queue lines.</p>
        </div>
        {userProfile ? (
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-2.5 pr-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#eef4ff] text-[#1a6ef5] flex items-center justify-center font-black text-sm">
              {userProfile.user.first_name ? userProfile.user.first_name[0] : userProfile.user.username[0].toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-bold text-[#0d1f3c]">
                {userProfile.user.first_name} {userProfile.user.last_name || ""}
              </p>
              <p className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold">
                <span>Age: {userProfile.age || "N/A"}</span>
                <span>•</span>
                <span className="text-[#1a6ef5] font-bold">{userProfile.role}</span>
              </p>
            </div>
            <button onClick={handleLogout} className="ml-2 text-xs font-bold text-rose-500 hover:underline cursor-pointer">
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl font-bold text-xs text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] cursor-pointer"
            style={{ background: "linear-gradient(135deg, #1a6ef5, #0052cc)" }}
          >
            Sign In / Register
          </button>
        )}
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1.5 p-1 bg-slate-100 rounded-2xl w-fit mb-8 shadow-sm">
        {[
          { id: "dashboard", label: "Dashboard" },
          { id: "join", label: "Join Queue" },
          { id: "history", label: "History & Stats" },
          { id: "passes", label: "Boarding Passes 🎟️" }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setSelectedRide(null);
              setTab(t.id as any);
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            style={{
              background: tab === t.id ? "white" : "transparent",
              color: tab === t.id ? "#1a6ef5" : "#64748b",
              boxShadow: tab === t.id ? "0 4px 14px rgba(26, 110, 245, 0.15)" : "none"
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── SCREEN 1 & 2: DASHBOARD TAB ─── */}
      {tab === "dashboard" && (
        <div className="max-w-4xl mx-auto space-y-6">
          {activeQueue ? (
            /* SCREEN 1: ACTIVE QUEUE VIEW */
            <div
              className="p-6 sm:p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-blue-100/50 shadow-2xl relative overflow-hidden transition-all duration-300 hover:translate-y-[-3px] hover:shadow-[0_20px_40px_rgba(26,110,245,0.15)] animate-[glow-pulse_3s_infinite]"
              style={{
                boxShadow: "0 10px 40px rgba(26, 110, 245, 0.12)",
                animationName: "glow-pulse",
                animationDuration: "4s",
                animationIterationCount: "infinite"
              }}
            >
              {/* Glow Animation Style block */}
              <style>{`
                  @keyframes glow-pulse {
                    0% { box-shadow: 0 10px 30px rgba(26, 110, 245, 0.12); border-color: rgba(26, 110, 245, 0.2); }
                    50% { box-shadow: 0 10px 45px rgba(6, 182, 212, 0.25); border-color: rgba(6, 182, 212, 0.3); }
                    100% { box-shadow: 0 10px 30px rgba(26, 110, 245, 0.12); border-color: rgba(26, 110, 245, 0.2); }
                  }
                `}</style>

              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-bold text-[#1a6ef5] tracking-widest uppercase bg-[#eef4ff] px-3 py-1 rounded-full">Active Reservation</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#0d1f3c] tracking-tight mt-2.5 flex items-center gap-2" style={{ fontFamily: "'Exo 2', sans-serif" }}>
                    {activeQueue.ride.emoji} {activeQueue.ride.name}
                  </h2>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#1a6ef5] to-[#0052cc] text-white shadow-md w-fit">
                  <span className="font-mono text-xs font-semibold">#</span>
                  <span className="font-poppins font-black text-sm tracking-wide">{activeQueue.token}</span>
                </div>
              </div>

              {/* Main Progress Section */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-12 mb-8 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                {/* Circular progress */}
                <div className="relative w-32 h-32 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    {/* background track */}
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                    {/* animated progress gradient stroke */}
                    <defs>
                      <linearGradient id="progGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1a6ef5" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="url(#progGrad)"
                      strokeWidth="8"
                      strokeDasharray="314.15"
                      // Calculate strokeDashoffset dynamically based on remaining position.
                      // For example: 314.15 - (314.15 * progress) / 100
                      strokeDashoffset={314.15 - (314.15 * Math.min(100, Math.max(5, (1 - activeQueue.position / 50.0) * 100))) / 100}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset 1s ease" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-slate-800 font-poppins">{activeQueue.position}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Position</span>
                  </div>
                </div>

                {/* Side Stats */}
                <div className="space-y-4 w-full sm:w-auto">
                  {[
                    { icon: Rocket, val: `Batch ${activeQueue.batch_number || 1}`, label: "Your Batch", color: "text-[#1a6ef5]", bg: "bg-blue-50" },
                    { icon: Users, val: activeQueue.batches_ahead !== undefined ? `${activeQueue.batches_ahead} Ahead` : `${activeQueue.people_ahead || (activeQueue.position - 1)} Ahead`, label: activeQueue.batches_ahead !== undefined ? "Batches Ahead" : "People Ahead", color: "text-cyan-500", bg: "bg-cyan-50" },
                    { icon: Clock, val: `${activeQueue.estimated_wait || activeQueue.ai_prediction || 0} Min`, label: "Est. Wait", color: "text-amber-500", bg: "bg-amber-50" },
                    {
                      icon: Zap,
                      val: activeQueue.boarding_time ? new Date(activeQueue.boarding_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Boarding Now",
                      label: "Boarding Time",
                      color: "text-emerald-500",
                      bg: "bg-emerald-50"
                    }
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-semibold">{stat.label}</p>
                        <p className="text-base font-black text-slate-700 font-poppins leading-tight mt-0.5">{stat.val}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Queue Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                  <span>Your Batch: {activeQueue.batch_number || 1}</span>
                  <span>{activeQueue.batches_ahead !== undefined ? `${activeQueue.batches_ahead} Batches Ahead` : `${activeQueue.position} Pos`}</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${Math.min(100, Math.max(5, (1 - (activeQueue.batches_ahead || 0) / 10.0) * 100))}%`,
                      background: (activeQueue.estimated_wait || 0) < 15
                        ? "linear-gradient(90deg, #10b981, #34d399)" // Short -> Green
                        : (activeQueue.estimated_wait || 0) < 30
                          ? "linear-gradient(90deg, #f59e0b, #fbbf24)" // Medium -> Amber
                          : "linear-gradient(90deg, #ef4444, #f87171)" // Long -> Red
                    }}
                  />
                </div>
              </div>

              {/* Live Backend Batch Info Strip */}
              <div className="p-3.5 bg-cyan-50/40 rounded-2xl border border-cyan-100 flex items-center gap-2.5 shadow-[0_4px_16px_rgba(6,182,212,0.04)] mb-6">
                <Sparkles className="w-5 h-5 text-cyan-500 shrink-0 animate-pulse" />
                <p className="text-xs text-cyan-800 font-medium">
                  Your Batch: <strong className="font-extrabold">{activeQueue.batch_number || 1}</strong> · <strong className="font-extrabold">{activeQueue.batches_ahead !== undefined ? `${activeQueue.batches_ahead} Batches Ahead` : ''}</strong> · Est. Wait: <strong className="font-extrabold">{activeQueue.estimated_wait || 0} Minutes</strong>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  onClick={() => setIsQrOpen(true)}
                  className="w-full py-3.5 rounded-2xl font-bold text-white shadow-lg shadow-cyan-200 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #06b6d4, #0891b2)" }}
                >
                  <QrCode className="w-4 h-4" /> View QR Code
                </button>
                <button
                  onClick={handleLeaveQueue}
                  disabled={loadingAction}
                  className="w-full py-3.5 rounded-2xl font-bold text-rose-600 bg-rose-50/50 border border-rose-200 transition-all hover:bg-rose-50 hover:border-rose-300 disabled:opacity-40"
                >
                  Leave Queue
                </button>
              </div>

              {/* Live Ticker */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shrink-0 animate-ping" />
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shrink-0 absolute" />
                  <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase shrink-0">Live Updates:</p>
                  <p className="text-xs text-slate-600 font-semibold truncate animate-[fadeIn_0.3s_ease]">{tickerMessages[tickerIndex]}</p>
                </div>
              </div>
            </div>
          ) : (
            /* SCREEN 2: NO ACTIVE QUEUE VIEW */
            <div className="space-y-8">
              {/* Empty State Hero */}
              <div className="text-center p-8 sm:p-12 rounded-3xl bg-white/70 backdrop-blur-xl border border-slate-100 shadow-xl flex flex-col items-center">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center shadow-inner relative animate-[float_3s_ease-in-out_infinite] mb-6">
                  <Clock className="w-10 h-10 text-blue-500" />
                  <style>{`
                      @keyframes float {
                        0% { transform: translateY(0px); }
                        50% { transform: translateY(-12px); }
                        100% { transform: translateY(0px); }
                      }
                    `}</style>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight font-poppins">No Active Queue</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-sm leading-relaxed">
                  You aren't waiting for any ride. Browse attractions below or search for your favorite ride to get a virtual queue ticket.
                </p>
                <button
                  onClick={() => setTab("join")}
                  className="mt-6 px-8 py-3.5 rounded-full font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #1a6ef5, #0052cc)" }}
                >
                  <Rocket className="w-4 h-4" /> Browse Rides & Join Queue
                </button>
              </div>

              {/* Popular Rides List */}
              <div>
                <h3 className="text-lg font-black text-[#0d1f3c] tracking-tight mb-4 flex items-center gap-2" style={{ fontFamily: "'Exo 2', sans-serif" }}>
                  <span>🔥</span> Popular Right Now
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {rides.slice(0, 4).map((ride) => (
                    <div
                      key={ride.id}
                      className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between gap-4 transition-all duration-200 hover:translate-x-1 hover:border-blue-200 hover:shadow-[0_4px_16px_rgba(26,110,245,0.08)]"
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="text-3xl shrink-0">{ride.emoji}</span>
                        <div>
                          <p className="font-extrabold text-sm text-[#0d1f3c] leading-snug">{ride.name}</p>
                          <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                            {ride.current_wait_time} Min wait · {ride.category}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedRide(ride);
                          setTab("join");
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#1a6ef5] bg-[#eef4ff] hover:bg-blue-100 transition-colors shrink-0 cursor-pointer"
                      >
                        + Join
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Queue Activity */}
              <div>
                <h3 className="text-lg font-black text-[#0d1f3c] tracking-tight mb-4" style={{ fontFamily: "'Exo 2', sans-serif" }}>
                  📅 Recent Queue Activity
                </h3>
                <div className="space-y-3">
                  {historyList.slice(0, 2).map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-white border border-slate-100 flex items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.status === 'completed' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                          {item.status === 'completed' ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <X className="w-4 h-4 text-rose-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-extrabold text-xs text-[#0d1f3c] leading-snug">{item.ride_name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {new Date(item.joined_at).toLocaleDateString([], { month: 'short', day: 'numeric' })} · Token: {item.token}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${item.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── SCREEN 3: JOIN QUEUE FLOW TAB ─── */}
      {tab === "join" && (
        <div className="max-w-4xl mx-auto">
          {!selectedRide ? (
            /* Browse Rides list */
            <div>
              <h2 className="text-xl font-black text-[#0d1f3c] tracking-tight mb-6" style={{ fontFamily: "'Exo 2', sans-serif" }}>Select an Attraction</h2>
              {loadingRides ? (
                <p className="text-sm text-slate-500">Loading park rides...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rides.map((ride) => (
                    <div
                      key={ride.id}
                      className="group rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-md flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-blue-100"
                    >
                      <div className="relative h-44 bg-slate-100 overflow-hidden">
                        <img
                          src={getRideImage(ride)}
                          alt={ride.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                        <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide bg-white/90 text-slate-800 shadow-sm">
                          {ride.category}
                        </span>
                        {ride.status === "closed" && (
                          <span className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide bg-rose-600 text-white shadow-md">
                            CLOSED 🚫
                          </span>
                        )}
                        {ride.status === "maintenance" && (
                          <span className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide bg-amber-500 text-white shadow-md">
                            MAINTENANCE 🛠️
                          </span>
                        )}
                        {ride.status !== "closed" && ride.status !== "maintenance" && ride.status_code === "riding" && (
                          <span className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide bg-cyan-600 text-white shadow-md">
                            Ride in Progress ({Math.floor((ride.phase_remaining_seconds || 0) / 60)}m {(ride.phase_remaining_seconds || 0) % 60}s)
                          </span>
                        )}
                        {ride.status !== "closed" && ride.status !== "maintenance" && ride.status_code === "batch_full" && (
                          <span className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide bg-amber-600 text-white shadow-md">
                            Batch Full
                          </span>
                        )}
                        {ride.status !== "closed" && ride.status !== "maintenance" && (ride.status_code === "seats_left" || ride.status_code === "boarding") && (
                          <span className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide bg-emerald-600 text-white shadow-md">
                            {ride.remaining_seats_in_batch !== undefined && ride.remaining_seats_in_batch < (ride.capacity || 24) ? `Only ${ride.remaining_seats_in_batch} Seats Left` : "Boarding Now"}
                          </span>
                        )}
                        <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 text-white bg-slate-900/60 px-2.5 py-1 rounded-xl backdrop-blur-sm">
                          <Clock className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="text-xs font-black font-poppins">
                            {ride.status === "closed" || ride.status === "maintenance" ? "N/A" : `Est. Wait: ${ride.next_batch_wait_minutes !== undefined ? ride.next_batch_wait_minutes : (ride.current_wait_time || 0)} Min`}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-extrabold text-base text-[#0d1f3c] leading-snug flex items-center gap-2">
                            <span>{ride.emoji}</span> {ride.name}
                          </h4>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[11px] text-[#1a6ef5] font-extrabold bg-blue-50 px-2.5 py-0.5 rounded-md">
                              Current Batch: {ride.current_batch_number || 1}
                            </span>
                            <span className="text-[11px] text-slate-500 font-bold">
                              Occupancy: {ride.current_batch_occupancy || 0}/{ride.capacity || 24}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-semibold mt-1.5">
                            Queue Length: {ride.total_queue_count || ride.active_queue_count || 0} Riders · Next: Batch {ride.next_boarding_batch || ride.current_batch_number || 1}
                          </p>
                        </div>

                        {(() => {
                          const isClosed = ride.status === "closed" || ride.status === "maintenance" || ride.status === "paused" || ride.queue_enabled === false;
                          return (
                            <button
                              onClick={() => setSelectedRide(ride)}
                              disabled={isClosed}
                              className={`w-full mt-5 py-2.5 rounded-2xl text-xs font-black transition-all shadow-md ${isClosed
                                  ? "bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300 shadow-none opacity-80"
                                  : "text-white shadow-blue-500/20 hover:shadow-blue-500/30 cursor-pointer"
                                }`}
                              style={{
                                background: isClosed ? "#e2e8f0" : "linear-gradient(135deg, #1a6ef5, #0052cc)"
                              }}
                            >
                              {ride.status === "closed"
                                ? "Closed 🚫"
                                : ride.status === "maintenance"
                                  ? "Under Maintenance 🛠️"
                                  : isClosed
                                    ? "Queue Paused ⏸️"
                                    : "Join Queue Now"}
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* CONFIRMATION BEFORE JOINING */
            <div className="max-w-md mx-auto relative z-10">
              <button
                onClick={() => setSelectedRide(null)}
                className="flex items-center gap-1 text-xs font-black text-[#1a6ef5] mb-6 hover:underline uppercase tracking-wide cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Rides
              </button>

              <div className="text-center mb-6">
                <span className="text-5xl block mb-3 animate-[pulse_2s_infinite]">{selectedRide.emoji}</span>
                <h3 className="text-2xl font-black text-[#0d1f3c]" style={{ fontFamily: "'Exo 2', sans-serif" }}>{selectedRide.name}</h3>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-bold">{selectedRide.category} Attraction</p>
              </div>

              <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-slate-100 shadow-xl mb-6 space-y-4">
                {[
                  { label: "Category", val: selectedRide.category },
                  { label: "Park Zone", val: selectedRide.zone || (
                    (selectedRide.category || '').toLowerCase() === 'thrill' ? 'Zone A' :
                    (selectedRide.category || '').toLowerCase() === 'water' ? 'Zone B' :
                    (selectedRide.category || '').toLowerCase() === 'kids' ? 'Zone D' : 'Zone C'
                  ) },
                  { label: "Current Wait", val: `${selectedRide.current_wait_time ?? selectedRide.wait ?? 0} Min`, class: "text-amber-500 font-extrabold" },
                  { label: "Ride Capacity", val: `${selectedRide.capacity} People/Cycle` },
                  { label: "Min. Height Limit", val: selectedRide.min_height_cm ? `${selectedRide.min_height_cm} cm` : (selectedRide.height || "No height limit") }
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center text-sm py-2.5 border-b border-slate-100/50 last:border-b-0">
                    <span className="text-slate-500 font-semibold">{row.label}</span>
                    <span className={`font-bold text-[#0d1f3c] ${row.class || ""}`}>{row.val}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5 mb-6">
                <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 leading-normal">
                  By joining, you agree to be present at the ride entrance when your queue number arrives. Boarding coordinates expire after 5 minutes of standby call.
                </p>
              </div>

              <button
                onClick={handleJoinQueue}
                disabled={loadingAction}
                className="w-full py-4 rounded-2xl font-black text-white shadow-xl shadow-blue-500/25 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
                style={{ background: "linear-gradient(135deg, #1a6ef5, #0052cc)" }}
              >
                <CheckCircle className="w-5 h-5" /> Confirm & Join Queue
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─── SCREEN 6: HISTORY & STATS TAB ─── */}
      {tab === "history" && (
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Stats Card */}
          {stats && (
            <div className="grid grid-cols-3 gap-4 p-5 rounded-3xl bg-slate-50 border border-slate-100 shadow-inner">
              {[
                { emoji: "🎢", val: stats.total_rides, label: "Total Rides" },
                { emoji: "⏱️", val: `${stats.total_wait_min}m`, label: "Total Wait" },
                { emoji: "❌", val: stats.cancelled_count, label: "Cancelled" }
              ].map((stat, i) => (
                <div key={i} className="text-center py-2">
                  <span className="text-2xl block mb-1">{stat.emoji}</span>
                  <p className="text-lg font-black text-slate-800 font-poppins leading-none">{stat.val}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          <div>
            <div className="flex items-center justify-between gap-4 mb-4">
              <h3 className="text-lg font-black text-[#0d1f3c]" style={{ fontFamily: "'Exo 2', sans-serif" }}>Ride History Log</h3>
              <div className="flex gap-1 p-0.5 bg-slate-100 rounded-xl">
                {["all", "completed", "cancelled"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setHistoryTab(f as any)}
                    className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                    style={{
                      background: historyTab === f ? "white" : "transparent",
                      color: historyTab === f ? "#1a6ef5" : "#64748b"
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {historyList.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-12 bg-white border border-slate-100 rounded-2xl">No history entries found.</p>
            ) : (
              <div className="space-y-3">
                {historyList.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white border border-slate-100 flex items-center justify-between gap-4 shadow-sm hover:translate-x-1 transition-transform"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${item.status === 'completed' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                        {item.status === 'completed' ? (
                          <Check className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <X className="w-4 h-4 text-rose-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-extrabold text-sm text-[#0d1f3c] leading-snug truncate">
                          {item.ride_emoji} {item.ride_name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                          {new Date(item.joined_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} · Token: {item.token}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${item.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── SCREEN 7: BOARDING PASSES TAB ─── */}
      {tab === "passes" && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-[#0d1f3c]" style={{ fontFamily: "'Exo 2', sans-serif" }}>
                My Boarding Passes 🎟️
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Access and present your digital attraction boarding passes with 2D QR turnstile codes.
              </p>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-[#1a6ef5] font-black text-xs rounded-full uppercase tracking-wider">
              {historyList.length + (activeQueue ? 1 : 0)} Total Passes
            </span>
          </div>

          {/* Active Reservation Highlight Card */}
          {activeQueue && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1a6ef5] to-[#0052cc] text-white shadow-xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="space-y-2 text-center md:text-left">
                  <span className="px-3 py-1 bg-white/20 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                    Live Active Boarding Pass
                  </span>
                  <h4 className="text-2xl font-black font-poppins pt-1">
                    {activeQueue.ride.emoji} {activeQueue.ride.name}
                  </h4>
                  <p className="text-xs text-blue-100 font-mono">Token: {activeQueue.token} · Status: {activeQueue.status.toUpperCase()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-white p-1.5 rounded-2xl shadow-lg shrink-0">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(activeQueue.token)}`}
                      alt="Active QR"
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>
                  <button
                    onClick={() => setIsQrOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-white text-[#1a6ef5] font-black text-xs shadow-md hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    Open Full QR Pass
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Grid of Boarding Passes */}
          {historyList.length === 0 && !activeQueue ? (
            <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl shadow-sm">
              <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-700">No Boarding Passes Found</h4>
              <p className="text-xs text-slate-400 mt-1">Join a virtual queue ride to receive your digital boarding pass.</p>
              <button
                onClick={() => setTab("join")}
                className="mt-5 px-6 py-2.5 bg-[#1a6ef5] text-white font-bold rounded-xl text-xs shadow-md hover:bg-[#0052cc] transition-colors cursor-pointer"
              >
                Browse Rides Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {historyList.map((pass) => (
                <div
                  key={pass.id}
                  className="p-5 rounded-3xl bg-white border border-slate-150 shadow-md flex items-center justify-between gap-4 hover:border-blue-300 transition-all"
                >
                  <div className="space-y-1.5 min-w-0">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${pass.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {pass.status}
                    </span>
                    <h5 className="font-extrabold text-base text-[#0d1f3c] truncate">
                      {pass.ride_emoji || "🎢"} {pass.ride_name}
                    </h5>
                    <p className="text-[11px] font-mono text-slate-500 font-bold">
                      {pass.token}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold">
                      {new Date(pass.joined_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className="w-20 h-20 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(pass.token)}`}
                        alt="Boarding Pass QR"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                    <button
                      onClick={() => {
                        setActiveQueue({
                          ride: { emoji: pass.ride_emoji || "🎢", name: pass.ride_name || "Attraction" },
                          token: pass.token
                        });
                        setIsQrOpen(true);
                      }}
                      className="px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1a6ef5] font-black text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      View QR Pass
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── SCREEN 4: QR CODE MODAL ─── */}
      {isQrOpen && activeQueue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-[6px] animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-[340px] rounded-3xl bg-white border border-slate-100 shadow-2xl p-6 relative overflow-hidden">
            {/* Close */}
            <button
              onClick={() => setIsQrOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#1a6ef5] text-[11px] font-black uppercase tracking-wider mb-4">
                <Clock className="w-3 h-3" /> Boarding Pass QR
              </div>

              <h3 className="text-lg font-black text-[#0d1f3c] tracking-tight mb-4" style={{ fontFamily: "'Exo 2', sans-serif" }}>
                {activeQueue?.ride?.emoji || activeQueue?.ride_emoji || "🎢"} {activeQueue?.ride?.name || activeQueue?.ride_name || "Attraction"}
              </h3>

              {/* Real 2D Scannable QR Code */}
              <div className="w-[190px] h-[190px] mx-auto bg-white border border-slate-200 rounded-2xl flex items-center justify-center p-2 shadow-md mb-4">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(activeQueue.token)}`}
                  alt="Scannable Boarding Pass QR Code"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>

              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Queue Token</p>
              <h4 className="text-xl font-black text-[#1a6ef5] mt-1 tracking-wide font-mono">{activeQueue.token}</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[240px] mx-auto mt-3">
                Scan this QR code at the turnstile gate when your 5-minute boarding window opens.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => showToast("QR Code saved/shared successfully!")}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
              <button
                onClick={() => setIsQrOpen(false)}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition-colors flex items-center justify-center cursor-pointer shadow-md shadow-blue-500/20"
                style={{ background: "linear-gradient(135deg, #1a6ef5, #0052cc)" }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── SCREEN 5: BOARDING TAKEOVER SCREEN ─── */}
      {isBoardingTakeover && activeQueue && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md text-white overflow-y-auto">
          <div className="w-full max-w-[380px] bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center relative z-10 space-y-6 shadow-2xl">
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Boarding Pass Active
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight pt-2" style={{ fontFamily: "'Exo 2', sans-serif" }}>
                Your Ride is Ready!
              </h2>
              <p className="text-cyan-400 text-base font-bold flex items-center justify-center gap-2" style={{ fontFamily: "'Exo 2', sans-serif" }}>
                {activeQueue.ride.emoji} {activeQueue.ride.name}
              </p>
            </div>

            {/* 5-minute Countdown timer card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 max-w-xs mx-auto shadow-inner">
              <p className="text-cyan-400 text-4xl font-black font-mono tracking-wider">
                {formatTime(boardingTimeRemaining)}
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">5-Min Boarding Window Remaining</p>
            </div>

            {/* Real 2D Scannable QR Box */}
            <div className="w-[180px] h-[180px] mx-auto bg-white rounded-2xl flex items-center justify-center p-2 shadow-lg border border-slate-200">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(activeQueue.token)}`}
                alt="Scannable Boarding Pass QR Code"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-[280px] mx-auto">
              Scan your token <strong className="text-white font-mono">{activeQueue.token}</strong> at the ride turnstile before your 5-minute timer expires.
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleConfirmBoarding}
                disabled={loadingAction}
                className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #1a6ef5, #0052cc)" }}
              >
                <CheckCircle className="w-4 h-4" /> Confirm Boarding
              </button>

              <button
                onClick={handleLeaveQueue}
                disabled={loadingAction}
                className="text-xs font-semibold text-slate-400 hover:text-slate-200 block mx-auto transition-colors"
              >
                Cancel Reservation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
