interface DebugProps {
  data: unknown;
  label?: string;
}

export default function Debug({ data, label }: DebugProps) {
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-md p-4 bg-black/90 text-white rounded-lg shadow-lg">
      <div className="text-xs font-mono">
        {label && <div className="font-bold mb-1">{label}</div>}
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
