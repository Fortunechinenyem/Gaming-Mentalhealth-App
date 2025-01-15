import { useState } from "react";

import { collection, addDoc, Timestamp } from "firebase/firestore";

import { db } from "@/firebase";
import { useAuth } from "@/context/AuthContext";

export default function JournalEntry() {
  const [entry, setEntry] = useState("");
  const [message, setMessage] = useState("");
  const handleSave = async () => {
    if (!user) {
      setMessage("You must be logged in to save a journal entry.");
      return;
    }

    if (!entry.trim()) {
      setMessage("Please write something!");
      return;
    }

    try {
      await addDoc(collection(db, "journals"), {
        userId: user.uid,
        entry,
        createdAt: Timestamp.now(),
      });
      setEntry("");
      setMessage("Journal saved successfully!");
    } catch (err) {
      setMessage("Error saving journal: " + err.message);
    }
  };
  const { user } = useAuth();

  return (
    <div className="p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-xl font-bold mb-4">New Journal Entry</h2>
      <textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="Write your thoughts here..."
        className="w-full p-3 border rounded-md focus:outline-none focus:ring"
        rows={5}
      />
      <button
        onClick={handleSave}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Save Entry
      </button>
      {message && <p className="mt-2 text-sm text-green-500">{message}</p>}
    </div>
  );
}
