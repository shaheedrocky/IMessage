import { Avatar } from "@heroui/react";
import { AvatarWithOnlineIndicator } from "./AvatarWithOnlineIndicator";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";

export function ConversationRow({ user, selected, onSelect }) {
  const authUser = useAuthStore((state) => state.authUser);
  const typingStates = useChatStore((state) => state.typingStates || {});
  const isTyping = typingStates[user.id] || false;

  let subtitleContent = null;
  if (isTyping) {
    subtitleContent = <span className="font-medium text-accent animate-pulse">typing...</span>;
  } else if (user.lastMessage && (user.lastMessage.text || user.lastMessage.image || user.lastMessage.video || user.lastMessage.pdf)) {
    const isOwn = String(user.lastMessage.senderId) === String(authUser?._id);
    const prefix = isOwn ? "You: " : "";
    let msgPreview = "";
    if (user.lastMessage.image) {
      msgPreview = "📷 Photo";
    } else if (user.lastMessage.video) {
      msgPreview = "🎥 Video";
    } else if (user.lastMessage.pdf) {
      msgPreview = "📄 PDF";
    } else {
      msgPreview = user.lastMessage.text;
    }
    subtitleContent = <span className="text-muted-foreground">{prefix}{msgPreview}</span>;
  } else {
    subtitleContent = <span className="text-muted-foreground/60 italic">No messages yet</span>;
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-3 border-b border-border px-3 py-2.5 text-left transition-colors duration-150 ${
        selected ? "bg-accent-soft" : "hover:bg-muted/30"
      }`}
    >
      <AvatarWithOnlineIndicator isOnline={user.isOnline ?? true}>
        <Avatar className="size-12 shrink-0">
          <Avatar.Image alt={user.name} src={user.avatarUrl} />
          <Avatar.Fallback className="text-sm font-medium">
            {user.initials}
          </Avatar.Fallback>
        </Avatar>
      </AvatarWithOnlineIndicator>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <p className="truncate text-[15px] font-semibold">{user.name}</p>
          <span className={`text-[11px] font-semibold shrink-0 uppercase tracking-wider ${user.isOnline ? "text-emerald-500" : "text-muted/60"}`}>
            {user.isOnline ? "Online" : "Offline"}
          </span>
        </div>
        <p className="truncate text-xs mt-0.5">
          {subtitleContent}
        </p>
      </div>
    </button>
  );
}
