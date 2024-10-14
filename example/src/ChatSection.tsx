import { useState } from "react";
import {
  type DocumentWithHighlightsAndComments,
  type Comment,
  MAIN_ROOM_ID,
  useRoom,
} from "./utils/dbUtils";

import styles from "./ChatSection.module.css";
import { timeSince } from "./utils/utils";
import { Editor } from "./editor/Editor";
import { $getRoot } from "lexical";

type Props = {
  roomId: string;
  username: string;
  color: string;
  currentDocument?: DocumentWithHighlightsAndComments;
};

export default function Chat({
  roomId = MAIN_ROOM_ID,
  username,
  color,
  currentDocument,
}: Props) {
  const room = useRoom(roomId);
  const user = {
    name: username,
    color: color,
  };

  room.useSyncPresence(user);

  const presence = room.usePresence();

  const { active } = room.useTypingIndicator("chat");

  const peers = Object.values(presence.peers).filter(
    (p) => p.name !== username,
  );
  const activeMap = Object.fromEntries(
    active.map((activePeer) => [activePeer.name, activePeer]),
  );

  const [message, setMessage] = useState("");

  // const handleSendMessage = () => {
  //     if (message.trim()) {
  //         const newComment: CreateCommentDraft = {
  //             text: message,
  //             emoji: "💬", // You can change this or make it dynamic
  //             userId: username,
  //             userName: username
  //         };

  //         addDocumentComment(newComment, currentDocument?.id);
  //         setMessage('');
  //     }
  // };

  return (
    <div className={styles.container}>
      {currentDocument?.name ?? "untitled document"}
      <div className={styles.sideContainer} key={crypto.randomUUID()}>
        {peers.map((peer) => {
          return (
            <div
              key={crypto.randomUUID()}
              className={styles.avatarContainer}
              style={{
                borderColor: peer.color,
              }}
            >
              {peer.name?.slice(0, 1)}
              {activeMap[peer.name] ? (
                <div className={styles.typingIndicator}>⋯</div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className={styles.chatMessages}>
        {currentDocument?.comments?.map((comment: Comment) => (
          <div
            key={crypto.randomUUID()}
            className={`${styles.message} ${comment.userId === username ? styles.myMessage : styles.otherMessage}`}
          >
            <strong>{comment.userId}: </strong>
            {comment.text}
            <span className={styles.timestamp}>
              {timeSince(comment.createdAt)}
            </span>
          </div>
        ))}
      </div>
      <div key="main" className={styles.mainContainer}>
        <div className={styles.editorWrapper}>
          <Editor
            placeholder="Compose your message here..."
            value={message}
            onChange={(editorState) =>
              setMessage(editorState.read(() => $getRoot().getTextContent()))
            }
          />
        </div>

        <div className={styles.typingInfo}>
          {active.length ? typingInfo(active) : <>&nbsp;</>}
        </div>
      </div>
    </div>
  );
}

function typingInfo(typing: { name: string }[]) {
  if (typing.length === 0) return null;
  if (typing.length === 1) return `${typing[0].name} is typing...`;
  if (typing.length === 2)
    return `${typing[0].name} and ${typing[1].name} are typing...`;

  return `${typing[0].name} and ${typing.length - 1} others are typing...`;
}
