import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Footer from "@/app/components/Footer";

export default function Home() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [rewards, setRewards] = useState({ points: 0, level: 1, badges: [] });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }

    if (user) {
      const fetchRewards = async () => {
        const rewardDocRef = doc(db, "rewards", user.uid);
        const rewardSnapshot = await getDoc(rewardDocRef);
        if (rewardSnapshot.exists()) {
          setRewards(rewardSnapshot.data());
        } else {
          setRewards({ points: 0, level: 1, badges: [] }); // Default rewards for new users
        }
      };
      fetchRewards();
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-300 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">
            Welcome Back, {user.displayName || "User"}!
          </h1>
          <p className="text-lg text-gray-700 mt-2">
            Your mental health journey starts here. Let's grow, reflect, and
            thrive together.
          </p>
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-9">
          <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
            <h2 className="text-xl font-semibold text-blue-500 mb-2">
              Guided Journaling
            </h2>
            <p className="text-gray-600 text-center mb-4">
              Write down your thoughts and feelings in a guided format to gain
              clarity.
            </p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              <Link href="/journal"> Start Journaling</Link>
            </button>
          </div>

          <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
            <h2 className="text-xl font-semibold text-green-500 mb-2">
              Mood Tracking
            </h2>
            <p className="text-gray-600 text-center mb-4">
              Track your daily mood to identify patterns and improve your
              well-being.
            </p>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              <Link href="/mood">Track Mood</Link>
            </button>
          </div>

          <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
            <h2 className="text-xl font-semibold text-yellow-500 mb-2">
              Daily Challenges
            </h2>
            <p className="text-gray-600 text-center mb-4">
              Complete fun and uplifting challenges to stay motivated every day.
            </p>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
              <Link href="/challenges">View Challenges</Link>
            </button>
          </div>
        </section>

        <section className="mt-12">
          <div className="p-6 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-bold mb-4">Your Rewards</h2>
            <p>
              Points:{" "}
              <span className="text-blue-500 font-bold">{rewards.points}</span>
            </p>
            <p>
              Level:{" "}
              <span className="text-green-500 font-bold">{rewards.level}</span>
            </p>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Badges:</h3>
              <ul className="flex space-x-2">
                {rewards.badges.length > 0 ? (
                  rewards.badges.map((badge, index) => (
                    <li key={index} className="bg-gray-100 p-2 rounded text-sm">
                      {badge}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 italic">No badges yet</li>
                )}
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-12 bg-blue-500 text-white rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Daily Inspiration</h2>
          <p className="text-lg italic">
            "Mental health is not a destination, but a process. It's about how
            you drive, not where you're going." – Noam Shpancer
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
}
