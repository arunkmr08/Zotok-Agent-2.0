"use client";

const PER_PAGE_OPTIONS = [50, 100, 200];

type Props = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  setPage: (p: number) => void;
  setPerPage: (n: number) => void;
};

export function TablePagination({ page, perPage, total, totalPages, setPage, setPerPage }: Props) {
  const start = total === 0 ? 0 : (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  return (
    <div className="flex items-center justify-between px-6 h-[52px] border-t border-black/[0.06] dark:border-white/[0.06] flex-shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-[13px] text-[#6d6c6b] dark:text-[#7f7f7f]">Rows per page:</span>
        <select
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
          className="h-[28px] px-2 rounded-[6px] border border-black/[0.08] dark:border-white/[0.08] bg-transparent text-[13px] text-[#34322d] dark:text-[#dadada] outline-none focus:border-[#0067ff] cursor-pointer"
        >
          {PER_PAGE_OPTIONS.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[13px] text-[#6d6c6b] dark:text-[#7f7f7f]">
          {start}–{end} of {total}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            className="h-[28px] px-[10px] text-[13px] rounded-[6px] border border-black/[0.08] dark:border-white/[0.08] text-[#34322d] dark:text-[#dadada] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
            className="h-[28px] px-[10px] text-[13px] rounded-[6px] border border-black/[0.08] dark:border-white/[0.08] text-[#34322d] dark:text-[#dadada] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
