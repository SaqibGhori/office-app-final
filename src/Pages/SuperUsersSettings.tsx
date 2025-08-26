import { useEffect, useMemo, useState } from "react";
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
  approvedAt?: string;
  expiresAt?: string;
};

export default function SuperUsersSettings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // editable copies
  const [role, setRole] = useState<UserDoc["role"]>("user");

  // purchases
  const [pending, setPending] = useState<Purchase | null>(null);
  const [current, setCurrent] = useState<Purchase | null>(null); // last approved

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

      // pending (limit 1)
      const p = await api.get(`/api/admin/users/${id}/purchases`, {
        params: { status: "pending", limit: 1 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setPending(p.data.purchases?.[0] || null);

      // latest approved (limit 1)
      const a = await api.get(`/api/admin/users/${id}/purchases`, {
        params: { status: "approved", limit: 1 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrent(a.data.purchases?.[0] || null);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e.message || "Failed to load user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const saveRole = async () => {
    try {
      const { data } = await api.patch(`/api/admin/users/${id}`, { role }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data.user);
      alert("Role updated");
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
      await load(); // refresh user + purchases
      alert("Payment approved and user activated.");
    } catch (e: any) {
      alert(e?.response?.data?.message || e.message || "Approval failed");
    }
  };

  const daysLeft = useMemo(() => {
    if (!current?.expiresAt) return null;
    const ms = new Date(current.expiresAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  }, [current?.expiresAt]);

  if (loading) return <div className="p-8">Loading…</div>;
  if (err) return <div className="p-8 text-red-600">{err}</div>;
  if (!user) return <div className="p-8">User not found</div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="border px-3 py-1 rounded">← Back</button>
        <h1 className="text-2xl font-bold">User Settings</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Basic info (role only) */}
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
          </div>

          <button onClick={saveRole} className="bg-primary text-white px-4 py-2 rounded-lg">
            Save Role
          </button>

          <div className="text-xs text-gray-500">
            Created: {new Date(user.createdAt).toLocaleString()} • Updated: {new Date(user.updatedAt).toLocaleString()}
          </div>
        </div>

        {/* Right: Pending Payment Proof */}
        <div className="bg-white rounded-xl shadow p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Pending Payment Proof</h2>
            {pending ? (
              <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">Pending</span>
            ) : (
              <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">None</span>
            )}
          </div>

          {pending ? (
            <>
              {pending.proofImageUrl ? (
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
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-500">No pending purchases for this user.</div>
          )}
        </div>

        {/* Full width: Current Approved Plan (proof + expiry) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Current Plan</h2>
            {current ? (
              <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">Active</span>
            ) : (
              <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">No active plan</span>
            )}
          </div>

          {!current ? (
            <div className="text-sm text-gray-500">User has no approved plan yet.</div>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div><b>Plan:</b> {current.planName}</div>
                <div><b>Price:</b> {current.price} RS</div>
                <div><b>Duration:</b> {current.duration}</div>
                <div><b>Devices:</b> {current.devices}</div>
                <div><b>Approved:</b> {current.approvedAt ? new Date(current.approvedAt).toLocaleString() : '-'}</div>
                <div><b>Expires:</b> {current.expiresAt ? new Date(current.expiresAt).toLocaleString() : '-'}</div>
                <div><b>Time left:</b> {current.expiresAt ? `${daysLeft} day(s)` : '-'}</div>
              </div>

              {current.proofImageUrl && (
                <div className="mt-3">
                  <div className="text-sm font-medium mb-1">Proof (kept for records)</div>
                  <a href={current.proofImageUrl} target="_blank" rel="noreferrer" className="inline-block">
                    <img
                      src={current.proofImageUrl}
                      alt="Approved Proof"
                      className="max-h-64 border rounded object-contain"
                    />
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
