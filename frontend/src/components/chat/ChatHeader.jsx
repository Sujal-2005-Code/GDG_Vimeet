import { site } from '../../data/site';
import Icon from '../ui/Icon';

/** Bot name + avatar + close button, shared by the chat panel and the fallback. */
const ChatHeader = ({ onClose, subtitle }) => (
  <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
    <div className="flex min-w-0 items-center gap-3">
      <img src={site.chatbot.avatar} alt="" className="size-9 shrink-0 rounded-full object-cover" />
      <div className="min-w-0">
        <p className="font-semibold leading-tight text-ink">{site.chatbot.name}</p>
        {subtitle && <p className="truncate text-xs leading-tight text-ink-2">{subtitle}</p>}
      </div>
    </div>
    <button
      type="button"
      onClick={onClose}
      aria-label="Close chat"
      className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
    >
      <Icon name="close" className="size-5" />
    </button>
  </div>
);

export default ChatHeader;
