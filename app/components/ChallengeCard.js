import { useState } from "react";

import { useAuth } from "@/context/AuthContext";

export default function ChallengeCard({ challenge, onComplete }) {
  const [completed, setCompleted] = useState(challenge.completed);
  const { user } = useAuth();

  const handleComplete = async () => {
    if (completed) return;

    try {
      await onComplete(challenge.id, challenge.points);
      setCompleted(true);
    } catch (err) {
      console.error("Error completing challenge: ", err.message);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <li className="bg-white p-4 rounded-lg shadow-md flex justify-between">
        <div>
          <h3 className="font-bold">{challenge.title}</h3>
          <p>{challenge.description}</p>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => onComplete(challenge.id, challenge.points)}
          disabled={challenge.completed}
        >
          {challenge.completed ? "Completed" : "Complete"}
        </button>
      </li>
    </div>
  );
}
