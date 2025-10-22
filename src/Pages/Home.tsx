import { useEffect, useMemo, useState } from "react";

// import MixChartHome from "../Components/MixChartHome";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import { api } from "../api";
import { ToastContainer, toast } from "react-toastify";
import AreaChart from "../Components/AreaChart";
import BarChart from "../Components/BarChart";

interface GlobalAlarm {
  _id?: string;
  gatewayId: string;
  gatewayName: string;
  timestamp: string;
  category: string;
  subcategory: string;
  value: number;
  priority: "High" | "Normal" | "Low";
}
interface Gateway {
  _id: string;
  gatewayId: string;
  gatewayName: string;
  location: string;
}
interface MeUser {
  name: string;
  email: string;
  role: "user" | "admin" | "superadmin";
  payment?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
type PurchaseState = "none" | "pending" | "rejected" | "approved";
interface PurchaseLite {
  _id: string;
  planName: string;
  price: number;
  duration: string;
  devices: number; // plan device limit
  status: "pending" | "approved" | "rejected";
  proofImageUrl?: string;
  createdAt: string;
  approvedAt?: string;
  expiresAt?: string;
}

const Home = () => {
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [alarms, setAlarms] = useState<GlobalAlarm[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [purchaseState, setPurchaseState] = useState<PurchaseState>("none");
  const [latestPurchase, setLatestPurchase] = useState<PurchaseLite | null>(null);

  const [me, setMe] = useState<MeUser | null>(null);
  const [metaLoading, setMetaLoading] = useState(true);

  const [activePlan, setActivePlan] = useState<PurchaseLite | null>(null);
  const [planLimit, setPlanLimit] = useState<number | null>(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  console.log(activePlan, loading)
  // -------------------- META LOAD (me + latest purchase any status) --------------------
  useEffect(() => {
    if (!token) return;
    (async () => {
      setMetaLoading(true);
      try {
        const meRes = await api.get("/api/me", { headers: { Authorization: `Bearer ${token}` } });
        const u: MeUser = meRes.data.user;
        setMe(u);

        if (u.role === "user" && !u.payment) {
          const pRes = await api.get("/api/purchases/mine", { params: { limit: 1, sort: "createdAt:desc" }, headers: { Authorization: `Bearer ${token}` } });
          const items: PurchaseLite[] = pRes.data.items || [];
          const latest = items[0] || null;
          setLatestPurchase(latest);
          if (!latest) setPurchaseState("none");
          else if (latest.status === "pending") setPurchaseState("pending");
          else if (latest.status === "rejected") setPurchaseState("rejected");
          else setPurchaseState("approved");
        } else {
          setPurchaseState("approved"); // paid or admin/superadmin
          setLatestPurchase(null);
        }
      } catch (err) {
        console.error("❌ Error loading /api/me or /api/purchases/mine:", err);
      } finally {
        setMetaLoading(false);
      }
    })();
  }, [token]);

  const gated = useMemo(() => !!me && me.role === "user" && !me.payment, [me]);

  // -------------------- Fetch Active Plan (only when not gated) --------------------
  useEffect(() => {
    if (!token || metaLoading || gated) return;
    (async () => {
      try {
        const res = await api.get("/api/purchases/mine", {
          params: { status: "approved", limit: 1, sort: "approvedAt:desc" },
          headers: { Authorization: `Bearer ${token}` },
        });
        const item: PurchaseLite | undefined = res.data.items?.[0];
        setActivePlan(item || null);
        setPlanLimit(item?.devices ?? null);
      } catch (e) {
        console.error("❌ Error loading active plan:", e);
      }
    })();
  }, [token, metaLoading, gated]);

  // -------------------- SOCKET (only when not gated) --------------------
  const tokenForSocket = !metaLoading && !gated ? (token || undefined) : undefined;
  const socket = useSocket(undefined, undefined, tokenForSocket);

  useEffect(() => {
    if (!tokenForSocket || !socket) return;
    const handler = (newAlarms: GlobalAlarm[]) => {
      setAlarms((prev) => {
        const merged = [...newAlarms, ...prev];
        const unique = merged.filter(
          (alarm, index, self) =>
            index ===
            self.findIndex(
              (a) =>
                a.gatewayName === alarm.gatewayName &&
                a.gatewayId === alarm.gatewayId &&
                a.timestamp === alarm.timestamp &&
                a.category === alarm.category &&
                a.subcategory === alarm.subcategory
            )
        );
        unique.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        return unique.slice(0, 20);
      });
    };
    socket.on("global-alarms", handler);
    return () => {
      socket.off("global-alarms", handler);
    };
  }, [socket, tokenForSocket]);

  // -------------------- Initial Alarms (only when not gated) --------------------
  useEffect(() => {
    if (!token || metaLoading || gated) return;
    const fetchInitialAlarms = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/alarm-records", {
          params: { page: 1, limit: 20 },
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlarms(res.data.data);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error("❌ Error fetching alarms:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialAlarms();
  }, [token, metaLoading, gated]);

  // -------------------- Gateways (only when not gated) --------------------
  useEffect(() => {
    if (!token || metaLoading || gated) return;
    api
      .get<Gateway[]>("/api/gateway", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setGateways(res.data))
      .catch(console.error);
  }, [token, metaLoading, gated]);

  // -------------------- Add Gateway Modal --------------------
  const [showModal, setShowModal] = useState(false);
  const [gatewayIdInput, setGatewayIdInput] = useState("");
  const [gatewayName, setGatewayName] = useState("");
  const [location, setLocation] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (showModal) {
      setGatewayIdInput("gw-" + Math.floor(Math.random() * 100000));
    }
  }, [showModal]);

  const used = gateways.length;
  const remaining = planLimit == null ? null : Math.max(planLimit - used, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (me?.role === "user" && planLimit != null && used >= planLimit) {
      toast.error(`Device limit exceeded (${used}/${planLimit}). Upgrade plan to add more.`);
      return;
    }
    try {
      await api.post(
        "/api/gateway",
        { gatewayId: gatewayIdInput, gatewayName, location },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      fetchGateways();
      setTimeout(() => {
        setShowModal(false);
        setGatewayName("");
        setLocation("");
        setSuccess(false);
      }, 1500);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "❌ Error creating gateway";
      toast.error(msg);
      console.error(msg, err);
    }
  };

  const fetchGateways = () => {
    api
      .get<Gateway[]>("/api/gateway", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setGateways(res.data))
      .catch(console.error);
  };

  const handleSelectGateway = (gateway: string) => {
    const params = new URLSearchParams();
    params.set("gateway", gateway);
    navigate(`/maindashboard?${params.toString()}`);
  };

  if (!token) return <div className="p-6 text-lg">⏳ Loading user info...</div>;
  if (metaLoading) return <div className="p-6 text-lg">Loading dashboard…</div>;

  // -------------------- GATED VIEW (payment pending / unpaid) --------------------
  if (!!me && me.role === "user" && !me.payment) {
    return (
      <div className="max-w-2xl mx-auto p-6 sm:p-8">
        {/* NONE */}
        {purchaseState === "none" && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 sm:p-7">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-2">
              No Payment Request Found
            </h2>
            <p className="text-blue-800 mb-4">
              No plan request has been submitted yet. Please select a plan and upload your payment proof to continue.
            </p>
            <button
              onClick={() => navigate("/pricing")}
              className="bg-primary text-white px-4 py-2 rounded-lg"
            >
              Choose a Plan
            </button>
            <p className="text-xs text-blue-700 mt-4">
              Once approved, the dashboard features will be enabled automatically.
            </p>
          </div>
        )}

        {/* PENDING */}
        {purchaseState === "pending" && latestPurchase && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 sm:p-7">
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-800 mb-2">
              Payment Verification Pending
            </h2>
            <p className="text-yellow-800 mb-3">
              Your plan request is currently under review. Dashboard features will remain temporarily disabled until approval.
            </p>
            <ul className="text-sm text-yellow-800 space-y-1 mb-4">
              <li><b>Plan:</b> {latestPurchase.planName}</li>
              <li><b>Price:</b> {latestPurchase.price} RS</li>
              <li><b>Duration:</b> {latestPurchase.duration}</li>
              <li><b>Submitted:</b> {new Date(latestPurchase.createdAt).toLocaleString()}</li>
            </ul>
            {latestPurchase.proofImageUrl && (
              <a
                href={latestPurchase.proofImageUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-blue-700 underline mb-2"
              >
                View uploaded proof
              </a>
            )}
            <div className="text-xs text-yellow-700">
              Note: Once our team approves your payment request, the features will appear here.
            </div>
          </div>
        )}

        {/* REJECTED */}
        {purchaseState === "rejected" && latestPurchase && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 sm:p-7">
            <h2 className="text-xl sm:text-2xl font-bold text-red-800 mb-2">
              Payment Request Rejected
            </h2>
            <p className="text-red-800 mb-3">
              Your previous request was rejected. Please review the details and resubmit.
            </p>
            <ul className="text-sm text-red-800 space-y-1 mb-4">
              <li><b>Plan:</b> {latestPurchase.planName}</li>
              <li><b>Price:</b> {latestPurchase.price} RS</li>
              <li><b>Duration:</b> {latestPurchase.duration}</li>
              <li><b>Submitted:</b> {new Date(latestPurchase.createdAt).toLocaleString()}</li>
            </ul>
            <button
              onClick={() => navigate("/pricing")}
              className="bg-primary text-white px-4 py-2 rounded-lg"
            >
              Submit New Request
            </button>
          </div>
        )}
        <ToastContainer position="top-right" />
      </div>
    );
  }

  // -------------------- NORMAL DASHBOARD (paid or admin/superadmin) --------------------
  return (
    <div className="mx-auto w-full min-h-screen bg-[#001a33] px-3 sm:px-4 md:px-6 lg:px-8 py-4 pb-10">
      <div className=" flex justify-between items-center ">
        <div>
          <h1 className="text-3xl text-white font-semibold">Energy Monitoring Dashboard</h1>
          <div className="text-gray-500 font-semibold">Real-time . Historical . Predective</div>
        </div>
        <div>
          <button className="relative" >
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={open}
              className="flex items-center gap-1 rounded-xl px-2 py-2 text-gray-200 hover:bg-[#02396c] hover:text-secondary transition"
            >
              Dropdown
              <svg
                viewBox="0 0 24 24"
                className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </button>

            <div
              role="menu"
              className={[
                "absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-gray-200 bg-white shadow-xl",
                "transition transform",
                open
                  ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none",
                "z-50 overflow-hidden"
              ].join(" ")}
            >
              <div
                role="menuitem"
                className="block px-4 py-2 text-gray-200 bg-[#001a33] hover:bg-[#02396c] hover:text-secondary"
              >
                1 day
              </div>
              <div
                role="menuitem"
                className="block px-4 py-2  text-gray-200 bg-[#001a33] hover:bg-[#02396c] hover:text-secondary"
              >
                1 week
              </div>
              <div
                role="menuitem"
                className="block px-4 py-2  text-gray-200 bg-[#001a33] hover:bg-[#02396c] hover:text-secondary"
              >
                1 Month
              </div>

            </div>
          </button>
          {/* <button className="text-gray-400 border border-gray-400 p-3 rounded-lg">24 hours</button> */}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4  mb-8 mt-4">
        <div className=" px-2 py-4 rounded-md   bg-gradient-to-r from-[#001a33] to-[#02396c] shadow-md ">
          <span className="text-gray-400 text-sm">Total Load</span>
          <h2 className="text-2xl font-bold text-white">337.3KW</h2>
          <span className="text-xs text-gray-400">Aggregated in real-time</span>
        </div>
        <div className=" px-2 py-4 rounded-md   bg-gradient-to-r from-[#001a33] to-[#02396c]  shadow-md ">
          <span className="text-gray-400 text-sm">Peak Load</span>
          <h2 className="text-2xl font-bold text-white">67KW</h2>
          <span className="text-xs text-gray-400">Aggregated in real-time</span>
        </div>
        <div className=" px-2 py-4 rounded-md   bg-gradient-to-r from-[#001a33] to-[#02396c]  shadow-md ">
          <span className="text-gray-400 text-sm">Avg Voltage</span>
          <h2 className="text-2xl font-bold text-white">25KW</h2>
          <span className="text-xs text-gray-400">Aggregated in real-time</span>
        </div>
        <div className=" px-2 py-4 rounded-md   bg-gradient-to-r from-[#001a33] to-[#02396c]  shadow-md ">
          <span className="text-gray-400 text-sm">Avg Current</span>
          <h2 className="text-2xl font-bold text-white">467.3KW</h2>
          <span className="text-xs text-gray-400">Aggregated in real-time</span>
        </div>
        <div className=" px-2 py-4 rounded-md   bg-gradient-to-r from-[#001a33] to-[#02396c]  shadow-md ">
          <span className="text-gray-400 text-sm">Total Load</span>
          <h2 className="text-2xl font-bold text-white">37.3KW</h2>
          <span className="text-xs text-gray-400">Aggregated in real-time</span>
        </div>
        <div className=" px-2 py-4 rounded-md   bg-gradient-to-r from-[#001a33] to-[#02396c] shadow-md ">
          <span className="text-gray-400 text-sm">Peak Load</span>
          <h2 className="text-2xl font-bold text-white">337.3KW</h2>
          <span className="text-xs text-gray-400">Aggregated in real-time</span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 md:gap-3">
        {/* RIGHT: Sidebar (on desktop sits right; on mobile, appears above) */}
        <aside className="order-1 md:order-1 bg-gradient-to-r from-[#001a33] to-[#02396c] rounded-md px-1 shadow-md w-full md:w-[28%] lg:w-[24%] xl:w-[20%]  ">
          <div className="md:sticky md:top-4 ">
            <div className="text-center">
              <div className="flex justify-between items-end p-2">
                <h2 className="text-xl text-white sm:text-2xl font-semibold  ">Devices</h2>

                <button
                  className="  bg-primary text-white rounded-full p-1 hover:bg-blue-950  disabled:opacity-60"
                  onClick={() => setShowModal(true)}
                  disabled={me?.role === "user" && planLimit != null && remaining === 0}
                  title={
                    me?.role === "user" && planLimit != null && remaining === 0
                      ? "Device limit reached"
                      : "Add a new device"
                  }
                >
                  ➕
                </button>
              </div>

              {/* Usage chips */}
              <div className="mt-3 grid grid-cols-3 gap-2 max-w-xs mx-auto text-xs sm:text-sm text-gray-200">
                <div className="px-1 py-1 rounded  shadow text-center">
                  <span>Used:</span> {used}
                </div>
                <div className="px-1 py-1 rounded  shadow text-center">
                  <span>Limit:</span> {planLimit ?? "-"}
                </div>
                <div className="px-1 py-1 rounded  shadow text-center">
                  <span>Remain:</span> {remaining ?? "-"}
                </div>
              </div>


              <div className="flex my-3 items-center bg-gradient-to-tr from-[#001a33] to-[#02396c] rounded-lg  shadow-lg p-1">
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-grow px-4 py-2 text-white placeholder-gray-300 bg-transparent border-none rounded-full focus:outline-none"
                />
                <button className="px-4 py-2 text-white font-semibold rounded-full hover:bg-white/20 transition">
                  <svg xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5">
                    <path stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                  </svg>
                </button>
              </div>

            </div>

            <div className="mt-2 h-[90vh]  overflow-y-scroll scrollbar-hide">
              {gateways.map((gateway) => (
                <button
                  key={gateway._id}
                  onClick={() => handleSelectGateway(gateway.gatewayId)}
                  className="w-full py-3 px-4 text-left text-xl text-gray-300 hover:bg-[#001a33] "
                >
                  <div className="font-semibold">{gateway.gatewayName}</div>
                  {/* <div className="text-xs opacity-80">ID: {gateway.gatewayId}</div> */}
                </button>

              ))}

            </div>
          </div>
        </aside>

        {/* LEFT: Main Content on mobile, but on desktop it appears on left (order-1) */}
        <div className="order-2 md:order-2 bg-[#02396c] w-full md:flex-1  ">
          <div className=" p-6  bg-[#02396c]">
            <h2 className="text-lg font-semibold mb-4 text-white">System Topology</h2>
            <div className="flex justify-center">
              <svg width="100%" height="300" viewBox="0 0 600 300">
                {/* Power Bus */}
                <line
                  x1="80"
                  y1="150"
                  x2="520"
                  y2="150"
                  stroke="#38bdf8"
                  strokeWidth="4"
                />
                <rect
                  x="270"
                  y="135"
                  width="70"
                  height="25"
                  rx="6"
                  fill="#0B1B3A"
                  stroke="#38bdf8"
                  strokeWidth="2"
                />
                <text x="280" y="152" fill="white" fontSize="12" >
                  Power-Bus
                </text>

                {/* Grid */}
                <line
                  x1="140"
                  y1="100"
                  x2="140"
                  y2="150"
                  stroke="#38bdf8"
                  strokeWidth="3"
                />
                <text x="115" y="85" fill="white" fontSize="14">⚡ Grid</text>
                <text x="115" y="100" fill="#22c55e" fontSize="12">Connected</text>

                {/* Solar */}
                <line
                  x1="305"
                  y1="100"
                  x2="305"
                  y2="150"
                  stroke="#38bdf8"
                  strokeWidth="3"
                />
                <text x="285" y="85" fill="white" fontSize="14">☀ Solar</text>
                <text x="290" y="100" fill="#facc15" fontSize="12">Active</text>

                {/* Wind */}
                <line
                  x1="460"
                  y1="100"
                  x2="460"
                  y2="150"
                  stroke="#38bdf8"
                  strokeWidth="3"
                />
                <text x="440" y="85" fill="white" fontSize="14">🌬 Wind</text>
                <text x="445" y="100" fill="#3b82f6" fontSize="12">Active</text>

                {/* Battery */}
                <line
                  x1="200"
                  y1="150"
                  x2="200"
                  y2="210"
                  stroke="#38bdf8"
                  strokeWidth="3"
                />
                <text x="180" y="230" fill="white" fontSize="14">🔋 Battery</text>
                <text x="185" y="245" fill="#a3e635" fontSize="12">82%</text>

                {/* EV Charger */}
                <line
                  x1="305"
                  y1="150"
                  x2="305"
                  y2="210"
                  stroke="#38bdf8"
                  strokeWidth="3"
                />
                <text x="260" y="230" fill="white" fontSize="14">🚗 EV Charger</text>
                <text x="275" y="245" fill="#e11d48" fontSize="12">Running</text>

                {/* Load */}
                <line
                  x1="410"
                  y1="150"
                  x2="410"
                  y2="210"
                  stroke="#38bdf8"
                  strokeWidth="3"
                />
                <text x="390" y="230" fill="white" fontSize="14">⚡ Load</text>
                <text x="380" y="245" fill="#f97316" fontSize="12">938 kW</text>
              </svg>
            </div>
          </div>
          <div className="bg-[#001a33] pt-3">
            <div className="px-3 py-3 bg-[#02396c] " >
              <h2 className="text-white text-2xl font-semibold">Alarms</h2>
              <div className="px-3 sm:px-4 pb-4 max-h-[48vh] min-h-70 overflow-y-auto overflow-x-auto scrollbar-hide">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 bg-gradient-to-r  bg-[#02396c] z-10">
                    <tr className="text-left text-gray-400 text-xs sm:text-sm">
                      <th className="py-2">Gateway</th>
                      <th className="py-2">Time</th>
                      <th className="py-2">Category</th>
                      <th className="py-2">Subcategory</th>
                      <th className="py-2">Value</th>
                      <th className="py-2">Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {alarms.map((alarm, i) => (
                      <tr
                        key={`${alarm.gatewayName}-${alarm.timestamp}-${alarm.category}-${alarm.subcategory}-${i}`}
                        className="text-xs sm:text-sm font-semibold text-gray-300"
                      >
                        <td className="py-3">{alarm.gatewayName}</td>
                        <td className="py-3">
                          {new Date(alarm.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="py-3">{alarm.category}</td>
                        <td className="py-3">{alarm.subcategory}</td>
                        <td className="py-3">{alarm.value}</td>
                        <td className="py-3">
                          {alarm.priority === "High" && (
                            <span className="px-3 py-1 text-xs font-medium text-red-100 bg-red-800 rounded-full">
                              Critical
                            </span>
                          )}
                          {alarm.priority === "Normal" && (
                            <span className="px-3 py-1 text-xs font-medium text-green-100 bg-green-800 rounded-full">
                              Normal
                            </span>
                          )}
                          {alarm.priority === "Low" && (
                            <span className="px-3 py-1 text-xs font-medium text-yellow-100 bg-yellow-600 rounded-full">
                              Warning
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-2 text-sm">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 rounded border bg-[#001a33] text-gray-300 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-gray-300">Page {page} of {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 rounded border bg-[#001a33] text-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="order-3 md:order-3   bg-gradient-to-r from-[#02396c] to-[#001a33]  lg:w-[28%] md:w-[35%] sm:w-[100%]  ">
          <div className=" bg-[#001a33] pb-3 ">
            <div className="bg-gradient-to-r from-[#02396c] to-[#001a33]">
              <AreaChart />
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#02396c] to-[#001a33] ">
            <BarChart />
          </div>
        </div>

      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Gateway</h3>

            {success ? (
              <div className="text-green-600 font-semibold">
                ✅ Gateway Added! ID: <strong>{gatewayIdInput}</strong>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-medium">Gateway ID</label>
                  <input
                    type="text"
                    value={gatewayIdInput}
                    readOnly
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block font-medium">Name</label>
                  <input
                    type="text"
                    value={gatewayName}
                    onChange={(e) => setGatewayName(e.target.value)}
                    required
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block font-medium">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-400 text-white rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <ToastContainer position="top-right" />
    </div>
  );
};

export default Home;