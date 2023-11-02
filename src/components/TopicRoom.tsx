import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useContext,
  useState,
  useEffect,
} from "react";
import { Topic } from "./Home";
import io from "socket.io-client";
import { User, UserContext } from "../App";
import MessageBox from "./MessageBox";

interface TopicRoomProps {
  topic: Topic;
  setOpenTopic: Dispatch<SetStateAction<Topic | null>>;
}

const socket = io("ws://localhost:3000");

export interface Message {
  _id: string;
  content: string;
  author?: User;
  createdAt: string;
}

export default function TopicRoom({ topic, setOpenTopic }: TopicRoomProps) {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    socket.emit("join_room", { name: user?.name, topicId: topic._id });

    socket.on("new_message", (newMessage: Message) => {
      setMessages((mostRecentState) => [...mostRecentState, newMessage]);
    });

    return () => {
      socket.emit("leave_room", { name: user?.name, topicId: topic._id });
      socket.off("new_message");
    };
  }, [socket]);

  async function loadMessages() {
    const data = await fetch(`http://localhost:3000/topics/${topic._id}`).then(
      (res) => res.json()
    );

    setMessages(data.messages);
  }

  async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();

    const formData = new FormData(ev.currentTarget);
    const content = formData.get("message")!.toString();
    ev.currentTarget.reset();

    socket.emit("send_message", { content, author: user, topicId: topic._id });
  }

  return (
    <main className="room">
      <header>{topic.title}</header>
      <button onClick={() => setOpenTopic(null)}>back</button>

      <section className="messages">
        {messages.map((message) => (
          <MessageBox key={message._id} message={message} />
        ))}
      </section>

      <form className="send-message-form inline-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="message"
          id="message"
          placeholder="type your message..."
          required
        />
        <button>send</button>
      </form>
    </main>
  );
}
