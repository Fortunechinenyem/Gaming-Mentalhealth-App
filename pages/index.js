import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Footer from "@/app/components/Footer";

export default function Home() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
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

        <section className="mt-12 bg-blue-500 text-white rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Daily Inspiration</h2>
          <p className="text-lg italic">
            "Mental health is not a destination, but a process. It's about how
            you drive, not where you're going." – Noam Shpancer
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-blue-600 text-center mb-4">
            Your Rewards
          </h2>
          <div className="bg-white shadow-md rounded-lg p-6">
            <p className="text-gray-700">
              You've earned{" "}
              <span className="font-bold text-blue-500">150 points</span> this
              week! Keep completing challenges to unlock exciting rewards.
            </p>
            <div className="mt-4 text-center">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Redeem Rewards
              </button>
            </div>
          </div>
        </section>
        <section className="mt-12 bg-green-500 text-white rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Latest Notifications</h2>
          <ul className="list-disc list-inside text-lg">
            <li> New challenges are available! Check them out now.</li>
            <li>
              You've unlocked a special reward for completing 10 challenges.
            </li>
            <li> App update: Improved performance and new features!</li>
          </ul>
        </section>
        <section className="mt-12 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-blue-600 text-center mb-4">
            Your Activity Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="text-xl font-bold text-blue-500">10</h3>
              <p className="text-gray-600">Journal Entries</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-500">8</h3>
              <p className="text-gray-600">Challenges Completed</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-yellow-500">4.5/5</h3>
              <p className="text-gray-600">Mood Trend</p>
            </div>
          </div>
        </section>
        <section className="mt-12 bg-indigo-500 text-white rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Recommended For You</h2>
          <div className="text-lg">
            Based on your recent activity:
            <ul className="list-disc list-inside mt-2">
              <li>Write a new journal entry today.</li>
              <li>Complete the "5-Minute Breathing Exercise" challenge.</li>
              <li>Track your mood to maintain consistency.</li>
            </ul>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
