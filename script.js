document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#formulario");
    const nameContact = document.querySelector("#nameContact");
    const number = document.querySelector("#number");
    const email = document.querySelector("#email");
    const contacts = document.querySelector("#contacts");
    const numberError = document.querySelector("#number-error");
    const globalError = document.querySelector("#global-error");

    // Obtém a lista de contatos do localStorage ou inicializa como uma lista vazia
    let contactList = JSON.parse(localStorage.getItem("lista")) || [];
    let counter = contactList.length ? contactList[contactList.length - 1].id + 1 : 1;

    function createCard({ id, nameContact, number, email }) {
        const newElement = document.createElement("div");
        newElement.classList.add("box");

        const elementName = document.createElement("h2");
        elementName.textContent = `Nome: ${nameContact}`;

        const elementNumber = document.createElement("p");
        elementNumber.textContent = `Número de telefone: ${number}`;

        const elementEmail = document.createElement("p");
        elementEmail.textContent = `E-mail: ${email}`;

        const elementButton = document.createElement("div");
        elementButton.classList.add("div_botoes");

        const elementEdit = document.createElement("img");
        elementEdit.classList.add("icon");
        elementEdit.src = "./editar-texto.png";
        elementEdit.addEventListener("click", () => {
            localStorage.setItem("contato_edit", JSON.stringify({ id, nameContact, number, email }));
            window.location.href = "./edit.html";
        });

        const elementDelete = document.createElement("img");
        elementDelete.classList.add("icon");
        elementDelete.src = "./excluir-texto.png";
        elementDelete.addEventListener("click", () => {
            contactList = contactList.filter(contact => contact.id !== id);
            localStorage.setItem("lista", JSON.stringify(contactList));
            contacts.removeChild(newElement);
            verificarListaVazia(); // Verifica se a lista está vazia após exclusão
        });

        elementButton.append(elementEdit, elementDelete);
        newElement.append(elementName, elementNumber, elementEmail, elementButton);
        contacts.appendChild(newElement);
    }

    function verificarListaVazia() {
        if (contactList.length === 0) {
            contacts.classList.add("empty");
            contacts.classList.add("no-shadow");
        } else {
            contacts.classList.remove("empty");
            contacts.classList.remove("no-shadow");
        }
    }

    function carregarPagina() {
        contactList.forEach(createCard);
        verificarListaVazia(); // Verifica se a lista está vazia ao carregar a página
    }

    function mascararTelefone(value) {
        const digits = value.replace(/\D/g, '');
        if (digits.length <= 10) {
            return digits
                .replace(/^(\d{2})(\d)/g, '($1) $2')
                .replace(/(\d{5})(\d)/, '$1-$2');
        } else {
            return digits
                .replace(/^(\d{2})(\d)/g, '($1) $2')
                .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
        }
    }

    function validarTelefone(value) {
        const digits = value.replace(/\D/g, '');
        return digits.length === 11;
    }

    function mostrarErro(campo, mensagem) {
        if (campo === 'number') {
            number.classList.add('error');
            numberError.textContent = mensagem;
        } else {
            globalError.textContent = mensagem;
        }
    }

    function limparErros() {
        number.classList.remove('error');
        numberError.textContent = '';
        globalError.textContent = '';
    }

    function cadastrarContato(e) {
        e.preventDefault();

        const telefoneValido = validarTelefone(number.value);

        if (!telefoneValido) {
            mostrarErro('number', 'O número deve ter 11 dígitos.');
            return;
        }

        limparErros();

        const newContact = {
            id: counter++,
            nameContact: nameContact.value,
            number: number.value,
            email: email.value
        };

        contactList.push(newContact);
        localStorage.setItem("lista", JSON.stringify(contactList));
        createCard(newContact);

        verificarListaVazia(); // Atualiza a visibilidade do fundo e sombra após adicionar o contato

        form.reset();
        nameContact.focus();
    }

    form.addEventListener("submit", cadastrarContato);
    number.addEventListener('input', (e) => {
        e.target.value = mascararTelefone(e.target.value);
    }); 

    carregarPagina(); // Carrega a página e a lista de contatos ao iniciar
});
