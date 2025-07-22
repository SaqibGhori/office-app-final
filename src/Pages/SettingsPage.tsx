import React, { useEffect, useState } from 'react';
import { useGateway } from '../context/GatewayContext';

type MetaMap = Record<string,string>;

export default function SettingsPage() {
  const { meta, rename } = useGateway();
  const [ids, setIds] = useState<string[]>([]);
  const [aliases, setAliases] = useState<MetaMap>({});

  // 1 ▶ Fetch gateway IDs
  useEffect(() => {
    fetch('http://localhost:3000/api/gateways')
      .then(r=>r.json())
      .then((arr:string[])=> setIds(arr))
      .catch(console.error);
  }, []);

  // 2 ▶ Jab meta ya ids change ho, aliases ko initialize karo
  useEffect(() => {
    const m: MetaMap = {};
    ids.forEach(id => {
      m[id] = meta[id] ?? id;
    });
    setAliases(m);
  }, [ids, meta]);

  // 3 ▶ Input change handler
  const handleChange = (id: string, value: string) => {
    setAliases(prev => ({ ...prev, [id]: value }));
  };

  // 4 ▶ Save handler
  const handleSave = (id: string) => {
    rename(id, aliases[id].trim() || id);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gateway Aliases</h1>
      {ids.map(id => (
        <div key={id} className="flex items-center mb-4">
          <span className="w-48 font-mono">{id}</span>
          <input
            type="text"
            className="flex-1 p-2 border rounded mr-4"
            value={aliases[id] || ''}
            onChange={e => handleChange(id, e.target.value)}
            onBlur={() => handleSave(id)}
          />
          <button
            className="px-4 py-1 bg-blue-600 text-white rounded"
            onClick={() => handleSave(id)}
          >
            Save
          </button>
        </div>
      ))}
    </div>
  );
}
