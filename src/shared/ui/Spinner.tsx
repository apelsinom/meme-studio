export const Spinner = () => (
  <div className="flex items-center justify-center w-full">
    <span className="relative inline-block w-[48px] h-[48px] rounded-full border-t-4 border-r-4 border-r-transparent border-t-[hsl(var(--muted))] animate-[spin_1s_linear_infinite]">
      <span className="absolute left-0 top-0 w-[48px] h-[48px] rounded-full border-l-4 border-b-4 border-b-transparent border-l-[hsl(var(--primary))] animate-[spin-reverse_0.5s_linear_infinite]" />
    </span>
  </div>
)
