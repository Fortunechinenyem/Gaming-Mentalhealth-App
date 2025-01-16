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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMoodHistory = async () => {
      if (user) {
        try {
          const docRef = doc(db, "moods", user.uid); // Adjust collection name as needed
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            const history = data.history || [];
            setMoodHistory(history);
            setLatestMood(history[history.length - 1]?.mood || "");
          } else {
            console.warn("No mood data found for the user.");
          }
        } catch (err) {
          console.error("Error fetching mood history:", err.message);
          setError("Failed to load mood data. Please try again later.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchMoodHistory();
  }, [user]);

  const getEncouragementMessage = (mood) => {
    const moodDetails = {
      happy: "Keep smiling! 🌟 You're doing amazing!",
      sad: "It's okay to feel sad. Tomorrow is a new day! 🌈",
      neutral: "You're doing great! Stay balanced. 🧘‍♀️",
      angry: "Take a deep breath. You’ve got this! 💪",
    };

    return moodDetails[mood] || "How are you feeling today?";
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

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
                Your Mood History
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
