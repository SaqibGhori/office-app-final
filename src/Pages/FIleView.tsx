import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// Types for data structure
interface ReadingData {
  [category: string]: {
    [subcategory: string]: number;
  };
}

interface Reading {
  gatewayId: string;
  timestamp: string;
  data: ReadingData;
}

export default function App() {
  const [allData, setAllData] = useState<Reading[]>([]);
  const [gatewayIds, setGatewayIds] = useState<string[]>([]);
  const [selectedGateway, setSelectedGateway] = useState<string>('');
  const [filteredData, setFilteredData] = useState<Reading[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get<Reading[]>("http://localhost:3000/api/readingsdynamic");
      setAllData(res.data);
      const gateways = Array.from(new Set(res.data.map(d => d.gatewayId)));
      setGatewayIds(gateways);
      if (gateways.length > 0) setSelectedGateway(gateways[0]);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const dataForGateway = allData.filter(d => d.gatewayId === selectedGateway);
    setFilteredData(dataForGateway);
    setSelectedCategory(null);
    setSelectedSubcategories([]);
  }, [selectedGateway, allData]);

  useEffect(() => {
    if (filteredData.length > 0) {
      const firstCategory = Object.keys(filteredData[0].data || {})[0];
      if (firstCategory) {
        setSelectedCategory(firstCategory);
        const subcategories = Object.keys(filteredData[0].data[firstCategory] || {});
        setSelectedSubcategories(subcategories);
      }
    }
  }, [filteredData]);

  const handleDateFilter = async () => {
    try {
      const params: any = { gatewayId: selectedGateway };
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        params.startDate = start.toISOString();
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        params.endDate = end.toISOString();
      }

      const res = await axios.get<Reading[]>("http://localhost:3000/api/readingsdynamic", { params });
      setFilteredData(res.data);

      if (res.data.length > 0) {
        const firstCategory = Object.keys(res.data[0].data || {})[0];
        if (firstCategory) {
          setSelectedCategory(firstCategory);
          const subcategories = Object.keys(res.data[0].data[firstCategory] || {});
          setSelectedSubcategories(subcategories);
        }
      } else {
        setSelectedCategory(null);
        setSelectedSubcategories([]);
      }
    } catch (error) {
      console.error("Date filtering failed:", error);
    }
  };

  const toggleSubcategory = (sub: string) => {
    setSelectedSubcategories(prev =>
      prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
    );
  };

  const getAllSubcategories = (): string[] => {
    const subs = new Set<string>();
    filteredData.forEach(entry => {
      const catData = entry.data?.[selectedCategory!];
      if (catData && typeof catData === "object") {
        Object.keys(catData).forEach(sub => subs.add(sub));
      }
    });
    return Array.from(subs);
  };

  return (
    <div className="mx-3">
      <div className='flex justify-between items-center'>
        <h1 className="text-2xl font-bold ml-5">File View</h1>
        <div className="flex gap-2 p-4">
          <button className="bg-gray-300 px-4 py-2 rounded">Energy</button>
          <Link to='/harmonics' className="bg-gray-300 px-4 py-2 rounded">Harmonics</Link>
          <button className="bg-gray-300 px-4 py-2 rounded">Alarm</button>
        </div>
      </div>
      <hr />

      <div className="flex items-center gap-4 my-4">
        <span className="font-semibold">Select Range</span>
        <label className="flex items-center gap-2">
          From
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="p-1 border rounded" />
        </label>
        <label className="flex items-center gap-2">
          To
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="p-1 border rounded" />
        </label>
        <button className="bg-blue-600 text-white px-4 py-1 rounded" onClick={handleDateFilter}>Apply</button>
      </div>

      <div className="flex">
        <div className="w-64 bg-gray-800 text-white p-4">
          <select className="w-full mb-4 p-2 text-black rounded" value={selectedGateway} onChange={e => setSelectedGateway(e.target.value)}>
            {gatewayIds.map(id => <option key={id} value={id}>{id}</option>)}
          </select>
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          {filteredData.length > 0 && Object.keys(filteredData[0].data || {}).map(category => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setSelectedSubcategories([]);
              }}
              className={`block w-full text-left px-2 py-1 mb-1 rounded ${selectedCategory === category ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            >
              {category}
            </button>
          ))}
          {selectedCategory && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Subcategories</h3>
              {getAllSubcategories().map(sub => (
                <label key={sub} className="flex items-center gap-2 mb-1">
                  <input type="checkbox" checked={selectedSubcategories.includes(sub)} onChange={() => toggleSubcategory(sub)} />
                  {sub}
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-4">Data Table</h2>
          <table className="w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Time</th>
                {selectedSubcategories.map(sub => (
                  <th key={sub} className="px-4 py-2 text-left">{sub}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((entry, index) => {
                const dateObj = new Date(entry.timestamp);
                const date = dateObj.toLocaleDateString();
                const time = dateObj.toLocaleTimeString();
                return (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{date}</td>
                    <td className="px-4 py-2">{time}</td>
                    {selectedSubcategories.map(sub => {
                      const catData = entry.data?.[selectedCategory!];
                      const value = catData && typeof catData === 'object' && sub in catData ? catData[sub] : "-";
                      return <td key={sub} className="px-4 py-2">{value}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
  