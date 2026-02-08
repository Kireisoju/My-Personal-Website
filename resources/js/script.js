// Global array to store events
let events = [];
let editingEventIndex = null; // Tracks which event is being edited


//   Toggle Location vs Remote URL

function updateLocationOptions() {
    let modality = document.getElementById("event_modality").value;
    let locationDiv = document.getElementById("location_div");
    let remoteDiv = document.getElementById("remote_div");

    if (modality === "in-person") {
        locationDiv.style.display = "block";
        remoteDiv.style.display = "none";
    } else {
        locationDiv.style.display = "none";
        remoteDiv.style.display = "block";
    }
}


//   Save Event (Create or Update)

function saveEvent(event) {
    event.preventDefault();

    // Read form values
    let name = document.getElementById("event_name").value;
    let weekday = document.getElementById("event_weekday").value;
    let time = document.getElementById("event_time").value;
    let modality = document.getElementById("event_modality").value;
    let category = document.getElementById("event_category").value;
    let location = document.getElementById("event_location").value;
    let remote_url = document.getElementById("event_remote_url").value;
    let attendees = document.getElementById("event_attendees").value;

    // Build event object
    const eventDetails = {
        name: name,
        weekday: weekday,
        time: time,
        modality: modality,
        category: category,
        location: modality === "in-person" ? location : null,
        remote_url: modality === "remote" ? remote_url : null,
        attendees: attendees
    };

    if (editingEventIndex !== null) {
        // --- Update existing event ---
        events[editingEventIndex] = eventDetails;
        refreshCalendarUI();
        editingEventIndex = null;
    } else {
        // --- Create new event ---
        events.push(eventDetails);
        addEventToCalendarUI(eventDetails, events.length - 1);
    }

    // Reset form
    document.getElementById("event_form").reset();

    // Close modal
    const myModalElement = document.getElementById("event_modal");
    const myModal = bootstrap.Modal.getOrCreateInstance(myModalElement);
    myModal.hide();
}


//   Add Event To Calendar UI

function addEventToCalendarUI(eventInfo, index) {
    let event_card = createEventCard(eventInfo, index);
    let dayDiv = document.getElementById(eventInfo.weekday);
    dayDiv.appendChild(event_card);
}


//  Create Event Card

function createEventCard(eventDetails, index) {
    let event_element = document.createElement("div");
    event_element.classList = "event row border rounded m-1 py-1";
    event_element.style.cursor = "pointer";

    // Set background color by category
    switch (eventDetails.category.toLowerCase()) {
        case "academic":
            event_element.style.backgroundColor = "#09e482"; // green
            break;
        case "work":
            event_element.style.backgroundColor = "#5593d0"; // blue
            break;
        case "personal":
            event_element.style.backgroundColor = "#cc1423"; // red/pink
            break;
        default:
            event_element.style.backgroundColor = "#def818"; // yellow
    }

    // Event info
    let info = document.createElement("div");
    info.innerHTML = `
        <strong>Event Name:</strong> ${eventDetails.name}<br>
        <strong>Time:</strong> ${eventDetails.time}<br>
        <strong>Modality:</strong> ${eventDetails.modality}<br>
        ${eventDetails.location ? "<strong>Event Location: </strong>" + eventDetails.location + "<br>" : ""}
        ${eventDetails.remote_url ? "<strong>URL: </strong>" + eventDetails.remote_url + "<br>" : ""}
        <strong>Attendees:</strong> ${eventDetails.attendees}
    `;
    event_element.appendChild(info);

    // Click to edit
    event_element.addEventListener("click", () => {
        openEventModalForEdit(eventDetails, index);
    });

    return event_element;
}


//   Open Modal for Editing Event

function openEventModalForEdit(eventDetails, index) {
    document.getElementById("event_name").value = eventDetails.name;
    document.getElementById("event_weekday").value = eventDetails.weekday;
    document.getElementById("event_time").value = eventDetails.time;
    document.getElementById("event_modality").value = eventDetails.modality;
    document.getElementById("event_category").value = eventDetails.category;
    document.getElementById("event_attendees").value = eventDetails.attendees;

    if (eventDetails.modality === "in-person") {
        document.getElementById("event_location").value = eventDetails.location;
        document.getElementById("location_div").style.display = "block";
        document.getElementById("remote_div").style.display = "none";
    } else {
        document.getElementById("event_remote_url").value = eventDetails.remote_url;
        document.getElementById("location_div").style.display = "none";
        document.getElementById("remote_div").style.display = "block";
    }

    editingEventIndex = index;

    const myModalElement = document.getElementById("event_modal");
    const myModal = bootstrap.Modal.getOrCreateInstance(myModalElement);
    myModal.show();
}


//  Refresh Calendar UI
function refreshCalendarUI() {
    const days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    days.forEach(day => {
        const dayDiv = document.getElementById(day);
        dayDiv.querySelectorAll(".event").forEach(card => card.remove());
    });

    events.forEach((evt, idx) => {
        addEventToCalendarUI(evt, idx);
    });
}
