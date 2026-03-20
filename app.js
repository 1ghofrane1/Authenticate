import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Ã¢â€â‚¬Ã¢â€â‚¬ 1. Configuration Firebase

const firebaseConfig = {
  apiKey: "AIzaSyB1jeyimqrx2-HQxbJPJAR9qGkyQTiiXm8",
  authDomain: "auth-6e70e.firebaseapp.com",
  projectId: "auth-6e70e",
  storageBucket: "auth-6e70e.firebasestorage.app",
  messagingSenderId: "133963802823",
  appId: "1:133963802823:web:f5a543c7fe015f3b5b36e2",
  measurementId: "G-5YMR8Z724F"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Ã¢â€â‚¬Ã¢â€â‚¬ 2. Utilitaires UI 

/**
 * Affiche un message dans un ÃƒÂ©lÃƒÂ©ment identifiÃƒÂ©.
 * @param {string} elementId  Ã¢â‚¬â€œ id de l'ÃƒÂ©lÃƒÂ©ment cible
 * @param {string} text       Ã¢â‚¬â€œ texte ÃƒÂ  afficher
 * @param {""|"error"|"success"} type Ã¢â‚¬â€œ classe CSS appliquÃƒÂ©e
 */
function setMessage(elementId, text, type = "") {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = text;
  el.classList.remove("error", "success");
  if (type) el.classList.add(type);
}

/** Valide sommairement une adresse e-mail. */
function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

/**
 * Traduit les codes d'erreur Firebase en messages lisibles.
 * @param {import("firebase/auth").AuthError} error
 * @returns {string}
 */
function firebaseErrorMessage(error) {
  switch (error.code) {
    case "auth/invalid-email":
      return "L'adresse e-mail saisie n'est pas valide.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "E-mail ou mot de passe incorrect.";
    case "auth/email-already-in-use":
      return "Un compte existe deja avec cette adresse e-mail.";
    case "auth/weak-password":
      return "Le mot de passe est trop faible (6 caracteres minimum).";
    case "auth/too-many-requests":
      return "Trop de tentatives. Veuillez reessayer plus tard.";
    case "auth/network-request-failed":
      return "Erreur reseau. Verifiez votre connexion.";
    case "auth/popup-closed-by-user":
      return "La fenetre de connexion a ete fermee avant la fin.";
    case "auth/unauthorized-domain":
      return "Ce domaine n'est pas autorise dans Firebase Authentication. Ajoutez-le dans Authentication > Settings > Authorized domains.";
    default:
      return `Erreur inattendue : ${error.message}`;
  }
}

// Ã¢â€â‚¬Ã¢â€â‚¬ 3. Initialisation selon la page

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;

  // Ã¢â€â‚¬Ã¢â€â‚¬ Page : connexion (login) 
  if (page === "login") {
    const loginForm = document.getElementById("login-form");

    loginForm?.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email    = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value.trim();

      // Validation cÃƒÂ´tÃƒÂ© client
      if (!email || !password) {
        setMessage("login-message", "Veuillez renseigner l'e-mail et le mot de passe.", "error");
        return;
      }
      if (!isValidEmail(email)) {
        setMessage("login-message", "L'adresse e-mail saisie n'est pas valide.", "error");
        return;
      }

      setMessage("login-message", "Connexion en coursÃ¢â‚¬Â¦");

      try {
        await signInWithEmailAndPassword(auth, email, password);
        // onAuthStateChanged prendra le relais ; on redirige immÃƒÂ©diatement.
        setMessage("login-message", "Connexion rÃƒÂ©ussie ! RedirectionÃ¢â‚¬Â¦", "success");
        window.location.href = "dashboard.html";
      } catch (error) {
        setMessage("login-message", firebaseErrorMessage(error), "error");
      }
    });

    // Bouton "Se connecter avec Google" (Partie 6 Ã¢â‚¬â€œ optionnel)
    const googleBtn = document.getElementById("google-signin-button");
    if (googleBtn) {
      googleBtn.addEventListener("click", async () => {
        const provider = new GoogleAuthProvider();
        try {
          await signInWithPopup(auth, provider);
          window.location.href = "dashboard.html";
        } catch (error) {
          setMessage("login-message", firebaseErrorMessage(error), "error");
        }
      });
    }
  }

  // Ã¢â€â‚¬Ã¢â€â‚¬ Page : inscription (register)
  if (page === "register") {
    const registerForm = document.getElementById("register-form");

    registerForm?.addEventListener("submit", async (event) => {
      event.preventDefault();

      const name            = document.getElementById("register-name").value.trim();
      const email           = document.getElementById("register-email").value.trim();
      const password        = document.getElementById("register-password").value;
      const passwordConfirm = document.getElementById("register-password-confirm").value;

      // Validation cÃƒÂ´tÃƒÂ© client
      if (!name || !email || !password || !passwordConfirm) {
        setMessage("register-message", "Tous les champs sont obligatoires.", "error");
        return;
      }
      if (!isValidEmail(email)) {
        setMessage("register-message", "L'adresse e-mail saisie n'est pas valide.", "error");
        return;
      }
      if (password.length < 6) {
        setMessage("register-message", "Le mot de passe doit comporter au moins 6 caractÃƒÂ¨res.", "error");
        return;
      }
      if (password !== passwordConfirm) {
        setMessage("register-message", "Les mots de passe ne correspondent pas.", "error");
        return;
      }

      setMessage("register-message", "CrÃƒÂ©ation du compte en coursÃ¢â‚¬Â¦");

      try {
        // CrÃƒÂ©ation du compte Ã¢â€ â€™ l'utilisateur est automatiquement connectÃƒÂ©
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Enregistrement du nom d'affichage dans le profil Firebase
        await updateProfile(userCredential.user, { displayName: name });

        setMessage("register-message", "Compte crÃƒÂ©ÃƒÂ© avec succÃƒÂ¨s ! RedirectionÃ¢â‚¬Â¦", "success");
        window.location.href = "dashboard.html";
      } catch (error) {
        setMessage("register-message", firebaseErrorMessage(error), "error");
      }
    });
  }

  // Ã¢â€â‚¬Ã¢â€â‚¬ Page : mot de passe oubliÃƒÂ© (forgot-password) 
  if (page === "forgot-password") {
    const forgotForm = document.getElementById("forgot-password-form");

    forgotForm?.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.getElementById("forgot-email").value.trim();

      if (!email) {
        setMessage("forgot-message", "Veuillez saisir votre adresse e-mail.", "error");
        return;
      }
      if (!isValidEmail(email)) {
        setMessage("forgot-message", "L'adresse e-mail saisie n'est pas valide.", "error");
        return;
      }

      setMessage("forgot-message", "Envoi en coursÃ¢â‚¬Â¦");

      try {
        const methods = await fetchSignInMethodsForEmail(auth, email);

        if (methods.includes("google.com") && !methods.includes("password")) {
          setMessage(
            "forgot-message",
            "Cette adresse utilise Google pour se connecter. Utilisez le bouton \"Se connecter avec Google\".",
            "error"
          );
          return;
        }

        await sendPasswordResetEmail(auth, email);
        setMessage(
          "forgot-message",
          "Si cette adresse est connue, un e-mail de reinitialisation vient d'etre envoye.",
          "success"
        );
      } catch (error) {
        console.error("Password reset error:", error);
        if (error.code === "auth/invalid-email") {
          setMessage("forgot-message", "L'adresse e-mail saisie n'est pas valide.", "error");
        } else {
          setMessage(
            "forgot-message",
            "Si cette adresse est connue, un e-mail de reinitialisation vient d'etre envoye.",
            "success"
          );
        }
      }
    });
  }

  // Ã¢â€â‚¬Ã¢â€â‚¬ Page : tableau de bord (dashboard)
  if (page === "dashboard") {
    const userDisplay  = document.getElementById("user-display");
    const logoutButton = document.getElementById("logout-button");
    const logoutLink   = document.getElementById("logout-link");

    // Surveille l'ÃƒÂ©tat d'authentification en temps rÃƒÂ©el
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Utilisateur connectÃƒÂ© : affichage de son identitÃƒÂ©
        const displayName = user.displayName || user.email;
        if (userDisplay) userDisplay.textContent = displayName;
      } else {
        // Aucun utilisateur connectÃƒÂ© : redirection vers la page de connexion
        // (protÃƒÂ¨ge la route dashboard)
        window.location.href = "index.html";
      }
    });

    // Gestionnaire de dÃƒÂ©connexion partagÃƒÂ©
    const logoutHandler = async (event) => {
      event.preventDefault();
      try {
        await signOut(auth);
        // onAuthStateChanged dÃƒÂ©tectera l'ÃƒÂ©tat null et redirigera automatiquement.
        setMessage("dashboard-message", "DÃƒÂ©connexion en coursÃ¢â‚¬Â¦", "success");
      } catch (error) {
        setMessage("dashboard-message", `Erreur lors de la dÃƒÂ©connexion : ${error.message}`, "error");
      }
    };

    logoutButton?.addEventListener("click", logoutHandler);
    logoutLink?.addEventListener("click", logoutHandler);
  }
});
