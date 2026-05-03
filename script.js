// --- Elements ---
const manageTasksBtn = document.getElementById('manageTasksBtn');
const taskModal = document.getElementById('taskModal');
const closeTaskModal = document.getElementById('closeTaskModal');
const taskList = document.getElementById('task-list');
const addTaskBtn = document.getElementById('add-task-btn');
const options = document.querySelectorAll('.option');
const timerDisplay = document.querySelector('.timer');
const startBtn = document.querySelector('.start-btn');
const resetBtn = document.querySelector('.reset-btn');
const alarmSound = document.getElementById('alarmSound');

// --- Theme Elements ---
const themeBtn = document.getElementById('themeBtn');
const themeBox = document.getElementById('themeBox');
const themeImages = document.querySelectorAll('.theme-img');

// --- Custom Alert Modal Elements ---
const customAlert = document.getElementById('customAlert');
const closeAlertBtn = document.getElementById('closeAlertBtn');

// --- Current Task Display Element ---
const currentTaskDisplay = document.createElement('div');
currentTaskDisplay.id = 'current-task';
currentTaskDisplay.style.cssText = 'font-weight: bold; margin-bottom: 10px; font-size: 1.2em; color: #222;';
currentTaskDisplay.textContent = 'What do you want to focus on?';
timerDisplay.parentNode.insertBefore(currentTaskDisplay, timerDisplay);

// --- Timer Settings ---
let timer;
let timeLeft = 25 * 60;
let isRunning = false;

// --- Modal Open/Close ---
manageTasksBtn.addEventListener('click', () => {
  taskModal.classList.add('active');
});

closeTaskModal.addEventListener('click', () => {
  taskModal.classList.remove('active');
});

// --- Add Task ---
addTaskBtn.addEventListener('click', () => {
  const taskItem = document.createElement('div');
  taskItem.className = 'task-item';
  taskItem.innerHTML = `
    <input type="checkbox" />
    <input type="text" placeholder="Enter your task" class="task-input" />
    <button class="edit-btn"><i class="fas fa-pen"></i></button>
    <button class="delete-btn" style="margin-left: 10px;"><i class="fas fa-trash"></i></button>
  `;
  taskList.appendChild(taskItem);
  addTaskListeners(taskItem);
  updateCurrentTask();
});

// --- Task Item Listeners ---
function addTaskListeners(taskItem) {
  const checkbox = taskItem.querySelector('input[type="checkbox"]');
  const taskInput = taskItem.querySelector('.task-input');
  const deleteBtn = taskItem.querySelector('.delete-btn');

  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      taskInput.style.textDecoration = 'line-through';
      taskList.appendChild(taskItem);
    } else {
      taskInput.style.textDecoration = 'none';
      taskList.insertBefore(taskItem, taskList.firstChild);
    }
    updateCurrentTask();
  });

  taskInput.addEventListener('input', () => {
    updateCurrentTask();
  });

  deleteBtn.addEventListener('click', () => {
    taskItem.remove();
    updateCurrentTask();
  });
}

// --- Update Current Task Display ---
function updateCurrentTask() {
  const tasks = [...taskList.querySelectorAll('.task-item')];
  const nextTask = tasks.find(task => !task.querySelector('input[type="checkbox"]').checked);
  if (nextTask) {
    const taskText = nextTask.querySelector('.task-input').value.trim() || "Unnamed task";
    currentTaskDisplay.textContent = `Task : ${taskText}`;
  } else {
    currentTaskDisplay.textContent = '';
  }
}

// --- Focus/Break Option Switch ---
options.forEach(option => {
  option.addEventListener('click', () => {
    options.forEach(opt => opt.classList.remove('active'));
    option.classList.add('active');

    if (option.textContent === 'Focus') timeLeft = 25 * 60;
    else if (option.textContent === 'Short Break') timeLeft = 5 * 60;
    else if (option.textContent === 'Long Break') timeLeft = 15 * 60;

    updateTimerDisplay();
    clearInterval(timer);
    isRunning = false;
    startBtn.textContent = 'Start';
  });
});

