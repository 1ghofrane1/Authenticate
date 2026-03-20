function setMessage(elementId, text, type = "") {
  const element = document.getElementById(elementId);
  if (!element) return;

  element.textContent = text;
  element.classList.remove("error", "success");

  if (type) {
    element.classList.add(type);
  }
}

function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;

  if (page === "login") {
    const loginForm = document.getElementById("login-form");

    loginForm?.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value.trim();

      if (!email || !password) {
        setMessage("login-message", "Veuillez renseigner l'e-mail et le mot de passe.", "error");
        return;
      }

      if (!isValidEmail(email)) {
        setMessage("login-message", "L'adresse e-mail saisie n'est pas valide.", "error");
        return;
      }

      setMessage(
        "login-message",
        "Formulaire prêt. À compléter avec Firebase Authentication (connexion).",
        "success"
      );

      // TODO Firebase :
      // 1. Importer/initialiser Firebase
      // 2. Récupérer auth
      // 3. Appeler signInWithEmailAndPassword(auth, email, password)
      // 4. Rediriger vers dashboard.html en cas de succès (window.location.href = "dashboard.html")
    });
  }

  if (page === "register") {
    const registerForm = document.getElementById("register-form");

    registerForm?.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("register-name").value.trim();
      const email = document.getElementById("register-email").value.trim();
      const password = document.getElementById("register-password").value;
      const passwordConfirm = document.getElementById("register-password-confirm").value;

      if (!name || !email || !password || !passwordConfirm) {
        setMessage("register-message", "Tous les champs sont obligatoires.", "error");
        return;
      }

      if (!isValidEmail(email)) {
        setMessage("register-message", "L'adresse e-mail saisie n'est pas valide.", "error");
        return;
      }

      if (password.length < 6) {
        setMessage(
          "register-message",
          "Le mot de passe doit comporter au moins 6 caractères.",
          "error"
        );
        return;
      }

      if (password !== passwordConfirm) {
        setMessage("register-message", "Les mots de passe ne correspondent pas.", "error");
        return;
      }

      setMessage(
        "register-message",
        "Formulaire prêt. À compléter avec Firebase Authentication (création de compte).",
        "success"
      );

      // TODO Firebase :
      // createUserWithEmailAndPassword...
    });
  }

  if (page === "forgot-password") {
    const forgotForm = document.getElementById("forgot-password-form");

    forgotForm?.addEventListener("submit", (event) => {
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

      setMessage(
        "forgot-message",
        "Formulaire prêt. À compléter avec Firebase Authentication (réinitialisation).",
        "success"
      );

      // TODO Firebase :
      // sendPasswordResetEmail...
    });
  }

  if (page === "dashboard") {
    const userDisplay = document.getElementById("user-display");
    const logoutButton = document.getElementById("logout-button");
    const logoutLink = document.getElementById("logout-link");

    if (userDisplay) {
      userDisplay.textContent = "Professionnel connecté (simulation)";
    }

    const logoutHandler = (event) => {
      event.preventDefault();

      setMessage(
        "dashboard-message",
        "Déconnexion simulée. À compléter avec Firebase Authentication.",
        "success"
      );

      // TODO Firebase : 
      // signOut...
    };

    logoutButton?.addEventListener("click", logoutHandler);
    logoutLink?.addEventListener("click", logoutHandler);

    // TODO Firebase :
    // onAuthStateChanged...
  }
});