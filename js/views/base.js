// export const double = n => {
//   console.log(n * 2);
// };

export const elements = {
  currentTime: document.getElementById("current-time"),
  currentDate: document.getElementById("current-date"),
  prevMonthBtn: document.getElementById("prev-month"),
  nextMonthBtn: document.getElementById("next-month"),
  monthAndYear: document.getElementById("calender__month-year"),
  calenderContent: document.getElementById("calender-content"),
  currentEventDate: document.getElementById("current-date-event"),
  addNoteBtn: document.getElementById("addNote-btn"),
  resetNoteBtn: document.getElementById("resetNote-btn"),
  addNoteContainer: document.getElementById("calender__note"),
  noteInput: document.getElementById("note-input"),
  saveNoteBtn: document.getElementById("saveNote-btn"),
  notesContainer: document.getElementById("notes-container"),
  paginationContainer: document.getElementById("notes-pagination"),
  prevPage: document.getElementById("prev-page"),
  currentPage: document.getElementById("current-page"),
  nextPage: document.getElementById("next-page")
};

export const showCurrentTime = el => {
  setInterval(() => {
    el.textContent = showTime();
  }, 500);
};

//====months
export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

export const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

const showTime = () => {
  const today = new Date();
  return `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
};

//save Month And Year to btn dataset attributr
const saveMonthAndYear = (elArr, dateObj) => {
  elArr.forEach(el => {
    el.dataset.month = dateObj.getMonth();
    el.dataset.year = dateObj.getFullYear();
  });
};

//Display month date year => 22 March 2020
const displayMonthDateYear = (el, dateObj) => {
  el.textContent = `${dateObj.getDate()} ${
    months[dateObj.getMonth()]
  } ${dateObj.getFullYear()}`;
};

//TOTAL DAYS in a month
const daysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate(); //here we have an exception => january is here 1 based NOT 0 based..so 1 == january
};

//show Current date,month,year
export const showCurrentDate = (el, monthYear = "", firstTimeLoad) => {
  let today;
  if (monthYear !== "") {
    today = new Date(monthYear);
  } else {
    today = new Date();
  }

  //SAVE mont and year
  const DOMArry = [elements.nextMonthBtn, elements.prevMonthBtn];
  saveMonthAndYear(DOMArry, today);

  //RENDER UI
  if (firstTimeLoad === "yes") displayMonthDateYear(el, today);
};

// next month btn click
export const renderMonth = (monthIndex, year, type, notesArr = []) => {
  let month;
  if (type === "next") {
    month = monthIndex == 11 ? months[0] : months[+monthIndex + 1];
    year = monthIndex == 11 ? +year + 1 : year;
  } else if (type === "prev") {
    month = monthIndex == 0 ? months[11] : months[+monthIndex - 1];
    year = monthIndex == 0 ? +year - 1 : year;
  }

  const today = `${month}, ${year}`;
  showCurrentDate(elements.currentDate, today, "no");

  const currentMonthName = month;
  const notesOfCalenderMonth = getTaskMonths(notesArr, currentMonthName);
  // 4. get only task dates
  const taskDatesArr = getTaskDates(notesOfCalenderMonth);

  // TODO
  // 1.render UI (ONLY MONTH AND YEAR)
  elements.monthAndYear.textContent = today;

  //For getting the value of total days in a different month
  let newMonthIndex;
  if (type === "next") {
    newMonthIndex = +monthIndex + 1 + 1; // For total Days
  } else {
    newMonthIndex = +monthIndex; // For total Days
  }
  // newMonthIndex = type === "next" ? +monthIndex + 1 + 1 : +monthIndex;
  //console.log(daysInMonth(year, newMonthIndex, 0));

  // 2. SAVE date to btns
  elements.nextMonthBtn.dataset.dates = daysInMonth(year, newMonthIndex, 0);
  elements.prevMonthBtn.dataset.dates = daysInMonth(year, newMonthIndex, 0);

  // 3. CLEAR calender__content div
  elements.calenderContent.innerHTML = "";

  // render all dates of next monthn
  // 4. Render weeks name
  displayWeeksName();
  // 5. Render all days
  const totalDaysOfAMonth = +elements.nextMonthBtn.dataset.dates;
  // 5a. We need month string to calculate from which day to  start that month (ex => new Date('March 22, 2020'))
  // console.log(`${month} 1, ${year}`);
  displayAllDays(totalDaysOfAMonth, month, year, taskDatesArr);
};

//SET TOTAL DATES
export const setTotalDays = () => {
  const monthIndex = new Date().getMonth(); //'0' based like januar's index is = zero
  const year = new Date().getFullYear();
  const newMonthIndex = +monthIndex + 1; // bcz dayInMonth function is 1 based so there january is 1 based
  const totalDay = daysInMonth(year, newMonthIndex);
  return totalDay;
};

//Get month and year as a string
export const getCurrentMonthAndYear = (monthIndex, year) => {
  let month;
  month = monthIndex == 11 ? months[0] : months[monthIndex];
  year = monthIndex == 11 ? year : year;
  return [month, year]; //Current month & year => ['March','2020']
};

//GET CURRENT EVENT DATE in a DOM
export const getCurrentEventDate = date => {
  //alert("hi");
  const monthIndex = elements.nextMonthBtn.dataset.month;
  const monthName = months[monthIndex];
  const year = elements.nextMonthBtn.dataset.year;
  elements.currentEventDate.textContent = `${date} ${monthName} ${year}`;
};

export const getDateMonthYear = timeStr => {
  return timeStr.trim().split(" ");
};

//DISPLAY WEEKS NAME
export const displayWeeksName = () => {
  for (let i = 0; i < 7; i++) {
    const weekBox = document.createElement("div");
    weekBox.className = "calender__content-box days";
    weekBox.textContent = weekDays[i];
    elements.calenderContent.appendChild(weekBox);
  }
};

//DISPLAY ALL DAYS
// FROM WHICH DAY TO START A MONTH => new Date('march 22 2020');
export const displayAllDays = (totalDays, month, year, taskDateArr = []) => {
  let j = 0;
  for (let i = 0; i < 42; i++) {
    // 1. Create a div for a day
    const dayBox = document.createElement("div");
    dayBox.className = "calender__content-box dates";
    // 2. get the month STARTING DAY  (example => new Date('march 22 2020'))
    const startingDateObj = new Date(`${month} 1, ${year}`);
    const startingDayIndex = startingDateObj.getDay();
    const startingDayName = weekDays[startingDayIndex];
    if (i >= startingDayIndex) {
      // 3. show date
      dayBox.textContent = j + 1;
      j++;
      //Give current date a 'active' class if ONLY it is a current month
      // 4. check it is a current month
      const currentMonthIndex = new Date().getMonth();
      const currentMonthName = months[currentMonthIndex];
      if (currentMonthName === month) {
        const dateOfToday = new Date().getDate();
        if (dateOfToday === j) dayBox.classList.add("activeBox");
      }

      // 5. show tas icon if current date has a task
      if (taskDateArr.length) {
        //const eventDate = ["20", "10", "30", "9"];
        if (taskDateArr.includes(j.toString())) {
          //dayBox.classList.add("taskDate");
          //SHOW PIN ICON TO THAT DATE BCZ IT HOLDS AN EVENT/TASK
          const icon = document.createElement("i");
          icon.className = "fas fa-thumbtack task-icon";
          dayBox.appendChild(icon);
        }
      }
    } else {
      dayBox.textContent = "";
    }
    if (j > totalDays) break;
    elements.calenderContent.appendChild(dayBox);
  }
};

const insertNoteIntoDOM = noteObj => {
  const markup = `
    <div class="notes__content">
      <p class="notes__content-date">${noteObj.date}, ${noteObj.month} ${noteObj.year}</p>
      <p class="notes__content-text">
        ${noteObj.note}
      </p>
    </div>
  `;

  //insert this single item TO DOM
  elements.notesContainer.insertAdjacentHTML("beforeend", markup);
};

//Render pagination
export const renderPagination = (notesArr, page) => {
  const perPage = 5;
  const pages = Math.ceil(notesArr.length / perPage);
  const start = page * perPage - perPage;
  const limit = page * perPage;
  if (notesArr.length > 5) {
    elements.paginationContainer.classList.add("showPagination");
    if (page === 1 && page < pages) {
      //For the FRIST PAGE we only need next btn
      elements.prevPage.classList.add("d-none");
      elements.currentPage.textContent = `Page ${page}`;
      elements.nextPage.dataset.page = page + 1;
    } else if (page > 1 && page < pages) {
      // we need both buttons
      elements.prevPage.classList.remove("d-none");
      elements.nextPage.classList.remove("d-none");
      elements.prevPage.dataset.page = page - 1;
      elements.nextPage.dataset.page = page + 1;
      elements.currentPage.textContent = `Page ${page}`;
    } else if (page === pages) {
      //For the LAST PAGE we only need prev btn
      elements.nextPage.classList.add("d-none");
      elements.prevPage.classList.remove("d-none");
      elements.prevPage.dataset.page = page - 1;
      elements.currentPage.textContent = `Page ${page}`;
    }

    //2. CLEAR Previous data in DOM
    elements.notesContainer.innerHTML = "";
    notesArr.slice(start, limit).forEach(note => {
      // console.log(note.note);
      insertNoteIntoDOM(note);
    });
  }
};

//REDNER ALL Notes
export const renderAllNotes = (notesArr, page = 1) => {
  // 1. Render Pagination div (if there are more than 5 notes)
  renderPagination(notesArr, page);
};

// Array of task dates
export const getTaskDates = noteArr => {
  const taskDateArr = noteArr.map(el => el.date);
  return taskDateArr;
};

// Array of task months
export const getTaskMonths = (noteArr, calenderMonth) => {
  const notesOfCalenderMonth = noteArr.filter(el => {
    if (el.month == calenderMonth) return el;
  });
  return notesOfCalenderMonth;
};
