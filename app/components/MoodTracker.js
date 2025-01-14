import { useState } from "react";

import { collection, addDoc, Timestamp } from "firebase/firestore";

import { db } from "@/firebase";
import { useAuth } from "@/context/AuthContext";

const moods = ["😃", "🙂", "😐", "☹️", "😢"];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  const handleSaveMood = async (mood) => {
    try {
      await addDoc(collection(db, "moods"), {
        userId: user.uid,
        mood,
        createdAt: Timestamp.now(),
      });
      setSelectedMood(mood);
      setMessage("Mood saved successfully!");
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
            className={`text-3xl ${selectedMood === mood ? "scale-125" : ""}`}
          >
            {mood}
          </button>
        ))}
      </div>
      {message && <p className="mt-2 text-sm text-green-500">{message}</p>}
    </div>
  );
}
