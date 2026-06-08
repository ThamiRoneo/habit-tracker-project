const nameHabit = documment.getElementById("nameHabit");
const targetOfDays = document.getElementById("targetOfDays");
const category = document.getElementById("category");
const errorElement = document.getElementById("errorElement");
const addHabitBtn = document.getElementById("addHabitBtn");

let habits = [];

// Form validator function
function validateForm() {
    if (nameHabit.length >= 3) {
        nameHabit = nameHabit.value;
    }
    else if (targetOfDays == 1 && targetOfDays == 7) {
        targetOfDays = targetOfDays.value;
    }
    else if (category !=="") {
        category = category.value;
    }
    else {
        errorElement.textContent = "Please enter valid habit name!";
    }
}

// Add Habit function
function addHabit() {
    const newHabit = {
        id: Date.now(),
        name,
        category,
        target,
        streak:0,
        doneToday: false;
    };

    habits.push(newHabit);
}

// Render Habits function
function renderHabits() {
    // clearing the container
    main-container.innerHTML = "";

    // loopiing through habits
    habits.forEach(element => {
        
    });

    // creating a card
    document.createElement("section");
}

// update Summary function
function updateSummary() {
    // total calculation
    const total = habits.length;

    // completion calculation
    const completed = habits.filter(habit => habit.doneToday).length;

    // percentage calculation
    const percentage = total === 0 ? 0:Math.round(
        (completed / total) * 100
    );
}

// checkbox function
function toggleHabit(id) {
    if (habit.doneToday) {
        habit.doneToday = true;
        habit.streak++;
    }
    else {
        habit.doneToday = false;
        habit.streak--;
    }

    renderHabits();
    updateSummary();
}

// delete function
function deleteHabit(id) {
    habits = habits.filter(
        habit => habit.id !== id
    );

    renderHabits();
    updateSummary();
}

form.addEventListener(
    "submit",
    addHabit
);

checkbox.addEventListener(
    "change",
    doneToday
);

button.addEventListener(
    "change",
    deleteHabit
);

habits.sort(
    (a, b) => b.steak - a.streak
);

saveHabits();
loadHabits();

localStorage.setItem();

JSON.parse();

history: [];