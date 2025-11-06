import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./components/Map'), {
  ssr: false,
  loading: () => <div style={{height:'70vh',display:'grid',placeItems:'center'}}>Loading map?</div>
});

export default function Page() {
  return (
    <main style={{ padding: '16px', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, margin: '12px 0' }}>Iran GeoJSON</h1>
      <p style={{ marginBottom: 12 }}>
        High-resolution national boundary of Iran rendered as GeoJSON.
      </p>
      <Map />
    </main>
  );
}
