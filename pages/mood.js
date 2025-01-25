// import MoodTracker from "@/app/components/MoodTracker";
// import { useAuth } from "@/context/AuthContext";
// import { useEffect, useState } from "react";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "@/firebase";
// import Navbar from "@/app/components/Navbar";

// export default function MoodPage() {
//   const { user } = useAuth();
//   const [moodHistory, setMoodHistory] = useState([]);
//   const [latestMood, setLatestMood] = useState("");

//   useEffect(() => {
//     const fetchMoodHistory = async () => {
//       if (user) {
//         try {
//           const docRef = doc(db, "moods", user.uid); // Adjust collection name as needed
//           const docSnap = await getDoc(docRef);

//           if (docSnap.exists()) {
//             const data = docSnap.data();
//             setMoodHistory(data.history || []);
//             setLatestMood(data.history?.[data.history.length - 1]?.mood || "");
//           }
//         } catch (err) {
//           console.error("Error fetching mood history:", err.message);
//         }
//       }
//     };

//     fetchMoodHistory();
//   }, [user]);

//   const getEncouragementMessage = (mood) => {
//     const moodDetails = {
//       happy: {
//         message: "Keep smiling! 🌟 You're doing amazing!",
//       },
//       sad: {
//         message: "It's okay to feel sad. Tomorrow is a new day! 🌈",
//       },
//       neutral: {
//         message: "You're doing great! Stay balanced. 🧘‍♀️",
//       },
//       angry: {
//         message: "Take a deep breath. You’ve got this! 💪",
//       },
//     };

//     return moodDetails[mood]?.message || "How are you feeling today?";
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="min-h-screen bg-gradient-to-b from-purple-100 to-purple-50 p-6">
//         <div className="max-w-3xl mx-auto">
//           <div className="bg-white shadow-lg rounded-lg p-6">
//             <h1 className="text-3xl font-bold text-purple-600 text-center mb-4">
//               Hello, {user?.displayName || "User"}! 😊
//             </h1>
//             <p className="text-center text-lg text-gray-700 mb-6">
//               How are you feeling today? Track your mood and reflect on your
//               journey.
//             </p>
//             {latestMood && (
//               <div className="text-center mb-6">
//                 <p className="text-xl text-gray-700 mb-2">
//                   Your latest mood: <strong>{latestMood}</strong>
//                 </p>
//                 <p className="text-md text-gray-600">
//                   {getEncouragementMessage(latestMood)}
//                 </p>
//               </div>
//             )}
//             <MoodTracker />
//           </div>

//           {moodHistory.length > 0 && (
//             <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
//               <h2 className="text-2xl font-bold text-purple-600 text-center mb-4">
//                 Your Mood History 📊
//               </h2>
//               <ul className="space-y-2">
//                 {moodHistory.map((entry, index) => (
//                   <li
//                     key={index}
//                     className="flex justify-between items-center bg-purple-50 p-3 rounded-md shadow-sm"
//                   >
//                     <span className="text-gray-700">
//                       {new Date(entry.date).toLocaleDateString()} - {entry.mood}
//                     </span>
//                     <span
//                       className={`text-lg ${
//                         entry.mood === "happy"
//                           ? "text-green-600"
//                           : entry.mood === "sad"
//                           ? "text-blue-600"
//                           : entry.mood === "angry"
//                           ? "text-red-600"
//                           : "text-gray-600"
//                       }`}
//                     >
//                       {entry.mood === "happy" && "😊"}
//                       {entry.mood === "sad" && "😢"}
//                       {entry.mood === "neutral" && "😐"}
//                       {entry.mood === "angry" && "😠"}
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import Navbar from "@/app/components/Navbar";
import MoodTracker from "@/app/components/MoodTracker";

export default function MoodPage({ entries = [] }) {
  const { user } = useAuth();
  const [moodHistory, setMoodHistory] = useState([]);
  const [latestMood, setLatestMood] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMoodHistory = async () => {
      try {
        console.log("Fetching moods for user:", user?.uid);

        const moodsRef = collection(db, "moods");
        const q = query(moodsRef, where("userId", "==", user?.uid));
        const querySnapshot = await getDocs(q);

        console.log("Fetched documents:", querySnapshot.docs);

        const moods = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMoodHistory(moods);
      } catch (error) {
        console.error("Error fetching mood history:", error.message);
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
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h1 className="text-3xl font-bold text-purple-600 text-center mb-4">
              Hello, {user?.displayName || "User"}! 😊
            </h1>
            <p className="text-center text-lg text-gray-700 mb-6">
              How are you feeling today? Track your mood and reflect on your
              journey.
            </p>

            {latestMood ? (
              <div className="text-center mb-6">
                <p className="text-xl text-gray-700 mb-2">
                  Your latest mood: <strong>{latestMood}</strong>
                </p>
                <p className="text-md text-gray-600">
                  {getEncouragementMessage(latestMood)}
                </p>
              </div>
            ) : (
              <p className="text-center text-gray-500 mb-6">
                No recent mood entries. How are you feeling today?
              </p>
            )}

            <MoodTracker onMoodSelect={(mood) => setLatestMood(mood)} />
          </div>

          {moodHistory.length > 0 ? (
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
                      {entry.createdAt.toLocaleDateString()} - {entry.mood}
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
          ) : (
            <p className="text-center text-gray-500 mt-6">
              No mood history yet. Start tracking today!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const moodsRef = collection(db, "moodEntries");
    const querySnapshot = await getDocs(moodsRef);

    const entries = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        content: data.content || "",
        date: data.date?.toDate().toISOString() || new Date().toISOString(),
      };
    });

    return {
      props: {
        entries,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        entries: [],
      },
    };
  }
}
