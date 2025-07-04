// src/pages/Settings.tsx
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

interface AlarmSetting {
    gatewayId: string;
    category: string;
    subcategory: string;
    high: number;
    low: number;
    priority: "High" | "Medium" | "Low";
    message: string;
}

interface Reading {
    gatewayId: string;
    timestamp: string;
    data: Record<string, Record<string, number>>;
}

export default function Settings() {
    const { search } = useLocation();
    const gatewayId = new URLSearchParams(search).get("gateway")!;
    const [reading, setReading] = useState<Reading | null>(null);
    const [settings, setSettings] = useState<AlarmSetting[]>([]);
    const [loading, setLoading] = useState(true);

    // 1️⃣ Pehli latest reading uthao
    useEffect(() => {
        axios
            .get<{ data: Reading[] }>("http://localhost:3000/api/readingsdynamic", {
                params: { gatewayId, limit: 1, page: 1 },
            })
            .then(res => {
                const arr = res.data.data;
                if (arr.length) setReading(arr[0]);
            })
            .finally(() => setLoading(false));
    }, [gatewayId]);

    // 2️⃣ Sirf category/subcat keys se settings banayo
    useEffect(() => {
        if (!reading) return;
        if (settings.length) return;

        const defs: AlarmSetting[] = [];
        Object.entries(reading.data).forEach(([cat, subObj]) => {
            Object.keys(subObj).forEach(sub => {
                defs.push({
                    gatewayId,
                    category: cat,
                    subcategory: sub,
                    high: 0,        // blank by default
                    low: 0,
                    priority: "Medium",
                    message: "Medium level reached",
                });
            });
        });
        setSettings(defs);
    }, [reading, settings, gatewayId]);

    // 3️⃣ Update handler
    const update = (
        idx: number,
        field: keyof Pick<AlarmSetting, "high" | "low" | "priority" | "message">,
        value: number | string
    ) => {
        setSettings(prev => {
            const copy = [...prev];

            if (field === "priority") {
                // mapping priority se custom message
                let msg = "";
                if (value === "High") msg = "High level reached";
                if (value === "Medium") msg = "Medium level reached";
                if (value === "Low") msg = "Low level reached";

                copy[idx] = {
                    ...copy[idx],
                    priority: value as AlarmSetting["priority"],
                    // message: value as string,
                    message: msg,
                };
            } else {
                copy[idx] = { ...copy[idx], [field]: value };
            }

            return copy;
        });
    };
    // 4️⃣ Submit
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await axios.post("http://localhost:3000/api/alarm-settings", {
            gatewayId,
            settings,
        });
        alert("Settings saved!");
    };

    if (loading) return <p>Loading…</p>;
    if (!reading) return <p>No data yet.</p>;

    return (
        <div className="p-4 w-full mx-auto">
            <h1 className="text-2xl font-bold mb-4">
                Alarm Settings for {gatewayId}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {settings.map((s, i) => (
                    <div key={`${s.category}-${s.subcategory}`} className="border p-3 rounded">
                        <h2 className="font-semibold">
                            {s.category} › {s.subcategory}
                        </h2>
                        <div className="grid sm:grid-cols-4 gap-2 mt-2">
                            <input
                                type="number"
                                value={s.high || ""}
                                onChange={e => update(i, "high", +e.target.value)}
                                placeholder="High threshold"
                                className="border rounded p-1"
                            />
                            <input
                                type="number"
                                value={s.low || ""}
                                onChange={e => update(i, "low", +e.target.value)}
                                placeholder="Low threshold"
                                className="border rounded p-1"
                            />
                            
                            <select
                                value={s.priority}
                                onChange={e => update(i, "priority", e.target.value)}
                                className="border rounded p-1"
                            >
                                <option>High</option>
                                <option>Medium</option>
                                <option>Low</option>
                            </select>

                            <input
                                type="text"
                                value={s.message}
                                readOnly
                                className="border bg-gray-100 rounded p-1 text-gray-600"
                            />
                        </div>
                    </div>
                ))}
                <button
                    type="submit"
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Save
                </button>
            </form>
        </div>
    );
}
