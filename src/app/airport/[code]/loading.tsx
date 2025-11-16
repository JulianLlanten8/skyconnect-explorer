import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-6 w-48 hidden sm:block" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-4">
        {/* Airport Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Skeleton className="h-14 w-14 rounded-xl" />
                <Skeleton className="h-10 w-96" />
              </div>

              <Skeleton className="h-5 w-64 mt-2" />
            </div>

            <div className="flex gap-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-8">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-32" />
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-8xl">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <Skeleton className="h-6 w-48 mb-6" />

            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
