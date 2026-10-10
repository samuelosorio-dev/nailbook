interface SkeletonProps {
    className?: string;
}

const Skeleton = ({ className = "" }: SkeletonProps) => (
    <div aria-hidden="true" className={`animate-pulse rounded-2xl bg-[#F3E9EC] ${className}`} />
);

export default Skeleton;
