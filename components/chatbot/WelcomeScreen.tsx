'use client';

interface Props {
  userName?: string;
  onPrompt: (text: string) => void;
}

export function WelcomeScreen({ userName, onPrompt }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">

      {/* Greeting */}
      <h1 className="text-4xl font-semibold text-gray-900 dark:text-white mb-2">
        Hi{userName ? `, ${userName}` : ""} 👋
      </h1>

      <p className="text-gray-500 mb-8">
        What would you like to explore today?
      </p>

      {/* Suggestions */}
      <div className="grid gap-3 w-full max-w-xl">
        <Suggestion text="Suggest museums to visit" onClick={onPrompt} />
        <Suggestion text="Tell me history of a monument" onClick={onPrompt} />
        <Suggestion text="How do I book tickets?" onClick={onPrompt} />
        <Suggestion text="Best places for kids in a museum" onClick={onPrompt} />
      </div>

    </div>
  );
}

function Suggestion({ text, onClick }: { text: string; onClick: (t:string)=>void }) {
  return (
    <button
      onClick={() => onClick(text)}
      className="text-left px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
      hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      {text}
    </button>
  );
}
