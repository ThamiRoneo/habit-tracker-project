const nameHabit = document.getElementById("nameHabit");
const targetOfDays = document.getElementById("targetOfDays");
const category = document.getElementById("category");
const errorElement = document.getElementById("errorElement");
const addHabitBtn = document.getElementById("addHabitBtn");
const form = document.querySelector("form");

let habits = [];

// Form validator function
function validateForm() {
    // Reset error message
    errorElement.textContent = "";
    
    // Validate habit name
    if (nameHabit.value.trim().length < 3) {
        errorElement.textContent = "Habit name must be at least 3 characters!";
        return false;
    }
    
    // Validate target days
    const targetDays = parseInt(targetOfDays.value);
    if (isNaN(targetDays) || targetDays < 1 || targetDays > 7) {
        errorElement.textContent = "Target days must be between 1 and 7!";
        return false;
    }
    
    // Validate category
    if (category.value === "") {
        errorElement.textContent = "Please select a category!";
        return false;
    }
    
    return true;
}

// Add Habit function
function addHabit(event) {
    event.preventDefault(); // Prevent form submission
    
    if (!validateForm()) {
        return; // Stop if validation fails
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
    saveHabits(); // Save to localStorage
    
    // Reset form
    nameHabit.value = "";
    targetOfDays.value = "1";
    category.value = "all";
    errorElement.textContent = "";
}

// Render Habits function
function renderHabits() {
    const table = document.querySelector("table");
    
    // Keep the header row, remove all other rows
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
    
    // Create a sorted copy of habits array (by streak, descending)
    const sortedHabits = [...habits].sort((a, b) => b.streak - a.streak);
    
    // Loop through habits and add rows
    sortedHabits.forEach((habit, index) => {
        const row = table.insertRow();
        // Store actual habit ID for deletion reference
        row.dataset.habitId = habit.id;
        
        // ID cell - display sequential number starting at 1
        const idCell = row.insertCell();
        idCell.textContent = index + 1;
        
        // Name cell
        const nameCell = row.insertCell();
        nameCell.className = "start-cell";
        nameCell.textContent = habit.name;
        
        // Category cell
        const categoryCell = row.insertCell();
        // Capitalize first letter of category
        const categoryDisplay = habit.category.charAt(0).toUpperCase() + habit.category.slice(1);
        categoryCell.textContent = categoryDisplay;
        
        // Streak cell
        const streakCell = row.insertCell();
        streakCell.className = "center-cell";
        streakCell.textContent = habit.streak;
        
        // Checkbox cell
        const checkboxCell = row.insertCell();
        checkboxCell.className = "center-cell";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "markDone";
        checkbox.checked = habit.doneToday;
        checkbox.onchange = () => toggleHabit(habit.id);
        checkboxCell.appendChild(checkbox);
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
    
    // Update DOM elements
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
        habit.streak = Math.max(0, habit.streak - 1); // Ensure streak doesn't go negative
    }

    renderHabits();
    updateSummary();
    saveHabits(); // Save to localStorage
}

// delete function
function deleteHabit(id) {
    habits = habits.filter(
        habit => habit.id !== id
    );

    renderHabits();
    updateSummary();
    saveHabits(); // Save to localStorage
}

form.addEventListener(
    "submit",
    addHabit
);

// Attach event listener to delete button
document.getElementById("deleteHabitBtn").addEventListener("click", function() {
    // Get selected habit IDs to delete
    const selectedHabits = [];
    const checkboxes = document.querySelectorAll('input[name="markDone"]:checked');
        checkboxes.forEach(checkbox => {
            // Find the habit ID associated with this checkbox
            const row = checkbox.closest('tr');
            if (row) {
                const habitId = row.dataset.habitId;
                if (habitId) {
                    selectedHabits.push(parseInt(habitId));
                }
            }
        });
    
    // Delete selected habits
    selectedHabits.forEach(id => {
        deleteHabit(id);
    });
});

// Correct the sort function typo
// Note: We'll sort when displaying, not on the array directly to preserve insertion order
// habits.sort(
//     (a, b) => b.streak - a.streak
// );

// Placeholder for storage functions (to be implemented)
function saveHabits() {
    // Save habits to localStorage
    localStorage.setItem('habits', JSON.stringify(habits));
}

function loadHabits() {
    // Load habits from localStorage
    const saved = localStorage.getItem('habits');
    if (saved) {
        habits = JSON.parse(saved);
        renderHabits();
        updateSummary();
    }
}

// Initialize
loadHabits();
