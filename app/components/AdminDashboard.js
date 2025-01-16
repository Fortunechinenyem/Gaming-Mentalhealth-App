import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
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
  const handleAddChallenge = async () => {
    if (
      !newChallenge.title ||
      !newChallenge.description ||
      newChallenge.points <= 0
    ) {
      alert("All fields are required and points must be greater than 0.");
      return;
    }

    try {
      await addDoc(collection(db, "challenges"), newChallenge);
      setChallenges((prevChallenges) => [
        ...prevChallenges,
        { ...newChallenge, id: Date.now().toString() },
      ]);
      setIsAdding(false);
      setNewChallenge({ title: "", description: "", points: 0 });
    } catch (err) {
      console.error("Error adding challenge:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-semibold text-blue-600 mb-6">
        Admin Dashboard
      </h2>

      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-4">Assign User Role</h3>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="px-4 py-2 border rounded-md w-1/3"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-4 py-2 border rounded-md w-1/3"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={handleRoleAssignment}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Assign Role
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-4">Add New Challenge</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Add Challenge
        </button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Challenges</h3>
        <ul className="space-y-4">
          {challenges.map((challenge) => (
            <li
              key={challenge.id}
              className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm"
            >
              <div>
                <p className="font-semibold">{challenge.title}</p>
                <p className="text-sm text-gray-600">{challenge.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  onClick={() => handleEdit(challenge)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Edit Challenge</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={newChallenge.title}
                onChange={(e) =>
                  setNewChallenge({ ...newChallenge, title: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md"
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
                className="w-full px-4 py-2 border rounded-md"
              />
              <input
                type="number"
                placeholder="Points"
                value={newChallenge.points}
                onChange={(e) =>
                  setNewChallenge({ ...newChallenge, points: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={handleSaveEdit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
