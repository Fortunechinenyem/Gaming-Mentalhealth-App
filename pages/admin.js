import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/context/AuthContext";
import AdminDashboard from "@/app/components/AdminDashboard"; // Import the AdminDashboard

export default function AdminPanel() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchUserRole = async () => {
        try {
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setIsAdmin(data.role === "admin");
          }
        } catch (err) {
          console.error("Error fetching user role: ", err);
        }
      };

      fetchUserRole();
    }
  }, [user]);

  if (!user) {
    return <p>Please log in to access the Admin Panel.</p>;
  }

  if (!isAdmin) {
    return <p>You are not authorized to access this page.</p>;
  }

  return <AdminDashboard />;
}
