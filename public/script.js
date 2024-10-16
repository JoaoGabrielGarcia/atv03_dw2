// public/script.js

// Função para pegar as tarefas da API
async function fetchTasks(filter = null) {
    try {
        const response = await fetch("http://localhost:3000/");
        if (!response.ok) {
            throw new Error(`Erro ao buscar tarefas: ${response.status} - ${response.statusText}`);
        }

        const tasks = await response.json();

        // Filtra as tarefas com base no filtro
        const filteredTasks = tasks.filter(task => {
            if (filter === "complete") return task.status === true;
            if (filter === "incomplete") return task.status === false;
            return true; // Retorna todas as tarefas se não houver filtro
        });

        // Atualiza a lista de tarefas
        const taskList = document.getElementById("task-list");
        taskList.innerHTML = ""; // Limpa a lista anterior

        // Adiciona cada tarefa à lista
        // biome-ignore lint/complexity/noForEach: <explanation>
                filteredTasks.forEach(task => {
            const li = document.createElement("li");
            li.textContent = `ID: ${task.task_id}, Nome: ${task.name}, Status: ${task.status ? "Completa" : "Incompleta"}`;

            // Cria o botão de deletar
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Deletar";
            deleteButton.classList.add("delete-button");
            deleteButton.onclick = async () => {
                await deleteTask(task._id);
                fetchTasks(); // Recarrega as tarefas após a exclusão
            };

            // Cria o botão de editar
            const editButton = document.createElement("button");
            editButton.textContent = "Editar";
            editButton.classList.add("edit-button");
            editButton.onclick = () => {
                fillEditForm(task); // Preenche o formulário de edição
            };

            li.appendChild(editButton);
            li.appendChild(deleteButton);
            taskList.appendChild(li);
        });
    } catch (error) {
        console.error("Erro:", error);
    }
}

// Função para preencher o formulário de edição
function fillEditForm(task) {
    document.getElementById("edit_task_id").value = task._id; // ID da tarefa
    document.getElementById("edit_name").value = task.name; // Nome da tarefa
    document.getElementById("edit_status").value = task.status; // Status da tarefa
    document.getElementById("edit-form").style.display = "block"; // Exibe o formulário de edição
}

// Função para atualizar uma tarefa
async function updateTask(task) {
    try {
        const response = await fetch(`http://localhost:3000/${task.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(task)
        });

        // Verifica se a resposta não é OK
        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.error); // Exibe um alerta com a mensagem de erro
            throw new Error(`Erro ao atualizar tarefa: ${errorData.error}`);
        }

        const updatedTask = await response.json();
        console.log("Tarefa atualizada:", updatedTask);
        return updatedTask;
    } catch (error) {
        console.error("Erro:", error);
    }
}

// Função para criar uma nova tarefa
async function createTask(task) {
    try {
        const response = await fetch("http://localhost:3000/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(task)
        });

        // Verifica se a resposta não é OK
        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.error); // Exibe um alerta com a mensagem de erro
            throw new Error(`Erro ao criar tarefa: ${errorData.error}`);
        }

        const newTask = await response.json();
        console.log("Tarefa criada:", newTask);
        return newTask;
    } catch (error) {
        console.error("Erro:", error);
    }
}


// Função para deletar uma tarefa
async function deleteTask(id) {
    try {
        const response = await fetch(`http://localhost:3000/${id}`, {
            method: "DELETE",
        });

        // Verifica se a resposta é OK
        if (!response.ok) {
            throw new Error(`Erro ao deletar tarefa: ${response.status} - ${response.statusText}`);
        }

        const deletedTask = await response.json();
        console.log("Tarefa deletada:", deletedTask);
        return deletedTask;
    } catch (error) {
        console.error("Erro:", error);
    }
}

// Adiciona os eventos para os botões de filtro
document.getElementById("show-all").addEventListener("click", () => fetchTasks());
document.getElementById("show-complete").addEventListener("click", () => fetchTasks("complete"));
document.getElementById("show-incomplete").addEventListener("click", () => fetchTasks("incomplete"));

// Adiciona o evento de envio do formulário de edição
document.getElementById("task-edit-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Captura os valores do formulário
    const id = document.getElementById("edit_task_id").value;
    const name = document.getElementById("edit_name").value;
    const status = document.getElementById("edit_status").value === 'true';

    // Chama a função para atualizar a tarefa
    await updateTask({ id, name, status });

    // Limpa o formulário
    this.reset();
    document.getElementById("edit-form").style.display = "none"; // Esconde o formulário de edição

    // Atualiza a lista de tarefas
    fetchTasks();
});
// Adiciona o evento de envio do formulário
document.getElementById("task-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Captura os valores do formulário
    const task_id = document.getElementById("task_id").value;
    const name = document.getElementById("name").value;
    const status = document.getElementById("status").value === 'true';

    // Chama a função para criar a nova tarefa
    await createTask({ task_id, name, status });

    // Limpa o formulário
    this.reset();

    // Atualiza a lista de tarefas
    fetchTasks();
});

// Busca as tarefas ao carregar a página
fetchTasks();
