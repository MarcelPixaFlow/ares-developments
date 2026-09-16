export function AresLogo() {
  return (
    <span className="flex min-w-0 items-center gap-3">
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        className="h-7 w-7 shrink-0 text-primary"
        fill="none"
      >
        <path
          d="M16 2 C 12 12, 8 20, 4 30 C 12 26, 20 26, 28 30 C 24 20, 20 12, 16 2 Z"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path d="M16 8 L16 30" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
      </svg>
      <span className="min-w-0">
        <span className="block truncate font-serif text-base tracking-[0.3em] text-foreground">
          ARES
        </span>
        <span className="block truncate text-[9px] uppercase tracking-[0.35em] text-muted-foreground">
          Developments
        </span>
      </span>
    </span>
  );
}
