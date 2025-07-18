import { useEffect, useState } from "react";
import { useData } from "../context/DataContext";

export default function Settings() {
  const {
    gatewayId,
    alarmSettings,
    fetchAlarmSettings,
    saveAlarmSettings,
  } = useData();

  const [localSettings, setLocalSettings] = useState(alarmSettings || []);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // Load alarm settings from context
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      await fetchAlarmSettings();
      setLoading(false);
    };
    loadSettings();
  }, [gatewayId]);

  // Sync context alarmSettings to local state
  useEffect(() => {
    setLocalSettings(alarmSettings);
  }, [alarmSettings]);

  const updateField = (
    idx: number,
    field: "high" | "low" | "priority",
    val: string
  ) => {
    setLocalSettings(prev => {
      const copy = [...prev];
      const setting = { ...copy[idx] };

      if (field === "priority") {
        setting.priority = val as any;
        setting.message =
          val === "High"
            ? "High level reached"
            : val === "Normal"
              ? "Normal level reached"
              : "Low level reached";
      } else {
        setting[field] = Number(val);
      }

      copy[idx] = setting;
      return copy;
    });
  };

  const handleSave = async () => {
    await saveAlarmSettings(localSettings);
    setEditMode(false);
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div className="p-4 w-full mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Alarm Settings for {gatewayId}
      </h1>

      {localSettings.length > 0 ? (
        <button
          onClick={() => {
            if (editMode) handleSave();
            else setEditMode(true);
          }}
          className={`px-4 py-2 rounded ${editMode
            ? "bg-green-600 text-white"
            : "bg-blue-600 text-white"
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

      <div className="space-y-4 mt-6">
        {localSettings.map((s, i) => (
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
                value={s.high ?? ""}
                readOnly={!editMode}
                onChange={e => updateField(i, "high", e.target.value)}
                placeholder="High threshold"
                className={`border rounded p-2 ${editMode ? "bg-white" : "bg-gray-100 cursor-not-allowed"
                  }`}
              />
              <input
                type="number"
                value={s.low ?? ""}
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
                <option>Normal</option>
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