export function Spinner({ placeholder }: { placeholder?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[200px] sm:min-h-[300px]">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary" />
        <p className="text-gray-600 text-center text-sm sm:text-base">
          {placeholder || "Loading details..."}
        </p>
      </div>
    </div>
  );
}
