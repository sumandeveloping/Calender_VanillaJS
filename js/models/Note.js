export default class Note {
  constructor() {
    this.notes = [];
  }

  addNote(note, date, month, year) {
    const noteObj = {
      note,
      date,
      month,
      year
    };
    this.notes.push(noteObj);

    //SAVE TO localstorage;
    this.persisData();
  }

  getNotes() {
    return this.notes;
  }

  persisData() {
    localStorage.setItem("Notes", JSON.stringify(this.notes));
  }
}
