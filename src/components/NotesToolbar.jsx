import { Search, SlidersHorizontal } from "lucide-react";
import { categories } from "../data/categories";
import CustomSelect from "./CustomSelect";

export default function NotesToolbar({
  search,
  setSearch,
  category,
  setCategory,
  sort,
  setSort,
}) {
  return (
    <div className="toolbar">
      <div className="search-box">
        <Search size={18} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari judul atau isi catatan..."
        />
      </div>
      <div className="toolbar-controls">
        <CustomSelect
          className="toolbar-select"
          ariaLabel="Filter kategori"
          value={category}
          onChange={setCategory}
          options={categories.map((item) => ({ value: item, label: item }))}
        />
        <div className="sort-control">
          <SlidersHorizontal size={16} />
          <CustomSelect
            className="toolbar-select sort-select"
            ariaLabel="Urutkan catatan"
            value={sort}
            onChange={setSort}
            options={[
              { value: "newest", label: "Terbaru" },
              { value: "oldest", label: "Terlama" },
              { value: "az", label: "Judul A–Z" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
