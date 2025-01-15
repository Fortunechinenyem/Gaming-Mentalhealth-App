import { useEffect } from "react";

import { addUserToFirestore } from "../utils/firestore";
import { useAuth } from "./context/AuthContext";

const AuthHandler = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      addUserToFirestore(user);
    }
  }, [user]);

  return null;
};

export default AuthHandler;
