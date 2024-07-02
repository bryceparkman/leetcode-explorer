import CircularProgress from '@mui/material/CircularProgress';

type SkeletonProps = {
    className?: string;
};

const Skeleton = ({ className }: SkeletonProps) => (
    <div aria-live="polite" aria-busy="true" className={className}>
        <span className="inline-flex w-full animate-pulse select-none rounded-md bg-gray-600 leading-none h-full">
            ‌
        </span>
        <br />
    </div>
)

export const SolutionSkeleton = () => (
    <>
        {Array.from({ length: 5 }).map((_, index) => (
            <div
                key={index}
                className={`text-left px-2 py-5 hover:bg-gray-800 border border-neutral-700 grid grid-cols-5`}
            >
                <div className="col-span-3 content-center">
                    <Skeleton className="w-[100px] max-w-full" />
                </div>
                <div className="text-right content-center">
                    <Skeleton className="w-[60px] max-w-full ml-2" />
                </div>
                <div className="text-right content-center">
                    <Skeleton className="w-[20px] max-w-full float-right" />
                </div>
            </div>
        ))}
        <div>
            <div className="float-left my-1 py-1 ml-1">
                <Skeleton className="w-[100px] max-w-full" />
            </div>
            <div className="rounded-lg w-7 my-2 py-1 inline-block float-right">
                <Skeleton className="w-[20px] max-w-full" />
            </div>
            <div className={`rounded-lg w-7 my-2 mx-1 py-1 inline-block float-right`}>
                <Skeleton className="w-[20px] max-w-full" />
            </div>
        </div>
    </>
);

export const CodeSkeleton = () => (
    <div className="m-auto justify-center">
        <svg width={0} height={0}>
            <defs>
                <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#e01cd5" />
                    <stop offset="100%" stopColor="#1CB5E0" />
                </linearGradient>
            </defs>
        </svg>
        <CircularProgress style={{width: 60, height: 60}} className='m-auto w-16 h-16' color="inherit" sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
    </div>
)

export const DescSkeleton = () => (
    <div className="col-span-8 text-left">
      <Skeleton className="w-[1000px] max-w-full pb-3" />
      <Skeleton className="w-[1240px] max-w-full pb-3" />
      <Skeleton className="w-[1280px] max-w-full pb-3" />
      <Skeleton className="w-[940px] max-w-full pb-3" />
      <Skeleton className="w-[1000px] max-w-full pb-3" />
    </div>
)