type Props = {
  filters: any;
  setFilters: (v: any) => void;
};

export default function FilterBar({ filters, setFilters }: Props) {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
      <button onClick={() => setFilters({ ...filters, category: "" })}>
        전체
      </button>

      <button onClick={() => setFilters({ ...filters, category: "POPUP" })}>
        팝업
      </button>

      <button
        onClick={() =>
          setFilters({ ...filters, status: "ONGOING" })
        }
      >
        진행중
      </button>
    </div>
  );
}