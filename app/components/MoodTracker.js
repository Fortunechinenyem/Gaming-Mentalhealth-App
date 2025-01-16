import { useState } from "react";
import {
  doc,
  updateDoc,
  increment,
  arrayUnion,
  setDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/context/AuthContext";

const moods = [
  { emoji: "😃", points: 10 },
  { emoji: "🙂", points: 5 },
  { emoji: "😐", points: 0 },
  { emoji: "☹️", points: -5 },
  { emoji: "😢", points: -10 },
];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  const handleSaveMood = async (mood, points) => {
    if (!user) return setMessage("You need to be logged in to save your mood.");

    try {
      const moodRef = doc(db, "moods", user.uid);

      await setDoc(
        moodRef,
        {
          history: arrayUnion({
            mood: mood,
            date: new Date().toISOString(),
          }),
        },
        { merge: true }
      );

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { points: increment(points) });

      setSelectedMood(mood);
      setMessage(`Mood saved successfully! You earned ${points} points!`);
    } catch (err) {
      console.error("Error saving mood:", err.message);
      setMessage("Error saving mood. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-xl font-bold mb-4">How are you feeling today?</h2>
      <div className="flex justify-center space-x-4">
        {moods.map(({ emoji, points }) => (
          <button
            key={emoji}
            onClick={() => handleSaveMood(emoji, points)}
            className={`text-3xl transition-transform ${
              selectedMood === emoji
                ? "scale-125 text-blue-500 bg-gray-200 p-2 rounded-md"
                : "text-gray-500"
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>
      {message && <p className="mt-4 text-sm text-green-500">{message}</p>}
    </div>
  );
}
