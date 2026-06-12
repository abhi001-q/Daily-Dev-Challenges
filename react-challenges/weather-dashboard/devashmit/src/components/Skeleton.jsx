export default function Skeleton() {
  return (
    <div className="skeleton-wrap" aria-busy="true">
      <div className="skeleton skeleton--card" />
      <div className="skeleton skeleton--forecast" />
    </div>
  );
}
