import { auth, db } from "../firebase.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { notifySuccess, notifyError } from "../utils/notifications.js";

export function mountAuth(el) {
  el.innerHTML = `
    <div class="auth-wrapper">
      <div class="auth-card">
        <div class="auth-header">
          <h1>🚑 Sistema de Registro de Chamados</h1>
          <p>Ambulância Municipal - Guaíçara/SP</p>
        </div>
        
        <div id="loginForm" class="auth-form">
          <h2>Login</h2>
          <form id="formLogin">
            <label>
              E-mail
              <input type="email" id="loginEmail" required>
            </label>
            <label>
              Senha
              <input type="password" id="loginSenha" required>
            </label>
            <button type="submit" class="btn-add">Entrar</button>
            <button type="button" id="btnEsqueciSenha" class="btn-outline">Esqueci minha senha</button>
            <button type="button" id="btnNovoUsuario" class="btn-secondary">Criar novo usuário</button>
          </form>
        </div>
        
        <div id="cadastroForm" class="auth-form hidden">
          <h2>Novo Usuário</h2>
          <form id="formCadastro">
            <label>
              Nome Completo
              <input type="text" id="cadastroNome" required>
            </label>
            <label>
              E-mail
              <input type="email" id="cadastroEmail" required>
            </label>
            <label>
              Função
              <select id="cadastroFuncao" required>
                <option value="">Selecione...</option>
                <option value="atendente">Atendente</option>
                <option value="motorista">Motorista</option>
                <option value="administrador">Administrador</option>
              </select>
            </label>
            <label>
              Unidade
              <select id="cadastroUnidade" required>
                <option value="">Selecione...</option>
                <option value="Cohab">Cohab</option>
                <option value="Dom Bosco">Dom Bosco</option>
                <option value="Centro">Centro</option>
              </select>
            </label>
            <label>
              Telefone Celular
              <input type="tel" id="cadastroTelefone" placeholder="(14) 99999-9999" required>
            </label>
            <label>
              Senha
              <input type="password" id="cadastroSenha" minlength="6" required>
            </label>
            <label>
              Confirmar Senha
              <input type="password" id="cadastroSenhaConfirm" minlength="6" required>
            </label>
            <button type="submit" class="btn-add">Cadastrar</button>
            <button type="button" id="btnVoltarLogin" class="btn-outline">Voltar ao Login</button>
          </form>
        </div>
        
        <div id="recuperarSenhaForm" class="auth-form hidden">
          <h2>Recuperar Senha</h2>
          <form id="formRecuperarSenha">
            <p>Digite seu telefone cadastrado para receber SMS com nova senha:</p>
            <label>
              Telefone
              <input type="tel" id="recuperarTelefone" placeholder="(14) 99999-9999" required>
            </label>
            <button type="submit" class="btn-add">Enviar SMS</button>
            <button type="button" id="btnVoltarLogin2" class="btn-outline">Voltar ao Login</button>
          </form>
        </div>
      </div>
    </div>
  `;

  setupAuthEvents(el);
}

function setupAuthEvents(root) {
  // Login
  root.querySelector("#formLogin").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = root.querySelector("#loginEmail").value;
    const senha = root.querySelector("#loginSenha").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const userDoc = await getDoc(doc(db, "usuarios", userCredential.user.uid));
      
      if (!userDoc.exists()) {
        throw new Error("Usuário não encontrado no banco de dados");
      }

      const userData = userDoc.data();
      
      if (userData.status !== "aprovado") {
        await auth.signOut();
        throw new Error("Seu cadastro ainda está pendente de aprovação");
      }

      // Salvar dados do usuário logado
      localStorage.setItem("currentUser", JSON.stringify({
        uid: userCredential.user.uid,
        nome: userData.nome,
        email: userData.email,
        funcao: userData.funcao,
        unidade: userData.unidade
      }));

      notifySuccess(`Bem-vindo(a), ${userData.nome}!`);
      window.location.reload(); // Recarregar para mostrar sistema
    } catch (error) {
      notifyError(error.message);
    }
  });

  // Cadastro
  root.querySelector("#formCadastro").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const nome = root.querySelector("#cadastroNome").value;
    const email = root.querySelector("#cadastroEmail").value;
    const funcao = root.querySelector("#cadastroFuncao").value;
    const unidade = root.querySelector("#cadastroUnidade").value;
    const telefone = root.querySelector("#cadastroTelefone").value;
    const senha = root.querySelector("#cadastroSenha").value;
    const senhaConfirm = root.querySelector("#cadastroSenhaConfirm").value;

    if (senha !== senhaConfirm) {
      return notifyError("As senhas não conferem!");
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      
      await setDoc(doc(db, "usuarios", userCredential.user.uid), {
        nome,
        email,
        funcao,
        unidade,
        telefone,
        status: "pendente",
        createdAt: new Date().toISOString()
      });

      // Criar notificação para administrador
      await setDoc(doc(db, "notificacoes", `cadastro_${userCredential.user.uid}`), {
        tipo: "novo_cadastro",
        usuarioId: userCredential.user.uid,
        usuarioNome: nome,
        usuarioEmail: email,
        usuarioFuncao: funcao,
        createdAt: new Date().toISOString(),
        lida: false
      });

      await auth.signOut();
      
      notifySuccess("Cadastro realizado! Aguarde aprovação do administrador.");
      
      // Voltar para login
      root.querySelector("#cadastroForm").classList.add("hidden");
      root.querySelector("#loginForm").classList.remove("hidden");
    } catch (error) {
      notifyError(error.message);
    }
  });

  // Recuperar senha via SMS
  root.querySelector("#formRecuperarSenha").addEventListener("submit", async (e) => {
    e.preventDefault();
    const telefone = root.querySelector("#recuperarTelefone").value;

    try {
      // Buscar usuário por telefone
      const usersRef = collection(db, "usuarios");
      const q = query(usersRef, where("telefone", "==", telefone));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        throw new Error("Telefone não encontrado");
      }

      // Gerar senha temporária
      const novaSenha = Math.random().toString(36).slice(-8);

      // Enviar SMS (integração com Twilio ou similar)
      await enviarSMS(telefone, `Sua nova senha temporária: ${novaSenha}`);

      notifySuccess("SMS enviado com nova senha!");
      
      // Voltar para login
      root.querySelector("#recuperarSenhaForm").classList.add("hidden");
      root.querySelector("#loginForm").classList.remove("hidden");
    } catch (error) {
      notifyError(error.message);
    }
  });

  // Navegação entre formulários
  root.querySelector("#btnNovoUsuario").addEventListener("click", () => {
    root.querySelector("#loginForm").classList.add("hidden");
    root.querySelector("#cadastroForm").classList.remove("hidden");
  });

  root.querySelector("#btnEsqueciSenha").addEventListener("click", () => {
    root.querySelector("#loginForm").classList.add("hidden");
    root.querySelector("#recuperarSenhaForm").classList.remove("hidden");
  });

  root.querySelectorAll("#btnVoltarLogin, #btnVoltarLogin2").forEach(btn => {
    btn.addEventListener("click", () => {
      root.querySelector("#cadastroForm").classList.add("hidden");
      root.querySelector("#recuperarSenhaForm").classList.add("hidden");
      root.querySelector("#loginForm").classList.remove("hidden");
    });
  });
}

// Função auxiliar para enviar SMS (integração externa necessária)
async function enviarSMS(telefone, mensagem) {
  // Implementar integração com Twilio, AWS SNS ou similar
  console.log(`SMS para ${telefone}: ${mensagem}`);
  // Por enquanto apenas simula envio
  return Promise.resolve();
}
