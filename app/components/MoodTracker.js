import { useState } from "react";
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/context/AuthContext";

const moods = ["😃", "🙂", "😐", "☹️", "😢"];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [message, setMessage] = useState("");
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

  const handleSaveMood = async (mood) => {
    if (!user) return setMessage("You need to be logged in to save your mood.");

    try {
      await addDoc(collection(db, "moods"), {
        userId: user.uid,
        mood,
        createdAt: Timestamp.now(),
      });

      await updatePoints(user.uid, 5);

      setSelectedMood(mood);
      setMessage("Mood saved successfully! You've earned 5 points!");
    } catch (err) {
      setMessage("Error saving mood: " + err.message);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-xl font-bold mb-4">How are you feeling today?</h2>
      <div className="flex justify-center space-x-4">
        {moods.map((mood) => (
          <button
            key={mood}
            onClick={() => handleSaveMood(mood)}
            className={`text-3xl transition-transform ${
              selectedMood === mood
                ? "scale-125 text-blue-500"
                : "text-gray-500"
            }`}
          >
            {mood}
          </button>
        ))}
      </div>
      {message && <p className="mt-4 text-sm text-green-500">{message}</p>}
    </div>
  );
}
