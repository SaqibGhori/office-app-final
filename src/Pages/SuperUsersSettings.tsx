import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";

type UserDoc = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "superadmin";
  payment: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type Purchase = {
  _id: string;
  planName: string;
  price: number;
  duration: string;
  devices: number;
  proofImageUrl?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export default function SuperUsersSettings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // editable copies
  const [role, setRole] = useState<UserDoc["role"]>("user");
  const [payment, setPayment] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const pending = useMemo(() => purchases.find(p => p.status === "pending"), [purchases]);

  const token = localStorage.getItem("token");

  const load = async () => {
    try {
      setLoading(true);
      setErr(null);
      const { data } = await api.get(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data.user);
      setRole(data.user.role);
      setPayment(!!data.user.payment);
      setIsActive(!!data.user.isActive);

      const p = await api.get(`/api/admin/users/${id}/purchases`, {
        params: { status: "pending" },
        headers: { Authorization: `Bearer ${token}` },
      });
      setPurchases(p.data.purchases || []);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e.message || "Failed to load user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const saveBasics = async () => {
    try {
      const { data } = await api.patch(`/api/admin/users/${id}`, { role, payment, isActive }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data.user);
      alert("User updated");
    } catch (e: any) {
      alert(e?.response?.data?.message || e.message || "Update failed");
    }
  };

  const approvePending = async () => {
    if (!pending) return;
    try {
      await api.patch(`/api/admin/purchases/${pending._id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // refresh
      await load();
      alert("Payment approved and user activated.");
    } catch (e: any) {
      alert(e?.response?.data?.message || e.message || "Approval failed");
    }
  };

  if (loading) return <div className="p-8">Loading…</div>;
  if (err) return <div className="p-8 text-red-600">{err}</div>;
  if (!user) return <div className="p-8">User not found</div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="border px-3 py-1 rounded">← Back</button>
        <h1 className="text-2xl font-bold">User Settings</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Basic info */}
        <div className="bg-white rounded-xl shadow p-5 space-y-4">
          <div>
            <div className="text-sm text-gray-500">Name</div>
            <div className="font-medium">{user.name}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Email</div>
            <div className="font-mono">{user.email}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Role</label>
              <select value={role} onChange={e => setRole(e.target.value as any)} className="border rounded p-2 w-full">
                <option value="user">user</option>
                <option value="admin">admin</option>
                <option value="superadmin">superadmin</option>
              </select>
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input id="payment" type="checkbox" checked={payment} onChange={e => setPayment(e.target.checked)} />
              <label htmlFor="payment">Payment Approved</label>
            </div>
            <div className="flex items-center gap-2">
              <input id="active" type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
              <label htmlFor="active">Active User</label>
            </div>
          </div>

          <button onClick={saveBasics} className="bg-primary text-white px-4 py-2 rounded-lg">
            Save Changes
          </button>

          <div className="text-xs text-gray-500">
            Created: {new Date(user.createdAt).toLocaleString()} • Updated: {new Date(user.updatedAt).toLocaleString()}
          </div>
        </div>

        {/* Right: Pending Payment Proof */}
        <div className="bg-white rounded-xl shadow p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Payment Proof</h2>
            {pending ? (
              <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">Pending</span>
            ) : (
              <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">No pending</span>
            )}
          </div>

          {pending ? (
            <>
              {pending?.proofImageUrl ? (
                <a href={pending.proofImageUrl} target="_blank" rel="noreferrer" className="block">
                  <img
                    src={pending.proofImageUrl}
                    alt="Payment Proof"
                    className="w-full max-h-72 object-contain border rounded"
                  />
                </a>
              ) : (
                <div className="text-sm text-gray-500">No image URL</div>
              )}

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><b>Plan:</b> {pending.planName}</div>
                <div><b>Price:</b> {pending.price} RS</div>
                <div><b>Duration:</b> {pending.duration}</div>
                <div><b>Devices:</b> {pending.devices}</div>
                <div className="col-span-2 text-gray-500">
                  Submitted: {new Date(pending.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={approvePending} className="bg-green-600 text-white px-4 py-2 rounded-lg">
                  Approve & Activate
                </button>
                {/* (optional) Reject button:
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg">Reject</button>
                */}
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-500">No pending purchases for this user.</div>
          )}
        </div>
      </div>
    </div>
  );
}
