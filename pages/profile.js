import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/app/components/Navbar";
import Image from "next/image";
import { Hero } from "@/public/images";

export default function Profile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [greeting, setGreeting] = useState("Hello!");
  const [points, setPoints] = useState(0);
  const [journalPoints, setJournalPoints] = useState(0);

  const fetchJournalPoints = async () => {
    if (user) {
      const journalCollection = collection(db, "journals", user.uid, "entries");
      const querySnapshot = await getDocs(journalCollection);

      const totalPoints = querySnapshot.size * 10;
      setJournalPoints(totalPoints);
    }
  };

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
      <div>
        <Image
          src={Hero}
          alt="Hero Image"
          className="w-full h-full object-cover"
          priority
        />
      </div>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-4 text-center">
            {greeting} {user.displayName || "User"}!
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Track your progress, earn points, and celebrate achievements!
          </p>
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
                      className="absolute top-0 left-0 h-4 bg-blue-500 rounded-md transition-all duration-500"
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
                  <div className="flex flex-wrap gap-4 mt-4">
                    {userData.badges?.length > 0 ? (
                      userData.badges.map((badge, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center justify-center w-24 h-24 bg-yellow-100 rounded-lg shadow-md hover:scale-105 transition-transform"
                        >
                          <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center mb-2">
                            <span className="text-xl text-yellow-800">🏆</span>
                          </div>
                          <p className="text-sm text-yellow-800 font-semibold text-center">
                            {badge}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">
                        No achievements yet. Keep going!
                      </p>
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
