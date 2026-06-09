const nameHabit = document.getElementById("nameHabit");
const targetOfDays = document.getElementById("targetOfDays");
const category = document.getElementById("category");
const errorElement = document.getElementById("errorElement");
const addHabitBtn = document.getElementById("addHabitBtn");
const form = document.querySelector("form");

let habits = [];

// form validator function
function validateForm() {
    // resets error message
    errorElement.textContent = "";

    // validate habit name
    if (nameHabit.value.trim().length < 3) {
        errorElement.textContent = "Habit name must be at least 3 characters!";
        return false;
    }

    // validate target days
    const targetDays = parseInt(targetOfDays.value);
    if (isNaN(targetDays) || targetDays < 1 || targetDays > 7) {
        errorElement.textContent = "Target days must be between 1 and 7!";
        return false;
    }

    // validate category
    if (category.value === "") {
        errorElement.textContent = "Please select a category!";
        return false;
    }

    return true;
}

// add Habit function
function addHabit(event) {
    event.preventDefault(); // prevent form submission

    if (!validateForm()) {
        return; // stop if validation fails
    }

    const newHabit = {
        id: Date.now(),
        name: nameHabit.value.trim(),
        category: category.value,
        target: parseInt(targetOfDays.value),
        streak: 0,
        doneToday: false
    };

    habits.push(newHabit);
    renderHabits();
    updateSummary();
    saveHabits(); // save to localStorage

    // reset form
    nameHabit.value = "";
    targetOfDays.value = "1";
    category.value = "";
    errorElement.textContent = "";
}

// render Habits function
function renderHabits() {
    const table = document.querySelector("table");

    // keep the header row, remove all other rows
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    // create a sorted copy of habits array (by streak, descending)
    const sortedHabits = [...habits].sort((a, b) => b.streak - a.streak);

    // loop through habits and add rows
    sortedHabits.forEach((habit, index) => {
        const row = table.insertRow();
        // store actual habit ID for deletion reference
        row.dataset.habitId = habit.id;

        // fade effect if habit is done today
        if (habit.doneToday) {
            row.classList.add('done-row');
        }

        // ID cell - display sequential number starting at 1
        const idCell = row.insertCell();
        idCell.textContent = index + 1;

        // name cell
        const nameCell = row.insertCell();
        nameCell.className = "start-cell";
        nameCell.textContent = habit.name;

        // category cell
        const categoryCell = row.insertCell();
        // capitalize first letter of category
        const categoryDisplay = habit.category.charAt(0).toUpperCase() + habit.category.slice(1);
        categoryCell.textContent = categoryDisplay;

        // streak cell
        const streakCell = row.insertCell();
        streakCell.className = "center-cell";
        streakCell.textContent = habit.streak;

        // checkbox cell
        const checkboxCell = row.insertCell();
        checkboxCell.className = "center-cell";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "markDone";
        checkbox.checked = habit.doneToday;
        checkbox.onchange = () => toggleHabit(habit.id);
        checkboxCell.appendChild(checkbox);

        // delete cell
        const deleteCell = row.insertCell();
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "habit-delete-btn";
        deleteBtn.onclick = () => deleteHabit(habit.id);
        deleteCell.appendChild(deleteBtn);
    });
}

// update Summary function
function updateSummary() {
    // total calculation
    const total = habits.length;

    // completion calculation
    const completed = habits.filter(habit => habit.doneToday).length;

    // percentage calculation
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    // update DOM elements
    document.getElementById("totalHabits").textContent = total;
    document.getElementById("doneToday").textContent = completed;
    document.getElementById("completionPerc").textContent = percentage + "%";
}

// checkbox function
function toggleHabit(id) {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    habit.doneToday = !habit.doneToday;

    if (habit.doneToday) {
        habit.streak++;
    } else {
        habit.streak = Math.max(0, habit.streak - 1); // ensures streak doesn't go negative
    }

    renderHabits();
    updateSummary();
    saveHabits(); // save to localStorage
}

// delete function
function deleteHabit(id) {
    habits = habits.filter(
        habit => habit.id !== id
    );

    renderHabits();
    updateSummary();
    saveHabits(); // save to localStorage
}

form.addEventListener(
    "submit",
    addHabit
);

function saveHabits() {
    // save habits to localStorage
    localStorage.setItem('habits', JSON.stringify(habits));
}

function loadHabits() {
    // load habits from localStorage
    const saved = localStorage.getItem('habits');
    if (saved) {
        habits = JSON.parse(saved);
        renderHabits();
        updateSummary();
    }
}

// initialize
loadHabits();
