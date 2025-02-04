const currentTime = document.querySelector("#current-time");
const setHours = document.querySelector("#hours");
const setMinutes = document.querySelector("#minutes");
const setSeconds = document.querySelector("#seconds");
const setAmPm = document.querySelector("#am-pm");
const setAlarmButton = document.querySelector("#submitButton");
const alarmContainer = document.querySelector("#alarms-container");

// Load alarm sound
const ringtone = new Audio("./ringtone.mp3"); // Ensure correct path

// Populate Dropdowns for Alarm Settings
window.addEventListener("DOMContentLoaded", () => {
    dropDownMenu(1, 12, setHours);
    dropDownMenu(0, 59, setMinutes);
    dropDownMenu(0, 59, setSeconds);
    setInterval(getCurrentTime, 1000);
    fetchAlarms();
});

// Set Alarm Button Click Event
setAlarmButton.addEventListener("click", (e) => {
    e.preventDefault();
    const hour = setHours.value;
    const minute = setMinutes.value;
    const second = setSeconds.value;
    const amPm = setAmPm.value;
    const alarmTime = `${hour}:${minute}:${second} ${amPm}`;
    setAlarm(alarmTime);
});

// Populate the select fields with time options
function dropDownMenu(start, end, element) {
    for (let i = start; i <= end; i++) {
        const option = document.createElement("option");
        option.value = i < 10 ? "0" + i : i;
        option.innerHTML = i < 10 ? "0" + i : i;
        element.appendChild(option);
    }
}

// Function to fetch the current time and display it
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const amPm = now.getHours() >= 12 ? "PM" : "AM";
    
    const formattedTime = `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds} ${amPm}`;
    currentTime.innerHTML = formattedTime;

    return formattedTime;
}

// Save alarm to localStorage
function saveAlarm(time) {
    const alarms = JSON.parse(localStorage.getItem("alarms")) || [];
    alarms.push(time);
    localStorage.setItem("alarms", JSON.stringify(alarms));
}

// Set and display an alarm
function setAlarm(time) {
    const alarmInterval = setInterval(() => {
        if (time === getCurrentTime()) {
            ringtone.play(); // Play ringtone
            alert("⏰ Alarm Ringing!");
        }
    }, 1000);

    addAlarmToDom(time, alarmInterval);
    saveAlarm(time);
}

// Add the alarm to the DOM
function addAlarmToDom(time, intervalId) {
    const alarmElement = document.createElement("div");
    alarmElement.classList.add("alarm");
    alarmElement.innerHTML = `
        <span>${time}</span>
        <button class="delete-alarm" data-id=${intervalId}>Delete</button>
    `;

    const deleteButton = alarmElement.querySelector(".delete-alarm");
    deleteButton.addEventListener("click", (e) => deleteAlarm(e, time, intervalId));
    alarmContainer.appendChild(alarmElement);
}

// Fetch and display alarms from localStorage
function fetchAlarms() {
    const alarms = JSON.parse(localStorage.getItem("alarms")) || [];
    alarms.forEach((alarm) => setAlarm(alarm));
}

// Delete alarm from DOM and localStorage
function deleteAlarm(event, time, intervalId) {
    clearInterval(intervalId);
    event.target.parentElement.remove();
    deleteAlarmFromLocalStorage(time);
}

// Delete alarm from localStorage
function deleteAlarmFromLocalStorage(time) {
    const alarms = JSON.parse(localStorage.getItem("alarms")) || [];
    const updatedAlarms = alarms.filter((alarm) => alarm !== time);
    localStorage.setItem("alarms", JSON.stringify(updatedAlarms));
}
