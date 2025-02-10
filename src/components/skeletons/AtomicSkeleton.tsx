export default function AtomicSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12">
      <div className="animate-pulse">
        <div className="h-screen min-h-[600px] bg-gray-200 mb-32" />
        <div className="grid grid-cols-12 gap-8 mb-32">
          <div className="col-span-8 h-[400px] bg-gray-200" />
          <div className="col-span-4 space-y-4">
            <div className="h-8 bg-gray-200 w-3/4" />
            <div className="h-4 bg-gray-200" />
            <div className="h-4 bg-gray-200" />
            <div className="h-[300px] bg-gray-200 mt-8" />
          </div>
        </div>
      </div>
    </div>
  );
} 