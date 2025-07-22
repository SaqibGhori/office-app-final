import React from 'react';
import { useGateway } from '../context/GatewayContext';

interface Props {
  id: string;
  showId?: boolean;      // agar true, toh (id) bhi dikhega
  idStyle?: React.CSSProperties;
  nameStyle?: React.CSSProperties;
}

export const GatewayLabel: React.FC<Props> = ({
  id,
  showId = true,
  idStyle,
  nameStyle,
}) => {
  const { meta } = useGateway();
  // alias agar set hai toh use karo, warna ID
  const displayName = meta[id] ?? id;

  return (
    <span>
      <span style={nameStyle}>{displayName}</span>
      {showId && (
        <small style={{ marginLeft: '0.25rem', opacity: 0.6, ...idStyle }}>
          ({id})
        </small>
      )}
    </span>
  );
};