// --- Start Timer ---
startBtn.addEventListener('click', () => {
  if (!isRunning) {
    isRunning = true;
    startBtn.textContent = 'Pause';
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
      } else {
        clearInterval(timer);
        isRunning = false;
        startBtn.textContent = 'Start';
        showCustomAlert();
      }
    }, 1000);
  } else {
    clearInterval(timer);
    isRunning = false;
    startBtn.textContent = 'Start';
  }
});

// --- Reset Timer ---
resetBtn.addEventListener('click', () => {
  clearInterval(timer);
  isRunning = false;
  startBtn.textContent = 'Start';

  const activeOption = document.querySelector('.option.active').textContent;
  if (activeOption === 'Focus') timeLeft = 25 * 60;
  else if (activeOption === 'Short Break') timeLeft = 5 * 60;
  else if (activeOption === 'Long Break') timeLeft = 15 * 60;

  updateTimerDisplay();
});

// --- Update Timer Display ---
function updateTimerDisplay() {
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');
  timerDisplay.innerHTML = `<span id="minutes">${minutes}</span>:<span id="seconds">${seconds}</span>`;
}

// --- Attach event listener once with delegation ---
timerDisplay.addEventListener('click', (e) => {
  if (e.target.id === 'minutes') {
    const input = prompt('Enter minutes (0 - 60):');
    const min = parseInt(input);
    if (!isNaN(min) && min >= 0 && min <= 60) {
      const currentSeconds = timeLeft % 60;
      timeLeft = min * 60 + currentSeconds;
      updateTimerDisplay();
    } else {
      alert("Invalid minutes, please enter valid minutes");
    }
  } else if (e.target.id === 'seconds') {
    const input = prompt('Enter seconds (0 - 60):');
    const sec = parseInt(input);
    if (!isNaN(sec) && sec >= 0 && sec <= 60) {
      const currentMinutes = Math.floor(timeLeft / 60);
      timeLeft = currentMinutes * 60 + sec;
      updateTimerDisplay();
    } else {
      alert("Oops, seconds must be between 0 - 60 ");
    }
  }
});

// --- 🎉 Confetti Blast Function ---
function launchConfettiBlast() {
  const duration = 10000;
  const end = Date.now() + duration;

  const defaults = {
    origin: { x: 0.5, y: 1 },
    startVelocity: 30,
    spread: 360,
    gravity: 0.5,
    zIndex: 999,
  };

  const shapes = ['square', 'circle', 'triangle', 'polygon'];

  const interval = setInterval(() => {
    const timeLeft = end - Date.now();
    if (timeLeft <= 0) {
      clearInterval(interval);
    }

    const particleCount = 40 * (timeLeft / duration);

    confetti({
      ...defaults,
      particleCount: particleCount / 2,
      scalar: 1.2,
      shapes: shapes,
    });

    confetti({
      ...defaults,
      particleCount: particleCount / 2,
      scalar: 1.8,
      emojis: ['🔥'],
      emojiSize: 24
    });
  }, 250);
}

// --- Show Alert + Play Alarm + Confetti ---
function showCustomAlert() {
  customAlert.style.display = 'block';
  alarmSound.play();
  launchConfettiBlast();
}

// --- Close Alert Modal ---
closeAlertBtn.addEventListener('click', () => {
  customAlert.style.display = 'none';
});

// --- Toggle Theme Box ---
themeBtn.addEventListener('click', () => {
  themeBox.classList.toggle('show');
});

// --- Change Theme Background ---
themeImages.forEach(img => {
  img.addEventListener('click', () => {
    const imgUrl = img.src;
    document.body.style.backgroundImage = `url(${imgUrl})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    themeBox.classList.remove('show');
  });
});

// --- Close Theme Box on Outside Click ---
document.addEventListener('click', (e) => {
  if (!themeBox.contains(e.target) && e.target !== themeBtn) {
    themeBox.classList.remove('show');
  }
});

// Initial display update
updateTimerDisplay();
updateCurrentTask();
