export const ProgressBar = () => (
  <div className="fixed top-[59px] left-0 w-full h-[4px] overflow-hidden bg-[hsl(var(--muted))]">
    <div className="relative w-full h-full">
      <span className="absolute h-full bg-[hsl(var(--primary))] animate-[progressBar1_1.5s_ease-in-out_infinite]" />
      <span className="absolute h-full bg-[hsl(var(--primary))] animate-[progressBar2_1.5s_ease-in_infinite]" />
    </div>
  </div>
)
