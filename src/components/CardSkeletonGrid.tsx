interface CardSkeletonGridProps {
  count: number;
  gridClassName: string;
}

const CardSkeletonGrid = ({ count, gridClassName }: CardSkeletonGridProps) => (
  <div className={gridClassName} aria-hidden="true">
    {Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className="aspect-2/3 w-full animate-pulse rounded-lg bg-neutral-900"
      />
    ))}
  </div>
);

export default CardSkeletonGrid;
