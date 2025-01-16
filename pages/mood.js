import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import Navbar from "@/app/components/Navbar";
import MoodTracker from "@/app/components/MoodTracker";

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
          const moodsRef = collection(db, "moods");
          const querySnapshot = await getDocs(
            query(moodsRef, where("userId", "==", user.uid))
          );

          if (!querySnapshot.empty) {
            const history = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            setMoodHistory(history.sort((a, b) => b.createdAt - a.createdAt)); // Sort by most recent
            setLatestMood(history[0]?.mood || "");
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
    const moodMessages = {
      "😃": "Keep smiling! 🌟 You're doing amazing!",
      "🙂": "Stay positive, even in small ways! 😊",
      "😐": "You're doing great! Stay balanced. 🧘‍♀️",
      "☹️": "It's okay to feel down. Take time for yourself! 💙",
      "😢": "You’re strong. Brighter days are ahead! 🌈",
    };

    return moodMessages[mood] || "How are you feeling today?";
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
                    key={entry.id || index}
                    className="flex justify-between items-center bg-purple-50 p-3 rounded-md shadow-sm"
                  >
                    <span className="text-gray-700">
                      {entry.createdAt?.toDate().toLocaleDateString() ||
                        "Unknown Date"}{" "}
                      - {entry.mood}
                    </span>
                    <span
                      className={`text-lg ${
                        entry.mood === "😃"
                          ? "text-green-600"
                          : entry.mood === "😢"
                          ? "text-blue-600"
                          : "text-gray-600"
                      }`}
                    >
                      {entry.mood}
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
