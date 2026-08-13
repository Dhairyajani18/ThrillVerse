import React, { useState, useEffect } from "react";
import {
  User, Mail, Phone, Calendar, MapPin, Shield, Edit3, Lock, LogOut,
  Ticket, Zap, Clock, CheckCircle2, AlertCircle, RefreshCw, ChevronRight,
  Download, QrCode, Sparkles, Bell, ArrowRight, ShieldCheck, Heart,
  Compass, Map, HelpCircle, Activity, Award, CheckCircle, X, Navigation, Eye,
  Upload, Trash2, DollarSign, Tag, Info
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { notifyAuthSuccess } from "../../utils/toast";
import { toast } from "sonner";

interface UserProfilePageProps {
  setPage: (p: string) => void;
  setSelectedQueueRide?: (ride: any) => void;
}

export default function UserProfilePage({ setPage, setSelectedQueueRide }: UserProfilePageProps) {
  const { token, userProfile, logout, fetchWithAuth, refreshProfile } = useAuth();
  
  // Data states
  const [liveProfile, setLiveProfile] = useState<any | null>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [activeQueue, setActiveQueue] = useState<any | null>(null);
  const [queueHistory, setQueueHistory] = useState<any[]>([]);
  const [queueStats, setQueueStats] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals & UI states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [activeQrModalTicket, setActiveQrModalTicket] = useState<any | null>(null);
  const [activeBookingDetailsTicket, setActiveBookingDetailsTicket] = useState<any | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [cancellingTicketId, setCancellingTicketId] = useState<any | null>(null);

  // Edit profile form state (Permitted fields: first_name, last_name, email, phone_number, height, profile_image)
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    height: "" as number | string,
    profile_image: ""
  });

  // Change password form state
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: ""
  });

  // Load all dynamic profile data from backend APIs
  const loadProfileData = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [profileRes, ticketsRes, queueRes, historyRes, statsRes, notifRes] = await Promise.all([
        fetchWithAuth("/auth/profile/").then(res => res.ok ? res.json() : null).catch(() => null),
        fetchWithAuth("/queue/tickets/").then(res => res.ok ? res.json() : []).catch(() => []),
        fetchWithAuth("/queue/my-queue/").then(res => res.ok ? res.json() : null).catch(() => null),
        fetchWithAuth("/queue/history/").then(res => res.ok ? res.json() : []).catch(() => []),
        fetchWithAuth("/queue/stats/").then(res => res.ok ? res.json() : null).catch(() => null),
        fetchWithAuth("/queue/notifications/").then(res => res.ok ? res.json() : []).catch(() => [])
      ]);

      if (profileRes) {
        setLiveProfile(profileRes);
        localStorage.setItem("user_profile", JSON.stringify(profileRes));
      }
      setTickets(Array.isArray(ticketsRes) ? ticketsRes : []);
      setActiveQueue(queueRes?.status === "in_queue" || queueRes?.status === "waiting" || queueRes?.status === "boarding" ? queueRes : null);
      setQueueHistory(Array.isArray(historyRes) ? historyRes : []);
      setQueueStats(statsRes);
      setNotifications(Array.isArray(notifRes) ? notifRes : []);
    } catch (e) {
      console.error("Error loading profile data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, [token]);

  // Populate edit form when profile data changes
  const activeProfile = liveProfile || userProfile;

  useEffect(() => {
    if (activeProfile) {
      const u = activeProfile.user || activeProfile;
      setEditForm({
        first_name: u.first_name || activeProfile.first_name || "",
        last_name: u.last_name || activeProfile.last_name || "",
        email: activeProfile.email || u.email || "",
        phone_number: activeProfile.phone_number || "",
        height: activeProfile.height ?? "",
        profile_image: activeProfile.profile_image || activeProfile.profile_picture || ""
      });
    }
  }, [activeProfile]);

  // Safely extract identity & profile details
  const storedProfile = (() => {
    try {
      const s = localStorage.getItem("user_profile");
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  })();

  const currentProfile = liveProfile || userProfile || storedProfile || {};
  const u = currentProfile.user || currentProfile;

  const username = currentProfile.username || u.username || localStorage.getItem("username") || "-";
  const email = currentProfile.email || u.email || localStorage.getItem("user_email") || "-";
  const fullName = currentProfile.full_name || u.full_name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || (username !== "-" ? username : "-");
  const phoneNumber = currentProfile.phone_number || "-";
  const rawHeight = currentProfile.height ?? liveProfile?.height ?? userProfile?.height ?? storedProfile?.height;
  const heightVal = (rawHeight !== null && rawHeight !== undefined && rawHeight !== "") ? `${rawHeight} cm` : "-";
  const memberSince = currentProfile.member_since || "July 2026";
  const role = currentProfile.role || (u.is_superuser || u.is_staff ? "Admin" : "User");
  const accountStatus = currentProfile.account_status || (u.is_active !== false ? "Active" : "Inactive");
  const profileImage = currentProfile.profile_image || currentProfile.profile_picture || null;
  const isAdmin = role.toLowerCase() === "admin" || u.is_superuser || u.is_staff;

  // Single first letter generator for fallback avatar (like old code)
  const getInitials = () => {
    if (fullName && fullName !== "-") return fullName.trim()[0].toUpperCase();
    if (username && username !== "-") return username.trim()[0].toUpperCase();
    return "U";
  };

  // Profile Image Upload Handler (Converts file to Base64 data URL)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Profile picture size must be under 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditForm(prev => ({ ...prev, profile_image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // Remove Profile Picture
  const handleRemoveImage = () => {
    setEditForm(prev => ({ ...prev, profile_image: "" }));
  };

  // Handle Edit Profile submission (PUT /auth/profile/)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const payload: any = {
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        email: editForm.email,
        phone_number: editForm.phone_number,
        height: editForm.height ? Number(editForm.height) : null,
        profile_image: editForm.profile_image
      };

      const res = await fetchWithAuth("/auth/profile/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const updated = await res.json();
        setLiveProfile(updated);
        localStorage.setItem("user_profile", JSON.stringify(updated));
        toast.success("Profile updated successfully! ✨");
        setIsEditModalOpen(false);
        await refreshProfile();
      } else {
        const errData = await res.json();
        toast.error(errData.detail || "Failed to update profile.");
      }
    } catch (err) {
      toast.error("Network error updating profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Change Password submission
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error("New passwords do not match!");
      return;
    }
    setChangingPassword(true);
    try {
      const res = await fetchWithAuth("/auth/change-password/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          old_password: passwordForm.old_password,
          new_password: passwordForm.new_password
        })
      });
      if (res.ok) {
        toast.success("Password changed successfully! 🔒");
        setIsChangePasswordModalOpen(false);
        setPasswordForm({ old_password: "", new_password: "", confirm_password: "" });
      } else {
        const errData = await res.json();
        toast.error(errData.old_password || errData.detail || "Failed to change password.");
      }
    } catch (err) {
      toast.error("Network error changing password.");
    } finally {
      setChangingPassword(false);
    }
  };

  // Handle Ticket Cancellation (POST /queue/tickets/<id>/cancel/)
  const handleCancelTicket = async (ticketId: number | string) => {
    if (!confirm("Are you sure you want to cancel this ticket booking?")) return;
    setCancellingTicketId(ticketId);
    try {
      const res = await fetchWithAuth(`/queue/tickets/${ticketId}/cancel/`, {
        method: "POST"
      });
      if (res.ok) {
        toast.success("Ticket cancelled successfully.");
        await loadProfileData();
      } else {
        const data = await res.json();
        toast.error(data.error || "Could not cancel ticket.");
      }
    } catch (e) {
      toast.error("Network error cancelling ticket.");
    } finally {
      setCancellingTicketId(null);
    }
  };

  // Handle leaving virtual queue
  const handleLeaveQueue = async () => {
    if (!confirm("Are you sure you want to leave the virtual queue?")) return;
    try {
      const res = await fetchWithAuth("/queue/leave/", { method: "DELETE" });
      if (res.ok) {
        toast.success("Left virtual queue successfully.");
        setActiveQueue(null);
        await loadProfileData();
      } else {
        toast.error("Could not leave queue.");
      }
    } catch (e) {
      toast.error("Network error leaving queue.");
    }
  };

  // Deterministic SVG QR Code Generator helper
  const getDeterministicQrPath = (tokenStr: any) => {
    let hash = 0;
    const str = String(tokenStr || "thrillverse");
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let path = "";
    for (let y = 0; y < 15; y++) {
      for (let x = 0; x < 15; x++) {
        const bit = (Math.abs(hash) >> ((x + y * 15) % 31)) & 1;
        const isCorner = (x < 4 && y < 4) || (x > 10 && y < 4) || (x < 4 && y > 10);
        if (bit || isCorner) {
          path += `M${x * 4} ${y * 4}h4v4h-4z`;
        }
      }
    }
    return path;
  };

  // Dynamic statistics calculations
  const safeTickets = Array.isArray(tickets) ? tickets : [];
  const todayStr = new Date().toISOString().split("T")[0];

  const totalTickets = queueStats?.total_tickets ?? safeTickets.length;
  const activeTickets = queueStats?.active_tickets ?? safeTickets.filter(t => t && (t.status === "active" || t.status === "valid") && (!t.valid_date || t.valid_date >= todayStr)).length;
  const upcomingVisits = queueStats?.upcoming_visits ?? safeTickets.filter(t => t && (t.status === "active" || t.status === "valid") && (!t.valid_date || t.valid_date >= todayStr)).length;
  const completedVisits = queueStats?.completed_visits ?? safeTickets.filter(t => t && (t.status === "used" || t.status === "completed" || (t.valid_date && t.valid_date < todayStr && t.status !== "cancelled"))).length;
  const totalRideBookings = queueStats?.total_ride_bookings ?? (queueHistory.length + (activeQueue ? 1 : 0));
  const completedRides = queueStats?.completed_rides ?? queueStats?.total_rides ?? queueHistory.filter(q => q.status === "completed").length;
  const cancelledTickets = queueStats?.cancelled_tickets ?? safeTickets.filter(t => t?.status === "cancelled").length;
  const totalAmountSpent = queueStats?.total_amount_spent ?? safeTickets.reduce((acc, t) => acc + (t.price || 0), 0);

  // Loading Skeleton Component
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans animate-pulse">
        {/* Profile Header Skeleton */}
        <div className="h-48 bg-slate-200 rounded-3xl mb-8 w-full" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="h-40 bg-slate-200 rounded-3xl w-full" />
            <div className="h-64 bg-slate-200 rounded-3xl w-full" />
          </div>
          <div className="space-y-8">
            <div className="h-72 bg-slate-200 rounded-3xl w-full" />
            <div className="h-48 bg-slate-200 rounded-3xl w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* 1. PROFILE HEADER */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-1/3 -top-10 w-48 h-48 bg-cyan-400/20 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          {/* Avatar Container */}
          <div className="relative group shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-white/30 bg-white/10 backdrop-blur-md shadow-2xl flex items-center justify-center">
              {profileImage ? (
                <img src={profileImage} alt={fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-white text-4xl sm:text-5xl font-black font-poppins">
                  {getInitials()}
                </div>
              )}
            </div>
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="absolute -bottom-2 -right-2 p-2 bg-white text-blue-600 rounded-xl shadow-lg hover:scale-110 transition-transform cursor-pointer"
              title="Edit Profile Picture"
            >
              <Edit3 size={16} />
            </button>
          </div>

          {/* User Meta Summary */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-poppins">{fullName}</h1>
              <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${
                isAdmin 
                  ? "bg-amber-400/20 text-amber-200 border-amber-300/40" 
                  : "bg-white/20 text-white border-white/30"
              }`}>
                {role} Member
              </span>
            </div>
            <p className="text-xs sm:text-sm text-blue-100 font-medium mb-4 flex flex-wrap items-center justify-center md:justify-start gap-4">
              <span className="flex items-center gap-1.5"><Mail size={14} />{email}</span>
              <span className="flex items-center gap-1.5"><Phone size={14} />{phoneNumber}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} />Member since {memberSince}</span>
            </p>

            {/* Quick Overview Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2.5 rounded-2xl text-center">
                <span className="text-blue-100 font-semibold block uppercase tracking-wider text-[10px]">Total Tickets</span>
                <span className="text-lg font-black font-poppins">{totalTickets}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2.5 rounded-2xl text-center">
                <span className="text-blue-100 font-semibold block uppercase tracking-wider text-[10px]">Rides Attended</span>
                <span className="text-lg font-black font-poppins">{completedRides}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2.5 rounded-2xl text-center">
                <span className="text-blue-100 font-semibold block uppercase tracking-wider text-[10px]">Height</span>
                <span className="text-lg font-black font-poppins">{heightVal}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2.5 rounded-2xl text-center">
                <span className="text-blue-100 font-semibold block uppercase tracking-wider text-[10px]">Status</span>
                <span className="text-lg font-black font-poppins">{accountStatus}</span>
              </div>
            </div>
          </div>

          {/* Action Header Button */}
          <div className="shrink-0">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-5 py-2.5 bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-2xl text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Edit3 size={15} />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: 2 COLS */}
        <div className="lg:col-span-2 space-y-8">

          {/* ═══════════════════════════════════════════════════════════════════════════ */}
          {/* 2. DYNAMIC PROFILE STATISTICS (8 METRICS) */}
          {/* ═══════════════════════════════════════════════════════════════════════════ */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Activity size={18} />
              </div>
              <h3 className="text-base font-black text-slate-800 font-poppins uppercase tracking-wider">Profile Statistics</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {[
                { label: "Total Tickets", count: totalTickets, color: "#1a6ef5", icon: "🎟️" },
                { label: "Active Tickets", count: activeTickets, color: "#10b981", icon: "✨" },
                { label: "Upcoming Visits", count: upcomingVisits, color: "#8b5cf6", icon: "📅" },
                { label: "Completed Visits", count: completedVisits, color: "#06b6d4", icon: "✅" },
                { label: "Total Ride Bookings", count: totalRideBookings, color: "#f59e0b", icon: "⚡" },
                { label: "Completed Rides", count: completedRides, color: "#ec4899", icon: "🎢" },
                { label: "Cancelled Tickets", count: cancelledTickets, color: "#ef4444", icon: "🚫" },
                { label: "Total Amount Spent", count: `₹${totalAmountSpent}`, color: "#059669", icon: "💳" },
              ].map(stat => (
                <div key={stat.label} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
                  <span className="absolute -right-2 -bottom-2 text-3xl opacity-10 group-hover:scale-110 transition-transform">{stat.icon}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                  <span className="text-xl font-black mt-2 font-poppins" style={{ color: stat.color }}>{stat.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════════════ */}
          {/* 3. RIDE BOOKINGS (VIRTUAL QUEUE) */}
          {/* ═══════════════════════════════════════════════════════════════════════════ */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Zap size={18} />
                </div>
                <h3 className="text-base font-black text-slate-800 font-poppins uppercase tracking-wider">Ride Bookings</h3>
              </div>
              <button onClick={() => setPage("VIRTUAL_QUEUE")} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                Virtual Queue Console <ChevronRight size={14} />
              </button>
            </div>

            {activeQueue ? (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100 flex flex-col sm:flex-row items-center gap-5 relative overflow-hidden">
                <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-3xl font-black shrink-0 shadow-md">
                  {activeQueue.ride?.emoji || "🎢"}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-blue-600 text-white uppercase tracking-wider">
                      Position #{activeQueue.position}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-500 text-white uppercase tracking-wider animate-pulse">
                      {activeQueue.status === "boarding" || activeQueue.status === "ready" ? "READY TO BOARD 🚀" : "IN QUEUE ⏳"}
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-slate-800 font-poppins">{activeQueue.ride?.name || activeQueue.ride_name || "Nitro Roller Coaster"}</h4>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Est. Wait Time: <span className="font-bold text-slate-700">{activeQueue.estimated_wait} mins</span> · Boarding Time: <span className="font-bold text-emerald-600">{activeQueue.boarding_time ? new Date(activeQueue.boarding_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (activeQueue.estimated_wait ? new Date(Date.now() + activeQueue.estimated_wait * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Boarding Now")}</span>
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full sm:w-auto">
                  <button 
                    onClick={() => setPage("PARK_MAP")}
                    className="px-3.5 py-2 bg-white text-slate-700 rounded-xl font-bold text-xs border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
                  >
                    <Navigation size={13} /> Navigate
                  </button>
                  <button 
                    onClick={() => setPage("VIRTUAL_QUEUE")}
                    className="px-3.5 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye size={13} /> View Details
                  </button>
                  {(activeQueue.status === "waiting" || activeQueue.status === "in_queue") && (
                    <button 
                      onClick={handleLeaveQueue}
                      className="px-3.5 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-xs hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <Trash2 size={13} /> Leave Queue
                    </button>
                  )}
                </div>
              </div>
            ) : queueHistory.length > 0 ? (
              <div className="space-y-3">
                {queueHistory.slice(0, 3).map((item, idx) => (
                  <div key={item.id || idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.ride_emoji || "🎢"}</span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{item.ride_name || "Park Ride"}</h4>
                        <p className="text-[11px] text-slate-400 font-medium">Wait: {item.wait_minutes || item.estimated_wait || 15} mins · Token: {item.token}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        item.status === "completed" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                      }`}>
                        {item.status}
                      </span>
                      <button onClick={() => setPage("PARK_MAP")} className="p-1.5 bg-white text-slate-600 rounded-lg hover:bg-slate-100 border border-slate-200" title="Navigate to Ride">
                        <Navigation size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-slate-50/80 border-2 border-dashed border-slate-200">
                <span className="text-3xl mb-2 block">🎢</span>
                <h4 className="text-sm font-black text-slate-700 font-poppins mb-1">No Active or Past Ride Bookings</h4>
                <p className="text-xs text-slate-500 mb-4 max-w-md mx-auto">Join the virtual line for top rides without standing in physical queue lines at the park.</p>
                <button 
                  onClick={() => setPage("VIRTUAL_QUEUE")}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-md hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Explore & Join Queue
                </button>
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════════════════════ */}
          {/* 4. MY BOOKED TICKETS */}
          {/* ═══════════════════════════════════════════════════════════════════════════ */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Ticket size={18} />
                </div>
                <h3 className="text-base font-black text-slate-800 font-poppins uppercase tracking-wider">My Tickets ({safeTickets.length})</h3>
              </div>
              <button onClick={() => setPage("TICKETS")} className="text-xs font-bold text-blue-600 hover:underline">
                Book New Ticket +
              </button>
            </div>

            {safeTickets.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50/80 border-2 border-dashed border-slate-200">
                <span className="text-3xl mb-2 block">🎟️</span>
                <h4 className="text-sm font-black text-slate-700 font-poppins mb-1">No Booked Tickets Found</h4>
                <p className="text-xs text-slate-500 mb-4">Book online tickets now to get instant QR admission & best park discounts.</p>
                <button 
                  onClick={() => setPage("TICKETS")}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-md hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Book Tickets Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {safeTickets.map((ticket, idx) => {
                  const tStatus = (ticket.status || "active").toLowerCase();
                  const canCancel = (tStatus === "active" || tStatus === "valid") && ticket.valid_date && ticket.valid_date >= todayStr;

                  return (
                    <div key={ticket.ticket_id || ticket.id || idx} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="px-2.5 py-1 rounded-full text-[9px] font-black bg-blue-50 text-blue-600 uppercase tracking-wider">
                            {ticket.ticket_type || "Day Pass"}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            tStatus === "active" || tStatus === "valid" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                            tStatus === "used" || tStatus === "completed" ? "bg-slate-100 text-slate-500" :
                            "bg-rose-50 text-rose-600 border border-rose-200"
                          }`}>
                            {ticket.status || "Active"}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-800 font-poppins">{ticket.holder_name || fullName}</h4>
                        <p className="text-[11px] text-slate-400 font-semibold">ID: {ticket.ticket_id || `TV-${ticket.id}`}</p>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs">
                        <div className="flex justify-between text-slate-500">
                          <span>Visit Date:</span>
                          <span className="font-bold text-slate-700">{ticket.valid_date || "Today"}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Visitors:</span>
                          <span className="font-bold text-slate-700">1 Visitor</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Amount:</span>
                          <span className="font-bold text-emerald-600">₹{ticket.price || 999} (Paid 💳)</span>
                        </div>
                      </div>

                      {/* Ticket Action Buttons */}
                      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs font-bold">
                        <button 
                          onClick={() => setActiveQrModalTicket(ticket)}
                          className="py-2 px-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <QrCode size={13} /> View Ticket
                        </button>
                        <button 
                          onClick={() => setActiveBookingDetailsTicket(ticket)}
                          className="py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Info size={13} /> Details
                        </button>
                        <button 
                          onClick={() => {
                            setActiveQrModalTicket(ticket);
                            toast.success("Downloading Ticket QR...");
                          }}
                          className="col-span-1 py-2 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Download size={13} /> QR Download
                        </button>
                        {canCancel ? (
                          <button 
                            onClick={() => handleCancelTicket(ticket.id)}
                            disabled={cancellingTicketId === ticket.id}
                            className="col-span-1 py-2 px-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            <X size={13} /> Cancel
                          </button>
                        ) : (
                          <div className="col-span-1 py-2 px-2 text-[10px] text-slate-400 text-center font-semibold flex items-center justify-center">
                            Non-refundable
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: 1 COL */}
        <div className="space-y-8">

          {/* ═══════════════════════════════════════════════════════════════════════════ */}
          {/* 5. MY PROFILE DETAILS CARD */}
          {/* ═══════════════════════════════════════════════════════════════════════════ */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-slate-800 font-poppins uppercase tracking-wider flex items-center gap-2">
                <User size={16} className="text-blue-600" />
                Account Information
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                accountStatus === "Active" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-rose-50 text-rose-600"
              }`}>
                {accountStatus} 🟢
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-bold">Full Name</span>
                <span className="font-black text-slate-800">{fullName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-bold">Username</span>
                <span className="font-black text-slate-800">{username}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-bold">Email Address</span>
                <span className="font-black text-slate-800 truncate max-w-[150px]">{email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-bold">Mobile Number</span>
                <span className="font-black text-slate-800">{phoneNumber}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-bold">Height</span>
                <span className="font-black text-slate-800">{userProfile?.height ? `${userProfile.height} cm` : heightVal || "Not Specified"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-bold">Age</span>
                <span className="font-black text-slate-800">{userProfile?.age ? `${userProfile.age} Yrs` : "Not Specified"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-bold">Preferred Thrill</span>
                <span className="font-black text-slate-800">
                  {userProfile?.preferred_thrill === 3 ? "High Thrill 🚀" : userProfile?.preferred_thrill === 1 ? "Low Thrill 🎠" : "Medium Thrill 🎡"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-bold">Member Since</span>
                <span className="font-black text-slate-800">{memberSince}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-bold">User Role</span>
                <span className="font-black text-slate-800">{role}</span>
              </div>
            </div>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="mt-5 w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition-colors border border-slate-200 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Edit3 size={14} /> Edit Information
            </button>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════════════ */}
          {/* 6. REAL-TIME NOTIFICATIONS */}
          {/* ═══════════════════════════════════════════════════════════════════════════ */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 font-poppins uppercase tracking-wider mb-4 flex items-center gap-2">
              <Bell size={16} className="text-blue-600" />
              Notifications
            </h3>

            {notifications.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">No active notifications</div>
            ) : (
              <div className="space-y-3">
                {notifications.map((n, idx) => (
                  <div key={n.id || idx} className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-slate-800">{n.title}</h4>
                        <span className="px-1.5 py-0.2 rounded text-[8px] font-extrabold bg-blue-100 text-blue-700 uppercase">
                          {n.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{n.desc}</p>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 shrink-0">{n.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════════════════════ */}
          {/* 7. ADMIN PANEL ACCESS (EXCLUSIVE TO ADMIN USERS) */}
          {/* ═══════════════════════════════════════════════════════════════════════════ */}
          {isAdmin && (
            <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold">
                    <ShieldCheck size={18} />
                  </div>
                  <h3 className="text-sm font-black font-poppins uppercase tracking-wider text-amber-300">Admin Panel Access</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-400/20 text-amber-300 uppercase">
                  ADMIN ONLY
                </span>
              </div>

              <p className="text-xs text-slate-300 mb-4">Quick Shortcuts to ThrillVerse Admin Management Console:</p>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                {[
                  { name: "Dashboard", icon: "📊" },
                  { name: "Ride Management", icon: "🎢" },
                  { name: "User Management", icon: "👥" },
                  { name: "Ticket Management", icon: "🎟️" },
                  { name: "Virtual Queue", icon: "⚡" },
                  { name: "Park Analytics", icon: "📈" },
                  { name: "Notifications", icon: "🔔" },
                  { name: "Reports", icon: "📄" }
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setPage("ADMIN")}
                    className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all text-left flex items-center gap-2 cursor-pointer border border-white/10"
                  >
                    <span>{item.icon}</span>
                    <span className="truncate">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════════════ */}
          {/* 8. ACCOUNT SETTINGS */}
          {/* ═══════════════════════════════════════════════════════════════════════════ */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 font-poppins uppercase tracking-wider mb-4 flex items-center gap-2">
              <Shield size={16} className="text-blue-600" />
              Account Settings
            </h3>

            <div className="space-y-2 text-xs font-bold">
              <button onClick={() => setIsEditModalOpen(true)} className="w-full text-left p-3 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center justify-between cursor-pointer">
                <span className="flex items-center gap-2"><Edit3 size={14} /> Edit Profile Info</span>
                <ChevronRight size={14} className="text-slate-400" />
              </button>
              <button onClick={() => setIsChangePasswordModalOpen(true)} className="w-full text-left p-3 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center justify-between cursor-pointer">
                <span className="flex items-center gap-2"><Lock size={14} /> Change Password</span>
                <ChevronRight size={14} className="text-slate-400" />
              </button>
              <button onClick={() => { logout(); notifyAuthSuccess("logout"); }} className="w-full text-left p-3 rounded-xl hover:bg-red-50 text-red-600 flex items-center justify-between cursor-pointer">
                <span className="flex items-center gap-2"><LogOut size={14} /> Sign Out</span>
                <ChevronRight size={14} className="text-red-400" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* EDIT PROFILE MODAL */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setIsEditModalOpen(false)}>
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-800 font-poppins flex items-center gap-2">
                <Edit3 size={18} className="text-blue-600" />
                Edit Profile Information
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              
              {/* Profile Image Upload & Preview */}
              <div>
                <label className="font-bold text-slate-600 mb-1 block">Profile Picture</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border flex items-center justify-center text-xl font-bold shrink-0">
                    {editForm.profile_image ? (
                      <img src={editForm.profile_image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span>{getInitials()}</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl font-bold text-xs cursor-pointer flex items-center gap-1.5 w-fit">
                      <Upload size={13} /> Upload Image
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    {editForm.profile_image && (
                      <button type="button" onClick={handleRemoveImage} className="text-[11px] text-rose-500 font-bold hover:underline flex items-center gap-1 w-fit">
                        <Trash2 size={12} /> Remove Picture
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-600 mb-1 block">First Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.first_name}
                    onChange={e => setEditForm({ ...editForm, first_name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 mb-1 block">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.last_name}
                    onChange={e => setEditForm({ ...editForm, last_name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-600 mb-1 block">Email Address *</label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-600 mb-1 block">Mobile Number *</label>
                  <input
                    type="text"
                    required
                    value={editForm.phone_number}
                    onChange={e => setEditForm({ ...editForm, phone_number: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 mb-1 block">Height (in cm) *</label>
                  <input
                    type="number"
                    required
                    value={editForm.height}
                    onChange={e => setEditForm({ ...editForm, height: e.target.value })}
                    placeholder="175"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
                  />
                </div>
              </div>

              {/* READ ONLY FIELDS DISCLAIMER */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Username (Read-Only):</span>
                  <span className="font-bold text-slate-700">{username}</span>
                </div>
                <div className="flex justify-between">
                  <span>Member Since (Read-Only):</span>
                  <span className="font-bold text-slate-700">{memberSince}</span>
                </div>
                <div className="flex justify-between">
                  <span>User Role (Read-Only):</span>
                  <span className="font-bold text-slate-700">{role}</span>
                </div>
                <div className="flex justify-between">
                  <span>Account Status (Read-Only):</span>
                  <span className="font-bold text-slate-700">{accountStatus}</span>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50"
                >
                  {savingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* CHANGE PASSWORD MODAL */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setIsChangePasswordModalOpen(false)}>
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-800 font-poppins flex items-center gap-2">
                <Lock size={18} className="text-blue-600" />
                Change Password
              </h3>
              <button onClick={() => setIsChangePasswordModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-500 mb-1 block">Current Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.old_password}
                  onChange={e => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 mb-1 block">New Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.new_password}
                  onChange={e => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 mb-1 block">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirm_password}
                  onChange={e => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50"
                >
                  {changingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* TICKET QR MODAL */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {activeQrModalTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setActiveQrModalTicket(null)}>
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" />
          <div className="relative w-full max-w-[340px] rounded-3xl bg-white p-6 shadow-2xl text-center border border-slate-100" onClick={e => e.stopPropagation()}>
            <button onClick={() => setActiveQrModalTicket(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={18} /></button>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-600 uppercase tracking-widest">
              {activeQrModalTicket.ticket_type || "Day Pass"}
            </span>
            <h4 className="text-lg font-black text-slate-800 mt-2 font-poppins">{activeQrModalTicket.holder_name || fullName}</h4>
            <p className="text-xs text-slate-400 mt-1 mb-5">ID: {activeQrModalTicket.ticket_id || `TV-${activeQrModalTicket.id}`} · Valid: {activeQrModalTicket.valid_date || "Today"}</p>

            <div className="w-48 h-48 mx-auto p-3 rounded-3xl border border-slate-100 shadow-inner flex items-center justify-center bg-white mb-6">
              <img
                src={activeQrModalTicket.qr_code_base64 || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(activeQrModalTicket.ticket_id || "TV-PASS")}`}
                className="w-full h-full object-contain rounded-2xl"
                alt="Scannable Ticket QR Code"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = `https://quickchart.io/qr?text=${encodeURIComponent(activeQrModalTicket.ticket_id || "TV-PASS")}&size=250`;
                }}
              />
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => toast.success("Ticket QR saved to downloads!")} 
                className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md hover:bg-blue-700"
              >
                <Download size={14} /> Download
              </button>
              <button 
                onClick={() => setActiveQrModalTicket(null)}
                className="py-2.5 px-4 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* BOOKING DETAILS MODAL */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {activeBookingDetailsTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setActiveBookingDetailsTicket(null)}>
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl text-left border border-slate-100" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-800 font-poppins flex items-center gap-2">
                <Ticket size={18} className="text-blue-600" />
                Booking Details
              </h3>
              <button onClick={() => setActiveBookingDetailsTicket(null)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-bold">Ticket ID</span>
                <span className="font-black text-slate-800">{activeBookingDetailsTicket.ticket_id || `TV-${activeBookingDetailsTicket.id}`}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-bold">Pass Type</span>
                <span className="font-black text-slate-800">{activeBookingDetailsTicket.ticket_type || "Day Pass"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-bold">Primary Visitor</span>
                <span className="font-black text-slate-800">{activeBookingDetailsTicket.holder_name || fullName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-bold">Visit Date</span>
                <span className="font-black text-slate-800">{activeBookingDetailsTicket.valid_date || "Today"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-bold">Access Zones</span>
                <span className="font-black text-slate-800">{activeBookingDetailsTicket.zones || "All Park Zones"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-bold">Rides Included</span>
                <span className="font-black text-slate-800">{activeBookingDetailsTicket.rides || "Unlimited Access"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-bold">Payment Method</span>
                <span className="font-black text-emerald-600">Online UPI / Card (Paid 💳)</span>
              </div>
              <div className="flex justify-between py-1 pt-2 border-t border-slate-100 text-sm">
                <span className="font-bold text-slate-700">Total Price Paid</span>
                <span className="font-black text-blue-600">₹{activeBookingDetailsTicket.price || 999}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveBookingDetailsTicket(null)}
              className="mt-6 w-full py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
