import { useEffect, useMemo, useState } from "react";
import MixChartHome from "../Components/MixChartHome";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import { api } from "../api";
import { ToastContainer, toast } from "react-toastify";
// (global css import ideally app root me ho)
// import "react-toastify/dist/ReactToastify.css";

interface GlobalAlarm {
  _id?: string;
  gatewayId: string;
  timestamp: string;
  category: string;
  subcategory: string;
  value: number;
  priority: "High" | "Normal" | "Low";
}
interface Gateway {
  _id: string;
  gatewayId: string;
  name: string;
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
  devices: number; // <- plan device limit
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

  const [purchaseState, setPurchaseState] = useState<PurchaseState>("none");
  const [latestPurchase, setLatestPurchase] = useState<PurchaseLite | null>(null);

console.log(loading)

  // User meta
  const [me, setMe] = useState<MeUser | null>(null);
  const [metaLoading, setMetaLoading] = useState(true);

  // Active (approved) plan (for limit)
  const [activePlan, setActivePlan] = useState<PurchaseLite | null>(null);
  const [planLimit, setPlanLimit] = useState<number | null>(null);

console.log(activePlan)

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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
          // unpaid: show latest request state
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

  // “Gated” if: normal user & unpaid
  const gated = useMemo(
    () => !!me && me.role === "user" && !me.payment,
    [me]
  );

  // -------------------- Fetch Active Plan (only when not gated) --------------------
  useEffect(() => {
    if (!token || metaLoading || gated) return;
    (async () => {
      try {
        // latest approved purchase (has devices limit)
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
  const tokenForSocket =
    !metaLoading && !gated ? (token || undefined) : undefined;
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
                a.gatewayId === alarm.gatewayId &&
                a.timestamp === alarm.timestamp &&
                a.category === alarm.category &&
                a.subcategory === alarm.subcategory
            )
        );
        unique.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
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
  const [name, setName] = useState("");
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

    // Frontend guard: if user & has a planLimit
    if (me?.role === "user" && planLimit != null && used >= planLimit) {
      toast.error(`Device limit exceeded (${used}/${planLimit}). Upgrade plan to add more.`);
      return;
    }

    try {
      await api.post(
        "/api/gateway",
        { gatewayId: gatewayIdInput, name, location },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      fetchGateways();
      setTimeout(() => {
        setShowModal(false);
        setName("");
        setLocation("");
        setSuccess(false);
      }, 1500);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "❌ Error creating gateway";
      toast.error(msg);
      console.error(msg, err);
    }
  };
console.log("test")
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
      <div className="max-w-2xl mx-auto p-8">
        {/* NONE */}
        {purchaseState === "none" && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-2">
              No Payment Request Found
            </h2>
            <p className="text-blue-800 mb-4">
              Aapne abhi tak koi plan request submit nahi ki. Kripya plan select karke
              payment proof upload karein.
            </p>
            <button
              onClick={() => navigate("/pricing")}
              className="bg-primary text-white px-4 py-2 rounded-lg"
            >
              Choose a Plan
            </button>
            <p className="text-xs text-blue-700 mt-4">
              Approval ke baad dashboard features auto-enable ho jayenge.
            </p>
          </div>
        )}

        {/* PENDING */}
        {purchaseState === "pending" && latestPurchase && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-yellow-800 mb-2">
              Payment Verification Pending
            </h2>
            <p className="text-yellow-800 mb-3">
              Aapki plan request review me hai. Approval tak dashboard features temporarily band rahenge.
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
              Note: Jaise hi Superadmin approve karega, features yahan visible ho jayenge.
            </div>
          </div>
        )}

        {/* REJECTED */}
        {purchaseState === "rejected" && latestPurchase && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-red-800 mb-2">
              Payment Request Rejected
            </h2>
            <p className="text-red-800 mb-3">
              Aapki last request reject ho gayi. Kripya details verify karke dobara submit karein.
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
    <div className="mx-auto flex bg-secondary">
      {/* RIGHT Sidebar */}
      <div className="w-[20%] pb-5 text-center">
        <h2 className="text-2xl font-bold mt-4">Gateways</h2>

        {/* Usage chips */}
        <div className="flex flex-col items-center gap-1 text-sm my-2">
          <div className="px-2 py-1 rounded bg-white shadow">
            <b>Used:</b> {used}
          </div>
          <div className="px-2 py-1 rounded bg-white shadow">
            <b>Limit:</b> {planLimit ?? "-"}
          </div>
          <div className="px-2 py-1 rounded bg-white shadow">
            <b>Remaining:</b> {remaining ?? "-"}
          </div>
        </div>

        <button
          className="py-2 px-6 bg-primary text-white rounded hover:bg-blue-950 my-3 disabled:opacity-60"
          onClick={() => setShowModal(true)}
          disabled={me?.role === "user" && planLimit != null && remaining === 0}
          title={
            me?.role === "user" && planLimit != null && remaining === 0
              ? "Device limit reached"
              : "Add a new device"
          }
        >
          ➕ Add Device
        </button>

        {gateways.map((gateway) => (
          <button
            key={gateway._id}
            onClick={() => handleSelectGateway(gateway.gatewayId)}
            className="py-3 px-6 mx-auto border w-40 rounded-lg bg-gray-800 text-white hover:bg-gray-600 my-2 block text-left"
          >
            <div className="font-bold">{gateway.name}</div>
          </button>
        ))}
      </div>

      {/* LEFT Side */}
      <div className="w-[80%]">
        <div className="bg-white mb-4">
          <MixChartHome />
        </div>

        <div className="bg-white min-h-80">
          <h2 className="text-xl font-bold p-3">Live + Saved Alarms</h2>

          <div className="overflow-x-auto max-h-[300px] overflow-y-auto p-4">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-200 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left">Gateway</th>
                  <th className="px-3 py-2 text-left">Time</th>
                  <th className="px-3 py-2 text-left">Category</th>
                  <th className="px-3 py-2 text-left">Subcategory</th>
                  <th className="px-3 py-2 text-left">Value</th>
                  <th className="px-3 py-2 text-left">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {alarms.map((alarm, i) => (
                  <tr
                    key={`${alarm.timestamp}-${alarm.category}-${alarm.subcategory}-${i}`}
                    className={
                      alarm.priority === "High"
                        ? "bg-red-200"
                        : alarm.priority === "Normal"
                        ? "bg-green-200"
                        : "bg-blue-200"
                    }
                  >
                    <td className="px-3 py-2 font-semibold">{alarm.gatewayId}</td>
                    <td className="px-3 py-2">
                      {new Date(alarm.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-3 py-2">{alarm.category}</td>
                    <td className="px-3 py-2">{alarm.subcategory}</td>
                    <td className="px-3 py-2">{alarm.value}</td>
                    <td
                      className={`px-3 py-2 font-semibold ${
                        alarm.priority === "High"
                          ? "text-red-600"
                          : alarm.priority === "Normal"
                          ? "text-green-700"
                          : "text-blue-600"
                      }`}
                    >
                      {alarm.priority}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
