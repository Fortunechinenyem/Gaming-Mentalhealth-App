import MoodTracker from "@/app/components/MoodTracker";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Navbar from "@/app/components/Navbar";

export default function MoodPage() {
  const { user } = useAuth();
  const [moodHistory, setMoodHistory] = useState([]);
  const [latestMood, setLatestMood] = useState("");

  useEffect(() => {
    const fetchMoodHistory = async () => {
      if (user) {
        try {
          const docRef = doc(db, "moods", user.uid); // Adjust collection name as needed
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setMoodHistory(data.history || []);
            setLatestMood(data.history?.[data.history.length - 1]?.mood || "");
          }
        } catch (err) {
          console.error("Error fetching mood history:", err.message);
        }
      }
    };

    fetchMoodHistory();
  }, [user]);

  const getEncouragementMessage = (mood) => {
    if (mood === "happy") return "Keep smiling! 🌟 You're doing amazing!";
    if (mood === "sad")
      return "It's okay to feel sad. Tomorrow is a new day! 🌈";
    if (mood === "neutral") return "You're doing great! Stay balanced. 🧘‍♀️";
    if (mood === "angry") return "Take a deep breath. You’ve got this! 💪";
    return "How are you feeling today?";
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-purple-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-3xl font-bold text-purple-600 text-center mb-4">
              Hello, {user?.displayName || "User"}! 😊
            </h1>
            <p className="text-center text-lg text-gray-700 mb-6">
              How are you feeling today? Track your mood and reflect on your
              journey.
            </p>
            {latestMood && (
              <div className="text-center mb-6">
                <p className="text-xl text-gray-700 mb-2">
                  Your latest mood: <strong>{latestMood}</strong>
                </p>
                <p className="text-md text-gray-600">
                  {getEncouragementMessage(latestMood)}
                </p>
              </div>
            )}
            <MoodTracker />
          </div>

          {moodHistory.length > 0 && (
            <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
              <h2 className="text-2xl font-bold text-purple-600 text-center mb-4">
                Your Mood History 📊
              </h2>
              <ul className="space-y-2">
                {moodHistory.map((entry, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-purple-50 p-3 rounded-md shadow-sm"
                  >
                    <span className="text-gray-700">
                      {new Date(entry.date).toLocaleDateString()} - {entry.mood}
                    </span>
                    <span
                      className={`text-lg ${
                        entry.mood === "happy"
                          ? "text-green-600"
                          : entry.mood === "sad"
                          ? "text-blue-600"
                          : entry.mood === "angry"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {entry.mood === "happy" && "😊"}
                      {entry.mood === "sad" && "😢"}
                      {entry.mood === "neutral" && "😐"}
                      {entry.mood === "angry" && "😠"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
