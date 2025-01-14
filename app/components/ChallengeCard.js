import { useState } from "react";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default function ChallengeCard({ challenge }) {
  const [completed, setCompleted] = useState(challenge.completed);

  const handleComplete = async () => {
    try {
      await updateDoc(doc(db, "challenges", challenge.id), {
        completed: true,
      });
      setCompleted(true);
    } catch (err) {
      console.error("Error completing challenge: ", err.message);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h3 className="text-lg font-bold">{challenge.title}</h3>
      <p className="text-sm text-gray-600">{challenge.description}</p>
      <button
        onClick={handleComplete}
        className={`mt-4 px-4 py-2 text-white rounded-md ${
          completed ? "bg-green-500" : "bg-blue-500"
        }`}
        disabled={completed}
      >
        {completed ? "Completed" : "Mark as Complete"}
      </button>
    </div>
  );
}
