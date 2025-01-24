import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import ChallengeCard from "@/app/components/ChallengeCard";
import Navbar from "@/app/components/Navbar";
import { db } from "@/firebase";
import { getAuth } from "firebase/auth";
import { increment } from "firebase/firestore";

export default function DailyChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "challenges"));
        const challengesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          completed: doc.data().completed || false, // Ensure default value
        }));
        setChallenges(challengesData);
      } catch (err) {
        setError("Failed to fetch challenges.");
      }
    };

    fetchChallenges();
  }, []);

  const handleComplete = async (id, points) => {
    try {
      const challengeRef = doc(db, "challenges", id);
      await updateDoc(challengeRef, { completed: true });

      const userId = getAuth().currentUser?.uid;
      if (!userId) {
        setError("User is not authenticated.");
        return;
      }
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { points: increment(points) });

      setChallenges((prev) =>
        prev.map((challenge) =>
          challenge.id === id ? { ...challenge, completed: true } : challenge
        )
      );
    } catch (err) {
      setError("Failed to mark as completed.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="bg-green-50 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-green-600 mb-4">
          Daily Challenges
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {challenges.length === 0 ? (
          <p className="text-gray-500">No challenges available.</p>
        ) : (
          <ul className="space-y-4">
            {challenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onComplete={handleComplete}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
