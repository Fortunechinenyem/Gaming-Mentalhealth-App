import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);

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
  }, [user]);

  if (!user) return <p>Please log in to view your profile.</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-600">
        Welcome, {user.displayName || "User"}!
      </h1>
      {userData ? (
        <div>
          <p>Email: {user.email}</p>
          <p>Points: {userData.points || 0}</p>
          <p>Level: {userData.level || 1}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}
