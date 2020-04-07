//DOM ELEMENTS
import Note from "./models/Note.js";
import * as Base from "./views/base.js";

/* -------------------------------------------------------------------------- */
/*                                     STATE                                  */

const state = {};
state.notes = new Note();
//TESTING PURPOSE
window.s = state;

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */

//============== TODO ===================
const renderCalender = (taskDatesArr) => {
  // 1.show current time
  Base.showCurrentTime(Base.elements.currentTime);
  // 2. show current Date, Month, Year
  Base.showCurrentDate(Base.elements.currentDate, "", "yes");

  //3. DISPLAY all weeks name
  Base.displayWeeksName();

  // 4. DISPLAY all DAYS
  const totalDays = Base.setTotalDays();
  const monthAndYear = Base.getCurrentMonthAndYear(
    Base.elements.nextMonthBtn.dataset.month,
    Base.elements.nextMonthBtn.dataset.year
  ); //array
  Base.displayAllDays(
    totalDays,
    monthAndYear[0],
    monthAndYear[1],
    taskDatesArr
  );
};

// SECTION =============================================
// EVENT LISTENER
const showMonth = (type) => {
  const monthIndex = Base.elements.nextMonthBtn.dataset.month;
  const year = Base.elements.nextMonthBtn.dataset.year;
  //render month
  Base.renderMonth(monthIndex, year, type, state.notes.notes); //type == 'prev/next'
};
//SAVE NOTES FUNCTION
const saveNotes = () => {
  // 1. Get the value of input
  const noteText = Base.elements.noteInput.value.trim();
  // 2. Get date,month & year of that Note
  const timeOfNote = Base.elements.currentEventDate.textContent;
  let [date, month, year] = Base.getDateMonthYear(timeOfNote);
  // const [date, month, year] = ["22", "March", "2020"];console.log(Base.getDateMonthYear(timeOfNote));
  // console.log(date + " " + month + " " + year);
  //if note is not empty
  if (noteText) {
    // 3. SAVE note to an array of a Note Class
    state.notes.addNote(noteText, date.trim(), month.trim(), year.trim());
    // 4. RENDER ALL Notes
    Base.renderAllNotes(state.notes.getNotes());
  }
};

// 1. Render calender after DOM LOADS
window.addEventListener("load", (e) => {
  // 1. Get Notes from localstorage
  const notesString = localStorage.getItem("Notes");
  const notesArr = JSON.parse(notesString);
  state.notes.notes = notesArr;
  // 2. RENDER ALL Notes
  Base.renderAllNotes(notesArr);
  // 3. gey only task months
  const currentMonthName = Base.months[new Date().getMonth()];
  const notesOfCalenderMonth = Base.getTaskMonths(notesArr, currentMonthName);
  // 4. get only task dates
  const taskDates = Base.getTaskDates(notesOfCalenderMonth);
  // 5. Render Calender
  renderCalender(taskDates);
});

// 2. Prev & Next Month btn click Event
Base.elements.nextMonthBtn.addEventListener("click", (e) => {
  // console.log(e.target.dataset.type);
  showMonth(e.target.dataset.type);
});
Base.elements.prevMonthBtn.addEventListener("click", (e) => {
  // console.log(e.target.dataset.type);
  showMonth(e.target.dataset.type);
});
// 3. add class on a date based on clicked event
Base.elements.calenderContent.addEventListener("click", (e) => {
  if (
    e.target.matches(
      ".calender__content-box.dates, .calender__content-box.dates *"
    )
  ) {
    if (Base.elements.calenderContent.hasChildNodes()) {
      const childElements = Base.elements.calenderContent.children; //its an array like object
      const childArr = Array.prototype.slice.call(childElements);
      // 1. first remove clicked class if there is any
      childArr.forEach((element) => {
        element.classList.remove("clicked");
      });
      // 2. then add clicked class on a particular element
      e.target.classList.add("clicked");
      // 3. SHOE event date in DOM
      const clickedDate = e.target.innerText;
      Base.getCurrentEventDate(clickedDate);
    }
  }
});

//ADD Note -> Click event
Base.elements.addNoteBtn.addEventListener("click", (e) => {
  Base.elements.addNoteContainer.classList.toggle("showNote");
});
//RESET BTN CLICK
Base.elements.resetNoteBtn.addEventListener("click", (e) => {
  // 1. Clear the value of textarea and hide it
  Base.elements.noteInput.value = "";
  Base.elements.addNoteContainer.classList.remove("showNote");
});
//SAVE Note BTn click
Base.elements.saveNoteBtn.addEventListener("click", saveNotes);

//Click on pagination
Base.elements.paginationContainer.addEventListener("click", (e) => {
  //console.log(e.target);
  if (e.target.matches("#prev-page")) {
    const page = +e.target.dataset.page;
    console.log(page);
    Base.renderAllNotes(state.notes.notes, page);
  }
  if (e.target.matches("#next-page")) {
    const page = +e.target.dataset.page;
    console.log(page);
    Base.renderAllNotes(state.notes.notes, page);
  }
});
