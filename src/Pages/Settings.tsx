// src/pages/Settings.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

interface AlarmSetting {
    _id?: string;
    gatewayId: string;
    category: string;
    subcategory: string;
    high?: number;
    low?: number;
    priority: "High" | "Medium" | "Low";
    message: string;
}

export default function Settings() {
    const { search } = useLocation();
    const gatewayId = new URLSearchParams(search).get("gateway")!;

    const [settings, setSettings] = useState<AlarmSetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);

    // 1️⃣ Pehli DB se load karo
    useEffect(() => {
        setLoading(true);
        axios
            .get<AlarmSetting[]>("http://localhost:3000/api/alarm-settings", {
                params: { gatewayId },
            })
            .then(res => {
                if (res.data.length) {
                    // agar DB mein hai, to woh settings le lo
                    setSettings(res.data);
                    setEditMode(false);
                } else {
                    // DB empty: ab reading dynamic se categories la kar blank templates banao
                    axios
                        .get<{ data: any[] }>(
                            "http://localhost:3000/api/readingsdynamic",
                            { params: { gatewayId, limit: 1, page: 1 } }
                        )
                        .then(r2 => {
                            const rd = r2.data.data[0]?.data || {};
                            const defs: AlarmSetting[] = [];
                            Object.entries(rd).forEach(([cat, subObj]) => {
                                Object.keys(subObj as Record<string, number>).forEach(sub => {
                                    defs.push({
                                        gatewayId,
                                        category: cat,
                                        subcategory: sub,
                                        high: undefined,
                                        low: undefined,
                                        priority: "Medium",
                                        message: "Medium level reached",
                                    });
                                });
                            });
                            setSettings(defs);
                            setEditMode(true);
                        });
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [gatewayId]);

    // 2️⃣ Field update handler
    const updateField = (
        idx: number,
        field: keyof Pick<AlarmSetting, "high" | "low" | "priority">,
        val: string
    ) => {
        setSettings(prev => {
            const cp = [...prev];
            const s = { ...cp[idx] };
            if (field === "priority") {
                s.priority = val as any;
                s.message = val === "High"
                    ? "High level reached"
                    : val === "Medium"
                        ? "Medium level reached"
                        : "Low level reached";
            } else {
                s[field] = Number(val);
            }
            cp[idx] = s;
            return cp;
        });
    };

    // 3️⃣ Save handler
    const handleSave = async () => {
        try {
            await axios.post("http://localhost:3000/api/alarm-settings", {
                gatewayId,
                settings,
            });
            // alert("Settings saved!");
            setEditMode(false);
        } catch {
            // alert("Save failed.");
        }
    };

    if (loading) return <p>Loading…</p>;

    return (
        <div className="p-4 w-full mx-auto">
            <h1 className="text-2xl font-bold mb-4">
                Alarm Settings for {gatewayId}
            </h1>

            {settings.length > 0 ? (
                <button
                    onClick={() => {
                        if (editMode) handleSave();
                        else setEditMode(true);
                    }}
                    className={`px-4 py-2 rounded ${editMode ? "bg-green-600 text-white" : "bg-blue-600 text-white"
                        }`}
                >
                    {editMode ? "Save" : "Edit"}
                </button>
            ) : (
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                >
                    Save
                </button>
            )}

            <div className="space-y-4">
                {settings.map((s, i) => (
                    <div
                        key={`${s.category}-${s.subcategory}-${i}`}
                        className="border p-4 rounded bg-white"
                    >
                        <h2 className="font-semibold mb-2">
                            {s.category} › {s.subcategory}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <input
                                type="number"
                                value={s.high?? ""}
                                readOnly={!editMode}
                                onChange={e => updateField(i, "high", e.target.value)}
                                placeholder="High threshold"
                                className={`border rounded p-2 ${editMode ? "bg-white" : "bg-gray-100 cursor-not-allowed"
                                    }`}
                            />
                            <input
                                type="number"
                                value={s.low?? ""}
                                readOnly={!editMode}
                                onChange={e => updateField(i, "low", e.target.value)}
                                placeholder="Low threshold"
                                className={`border rounded p-2 ${editMode ? "bg-white" : "bg-gray-100 cursor-not-allowed"
                                    }`}
                            />
                            <select
                                value={s.priority}
                                disabled={!editMode}
                                onChange={e => updateField(i, "priority", e.target.value)}
                                className={`border rounded p-2 ${editMode ? "bg-white" : "bg-gray-100 cursor-not-allowed"
                                    }`}
                            >
                                <option>High</option>
                                <option>Medium</option>
                                <option>Low</option>
                            </select>
                            <input
                                type="text"
                                value={s.message}
                                readOnly
                                className="border bg-gray-100 text-gray-600 rounded p-2"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
