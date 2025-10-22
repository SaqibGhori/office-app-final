import { useEffect, useMemo, useState } from "react";
import { api } from "../api"; // <- tumhara axios instance
import { Link } from "react-router-dom";

type UserRow = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "superadmin";
  payment?: boolean;
  isActive?: boolean;
  createdAt: string;
};

export default function SuperHome() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // query state
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string>("");
  const [payment, setPayment] = useState<string>("");   // "", "true", "false"
  const [isActive, setIsActive] = useState<string>(""); // "", "true", "false"
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("createdAt:desc");   // field:dir

  const [total, setTotal] = useState(0);
  const pages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setErr(null);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const { data } = await api.get("/api/admin/users", {
        params: {
          search: search || undefined,
          role: role || undefined,
          payment: payment || undefined,
          isActive: isActive || undefined,
          page,
          limit,
          sort,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      setRows(data.items || []);
      setTotal(data.total || 0);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, sort]); // search/filters pe "Apply" button se fetch karenge

  const applyFilters = () => {
    setPage(1);
    fetchUsers();
  };

  const toggleSort = (field: string) => {
    const [f, d] = sort.split(":");
    if (f === field) {
      setSort(`${field}:${d === "asc" ? "desc" : "asc"}`);
    } else {
      setSort(`${field}:asc`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Superadmin Dashboard</h1>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4 mb-4 grid grid-cols-1 md:grid-cols-5 gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or email..."
          className="border rounded-lg p-2"
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} className="border rounded-lg p-2">
          <option value="">All roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="superadmin">Superadmin</option>
        </select>
        <select value={payment} onChange={(e) => setPayment(e.target.value)} className="border rounded-lg p-2">
          <option value="">Payment: All</option>
          <option value="true">Paid</option>
          <option value="false">Unpaid</option>
        </select>
        <select value={isActive} onChange={(e) => setIsActive(e.target.value)} className="border rounded-lg p-2">
          <option value="">Active: All</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <button
          onClick={applyFilters}
          className="bg-primary text-white rounded-lg px-4 py-2"
        >
          Apply
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <Th label="Name" field="name" sort={sort} onSort={toggleSort} />
              <Th label="Email" field="email" sort={sort} onSort={toggleSort} />
              <Th label="Role" field="role" sort={sort} onSort={toggleSort} />
              <Th label="Payment" field="payment" sort={sort} onSort={toggleSort} />
              <Th label="Active" field="isActive" sort={sort} onSort={toggleSort} />
              <Th label="Created" field="createdAt" sort={sort} onSort={toggleSort} />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-6 text-center">Loading…</td></tr>
            ) : err ? (
              <tr><td colSpan={6} className="p-6 text-center text-red-600">{err}</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center">No users found</td></tr>
            ) : (
              rows.map(u => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">
                    <Link to={`/super/users/${u._id}`} className="text-blue-600 hover:underline">
                      {u.name}
                    </Link>
                  </td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 uppercase">{u.role}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${u.payment ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {u.payment ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3">{new Date(u.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center gap-3">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page <= 1 || loading}
        >
          Prev
        </button>
        <span className="text-sm">
          Page <b>{page}</b> of <b>{pages}</b> — Total <b>{total}</b>
        </span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage(p => Math.min(pages, p + 1))}
          disabled={page >= pages || loading}
        >
          Next
        </button>
        <select
          value={limit}
          onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
          className="ml-auto border rounded p-1"
        >
          {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n}/page</option>)}
        </select>
      </div>
    </div>
  );
}

function Th({ label, field, sort, onSort }: { label: string; field: string; sort: string; onSort: (f: string) => void }) {
  const [f, d] = sort.split(':');
  const active = f === field;
  return (
    <th className="p-3 cursor-pointer select-none" onClick={() => onSort(field)}>
      <span className="inline-flex items-center gap-1">
        {label}
        <span className={`text-xs ${active ? 'opacity-100' : 'opacity-30'}`}>{active ? (d === 'asc' ? '▲' : '▼') : '↕'}</span>
      </span>
    </th>
  );
}
