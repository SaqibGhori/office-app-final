import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { toast } from "react-toastify";

type Gateway = {
  _id: string;
  gatewayId: string;
  name: string;
  location: string;
};

export default function DeviceSettings() {
  const [items, setItems] = useState<Gateway[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ name: string; location: string }>({ name: "", location: "" });
  const [busyId, setBusyId] = useState<string | null>(null);

  const token = useMemo(() => localStorage.getItem("token"), []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get<Gateway[]>("/api/gateway", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load gateways");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (g: Gateway) => {
    setEditingId(g._id);
    setDraft({ name: g.name ?? "", location: g.location ?? "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({ name: "", location: "" });
  };

  const save = async (id: string) => {
    try {
      setBusyId(id);
      const payload: any = {};
      if (draft.name?.trim()) payload.name = draft.name.trim();
      if (draft.location?.trim()) payload.location = draft.location.trim();

      if (!payload.name && !payload.location) {
        toast.info("No changes to save");
        return;
      }

      const res = await api.patch<Gateway>(`/api/gateway/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setItems((prev) => prev.map((x) => (x._id === id ? res.data : x)));
      toast.success("Gateway updated");
      cancelEdit();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this gateway? This cannot be undone.")) return;
    try {
      setBusyId(id);
      await api.delete(`/api/gateway/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) => prev.filter((x) => x._id !== id));
      toast.success("Gateway deleted");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    } finally {
      setBusyId(null);
    }
  };
// import React from 'react'

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Device Settings</h1>

      {loading ? (
        <div className="animate-pulse p-4 bg-gray-100 rounded">Loading gateways…</div>
      ) : items.length === 0 ? (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
          No gateways found. Create one from your dashboard.
        </div>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3">Gateway ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Location</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((g) => {
                const isEditing = editingId === g._id;
                return (
                  <tr key={g._id} className="border-t">
                    <td className="p-3 font-mono">{g.gatewayId}</td>
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          className="border rounded px-2 py-1 w-64"
                          value={draft.name}
                          onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                        />
                      ) : (
                        g.name
                      )}
                    </td>
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          className="border rounded px-2 py-1 w-64"
                          value={draft.location}
                          onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
                        />
                      ) : (
                        g.location
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2 justify-end">
                        {!isEditing ? (
                          <>
                            <button
                              className="px-3 py-1 rounded bg-blue-600 text-white"
                              onClick={() => startEdit(g)}
                              disabled={busyId === g._id}
                            >
                              Rename
                            </button>
                            <button
                              className="px-3 py-1 rounded bg-red-600 text-white"
                              onClick={() => remove(g._id)}
                              disabled={busyId === g._id}
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="px-3 py-1 rounded bg-gray-200"
                              onClick={cancelEdit}
                              disabled={busyId === g._id}
                            >
                              Cancel
                            </button>
                            <button
                              className="px-3 py-1 rounded bg-green-600 text-white"
                              onClick={() => save(g._id)}
                              disabled={busyId === g._id}
                            >
                              Save
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
