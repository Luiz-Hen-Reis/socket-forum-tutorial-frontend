import getTimeFrom from "../utils/get-time-from";
import { Message } from "./TopicRoom";

type MessagesProps = {
  message: Message;
};

export default function MessageBox({ message }: MessagesProps) {
  return (
    <div className={message.author ? "message" : "system-message"}>
      <span>{message.author && `[${getTimeFrom(message.createdAt)}]`}</span>
      <b>{message.author && ` ${message.author.name}: `}</b>
      <span>{message.content}</span>
    </div>
  );
}
