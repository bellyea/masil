export default function EventSkeleton() {
  return (
    <div style={{ padding: 20 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 60,
            background: "#eee",
            marginBottom: 10,
            borderRadius: 8,
          }}
        />
      ))}
    </div>
  );
}