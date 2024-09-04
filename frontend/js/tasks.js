import { categories } from "./categories.js";
import { tags } from "./tags.js";

export const tasks = {

    taskTitle: 'testNewTask',
    elementToEdit: '',


    init: function () {
        tasks.fetchTaskList();
        tasks.handleNewTaskButton();
    },

    //ECOUTE LE GROS BOUTON "NOUVELLE TACHE"
    handleNewTaskButton: function () {
        const newTaskButton = document.querySelector("#add-new-task");
        newTaskButton.addEventListener("click", tasks.handleNewTaskButtonClick);
    },
    //AU CLICK DU GROS BOUTON NOUVELLE TACHE, CREE UN ELEMENT FORMULAIRE ET ECOUTE LA SOUMISSION DE CELUI CI
    handleNewTaskButtonClick: function () {
        tasks.createFormElement("addTaskForm", "Nouvelle tâche");
        document.querySelector("#addTaskForm").addEventListener("submit", tasks.handleSubmitNewTaskForm);
    },
    //RECUPERE LES INFORMATIONS DU FORMULAIRE ET APPELLE LE FETCH POUR LES METTRE EN BASE DE DONNEE
    handleSubmitNewTaskForm: function (event) {
        event.preventDefault();
        const form = document.querySelector("#addTaskForm");
        const formDatas = new FormData(form).entries();
        const objectData = {};

        for (const data of formDatas){
            objectData[data[0]] = data[1];
        }
        const allTags = document.querySelectorAll(".checkbox");
        let selectedTags = [];
        for (const tag of allTags) {
            if (tag.checked) {
                selectedTags.push(tag.id);
            }
        }
        objectData['tags_id'] = selectedTags;
        console.log(objectData);
        tasks.fetchTaskPost(objectData);
        tasks.fetchTaskList;
    },

    //RECUPERE LA LISTE DES TACHES DEPUIS LA BASE DE DONNEE
    fetchTaskList: function () {
        fetch("http://127.0.0.1:8000/api/tasks").then((response) => {
            return response.json();
        }).then((dataTasks) => {
            for (const dataTask of dataTasks) {
                if (dataTask.category) {
                    tasks.createTaskElement(dataTask.title, dataTask.id, dataTask.tags, dataTask.category.name);
                } else {
                    tasks.createTaskElement(dataTask.title, dataTask.id, dataTask.tags);
                }
            };
        }).then(() => {
            const deleteButtons = document.querySelectorAll(".delete");
            for (const deleteButton of deleteButtons) {
                deleteButton.addEventListener("click", tasks.handleDeleteButton);
            }
            const editButtons = document.querySelectorAll(".edit");
            for (const editButton of editButtons) {
                editButton.addEventListener("click", tasks.handleEditButton);
            }
        }).catch((error) => {
            console.log(error);
        });
    },

    createTaskElement: function (titleTask, idTask, tagsTask, categTask = "") {
        const templateTaskElement = document.getElementById("taskElement");
        const cloneTaskElement = document.importNode(templateTaskElement.content, true);

        let contentTags = "";
        for (const tagTask of tagsTask) {
            contentTags += ` <div class="surb">#${tagTask.name}</div> `;
        }
        if (categTask != "") {
            categTask = ` <em>* ${categTask}</em> `;
        }

        cloneTaskElement.querySelector("p").innerHTML = titleTask;
        //cloneTaskElement.querySelector("#id").value = idTask;
        cloneTaskElement.querySelector(".tag").innerHTML = contentTags;
        cloneTaskElement.querySelector(".category").innerHTML = categTask;
        cloneTaskElement.querySelector("[data-id]").dataset.id = idTask;
        cloneTaskElement.querySelector(".idTask").id = idTask;
        cloneTaskElement.id = idTask;
        const elementContainer = document.getElementById("tasklist");
        elementContainer.appendChild(cloneTaskElement);

    },

    createFormElement: function (formId, formTitle, formValue = "", idTask = "") {
        const templateFormElement = document.getElementById("taskForm");
        const cloneFormElement = document.importNode(templateFormElement.content, true);
        cloneFormElement.querySelector("form").id = formId; //formId doit être soit "addTaskForm" soit "editTaskForm"
        cloneFormElement.querySelector("h2").textContent = formTitle; //formTitle doit être soit "Nouvelle tâche", soit "Modifier une tâche"
        if (formValue === "") {
            cloneFormElement.querySelector("#task-title").placeholder = "titre de la tâche..."
        } else {
            cloneFormElement.querySelector("#task-title").value = formValue;
            cloneFormElement.querySelector("#id").value = idTask;
        }
    
        cloneFormElement.querySelector("#categoryList").innerHTML = categories.categoriesNameList;
        cloneFormElement.querySelector(".input-checkbox").innerHTML = tags.tagsNameList;
        
        const elementContainer = document.querySelector(".modal-dialog");
        elementContainer.appendChild(cloneFormElement);
        elementContainer.style.display = "flex";
    },

    handleDeleteButton: function (event) {
        const elementToDelete = event.currentTarget.parentNode;
        tasks.fetchTaskDelete(elementToDelete.dataset.id);
        elementToDelete.remove();
    },

    handleEditButton: function (event) {
        tasks.elementToEdit = event.currentTarget.parentNode;
        tasks.createFormElement("editTaskForm", "Modifier une tâche", tasks.elementToEdit.querySelector("p").textContent.trim(), tasks.elementToEdit.dataset.id);
        document.querySelector("#editTaskForm").addEventListener("submit", tasks.handleSubmitEditTaskForm);
    },

    /*Récupère les données du formulaire d'édition d'une tache et appelle la modification en base de donnée*/
    handleSubmitEditTaskForm: function (event) {
        event.preventDefault();
        const form = document.querySelector("#editTaskForm");
        console.log(form);
        const formDatas = new FormData(form).entries();
        console.log(formDatas);
        const objectData = {};
        for (const data of formDatas){
            objectData[data[0]] = data[1];
        }
        
        console.log(objectData);
        tasks.fetchTaskPut(objectData);
        tasks.fetchTaskList;

    },



    fetchTaskDelete: async function (taskId) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}`, {
                method: 'DELETE'
            });
            if (response.ok && response.status == 200) {
                tasks.createSuccessMessage(`tâche numéro ${taskId} supprimée avec succès dans la db !`);
            }
        } catch (error) {
            console.log(error);
        }
    },

    fetchTaskPost: async function (objectData) { //taskTitle, taskCategory
        try {
            const response = await fetch(` http://127.0.0.1:8000/api/tasks `, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(objectData) //{ "title": taskTitle, "category_id": taskCategory }
            });
            if (response.ok && response.status == 200) {
                tasks.createSuccessMessage(`tâche ajoutée avec succès dans la db !`);
            }
        } catch (error) {
            console.log(error);
        }
    },

    fetchTaskPut: async function (objectData) {
        try {
            const response = await fetch(` http://127.0.0.1:8000/api/tasks/${objectData.id} `, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(objectData)
            });
            if (response.ok && response.status == 200) {
                tasks.createSuccessMessage(`tâche numéro ${objectData.id} modifiée avec succès dans la db !`);
            }
        } catch (error) {
            console.log(error);
        }
    },

    createSuccessMessage: function (message) {
        const templateSuccMessElement = document.getElementById('template-success-message');
        const newSuccMessElement = templateSuccMessElement.content.cloneNode(true);
        newSuccMessElement.querySelector('.message span').textContent = message;
        newSuccMessElement.querySelector('.message .close').addEventListener('click', function (e) {
            e.currentTarget.closest('.message').remove();
        });
        const mainElement = document.querySelector('main');
        mainElement.prepend(newSuccMessElement);
        console.log("tu es dans le success message");
    },
}


document.addEventListener("DOMContentLoaded", tasks.init);