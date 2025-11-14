import { auth, onAuthStateChanged } from "./firebase.js";

// Impede acesso sem login
onAuthStateChanged(auth, user => {
    if (!user) {
        console.log("Sem login — redirecionando...");
        window.location.href = "/login.html";
        return;
    }

    // Mostra o usuário logado no rodapé
    const userBox = document.getElementById("usuarioLogado");
    if (userBox) {
        userBox.innerHTML = "Usuário: " + (user.email || "Anônimo");
    }
});
