import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import { api } from "../api";

// Types
type Reading = {
  gatewayId: string;
  timestamp: string;
  data: Record<string, Record<string, number>>;
};

type AlarmSetting = {
  _id?: string;
  gatewayId: string;
  category: string;
  subcategory: string;
  high?: number;
  low?: number;
  priority: "High" | "Normal" | "Low";
  message: string;
};

type Gateway = {
  gatewayId: string;
  name: string;
  location: string;
};

interface DataContextType {
  gatewayId: string;
  gatewayIds: string[];       // old style
  gateways: Gateway[];        // full list with name/location
  reading: Reading | null;
  fetchGatewayIds: () => Promise<void>;
  historicalData: Reading[];
  totalCount: number;
  fetchHistorical: (opts: {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => void;
  alarmSettings: AlarmSetting[];
  fetchAlarmSettings: () => void;
  saveAlarmSettings: (settings: AlarmSetting[]) => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { search } = useLocation();
  const gatewayId = new URLSearchParams(search).get("gateway") || "";

  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [reading, setReading] = useState<Reading | null>(null);
  const [historicalData, setHistoricalData] = useState<Reading[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [alarmSettings, setAlarmSettings] = useState<AlarmSetting[]>([]);

 // Get userId from wherever you're storing it (e.g. localStorage)
const userId = localStorage.getItem("userId") ?? undefined;

// Real-time reading via socket (for live updates)
useSocket((data: Reading) => {
  if (data.gatewayId === gatewayId) {
    setReading(data);
    console.log("📡 New real-time reading received:", data);
  }
}, gatewayId, userId); // <-- ✅ now passing userId as 3rd param


  // ✅ Fetch user-specific gateways with token
  const fetchGatewayIds = async () => {
  try {
    const raw = localStorage.getItem("token");
    const token = raw && raw !== "null" && raw !== "undefined" ? raw : null;

    if (!token) {
      // yahan pe API mat maro; pehle login karao ya token load hone ka wait karo
      console.warn("No token yet; skipping /api/gateways call");
      return;
    }

    const { data } = await api.get<Gateway[]>("/api/gateways", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setGateways(data);
  } catch (err) {
    console.error("Failed to fetch gateways:", err);
  }
};


  useEffect(() => {
    fetchGatewayIds();
  }, []);

  // 🔄 Fetch historical readings (with optional date filters)
  const fetchHistorical = async ({
    startDate,
    endDate,
    page = 1,
    limit = 50,
  }: {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => {
    if (!gatewayId) return;
    try {
      const params: any = { gatewayId, page, limit };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await api.get("/api/readingsdynamic", {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setHistoricalData(res.data.data || []);
      setTotalCount(res.data.total || 0);
    } catch (err) {
      console.error("Failed to fetch historical data:", err);
    }
  };

  // ⚙️ Alarm settings
  const fetchAlarmSettings = async () => {
    try {
      const res = await api.get<AlarmSetting[]>(
        "/api/alarm-settings",
        {
          params: { gatewayId },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.length > 0) {
        setAlarmSettings(res.data);
      } else {
        // fallback if not found: auto-generate from data structure
        const r2 = await api.get<{ data: Reading[] }>(
          "/api/readingsdynamic",
          {
            params: { gatewayId, limit: 1, page: 1 },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const rd = r2.data.data[0]?.data || {};
        const defs: AlarmSetting[] = [];

        Object.entries(rd).forEach(([cat, subObj]) => {
          Object.keys(subObj as Record<string, number>).forEach((sub) => {
            defs.push({
              gatewayId,
              category: cat,
              subcategory: sub,
              high: undefined,
              low: undefined,
              priority: "Normal",
              message: "Normal level reached",
            });
          });
        });

        setAlarmSettings(defs);
      }
    } catch (err) {
      console.error("Failed to fetch alarm settings:", err);
    }
  };

  const saveAlarmSettings = async (settings: AlarmSetting[]) => {
    try {
      await api.post(
        "/api/alarm-settings",
        { gatewayId, settings},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAlarmSettings(settings);
    } catch (err) {
      console.error("Failed to save alarm settings:", err);
    }
  };

  return (
    <DataContext.Provider
      value={{
        gatewayId,
        gatewayIds: gateways.map((g) => g.gatewayId),
        gateways,
        reading,
        historicalData,
        totalCount,
        fetchHistorical,
        alarmSettings,
        fetchAlarmSettings,
        saveAlarmSettings,
        fetchGatewayIds,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within a DataProvider");
  return ctx;
};
