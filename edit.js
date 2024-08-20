document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#formulario");
    const nameContact = document.querySelector("#nameContact");
    const number = document.querySelector("#number");
    const email = document.querySelector("#email");
    const numberError = document.querySelector("#number-error");
    const globalError = document.querySelector("#global-error");

    // Obtém os dados do contato a ser editado do localStorage
    const contactEdit = JSON.parse(localStorage.getItem("contato_edit")) || {};

    function carregarDados() {
        if (contactEdit) {
            nameContact.value = contactEdit.nameContact || "";
            number.value = contactEdit.number || "";
            email.value = contactEdit.email || "";
        }
    }

    carregarDados();

    function validarTelefone(value) {
        const digits = value.replace(/\D/g, '');
        return digits.length === 11; // Considera apenas números de 11 dígitos como válidos
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

    function atualizarContato(e) {
        e.preventDefault();

        const telefoneValido = validarTelefone(number.value);

        if (!telefoneValido) {
            mostrarErro('number', 'Número de telefone inválido. O número deve ter exatamente 11 dígitos.');
            return;
        }

        limparErros();

        // Obtém a lista de contatos do localStorage
        const contactList = JSON.parse(localStorage.getItem("lista")) || [];

        const updatedContact = {
            id: contactEdit.id,
            nameContact: nameContact.value,
            number: number.value,
            email: email.value
        };

        // Atualiza o contato na lista
        const index = contactList.findIndex(contact => contact.id === contactEdit.id);
        if (index !== -1) {
            contactList[index] = updatedContact;
        }

        localStorage.setItem("lista", JSON.stringify(contactList));
        localStorage.removeItem("contato_edit");
        window.location.href = "./index.html"; // Redireciona para a página inicial após a atualização
    }

    form.addEventListener("submit", atualizarContato);
    number.addEventListener('input', (e) => {
        e.target.value = mascararTelefone(e.target.value);
    });

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
});
