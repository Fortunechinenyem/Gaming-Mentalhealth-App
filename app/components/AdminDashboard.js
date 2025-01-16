import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { assignUserRole } from "@/utils/roleUtils";

export default function AdminDashboard() {
  const [challenges, setChallenges] = useState([]);
  const [newChallenge, setNewChallenge] = useState({
    title: "",
    description: "",
    points: 0,
  });
  const [editChallenge, setEditChallenge] = useState(null); // Store the challenge being edited
  const [isEditing, setIsEditing] = useState(false); // Track whether we're editing a challenge

  const [role, setRole] = useState("user");
  const [userId, setUserId] = useState("");

  const handleRoleAssignment = async () => {
    if (userId && role) {
      await assignUserRole(userId, role);
      alert(`Role ${role} assigned to user ${userId}`);
    } else {
      alert("Please enter both user ID and role.");
    }
  };

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "challenges"));
        const challengesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChallenges(challengesData);
      } catch (err) {
        console.error("Error fetching challenges:", err);
      }
    };

    fetchChallenges();
  }, []);

  const handleEdit = (challenge) => {
    setEditChallenge(challenge);
    setNewChallenge({
      title: challenge.title,
      description: challenge.description,
      points: challenge.points,
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (
      !newChallenge.title ||
      !newChallenge.description ||
      newChallenge.points <= 0
    ) {
      alert("All fields are required and points must be greater than 0.");
      return;
    }

    try {
      const challengeRef = doc(db, "challenges", editChallenge.id);
      await updateDoc(challengeRef, {
        title: newChallenge.title,
        description: newChallenge.description,
        points: newChallenge.points,
      });
      setChallenges((prevChallenges) =>
        prevChallenges.map((challenge) =>
          challenge.id === editChallenge.id
            ? { ...challenge, ...newChallenge }
            : challenge
        )
      );
      setIsEditing(false);
      setEditChallenge(null);
    } catch (err) {
      console.error("Error updating challenge:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "challenges", id));
      setChallenges((prevChallenges) =>
        prevChallenges.filter((challenge) => challenge.id !== id)
      );
    } catch (err) {
      console.error("Error deleting challenge:", err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-blue-600 mb-4">Admin Dashboard</h2>
      <div>
        <div className="mt-7 mb-7">
          <input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <select onChange={(e) => setRole(e.target.value)} value={role}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={handleRoleAssignment}>Assign Role</button>
        </div>
        <h3 className="text-lg font-semibold">Challenges</h3>
        <ul>
          {challenges.map((challenge) => (
            <li
              key={challenge.id}
              className="flex justify-between items-center py-2"
            >
              <div>
                <p className="font-semibold">{challenge.title}</p>
                <p className="text-sm text-gray-500">{challenge.description}</p>
              </div>
              <div>
                <button
                  className="bg-blue-500 text-white py-1 px-3 rounded-md"
                  onClick={() => handleEdit(challenge)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white py-1 px-3 rounded-md ml-2"
                  onClick={() => handleDelete(challenge.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h3 className="text-xl font-semibold">Edit Challenge</h3>
            <div>
              <input
                type="text"
                placeholder="Title"
                value={newChallenge.title}
                onChange={(e) =>
                  setNewChallenge({ ...newChallenge, title: e.target.value })
                }
                className="mt-2 p-2 w-full border rounded-md"
              />
              <textarea
                placeholder="Description"
                value={newChallenge.description}
                onChange={(e) =>
                  setNewChallenge({
                    ...newChallenge,
                    description: e.target.value,
                  })
                }
                className="mt-2 p-2 w-full border rounded-md"
              />
              <input
                type="number"
                placeholder="Points"
                value={newChallenge.points}
                onChange={(e) =>
                  setNewChallenge({ ...newChallenge, points: e.target.value })
                }
                className="mt-2 p-2 w-full border rounded-md"
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-gray-500 text-white py-1 px-3 rounded-md"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white py-1 px-3 rounded-md"
                onClick={handleSaveEdit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
