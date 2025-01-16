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
