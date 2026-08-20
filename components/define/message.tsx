/** One turn: role marker + prose. Two variants, differing only in text colour. */
export function Message({ role, text }: { role: 'user' | 'assistant'; text: string }) {
  return (
    <div className="message">
      <span className="message-role-marker">
        <span className={role === 'assistant' ? 'message-marker-glyph--ai' : ''}>▸</span>{' '}
        {role === 'assistant' ? 'AI' : 'you'}
      </span>
      <p
        className={
          role === 'assistant' ? 'message-text message-text--ai' : 'message-text message-text--user'
        }
      >
        {text}
      </p>
    </div>
  );
}
