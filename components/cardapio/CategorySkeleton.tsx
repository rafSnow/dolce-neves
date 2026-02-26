export function CategorySkeleton() {
  return (
    <div
      className="flex flex-wrap gap-2 sm:gap-3 justify-center"
      role="status"
      aria-label="Carregando categorias"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-10 rounded-full bg-white animate-pulse"
          style={{ width: `${80 + i * 20}px` }}
        />
      ))}
      <span className="sr-only">Carregando filtros de categoria...</span>
    </div>
  );
}
