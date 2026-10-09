import { useState } from 'react';
import { Link } from 'react-router-dom';
import { site } from '../../data/site';
import Icon from '../ui/Icon';

const SendToTeamBox = ({ defaultQuestion, source, onSendToTeam, submitted }) => {
  const [question, setQuestion] = useState(defaultQuestion || '');

  if (submitted === 'success') {
    return (
      <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-success">
        <Icon name="check" className="size-4" />
        Sent to the GDG ViMEET team — thanks!
      </p>
    );
  }

  return (
    <div className="mt-2 flex flex-col gap-2">
      <label className="sr-only" htmlFor={`team-q-${source}`}>
        Your question for the team
      </label>
      <textarea
        id={`team-q-${source}`}
        rows={2}
        maxLength={500}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full resize-none rounded-field border border-line-strong bg-surface px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
      {submitted === 'error' && (
        <p role="alert" className="text-xs text-danger">Couldn't send that right now. Please try again later.</p>
      )}
      <button
        type="button"
        onClick={() => onSendToTeam(question.trim(), source)}
        disabled={submitted === 'sending' || question.trim().length === 0}
        className="min-h-11 self-start rounded-full bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-40"
      >
        {submitted === 'sending' ? 'Sending…' : 'Send question'}
      </button>
    </div>
  );
};

const FeedbackRow = ({ precedingQuestion, onSendToTeam, submitted }) => {
  const [vote, setVote] = useState(null); // null | 'up' | 'down'

  if (vote === 'up') {
    return <p className="mt-1.5 text-xs text-ink-2">Thanks for the feedback!</p>;
  }

  return (
    <div className="mt-1">
      {vote !== 'down' ? (
        <div className="flex items-center gap-1">
          <span className="text-xs text-ink-2">Was this helpful?</span>
          <button
            type="button"
            onClick={() => setVote('up')}
            aria-label="Yes, this was helpful"
            className="inline-flex size-9 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-success"
          >
            <Icon name="thumb-up" className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setVote('down')}
            aria-label="No, this was not helpful"
            className="inline-flex size-9 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-danger"
          >
            <Icon name="thumb-down" className="size-4" />
          </button>
        </div>
      ) : (
        <>
          <p className="mb-1 text-xs text-ink-2">What were you looking for?</p>
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
      <div className={`max-w-[88%] ${isUser ? 'text-right' : 'text-left'}`}>
        <p className="sr-only">{isUser ? 'You said:' : `${site.chatbot.name} said:`}</p>
        <div
          className={`inline-block whitespace-pre-wrap break-words rounded-[1.125rem] px-3.5 py-2.5 text-left text-sm leading-relaxed ${
            isUser ? 'rounded-br-md bg-primary text-white' : 'rounded-bl-md bg-surface-2 text-ink'
          }`}
        >
          {message.content}
        </div>

        {!isUser && message.sources?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {message.sources.map((source) =>
              source.href.startsWith('/') ? (
                <Link
                  key={source.href}
                  to={source.href}
                  className="inline-flex min-h-8 items-center rounded-full border border-line px-3 text-xs font-medium text-primary transition-colors hover:bg-primary-tint"
                >
                  {source.label}
                </Link>
              ) : (
                <a
                  key={source.href}
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-8 items-center rounded-full border border-line px-3 text-xs font-medium text-primary transition-colors hover:bg-primary-tint"
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
          <div className="mt-2 text-left">
            <p className="text-xs text-ink-2">Would you like to send this question to the GDG ViMEET team?</p>
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
