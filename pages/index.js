import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Footer from "@/app/components/Footer";
import Head from "next/head";
import Navbar from "@/app/components/Navbar";

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
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <Head>
          <title>Welcome to Your Mental Health Journey</title>
          <meta
            name="description"
            content="Join us on a journey to better mental health with guided journaling, mood tracking, and daily challenges."
          />
        </Head>

        <div
          className="relative bg-cover bg-center h-[400px] rounded-lg shadow-lg overflow-hidden"
          style={{ backgroundImage: "url(/images/pix4.jpg)" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white">
            <h1 className="text-4xl font-bold mb-2">
              Hello, {user.displayName || "User"}!
            </h1>
            <p className="text-lg">How are you doing today?</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center mt-10">
          <h2 className="text-3xl font-semibold text-gray-800">
            Come on this journey with us
          </h2>
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-9">
            <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
              <h3 className="text-2xl font-semibold text-blue-500 mb-2">
                Guided Journaling
              </h3>
              <p className="text-gray-600 text-center mb-4">
                Write down your thoughts and feelings in a guided format to gain
                clarity.
              </p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                <Link href="/journal"> Start Journaling</Link>
              </button>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
              <h3 className="text-2xl font-semibold text-green-500 mb-2">
                Mood Tracking
              </h3>
              <p className="text-gray-600 text-center mb-4">
                Track your daily mood to identify patterns and improve your
                well-being.
              </p>
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                <Link href="/mood">Track Mood</Link>
              </button>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
              <h3 className="text-2xl font-semibold text-yellow-500 mb-2">
                Daily Challenges
              </h3>
              <p className="text-gray-600 text-center mb-4">
                Complete fun and uplifting challenges to stay motivated every
                day.
              </p>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                <Link href="/challenges">View Challenges</Link>
              </button>
            </div>
          </section>
        </div>

        <section className="mt-12 bg-blue-500 text-white rounded-lg p-6 text-center">
          <h2 className="text-3xl font-semibold mb-4">Daily Inspiration</h2>
          <p className="text-lg italic">
            "Mental health is not a destination, but a process. It's about how
            you drive, not where you're going." – Noam Shpancer
          </p>
        </section>

        <section className="mt-8 bg-gray-200 rounded-lg p-6 shadow-md text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Coming Soon!
          </h2>
          <ul className="space-y-2 text-gray-600 text-lg">
            <li> Mindfulness Sessions</li>
            <li> Personalized Goal Setting</li>
            <li> Peer Support Groups</li>
            <li> Advanced Analytics for Mood Patterns</li>
          </ul>
        </section>

        <div className="text-center mt-8">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-transform transform hover:scale-105"
          >
            Logout
          </button>
        </div>

        <Footer />
      </div>
    </div>
  );
}
