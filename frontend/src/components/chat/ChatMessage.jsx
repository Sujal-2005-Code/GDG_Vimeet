import { useState } from 'react';
import { Link } from 'react-router-dom';

const SendToTeamBox = ({ defaultQuestion, source, onSendToTeam, submitted }) => {
  const [question, setQuestion] = useState(defaultQuestion || '');

  if (submitted === 'success') {
    return <p className="text-emerald-300 text-xs mt-2">Sent to the GDG ViMEET team — thanks!</p>;
  }

  return (
    <div className="mt-2 flex flex-col gap-1.5">
      <textarea
        rows={2}
        maxLength={500}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full resize-none rounded-lg border border-white/10 bg-black/40 px-2.5 py-2 text-xs text-white placeholder-white/35 focus:border-google-blue focus:outline-none focus:ring-1 focus:ring-google-blue transition"
      />
      {submitted === 'error' && (
        <p className="text-rose-300 text-[11px]">Couldn't send that right now. Please try again later.</p>
      )}
      <button
        type="button"
        onClick={() => onSendToTeam(question.trim(), source)}
        disabled={submitted === 'sending' || question.trim().length === 0}
        className="self-start text-xs font-medium px-3 py-1.5 rounded-lg bg-white text-black hover:bg-white/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitted === 'sending' ? 'Sending…' : 'Send Question'}
      </button>
    </div>
  );
};

const FeedbackRow = ({ precedingQuestion, onSendToTeam, submitted }) => {
  const [vote, setVote] = useState(null); // null | 'up' | 'down'

  if (vote === 'up') {
    return <p className="text-white/40 text-[11px] mt-2">Thanks for the feedback!</p>;
  }

  return (
    <div className="mt-2">
      {vote !== 'down' ? (
        <div className="flex items-center gap-2">
          <span className="text-white/35 text-[11px]">Was this helpful?</span>
          <button
            type="button"
            onClick={() => setVote('up')}
            aria-label="Yes, this was helpful"
            className="text-sm hover:opacity-70 transition"
          >
            👍
          </button>
          <button
            type="button"
            onClick={() => setVote('down')}
            aria-label="No, this was not helpful"
            className="text-sm hover:opacity-70 transition"
          >
            👎
          </button>
        </div>
      ) : (
        <>
          <p className="text-white/50 text-[11px] mb-1">What were you looking for?</p>
          <SendToTeamBox
            defaultQuestion={precedingQuestion}
            source="faq-feedback"
            onSendToTeam={onSendToTeam}
            submitted={submitted}
          />
        </>
      )}
    </div>
  );
};

const ChatMessage = ({ message, precedingQuestion, onSendToTeam }) => {
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

        {/* The model found nothing grounded to say — offer to hand the
            question to the team instead of leaving a dead end. */}
        {!isUser && message.noMatch && (
          <div className="text-left mt-1">
            <p className="text-white/60 text-xs">Would you like to send this question to the GDG ViMEET team?</p>
            <SendToTeamBox
              defaultQuestion={precedingQuestion}
              source="chat-no-answer"
              onSendToTeam={onSendToTeam}
              submitted={message.querySubmitted}
            />
          </div>
        )}

        {/* A normal grounded answer still gets a lightweight feedback loop —
            not shown alongside the no-match prompt above, which already
            covers "this didn't help". */}
        {!isUser && !message.noMatch && onSendToTeam && (
          <div className="text-left">
            <FeedbackRow
              precedingQuestion={precedingQuestion}
              onSendToTeam={onSendToTeam}
              submitted={message.querySubmitted}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
