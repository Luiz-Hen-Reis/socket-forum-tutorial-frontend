import { Dispatch, SetStateAction } from "react";
import { Topic } from "./Home";

interface TopicsListProps {
  topics: Topic[];
  setTopics: Dispatch<SetStateAction<Topic[]>>;
  setOpenTopic: Dispatch<SetStateAction<Topic | null>>;
}

export default function TopicsList({
  topics,
  setTopics,
  setOpenTopic,
}: TopicsListProps) {
  async function deleteTopic(id: string) {
    await fetch(`http://localhost:3000/topics/${id}`, {
      method: "DELETE",
    });
    const updatedTopics = topics.filter((topic) => topic._id !== id);
    setTopics(updatedTopics);
  }

  return (
    <main id="topics">
      {topics.length === 0 ? (
        <h3>There is no topic here...</h3>
      ) : (
        topics.map((topic) => (
          <div className="topic">
            <h2>{topic.title}</h2>
            <div>
              <button onClick={() => setOpenTopic(topic)}>Enter room</button>
              <button onClick={() => deleteTopic(topic._id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </main>
  );
}
