
export function PaginationBar({ total, current, onPageChange }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 2,
      padding: "16px 0 8px",
    }}>
      {Array.from({ length: total }, (_, i) => i + 1).map(n => (
        <button
          key={n}
          onClick={() => onPageChange(n)}
          className={`paginacao ${n === current ? "active": ""}`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}