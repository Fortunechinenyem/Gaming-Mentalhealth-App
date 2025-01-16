import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/app/components/Navbar";

export default function Profile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [greeting, setGreeting] = useState("Hello!");
  const [points, setPoints] = useState(0);
  const [journalPoints, setJournalPoints] = useState(0);

  // Fetch points from the user's journal entries
  const fetchJournalPoints = async () => {
    if (user) {
      const journalCollection = collection(db, "journals", user.uid, "entries");
      const querySnapshot = await getDocs(journalCollection);

      // Assume each journal entry is worth 10 points
      const totalPoints = querySnapshot.size * 10;
      setJournalPoints(totalPoints);
    }
  };

  // Fetch user data and calculate total points
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUserData(userSnap.data());
            setPoints(userSnap.data().points || 0);
          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      }
    };

    fetchUserData();
    fetchJournalPoints();

    const currentHour = new Date().getHours();
    if (currentHour < 12) setGreeting("Good Morning! 🌞");
    else if (currentHour < 18) setGreeting("Good Afternoon! 🌤");
    else setGreeting("Good Evening! 🌙");
  }, [user]);

  const totalPoints = points + journalPoints;

  if (!user) return <p>Please log in to view your profile.</p>;

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-4 text-center">
            {greeting} {user.displayName || "User"}!
          </h1>
          {userData ? (
            <div className="space-y-6">
              <div className="text-lg text-gray-700">
                <p>
                  <span className="font-semibold">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-semibold">Level:</span>{" "}
                  {userData.level || 1}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-700">Points:</p>
                  <div className="relative w-full h-4 bg-gray-200 rounded-md mt-2">
                    <div
                      className="absolute top-0 left-0 h-4 bg-blue-500 rounded-md"
                      style={{
                        width: `${
                          (totalPoints / (userData.level * 100)) * 100 || 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {totalPoints} / {userData.level * 100} points to next level
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-700">
                    Achievements
                  </h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userData.badges?.length > 0 ? (
                      userData.badges.map((badge, index) => (
                        <span
                          key={index}
                          className="inline-block px-3 py-1 bg-yellow-200 text-yellow-800 text-sm rounded-full"
                        >
                          {badge}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">No achievements yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center">Loading user data...</p>
          )}
        </div>
      </div>
    </div>
  );
}
