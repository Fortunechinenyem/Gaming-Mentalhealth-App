import { useState } from "react";

import { useAuth } from "@/context/AuthContext";

export default function ChallengeCard({ challenge, onComplete }) {
  const { id, title, description, points, completed } = challenge;
  // const [completed, setCompleted] = useState(challenge.completed);
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
          <p className="text-gray-700 font-semibold mt-2">Points: {points}</p>
        </div>
        <button
          onClick={() => onComplete(id, points)}
          disabled={completed}
          className={`mt-4 px-4 py-2 rounded-lg font-medium transition ${
            completed
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {completed ? "Completed" : "Mark as Complete"}
        </button>
      </li>
    </div>
  );
}
