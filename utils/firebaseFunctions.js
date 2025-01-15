import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export const fetchUserData = async (user) => {
  try {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.error("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    throw error;
  }
};
