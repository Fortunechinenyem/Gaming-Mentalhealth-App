import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/app/components/Navbar";

export default function Profile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [greeting, setGreeting] = useState("Welcome!");
  const [points, setPoints] = useState(0); // Add points state

  useEffect(() => {
    const fetchUserPoints = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setPoints(docSnap.data().points || 0); // Set points using the new state
        }
      }
    };
    fetchUserPoints();
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      }
    };

    fetchData();

    const currentHour = new Date().getHours();
    if (currentHour < 12) setGreeting("Good Morning! 🌞");
    else if (currentHour < 18) setGreeting("Good Afternoon! 🌤");
    else setGreeting("Good Evening! 🌙");
  }, [user]);

  if (!user) return <p>Please log in to view your profile.</p>;

  return (
    <div>
      <Navbar />
      <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          {greeting} {user.displayName || "User"}!
        </h1>
        {userData ? (
          <div className="space-y-4">
            <p className="text-lg">
              <span className="font-semibold text-gray-700">Email:</span>{" "}
              {user.email}
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <p className="font-semibold text-gray-700">Points:</p>
                <div className="relative w-full h-4 bg-gray-200 rounded-md mt-2">
                  <div
                    className="absolute top-0 left-0 h-4 bg-blue-500 rounded-md"
                    style={{
                      width: `${(points / (userData.level * 100)) * 100 || 0}%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {points} / {userData.level * 100} points to next level
                </p>
              </div>
            </div>
            <p className="text-lg">
              <span className="font-semibold text-gray-700">Level:</span>{" "}
              {userData.level || 1}
            </p>
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                Achievements
              </h2>
              <div className="flex flex-wrap space-x-2">
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
        ) : (
          <p className="text-gray-500">Loading user data...</p>
        )}
      </div>
    </div>
  );
}
