export function WarningBanner({ messages }: { messages: string[] }) {
  if (messages.length === 0) return null;

  return (
    <div className="warning-banner">
      <strong>Worth a reality check</strong>
      <ul>
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    </div>
  );
}
