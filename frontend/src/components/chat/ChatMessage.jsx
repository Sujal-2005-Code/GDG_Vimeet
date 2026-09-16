import { Link } from 'react-router-dom';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] ${isUser ? 'text-right' : 'text-left'}`}>
        <div
          className={`inline-block rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
            isUser
              ? 'bg-white text-black rounded-br-sm'
              : 'bg-white/[0.06] border border-white/10 text-white/90 rounded-bl-sm'
          }`}
        >
          {message.content}
        </div>

        {!isUser && message.sources?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {message.sources.map((source) =>
              source.href.startsWith('/') ? (
                <Link
                  key={source.href}
                  to={source.href}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-white/15 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition"
                >
                  {source.label}
                </Link>
              ) : (
                <a
                  key={source.href}
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] px-2.5 py-1 rounded-full border border-white/15 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition"
                >
                  {source.label}
                </a>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
