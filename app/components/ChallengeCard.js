import { useState } from "react";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/context/AuthContext";

export default function ChallengeCard({ challenge, onComplete }) {
  const [completed, setCompleted] = useState(challenge.completed);
  const { user } = useAuth();

  const updatePoints = async (userId, points) => {
    const rewardDocRef = doc(db, "rewards", userId);
    try {
      await updateDoc(rewardDocRef, {
        points: increment(points),
      });
    } catch (err) {
      console.error("Error updating points: ", err.message);
    }
  };

  const calculateLevel = (points) => {
    if (points >= 0 && points < 100) return 1;
    if (points >= 100 && points < 250) return 2;
    if (points >= 250) return 3;
    return 0;
  };

  const handleComplete = async () => {
    if (completed) return;
    try {
      await onComplete(challenge.id);
      setCompleted(true);
    } catch (err) {
      console.error("Error completing challenge: ", err.message);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <li className="p-4 bg-white shadow rounded-lg flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{challenge.title}</h3>
          <p className="text-sm text-gray-600">{challenge.description}</p>
        </div>
        <button
          onClick={() => onComplete(challenge.id)}
          className={`px-4 py-2 rounded-md ${
            challenge.completed
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
          disabled={challenge.completed}
        >
          {challenge.completed ? "Completed" : "Complete"}
        </button>
      </li>
    </div>
  );
}
