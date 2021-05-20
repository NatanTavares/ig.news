import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";

import styles from "./styles.module.scss";

export function SignInButton() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);

  return isUserLoggedIn ? (
    <button className={styles.buttonContainer}>
      <FaGithub color="#04D361" />
      Natan Tavares
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button className={styles.buttonContainer}>
      <FaGithub color="#EBA417" />
      Sign in with github
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  );
}
