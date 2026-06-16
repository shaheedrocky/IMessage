import useScrollToBottom from "../../hooks/useScrollToBottom";
import { MessageBubble } from "./MessageBubble";
import { NoConversationPlaceholder } from "./NoConversationPlaceholder";
import { useSelectedConversation } from "../../hooks/useSelectedConversation";
import { useChatStore } from "../../store/useChatStore";

export default function MessageList() {
  const { activeConversation, activeConversationId } = useSelectedConversation();
  const typingStates = useChatStore((state) => state.typingStates || {});
  const isTyping = activeConversationId ? typingStates[activeConversationId] : false;
  const sendMessage = useChatStore((state) => state.sendMessage);

  const lastMessageId = activeConversation?.messages.at(-1)?.id;
  const scrollTrigger = `${lastMessageId}_${isTyping}`;
  const messagesScrollRef = useScrollToBottom(activeConversationId, scrollTrigger);

  const handleSendHi = () => {
    sendMessage({ text: "Hi! 👋" });
  };

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {activeConversation ? (
        <div
          ref={messagesScrollRef}
          className="flex flex-1 flex-col gap-1 overflow-y-auto overscroll-contain px-2 py-3 sm:px-3 sm:py-4"
        >
          {activeConversation.messages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12 text-center select-none">
              <div className="flex size-20 items-center justify-center rounded-full bg-accent-soft text-accent border border-accent/20 shadow-md">
                <span className="text-4xl animate-bounce">👋</span>
              </div>
              <div className="max-w-xs">
                <p className="text-base font-semibold tracking-tight text-foreground">No messages yet</p>
                <p className="text-sm text-muted mt-1 leading-normal">
                  Say hello to <span className="font-semibold text-foreground">{activeConversation.peer.name}</span> to start this conversation!
                </p>
              </div>
              <button
                type="button"
                onClick={handleSendHi}
                className="mt-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground shadow-md transition-all hover:bg-accent/90 hover:scale-105 active:scale-95"
              >
                Send a Wave 👋
              </button>
            </div>
          ) : (
            <>
              <p className="mb-3 text-center text-[11px] font-medium uppercase tracking-wide text-muted">
                Today
              </p>
              {activeConversation.messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </>
          )}
          {isTyping && (
            <div className="flex w-full justify-start mt-1">
              <div className="max-w-[min(90%,28rem)] rounded-2xl rounded-bl-md bg-surface px-4 py-3 sm:max-w-[min(75%,28rem)]">
                <div className="flex items-center gap-1.5 px-0.5">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60"></span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <NoConversationPlaceholder />
      )}
    </div>
  );
}