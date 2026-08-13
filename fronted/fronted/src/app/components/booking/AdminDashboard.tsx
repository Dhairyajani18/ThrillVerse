import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  TrendingUp, Users, BarChart2, DollarSign, Calendar, Clock,
  CheckCircle, AlertCircle, RefreshCw, ChevronLeft, Download,
  Printer, ArrowLeft, QrCode, Shield, SlidersHorizontal, Edit,
  Menu, X, Sparkles, AlertTriangle, Play, Pause, Plus, Trash2,
  Percent, Send, Settings, Mail, LogOut, Search, ChevronRight, Eye,
  Info, FileText, Check, Layers, Image, HelpCircle, User, Compass, Coffee
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend
} from 'recharts';
import { toast } from 'sonner';
import { notifyAuthSuccess } from '../../utils/toast';

import nitroImg from "@/assets/nitro.jpg";
import screamImg from "@/assets/scream_machine.jpg";
import dropImg from "@/assets/dare_2_drop.jpg";
import spacexImg from "@/assets/spacex.jpg";
import dinoImg from "@/assets/dino_splashdown.jpg";
import splashAhoyImg from "@/assets/splash_ahoy.jpg";
import chaiSpinImg from "@/assets/chai_spin_chaos.jpg";
import cinema360Img from "@/assets/cinema_360.jpg";
import miniFallImg from "@/assets/mini_fall.jpg";
import alibabaImg from "@/assets/alibaba.jpg";
import bhangarhImg from "@/assets/bhangarh.jpg";
import wrathImg from "@/assets/wrath_of_the_gods.jpg";
import carouselImg from "@/assets/magic_carousel.jpg";
import chhotaBheemImg from "@/assets/chhota_bheem.jpg";
import goldRushImg from "@/assets/gold_rush_express.jpg";
import elephantRideImg from "@/assets/elephant_ride.png";

import spiceArenaImg from "@/assets/spice_Arena.png";
import burgerBayImg from "@/assets/burger_bay.png";
import splashCafeImg from "@/assets/splash_cafe.png";

import happyTuesdayImg from "@/imports/image-2.png";
import byeByeExamsImg from "@/imports/image-3.png";
import watAWednesdayImg from "@/imports/image-8.png";
import adventureSavingsImg from "@/imports/image-5.png";
import snowParkImg from "@/imports/image-7.png";
import monsoonImg from "@/imports/monsoon_magic.png";
import goldenHourPassImg from "@/imports/golden_hour_pass.jpg";

interface AdminDashboardProps {
  token: string;
  onClose: () => void;
}

