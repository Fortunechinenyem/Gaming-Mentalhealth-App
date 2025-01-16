import JournalEntry from "@/app/components/JournalEntry";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import Navbar from "@/app/components/Navbar";

export default function JournalPage() {
  const { user } = useAuth();
  const [journalEntries, setJournalEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJournalEntries = async () => {
      if (user) {
        try {
          const journalCollection = collection(
            db,
            "journals",
            user.uid,
            "entries"
          );
          const querySnapshot = await getDocs(journalCollection);
          const entries = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setJournalEntries(entries);
        } catch (err) {
          console.error("Error fetching journal entries:", err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchJournalEntries();
  }, [user]);

  const addDummyEntry = async () => {
    if (user) {
      const entryRef = doc(collection(db, "journals", user.uid, "entries"));
      await setDoc(entryRef, {
        content: "This is a sample journal entry!",
        date: new Date().toISOString(),
      });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-3xl font-bold text-blue-600 text-center mb-4">
              Hello, {user?.displayName || "User"}! ✍️
            </h1>
            <p className="text-center text-lg text-gray-700 mb-6">
              Your journal is a space for reflection and self-discovery.
            </p>
            <JournalEntry />
          </div>

          {loading ? (
            <p className="text-center text-gray-500 mt-6">
              Loading your entries...
            </p>
          ) : journalEntries.length > 0 ? (
            <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
              <h2 className="text-2xl font-bold text-blue-600 text-center mb-4">
                Previous Journal Entries 📖
              </h2>
              <ul className="space-y-4">
                {journalEntries.map((entry) => (
                  <li
                    key={entry.id}
                    className="p-4 bg-blue-50 rounded-md shadow-md border-l-4 border-blue-400"
                  >
                    <p className="text-gray-800 text-md">{entry.content}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center bg-blue-50 rounded-lg p-6 mt-6">
              <p className="text-gray-600">
                No journal entries yet. Start writing your first thoughts!
              </p>
              <button
                onClick={addDummyEntry}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
              >
                Add a Sample Entry (Demo)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
