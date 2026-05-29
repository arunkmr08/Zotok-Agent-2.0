export function PageHeader() {
  return (
    <div className="text-center mb-10">
      <h1 className="text-2xl font-semibold tracking-tight text-[#34322d] dark:text-[#f0efec] mb-1">WhatsApp Sync</h1>
      <div className="w-10 h-1 bg-[#008069] rounded-full mx-auto my-2" />
      <p className="text-base font-medium text-[#6d6c6b] dark:text-[#7f7f7f]">
        Manage your connection and the groups Zotok is allowed to read.
      </p>
    </div>
  );
}
