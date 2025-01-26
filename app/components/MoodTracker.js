import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/context/AuthContext";

const moods = [
  { emoji: "😃", points: 10 },
  { emoji: "🙂", points: 5 },
  { emoji: "😐", points: 0 },
  { emoji: "☹️", points: -5 },
  { emoji: "😢", points: -10 },
];

export default function MoodTracker({ onMoodSaved }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  const handleSaveMood = async (emoji, points) => {
    if (!user || !user.uid) {
      console.error("User is not authenticated.");
      setMessage("Please log in to save your mood.");
      return;
    }

    const moodData = {
      mood: emoji,
      points: points || 0,
      userId: user.uid,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "users", user.uid, "moods"), moodData);
      setMessage("Mood saved successfully!");
      setSelectedMood(emoji);

      onMoodSaved({ mood: emoji, points, date: new Date().toISOString() });
    } catch (error) {
      setMessage(`Error saving mood: ${error.message}`);
      console.error("Error saving mood:", error.message);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-xl font-bold mb-4">How are you feeling today?</h2>
      <div className="flex justify-center space-x-4">
        {moods.map(({ emoji, points }) => (
          <button
            key={emoji}
            onClick={() => {
              setSelectedMood(emoji);
              handleSaveMood(emoji, points);
            }}
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
