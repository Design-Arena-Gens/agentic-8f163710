"use client";

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

type FeatureCollection = GeoJSON.FeatureCollection;

function FitBounds({ data }: { data: FeatureCollection }) {
  const map = useMap();
  const bounds = useMemo(() => {
    const layer = L.geoJSON(data as any);
    return layer.getBounds();
  }, [data]);

  useEffect(() => {
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [map, bounds]);

  return null;
}

export default function Map() {
  const [data, setData] = useState<FeatureCollection | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch('/iran.geojson')
      .then(async (r) => {
        if (!r.ok) throw new Error(`Failed to load GeoJSON (${r.status})`);
        return r.json();
      })
      .then((json) => {
        if (!isMounted) return;
        setData(json as FeatureCollection);
      })
      .catch((e) => {
        if (!isMounted) return;
        setError(e.message || 'Failed to load GeoJSON');
      });
    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return <div style={{ color: 'crimson' }}>Error: {error}</div>;
  }

  return (
    <div style={{ height: '70vh', width: '100%', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}>
      <MapContainer center={[32.4, 54.3]} zoom={5} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data && (
          <>
            <GeoJSON data={data as any} style={{ color: '#1d4ed8', weight: 2, fillOpacity: 0.15 }} />
            <FitBounds data={data} />
          </>
        )}
      </MapContainer>
    </div>
  );
}
