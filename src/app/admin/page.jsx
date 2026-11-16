"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Crown,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Edit3,
  Trash2,
  Users,
  Receipt,
  Settings,
  DollarSign,
  Award,
  RefreshCw,
  Lock,
  Save,
  X,
  Gem,
  Ticket,
  Calendar,
  Newspaper,
  Handshake,
  MapPin,
  ExternalLink,
  Image as ImageIcon,
  Flame,
  Search,
  Sparkles,
  Menu,
  ChevronRight,
  ChevronDown,
  LogOut,
  Eye,
  EyeOff,
  ShieldCheck,
  User,
  KeyRound,
} from "lucide-react";

export default function AdminDashboardPage() {
  // Authentication states
  const [authChecking, setAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loginUser, setLoginUser] = useState("admin");
  const [loginPass, setLoginPass] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Change password states
  const [currPass, setCurrPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [changingPass, setChangingPass] = useState(false);
  const [passNotice, setPassNotice] = useState("");

  // Mobile sidebar drawer state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 10 Tabs: tx, contestants, committee, packages, tickets, schedule, news, sponsors, venue, settings
  const [activeTab, setActiveTab] = useState("tx");
  const [txFilter, setTxFilter] = useState("ALL");
  const [contestantSearch, setContestantSearch] = useState("");
  const [sponsorFilter, setSponsorFilter] = useState("ALL");

  // Data states
  const [contestants, setContestants] = useState([]);
  const [packages, setPackages] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [settings, setSettings] = useState({});
  const [pastQueens, setPastQueens] = useState([]);
  const [committee, setCommittee] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [news, setNews] = useState([]);
  const [sponsors, setSponsors] = useState([]);

  const [stats, setStats] = useState({
    total_revenue_lak: 0,
    total_votes: 0,
    pending_count: 0,
    total_tx_count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Edit Modals states
  const [editingContestant, setEditingContestant] = useState(null);
  const [editingPkg, setEditingPkg] = useState(null);
  const [editingPastQueen, setEditingPastQueen] = useState(null);
  const [editingCommittee, setEditingCommittee] = useState(null);
  const [editingTicket, setEditingTicket] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [editingNews, setEditingNews] = useState(null);
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [viewingSlip, setViewingSlip] = useState(null);
  const [quickVoteTarget, setQuickVoteTarget] = useState(null);
  const [customVotePoints, setCustomVotePoints] = useState(100);

  const showNotice = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin");
      const data = await res.json();
      if (res.ok && data.authenticated) {
        setIsAuthenticated(true);
        setAdminUser(data.user);
        loadData();
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setAuthChecking(false);
    }
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!loginUser.trim() || !loginPass) {
      setLoginError("ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ ແລະ ລະຫັດຜ່ານ");
      return;
    }
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "LOGIN",
          payload: { username: loginUser, password: loginPass },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ");
        return;
      }
      setIsAuthenticated(true);
      setAdminUser(data.user);
      setLoginPass("");
      loadData();
    } catch (err) {
      setLoginError("ບໍ່ສາມາດເຊື່ອມຕໍ່ Server ໄດ້: " + err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm("ທ່ານຕ້ອງການອອກຈາກລະບົບແທ້ບໍ່?")) return;
    try {
      await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "LOGOUT" }),
      });
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  const handleChangePassword = async (e) => {
    if (e) e.preventDefault();
    if (!currPass || !newPass) {
      alert("ກະລຸນາປ້ອນລະຫັດຜ່ານປັດຈຸບັນ ແລະ ລະຫັດຜ່ານໃໝ່");
      return;
    }
    if (newPass.length < 6) {
      alert("ລະຫັດຜ່ານໃໝ່ຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ");
      return;
    }
    if (newPass !== confirmPass) {
      alert("ລະຫັດຜ່ານໃໝ່ ແລະ ຢືນຢັນລະຫັດຜ່ານບໍ່ກົງກັນ");
      return;
    }
    setChangingPass(true);
    setPassNotice("");
    const ok = await callAdminApi("CHANGE_PASSWORD", {
      currentPassword: currPass,
      newPassword: newPass,
    });
    setChangingPass(false);
    if (ok) {
      setCurrPass("");
      setNewPass("");
      setConfirmPass("");
      setPassNotice("ປ່ຽນລະຫັດຜ່ານໃໝ່ສຳເລັດຮຽບຮ້ອຍແລ້ວ!");
      setTimeout(() => setPassNotice(""), 4000);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/state", { cache: "no-store" });
      const data = await res.json();
      setContestants(data.contestants || []);
      setPackages(data.packages || []);
      setTransactions(data.transactions || []);
      setSettings(data.settings || {});
      setCommittee(data.committee || []);
      setTickets(data.tickets || []);
      setSchedule(data.schedule || []);
      setNews(data.news || []);
      setSponsors(data.sponsors || []);
      if (data.stats) setStats(data.stats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const callAdminApi = async (action, payload) => {
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload }),
      });
      const data = await res.json();
      if (res.status === 401) {
        setIsAuthenticated(false);
        setLoginError("Session ໝົດອາຍຸ ຫຼື ບໍ່ມີສິດເຂົ້າເຖິງ ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່");
        return false;
      }
      if (!res.ok) {
        alert(data.error || "ເກີດຂໍ້ຜິດພາດ");
        return false;
      }
      showNotice(data.message || "ດຳເນີນການສຳເລັດ");
      await loadData();
      return true;
    } catch {
      alert("ບໍ່ສາມາດເຊື່ອມຕໍ່ Server ໄດ້");
      return false;
    }
  };

  // 1. Initial Authentication Loading State
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#0d0614] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mb-4"></div>
        <p className="text-amber-300 font-bold text-sm tracking-wide">
          ກຳລັງກວດສອບສິດການເຂົ້າເຖິງລະບົບ...
        </p>
      </div>
    );
  }

  // 2. High-Security Admin Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#120824] via-[#1c0a33] to-[#0d0417] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-[32px] p-7 sm:p-9 border border-amber-400/40 shadow-[0_25px_60px_-15px_rgba(88,13,128,0.4)] relative z-10 space-y-6">
          {/* Header Logos */}
          <div className="w-full h-16 rounded-2xl overflow-hidden mx-auto border border-amber-400/50 bg-[#240638] p-1.5 shadow-md">
            <img
              src="/official_pageant_logos.jpg"
              alt="Official Pageant Logos"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-[#580d80] text-xs font-black border border-purple-200 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>ລະບົບຮັກສາຄວາມປອດໄພຂັ້ນສູງ</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#240638] tracking-tight pt-2">
              ເຂົ້າສູ່ລະບົບຫຼັງບ້ານ (Admin Login)
            </h1>
            <p className="text-xs text-[#644180] font-medium">
              Miss Hmong Vientiane 2027 • ລະບົບຈັດການຄະແນນ & ໃບບິນ
            </p>
          </div>

          {/* Error Notice */}
          {loginError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2.5 animate-shake">
              <XCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#240638] mb-1.5">
                ຊື່ຜູ້ໃຊ້ (Username):
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#7e1db3] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  placeholder="admin"
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f8f4fc] border border-[#9333ea]/25 text-sm text-[#240638] font-medium focus:outline-none focus:bg-white focus:border-[#7e1db3] focus:ring-2 focus:ring-[#7e1db3]/20 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#240638] mb-1.5">
                ລະຫັດຜ່ານ (Password):
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7e1db3] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#f8f4fc] border border-[#9333ea]/25 text-sm text-[#240638] font-medium focus:outline-none focus:bg-white focus:border-[#7e1db3] focus:ring-2 focus:ring-[#7e1db3]/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#520d7a] transition cursor-pointer"
                  title={showPassword ? "ເຊື່ອງລະຫັດຜ່ານ" : "ເບິ່ງລະຫັດຜ່ານ"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl font-black text-sm btn-garden-vote cursor-pointer shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  <span>ກຳລັງເຂົ້າສູ່ລະບົບ...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>ເຂົ້າສູ່ລະບົບຈັດການ</span>
                </>
              )}
            </button>
          </form>

          {/* Credentials Info Box */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-[#78350f] space-y-1">
            <div className="font-black flex items-center gap-1.5 text-amber-800">
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>ລະຫັດຜ່ານເລີ່ມຕົ້ນຂອງລະບົບ (Default):</span>
            </div>
            <div>
              ຊື່ຜູ້ໃຊ້: <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono font-bold">admin</code>
              {" • "}
              ລະຫັດຜ່ານ: <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono font-bold">mhvt2027</code>
            </div>
            <p className="text-[10px] text-zinc-500 pt-0.5">
              (ທ່ານສາມາດປ່ຽນລະຫັດຜ່ານໃໝ່ໄດ້ຕະຫຼອດເວລາຢູ່ແທັບ "10. ຕັ້ງຄ່າລະບົບ" ຫຼັງຈາກເຂົ້າສູ່ລະບົບແລ້ວ)
            </p>
          </div>

          <div className="text-center pt-1">
            <Link
              href="/"
              className="text-xs font-bold text-[#644180] hover:text-[#240638] inline-flex items-center gap-1 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ກັບຄືນໜ້າເວັບໄຊຫຼັກ</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredTransactions = transactions.filter(
    (t) => txFilter === "ALL" || t.status === txFilter
  );

  const filteredContestants = contestants.filter((c) => {
    if (!contestantSearch.trim()) return true;
    const q = contestantSearch.toLowerCase();
    return (
      c.code.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      (c.nickname && c.nickname.toLowerCase().includes(q))
    );
  });

  const filteredSponsors = sponsors.filter((s) => {
    if (sponsorFilter === "ALL") return true;
    return s.tier === sponsorFilter;
  });

  const menuSections = [
    {
      group: "ລະບົບໂຫວດ & ຜູ້ເຂົ້າປະກວດ",
      items: [
        {
          id: "tx",
          label: "1. ໃບບິນ & ປະຫວັດໂຫວດ",
          badge: stats.pending_count > 0 ? `${stats.pending_count} ລໍຖ້າ` : null,
          badgeColor: "bg-amber-400 text-[#240638]",
          icon: Receipt,
        },
        {
          id: "contestants",
          label: "2. ຜູ້ເຂົ້າປະກວດ (HM 01 - 20)",
          badge: `${contestants.length}`,
          badgeColor: "bg-white/20 text-white",
          icon: Users,
        },
        {
          id: "packages",
          label: "3. ແພັກເກັດຄະແນນໂຫວດ",
          badge: `${packages.length}`,
          badgeColor: "bg-white/20 text-white",
          icon: Gem,
        },
        {
          id: "past_queens",
          label: "4. ອະດີດນາງສາວ (Hall of Fame)",
          badge: `${pastQueens.length}`,
          badgeColor: "bg-amber-400 text-[#240638]",
          icon: Crown,
        },
      ],
    },
    {
      group: "ໂຄງສ້າງງານ & ບັດເຂົ້າຊົມ",
      items: [
        {
          id: "committee",
          label: "4. ຄະນະກຳມະການ & ຜູ້ບໍລິຫານ",
          badge: `${committee.length}`,
          badgeColor: "bg-white/20 text-white",
          icon: Award,
        },
        {
          id: "tickets",
          label: "5. ປີ້ເຂົ້າຊົມຮອບຕັດສິນ",
          badge: `${tickets.length}`,
          badgeColor: "bg-white/20 text-white",
          icon: Ticket,
        },
        {
          id: "schedule",
          label: "6. ຕາຕະລາງກິດຈະກຳ",
          badge: `${schedule.length}`,
          badgeColor: "bg-white/20 text-white",
          icon: Calendar,
        },
        {
          id: "news",
          label: "7. ຂ່າວສານ & ອັບເດດ",
          badge: `${news.length}`,
          badgeColor: "bg-white/20 text-white",
          icon: Newspaper,
        },
        {
          id: "sponsors",
          label: "8. ຜູ້ສະໜັບສະໜູນ (Sponsors)",
          badge: `${sponsors.length}`,
          badgeColor: "bg-white/20 text-white",
          icon: Handshake,
        },
      ],
    },
    {
      group: "ຂໍ້ມູນສະຖານທີ່ & ຕັ້ງຄ່າ",
      items: [
        {
          id: "venue",
          label: "9. ສະຖານທີ່ & ກ່ຽວກັບ",
          icon: MapPin,
        },
        {
          id: "settings",
          label: "10. ຕັ້ງຄ່າທົ່ວໄປ & ທະນາຄານ",
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f4fc] text-[#240638] flex flex-col lg:flex-row">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl logo-exact-bg text-white font-black text-xs shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* ==================== LEFT SIDEBAR ==================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#1f0330] text-white flex flex-col justify-between shadow-2xl border-r border-amber-400/30 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl overflow-hidden border border-amber-400/60 bg-[#2b0542] p-1 shadow flex items-center justify-center shrink-0">
              <img
                src="/logo_mhvt.png"
                alt="MHVT 2027"
                className="h-10 w-auto object-contain"
              />
            </div>
            <div>
              <h2 className="font-black text-sm text-white tracking-wide leading-tight">
                MHVT 2027
              </h2>
              <p className="text-[11px] text-amber-300 font-bold leading-tight mt-0.5">
                Admin Backoffice
              </p>
              <p className="text-[10px] text-white/60 truncate mt-0.5">
                ສວນບັນດາເຜົ່າ • ຮ້ານຄຳພູວົງ
              </p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 lg:hidden cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sidebar Menu List */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-5 scrollbar-thin scrollbar-thumb-white/20">
          {menuSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1.5">
              <div className="px-3 text-[10px] font-black uppercase tracking-wider text-amber-300/80">
                {sec.group}
              </div>
              <div className="space-y-1">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full px-3 py-2.5 rounded-xl text-xs font-black flex items-center justify-between transition cursor-pointer text-left ${
                        isActive
                          ? "bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-[#240638] shadow-lg font-black"
                          : "text-white/85 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? "text-[#240638]" : "text-amber-300/90"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-black shrink-0 ${
                            isActive
                              ? "bg-[#240638] text-amber-300"
                              : item.badgeColor || "bg-white/20 text-white"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-white/10 space-y-2 bg-[#170224]">
          <div className="flex items-center justify-between text-[11px] px-1 text-white/70">
            <span>ສະຖານະລະບົບ:</span>
            <span
              className={`font-black ${
                settings.voting_open !== "false" ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {settings.voting_open !== "false" ? "● ເປີດຮັບໂຫວດ" : "○ ປິດຊົ່ວຄາວ"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleLogout}
              className="py-2 px-3 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-300" />
              <span>ອອກຈາກລະບົບ</span>
            </button>
            <Link
              href="/"
              className="py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#240638] text-xs font-black flex items-center justify-center gap-1.5 transition shadow"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ໜ້າເວັບ</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* ==================== RIGHT MAIN CONTENT ==================== */}
      <div className="lg:pl-72 flex-1 flex flex-col min-h-screen">
        {/* Top Bar for Desktop and Mobile */}
        <header className="bg-white border-b border-[#9333ea]/15 sticky top-0 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-xl bg-[#f6effc] text-[#520d7a] hover:bg-[#f0e3f8] lg:hidden cursor-pointer"
                title="ເປີດເມນູ Sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <h1 className="text-base sm:text-lg font-black text-[#240638] flex items-center gap-2">
                  <span>
                    {activeTab === "tx" && "1. ຈັດການໃບບິນໂອນເງິນໂຫວດ"}
                    {activeTab === "contestants" && "2. ຈັດການຜູ້ເຂົ້າປະກວດ (HM 01 - HM 20)"}
                    {activeTab === "packages" && "3. ຈັດການແພັກເກັດຄະແນນໂຫວດ"}
                    {activeTab === "past_queens" && "4. ຈັດການອະດີດນາງສາວ (Hall of Fame 2019 - 2026)"}
                    {activeTab === "committee" && "4. ຈັດການຄະນະກຳມະການ & ຜູ້ບໍລິຫານ"}
                    {activeTab === "tickets" && "5. ຈັດການປີ້ເຂົ້າຊົມຮອບຕັດສິນ"}
                    {activeTab === "schedule" && "6. ຈັດການຕາຕະລາງກິດຈະກຳ"}
                    {activeTab === "news" && "7. ຈັດການຂ່າວສານ & ກິດຈະກຳກອງປະກວດ"}
                    {activeTab === "sponsors" && "8. ຈັດການຜູ້ສະໜັບສະໜູນ (Sponsors)"}
                    {activeTab === "venue" && "9. ຂໍ້ມູນສະຖານທີ່ຈັດງານ & ກ່ຽວກັບ"}
                    {activeTab === "settings" && "10. ຕັ້ງຄ່າລະບົບ & ບັນຊີທະນາຄານ"}
                  </span>
                </h1>
                <p className="text-[11px] text-[#644180] hidden sm:block">
                  Miss Hmong Vientiane 2027 • ສວນບັນດາເຜົ່າ & ຮ້ານຄຳພູວົງ
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Admin User Badge */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f6effc] border border-[#9333ea]/20 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[#580d80] font-bold">Admin:</span>
                <span className="text-[#240638] font-black">{adminUser?.username || "admin"}</span>
              </div>

              <button
                onClick={loadData}
                className="px-3 py-2 rounded-xl bg-[#f6effc] hover:bg-[#f0e3f8] text-[#520d7a] border border-[#9333ea]/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="ໂຫຼດຂໍ້ມູນໃໝ່"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">ໂຫຼດຂໍ້ມູນ</span>
              </button>

              <Link
                href="/"
                target="_blank"
                className="px-3.5 py-2 rounded-xl logo-exact-bg text-white font-black text-xs flex items-center gap-1.5 shadow hover:opacity-95"
              >
                <span>ເບິ່ງໜ້າເວັບ</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
              </Link>

              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition"
                title="ອອກຈາກລະບົບ"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ອອກຈາກລະບົບ</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Body Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 space-y-6">
          {/* Top 4 Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-3xl bg-white border border-[#9333ea]/20 p-4 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between text-xs text-[#644180] font-semibold">
                <span className="whitespace-nowrap">ຍອດເງິນໂຫວດທີ່ອະນຸມັດ</span>
                <DollarSign className="w-4 h-4 text-[#7e1db3]" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#520d7a] mt-2 whitespace-nowrap">
                {stats.total_revenue_lak.toLocaleString()}{" "}
                <span className="text-xs font-bold">ກີບ</span>
              </div>
              <div className="text-[11px] text-[#644180] mt-1 whitespace-nowrap">
                ທັງໝົດ {stats.total_tx_count} ລາຍການໂຫວດ
              </div>
            </div>

            <div className="rounded-3xl bg-white border-2 border-amber-400 p-4 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between text-xs text-amber-700 font-bold">
                <span className="whitespace-nowrap">ລໍຖ້າກວດສອບ (Pending)</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-600 mt-2 whitespace-nowrap">
                {stats.pending_count} <span className="text-xs font-bold">ລາຍການ</span>
              </div>
              <div className="text-[11px] text-[#644180] mt-1 whitespace-nowrap">
                ກົດອະນຸມັດເພື່ອບວກຄະແນນ
              </div>
            </div>

            <div className="rounded-3xl bg-white border border-[#9333ea]/20 p-4 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between text-xs text-[#644180] font-semibold">
                <span className="whitespace-nowrap">ຄະແນນໂຫວດລວມທັງໝົດ</span>
                <Award className="w-4 h-4 text-[#7e1db3]" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#520d7a] mt-2 whitespace-nowrap">
                {stats.total_votes.toLocaleString()}{" "}
                <span className="text-xs font-bold">Votes</span>
              </div>
              <div className="text-[11px] text-[#644180] mt-1 whitespace-nowrap">
                ຄະແນນ 20 ໝາຍເລກລວມກັນ
              </div>
            </div>

            <div className="rounded-3xl bg-white border border-[#9333ea]/20 p-4 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between text-xs text-[#644180] font-semibold">
                <span className="whitespace-nowrap">ຜູ້ເຂົ້າປະກວດທັງໝົດ</span>
                <Users className="w-4 h-4 text-[#7e1db3]" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#240638] mt-2 whitespace-nowrap">
                {contestants.length} <span className="text-xs font-normal">ໝາຍເລກ</span>
              </div>
              <div className="text-[11px] text-[#644180] mt-1 whitespace-nowrap">
                ສະຖານະ:{" "}
                <span className="text-[#520d7a] font-bold">
                  {settings.voting_open !== "false" ? "ເປີດຮັບໂຫວດ" : "ປິດຊົ່ວຄາວ"}
                </span>
              </div>
            </div>
          </div>

          {/* ==================== TAB 1: TRANSACTIONS TABLE (FIXED NO-WRAP) ==================== */}
          {activeTab === "tx" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-[#240638]">
                    ລາຍການໂອນເງິນໂຫວດ (Vote Transactions)
                  </h2>
                  <p className="text-xs text-[#644180]">
                    ກວດສອບເລກອ້າງອີງໃບບິນ BCEL One ແລ້ວກົດ &ldquo;ອະນຸມັດ&rdquo; ເພື່ອເພີ່ມຄະແນນໃຫ້ນາງສາວ
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#9333ea]/25 shadow-sm text-xs self-start sm:self-auto">
                  {["ALL", "PENDING", "APPROVED", "REJECTED"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setTxFilter(f)}
                      className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap cursor-pointer ${
                        txFilter === f
                          ? "bg-[#520d7a] text-white shadow"
                          : "text-[#644180] hover:bg-[#f6effc]"
                      }`}
                    >
                      {f === "ALL" && "ທັງໝົດ"}
                      {f === "PENDING" && `ລໍຖ້າ (${stats.pending_count})`}
                      {f === "APPROVED" && "ອະນຸມັດແລ້ວ"}
                      {f === "REJECTED" && "ປະຕິເສດ"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table Container with Horizontal Scroll and Explicit Min-Width */}
              <div className="rounded-3xl bg-white border border-[#9333ea]/25 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1150px] text-left text-xs leading-normal">
                    <thead className="bg-[#240638] text-white">
                      <tr>
                        <th className="py-3.5 px-4 whitespace-nowrap min-w-[140px]">ເວລາ</th>
                        <th className="py-3.5 px-4 whitespace-nowrap min-w-[130px]">ເລກອ້າງອີງ / ບິນ</th>
                        <th className="py-3.5 px-4 whitespace-nowrap min-w-[170px]">ຜູ້ໂຫວດ & ເບີໂທ</th>
                        <th className="py-3.5 px-4 whitespace-nowrap min-w-[180px]">ໝາຍເລກທີ່ໂຫວດ</th>
                        <th className="py-3.5 px-4 whitespace-nowrap min-w-[90px] text-center">ຄະແນນ</th>
                        <th className="py-3.5 px-4 whitespace-nowrap min-w-[130px] text-right">ຈຳນວນເງິນ</th>
                        <th className="py-3.5 px-4 whitespace-nowrap min-w-[110px] text-center">ໃບບິນ (Slip)</th>
                        <th className="py-3.5 px-4 whitespace-nowrap min-w-[220px]">ຂໍ້ຄວາມເຊຍ</th>
                        <th className="py-3.5 px-4 whitespace-nowrap min-w-[130px] text-center">ສະຖານະ</th>
                        <th className="py-3.5 px-4 whitespace-nowrap min-w-[150px] text-center">ຈັດການ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#9333ea]/15">
                      {filteredTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-[#fbf7fd] transition">
                          {/* 1. Time */}
                          <td className="py-3.5 px-4 text-[#644180] whitespace-nowrap font-mono text-[11px]">
                            {tx.created_at}
                          </td>

                          {/* 2. Payment Ref */}
                          <td className="py-3.5 px-4 font-bold text-[#520d7a] whitespace-nowrap font-mono">
                            {tx.payment_ref}
                          </td>

                          {/* 3. Voter Name & Phone */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-bold text-[#240638] whitespace-nowrap">
                              {tx.voter_name}
                            </div>
                            <div className="text-[11px] text-[#644180] whitespace-nowrap font-mono">
                              {tx.voter_phone || "—"}
                            </div>
                          </td>

                          {/* 4. Contestant Code & Name */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-black px-2 py-0.5 rounded-lg logo-exact-bg text-white mr-2 whitespace-nowrap inline-block text-[11px]">
                              {tx.contestant_code}
                            </span>
                            <span className="font-semibold text-[#240638] whitespace-nowrap">
                              {tx.contestant_name}
                            </span>
                          </td>

                          {/* 5. Points */}
                          <td className="py-3.5 px-4 font-black text-[#520d7a] whitespace-nowrap text-center text-sm">
                            +{tx.points_added}
                          </td>

                          {/* 6. Amount LAK */}
                          <td className="py-3.5 px-4 font-black text-[#240638] whitespace-nowrap text-right text-sm">
                            {tx.amount_lak.toLocaleString()} <span className="text-xs font-normal">₭</span>
                          </td>

                          {/* 6.5 Slip Column */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            {tx.slip_image_url ? (
                              <button
                                onClick={() => setViewingSlip(tx)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#f3ebfa] hover:bg-[#e9d5ff] text-[#6b1699] font-bold text-xs cursor-pointer border border-[#c084fc]/50 transition shadow-xs"
                                title="ກວດສອບຮູບໃບບິນໂອນເງິນ"
                              >
                                <ImageIcon className="w-3.5 h-3.5" />
                                <span>ເບິ່ງໃບບິນ</span>
                              </button>
                            ) : (
                              <span className="text-[#9ca3af] text-[11px] font-mono">ບໍ່ມີໃບບິນ</span>
                            )}
                          </td>

                          {/* 7. Cheer Message */}
                          <td className="py-3.5 px-4 text-[#644180] max-w-xs truncate" title={tx.cheer_message}>
                            {tx.cheer_message || "—"}
                          </td>

                          {/* 8. Status Badge (Strict No-Wrap) */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            {tx.status === "APPROVED" && (
                              <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold whitespace-nowrap text-xs shadow-sm">
                                ອະນຸມັດແລ້ວ
                              </span>
                            )}
                            {tx.status === "PENDING" && (
                              <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold whitespace-nowrap text-xs animate-pulse shadow-sm">
                                ລໍຖ້າກວດສອບ
                              </span>
                            )}
                            {tx.status === "REJECTED" && (
                              <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-bold whitespace-nowrap text-xs shadow-sm">
                                ປະຕິເສດ
                              </span>
                            )}
                          </td>

                          {/* 9. Action Buttons (Strict No-Wrap) */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                              {tx.status !== "APPROVED" && (
                                <button
                                  onClick={() => callAdminApi("APPROVE_TX", { id: tx.id })}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 whitespace-nowrap cursor-pointer shadow-sm text-xs"
                                  title="ອະນຸມັດ ແລະ ບວກຄະແນນ"
                                >
                                  ອະນຸມັດ
                                </button>
                              )}
                              {tx.status !== "REJECTED" && (
                                <button
                                  onClick={() => callAdminApi("REJECT_TX", { id: tx.id })}
                                  className="px-2.5 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold whitespace-nowrap cursor-pointer text-xs"
                                  title="ປະຕິເສດລາຍການ"
                                >
                                  ປະຕິເສດ
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 2: CONTESTANTS ==================== */}
          {activeTab === "contestants" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-[#240638]">
                    ລາຍຊື່ຜູ້ເຂົ້າປະກວດ (HM 01 - HM 20)
                  </h2>
                  <p className="text-xs text-[#644180]">
                    ແກ້ໄຂຂໍ້ມູນ, ຊື່, ຮູບຊຸດມົ້ງດັ້ງເດີມ/ຊຸດຄຳ, ຄະແນນໂຫວດ ແລະ ປຸ່ມ Boost ຄະແນນດ່ວນ
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={contestantSearch}
                      onChange={(e) => setContestantSearch(e.target.value)}
                      placeholder="ຄົ້ນຫາໝາຍເລກ, ຊື່..."
                      className="pl-8 pr-3 py-2 rounded-xl bg-white border border-[#9333ea]/25 text-xs text-[#240638]"
                    />
                  </div>
                  <button
                    onClick={() =>
                      setEditingContestant({
                        code: `HM ${String(contestants.length + 1).padStart(2, "0")}`,
                        name: "",
                        nickname: "",
                        age: 20,
                        height: 168,
                        province: "ນະຄອນຫຼວງວຽງຈັນ",
                        ethnic_group: "ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ 2027 (MHVT)",
                        bio: "",
                        image_url: "",
                        traditional_image_url: "",
                        total_votes: 1000,
                        hearts: 200,
                        is_active: 1,
                      })
                    }
                    className="px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 btn-garden-vote cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ເພີ່ມຜູ້ເຂົ້າປະກວດ</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredContestants.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-3xl bg-white border border-[#9333ea]/25 p-4 shadow-sm flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-20 rounded-2xl overflow-hidden border border-amber-400/50 bg-[#240638] shrink-0">
                        <img
                          src={c.traditional_image_url || c.image_url || "/contestants/traditional_hm01.jpg"}
                          alt={c.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="px-2 py-0.5 rounded-lg logo-exact-bg text-white font-black text-xs whitespace-nowrap">
                            {c.code}
                          </span>
                          <span className="text-[11px] text-[#644180] truncate">{c.province}</span>
                        </div>
                        <h3 className="font-black text-sm text-[#240638] mt-1 truncate">{c.name}</h3>
                        <div className="text-xs text-[#520d7a] font-bold mt-0.5 whitespace-nowrap">
                          {c.total_votes.toLocaleString()} <span className="text-[10px]">Votes</span> •{" "}
                          <span className="text-rose-600">{c.hearts || 120} ♥</span>
                        </div>
                        <div className="text-[11px] text-[#644180] truncate mt-0.5">
                          {c.ethnic_group}
                        </div>
                      </div>
                    </div>

                    {/* Quick Vote Boost buttons */}
                    <div className="p-2.5 rounded-2xl bg-[#f6effc] border border-[#9333ea]/20 space-y-1.5">
                      <div className="text-[10px] font-bold text-[#644180] whitespace-nowrap">
                        ເພີ່ມຄະແນນດ່ວນ (Quick Boost):
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          onClick={() => callAdminApi("ADD_VOTES_CONTESTANT", { id: c.id, votes: 50 })}
                          className="py-1 px-1.5 rounded-lg bg-white hover:bg-amber-100 text-[#520d7a] font-black text-[11px] border border-[#9333ea]/20 shadow-sm cursor-pointer whitespace-nowrap"
                        >
                          +50
                        </button>
                        <button
                          onClick={() => callAdminApi("ADD_VOTES_CONTESTANT", { id: c.id, votes: 100 })}
                          className="py-1 px-1.5 rounded-lg bg-white hover:bg-amber-100 text-[#520d7a] font-black text-[11px] border border-[#9333ea]/20 shadow-sm cursor-pointer whitespace-nowrap"
                        >
                          +100
                        </button>
                        <button
                          onClick={() => callAdminApi("ADD_VOTES_CONTESTANT", { id: c.id, votes: 500 })}
                          className="py-1 px-1.5 rounded-lg btn-gold-vote text-[11px] font-black shadow-sm cursor-pointer whitespace-nowrap"
                        >
                          +500
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#9333ea]/15">
                      <button
                        onClick={() => {
                          setQuickVoteTarget(c);
                          setCustomVotePoints(100);
                        }}
                        className="text-xs text-[#7e1db3] hover:underline font-bold whitespace-nowrap"
                      >
                        + ລະບຸຄະແນນເອງ
                      </button>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingContestant({ ...c })}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#f3ebfa] text-[#520d7a] cursor-pointer"
                          title="ແກ້ໄຂ"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`ຢືນຢັນລຶບ ${c.code} (${c.name})?`)) {
                              callAdminApi("DELETE_CONTESTANT", { id: c.id });
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                          title="ລຶບ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB 3: PACKAGES ==================== */}
          {activeTab === "packages" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-[#240638]">
                    ແພັກເກັດຄະແນນໂຫວດ (Vote Packages)
                  </h2>
                  <p className="text-xs text-[#644180]">
                    ກຳນົດຈຳນວນຄະແນນ, ລາຄາກີບ, ປ້າຍ Badge ໂປຣໂມຊັນສຳລັບຜູ້ໂຫວດ
                  </p>
                </div>

                <button
                  onClick={() =>
                    setEditingPkg({
                      name: "ແພັກເກັດໂຫວດໃໝ່",
                      points: 100,
                      price_lak: 500000,
                      badge: "Hot Pack",
                    })
                  }
                  className="px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 btn-garden-vote cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>ເພີ່ມແພັກເກັດ</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="rounded-3xl bg-white border border-[#9333ea]/25 p-5 shadow-sm flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-[#240638] whitespace-nowrap">
                          +{pkg.points} Votes
                        </span>
                        {pkg.badge && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#c084fc] text-[#1f0330] font-black whitespace-nowrap">
                            {pkg.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="font-black text-base text-[#240638] mt-2">{pkg.name}</h3>
                      <div className="text-xl font-black text-[#520d7a] mt-1 whitespace-nowrap">
                        {pkg.price_lak.toLocaleString()} <span className="text-xs">ກີບ</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#9333ea]/15">
                      <button
                        onClick={() => setEditingPkg({ ...pkg })}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-[#f3ebfa] text-[#520d7a] font-bold text-xs flex items-center gap-1 cursor-pointer whitespace-nowrap"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>ແກ້ໄຂ</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`ຢືນຢັນລຶບ ${pkg.name}?`)) {
                            callAdminApi("DELETE_PACKAGE", { id: pkg.id });
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB: PAST QUEENS (HALL OF FAME) ==================== */}
          {activeTab === "past_queens" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-[#240638]">
                    ອະດີດນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ (Hall of Fame)
                  </h2>
                  <p className="text-xs text-[#644180]">
                    ຈັດການລາຍຊື່, ປີ, ຮູບພາບ, ຕຳແໜ່ງ ແລະ ຜົນງານຂອງອະດີດນາງສາວແຕ່ລະປີ (2019 - 2026)
                  </p>
                </div>

                <button
                  onClick={() =>
                    setEditingPastQueen({
                      year: "2027",
                      name: "",
                      title: "ນາງສາວເຜົ່າມົ້ງນະຄອນຫລວງວຽງຈັນ",
                      badge: "",
                      image_url: "/api/avatar?code=2027&bg=gold&name=Queen",
                      bio: "",
                      order_no: pastQueens.length + 1,
                    })
                  }
                  className="px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 btn-garden-vote cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>ເພີ່ມອະດີດນາງສາວ</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {pastQueens.map((q) => (
                  <div
                    key={q.id}
                    className="rounded-3xl bg-white border border-[#9333ea]/25 overflow-hidden shadow-sm p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-[#240638] font-black text-xs shadow-xs">
                          👑 ປີ {q.year}
                        </span>
                        <span className="text-[11px] font-mono text-[#644180]">
                          ລຳດັບ: #{q.order_no}
                        </span>
                      </div>

                      <div className="w-24 h-24 mx-auto mb-3 relative">
                        <img
                          src={q.image_url}
                          alt={q.name}
                          onError={(e) => {
                            e.currentTarget.src = `/api/avatar?code=${q.year}&bg=gold&name=${encodeURIComponent(q.name)}`;
                          }}
                          className="w-full h-full object-cover rounded-full border-2 border-amber-400 shadow-xs"
                        />
                      </div>

                      <h3 className="font-black text-sm text-[#240638] text-center">
                        {q.name}
                      </h3>
                      <p className="text-[11px] text-[#6b1699] font-bold text-center mt-0.5">
                        {q.title}
                      </p>

                      {q.badge && (
                        <div className="text-center mt-2">
                          <span className="inline-block px-2 py-0.5 rounded bg-purple-100 text-[#520d7a] font-bold text-[10px]">
                            ✨ {q.badge}
                          </span>
                        </div>
                      )}

                      <p className="text-xs text-[#644180] mt-3 line-clamp-2 leading-relaxed bg-[#fbf8fd] p-2 rounded-xl">
                        {q.bio || "—"}
                      </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-gray-100">
                      <button
                        onClick={() => setEditingPastQueen({ ...q })}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-[#f3ebfa] text-[#520d7a] font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>ແກ້ໄຂ</span>
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`ຕ້ອງການລຶບຂໍ້ມູນອະດີດນາງສາວປີ ${q.year} ແທ້ບໍ່?`)) {
                            await callAdminApi("DELETE_PAST_QUEEN", { id: q.id });
                          }
                        }}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="ລຶບ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB 4: COMMITTEE ==================== */}
          {activeTab === "committee" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-[#240638]">
                    ຄະນະກຳມະການ & ຜູ້ບໍລິຫານກອງປະກວດ
                  </h2>
                  <p className="text-xs text-[#644180]">
                    ຈັດການລາຍຊື່ປະທານ, ຜູ້ອຳນວຍການ ແລະ ຜູ້ບໍລິຫານກອງປະກວດ (ສະແດງໃນໜ້າເວັບ)
                  </p>
                </div>

                <button
                  onClick={() =>
                    setEditingCommittee({
                      order_no: committee.length + 1,
                      badge: "ຄະນະບໍລິຫານ • EXECUTIVE",
                      name: "",
                      role: "",
                      sub_role: "",
                      quote: "",
                      image: "/committee/img1.jpg",
                      featured: 0,
                    })
                  }
                  className="px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 btn-garden-vote cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>ເພີ່ມຄະນະກຳມະການ</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {committee.map((m) => (
                  <div
                    key={m.id}
                    className={`rounded-3xl bg-white border p-4 shadow-sm flex flex-col justify-between space-y-3 ${
                      m.featured ? "border-amber-400 border-2" : "border-[#9333ea]/25"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-20 h-24 rounded-2xl overflow-hidden border border-amber-400/50 bg-[#240638] shrink-0">
                        <img
                          src={m.image}
                          alt={m.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-[#240638] font-black whitespace-nowrap">
                            #{m.order_no}
                          </span>
                          {m.featured === 1 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full logo-exact-bg text-white font-black whitespace-nowrap">
                              ປະທານຫຼັກ
                            </span>
                          )}
                        </div>
                        <h3 className="font-black text-sm text-[#240638] mt-1.5 truncate">{m.name}</h3>
                        <div className="text-xs text-[#520d7a] font-bold mt-0.5 truncate">{m.role}</div>
                        <div className="text-[11px] text-[#644180] truncate mt-0.5">{m.sub_role}</div>
                      </div>
                    </div>

                    {m.quote && (
                      <div className="p-2.5 rounded-xl bg-[#f6effc] border border-[#9333ea]/15 text-[11px] text-[#520d7a] italic line-clamp-2">
                        &ldquo;{m.quote}&rdquo;
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2 border-t border-[#9333ea]/15">
                      <button
                        onClick={() => setEditingCommittee({ ...m })}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-[#f3ebfa] text-xs font-bold text-[#520d7a] flex items-center gap-1 cursor-pointer whitespace-nowrap"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>ແກ້ໄຂ</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`ຢືນຢັນລຶບ ${m.name}?`)) {
                            callAdminApi("DELETE_COMMITTEE", { id: m.id });
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB 5: TICKETS ==================== */}
          {activeTab === "tickets" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-[#240638]">
                    ປີ້ເຂົ້າຊົມຮອບຕັດສິນ (Grand Finale Tickets)
                  </h2>
                  <p className="text-xs text-[#644180]">
                    ກຳນົດໂຊນບ່ອນນັ່ງ, ລາຄາ, ຄະແນນໂຫວດຟຣີທີ່ແຖມ, ແລະ ສິດທິພິເສດ (Perks)
                  </p>
                </div>

                <button
                  onClick={() =>
                    setEditingTicket({
                      tier_id: `tier_${tickets.length + 1}`,
                      name: "New Ticket Tier",
                      name_lao: "ບັດເຂົ້າຊົມໂຊນໃໝ່",
                      price_lak: 100000,
                      bonus_votes: 10,
                      zone: "Zone B",
                      perks_json: JSON.stringify(["ບັດເຂົ້າຊົມ 1 ທ່ານ", "ຟຣີໂຫວດ 10 Votes"]),
                      badge: "ບັດໃໝ່",
                      popular: 0,
                      order_no: tickets.length + 1,
                    })
                  }
                  className="px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 btn-garden-vote cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>ເພີ່ມປະເພດປີ້</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {tickets.map((t) => {
                  const perks =
                    typeof t.perks_json === "string"
                      ? JSON.parse(t.perks_json || "[]")
                      : t.perks || [];
                  return (
                    <div
                      key={t.id}
                      className={`rounded-3xl bg-white border p-5 shadow-sm flex flex-col justify-between space-y-4 ${
                        t.popular ? "border-amber-400 border-2" : "border-[#9333ea]/25"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-[#240638] font-black whitespace-nowrap">
                            {t.badge || "Ticket"}
                          </span>
                          <span className="text-xs font-bold text-[#520d7a] whitespace-nowrap">
                            ແຖມ +{t.bonus_votes} Votes
                          </span>
                        </div>
                        <h3 className="font-black text-base text-[#240638] mt-2">{t.name_lao}</h3>
                        <div className="text-xs text-[#644180]">{t.zone}</div>
                        <div className="text-xl font-black text-[#520d7a] mt-2 whitespace-nowrap">
                          {t.price_lak.toLocaleString()} <span className="text-xs">ກີບ</span>
                        </div>

                        <ul className="mt-3 space-y-1.5 text-xs text-[#644180]">
                          {perks.map((p, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-[#9333ea]">•</span>
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#9333ea]/15">
                        <button
                          onClick={() => setEditingTicket({ ...t })}
                          className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-[#f3ebfa] text-[#520d7a] font-bold text-xs flex items-center gap-1 cursor-pointer whitespace-nowrap"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>ແກ້ໄຂ</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`ຢືນຢັນລຶບ ${t.name_lao}?`)) {
                              callAdminApi("DELETE_TICKET", { id: t.id });
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==================== TAB 6: SCHEDULE ==================== */}
          {activeTab === "schedule" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-[#240638]">
                    ຕາຕະລາງກິດຈະກຳກອງປະກວດ (Schedule)
                  </h2>
                  <p className="text-xs text-[#644180]">
                    ກຳນົດວັນທີ, ເວລາ, ຊື່ກິດຈະກຳ, ສະຖານທີ່, ສະຖານະ (ສົດ, ສຳເລັດແລ້ວ, ຮອບຕັດສິນ)
                  </p>
                </div>

                <button
                  onClick={() =>
                    setEditingSchedule({
                      order_no: schedule.length + 1,
                      date: "25 ພະຈິກ 2026",
                      time: "18:00 - 22:00",
                      title: "",
                      location: "ສວນບັນດາເຜົ່າ / Lao Ethnic Garden",
                      status: "ກຳລັງມາເຖິງ",
                      is_live: 0,
                      is_done: 0,
                      is_finale: 0,
                    })
                  }
                  className="px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 btn-garden-vote cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>ເພີ່ມກິດຈະກຳ</span>
                </button>
              </div>

              <div className="space-y-3">
                {schedule.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-3xl bg-white border border-[#9333ea]/25 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="px-3.5 py-2 rounded-2xl logo-exact-bg text-white text-center shrink-0 min-w-[125px] whitespace-nowrap">
                        <div className="text-xs font-black">{item.date}</div>
                        <div className="text-[10px] text-white/85">{item.time}</div>
                      </div>
                      <div>
                        <h3 className="font-black text-sm sm:text-base text-[#240638]">{item.title}</h3>
                        <div className="text-xs text-[#644180] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-[#9333ea]" />
                          <span>{item.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-auto whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black whitespace-nowrap ${
                          item.is_live
                            ? "bg-amber-400 text-[#240638]"
                            : item.is_done
                            ? "bg-[#a855f7]/25 text-[#380957]"
                            : "bg-[#f6effc] text-[#520d7a]"
                        }`}
                      >
                        {item.status}
                      </span>

                      <button
                        onClick={() => setEditingSchedule({ ...item })}
                        className="p-2 rounded-xl bg-gray-100 hover:bg-[#f3ebfa] text-[#520d7a] cursor-pointer"
                        title="ແກ້ໄຂ"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`ຢືນຢັນລຶບກິດຈະກຳ ${item.title}?`)) {
                            callAdminApi("DELETE_SCHEDULE", { id: item.id });
                          }
                        }}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                        title="ລຶບ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB 7: NEWS & ACTIVITIES ==================== */}
          {activeTab === "news" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-[#240638]">
                    ຂ່າວສານ & ກິດຈະກຳກອງປະກວດ (News & Updates)
                  </h2>
                  <p className="text-xs text-[#644180]">
                    ໂພສຂ່າວສານ, ການລົງພື້ນທີ່, ຮູບຖ່າຍທາງການ ແລະ ຄວາມຄືບໜ້າກອງປະກວດ
                  </p>
                </div>

                <button
                  onClick={() =>
                    setEditingNews({
                      order_no: news.length + 1,
                      title: "",
                      date: "15 ພະຈິກ 2026",
                      category: "ຂ່າວກອງປະກວດ",
                      summary: "",
                      content: "",
                      images_json: JSON.stringify(["/committee/img3.jpg"]),
                      type: "general",
                    })
                  }
                  className="px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 btn-garden-vote cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>ເພີ່ມຂ່າວສານ</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {news.map((item) => {
                  const imgs =
                    typeof item.images_json === "string"
                      ? JSON.parse(item.images_json || "[]")
                      : item.images || [];
                  return (
                    <div
                      key={item.id}
                      className="rounded-3xl bg-white border border-[#9333ea]/25 overflow-hidden shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="h-44 bg-[#240638] overflow-hidden">
                          <img
                            src={imgs[0] || "/committee/img3.jpg"}
                            alt={item.title}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <div className="p-4 space-y-2">
                          <div className="flex items-center justify-between text-[11px] text-[#644180]">
                            <span className="font-bold text-[#9333ea] whitespace-nowrap">{item.category}</span>
                            <span className="whitespace-nowrap">{item.date}</span>
                          </div>
                          <h3 className="font-black text-sm text-[#240638] line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-xs text-[#644180] line-clamp-3 leading-relaxed">
                            {item.summary || item.content}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 pt-0 flex justify-end gap-2">
                        <button
                          onClick={() => setEditingNews({ ...item })}
                          className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-[#f3ebfa] text-[#520d7a] font-bold text-xs flex items-center gap-1 cursor-pointer whitespace-nowrap"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>ແກ້ໄຂ</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`ຢືນຢັນລຶບຂ່າວ ${item.title}?`)) {
                              callAdminApi("DELETE_NEWS", { id: item.id });
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==================== TAB 8: SPONSORS ==================== */}
          {activeTab === "sponsors" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-[#240638]">
                    ຜູ້ສະໜັບສະໜູນ & ພາດເນີ (Sponsors & Partners)
                  </h2>
                  <p className="text-xs text-[#644180]">
                    ກຳນົດລະດັບຜູ້ສະໜັບສະໜູນ Diamond, Platinum, Gold ພ້ອມຕຳແໜ່ງ & ບົດບາດ
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={sponsorFilter}
                    onChange={(e) => setSponsorFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white border border-[#9333ea]/25 text-xs text-[#240638] font-bold"
                  >
                    <option value="ALL">ທຸກລະດັບ Tier</option>
                    <option value="DIAMOND">DIAMOND</option>
                    <option value="PLATINUM">PLATINUM</option>
                    <option value="GOLD">GOLD</option>
                  </select>

                  <button
                    onClick={() =>
                      setEditingSponsor({
                        tier: "DIAMOND",
                        name: "",
                        role: "",
                        order_no: sponsors.length + 1,
                      })
                    }
                    className="px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 btn-garden-vote cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ເພີ່ມຜູ້ສະໜັບສະໜູນ</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSponsors.map((sp) => (
                  <div
                    key={sp.id}
                    className="rounded-3xl bg-white border border-[#9333ea]/25 p-4 shadow-sm flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-black whitespace-nowrap ${
                            sp.tier === "DIAMOND"
                              ? "bg-amber-400 text-[#240638]"
                              : sp.tier === "PLATINUM"
                              ? "bg-slate-200 text-slate-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {sp.tier} SPONSOR
                        </span>
                        <span className="text-[10px] text-[#644180] font-bold">#{sp.order_no}</span>
                      </div>
                      <h3 className="font-black text-sm text-[#240638] mt-2">{sp.name}</h3>
                      <div className="text-xs text-[#644180] mt-0.5">{sp.role || "—"}</div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-[#9333ea]/15">
                      <button
                        onClick={() => setEditingSponsor({ ...sp })}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-[#f3ebfa] text-[#520d7a] font-bold text-xs flex items-center gap-1 cursor-pointer whitespace-nowrap"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>ແກ້ໄຂ</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`ຢືນຢັນລຶບ ${sp.name}?`)) {
                            callAdminApi("DELETE_SPONSOR", { id: sp.id });
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB 9: VENUE & ABOUT ==================== */}
          {activeTab === "venue" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-black text-[#240638]">
                  ຂໍ້ມູນສະຖານທີ່ຈັດງານ & ກ່ຽວກັບ (Lao Ethnic Garden)
                </h2>
                <p className="text-xs text-[#644180]">
                  ຈັດການທີ່ຢູ່, ເບີໂທຕິດຕໍ່, ອີເມວ, ລິ້ງ Facebook, Website ແລະ ຂໍ້ຄວາມແຈ້ງເຕືອນໜ້າເວັບ
                </p>
              </div>

              <div className="rounded-3xl bg-white border border-[#9333ea]/25 p-6 shadow-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="md:col-span-2">
                    <label className="block font-bold text-[#644180] mb-1">
                      ຊື່ສະຖານທີ່ຈັດງານ (Venue Name)
                    </label>
                    <input
                      type="text"
                      value={settings.venue_name || ""}
                      onChange={(e) => setSettings({ ...settings, venue_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-sm font-bold text-[#240638]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-[#644180] mb-1">
                      ທີ່ຕັ້ງສະຖານທີ່ (Address)
                    </label>
                    <input
                      type="text"
                      value={settings.venue_address || ""}
                      onChange={(e) => setSettings({ ...settings, venue_address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-sm text-[#240638]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#644180] mb-1">
                      ເບີໂທລະສັບຕິດຕໍ່ (WhatsApp)
                    </label>
                    <input
                      type="text"
                      value={settings.venue_phones || ""}
                      onChange={(e) => setSettings({ ...settings, venue_phones: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-sm text-[#240638]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#644180] mb-1">ອີເມວຕິດຕໍ່ (Email)</label>
                    <input
                      type="text"
                      value={settings.venue_email || ""}
                      onChange={(e) => setSettings({ ...settings, venue_email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-sm text-[#240638]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#644180] mb-1">
                      ລິ້ງ Facebook Page ທາງການ
                    </label>
                    <input
                      type="text"
                      value={settings.venue_facebook || ""}
                      onChange={(e) => setSettings({ ...settings, venue_facebook: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-sm text-[#240638]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#644180] mb-1">
                      ລິ້ງ Facebook Photos (ອັນບັ້ມຮູບສາວງາມ)
                    </label>
                    <input
                      type="text"
                      value={settings.venue_facebook_photos || ""}
                      onChange={(e) =>
                        setSettings({ ...settings, venue_facebook_photos: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-sm text-[#240638]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#644180] mb-1">
                      ເວັບໄຊທາງການ (Website URL)
                    </label>
                    <input
                      type="text"
                      value={settings.venue_website || ""}
                      onChange={(e) => setSettings({ ...settings, venue_website: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-sm text-[#240638]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#644180] mb-1">
                      ວັນທີນັບຖອຍຫຼັງຮອບຕັດສິນ (Countdown Target Date)
                    </label>
                    <input
                      type="text"
                      value={settings.countdown_date || "2026-11-25T18:00:00"}
                      onChange={(e) => setSettings({ ...settings, countdown_date: e.target.value })}
                      placeholder="2026-11-25T18:00:00"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-sm text-[#240638]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-[#644180] mb-1">
                      ຂໍ້ຄວາມແຖບແລ່ນສົດ (Top Live Ticker)
                    </label>
                    <input
                      type="text"
                      value={settings.liveticker_text || ""}
                      onChange={(e) => setSettings({ ...settings, liveticker_text: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-sm text-[#240638]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-[#644180] mb-1">
                      ຄຳອະທິບາຍກ້ອງຫົວຂໍ້ງານໃຫຍ່ (Hero Subtitle)
                    </label>
                    <textarea
                      rows={2}
                      value={settings.hero_subtitle || ""}
                      onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-sm text-[#240638]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() =>
                      callAdminApi("UPDATE_SETTINGS", {
                        venue_name: settings.venue_name || "",
                        venue_address: settings.venue_address || "",
                        venue_phones: settings.venue_phones || "",
                        venue_email: settings.venue_email || "",
                        venue_facebook: settings.venue_facebook || "",
                        venue_facebook_photos: settings.venue_facebook_photos || "",
                        venue_website: settings.venue_website || "",
                        countdown_date: settings.countdown_date || "2026-11-25T18:00:00",
                        liveticker_text: settings.liveticker_text || "",
                        hero_subtitle: settings.hero_subtitle || "",
                      })
                    }
                    className="px-6 py-3 rounded-xl font-black text-xs btn-garden-vote flex items-center gap-2 cursor-pointer shadow-md whitespace-nowrap"
                  >
                    <Save className="w-4 h-4" />
                    <span>ບັນທຶກຂໍ້ມູນສະຖານທີ່ & ກ່ຽວກັບ</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 10: SETTINGS ==================== */}
          {activeTab === "settings" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-black text-[#240638]">
                  ຕັ້ງຄ່າທົ່ວໄປ & ລະບົບທະນາຄານ (General Settings)
                </h2>
                <p className="text-xs text-[#644180]">
                  ເປີດ/ປິດລະບົບໂຫວດ, ໂໝດ Auto-Approve ໃບບິນ, ຊື່ຫົວຂໍ້ງານ, ແລະ ຂໍ້ມູນບັນຊີຮັບໂອນ
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-3xl bg-white border border-[#9333ea]/25 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f6effc] border border-[#9333ea]/20">
                    <div>
                      <div className="font-bold text-sm text-[#240638]">ສະຖານະເປີດຮັບໂຫວດ</div>
                      <div className="text-xs text-[#644180]">
                        {settings.voting_open !== "false"
                          ? "ປະຊາຊົນສາມາດກົດໂຫວດໄດ້ປົກກະຕິ"
                          : "ປິດລະບົບໂຫວດຊົ່ວຄາວ (ປຸ່ມໂຫວດຈະຖືກປິດ)"}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        callAdminApi("UPDATE_SETTINGS", {
                          voting_open: settings.voting_open === "false" ? "true" : "false",
                        })
                      }
                      className={`px-4 py-2 rounded-xl font-black text-xs cursor-pointer whitespace-nowrap ${
                        settings.voting_open !== "false"
                          ? "btn-garden-vote"
                          : "bg-rose-600 text-white"
                      }`}
                    >
                      {settings.voting_open !== "false"
                        ? "ເປີດຮັບໂຫວດຢູ່ (ກົດເພື່ອປິດ)"
                        : "ປິດຮັບໂຫວດ (ກົດເພື່ອເປີດ)"}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f6effc] border border-[#9333ea]/20">
                    <div>
                      <div className="font-bold text-sm text-[#240638]">
                        ໂໝດອະນຸມັດບິນອັດຕະໂນມັດ (Auto-Approve)
                      </div>
                      <div className="text-xs text-[#644180]">
                        ຖ້າເປີດ: ທຸກການໂຫວດຈະບວກຄະແນນທັນທີໂດຍບໍ່ຕ້ອງລໍຖ້າແອັດມິນກົດ
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        callAdminApi("UPDATE_SETTINGS", {
                          auto_approve: settings.auto_approve === "true" ? "false" : "true",
                        })
                      }
                      className={`px-4 py-2 rounded-xl font-black text-xs cursor-pointer whitespace-nowrap ${
                        settings.auto_approve === "true"
                          ? "btn-gold-vote"
                          : "bg-white text-[#520d7a] border border-[#9333ea]/30"
                      }`}
                    >
                      {settings.auto_approve === "true"
                        ? "ເປີດ Auto-Approve ຢູ່"
                        : "ປິດ (ກວດບິນດ້ວຍມື)"}
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl bg-white border border-[#9333ea]/25 p-5 shadow-sm space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#644180] mb-1">
                      ຊື່ຫົວຂໍ້ງານປະກວດໜ້າເວັບ
                    </label>
                    <input
                      type="text"
                      value={settings.event_title || ""}
                      onChange={(e) => setSettings({ ...settings, event_title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-sm text-[#240638]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#644180] mb-1">
                      ຂໍ້ມູນບັນຊີທະນາຄານ (ສະແດງກ້ອງ QR Code)
                    </label>
                    <input
                      type="text"
                      value={settings.bank_info || ""}
                      onChange={(e) => setSettings({ ...settings, bank_info: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-sm text-[#240638]"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-[#f6effc] border border-[#9333ea]/25 flex items-center gap-4">
                    <div className="w-20 h-20 bg-white border border-[#9333ea]/30 rounded-xl p-1.5 flex items-center justify-center shrink-0 shadow-xs">
                      <img
                        src="/official_lao_qr.png"
                        alt="Official Lao QR"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-black">
                        ✓ ໃຊ້ງານ Lao QR ທາງການຂອງກອງປະກວດ
                      </div>
                      <h4 className="font-black text-sm text-[#240638] mt-1">
                        Official Lao QR Code (BCEL One / APB / ທຸກທະນາຄານ)
                      </h4>
                      <p className="text-xs text-[#644180] mt-0.5">
                        ໄຟລ໌: public/official_lao_qr.png ຖືກເຊື່ອມຕໍ່ເຂົ້າສູ່ໜ້າຕ່າງໂຫວດຂອງເວັບໄຊທຸກຈຸດຮຽບຮ້ອຍແລ້ວ
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      callAdminApi("UPDATE_SETTINGS", {
                        event_title: settings.event_title || "",
                        bank_info: settings.bank_info || "",
                      })
                    }
                    className="px-5 py-2.5 rounded-xl font-black text-xs btn-garden-vote flex items-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <Save className="w-4 h-4" />
                    <span>ບັນທຶກການຕັ້ງຄ່າທົ່ວໄປ</span>
                  </button>
                </div>

                {/* Dedicated Security & Password Management Card */}
                <div className="md:col-span-2 rounded-3xl bg-white border border-[#9333ea]/25 p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-[#9333ea]/15">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-base text-[#240638]">
                        ຄວາມປອດໄພ & ປ່ຽນລະຫັດຜ່ານແອັດມິນ (Admin Security & Password)
                      </h3>
                      <p className="text-xs text-[#644180]">
                        ລະຫັດຜ່ານຈະຖືກເຂົ້າລະຫັດ Scrypt ພ້ອມ Salt ຢ່າງປອດໄພໃນຖານຂໍ້ມູນ SQLite
                      </p>
                    </div>
                  </div>

                  {passNotice && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{passNotice}</span>
                    </div>
                  )}

                  <form onSubmit={handleChangePassword} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-[#240638] mb-1.5">
                        ລະຫັດຜ່ານປັດຈຸບັນ (Current Password):
                      </label>
                      <input
                        type="password"
                        value={currPass}
                        onChange={(e) => setCurrPass(e.target.value)}
                        placeholder="ປ້ອນລະຫັດຜ່ານເດີມ..."
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f4fc] border border-[#9333ea]/30 text-xs text-[#240638] focus:outline-none focus:bg-white focus:border-[#7e1db3]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#240638] mb-1.5">
                        ລະຫັດຜ່ານໃໝ່ (New Password):
                      </label>
                      <input
                        type="password"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        placeholder="ຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ..."
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f4fc] border border-[#9333ea]/30 text-xs text-[#240638] focus:outline-none focus:bg-white focus:border-[#7e1db3]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#240638] mb-1.5">
                        ຢືນຢັນລະຫັດຜ່ານໃໝ່ (Confirm New):
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="password"
                          value={confirmPass}
                          onChange={(e) => setConfirmPass(e.target.value)}
                          placeholder="ປ້ອນລະຫັດໃໝ່ອີກຄັ້ງ..."
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f4fc] border border-[#9333ea]/30 text-xs text-[#240638] focus:outline-none focus:bg-white focus:border-[#7e1db3]"
                        />
                        <button
                          type="submit"
                          disabled={changingPass}
                          className="px-4 py-2.5 rounded-xl font-black text-xs btn-garden-vote flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 shadow-md"
                        >
                          {changingPass ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Save className="w-3.5 h-3.5" />
                          )}
                          <span>ບັນທຶກລະຫັດໃໝ່</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ==================== MODAL: EDIT CONTESTANT ==================== */}
      {editingContestant && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-2 border-[#a855f7] rounded-3xl max-w-xl w-full p-6 space-y-4 my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-black text-base text-[#240638]">
                {editingContestant.id ? `ແກ້ໄຂຂໍ້ມູນ ${editingContestant.code}` : "ເພີ່ມຜູ້ເຂົ້າປະກວດໃໝ່"}
              </h3>
              <button
                onClick={() => setEditingContestant(null)}
                className="text-gray-500 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[#644180] font-semibold mb-1">ລະຫັດໝາຍເລກ (ເຊັ່ນ HM 01)</label>
                <input
                  type="text"
                  value={editingContestant.code || ""}
                  onChange={(e) => setEditingContestant({ ...editingContestant, code: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-[#240638] font-bold"
                />
              </div>

              <div>
                <label className="block text-[#644180] font-semibold mb-1">ຊື່ຫຼິ້ນ</label>
                <input
                  type="text"
                  value={editingContestant.nickname || ""}
                  onChange={(e) => setEditingContestant({ ...editingContestant, nickname: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-[#240638]"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[#644180] font-semibold mb-1">ຊື່ ແລະ ນາມສະກຸນເຕັມ</label>
                <input
                  type="text"
                  value={editingContestant.name || ""}
                  onChange={(e) => setEditingContestant({ ...editingContestant, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-[#240638] font-bold"
                />
              </div>

              <div>
                <label className="block text-[#644180] font-semibold mb-1">ອາຍຸ</label>
                <input
                  type="number"
                  value={editingContestant.age || 20}
                  onChange={(e) => setEditingContestant({ ...editingContestant, age: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-[#240638]"
                />
              </div>

              <div>
                <label className="block text-[#644180] font-semibold mb-1">ລວງສູງ (cm)</label>
                <input
                  type="number"
                  value={editingContestant.height || 168}
                  onChange={(e) => setEditingContestant({ ...editingContestant, height: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-[#240638]"
                />
              </div>

              <div>
                <label className="block text-[#644180] font-semibold mb-1">ແຂວງທີ່ມາ</label>
                <input
                  type="text"
                  value={editingContestant.province || "ນະຄອນຫຼວງວຽງຈັນ"}
                  onChange={(e) => setEditingContestant({ ...editingContestant, province: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-[#240638]"
                />
              </div>

              <div>
                <label className="block text-[#644180] font-semibold mb-1">ຕົວແທນຊົນເຜົ່າ / ສັງກັດ</label>
                <input
                  type="text"
                  value={editingContestant.ethnic_group || "ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ 2027 (MHVT)"}
                  onChange={(e) => setEditingContestant({ ...editingContestant, ethnic_group: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-[#520d7a] font-bold"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[#644180] font-semibold mb-1">
                  ລິ້ງຮູບຊຸດມົ້ງດັ້ງເດີມ (Traditional Costume Photo)
                </label>
                <input
                  type="text"
                  value={editingContestant.traditional_image_url || ""}
                  onChange={(e) =>
                    setEditingContestant({ ...editingContestant, traditional_image_url: e.target.value })
                  }
                  placeholder="/contestants/traditional_hm01.jpg"
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-[#240638]"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[#644180] font-semibold mb-1">
                  ລິ້ງຮູບຊຸດປະດັບຄຳ (Phouvong Gold Jewelry Photo)
                </label>
                <input
                  type="text"
                  value={editingContestant.image_url || ""}
                  onChange={(e) =>
                    setEditingContestant({ ...editingContestant, image_url: e.target.value })
                  }
                  placeholder="/contestants/hm06.jpg"
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-[#240638]"
                />
              </div>

              <div>
                <label className="block text-[#644180] font-semibold mb-1">ຄະແນນໂຫວດລວມ</label>
                <input
                  type="number"
                  value={editingContestant.total_votes || 0}
                  onChange={(e) =>
                    setEditingContestant({ ...editingContestant, total_votes: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-[#520d7a] font-black"
                />
              </div>

              <div>
                <label className="block text-[#644180] font-semibold mb-1">ຍອດຫົວໃຈ ♥</label>
                <input
                  type="number"
                  value={editingContestant.hearts || 120}
                  onChange={(e) =>
                    setEditingContestant({ ...editingContestant, hearts: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-rose-600 font-black"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[#644180] font-semibold mb-1">ປະຫວັດ & ຄະຕິປະຈຳໃຈ</label>
                <textarea
                  rows={2}
                  value={editingContestant.bio || ""}
                  onChange={(e) => setEditingContestant({ ...editingContestant, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-[#240638]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
              <button
                onClick={() => setEditingContestant(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-xs font-bold text-gray-700 cursor-pointer"
              >
                ຍົກເລີກ
              </button>
              <button
                onClick={async () => {
                  const ok = await callAdminApi("SAVE_CONTESTANT", editingContestant);
                  if (ok) setEditingContestant(null);
                }}
                className="px-5 py-2 rounded-xl font-black text-xs btn-garden-vote cursor-pointer"
              >
                ບັນທຶກຂໍ້ມູນ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: EDIT PAST QUEEN ==================== */}
      {editingPastQueen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 text-xs shadow-2xl border border-gray-200 my-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-black text-sm text-[#240638]">
                {editingPastQueen.id ? "ແກ້ໄຂຂໍ້ມູນອະດີດນາງສາວ" : "ເພີ່ມຂໍ້ມູນອະດີດນາງສາວ"}
              </h3>
              <button
                onClick={() => setEditingPastQueen(null)}
                className="text-gray-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#644180] font-semibold mb-1">
                  ປີທີ່ໄດ້ມົງກຸດ (Year)
                </label>
                <input
                  type="text"
                  value={editingPastQueen.year || ""}
                  onChange={(e) =>
                    setEditingPastQueen({ ...editingPastQueen, year: e.target.value })
                  }
                  placeholder="ເຊັ່ນ: 2020"
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-[#240638] font-bold"
                />
              </div>

              <div>
                <label className="block text-[#644180] font-semibold mb-1">
                  ລຳດັບສະແດງ (Order No)
                </label>
                <input
                  type="number"
                  value={editingPastQueen.order_no || 0}
                  onChange={(e) =>
                    setEditingPastQueen({
                      ...editingPastQueen,
                      order_no: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-[#240638]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#644180] font-semibold mb-1">
                ຊື່ ແລະ ນາມສະກຸນ
              </label>
              <input
                type="text"
                value={editingPastQueen.name || ""}
                onChange={(e) =>
                  setEditingPastQueen({ ...editingPastQueen, name: e.target.value })
                }
                placeholder="ເຊັ່ນ: ທ່ານ ນາງ ປ່າເຢັ່ງຊາ ລໍ່"
                className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-[#240638] font-bold"
              />
            </div>

            <div>
              <label className="block text-[#644180] font-semibold mb-1">
                ຕຳແໜ່ງທາງການ
              </label>
              <input
                type="text"
                value={editingPastQueen.title || ""}
                onChange={(e) =>
                  setEditingPastQueen({ ...editingPastQueen, title: e.target.value })
                }
                placeholder="ເຊັ່ນ: ນາງສາວເຜົ່າມົ້ງນະຄອນຫລວງວຽງຈັນ 2020"
                className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-[#240638]"
              />
            </div>

            <div>
              <label className="block text-[#644180] font-semibold mb-1">
                Badge ຜົນງານໂດດເດັ່ນ (Highlight)
              </label>
              <input
                type="text"
                value={editingPastQueen.badge || ""}
                onChange={(e) =>
                  setEditingPastQueen({ ...editingPastQueen, badge: e.target.value })
                }
                placeholder="ເຊັ່ນ: Miss Universe Laos 2022 • Top 16 MU"
                className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-[#240638]"
              />
            </div>

            <div>
              <label className="block text-[#644180] font-semibold mb-1">
                ລິ້ງຮູບພາບ (Image URL)
              </label>
              <input
                type="text"
                value={editingPastQueen.image_url || ""}
                onChange={(e) =>
                  setEditingPastQueen({ ...editingPastQueen, image_url: e.target.value })
                }
                placeholder="/api/avatar?code=2020&bg=purple..."
                className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-[#240638]"
              />
            </div>

            <div>
              <label className="block text-[#644180] font-semibold mb-1">
                ປະຫວັດຫຍໍ້ & ຜົນງານ (Bio)
              </label>
              <textarea
                rows={3}
                value={editingPastQueen.bio || ""}
                onChange={(e) =>
                  setEditingPastQueen({ ...editingPastQueen, bio: e.target.value })
                }
                placeholder="ລາຍລະອຽດຜົນງານ..."
                className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-[#240638]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
              <button
                onClick={() => setEditingPastQueen(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold cursor-pointer"
              >
                ຍົກເລີກ
              </button>
              <button
                onClick={async () => {
                  const ok = await callAdminApi("SAVE_PAST_QUEEN", editingPastQueen);
                  if (ok) setEditingPastQueen(null);
                }}
                className="px-5 py-2 rounded-xl font-black btn-garden-vote cursor-pointer"
              >
                ບັນທຶກຂໍ້ມູນ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: EDIT COMMITTEE ==================== */}
      {editingCommittee && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-2 border-[#a855f7] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-black text-base text-[#240638]">
                {editingCommittee.id ? "ແກ້ໄຂຂໍ້ມູນຄະນະກຳມະການ" : "ເພີ່ມຄະນະກຳມະການໃໝ່"}
              </h3>
              <button onClick={() => setEditingCommittee(null)} className="text-gray-500 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#644180] font-semibold mb-1">ລຳດັບການສະແດງ (Order No)</label>
                  <input
                    type="number"
                    value={editingCommittee.order_no || 1}
                    onChange={(e) =>
                      setEditingCommittee({ ...editingCommittee, order_no: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[#644180] font-semibold mb-1">ປ້າຍ Badge (ເຊັ່ນ ປະທານສູງສຸດ)</label>
                  <input
                    type="text"
                    value={editingCommittee.badge || ""}
                    onChange={(e) =>
                      setEditingCommittee({ ...editingCommittee, badge: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#644180] font-semibold mb-1">ຊື່ ແລະ ນາມສະກຸນ</label>
                <input
                  type="text"
                  value={editingCommittee.name || ""}
                  onChange={(e) => setEditingCommittee({ ...editingCommittee, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-[#644180] font-semibold mb-1">ຕຳແໜ່ງຫຼັກໃນກອງປະກວດ</label>
                <input
                  type="text"
                  value={editingCommittee.role || ""}
                  onChange={(e) => setEditingCommittee({ ...editingCommittee, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30"
                />
              </div>

              <div>
                <label className="block text-[#644180] font-semibold mb-1">ຕຳແໜ່ງຮອງ / ອົງກອນ</label>
                <input
                  type="text"
                  value={editingCommittee.sub_role || ""}
                  onChange={(e) => setEditingCommittee({ ...editingCommittee, sub_role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30"
                />
              </div>

              <div>
                <label className="block text-[#644180] font-semibold mb-1">ລິ້ງຮູບພາບ (Image URL)</label>
                <input
                  type="text"
                  value={editingCommittee.image || ""}
                  onChange={(e) => setEditingCommittee({ ...editingCommittee, image: e.target.value })}
                  placeholder="/committee/img3.jpg"
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30"
                />
              </div>

              <div>
                <label className="block text-[#644180] font-semibold mb-1">ຄຳກ່າວ / ວິໄສທັດ (Quote)</label>
                <textarea
                  rows={2}
                  value={editingCommittee.quote || ""}
                  onChange={(e) => setEditingCommittee({ ...editingCommittee, quote: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="comFeatured"
                  checked={Boolean(editingCommittee.featured)}
                  onChange={(e) =>
                    setEditingCommittee({ ...editingCommittee, featured: e.target.checked ? 1 : 0 })
                  }
                  className="w-4 h-4 rounded text-[#9333ea]"
                />
                <label htmlFor="comFeatured" className="text-[#240638] font-bold">
                  ສະແດງເປັນປະທານຫຼັກ (Top Spotlight Hero)
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
              <button
                onClick={() => setEditingCommittee(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-xs font-bold text-gray-700 cursor-pointer"
              >
                ຍົກເລີກ
              </button>
              <button
                onClick={async () => {
                  const ok = await callAdminApi("SAVE_COMMITTEE", editingCommittee);
                  if (ok) setEditingCommittee(null);
                }}
                className="px-5 py-2 rounded-xl font-black text-xs btn-garden-vote cursor-pointer"
              >
                ບັນທຶກຂໍ້ມູນ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: EDIT PACKAGE ==================== */}
      {editingPkg && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#a855f7] rounded-3xl max-w-md w-full p-6 space-y-4 text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-black text-sm text-[#240638]">
                {editingPkg.id ? "ແກ້ໄຂແພັກເກັດໂຫວດ" : "ເພີ່ມແພັກເກັດໂຫວດໃໝ່"}
              </h3>
              <button onClick={() => setEditingPkg(null)} className="text-gray-500 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[#644180] font-semibold mb-1">ຊື່ແພັກເກັດ</label>
                <input
                  type="text"
                  value={editingPkg.name || ""}
                  onChange={(e) => setEditingPkg({ ...editingPkg, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-[#240638]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#644180] font-semibold mb-1">ຄະແນນ (Votes)</label>
                  <input
                    type="number"
                    value={editingPkg.points || 10}
                    onChange={(e) => setEditingPkg({ ...editingPkg, points: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-[#520d7a] font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[#644180] font-semibold mb-1">ລາຄາ (ກີບ)</label>
                  <input
                    type="number"
                    value={editingPkg.price_lak || 10000}
                    onChange={(e) => setEditingPkg({ ...editingPkg, price_lak: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-[#240638] font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#644180] font-semibold mb-1">ປ້າຍ Badge (ເຊັ່ນ ຂາຍດີ, ປະຢັດ 20%)</label>
                <input
                  type="text"
                  value={editingPkg.badge || ""}
                  onChange={(e) => setEditingPkg({ ...editingPkg, badge: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-[#240638]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
              <button
                onClick={() => setEditingPkg(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold cursor-pointer"
              >
                ຍົກເລີກ
              </button>
              <button
                onClick={async () => {
                  const ok = await callAdminApi("SAVE_PACKAGE", editingPkg);
                  if (ok) setEditingPkg(null);
                }}
                className="px-5 py-2 rounded-xl font-black btn-garden-vote cursor-pointer"
              >
                ບັນທຶກແພັກເກັດ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: EDIT TICKET ==================== */}
      {editingTicket && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-2 border-[#a855f7] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-black text-base text-[#240638]">
                {editingTicket.id ? "ແກ້ໄຂປະເພດປີ້ເຂົ້າຊົມ" : "ເພີ່ມປະເພດປີ້ເຂົ້າຊົມ"}
              </h3>
              <button onClick={() => setEditingTicket(null)} className="text-gray-500 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#644180] font-semibold mb-1">Tier ID (ລະຫັດໂຊນ)</label>
                  <input
                    type="text"
                    value={editingTicket.tier_id || ""}
                    onChange={(e) => setEditingTicket({ ...editingTicket, tier_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[#644180] font-semibold mb-1">ປ້າຍ Badge</label>
                  <input
                    type="text"
                    value={editingTicket.badge || ""}
                    onChange={(e) => setEditingTicket({ ...editingTicket, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#644180] font-semibold mb-1">ຊື່ປີ້ (ພາສາລາວ)</label>
                <input
                  type="text"
                  value={editingTicket.name_lao || ""}
                  onChange={(e) => setEditingTicket({ ...editingTicket, name_lao: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-[#644180] font-semibold mb-1">ຊື່ປີ້ (English)</label>
                <input
                  type="text"
                  value={editingTicket.name || ""}
                  onChange={(e) => setEditingTicket({ ...editingTicket, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#644180] font-semibold mb-1">ລາຄາ (ກີບ)</label>
                  <input
                    type="number"
                    value={editingTicket.price_lak || 50000}
                    onChange={(e) =>
                      setEditingTicket({ ...editingTicket, price_lak: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 font-black text-[#520d7a]"
                  />
                </div>
                <div>
                  <label className="block text-[#644180] font-semibold mb-1">ຄະແນນໂຫວດທີ່ແຖມຟຣີ</label>
                  <input
                    type="number"
                    value={editingTicket.bonus_votes || 0}
                    onChange={(e) =>
                      setEditingTicket({ ...editingTicket, bonus_votes: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 font-black text-[#520d7a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#644180] font-semibold mb-1">ໂຊນບ່ອນນັ່ງ (Zone description)</label>
                <input
                  type="text"
                  value={editingTicket.zone || ""}
                  onChange={(e) => setEditingTicket({ ...editingTicket, zone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30"
                />
              </div>

              <div>
                <label className="block text-[#644180] font-semibold mb-1">
                  ສິດທິພິເສດ (Perks JSON array ຫຼື ຄັ່ນດ້ວຍຈຸດ)
                </label>
                <textarea
                  rows={3}
                  value={
                    typeof editingTicket.perks_json === "string"
                      ? editingTicket.perks_json
                      : JSON.stringify(editingTicket.perks || [])
                  }
                  onChange={(e) => setEditingTicket({ ...editingTicket, perks_json: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="ticketPopular"
                  checked={Boolean(editingTicket.popular)}
                  onChange={(e) =>
                    setEditingTicket({ ...editingTicket, popular: e.target.checked ? 1 : 0 })
                  }
                  className="w-4 h-4 rounded text-[#9333ea]"
                />
                <label htmlFor="ticketPopular" className="text-[#240638] font-bold">
                  ຕັ້ງເປັນບັດຍອດນິຍົມ (Popular Gold Card)
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
              <button
                onClick={() => setEditingTicket(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-xs font-bold text-gray-700 cursor-pointer"
              >
                ຍົກເລີກ
              </button>
              <button
                onClick={async () => {
                  const ok = await callAdminApi("SAVE_TICKET", editingTicket);
                  if (ok) setEditingTicket(null);
                }}
                className="px-5 py-2 rounded-xl font-black text-xs btn-garden-vote cursor-pointer"
              >
                ບັນທຶກຂໍ້ມູນ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: EDIT SCHEDULE ==================== */}
      {editingSchedule && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-2 border-[#a855f7] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-black text-base text-[#240638]">
                {editingSchedule.id ? "ແກ້ໄຂຕາຕະລາງກິດຈະກຳ" : "ເພີ່ມຕາຕະລາງກິດຈະກຳ"}
              </h3>
              <button onClick={() => setEditingSchedule(null)} className="text-gray-500 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#644180] font-semibold mb-1">ວັນທີ (Date)</label>
                  <input
                    type="text"
                    value={editingSchedule.date || ""}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[#644180] font-semibold mb-1">ເວລາ (Time)</label>
                  <input
                    type="text"
                    value={editingSchedule.time || ""}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#644180] font-semibold mb-1">ຊື່ກິດຈະກຳ</label>
                <input
                  type="text"
                  value={editingSchedule.title || ""}
                  onChange={(e) => setEditingSchedule({ ...editingSchedule, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-[#644180] font-semibold mb-1">ສະຖານທີ່</label>
                <input
                  type="text"
                  value={editingSchedule.location || ""}
                  onChange={(e) => setEditingSchedule({ ...editingSchedule, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30"
                />
              </div>

              <div>
                <label className="block text-[#644180] font-semibold mb-1">ຂໍ້ຄວາມສະຖານະ (Badge status)</label>
                <input
                  type="text"
                  value={editingSchedule.status || ""}
                  onChange={(e) => setEditingSchedule({ ...editingSchedule, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingSchedule.is_live)}
                    onChange={(e) =>
                      setEditingSchedule({ ...editingSchedule, is_live: e.target.checked ? 1 : 0 })
                    }
                    className="w-4 h-4 text-[#9333ea]"
                  />
                  <span className="font-bold">ກຳລັງດຳເນີນການ (Live)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingSchedule.is_done)}
                    onChange={(e) =>
                      setEditingSchedule({ ...editingSchedule, is_done: e.target.checked ? 1 : 0 })
                    }
                    className="w-4 h-4 text-[#9333ea]"
                  />
                  <span className="font-bold">ສຳເລັດແລ້ວ</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingSchedule.is_finale)}
                    onChange={(e) =>
                      setEditingSchedule({ ...editingSchedule, is_finale: e.target.checked ? 1 : 0 })
                    }
                    className="w-4 h-4 text-[#9333ea]"
                  />
                  <span className="font-bold text-amber-700">ຮອບຕັດສິນ (Finale)</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
              <button
                onClick={() => setEditingSchedule(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-xs font-bold text-gray-700 cursor-pointer"
              >
                ຍົກເລີກ
              </button>
              <button
                onClick={async () => {
                  const ok = await callAdminApi("SAVE_SCHEDULE", editingSchedule);
                  if (ok) setEditingSchedule(null);
                }}
                className="px-5 py-2 rounded-xl font-black text-xs btn-garden-vote cursor-pointer"
              >
                ບັນທຶກຂໍ້ມູນ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: EDIT NEWS ==================== */}
      {editingNews && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-2 border-[#a855f7] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-black text-base text-[#240638]">
                {editingNews.id ? "ແກ້ໄຂຂ່າວສານ" : "ເພີ່ມຂ່າວສານໃໝ່"}
              </h3>
              <button onClick={() => setEditingNews(null)} className="text-gray-500 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#644180] font-semibold mb-1">ຫົວຂໍ້ຂ່າວ</label>
                <input
                  type="text"
                  value={editingNews.title || ""}
                  onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 font-bold text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#644180] font-semibold mb-1">ວັນທີລົງຂ່າວ</label>
                  <input
                    type="text"
                    value={editingNews.date || ""}
                    onChange={(e) => setEditingNews({ ...editingNews, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[#644180] font-semibold mb-1">ໝວດໝູ່ຂ່າວ</label>
                  <input
                    type="text"
                    value={editingNews.category || ""}
                    onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#644180] font-semibold mb-1">ເນື້ອຫາຫຍໍ້ (Summary)</label>
                <textarea
                  rows={2}
                  value={editingNews.summary || ""}
                  onChange={(e) => setEditingNews({ ...editingNews, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30"
                />
              </div>

              <div>
                <label className="block text-[#644180] font-semibold mb-1">ເນື້ອຫາເຕັມ (Content)</label>
                <textarea
                  rows={3}
                  value={editingNews.content || ""}
                  onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30"
                />
              </div>

              <div>
                <label className="block text-[#644180] font-semibold mb-1">
                  ລິ້ງຮູບພາບ (JSON array ຮູບ)
                </label>
                <input
                  type="text"
                  value={
                    typeof editingNews.images_json === "string"
                      ? editingNews.images_json
                      : JSON.stringify(editingNews.images || [])
                  }
                  onChange={(e) => setEditingNews({ ...editingNews, images_json: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
              <button
                onClick={() => setEditingNews(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-xs font-bold text-gray-700 cursor-pointer"
              >
                ຍົກເລີກ
              </button>
              <button
                onClick={async () => {
                  const ok = await callAdminApi("SAVE_NEWS", editingNews);
                  if (ok) setEditingNews(null);
                }}
                className="px-5 py-2 rounded-xl font-black text-xs btn-garden-vote cursor-pointer"
              >
                ບັນທຶກຂໍ້ມູນ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: EDIT SPONSOR ==================== */}
      {editingSponsor && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#a855f7] rounded-3xl max-w-md w-full p-6 space-y-4 text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-black text-sm text-[#240638]">
                {editingSponsor.id ? "ແກ້ໄຂຜູ້ສະໜັບສະໜູນ" : "ເພີ່ມຜູ້ສະໜັບສະໜູນໃໝ່"}
              </h3>
              <button onClick={() => setEditingSponsor(null)} className="text-gray-500 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[#644180] font-semibold mb-1">ລະດັບ Tier</label>
                <select
                  value={editingSponsor.tier || "DIAMOND"}
                  onChange={(e) => setEditingSponsor({ ...editingSponsor, tier: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 font-bold"
                >
                  <option value="DIAMOND">DIAMOND SPONSORS</option>
                  <option value="PLATINUM">PLATINUM SPONSORS</option>
                  <option value="GOLD">GOLD SPONSORS</option>
                </select>
              </div>

              <div>
                <label className="block text-[#644180] font-semibold mb-1">ຊື່ອົງກອນ / ຍີ່ຫໍ້</label>
                <input
                  type="text"
                  value={editingSponsor.name || ""}
                  onChange={(e) => setEditingSponsor({ ...editingSponsor, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 font-bold"
                />
              </div>

              <div>
                <label className="block text-[#644180] font-semibold mb-1">ບົດບາດ / ການສະໜັບສະໜູນ</label>
                <input
                  type="text"
                  value={editingSponsor.role || ""}
                  onChange={(e) => setEditingSponsor({ ...editingSponsor, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30"
                />
              </div>

              <div>
                <label className="block text-[#644180] font-semibold mb-1">ລຳດັບການສະແດງ (Order No)</label>
                <input
                  type="number"
                  value={editingSponsor.order_no || 1}
                  onChange={(e) =>
                    setEditingSponsor({ ...editingSponsor, order_no: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
              <button
                onClick={() => setEditingSponsor(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold cursor-pointer"
              >
                ຍົກເລີກ
              </button>
              <button
                onClick={async () => {
                  const ok = await callAdminApi("SAVE_SPONSOR", editingSponsor);
                  if (ok) setEditingSponsor(null);
                }}
                className="px-5 py-2 rounded-xl font-black btn-garden-vote cursor-pointer"
              >
                ບັນທຶກຜູ້ສະໜັບສະໜູນ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: VIEW BANK SLIP ==================== */}
      {viewingSlip && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200 my-6">
            <div className="flex items-center justify-between px-6 py-4 bg-[#240638] text-white">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-300" />
                <h3 className="font-black text-base">ກວດສອບໃບບິນໂອນເງິນ (Bank Slip)</h3>
              </div>
              <button
                onClick={() => setViewingSlip(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Full Image Preview */}
              <div className="rounded-2xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center max-h-[420px]">
                <img
                  src={viewingSlip.slip_image_url}
                  alt="Bank Slip"
                  className="w-full h-full object-contain max-h-[400px]"
                />
              </div>

              {/* Transaction Summary Card */}
              <div className="bg-[#fcfaff] border border-[#9333ea]/20 rounded-2xl p-4 text-xs space-y-2 text-[#240638]">
                <div className="flex justify-between">
                  <span className="text-[#644180]">ເລກອ້າງອີງທຸລະກຳ:</span>
                  <span className="font-mono font-bold text-[#520d7a]">{viewingSlip.payment_ref}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#644180]">ຜູ້ໂອນ:</span>
                  <span className="font-bold">{viewingSlip.voter_name} ({viewingSlip.voter_phone || "-"})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#644180]">ໂຫວດໃຫ້ນາງສາວ:</span>
                  <span className="font-bold logo-exact-bg text-white px-2 py-0.5 rounded text-[11px]">
                    {viewingSlip.contestant_code} • {viewingSlip.contestant_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#644180]">ຄະແນນທີ່ຈະເພີ່ມ:</span>
                  <span className="font-black text-[#520d7a] text-sm">+{viewingSlip.points_added.toLocaleString()} Votes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#644180]">ຍອດເງິນທີ່ໂອນ:</span>
                  <span className="font-black text-[#240638] text-sm">{viewingSlip.amount_lak.toLocaleString()} ກີບ</span>
                </div>
                {viewingSlip.cheer_message && (
                  <div className="pt-1 border-t border-gray-100 text-[#644180] italic">
                    &ldquo;{viewingSlip.cheer_message}&rdquo;
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                {viewingSlip.status !== "APPROVED" && (
                  <button
                    onClick={async () => {
                      await callAdminApi("APPROVE_TX", { id: viewingSlip.id });
                      setViewingSlip(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs cursor-pointer shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ອະນຸມັດ ແລະ ເພີ່ມຄະແນນ</span>
                  </button>
                )}
                {viewingSlip.status !== "REJECTED" && (
                  <button
                    onClick={async () => {
                      await callAdminApi("REJECT_TX", { id: viewingSlip.id });
                      setViewingSlip(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs cursor-pointer"
                  >
                    ປະຕິເສດ
                  </button>
                )}
                <button
                  onClick={() => setViewingSlip(null)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs cursor-pointer"
                >
                  ປິດ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: QUICK VOTE BOOST ==================== */}
      {quickVoteTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-amber-400 rounded-3xl max-w-sm w-full p-6 space-y-4 text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-black text-sm text-[#240638]">
                ເພີ່ມຄະແນນພິເສດໃຫ້ {quickVoteTarget.code}
              </h3>
              <button onClick={() => setQuickVoteTarget(null)} className="text-gray-500 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <div className="font-bold text-[#240638] text-sm">{quickVoteTarget.name}</div>
              <div className="text-[#644180]">
                ຄະແນນປະຈຸບັນ: {quickVoteTarget.total_votes.toLocaleString()} Votes
              </div>
            </div>

            <div>
              <label className="block text-[#644180] font-semibold mb-1">
                ຈຳນວນຄະແນນທີ່ຈະເພີ່ມ (Votes)
              </label>
              <input
                type="number"
                min={1}
                value={customVotePoints}
                onChange={(e) => setCustomVotePoints(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-[#520d7a] font-black text-base"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
              <button
                onClick={() => setQuickVoteTarget(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold cursor-pointer"
              >
                ຍົກເລີກ
              </button>
              <button
                onClick={async () => {
                  const ok = await callAdminApi("ADD_VOTES_CONTESTANT", {
                    id: quickVoteTarget.id,
                    votes: customVotePoints,
                  });
                  if (ok) setQuickVoteTarget(null);
                }}
                className="px-5 py-2 rounded-xl font-black btn-garden-vote cursor-pointer"
              >
                ຢືນຢັນເພີ່ມ +{customVotePoints} Votes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
