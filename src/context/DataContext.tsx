import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import axios from "axios";

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

interface DataContextType {
    gatewayId: string;
    gatewayIds: string[];
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

    const [gatewayIds, setGatewayIds] = useState<string[]>([]);
    const [reading, setReading] = useState<Reading | null>(null);

    const [historicalData, setHistoricalData] = useState<Reading[]>([]);
    const [totalCount, setTotalCount] = useState(0);

    const [alarmSettings, setAlarmSettings] = useState<AlarmSetting[]>([]);


    // 🌐 Socket subscription for real-time data
    useSocket((data: Reading) => {
        if (data.gatewayId === gatewayId) {
            setReading(data);
        }
    }, gatewayId);

    // 🌐 Gateway list
    const fetchGatewayIds = async () => {
        try {
            const res = await axios.get<string[]>("http://localhost:3000/api/gateways");
            setGatewayIds(res.data);
        } catch (err) {
            console.error("Failed to fetch gateways:", err);
        }
    };

    // 🔄 Load gateway list on mount
    useEffect(() => {
        fetchGatewayIds();
    }, []);

    // 📄 Fetch historical readings (paginated)
    const fetchHistorical = async ({
        startDate,
        endDate,
        page = 1,
        limit = 50
    }: {
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
    }) => {
        if (!gatewayId) return;
        try {
            const params: any = {
                gatewayId,
                page,
                limit,
            };
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const res = await axios.get("http://localhost:3000/api/readingsdynamic", { params });
            setHistoricalData(res.data.data || []);
            setTotalCount(res.data.total || 0);
        } catch (err) {
            console.error("Failed to fetch historical data:", err);
        }
    };

    // 📄 Alarm settings fetcher
    const fetchAlarmSettings = async () => {
        try {
            const res = await axios.get<AlarmSetting[]>("http://localhost:3000/api/settings", {
                params: { gatewayId },
            });

            if (res.data.length > 0) {
                setAlarmSettings(res.data);
            } else {
                // fallback: dynamic reading
                const r2 = await axios.get<{ data: Reading[] }>(
                    "http://localhost:3000/api/readingsdynamic",
                    { params: { gatewayId, limit: 1, page: 1 } }
                );
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

    // 📩 Alarm settings saver
    const saveAlarmSettings = async (settings: AlarmSetting[]) => {
        try {
            await axios.post("http://localhost:3000/api/alarm-settings", {
                gatewayId,
                settings,
            });
            setAlarmSettings(settings);
        } catch (err) {
            console.error("Failed to save alarm settings:", err);
        }
    };

    
    return (
        <DataContext.Provider
            value={{
                gatewayId,
                gatewayIds,
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
