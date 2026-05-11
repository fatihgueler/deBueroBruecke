export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-primary-500 focus:px-4 focus:py-2 focus:text-white focus:shadow-glow focus:outline-none"
    >
      Zum Hauptinhalt springen
    </a>
  );
}