export default function AdminDashboard({ token, onClose }: AdminDashboardProps) {
  const { userProfile, login, logout, isAuthenticated } = useAuth();

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rides' | 'restaurants' | 'tickets' | 'offers' | 'prediction' | 'analytics' | 'reports' | 'email'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('admin@thrillverse.com');
  const [loginPassword, setLoginPassword] = useState('admin@123');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Core Data States
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [rides, setRides] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [ticketTypes, setTicketTypes] = useState<any[]>([]);
  const [systemConfig, setSystemConfig] = useState<any>({ gst_percentage: '18' });

  // Operations modal / edit states
  const [editingRide, setEditingRide] = useState<any | null>(null);
  const [editingRestaurant, setEditingRestaurant] = useState<any | null>(null);
  const [editingTicket, setEditingTicket] = useState<any | null>(null);

  // Offers state
  const [offers, setOffers] = useState<any[]>([]);
  const [newOffer, setNewOffer] = useState({
    name: '', adult_price: 999, child_price: 699, senior_price: 799,
    banner_image: '', description: '', discount_percentage: 10, promo_code: '',
    start_date: new Date().toISOString().split('T')[0],
    expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    applicable_ticket: 'All', terms_conditions: 'Terms apply.'
  });

  // AI Prediction form states
  const [predictHour, setPredictHour] = useState<number>(12);
  const [predictWeather, setPredictWeather] = useState<string>('Sunny');
  const [predictDay, setPredictDay] = useState<number>(0); // Monday
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [predictLoading, setPredictLoading] = useState(false);

  // Email broadcasting states
  const [emailTemplate, setEmailTemplate] = useState('offer_announcement');
  const [emailSubject, setEmailSubject] = useState('Exclusive ThrillVerse Season Pass Offer!');
  const [emailMessage, setEmailMessage] = useState('We are excited to share a special promotion for our loyal thrill-seekers. Use code SPECIAL15 to get 15% off your next ticket booking!');
  const [emailSending, setEmailSending] = useState(false);

  // Search and Filter states
  const [globalSearch, setGlobalSearch] = useState('');
  const [rideFilter, setRideFilter] = useState('all');
  const [restaurantFilter, setRestaurantFilter] = useState('all');
  const [transactionFilter, setTransactionFilter] = useState('all');

  // Entrance gate QR simulator state
  const [scanToken, setScanToken] = useState('');
  const [scanResult, setScanResult] = useState<{ text: string; isError: boolean } | null>(null);
  const [scanLoading, setScanLoading] = useState(false);

  // Billing Preview calculator state
  const [calcTicketType, setCalcTicketType] = useState('Adult');
  const [calcQty, setCalcQty] = useState(2);
  const [calcPromo, setCalcPromo] = useState('');
  const [calcPromoDiscount, setCalcPromoDiscount] = useState(0);
  const [calcPromoError, setCalcPromoError] = useState('');

  // Fetch all admin databases
  const fetchAllData = () => {
    setLoading(true);
    const activeToken = token || localStorage.getItem('token') || '';
    const headers = { 'Authorization': `Bearer ${activeToken}` };

    Promise.all([
      fetch('http://127.0.0.1:8000/queue/admin/payment-analytics/', { headers }).then(res => res.json()),
      fetch('http://127.0.0.1:8000/queue/admin/transactions/', { headers }).then(res => res.json()),
      fetch('http://127.0.0.1:8000/queue/rides/', { headers }).then(res => res.json()),
      fetch('http://127.0.0.1:8000/queue/restaurants/', { headers }).then(res => res.json()),
      fetch('http://127.0.0.1:8000/queue/admin/ticket-types/', { headers }).then(res => res.json()),
      fetch('http://127.0.0.1:8000/queue/admin/system-config/', { headers }).then(res => res.json()),
      fetch('http://127.0.0.1:8000/queue/offers/', { headers }).then(res => res.json())
    ])
      .then(([analytics, txs, ridesList, restList, tTypes, sysConf, offersList]) => {
        const mappedRides = (Array.isArray(ridesList) ? ridesList : []).map((r: any) => ({
          ...r,
          img: r.id === 1 ? nitroImg :
            r.id === 2 ? screamImg :
              r.id === 3 ? spacexImg :
                r.id === 4 ? dropImg :
                  r.id === 5 ? dinoImg :
                    r.id === 6 ? splashAhoyImg :
                      r.id === 7 ? goldRushImg :
                        r.id === 8 ? alibabaImg :
                          r.id === 9 ? bhangarhImg :
                            r.id === 10 ? chaiSpinImg :
                              r.id === 11 ? wrathImg :
                                r.id === 12 ? carouselImg :
                                  r.id === 13 ? chhotaBheemImg :
                                    r.id === 14 ? elephantRideImg :
                                      r.id === 15 ? miniFallImg :
                                        r.id === 16 ? cinema360Img : (r.img || nitroImg)
        }));

        const mappedRestaurants = (Array.isArray(restList) ? restList : []).map((r: any) => ({
          ...r,
          img: r.id === 1 ? spiceArenaImg :
            r.id === 2 ? burgerBayImg :
              r.id === 3 ? "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop&auto=format" :
                r.id === 4 ? splashCafeImg : (r.img || spiceArenaImg)
        }));

        setDashboardData(analytics);
        setTransactions(Array.isArray(txs) ? txs : []);
        setRides(mappedRides);
        setRestaurants(mappedRestaurants);
        setTicketTypes(Array.isArray(tTypes) ? tTypes : []);
        setSystemConfig(sysConf);
        setOffers(Array.isArray(offersList) ? offersList : []);
      })
      .catch(err => {
        console.error('Error fetching admin data:', err);
        toast.error('Failed to load dashboard metrics.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isAuthenticated && userProfile?.role?.toLowerCase() === 'admin') {
      fetchAllData();

      // Real-time 3-second auto-refresh for active ride queue monitoring
      const intervalId = setInterval(() => {
        fetch('http://127.0.0.1:8000/queue/rides/')
          .then(res => res.json())
          .then(ridesList => {
            if (Array.isArray(ridesList)) {
              setRides(prevRides => {
                return ridesList.map((r: any) => {
                  const existing = prevRides.find((p: any) => p.id === r.id);
                  const img = existing?.img || (
                    r.id === 1 ? nitroImg :
                      r.id === 2 ? screamImg :
                        r.id === 3 ? spacexImg :
                          r.id === 4 ? dropImg :
                            r.id === 5 ? dinoImg :
                              r.id === 6 ? splashAhoyImg :
                                r.id === 7 ? goldRushImg :
                                  r.id === 8 ? alibabaImg :
                                    r.id === 9 ? bhangarhImg :
                                      r.id === 10 ? chaiSpinImg :
                                        r.id === 11 ? wrathImg :
                                          r.id === 12 ? carouselImg :
                                            r.id === 13 ? chhotaBheemImg :
                                              r.id === 14 ? elephantRideImg :
                                                r.id === 15 ? miniFallImg :
                                                  r.id === 16 ? cinema360Img : (r.img || nitroImg)
                  );
                  return { ...r, img };
                });
              });
            }
          })
          .catch(err => console.error("Auto-refresh error:", err));
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [token, isAuthenticated, userProfile]);

  // Handle Admin Login bypass
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await login(loginEmail, loginPassword);
      if (!res.success) {
        setLoginError(res.error || 'Failed to authenticate.');
      } else {
        notifyAuthSuccess("login", "Admin");
      }
    } catch (err) {
      setLoginError('Connection refused by authentication backend.');
    } finally {
      setLoginLoading(false);
    }
  };

  // QR Check-in Simulator
  const handleCheckInScan = () => {
    if (!scanToken.trim()) return;
    setScanLoading(true);
    setScanResult(null);
    const activeToken = token || localStorage.getItem('token') || '';

    fetch('http://127.0.0.1:8000/queue/booking/check-in/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${activeToken}`
      },
      body: JSON.stringify({ signed_token: scanToken.trim() })
    })
      .then(res => res.json())
      .then(resData => {
        setScanLoading(false);
        if (resData.error) {
          setScanResult({ text: `❌ Check-in Failed: ${resData.error}`, isError: true });
          toast.error('Ticket Check-in Failed!');
        } else {
          setScanResult({
            text: `✅ Check-in Success! Booking ${resData.booking_id} verified. Visitors: ${resData.visitor_count}`,
            isError: false
          });
          toast.success('Ticket Checked In successfully!');
          fetchAllData(); // Refresh analytics metrics
        }
      })
      .catch(err => {
        setScanLoading(false);
        setScanResult({ text: '❌ Network / Signature verification failed', isError: true });
        toast.error('Scan Error!');
      });
  };

  // Save changes to Ride Details
  const handleSaveRide = () => {
    if (!editingRide) return;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    fetch(`http://127.0.0.1:8000/queue/admin/rides/${editingRide.id}/update/`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(editingRide)
    })
      .then(res => res.json())
      .then(data => {
        toast.success(`Ride "${editingRide.name}" operations updated.`);
        setEditingRide(null);
        fetchAllData();
        window.dispatchEvent(new Event("park_data_updated"));
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to update ride operational status.');
      });
  };

  // Save changes to Restaurant Details
  const handleSaveRestaurant = () => {
    if (!editingRestaurant) return;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    fetch(`http://127.0.0.1:8000/queue/admin/restaurants/${editingRestaurant.id}/update/`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(editingRestaurant)
    })
      .then(res => res.json())
      .then(data => {
        toast.success(`Restaurant "${editingRestaurant.name}" updated.`);
        setEditingRestaurant(null);
        fetchAllData();
        window.dispatchEvent(new Event("park_data_updated"));
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to update restaurant.');
      });
  };

  // Save changes to Ticket pricing
  const handleSaveTicket = () => {
    if (!editingTicket) return;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    fetch(`http://127.0.0.1:8000/queue/admin/ticket-types/${editingTicket.id}/update/`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(editingTicket)
    })
      .then(res => res.json())
      .then(data => {
        toast.success(`Ticket type "${editingTicket.name}" price updated.`);
        setEditingTicket(null);
        fetchAllData();
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to update ticket price.');
      });
  };

  // Update GST Config
  const handleUpdateGST = (newGst: string) => {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    fetch('http://127.0.0.1:8000/queue/admin/system-config/', {
      method: 'PUT',
      headers,
      body: JSON.stringify({ gst_percentage: newGst })
    })
      .then(res => res.json())
      .then(data => {
        setSystemConfig(data);
        toast.success('GST Rate updated successfully!');
      })
      .catch(err => toast.error('Failed to update config.'));
  };

  // Publish Offer Campaign
  const handlePublishOffer = () => {
    if (!newOffer.name || !newOffer.promo_code) {
      toast.error('Please enter offer title and promo code.');
      return;
    }
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    fetch('http://127.0.0.1:8000/queue/admin/offers/create/', {
      method: 'POST',
      headers,
      body: JSON.stringify(newOffer)
    })
      .then(async res => {
        const data = await res.json();
        if (res.ok && data.id) {
          toast.success(`Campaign offer "${data.name}" published to customer landing page!`);
          setNewOffer({
            name: '', adult_price: 999, child_price: 699, senior_price: 799,
            banner_image: '', description: '', discount_percentage: 10, promo_code: '',
            start_date: new Date().toISOString().split('T')[0],
            expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            applicable_ticket: 'All', terms_conditions: 'Terms apply.'
          });
          fetchAllData();
        } else {
          const errMsg = data.name ? `Offer Title: ${data.name[0]}` : (data.promo_code ? `Promo Code: ${data.promo_code[0]}` : (data.detail || data.error || 'Failed to create offer.'));
          toast.error(`Error: ${errMsg}`);
        }
      })
      .catch(err => {
        console.error("Publish offer error:", err);
        toast.error('Failed to create offer.');
      });
  };

  // Disable/Remove Offer
  const handleDisableOffer = (id: number) => {
    const activeToken = token || localStorage.getItem('token') || '';
    const headers = { 'Authorization': `Bearer ${activeToken}` };
    fetch(`http://127.0.0.1:8000/queue/admin/offers/${id}/`, {
      method: 'DELETE',
      headers
    })
      .then(() => {
        toast.success('Offer deleted successfully.');
        fetchAllData();
      })
      .catch(() => toast.error('Failed to delete offer.'));
  };

  // Run AI Crowd Prediction Model
  const handleRunPrediction = () => {
    setPredictLoading(true);
    setPredictionResult(null);
    const activeToken = token || localStorage.getItem('token') || '';
    const headers = { 'Authorization': `Bearer ${activeToken}`, 'Content-Type': 'application/json' };

    fetch('http://127.0.0.1:8000/api/predict-crowd', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        hour: predictHour,
        day_of_week: predictDay,
        weather: predictWeather
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          // Generate detailed zone stats & wait time simulations based on predicted count
          const crowd = data.predicted_crowd_count;
          const zoneDensities = [
            { id: 'entrance', name: 'Main Entrance & Plaza', color: 'rgba(59, 130, 246, 0.1)', density: Math.round(crowd * 0.1), status: 'Low' },
            { id: 'thriller', name: 'Thriller Zone', color: 'rgba(239, 68, 68, 0.1)', density: Math.round(crowd * 0.35), status: crowd * 0.35 > 600 ? 'High Congestion' : 'Moderate' },
            { id: 'water', name: 'Water Zone', color: 'rgba(6, 182, 212, 0.1)', density: Math.round(crowd * 0.25), status: crowd * 0.25 > 450 ? 'High' : 'Moderate' },
            { id: 'family', name: 'Family Zone', color: 'rgba(16, 185, 129, 0.1)', density: Math.round(crowd * 0.18), status: 'Moderate' },
            { id: 'kids', name: 'Kids Zone', color: 'rgba(245, 158, 11, 0.1)', density: Math.round(crowd * 0.12), status: 'Low' }
          ];

          setPredictionResult({
            predicted_crowd_count: crowd,
            zoneDensities,
            peak_hour: crowd > 1200 ? '12:00 PM - 3:00 PM' : '4:00 PM - 6:00 PM',
            recommendations: [
              crowd > 1400 ? '⚠️ High Crowd Alert: Open additional ticket counter gates at Zone A.' : null,
              crowd > 1000 ? '🍔 Increase restaurant staff schedules at Spice Arena and Burger Bay.' : null,
              '🔧 Schedule non-emergency ride maintenance sessions after 7:00 PM today.',
              crowd > 1300 ? '📍 Direct incoming family groups to Family Zone (currently low wait times).' : '✨ Normal Operations: All queues moving at AI optimal speed.'
            ].filter(Boolean)
          });
          toast.success('AI Prediction Run completed!');
        } else {
          toast.error(data.message || 'ML Prediction script returned an error.');
        }
      })
      .catch(err => toast.error('ML Server connection failed.'))
      .finally(() => setPredictLoading(false));
  };

  // Broadcast Broadcast Mail
  const handleSendBroadcast = () => {
    if (!emailSubject || !emailMessage) {
      toast.error('Subject and message cannot be empty.');
      return;
    }
    setEmailSending(true);
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    fetch('http://127.0.0.1:8000/queue/admin/broadcast-email/', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        template_name: emailTemplate,
        subject: emailSubject,
        custom_message: emailMessage
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.message || 'Templated broadcast email dispatched successfully!');
        }
      })
      .catch(err => toast.error('Broadcasting failed.'))
      .finally(() => setEmailSending(false));
  };

  // Test Billing Preview
  const handleTestBilling = () => {
    setCalcPromoError('');
    setCalcPromoDiscount(0);
    if (!calcPromo) return;

    fetch('http://127.0.0.1:8000/queue/promo/validate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        code: calcPromo.trim(),
        offer_id: offers[0]?.id || 1,
        booking_amount: 1500
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          setCalcPromoDiscount(parseFloat(data.discount));
          toast.success('Promo Code applied inside billing calculator!');
        } else {
          setCalcPromoError(data.error || 'Invalid promo code');
        }
      });
  };

  // CSV Exporter
  const exportTransactionsToCSV = () => {
    if (transactions.length === 0) return;
    const headers = ['Booking ID', 'Invoice ID', 'Username', 'Visitors', 'Offer', 'Visit Date', 'Subtotal', 'Promo Code', 'Discount', 'Total Paid', 'Status', 'Payment ID', 'Order ID', 'Transaction Date'];
    const rows = transactions.map(t => [
      t.booking_id,
      t.invoice_id,
      t.user_name,
      t.visitor_count,
      t.offer_name,
      t.visit_date,
      t.amount,
      t.promo_code,
      t.discount,
      t.total_paid,
      t.payment_status,
      t.razorpay_payment_id,
      t.razorpay_order_id,
      t.transaction_date
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ThrillVerse_Revenue_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter lists based on search
  const filteredRides = rides.filter(r => {
    const cat = (r.category || '').toLowerCase();
    const filter = rideFilter.toLowerCase();
    const matchesCategory = filter === 'all' ||
      cat === filter ||
      cat.includes(filter) ||
      (filter === 'thriller' && (cat.includes('thrill') || cat.includes('thriller')));
    const matchesSearch = !globalSearch || r.name.toLowerCase().includes(globalSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredRestaurants = restaurants.filter(r =>
    (restaurantFilter === 'all' || ((r.status || 'open').toLowerCase() === restaurantFilter.toLowerCase())) &&
    ((r.name || '').toLowerCase().includes(globalSearch.toLowerCase()))
  );

  const filteredTransactions = transactions.filter(t =>
    (transactionFilter === 'all' || t.payment_status.toLowerCase() === transactionFilter.toLowerCase()) &&
    (t.booking_id.toLowerCase().includes(globalSearch.toLowerCase()) ||
      t.user_name.toLowerCase().includes(globalSearch.toLowerCase()) ||
      t.offer_name.toLowerCase().includes(globalSearch.toLowerCase()))
  );

  // If not authenticated or not an admin user, render a beautiful ThrillVerse light-themed login panel
  if (!isAuthenticated || userProfile?.role?.toLowerCase() !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 relative overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Soft background glow circles */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-blue-100/50 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-cyan-100/40 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-[440px] bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl shadow-blue-500/5 relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1a6ef5] to-[#0052cc] items-center justify-center text-white text-2xl font-extrabold shadow-lg shadow-blue-500/25 mb-4" style={{ fontFamily: "'Exo 2', sans-serif" }}>TV</div>
            <h1 className="text-2xl font-black text-[#0d1f3c] tracking-tight leading-none" style={{ fontFamily: "'Exo 2', sans-serif" }}>ThrillVerse Console</h1>
            <p className="text-sm text-[#5a78a8] mt-2 font-medium">Log in to enter the theme park admin command panel</p>
          </div>

          {loginError && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 leading-normal font-medium">{loginError}</p>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Email / Username</label>
              <input
                type="text"
                required
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6ef5]/20 focus:border-[#1a6ef5] bg-slate-50/50 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6ef5]/20 focus:border-[#1a6ef5] bg-slate-50/50 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/30 hover:scale-[1.01] mt-6 cursor-pointer flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #1a6ef5, #0052cc)" }}
            >
              {loginLoading ? <RefreshCw className="animate-spin w-4 h-4" /> : <Shield size={16} />}
              Authenticate Admin
            </button>
          </form>

          <div className="mt-8 pt-5 border-t border-slate-100 text-center">
            <button onClick={onClose} className="text-xs font-bold text-[#1a6ef5] hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer">
              <ArrowLeft size={12} /> Back to User Site
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate pricing simulation dynamically
  const calcBasePrice = ticketTypes.find(t => t.name === calcTicketType)?.base_price || 999;
  const calcMultiplier = ticketTypes.find(t => t.name === calcTicketType)?.seasonal_multiplier || 1.00;
  const calcSubtotal = Math.round(calcBasePrice * calcMultiplier * calcQty);
  const calcNetSubtotal = Math.max(0, calcSubtotal - calcPromoDiscount);
  const calcGst = Math.round(calcNetSubtotal * (parseInt(systemConfig.gst_percentage) / 100));
  const calcTotal = calcNetSubtotal + calcGst + 50; // flat 50 convenience fee

  const totals = dashboardData?.totals || {};
  const charts = dashboardData?.charts || {};

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-800 flex overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Sidebar Navigation */}
      <aside className={`bg-white border-r border-slate-200/80 transition-all duration-300 flex flex-col shrink-0 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        {/* Brand header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black shrink-0 text-sm">TV</span>
            {sidebarOpen && (
              <span className="font-black tracking-tight text-slate-800 text-base leading-none whitespace-nowrap" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Thrill<span className="text-blue-600">Verse</span>
              </span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer hidden md:block"
          >
            <Menu size={16} />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <BarChart2 size={18} /> },
            { id: 'rides', label: 'Ride Operations', icon: <Compass size={18} /> },
            { id: 'restaurants', label: 'Restaurants', icon: <DollarSign size={18} /> },
            { id: 'tickets', label: 'Ticket Pricing', icon: <QrCode size={18} /> },
            { id: 'offers', label: 'Offers & Promos', icon: <Percent size={18} /> },
            { id: 'prediction', label: 'Crowd Prediction', icon: <Sparkles size={18} /> },
            { id: 'analytics', label: 'Deep Analytics', icon: <TrendingUp size={18} /> },
            { id: 'reports', label: 'Reports Hub', icon: <FileText size={18} /> },
            { id: 'email', label: 'Email Broadcasts', icon: <Mail size={18} /> }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${activeTab === item.id
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 pl-4'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
            >
              <span className={activeTab === item.id ? 'text-blue-600' : 'text-slate-400'}>{item.icon}</span>
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User profile / Logout bottom panel */}
        <div className="p-4 border-t border-slate-100 flex flex-col gap-2">
          {sidebarOpen && (
            <button
              onClick={onClose}
              className="flex items-center gap-2.5 px-2 py-1.5 bg-slate-50 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-xl transition-all text-left cursor-pointer group w-full"
              title="View My Profile"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                <User size={16} />
              </div>
              <div className="truncate flex-1">
                <p className="text-xs font-bold text-slate-800 leading-none truncate group-hover:text-blue-600">
                  {userProfile?.user?.username || userProfile?.username || "Administrator"}
                </p>
                <p className="text-[10px] text-slate-400 mt-1 truncate">
                  {userProfile?.user?.email || userProfile?.email || "admin@thrillverse.com"}
                </p>
              </div>
            </button>
          )}
          <button
            onClick={() => {
              logout();
              notifyAuthSuccess("logout");
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Sticky Header */}
        <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors border border-slate-200/60 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>
            <h2 className="text-lg font-black text-slate-800 tracking-tight font-poppins capitalize">
              {activeTab === 'email' ? 'Email Notifications' : activeTab === 'prediction' ? 'Crowd Prediction (AI)' : activeTab.replace('-', ' ')}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Global Search Bar */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search rides, transactions, restaurants..."
                value={globalSearch}
                onChange={e => setGlobalSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl border border-slate-200/80 text-xs w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 bg-slate-50/50"
              />
            </div>

            <button
              onClick={fetchAllData}
              className="p-2.5 rounded-xl border border-slate-200/60 hover:bg-slate-50 text-slate-500 hover:text-slate-700 cursor-pointer"
              title="Refresh Console Data"
            >
              <RefreshCw size={14} />
            </button>

            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl border border-slate-200/60 hover:bg-blue-50 text-blue-600 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              title="View My Profile"
            >
              <User size={14} />
              <span>Profile</span>
            </button>
          </div>
        </header>

        {/* Dashboard Panels Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Loading Skeletons */}
          {loading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white border border-slate-200/80 rounded-3xl p-5 space-y-3 h-28 animate-pulse">
                    <div className="w-1/2 h-4 bg-slate-100 rounded" />
                    <div className="w-3/4 h-8 bg-slate-100 rounded" />
                  </div>
                ))}
              </div>
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 h-96 animate-pulse" />
            </div>
          ) : (
            <>
              {/* TAB 1: DASHBOARD METRICS */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* KPI Row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Revenue', value: `₹${(totals?.total_revenue ?? 0).toLocaleString()}`, icon: <DollarSign size={20} className="text-blue-500" />, desc: 'All channels' },
                      { label: "Today's Revenue", value: `₹${(totals?.today_revenue ?? 0).toLocaleString()}`, icon: <TrendingUp size={20} className="text-emerald-500" />, desc: 'Real-time booking' },
                      { label: 'Visitors Inside Park', value: totals?.today_visitors ?? 0, icon: <Users size={20} className="text-cyan-500" />, desc: `Checked in today` },
                      { label: 'Active Rides', value: `${rides.filter(r => r.status === 'open').length} / ${rides.length}`, icon: <Compass size={20} className="text-purple-500" />, desc: `${rides.filter(r => r.status === 'maintenance').length} in maintenance` },
                      { label: 'Restaurants Open', value: `${restaurants.filter(r => r.status === 'open').length} / ${restaurants.length}`, icon: <Coffee size={20} className="text-amber-500" />, desc: 'Food courts open' },
                      { label: 'Average Queue Time', value: '18 min', icon: <Clock size={20} className="text-red-500" />, desc: 'AI-monitored wait' },
                      { label: 'Running Offers', value: offers.length, icon: <Percent size={20} className="text-orange-500" />, desc: 'Live promotions' },
                      { label: 'AI Crowd Risk Level', value: totals.today_visitors > 1500 ? 'High' : 'Moderate', icon: <Sparkles size={20} className="text-indigo-500" />, desc: 'Automated prediction' }
                    ].map((card, i) => (
                      <div key={i} className="bg-white border border-slate-200/70 rounded-3xl p-5 shadow-sm shadow-slate-100 flex items-start justify-between relative overflow-hidden">
                        <div className="space-y-3">
                          <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">{card.label}</span>
                          <span className="text-2xl font-black text-slate-800 tracking-tight block font-poppins">{card.value}</span>
                          <span className="text-[10px] text-slate-400 font-medium block">{card.desc}</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                          {card.icon}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Primary charts row */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Trend Area Chart */}
                    <div className="bg-white border border-slate-200/70 rounded-3xl p-6 shadow-sm lg:col-span-2">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Revenue Trend (Last 7 Days)</h3>
                      <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={charts.daily_revenue || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                            <Area type="monotone" dataKey="revenue" name="Revenue (₹)" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Zone crowd distribution Pie Chart */}
                    <div className="bg-white border border-slate-200/70 rounded-3xl p-6 shadow-sm">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Zone Crowd Distribution</h3>
                      <div className="h-56 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={charts.zone_distribution || []}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="visitors_count"
                              nameKey="zone_name"
                            >
                              {['#f97316', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'].map((color, index) => (
                                <Cell key={`cell-${index}`} fill={color} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                          <p className="text-2xl font-black text-slate-800 leading-none">{totals.today_visitors}</p>
                          <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">Visitors</p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2.5 justify-center">
                        {(charts.zone_distribution || []).map((z: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ background: ['#f97316', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'][idx] }} />
                            <span>{z.zone_name.split(' ')[0]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Activity and QR scanners */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Live Activity Feed */}
                    <div className="bg-white border border-slate-200/70 rounded-3xl p-6 shadow-sm lg:col-span-2 flex flex-col h-[400px]">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Live Activity Log</h3>
                      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                        {(charts.activity_feed || []).map((act: any) => (
                          <div key={act.id} className="flex gap-3 text-sm pb-3.5 border-b border-slate-100 last:border-none">
                            <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-base">
                              {act.type === 'ticket_purchased' ? '🎟️' : '🚪'}
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-slate-800">{act.message}</p>
                              <span className="text-[10px] text-slate-400 font-medium block mt-1">{act.timestamp}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Entrance check-in simulator */}
                    <div className="bg-white border border-slate-200/70 rounded-3xl p-6 shadow-sm flex flex-col">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                        <QrCode size={18} className="text-blue-600" />
                        Entrance Scanner (Simulator)
                      </h3>
                      <p className="text-xs text-slate-400 leading-normal mb-5">
                        Simulate checking in customers at the park entry gate by entering their cryptographically signed ticket token.
                      </p>

                      <div className="space-y-4 flex-1">
                        <textarea
                          rows={4}
                          value={scanToken}
                          onChange={e => setScanToken(e.target.value)}
                          placeholder="Paste cryptographically signed QR code token..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-mono focus:outline-none focus:border-blue-500 resize-none"
                        />

                        <button
                          onClick={handleCheckInScan}
                          disabled={scanLoading}
                          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          {scanLoading ? <RefreshCw className="animate-spin w-4 h-4" /> : <QrCode size={14} />}
                          Verify & Check-in Pass
                        </button>

                        {scanResult && (
                          <div className={`p-4 rounded-2xl border text-xs font-medium ${scanResult.isError
                            ? 'bg-rose-50 border-rose-100 text-rose-800'
                            : 'bg-emerald-50 border-emerald-100 text-emerald-800'
                            }`}>
                            {scanResult.text}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: RIDE OPERATIONS */}
              {activeTab === 'rides' && (
                <div className="space-y-6">
                  {/* Header filters */}
                  <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200/60 p-4 rounded-2xl">
                    <div className="flex gap-2">
                      {['All', 'Thriller', 'Water', 'Family', 'Kids'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setRideFilter(cat.toLowerCase())}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${(rideFilter === cat.toLowerCase())
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                            }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-slate-400 font-bold">{filteredRides.length} Rides Permanently Mapped</span>
                  </div>

                  {/* Rides Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredRides.map(ride => {
                      const ringStyle = ride.status === 'maintenance' ? 'border-amber-200' : 'border-slate-200/80';
                      return (
                        <div key={ride.id} className={`bg-white border ${ringStyle} rounded-3xl overflow-hidden shadow-sm flex flex-col relative`}>
                          <div className="h-44 overflow-hidden relative">
                            <img src={ride.img} alt={ride.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                            <span className="absolute top-4 left-4 text-2xl">{ride.emoji}</span>

                            {/* Badges */}
                            <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-white/90 text-slate-800">{ride.category}</span>

                            <div className="absolute bottom-4 left-4 right-4">
                              <h3 className="text-base font-black text-white font-poppins">{ride.name}</h3>
                              <p className="text-[11px] text-white/70 font-medium mt-0.5">Duration: {ride.duration} · Capacity: {ride.capacity}</p>
                            </div>
                          </div>

                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-slate-400">Queue Operational Status</span>
                                <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase ${ride.status === 'open' ? 'bg-emerald-50 text-emerald-600' :
                                  ride.status === 'maintenance' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                                  }`}>
                                  {ride.status === 'maintenance' ? '🚧 Maintenance' : ride.status}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                {ride.safety_instructions || 'Safety guidelines and operational protocols configured.'}
                              </p>

                              {/* ACTIVE BATCHES MONITORING SECTION */}
                              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-poppins">
                                    <Layers size={14} className="text-blue-600" />
                                    Active Batches
                                  </span>
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-100">
                                    Active Batches: {ride.total_active_batches ?? (ride.active_batches?.length || 0)}
                                  </span>
                                </div>

                                {/* Queue summary metrics */}
                                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-xl text-[11px] font-medium border border-slate-100">
                                  <div className="flex items-center gap-1 text-slate-600">
                                    <Users size={12} className="text-slate-400 shrink-0" />
                                    <span className="truncate">Queue: <strong>{ride.remaining_queue ?? Math.max(0, (ride.total_queue_count || 0) - (ride.current_batch_occupancy || 0))}</strong> waiting</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-slate-600 justify-end">
                                    <Clock size={12} className="text-slate-400 shrink-0" />
                                    <span className="truncate">Next: <strong>Batch #{ride.next_boarding_batch || (ride.current_batch_number + 1)}</strong> ({ride.next_batch_wait_minutes || 0}m)</span>
                                  </div>
                                </div>

                                {/* Active Batches Cards List */}
                                {(!ride.active_batches || ride.active_batches.length === 0) ? (
                                  <div className="p-3 bg-slate-50/80 border border-dashed border-slate-200 rounded-xl text-center">
                                    <span className="text-xs font-bold text-slate-500 flex items-center justify-center gap-1.5">
                                      <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                                      No Active Batches
                                    </span>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Ride is currently idle with no active batches</p>
                                  </div>
                                ) : (
                                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
                                    {ride.active_batches.map((batch: any, bIdx: number) => {
                                      // Status color styling: 🔵 Waiting | 🟡 Boarding | 🟢 Riding | 🔴 Maintenance | ⚪ Idle
                                      const statusConfig =
                                        batch.status === 'Riding' ? { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: '🟢' } :
                                          batch.status === 'Boarding' ? { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: '🟡' } :
                                            batch.status === 'Waiting' ? { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: '🔵' } :
                                              batch.status === 'Maintenance' ? { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: '🔴' } :
                                                { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', dot: '⚪' };

                                      const occupancyPct = Math.min(100, Math.round((batch.passengers / (batch.capacity || ride.capacity || 40)) * 100));

                                      return (
                                        <div key={bIdx} className={`p-2.5 rounded-xl border ${statusConfig.bg} ${statusConfig.border} transition-all space-y-1.5`}>
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                              <span className="text-xs">{statusConfig.dot}</span>
                                              <span className="text-xs font-black text-slate-800 font-poppins">Batch #{batch.batch_number}</span>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border bg-white/90 ${statusConfig.text} ${statusConfig.border}`}>
                                              {batch.status}
                                            </span>
                                          </div>

                                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                                            <div>
                                              <span className="text-slate-400 font-medium block text-[10px]">Passengers</span>
                                              <span className="font-bold text-slate-800">{batch.occupancy_display || `${batch.passengers}/${batch.capacity || ride.capacity}`}</span>
                                              <div className="w-full bg-slate-200/80 rounded-full h-1 mt-1 overflow-hidden">
                                                <div className={`h-full ${batch.status === 'Riding' ? 'bg-emerald-500' : batch.status === 'Boarding' ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${occupancyPct}%` }} />
                                              </div>
                                            </div>

                                            <div>
                                              <span className="text-slate-400 font-medium block text-[10px]">Pos Range</span>
                                              <span className="font-bold text-slate-800 font-mono text-[10px]">{batch.position_range || '—'}</span>
                                            </div>
                                          </div>

                                          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px] text-slate-500 font-medium">
                                            <span>Start: <strong>{batch.estimated_start_time}</strong></span>
                                            <span>End: <strong>{batch.estimated_end_time}</strong></span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-2 pt-3 border-t border-slate-100">
                              <button
                                onClick={() => setEditingRide(ride)}
                                className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer flex items-center justify-center gap-1"
                              >
                                <Edit size={12} /> Edit Details
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Ride Editing modal / side sheet */}
              {editingRide && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                  <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl relative">
                    <button onClick={() => setEditingRide(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer">
                      <X size={20} />
                    </button>

                    <h3 className="text-lg font-black text-slate-800 mb-6 font-poppins flex items-center gap-2">
                      <span>{editingRide.emoji}</span> Edit Ride Operations: {editingRide.name}
                    </h3>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</label>
                          <select
                            value={editingRide.status}
                            onChange={e => setEditingRide({ ...editingRide, status: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold"
                          >
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                            <option value="maintenance">Under Maintenance</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Queue Accept</label>
                          <select
                            value={String(editingRide.queue_enabled)}
                            onChange={e => setEditingRide({ ...editingRide, queue_enabled: e.target.value === 'true' })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold"
                          >
                            <option value="true">Enable Queue</option>
                            <option value="false">Pause Queue</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Opening Time</label>
                          <input
                            type="time"
                            value={editingRide.opening_time || '09:00'}
                            onChange={e => setEditingRide({ ...editingRide, opening_time: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Closing Time</label>
                          <input
                            type="time"
                            value={editingRide.closing_time || '21:00'}
                            onChange={e => setEditingRide({ ...editingRide, closing_time: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold"
                          />
                        </div>
                      </div>

                      {editingRide.status === 'maintenance' && (
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Expected Reopening Date</label>
                          <input
                            type="date"
                            value={editingRide.expected_reopening_date || ''}
                            onChange={e => setEditingRide({ ...editingRide, expected_reopening_date: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Maintenance Notes</label>
                        <textarea
                          rows={2}
                          value={editingRide.maintenance_notes || ''}
                          onChange={e => setEditingRide({ ...editingRide, maintenance_notes: e.target.value })}
                          placeholder="Maintenance logging/notes..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Safety Instructions</label>
                        <textarea
                          rows={2}
                          value={editingRide.safety_instructions || ''}
                          onChange={e => setEditingRide({ ...editingRide, safety_instructions: e.target.value })}
                          placeholder="Safety guidelines for boarding pass..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none"
                        />
                      </div>

                      <div className="flex gap-2 pt-4">
                        <button
                          onClick={handleSaveRide}
                          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                        >
                          Save Operational Changes
                        </button>
                        <button
                          onClick={() => setEditingRide(null)}
                          className="px-4 py-3 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: RESTAURANT MANAGEMENT */}
              {activeTab === 'restaurants' && (
                <div className="space-y-6">
                  {/* Restaurant filters */}
                  <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200/60 p-4 rounded-2xl">
                    <div className="flex gap-2">
                      {['All', 'Open', 'Closed', 'Maintenance'].map((s) => (
                        <button
                          key={s}
                          onClick={() => setRestaurantFilter(s.toLowerCase())}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${(restaurantFilter === s.toLowerCase())
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                            }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-slate-400 font-bold">{filteredRestaurants.length} Food Courts Active</span>
                  </div>

                  {/* Restaurants Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredRestaurants.map(rest => (
                      <div key={rest.id} className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row relative">
                        <div className="w-full md:w-44 h-48 md:h-full relative shrink-0">
                          <img src={rest.img} alt={rest.name} className="w-full h-full object-cover" />
                          <span className="absolute top-4 left-4 text-3xl">{rest.emoji}</span>
                          <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-[9px] font-black uppercase" style={{ background: rest.bg, color: rest.color }}>{rest.cuisine}</span>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-base font-black text-slate-800 font-poppins">{rest.name}</h3>
                                <p className="text-xs text-slate-400 mt-0.5">{rest.tagline || 'Theme Park Dining'}</p>
                              </div>
                              {rest.is_featured && (
                                <span className="bg-amber-100 text-amber-800 text-[9px] px-2 py-0.5 rounded-md font-bold">Featured ⭐</span>
                              )}
                            </div>

                            <p className="text-xs text-slate-400 font-medium leading-relaxed line-clamp-2">{rest.desc}</p>

                            {/* Mini counters */}
                            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-center">
                              <div>
                                <span className="text-[10px] text-slate-400 block font-medium">Orders Today</span>
                                <span className="text-sm font-bold text-slate-800 block">{rest.today_orders}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 block font-medium">Today's Rev</span>
                                <span className="text-sm font-bold text-slate-800 block">₹{rest.today_revenue}</span>
                              </div>
                              <div className="truncate">
                                <span className="text-[10px] text-slate-400 block font-medium">Popular Pick</span>
                                <span className="text-xs font-bold text-blue-600 block truncate">{rest.most_ordered_food || '—'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingRestaurant(rest)}
                              className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
                            >
                              Manage Restaurant & Menu
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Restaurant Menu Editor Sheet */}
              {editingRestaurant && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                  <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
                    <button onClick={() => setEditingRestaurant(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer">
                      <X size={20} />
                    </button>

                    <h3 className="text-lg font-black text-slate-800 mb-5 font-poppins flex items-center gap-2">
                      <span>{editingRestaurant.emoji}</span> Edit Restaurant: {editingRestaurant.name}
                    </h3>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</label>
                          <select
                            value={editingRestaurant.status}
                            onChange={e => setEditingRestaurant({ ...editingRestaurant, status: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold"
                          >
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                            <option value="maintenance">Under Maintenance</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Featured</label>
                          <select
                            value={String(editingRestaurant.is_featured)}
                            onChange={e => setEditingRestaurant({ ...editingRestaurant, is_featured: e.target.value === 'true' })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold"
                          >
                            <option value="true">Yes, Feature</option>
                            <option value="false">No</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Opening Time</label>
                          <input
                            type="text"
                            value={editingRestaurant.opening_time || '10:00:00'}
                            onChange={e => setEditingRestaurant({ ...editingRestaurant, opening_time: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Closing Time</label>
                          <input
                            type="text"
                            value={editingRestaurant.closing_time || '22:00:00'}
                            onChange={e => setEditingRestaurant({ ...editingRestaurant, closing_time: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Cuisine / Category</label>
                        <input
                          type="text"
                          value={editingRestaurant.cuisine || ''}
                          onChange={e => setEditingRestaurant({ ...editingRestaurant, cuisine: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={editingRestaurant.desc || ''}
                          onChange={e => setEditingRestaurant({ ...editingRestaurant, desc: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none"
                        />
                      </div>

                      <div className="flex gap-2 pt-4">
                        <button
                          onClick={handleSaveRestaurant}
                          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                        >
                          Save Restaurant changes
                        </button>
                        <button
                          onClick={() => setEditingRestaurant(null)}
                          className="px-4 py-3 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: TICKET MANAGEMENT */}
              {activeTab === 'tickets' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Tickets Config */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* GST configuration card */}
                    <div className="bg-white border border-slate-200/70 rounded-3xl p-6 shadow-sm">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">GST Tax Configuration</h3>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">GST Tax Percentage (%)</label>
                          <input
                            type="number"
                            value={systemConfig.gst_percentage || '18'}
                            onChange={e => handleUpdateGST(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold w-32 text-right"
                          />
                        </div>
                        <div className="p-3 bg-blue-50/50 rounded-2xl text-[11px] text-blue-800 leading-normal flex-1">
                          💡 System calculations for user ticket purchases automatically append this tax percentage to checkout balances.
                        </div>
                      </div>
                    </div>

                    {/* Pricing grid table */}
                    <div className="bg-white border border-slate-200/70 rounded-3xl p-6 shadow-sm">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Ticket Type Pricing</h3>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 text-xs font-bold text-slate-400">
                              <th className="pb-3">Ticket Category</th>
                              <th className="pb-3 text-right">Base Price (INR)</th>
                              <th className="pb-3 text-right">Seasonal Multiplier</th>
                              <th className="pb-3 text-center">Status</th>
                              <th className="pb-3 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ticketTypes.map(tt => (
                              <tr key={tt.id} className="border-b border-slate-50 last:border-none text-xs font-semibold text-slate-700">
                                <td className="py-3.5 font-bold text-slate-800">{tt.name}</td>
                                <td className="py-3.5 text-right font-mono font-bold">₹{tt.base_price}/-</td>
                                <td className="py-3.5 text-right font-mono">{tt.seasonal_multiplier}x</td>
                                <td className="py-3.5 text-center">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${tt.is_enabled ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                    }`}>
                                    {tt.is_enabled ? 'Enabled' : 'Disabled'}
                                  </span>
                                </td>
                                <td className="py-3.5 text-center">
                                  <button
                                    onClick={() => setEditingTicket(tt)}
                                    className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded cursor-pointer"
                                  >
                                    <Edit size={14} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Dynamic Invoice Preview Calculator */}
                  <div className="bg-white border border-slate-200/70 rounded-3xl p-6 shadow-sm flex flex-col h-[520px]">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Billing Calculator</h3>

                    <div className="space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ticket Type</label>
                          <select
                            value={calcTicketType}
                            onChange={e => setCalcTicketType(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                          >
                            {ticketTypes.map(tt => (
                              <option key={tt.id} value={tt.name}>{tt.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Quantity</label>
                          <input
                            type="number"
                            value={calcQty}
                            onChange={e => setCalcQty(Math.max(1, parseInt(e.target.value)))}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-right"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Promo Code</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={calcPromo}
                              onChange={e => setCalcPromo(e.target.value)}
                              placeholder="WELCOME10..."
                              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs uppercase"
                            />
                            <button
                              onClick={handleTestBilling}
                              className="px-3 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-700"
                            >
                              Apply
                            </button>
                          </div>
                          {calcPromoError && (
                            <span className="text-[10px] text-rose-500 font-bold block mt-1">{calcPromoError}</span>
                          )}
                        </div>
                      </div>

                      {/* Invoice sheet preview */}
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-black block border-b border-slate-200/60 pb-1">Tax Invoice Preview</span>

                        <div className="space-y-1.5 text-xs text-slate-500">
                          <div className="flex justify-between">
                            <span>Ticket Subtotal:</span>
                            <span className="font-mono text-slate-800 font-bold">₹{calcSubtotal}/-</span>
                          </div>
                          {calcPromoDiscount > 0 && (
                            <div className="flex justify-between text-emerald-600 font-bold">
                              <span>Promo Discount:</span>
                              <span className="font-mono">-₹{calcPromoDiscount}/-</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>GST ({systemConfig.gst_percentage}%):</span>
                            <span className="font-mono text-slate-800">₹{calcGst}/-</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Convenience Fee:</span>
                            <span className="font-mono text-slate-800">₹50/-</span>
                          </div>
                          <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-800 text-sm">
                            <span>Grand Total:</span>
                            <span className="font-mono text-blue-600">₹{calcTotal}/-</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Ticket Price Edit Modal */}
              {editingTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                  <div className="bg-white rounded-3xl border border-slate-200 max-w-sm w-full p-6 shadow-2xl relative">
                    <button onClick={() => setEditingTicket(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer">
                      <X size={20} />
                    </button>

                    <h3 className="text-lg font-black text-slate-800 mb-5 font-poppins">
                      Edit Ticket: {editingTicket.name}
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Base Price (INR)</label>
                        <input
                          type="number"
                          value={editingTicket.base_price}
                          onChange={e => setEditingTicket({ ...editingTicket, base_price: parseInt(e.target.value) })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-right"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Seasonal Multiplier</label>
                        <input
                          type="number"
                          step="0.05"
                          value={editingTicket.seasonal_multiplier}
                          onChange={e => setEditingTicket({ ...editingTicket, seasonal_multiplier: parseFloat(e.target.value) })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-right"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</label>
                        <select
                          value={String(editingTicket.is_enabled)}
                          onChange={e => setEditingTicket({ ...editingTicket, is_enabled: e.target.value === 'true' })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold"
                        >
                          <option value="true">Enabled</option>
                          <option value="false">Disabled</option>
                        </select>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <button
                          onClick={handleSaveTicket}
                          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                        >
                          Save Pricing Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: OFFERS & PROMOTIONS */}
              {activeTab === 'offers' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left panel: campaign publisher */}
                  <div className="bg-white border border-slate-200/70 rounded-3xl p-6 shadow-sm space-y-4">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Publish New Promo Campaign</h3>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Offer Title</label>
                        <input
                          type="text"
                          value={newOffer.name}
                          onChange={e => setNewOffer({ ...newOffer, name: e.target.value })}
                          placeholder="e.g. Monsoon Magic Promo"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Campaign Description</label>
                        <textarea
                          rows={2}
                          value={newOffer.description}
                          onChange={e => setNewOffer({ ...newOffer, description: e.target.value })}
                          placeholder="Detailed promo offer details..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Promo Code</label>
                          <input
                            type="text"
                            value={newOffer.promo_code}
                            onChange={e => setNewOffer({ ...newOffer, promo_code: e.target.value.toUpperCase() })}
                            placeholder="RAINY20"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Discount %</label>
                          <input
                            type="number"
                            value={newOffer.discount_percentage}
                            onChange={e => setNewOffer({ ...newOffer, discount_percentage: parseInt(e.target.value) })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-right"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Banner Image URL</label>
                        <input
                          type="text"
                          value={newOffer.banner_image}
                          onChange={e => setNewOffer({ ...newOffer, banner_image: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Start Date</label>
                          <input
                            type="date"
                            value={newOffer.start_date}
                            onChange={e => setNewOffer({ ...newOffer, start_date: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Expiry Date</label>
                          <input
                            type="date"
                            value={newOffer.expiry_date}
                            onChange={e => setNewOffer({ ...newOffer, expiry_date: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                          />
                        </div>
                      </div>

                      <button
                        onClick={handlePublishOffer}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer mt-4"
                      >
                        Publish Offer Campaign
                      </button>
                    </div>
                  </div>

                  {/* Right panel: offers listing */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest pl-2">Active Web Promotions</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {offers.map(off => {
                        const nameLower = (off.name || '').toLowerCase();
                        const codeLower = (off.promo_code || '').toLowerCase();
                        let cardImg = null;
                        if (nameLower.includes('monsoon') || codeLower.includes('monsoon')) cardImg = monsoonImg;
                        else if (nameLower.includes('tuesday') || codeLower.includes('tues')) cardImg = happyTuesdayImg;
                        else if (nameLower.includes('wednesday') || codeLower.includes('watwed')) cardImg = watAWednesdayImg;
                        else if (nameLower.includes('exam') || codeLower.includes('student')) cardImg = byeByeExamsImg;
                        else if (nameLower.includes('adventure') || codeLower.includes('buy4')) cardImg = adventureSavingsImg;
                        else if (nameLower.includes('snow') || codeLower.includes('snow')) cardImg = snowParkImg;
                        else if (nameLower.includes('golden') || codeLower.includes('golden')) cardImg = goldenHourPassImg;
                        else if (nameLower.includes('family') || nameLower.includes('friends') || codeLower.includes('thrill')) cardImg = adventureSavingsImg;
                        else cardImg = off.banner_image || off.image || monsoonImg;

                        return (
                          <div key={off.id} className="bg-white border border-slate-200/70 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between">
                            <div className="h-28 overflow-hidden relative bg-slate-100">
                              <img src={cardImg} alt={off.name} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
                              <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                                Promo: {off.promo_code || 'N/A'}
                              </span>
                              <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                                -{off.discount_percentage || 10}% Off
                              </span>
                              <div className="absolute bottom-3 left-3 right-3">
                                <h4 className="text-sm font-black text-white truncate leading-none font-poppins">{off.name}</h4>
                              </div>
                            </div>

                            <div className="p-4 space-y-3">
                              <p className="text-xs text-slate-400 font-medium leading-relaxed line-clamp-2">
                                {off.description || 'Active park seasonal discount offer available on booking checkout pages.'}
                              </p>

                              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 pt-2.5 border-t border-slate-50">
                                <span>Expires: {off.expiry_date || 'N/A'}</span>
                                <button
                                  onClick={() => handleDisableOffer(off.id)}
                                  className="text-red-500 hover:text-red-700 cursor-pointer"
                                >
                                  Delete Campaign
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: CROWD PREDICTION (AI) */}
              {activeTab === 'prediction' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Parameter controls */}
                  <div className="bg-white border border-slate-200/70 rounded-3xl p-6 shadow-sm space-y-5 h-[480px]">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                      <Sparkles className="text-blue-600" size={18} />
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Premium AI Predictor</h3>
                    </div>

                    <div className="space-y-4 text-xs font-semibold text-slate-600">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Simulate Hour of Day</label>
                        <select
                          value={predictHour}
                          onChange={e => setPredictHour(parseInt(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold"
                        >
                          {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map(h => (
                            <option key={h} value={h}>{h === 12 ? '12:00 PM (Noon)' : h > 12 ? `${h - 12}:00 PM` : `${h}:00 AM`}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Simulate Weather</label>
                        <select
                          value={predictWeather}
                          onChange={e => setPredictWeather(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold"
                        >
                          <option value="Sunny">Sunny</option>
                          <option value="Cloudy">Cloudy</option>
                          <option value="Rainy">Rainy</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Simulate Day of Week</label>
                        <select
                          value={predictDay}
                          onChange={e => setPredictDay(parseInt(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold"
                        >
                          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, idx) => (
                            <option key={idx} value={idx}>{day}</option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={handleRunPrediction}
                        disabled={predictLoading}
                        className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md mt-6 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        {predictLoading ? <RefreshCw className="animate-spin w-4 h-4" /> : <Play size={12} />}
                        Run AI Prediction
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Heatmap, wait times, recommendations */}
                  <div className="lg:col-span-2 space-y-6">
                    {predictionResult ? (
                      <div className="space-y-6">
                        {/* Summary panel */}
                        <div className="bg-white border border-slate-200/70 rounded-3xl p-5 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Expected Visitors</span>
                            <span className="text-2xl font-black text-slate-800 font-poppins block mt-1.5">{predictionResult.predicted_crowd_count}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Peak Hours</span>
                            <span className="text-sm font-black text-slate-800 block mt-2.5">{predictionResult.peak_hour}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Crowd Density</span>
                            <span className={`text-sm font-black block mt-2.5 ${predictionResult.predicted_crowd_count > 1500 ? 'text-red-500' : 'text-emerald-500'
                              }`}>
                              {predictionResult.predicted_crowd_count > 1500 ? 'High Risk' : 'Normal'}
                            </span>
                          </div>
                          <div className="flex gap-2 justify-end items-center">
                            <button className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer">
                              Export
                            </button>
                          </div>
                        </div>

                        {/* Zone Heatmap Density Map */}
                        <div className="bg-white border border-slate-200/70 rounded-3xl p-6 shadow-sm">
                          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Park Zone Density Heatmap</h3>
                          <div className="space-y-3">
                            {predictionResult.zoneDensities.map((z: any, idx: number) => {
                              const densityPercent = Math.min(100, (z.density / 800) * 100);
                              return (
                                <div key={z.id} className="space-y-1.5 text-xs font-semibold">
                                  <div className="flex justify-between items-center text-slate-700">
                                    <span>{z.name}</span>
                                    <span className="text-[10px] font-bold uppercase text-slate-400">{z.density} guests · {z.status}</span>
                                  </div>
                                  <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className="h-2 rounded-full" style={{
                                      width: `${densityPercent}%`,
                                      background: z.id === 'thriller' ? '#ef4444' : z.id === 'water' ? '#06b6d4' : '#10b981'
                                    }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Recommendation Cards */}
                        <div className="bg-white border border-slate-200/70 rounded-3xl p-6 shadow-sm space-y-4">
                          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">AI Dispatcher Recommendations</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {predictionResult.recommendations.map((rec: string, idx: number) => (
                              <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium text-slate-600 leading-normal flex items-start gap-2">
                                <span>💡</span>
                                <span>{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white border border-slate-200/70 rounded-3xl p-16 shadow-sm text-center flex flex-col items-center justify-center space-y-4">
                        <Sparkles className="text-blue-500 animate-pulse" size={48} />
                        <h4 className="text-base font-black text-slate-800">Ready to run Crowd Model</h4>
                        <p className="text-xs text-slate-400 leading-normal max-w-sm">
                          Set the weather conditions and hour to simulate on the left console, then hit prediction to invoke random forest models.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 7: DEEP ANALYTICS */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  {/* Detailed Recharts grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue Trend Area Chart */}
                    <div className="bg-white border border-slate-200/70 rounded-3xl p-6 shadow-sm">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Revenue Trend (₹)</h3>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={charts.daily_revenue || []}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                            <YAxis stroke="#94a3b8" fontSize={10} />
                            <Tooltip />
                            <Area type="monotone" dataKey="revenue" name="Daily Revenue" stroke="#3b82f6" strokeWidth={2} fill="rgba(59,130,246,0.06)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Ride Popularity Bar Chart */}
                    <div className="bg-white border border-slate-200/70 rounded-3xl p-6 shadow-sm">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Most Popular Rides</h3>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={charts.ride_popularity || []} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                            <XAxis type="number" stroke="#94a3b8" fontSize={10} />
                            <YAxis dataKey="ride_name" type="category" stroke="#94a3b8" fontSize={10} width={80} />
                            <Tooltip />
                            <Bar dataKey="completed_queues" name="Rides Completed" fill="#ef4444" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Restaurant Revenue Bar Chart */}
                    <div className="bg-white border border-slate-200/70 rounded-3xl p-6 shadow-sm">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Restaurant Revenue (₹)</h3>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={charts.restaurant_revenue || []}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="restaurant_name" stroke="#94a3b8" fontSize={10} />
                            <YAxis stroke="#94a3b8" fontSize={10} />
                            <Tooltip />
                            <Bar dataKey="revenue" name="Sales (₹)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Peak Booking Hours Bar Chart */}
                    <div className="bg-white border border-slate-200/70 rounded-3xl p-6 shadow-sm">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Peak Operating Booking Hours</h3>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={charts.peak_booking_hours || []}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} />
                            <YAxis stroke="#94a3b8" fontSize={10} />
                            <Tooltip />
                            <Bar dataKey="count" name="Bookings Count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8: REPORTS HUB */}
              {activeTab === 'reports' && (
                <div className="bg-white border border-slate-200/70 rounded-3xl p-6 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Revenue & Operations Ledger</h3>
                      <p className="text-xs text-slate-400 mt-1">Audit log of payments received through checkout</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => window.print()}
                        className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5"
                      >
                        <Printer size={13} /> Print Ledger
                      </button>
                      <button
                        onClick={exportTransactionsToCSV}
                        className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5"
                      >
                        <Download size={13} /> Export Ledger CSV
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200/60 text-xs font-bold text-slate-400">
                          <th className="pb-3 pl-2">Booking ID</th>
                          <th className="pb-3">Customer</th>
                          <th className="pb-3">Visit Date</th>
                          <th className="pb-3">Visitors</th>
                          <th className="pb-3">Offer Selected</th>
                          <th className="pb-3 text-right">Promo Discount</th>
                          <th className="pb-3 text-right">Total Paid</th>
                          <th className="pb-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions.map((tx, idx) => (
                          <tr key={idx} className="border-b border-slate-50 last:border-none text-xs font-semibold text-slate-700">
                            <td className="py-3 pl-2 font-mono font-bold text-slate-800">{tx.booking_id}</td>
                            <td className="py-3 capitalize">{tx.user_name}</td>
                            <td className="py-3 font-mono">{tx.visit_date}</td>
                            <td className="py-3 text-center">{tx.visitor_count}</td>
                            <td className="py-3 truncate max-w-[120px]" title={tx.offer_name}>{tx.offer_name}</td>
                            <td className="py-3 text-right font-mono text-emerald-600 font-bold">-₹{tx.discount}</td>
                            <td className="py-3 text-right font-mono font-bold text-slate-800">₹{tx.total_paid}/-</td>
                            <td className="py-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${tx.payment_status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                }`}>
                                {tx.payment_status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 9: EMAIL BROADCASTS */}
              {activeTab === 'email' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left compose panel */}
                  <div className="bg-white border border-slate-200/70 rounded-3xl p-6 shadow-sm space-y-4">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Compose Broadcast Email</h3>

                    <div className="space-y-4 text-xs font-semibold">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Template Layout</label>
                        <select
                          value={emailTemplate}
                          onChange={e => {
                            setEmailTemplate(e.target.value);
                            // Set defaults based on template
                            if (e.target.value === 'emergency_alert') {
                              setEmailSubject('🚨 Urgent: ThrillVerse Weather Advisory Update');
                              setEmailMessage('Due to heavy rainfall predictions in the Khopoli area, some outdoor water rollercoasters will close by 4:00 PM today. Indoor attractions remain open.');
                            } else if (e.target.value === 'ride_maintenance') {
                              setEmailSubject('🚧 Ride Operations Update: Nitro Maintenance');
                              setEmailMessage('Our flagship rollercoaster "Nitro" is undergoing scheduled mechanical maintenance and will remain closed today. We apologize for the inconvenience.');
                            } else if (e.target.value === 'offer_announcement') {
                              setEmailSubject('🎁 Special Offer: Grab Your Season Pass!');
                              setEmailMessage('Get unlimited access to all 16 rides with a discounted full-day pass. Use code SAVE200 to get a flat ₹200 discount on checkouts today.');
                            } else if (e.target.value === 'park_closing') {
                              setEmailSubject('🕐 Park Hours Operations Schedule Notice');
                              setEmailMessage('Park hours update: ThrillVerse will close at 9:00 PM tonight for a private corporate event. Gates close at 8:00 PM. Plan your queues accordingly.');
                            } else if (e.target.value === 'new_attraction') {
                              setEmailSubject('🚀 New Attraction Launch: SpaceX Simulation!');
                              setEmailMessage('Experience the cosmic thrill on our newest astronaut training simulator, SpaceX, now open for virtual queues in Zone C!');
                            }
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold"
                        >
                          <option value="offer_announcement">🎁 Offer Announcement</option>
                          <option value="festival_greeting">🎉 Festival Greeting</option>
                          <option value="ride_maintenance">🚧 Ride Maintenance Notice</option>
                          <option value="park_closing">🕐 Park Closing Notice</option>
                          <option value="emergency_alert">🚨 Emergency Alert</option>
                          <option value="new_attraction">🚀 New Attraction Update</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Subject</label>
                        <input
                          type="text"
                          value={emailSubject}
                          onChange={e => setEmailSubject(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Message Body</label>
                        <textarea
                          rows={6}
                          value={emailMessage}
                          onChange={e => setEmailMessage(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium leading-relaxed"
                        />
                      </div>

                      <button
                        onClick={handleSendBroadcast}
                        disabled={emailSending}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        {emailSending ? <RefreshCw className="animate-spin w-4 h-4" /> : <Send size={14} />}
                        Send Broadcast to Registered Users
                      </button>
                    </div>
                  </div>

                  {/* Right live HTML side preview frame */}
                  <div className="lg:col-span-2 space-y-3">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest pl-2">Live Mailbox Preview</h3>
                    <div className="bg-slate-100 rounded-3xl p-5 border border-slate-200 max-h-[550px] overflow-y-auto">
                      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden w-full max-w-xl mx-auto text-sm">

                        {/* Render preview frame based on choices */}
                        <div className={`p-6 text-center text-white ${emailTemplate === 'emergency_alert' ? 'bg-gradient-to-r from-red-600 to-red-800' :
                          emailTemplate === 'ride_maintenance' ? 'bg-gradient-to-r from-amber-500 to-amber-700' :
                            emailTemplate === 'offer_announcement' ? 'bg-gradient-to-r from-purple-500 to-purple-700' :
                              emailTemplate === 'park_closing' ? 'bg-gradient-to-r from-slate-600 to-slate-800' :
                                emailTemplate === 'new_attraction' ? 'bg-gradient-to-r from-emerald-500 to-emerald-700' : 'bg-blue-600'
                          }`}>
                          <h1 className="margin-0 font-extrabold text-xl">🎢 THRILLVERSE</h1>
                          <p className="text-[10px] uppercase font-bold tracking-widest mt-1 opacity-80">
                            {emailTemplate.replace('_', ' ')}
                          </p>
                        </div>

                        <div className="p-8 space-y-4">
                          <h2 className="text-base font-black text-slate-800 border-b border-slate-100 pb-2">{emailSubject}</h2>
                          <div className="text-slate-600 leading-relaxed font-medium whitespace-pre-line text-xs">
                            {emailMessage}
                          </div>

                          <div className="p-3 bg-slate-50 border-l-4 border-blue-600 rounded text-[10px] text-slate-400 font-medium">
                            This is an official system update dispatched by ThrillVerse Theme Park Administration to all registered users.
                          </div>
                        </div>

                        <div className="bg-slate-50 border-t border-slate-100 p-4 text-center text-[10px] text-slate-400 font-bold">
                          &copy; 2026 ThrillVerse Parks & Resorts. Mumbai-Pune Expressway, Maharashtra.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
