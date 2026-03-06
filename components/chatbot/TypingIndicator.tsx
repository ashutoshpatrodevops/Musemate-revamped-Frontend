export function TypingIndicator() {
  return (
    <div className="flex gap-4 py-6">
      <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
        M
      </div>

      <div className="text-gray-400 text-sm flex items-center">
        Thinking
        <span className="ml-1 animate-pulse">...</span>
      </div>
    </div>
  );
}
