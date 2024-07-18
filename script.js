var todoList = [];
var searchInput = document.getElementById("search-input");
var searchButton = document.getElementById("search-button");
var addButton = document.getElementById("add-button");
var todoInput = document.getElementById("todo-input");
var deleteAllButton = document.getElementById("delete-all");
var allTodos = document.getElementById("all-todos");
var deleteSButton = document.getElementById("delete-selected");
var categoryButton = document.getElementById("category-button");
var categoryDropdown = document.getElementById("category-dropdown");
var edit_id = null;

// Event listener for search button
searchButton.addEventListener("click", searchTasks);

// Event listener for enter key in search input
searchInput.addEventListener("keypress", function (e) {
    if (e.key === 'Enter') {
        searchTasks();
    }
});
// Event listeners for add and delete
addButton.addEventListener("click", add);
deleteAllButton.addEventListener("click", deleteAll);
deleteSButton.addEventListener("click", deleteS);

// Event listener for filters
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('complete') || e.target.classList.contains('ci')) {
        completeTodo(e);
    }
    if (e.target.classList.contains('delete') || e.target.classList.contains('di')) {
        deleteTodo(e);
    }
    if (e.target.id == "all") {
        viewAll();
    }
    if (e.target.id == "rem") {
        viewRemaining();
    }
    if (e.target.id == "com") {
        viewCompleted();
    }
});

// Event listener for "Edit" buttons
allTodos.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit') || e.target.classList.contains('ei')) {
        const taskId = e.target.parentElement.parentElement.getAttribute('id');
        const index = todoList.findIndex(task => task.id === taskId);
        EditInfo(index);
    }
});
// Event listener for the catagories
categoryButton.addEventListener("click", function () {
    categoryDropdown.style.display = categoryDropdown.style.display === "block" ? "none" : "block";
});
var categoryOptions = document.querySelectorAll(".dropdown-option1");
categoryOptions.forEach(option => {
    option.addEventListener("click", function () {
        var selectedValue = this.getAttribute("data-value");
        categoryButton.textContent = selectedValue;
        categoryButton.setAttribute("data-value", selectedValue);
        categoryDropdown.style.display = "none";
    });
});

// Event listener for sorting dropdown
const sortSelect = document.getElementById("sort-select");
sortSelect.addEventListener("change", function () {
    const selectedSortOption = sortSelect.value;
    sortTasks(selectedSortOption);
});

// Event listener for enter key
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        add();
    }
});

//search task
function searchTasks() {
    var searchTerm = searchInput.value.toLowerCase();
    var filteredTasks = todoList.filter(task => task.task.toLowerCase().includes(searchTerm));

    if (filteredTasks.length === 0) {
        allTodos.innerHTML = "<p>No matching tasks found.</p>";
    } else {
        var resultsHTML = "";
        filteredTasks.forEach(task => {
            resultsHTML += `<li>${task.task}</li>`;
        });
        allTodos.innerHTML = `<ul>${resultsHTML}</ul>`;
    }
}
//updates the all the remaining, completed and main list
function update() {
    comdoList = todoList.filter((ele) => {
        return ele.complete

    })
    remList = todoList.filter((ele) => {
        return !ele.complete
    })
    document.getElementById("r-count").innerText = todoList.length.toString();
    document.getElementById("c-count").innerText = comdoList.length.toString();

}


// Add functionality
function add() {
    var value = todoInput.value;
    var selectedCategory = document.getElementById("category-button").getAttribute("data-value");
    var selectedDeadline = new Date(document.getElementById("task-deadline").value); // Convert to Date object

    if (value === '') {
        alert("(⊙ˍ⊙) Task cannot be empty");
        return;
    }
    if (edit_id !== null) {
        todoList[edit_id].task = value;
        todoList[edit_id].deadline = selectedDeadline; // Update task deadline
        addButton.innerText = 'Add';
        edit_id = null;
    } else {
        todoList.push({
            task: value,
            id: Date.now().toString(),
            complete: false,
            category: selectedCategory,
            deadline: selectedDeadline // Store as a Deadline (Date) object
        });
    }
    todoInput.value = "";
    update();
    addinmain(todoList);
}


