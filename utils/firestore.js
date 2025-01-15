import { db } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

/**
 * Adds a user to the Firestore database.
 *
 * @param {Object} user
 * @returns {Promise<void>}
 */
export const addUserToFirestore = async (user) => {
  try {
    const userRef = doc(db, "users", user.uid);

    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || "",
      email: user.email,
      points: 0,
      badges: [],
      createdAt: serverTimestamp(),
    });

    console.log("User successfully added to Firestore");
  } catch (error) {
    console.error("Error adding user to Firestore:", error);
    throw error;
  }
};
