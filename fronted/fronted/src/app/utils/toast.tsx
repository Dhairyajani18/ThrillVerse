import React from "react";
import { toast } from "sonner";

export const notifyAuthSuccess = (type: "login" | "logout", userName?: string) => {
  const isLogin = type === "login";
  toast.custom(
    (t) => (
      <div className="flex items-center gap-3.5 bg-[#0f172a]/95 text-white p-4 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md max-w-sm w-full font-sans animate-in slide-in-from-right duration-300">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-lg ${
            isLogin
              ? "bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-emerald-500/30"
              : "bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-blue-500/30"
          }`}
        >
          {isLogin ? "🎉" : "👋"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              {isLogin ? "Login Successful!" : "Logout Successful!"}
            </h4>
            <span
              className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                isLogin
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
              }`}
            >
              {isLogin ? "ACTIVE" : "SIGNED OUT"}
            </span>
          </div>
          <p className="text-xs text-slate-300 font-medium leading-relaxed">
            {isLogin
              ? `Welcome back${userName ? `, ${userName}` : ""}! Enjoy your ThrillVerse experience.`
              : "You have been safely signed out of your account."}
          </p>
        </div>
        <button
          onClick={() => toast.dismiss(t)}
          className="text-slate-400 hover:text-white text-xs p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          ✕
        </button>
      </div>
    ),
    { duration: 4000 }
  );
};
