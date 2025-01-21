class Note {
    constructor(id, content) {
        this.id = id;
        this.content = content;
    }

    updateNote(content) {
        this.content = content;
    }

    renderNote(saveCallback, removeCallback) {
        const noteElement = document.createElement("div");
        const textarea = document.createElement("textarea");
        const removeBtn = document.createElement("button");
        
        textarea.value = this.content;

        // adds event listener so it updates for every key typed
        textarea.addEventListener("input", () => {
            this.updateNote(textarea.value);
            saveCallback();
        });
        
        removeBtn.textContent = remove;
        removeBtn.addEventListener("click", () => removeCallback(this.id));
        
        noteElement.appendChild(textarea);
        noteElement.appendChild(removeBtn);
        return noteElement;
    }
}

class NoteApp {
    constructor() {
        this.numNotes = 0;
        this.notes = this.loadNotes();
        this.lastTimeStamp = localStorage.getItem("lastTimeStamp") || "No saves yet";
    }

    loadNotes() {
        const storedNotes = localStorage.getItem("notes");
        const parsedNotes = storedNotes ? JSON.parse(storedNotes) : [];
        return parsedNotes.map(note => new Note(note.id, note.content)); // explain mapping
    }

    addNote() {
        const id = Date.now();
        this.notes.push(new Note(id, ""));
        this.renderNotes();
        this.saveAllNotes();
    }

    removeNote(id) {
        this.notes = this.notes.filter(note => note.id !== id);
        this.renderNotes();
        this.saveAllNotes();
        this.numNotes--;
    }

    saveAllNotes() {
        localStorage.setItem("notes", JSON.stringify(this.notes));
        this.lastTimeStamp = new Date().toLocaleTimeString();
        localStorage.setItem("lastTimeStamp", this.lastTimeStamp);
        this.updateTimeDisplay();
    }

    renderNotes() {
        const notesContainer = document.getElementById("notes-container");
        notesContainer.innerHTML = "";
        this.notes.forEach(note => {
            const noteElement = note.renderNote(
                () => this.saveAllNotes(),
                (id) => this.removeNote(id)
            );
            notesContainer.appendChild(noteElement);
        });
        this.toReadMode();
        this.updateTimeDisplay();
    }

    updateTimeDisplay() {
        const timeDisplay = document.getElementsByClassName("timestamp")[0];
        if (timeDisplay) {
            timeDisplay.textContent = `${write_time} ${this.lastTimeStamp}`;
            if (document.getElementById("read-title")) {
                timeDisplay.textContent = `${read_time} ${this.lastTimeStamp}`;
            }
        }
    }

    toReadMode() {
        if (document.getElementById("read-title")) {
            // Disable all textareas
            document.querySelectorAll("textarea").forEach(textarea => {
                textarea.disabled = true;
            });

            // Hide all remove buttons
            document.querySelectorAll("button").forEach(button => {
                if (button.textContent === "Remove") {
                        button.style.display = "none";
                }
            });
        }
    }
}

function main() {
    const app = new NoteApp();

    if (document.getElementById("add-note")) {
        document.getElementById("add-note").addEventListener("click", () => app.addNote());
    }
    app.renderNotes();
    app.updateTimeDisplay

    // Listen for changes from writer.html
    window.addEventListener("storage", (event) => {
        if (event.key === "notes") {
            app.notes = app.loadNotes();  // Reload notes
            app.renderNotes();
        }
    });
}

function wordify() {
    if (document.getElementById("title")) {
        document.getElementById("header").textContent = header;
        document.getElementById("write").textContent = write;
        document.getElementById("read").textContent = read;
    } else if (document.getElementById("write-title")) {
        document.getElementById("write-header").textContent = write_header;
        document.getElementById("add-note").textContent = add_note;
        document.getElementsByClassName("back")[0].textContent = back;
    } else {
        document.getElementById("read-header").textContent = read_header;
        document.getElementsByClassName("back")[0].textContent = back;
    }

}
if (!document.getElementById("title")) {
    main();
}

wordify();