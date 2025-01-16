import { setDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";

const assignUserRole = async (uid, role) => {
  try {
    await setDoc(doc(db, "users", uid), { role });
  } catch (err) {
    console.error("Error assigning role: ", err);
  }
};

export { assignUserRole };
