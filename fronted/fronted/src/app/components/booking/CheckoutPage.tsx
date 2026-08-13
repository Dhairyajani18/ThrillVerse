import React, { useState, useEffect } from 'react';
import {
  X, ChevronLeft, ArrowRight, Plus, Trash2, CheckCircle,
  AlertCircle, CreditCard, ChevronRight, Download, Share2,
  Printer, QrCode, RefreshCw
} from 'lucide-react';

interface VisitorField {
  full_name: string;
  age: string;
  gender: string;
  relationship: string;
  email?: string;
  phone_number?: string;
}

interface OfferData {
  id: number;
  name: string;
  adult_price: number;
  child_price: number;
  senior_price: number;
}

interface CheckoutPageProps {
  bookingOffer: string;
  bookingDate: string;
  bookingMobile: string;
  token: string;
  userProfile: any;
  onClose: () => void;
  setPage: (page: string) => void;
  setUserTickets: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function CheckoutPage({
  bookingOffer,
  bookingDate,
  bookingMobile,
  token,
  userProfile,
  onClose,
  setPage,
  setUserTickets
}: CheckoutPageProps) {
  // Stepper steps: 'visitors', 'review', 'success', 'failure'
  const [step, setStep] = useState<'visitors' | 'review' | 'success' | 'failure'>('visitors');

  // Dynamic Offer Data fetched from Backend
  const [offers, setOffers] = useState<OfferData[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<OfferData | null>(null);

  // Visitors State
  const [visitors, setVisitors] = useState<VisitorField[]>([]);

  // Promo Code State
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Payment Method Selection State
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'razorpay'>('upi');
  const [upiProvider, setUpiProvider] = useState<'gpay' | 'phonepe' | 'paytm' | 'vpa'>('gpay');
  const [upiIdInput, setUpiIdInput] = useState('success@razorpay');

  // Loading and Error States
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Success / Failure Booking Details
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [failureReason, setFailureReason] = useState<string>('Payment verification timed out.');

  // Fetch active offers on mount
  useEffect(() => {
    const clean = (s?: string) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const defaultFallback: OfferData = {
      id: 1,
      name: bookingOffer || 'Monsoon Magic at ThrillVerse',
      adult_price: 999,
      child_price: 699,
      senior_price: 799
    };

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    fetch('http://127.0.0.1:8000/queue/offers/', { headers })
      .then(res => res.ok ? res.json() : [])
      .then((data: any) => {
        if (Array.isArray(data) && data.length > 0) {
          setOffers(data);
          const targetClean = clean(bookingOffer);
          const found = data.find((o: any) => {
            const oClean = clean(o.name || o.title);
            return (targetClean && oClean.includes(targetClean)) || (targetClean && targetClean.includes(oClean));
          });
          setSelectedOffer(found || data[0]);
        } else {
          setOffers([defaultFallback]);
          setSelectedOffer(defaultFallback);
        }
      })
      .catch(err => {
        console.error('Error fetching offers:', err);
        setOffers([defaultFallback]);
        setSelectedOffer(defaultFallback);
      });
  }, [bookingOffer, token]);

  // Pre-fill primary visitor information
  useEffect(() => {
    let name = '';
    let email = '';
    if (userProfile && userProfile.user) {
      const u = userProfile.user;
      const combined = `${u.first_name || ''} ${u.last_name || ''}`.trim();
      name = combined || u.username || '';
      email = u.email || '';
    }

    setVisitors([
      {
        full_name: name,
        age: userProfile?.age ? String(userProfile.age) : '25',
        gender: 'Male',
        relationship: 'Self',
        email: email,
        phone_number: bookingMobile
      }
    ]);
  }, [userProfile, bookingMobile]);

  // Helper for safe date formatting
  const formatDateSafe = (dateStr?: string) => {
    if (!dateStr) return new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      return new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }
    return d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Helper to determine ticket type based on age (disallows negative/zero age, free for <=3)
  const getTicketTypeByAge = (ageStr: string) => {
    const age = parseInt(ageStr);
    if (isNaN(age) || age <= 0) return 'Invalid';
    if (age <= 3) return 'Infant (Free Entry)';
    if (age < 12) return 'Child';
    if (age >= 60) return 'Senior Citizen';
    return 'Adult';
  };

  // Calculations for Invoice
  const calculatePricing = () => {
    let subtotal = 0;
    let adultCount = 0;
    let childCount = 0;
    let seniorCount = 0;
    let infantCount = 0;

    const adultPrice = selectedOffer ? selectedOffer.adult_price : 999;
    const childPrice = selectedOffer ? selectedOffer.child_price : 699;
    const seniorPrice = selectedOffer ? selectedOffer.senior_price : 799;

    visitors.forEach(v => {
      const type = getTicketTypeByAge(v.age);
      if (type === 'Invalid') return; // Do not count negative or 0 age
      if (type === 'Infant (Free Entry)') {
        infantCount++; // Free entry for children 3 and under (₹0)
      } else if (type === 'Child') {
        subtotal += childPrice;
        childCount++;
      } else if (type === 'Senior Citizen') {
        subtotal += seniorPrice;
        seniorCount++;
      } else {
        subtotal += adultPrice;
        adultCount++;
      }
    });

    const netSubtotal = Math.max(0, subtotal - promoDiscount);
    const gst = Math.round(netSubtotal * 0.18);
    const convenienceFee = 50; // flat convenience fee
    const grandTotal = netSubtotal + gst + convenienceFee;

    return {
      subtotal,
      adultCount,
      childCount,
      seniorCount,
      infantCount,
      gst,
      convenienceFee,
      grandTotal
    };
  };

  const { subtotal, adultCount, childCount, seniorCount, infantCount, gst, convenienceFee, grandTotal } = calculatePricing();

  // Add visitor handler
  const addVisitorCard = () => {
    setVisitors(prev => [
      ...prev,
      { full_name: '', age: '25', gender: 'Male', relationship: 'Friend' }
    ]);
  };

  // Remove visitor handler
  const removeVisitorCard = (index: number) => {
    if (index === 0) return; // Cannot remove primary visitor
    setVisitors(prev => prev.filter((_, i) => i !== index));
  };

  // Input changes
  const handleVisitorChange = (index: number, field: keyof VisitorField, value: string) => {
    let cleanValue = value;
    if (field === 'full_name') {
      // Disallow numbers in full_name field (only letters, spaces, dots, hyphens)
      cleanValue = value.replace(/[^a-zA-Z\s.-]/g, '');
    }
    setVisitors(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: cleanValue };
      return updated;
    });
  };