//renders the main list and views on the main content

function addinmain(todoList) {
    // Sort the tasks by deadline
    allTodos.innerHTML = "";
    todoList.forEach(element => {
        var formattedDeadline = element.deadline ? new Date(element.deadline).toLocaleDateString() : ''; // Format the deadline
        var x = `<li id=${element.id} class="todo-item">
            <p id="task" class="${element.complete ? 'line' : ''}">${element.complete ? `<strike>${element.task}</strike>` : element.task}</p>
            <p class="category">${element.category}</p>
            <p class="deadline">${formattedDeadline}</p> <!-- Display the deadline -->
            <div class="todo-actions">
                <button class="complete btn btn-success">
                    <i class=" ci bx bx-check bx-sm"></i>
                </button>
                <button class="delete btn btn-error" >
                    <i class="di bx bx-trash bx-sm"></i>
                </button>
                <button class="edit btn btn-primary">
                    <i class="ei bx bx-edit bx-sm"></i>
                </button>
            </div>
        </li>`;
        allTodos.innerHTML += x;
    });
    savedata();
}

//sorting
function sortTasks(sortOption) {
    switch (sortOption) {
        case "newest":
            todoList.sort((a, b) => b.id - a.id); // Sort by newest (based on task ID)
            break;
        case "oldest":
            todoList.sort((a, b) => a.id - b.id); // Sort by oldest (based on task ID)
            break;
        case "az":
            todoList.sort((a, b) => a.task.localeCompare(b.task)); // Sort A to Z
            break;
        case "za":
            todoList.sort((a, b) => b.task.localeCompare(a.task)); // Sort Z to A
            break;
    }

    // Update the displayed tasks
    addinmain(todoList);
}

//deletes and indiviual task and update all the list
function deleteTodo(e) {
    var deleted = e.target.parentElement.parentElement.getAttribute('id');
    todoList = todoList.filter((ele) => {
        return ele.id != deleted
    })

    update();
    addinmain(todoList);

}



//completes indiviaula task and updates all the list
function completeTodo(e) {
    var completed = e.target.parentElement.parentElement.getAttribute('id');
    todoList.forEach((obj) => {
        if (obj.id == completed) {
            if (obj.complete == false) {
                obj.complete = true
                e.target.parentElement.parentElement.querySelector("#task").classList.add("line");
            } else {
                obj.complete = false

                e.target.parentElement.parentElement.querySelector("#task").classList.remove("line");
            }
        }
    })

    update();
    addinmain(todoList);
}


//deletes all the tasks
function deleteAll(todo) {

    todoList = []

    update();
    addinmain(todoList);

}

// Edit functionality
function EditInfo(id) {
    edit_id = id;

    addButton.innerText = 'Save Changes';
}
//deletes only completed task
function deleteS(todo) {

    todoList = todoList.filter((ele) => {
        return !ele.complete;
    })


    update();
    addinmain(todoList);

}
// Edit functionality
function EditInfo(id) {
    edit_id = id;
    todoInput.value = todoList[id].task;
    addButton.innerText = 'Save Changes';
}


// functions for filters
function viewCompleted() {
    addinmain(comdoList);
}

function viewRemaining() {

    addinmain(remList);
}
function viewAll() {
    addinmain(todoList);
}
function savedata() {
    localStorage.setItem('data', allTodos.innerHTML);
}

function showtask() {
    allTodos.innerHTML = localStorage.getItem('data');

}
showtask();

// Function to handle voice input
function handleVoiceInput() {
    const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    recognition.lang = 'en-US';

    recognition.onresult = function(event) {
        const result = event.results[event.results.length - 1][0].transcript.toLowerCase();
        searchInput.value = result; // Set the search input field with the recognized text
        searchTasks(); // Call your search function
    }

    recognition.start();
}

// Attach a click event listener to the microphone icon button to trigger voice input
const voiceSearchButton = document.getElementById("voice-search-button");
voiceSearchButton.addEventListener("click", handleVoiceInput);
