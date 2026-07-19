import React, { memo } from 'react';

const SkeletonLoader = memo(({ type = 'card', count = 1 }) => {
  const renderCardSkeleton = () => (
    <div className="animate-pulse">
      <div className="aspect-[3/4] rounded-xl shimmer" />
      <div className="mt-4 space-y-2">
        <div className="h-3 w-16 rounded shimmer" />
        <div className="h-4 w-3/4 rounded shimmer" />
        <div className="h-5 w-1/2 rounded shimmer" />
        <div className="h-3 w-24 rounded shimmer" />
      </div>
    </div>
  );

  const renderLineSkeleton = () => (
    <div className="animate-pulse flex items-center gap-4 p-4 border border-gray-100 rounded-xl">
      <div className="w-24 h-24 rounded-lg shimmer flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-20 rounded shimmer" />
        <div className="h-4 w-3/4 rounded shimmer" />
        <div className="h-5 w-1/3 rounded shimmer" />
      </div>
    </div>
  );

  const renderDetailSkeleton = () => (
    <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="space-y-4">
        <div className="aspect-square rounded-2xl shimmer" />
        <div className="flex gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-20 h-20 rounded-lg shimmer" />
          ))}
        </div>
      </div>
      <div className="space-y-4 pt-4">
        <div className="h-3 w-24 rounded shimmer" />
        <div className="h-8 w-3/4 rounded shimmer" />
        <div className="h-6 w-1/3 rounded shimmer" />
        <div className="h-4 w-full rounded shimmer" />
        <div className="h-4 w-full rounded shimmer" />
        <div className="h-4 w-2/3 rounded shimmer" />
        <div className="h-12 w-full rounded-lg shimmer mt-6" />
        <div className="h-12 w-full rounded-lg shimmer" />
      </div>
    </div>
  );

  const renderCategorySkeleton = () => (
    <div className="animate-pulse">
      <div className="aspect-[4/5] rounded-2xl shimmer" />
    </div>
  );

  const skeletonMap = {
    card: renderCardSkeleton,
    line: renderLineSkeleton,
    detail: renderDetailSkeleton,
    category: renderCategorySkeleton,
  };

  const render = skeletonMap[type] || renderCardSkeleton;

  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={i}>{render()}</div>
      ))}
    </>
  );
});

SkeletonLoader.displayName = 'SkeletonLoader';

export default SkeletonLoader;
