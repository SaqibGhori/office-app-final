import React, { createContext, useContext, useEffect, useState } from 'react';

type MetaMap = Record<string, string>;

interface GatewayContextType {
  meta: MetaMap;
  rename: (id: string, name: string) => Promise<void>;
}

const GatewayCtx = createContext<GatewayContextType>({
  meta: {},
  rename: async () => {},
});

export const useGateway = () => useContext(GatewayCtx);

export const GatewayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [meta, setMeta] = useState<MetaMap>({});

  // 1. Load all aliases once on mount
  useEffect(() => {
    fetch('http://localhost:3000/api/gateways-meta')
      .then(r => r.json())
      .then((list: { gatewayId: string; displayName: string }[]) => {
        const m: MetaMap = {};
        list.forEach(g => {
          m[g.gatewayId] = g.displayName;
        });
        setMeta(m);
      })
      .catch(console.error);
  }, []);

  // 2. rename helper
  const rename = async (gatewayId: string, displayName: string) => {
    await fetch(`http://localhost:3000/api/gateways-meta/${gatewayId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName }),
    });
    setMeta(prev => ({ ...prev, [gatewayId]: displayName }));
  };

  return (
    <GatewayCtx.Provider value={{ meta, rename }}>
      {children}
    </GatewayCtx.Provider>
  );
};