  // Validate Promo Code API trigger with instant fallback for WATWED799 and all offer codes
  const applyPromoCode = () => {
    const cleanCode = promoInput.trim().toUpperCase();
    if (!cleanCode) return;
    setLoading(true);
    setPromoMessage(null);

    const FALLBACK_PROMOS: Record<string, { type: 'flat' | 'percentage'; val: number }> = {
      'WATWED799': { type: 'flat', val: 200 },
      'MONSOON30': { type: 'percentage', val: 30 },
      'HAPPYTUES': { type: 'percentage', val: 20 },
      'STUDENT50': { type: 'percentage', val: 25 },
      'WELCOME10': { type: 'percentage', val: 10 },
      'SAVE200': { type: 'flat', val: 200 },
      'THRILL20': { type: 'percentage', val: 20 },
      'SNOW499': { type: 'flat', val: 100 },
    };

    fetch('http://127.0.0.1:8000/queue/promo/validate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        code: cleanCode,
        offer_id: selectedOffer ? selectedOffer.id : 1,
        booking_amount: subtotal
      })
    })
      .then(res => res.json().catch(() => null))
      .then(data => {
        setLoading(false);
        if (data && data.valid) {
          setValidationError(null);
          setPromoDiscount(parseFloat(data.discount));
          setAppliedPromo(data.code);
          setPromoMessage({ text: `Promo Code '${data.code}' Applied Successfully!`, isError: false });
        } else if (FALLBACK_PROMOS[cleanCode]) {
          const rule = FALLBACK_PROMOS[cleanCode];
          const discountVal = rule.type === 'flat' ? rule.val : Math.round((rule.val / 100) * subtotal);
          setValidationError(null);
          setPromoDiscount(discountVal);
          setAppliedPromo(cleanCode);
          setPromoMessage({ text: `Promo Code '${cleanCode}' Applied Successfully!`, isError: false });
        } else {
          setPromoDiscount(0);
          setAppliedPromo(null);
          setPromoMessage({ text: data?.error || 'Invalid Promo Code', isError: true });
        }
      })
      .catch(() => {
        setLoading(false);
        if (FALLBACK_PROMOS[cleanCode]) {
          const rule = FALLBACK_PROMOS[cleanCode];
          const discountVal = rule.type === 'flat' ? rule.val : Math.round((rule.val / 100) * subtotal);
          setValidationError(null);
          setPromoDiscount(discountVal);
          setAppliedPromo(cleanCode);
          setPromoMessage({ text: `Promo Code '${cleanCode}' Applied Successfully!`, isError: false });
        } else {
          setPromoDiscount(0);
          setAppliedPromo(null);
          setPromoMessage({ text: 'Invalid Promo Code. Please try again.', isError: true });
        }
      });
  };

  // Stepper validators
  const handleProceedToReview = () => {
    setValidationError(null);
    // Validate fields
    for (let i = 0; i < visitors.length; i++) {
      const v = visitors[i];
      if (!v.full_name.trim() || /\d/.test(v.full_name)) {
        setValidationError(`Name for Visitor ${i + 1} must contain letters only (no numbers allowed)`);
        return;
      }
      if (!v.age.trim() || isNaN(parseInt(v.age)) || parseInt(v.age) <= 0) {
        setValidationError(`Please enter a valid positive age (greater than 0) for Visitor ${i + 1}`);
        return;
      }
      if (i === 0) {
        if (!v.email?.trim() || !v.email.includes('@')) {
          setValidationError(`Please enter a valid email for Primary Visitor`);
          return;
        }
        if (!v.phone_number?.trim() || v.phone_number.length < 10) {
          setValidationError(`Please enter a valid mobile number for Primary Visitor`);
          return;
        }
      }
    }
    setStep('review');
  };

  // Launch Razorpay standard checkout
  const initiatePayment = async () => {
    setLoading(true);
    setValidationError(null);

    // 1. Call Django API to create booking and order
    const payload = {
      offer_id: selectedOffer ? selectedOffer.id : 1,
      visit_date: bookingDate,
      primary_visitor: visitors[0],
      additional_visitors: visitors.slice(1),
      promo_code: appliedPromo
    };

    try {
      const orderRes = await fetch('http://127.0.0.1:8000/queue/booking/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to create Razorpay Order');
      }



      // Detect dummy order mock bypass
      if (orderData.razorpay_order_id.startsWith('order_mock_')) {
        setTimeout(async () => {
          try {
            const verifyRes = await fetch('http://127.0.0.1:8000/queue/booking/verify/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                booking_id: orderData.booking_id,
                razorpay_order_id: orderData.razorpay_order_id,
                razorpay_payment_id: `pay_mock_${Math.random().toString(36).substring(7)}`,
                razorpay_signature: `sig_mock_${Math.random().toString(36).substring(7)}`,
                raw_response: { mock: true }
              })
            });

            const verifyData = await verifyRes.json();
            setLoading(false);

            if (verifyRes.ok) {
              setBookingResult(verifyData);
              const newTicket = {
                id: verifyData.booking_id,
                type: bookingOffer,
                name: visitors[0].full_name,
                date: new Date(verifyData.visit_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
                zones: 'All Zones',
                rides: 'Unlimited Access',
                color: '#1a6ef5',
                gradient: 'linear-gradient(135deg,#1a6ef5,#0052cc)'
              };
              setUserTickets((prev: any[]) => [newTicket, ...prev]);
              setStep('success');
            } else {
              setFailureReason(verifyData.error || 'Signature verification failed.');
              setStep('failure');
            }
          } catch (e: any) {
            setLoading(false);
            setFailureReason(e.message || 'Signature verification encountered an error.');
            setStep('failure');
          }
        }, 1500);
        return;
      }

      // 2. Load Razorpay script dynamically
      const scriptLoaded = await new Promise<boolean>((resolve) => {
        if ((window as any).Razorpay) {
          resolve(true);
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });

      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load. Are you offline?');
      }

      // 3. Open Razorpay checkout options
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ThrillVerse Amusement Park',
        description: `Admission tickets for ${visitors[0].full_name}`,
        order_id: orderData.razorpay_order_id,
        prefill: {
          name: visitors[0].full_name,
          email: visitors[0].email,
          contact: visitors[0].phone_number || '9999999999',
          method: 'upi'
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true
        },
        theme: {
          color: '#1a6ef5'
        },
        handler: async function (response: any) {
          setLoading(true);
          try {
            // Verify payment on Django backend
            const verifyRes = await fetch('http://127.0.0.1:8000/queue/booking/verify/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                booking_id: orderData.booking_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                raw_response: response
              })
            });

            const verifyData = await verifyRes.json();
            setLoading(false);

            if (verifyRes.ok) {
              setBookingResult(verifyData);
              // Append to local tickets list state so profile updates
              const newTicket = {
                id: verifyData.booking_id,
                type: bookingOffer,
                name: visitors[0].full_name,
                date: new Date(verifyData.visit_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
                zones: 'All Zones',
                rides: 'Unlimited Access',
                color: '#1a6ef5',
                gradient: 'linear-gradient(135deg,#1a6ef5,#0052cc)'
              };
              setUserTickets((prev: any[]) => [newTicket, ...prev]);

              // Trigger confetti animation or visual premium confirmation
              setStep('success');
            } else {
              setFailureReason(verifyData.error || 'Signature verification failed.');
              setStep('failure');
            }
          } catch (e: any) {
            setLoading(false);
            setFailureReason(e.message || 'Signature verification encountered an error.');
            setStep('failure');
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            console.log('Razorpay payment modal closed by customer.');
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        setLoading(false);
        setFailureReason(resp.error.description || 'Razorpay payment capture failed.');
        setStep('failure');
      });
      rzp.open();

    } catch (err: any) {
      setLoading(false);
      setValidationError(err.message || 'Failed to initialize booking transaction.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-24 pb-16 px-4 md:px-8">
      {/* Container */}
      <div className="max-w-6xl mx-auto">

        {/* Header navigation bar */}
        <div className="flex items-center justify-between mb-8 border-b border-slate-200/60 pb-4">
          <button
            onClick={step === 'review' ? () => setStep('visitors') : onClose}
            className="flex items-center text-slate-500 hover:text-slate-900 transition-all gap-2 text-sm font-semibold cursor-pointer"
            disabled={loading}
          >
            <ChevronLeft size={16} />
            {step === 'review' ? 'Back to Visitors' : 'Exit Booking'}
          </button>

          <div className="text-right">
            <span className="text-xs font-bold text-[#1a6ef5] tracking-widest uppercase">ThrillVerse Booking System</span>
            <h1 className="text-xl font-black text-slate-800">CHECKOUT PORTAL</h1>
          </div>
        </div>

        {/* Stepper Status Indicator */}
        {step !== 'success' && step !== 'failure' && (
          <div className="flex items-center justify-center gap-2 md:gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white border border-blue-400">✓</div>
              <span className="text-xs md:text-sm font-semibold text-slate-600">Offer</span>
            </div>
            <div className="w-8 h-[2px] bg-blue-600" />
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${step === 'visitors' ? 'bg-[#1a6ef5] border-white text-white' : 'bg-blue-600 border-blue-400 text-white'}`}>
                {step === 'review' ? '✓' : '2'}
              </div>
              <span className={`text-xs md:text-sm font-semibold ${step === 'visitors' ? 'text-slate-800' : 'text-slate-600'}`}>Visitors</span>
            </div>
            <div className={`w-8 h-[2px] ${step === 'review' ? 'bg-blue-600' : 'bg-slate-300'}`} />
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${step === 'review' ? 'bg-[#1a6ef5] border-white text-white' : 'bg-white border-slate-300 text-slate-400'}`}>3</div>
              <span className={`text-xs md:text-sm font-semibold ${step === 'review' ? 'text-slate-800' : 'text-slate-500'}`}>Payment</span>
            </div>
          </div>
        )}

        {/* Stepper Steps Rendering */}
        {step === 'visitors' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Visitors Forms Details (Col Span 2) */}
            <div className="lg:col-span-2 space-y-6">

              {validationError && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-red-700 font-semibold">{validationError}</p>
                </div>
              )}

              {/* Primary Visitor Form Card */}
              {visitors.length > 0 && (
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-[#1a6ef5]" />
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <span className="text-xs font-bold text-[#1a6ef5] uppercase tracking-wider">Visitor 1</span>
                      <h3 className="text-lg font-bold text-slate-850">Primary Visitor (Booking Owner)</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={visitors[0].full_name}
                        onChange={e => handleVisitorChange(0, 'full_name', e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1a6ef5] text-slate-800 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Age <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={visitors[0].age}
                        onChange={e => handleVisitorChange(0, 'age', e.target.value)}
                        placeholder="25"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1a6ef5] text-slate-800 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Gender <span className="text-red-500">*</span></label>
                      <select
                        value={visitors[0].gender}
                        onChange={e => handleVisitorChange(0, 'gender', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1a6ef5] text-slate-800 font-medium"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ticket Type (Auto-assigned)</label>
                      <div className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-700 font-semibold flex items-center justify-between">
                        <span>{getTicketTypeByAge(visitors[0].age)} Ticket</span>
                        <span className="text-xs bg-blue-50 text-[#1a6ef5] px-2.5 py-0.5 rounded-full uppercase font-black">Auto</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address <span className="text-red-500">*</span></label>
                      <input
                        type="email"
                        value={visitors[0].email}
                        onChange={e => handleVisitorChange(0, 'email', e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1a6ef5] text-slate-800 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mobile Number <span className="text-red-500">*</span></label>
                      <input
                        type="tel"
                        value={visitors[0].phone_number}
                        onChange={e => handleVisitorChange(0, 'phone_number', e.target.value)}
                        placeholder="9876543210"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1a6ef5] text-slate-800 font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Who else is coming with you? */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-550 tracking-wider uppercase">Who else is coming with you?</h4>
                  <button
                    onClick={addVisitorCard}
                    className="flex items-center gap-1 bg-[#1a6ef5]/10 hover:bg-[#1a6ef5]/25 text-[#1a6ef5] hover:text-[#0052cc] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border border-[#1a6ef5]/20 cursor-pointer"
                  >
                    <Plus size={14} />
                    Add Visitor
                  </button>
                </div>

                {visitors.slice(1).map((v, i) => {
                  const idx = i + 1;
                  return (
                    <div key={idx} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md relative transition-all hover:border-[#1a6ef5]/20">
                      <div className="flex items-center justify-between mb-5">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Visitor {idx + 1}</span>
                        <button
                          onClick={() => removeVisitorCard(idx)}
                          className="text-slate-400 hover:text-red-500 transition-all p-1 cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Name <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={v.full_name}
                            onChange={e => handleVisitorChange(idx, 'full_name', e.target.value)}
                            placeholder="Visitor Name"
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1a6ef5] text-slate-800 font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Age <span className="text-red-500">*</span></label>
                          <input
                            type="number"
                            min="1"
                            max="120"
                            value={v.age}
                            onChange={e => handleVisitorChange(idx, 'age', e.target.value)}
                            placeholder="25"
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1a6ef5] text-slate-800 font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Gender <span className="text-red-500">*</span></label>
                          <select
                            value={v.gender}
                            onChange={e => handleVisitorChange(idx, 'gender', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1a6ef5] text-slate-800 font-medium"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Relationship <span className="text-red-500">*</span></label>
                          <select
                            value={v.relationship}
                            onChange={e => handleVisitorChange(idx, 'relationship', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1a6ef5] text-slate-800 font-medium"
                          >
                            <option value="Spouse">Spouse</option>
                            <option value="Child">Child</option>
                            <option value="Parent">Parent</option>
                            <option value="Friend">Friend</option>
                            <option value="Relative">Relative</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ticket Type (Auto-assigned)</label>
                          <div className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-700 font-semibold flex items-center justify-between">
                            <span>{getTicketTypeByAge(v.age)} Ticket</span>
                            <span className="text-xs bg-blue-50 text-[#1a6ef5] px-2.5 py-0.5 rounded-full uppercase font-black">Auto</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Live Invoice Summary (Floating Sidebar Card) */}
            <div className="space-y-6">

              {/* Promo Code Card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md">
                <h4 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-4">Apply Promo Code</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={e => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="E.G. WELCOME10"
                    disabled={loading}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm uppercase focus:outline-none focus:border-[#1a6ef5] font-black tracking-wider text-slate-800"
                  />
                  <button
                    onClick={applyPromoCode}
                    disabled={loading}
                    className="bg-[#1a6ef5] hover:bg-[#0052cc] text-white font-bold px-4 py-3 rounded-xl transition-all text-sm cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p className={`text-xs mt-2.5 font-bold ${promoMessage.isError ? 'text-red-600' : 'text-green-600'}`}>
                    {promoMessage.text}
                  </p>
                )}
                {appliedPromo && (
                  <div className="mt-3 flex items-center justify-between bg-green-50 border border-green-200 p-2.5 rounded-lg text-xs font-semibold text-green-700">
                    <span>Applied: {appliedPromo}</span>
                    <span>- ₹{promoDiscount}</span>
                  </div>
                )}
              </div>

              {/* Floating Summary Info */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md sticky top-24 space-y-4">
                <span className="text-xs font-black text-[#1a6ef5] tracking-widest uppercase">Pricing Details</span>
                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">{bookingOffer}</h3>

                {/* Tickets Breakdowns */}
                <div className="space-y-2 text-sm text-slate-600">
                  {adultCount > 0 && (
                    <div className="flex justify-between">
                      <span>Adult Ticket (x{adultCount})</span>
                      <span>₹{adultCount * (selectedOffer?.adult_price || 999)}</span>
                    </div>
                  )}
                  {childCount > 0 && (
                    <div className="flex justify-between">
                      <span>Child Ticket (4-11 yrs) (x{childCount})</span>
                      <span>₹{childCount * (selectedOffer?.child_price || 699)}</span>
                    </div>
                  )}
                  {infantCount > 0 && (
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>Infant Pass (Age ≤ 3) (x{infantCount})</span>
                      <span className="font-bold">FREE (₹0)</span>
                    </div>
                  )}
                  {seniorCount > 0 && (
                    <div className="flex justify-between">
                      <span>Senior Ticket (x{seniorCount})</span>
                      <span>₹{seniorCount * (selectedOffer?.senior_price || 799)}</span>
                    </div>
                  )}

                  <div className="border-t border-slate-100 my-2 pt-2 flex justify-between font-bold text-slate-800">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>

                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-green-600 font-bold">
                      <span>Promo Discount</span>
                      <span>- ₹{promoDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span>₹{gst}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Convenience Fee</span>
                    <span>₹{convenienceFee}</span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-slate-800">
                  <div>
                    <span className="text-xs text-slate-500 uppercase block font-bold">Grand Total</span>
                    <span className="text-2xl font-black tracking-tight text-[#1a6ef5]">₹{grandTotal}/-</span>
                  </div>
                  <span className="text-[10px] bg-blue-50 text-[#1a6ef5] font-black uppercase tracking-widest px-2 py-0.5 rounded">All Taxes Incl.</span>
                </div>

                <button
                  onClick={handleProceedToReview}
                  className="w-full bg-[#1a6ef5] hover:bg-[#0052cc] text-white font-bold py-4 rounded-xl shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer text-sm tracking-wide"
                >
                  Proceed to Review
                  <ArrowRight size={16} />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Step 2: Review Booking */}
        {step === 'review' && (
          <div className="max-w-3xl mx-auto bg-white border border-slate-100 rounded-3xl p-8 shadow-md space-y-6">
            <h2 className="text-xl font-black text-center text-slate-800 uppercase tracking-wider pb-4 border-b border-slate-100">
              REVIEW YOUR TICKET BOOKING
            </h2>

            {validationError && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-red-700 font-semibold">{validationError}</p>
              </div>
            )}

            {/* Details table Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600">
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-slate-500 uppercase block font-bold">Selected Offer</span>
                  <span className="text-base font-bold text-slate-800">{bookingOffer}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 uppercase block font-bold">Visit Date</span>
                  <span className="text-base font-bold text-slate-800">
                    {formatDateSafe(bookingDate)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 uppercase block font-bold">Primary Contact</span>
                  <span className="text-base font-bold text-slate-800 block">{visitors[0]?.full_name || "Primary Visitor"}</span>
                  <span className="text-slate-500 text-xs block">{visitors[0]?.email || "contact@thrillverse.com"} | {visitors[0]?.phone_number || bookingMobile || "9876543210"}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                <span className="text-xs text-[#1a6ef5] font-black uppercase tracking-wider block">Pricing Summary</span>
                <div className="flex justify-between">
                  <span>Admission Subtotal ({visitors.length} Visitors):</span>
                  <span>₹{subtotal}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>Discount Code Applied:</span>
                    <span>- ₹{promoDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST (18%):</span>
                  <span>₹{gst}</span>
                </div>
                <div className="flex justify-between">
                  <span>Convenience Fee:</span>
                  <span>₹{convenienceFee}</span>
                </div>
                <div className="border-t border-slate-200 my-2 pt-2 flex justify-between text-base font-black text-slate-800">
                  <span>Grand Total Paid:</span>
                  <span className="text-[#1a6ef5]">₹{grandTotal}/-</span>
                </div>
              </div>
            </div>

            {/* List of visitors */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Traveler List ({visitors.length})</h4>
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {visitors.map((v, i) => (
                  <div key={i} className="bg-slate-55 p-3 rounded-xl border border-slate-150 flex justify-between items-center text-sm">
                    <div>
                      <span className="font-bold text-slate-800 block">{v.full_name}</span>
                      <span className="text-xs text-slate-500">{v.gender} | Age {v.age} | {i === 0 ? 'Primary' : v.relationship}</span>
                    </div>
                    <span className="text-xs bg-blue-50 text-[#1a6ef5] border border-blue-100 font-black uppercase px-2.5 py-0.5 rounded-full">
                      {getTicketTypeByAge(v.age)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setStep('visitors')}
                disabled={loading}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-4 rounded-xl transition-all cursor-pointer text-sm"
              >
                Back
              </button>
              <button
                onClick={initiatePayment}
                disabled={loading}
                className="flex-[2] bg-[#1a6ef5] hover:bg-[#0052cc] text-white font-bold py-4 rounded-xl shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin" size={16} />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard size={16} />
                    Proceed To Payment (INR {grandTotal})
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success Confirmation Page */}
        {step === 'success' && bookingResult && (
          <div className="max-w-2xl mx-auto bg-white border border-slate-100 rounded-3xl p-8 shadow-xl text-center space-y-6 relative overflow-hidden">
            {/* confettis and gradients */}
            <div className="absolute inset-0 bg-radial-gradient from-emerald-500/10 to-transparent pointer-events-none" />

            {/* Animated Checkmark */}
            <div className="w-20 h-20 bg-emerald-50 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-md animate-bounce">
              <CheckCircle className="text-emerald-500" size={40} />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-black text-emerald-600 tracking-wide uppercase">PAYMENT SUCCESSFUL!</h1>
              <p className="text-slate-600 text-sm">Thank you for booking with ThrillVerse! Your entry pass is confirmed.</p>
            </div>

            {/* Ticket Card Layout */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-[#1a6ef5] font-black text-sm tracking-widest uppercase">🎢 THRILLVERSE ADMISSION TICKET</span>
                <span className="text-xs text-slate-500 font-semibold">{bookingResult.visit_date}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 uppercase block font-bold mb-0.5">Booking ID</span>
                  <span className="text-sm font-bold text-slate-800 block font-mono">{bookingResult.booking_id}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase block font-bold mb-0.5">Invoice ID</span>
                  <span className="text-sm font-bold text-slate-800 block font-mono">{bookingResult.invoice_id}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase block font-bold mb-0.5">Payment ID</span>
                  <span className="text-sm font-bold text-slate-800 block font-mono">{bookingResult.payment_id}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase block font-bold mb-0.5">Amount Paid</span>
                  <span className="text-sm font-black text-green-600">INR {bookingResult.amount_paid}/-</span>
                </div>
              </div>

              {/* QR Code and Instructions */}
              <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-4 rounded-xl border border-slate-200">
                <div className="bg-white p-2 rounded-lg shrink-0 border border-slate-100">
                  <img src={bookingResult.qr_data || 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + bookingResult.booking_id} width="120" height="120" alt="Ticket QR" />
                </div>
                <div className="space-y-1 text-center md:text-left">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 justify-center md:justify-start">
                    <QrCode size={16} className="text-[#1a6ef5]" />
                    Park Entry QR Ticket
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    This QR code has been cryptographically signed for security. Scan this digital QR code directly on your mobile at the park entrance gate. A confirmation email with the ticket PDF attachment is sent to you.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-3">
              <button
                onClick={() => setPage(PAGES.PROFILE)}
                className="w-full flex items-center justify-center gap-2 bg-[#1a6ef5] hover:bg-[#0052cc] text-white font-bold py-4 rounded-xl transition-all cursor-pointer text-sm shadow-md"
              >
                View Bookings History
              </button>
              <button
                onClick={onClose}
                className="w-full text-slate-500 hover:text-slate-850 transition-all text-xs font-semibold py-1 cursor-pointer"
              >
                Back To Offers & Tickets
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Failure Page */}
        {step === 'failure' && (
          <div className="max-w-md mx-auto bg-white border border-slate-100 rounded-3xl p-8 shadow-xl text-center space-y-6">

            <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mx-auto shadow-md">
              <AlertCircle className="text-red-500" size={32} />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-black text-red-500 uppercase tracking-wide">PAYMENT TRANSACTION FAILED</h1>
              <p className="text-slate-600 text-sm">We couldn't process your payment. Reason:</p>
              <div className="bg-red-50 border border-red-100 p-3.5 rounded-xl text-xs font-mono text-red-700 font-bold break-words">
                {failureReason}
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              If money was debited from your account, it will be automatically refunded within 3-5 business days. You can safely retry payment or contact our customer support for help.
            </p>

            {/* Fail actions */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={initiatePayment}
                className="w-full bg-[#1a6ef5] hover:bg-[#0052cc] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm cursor-pointer shadow-md"
              >
                <RefreshCw size={15} />
                Retry Payment
              </button>
              <button
                onClick={() => setStep('visitors')}
                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3.5 rounded-xl transition-all text-sm cursor-pointer"
              >
                Back to Booking Form
              </button>
              <div className="text-xs text-slate-500 pt-2 font-bold">
                ✉️ support@thrillversepark.com | 📞 +91 22 4213 0405
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
