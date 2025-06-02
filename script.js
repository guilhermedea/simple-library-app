const myLibrary = [];

function Book (title, author, pages, read) {
    // Ensure 'read' is a boolean internally for easier toggling
    // The form sends "true" or "false" as strings.
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = (read === 'true'); // Convert string "true" to boolean true, others to false
    this.id = crypto.randomUUID();

    // Instance method - uses 'this' to refer to instance properties
    this.info = () => {
        // Now uses this.read, this.title, etc.
        if (this.read) { // 'this.read' is now a boolean
            return (`${this.title}, by ${this.author}, ${this.pages} pages, already read.`);
        } else {
            return (`${this.title}, by ${this.author}, ${this.pages} pages, not read yet.`);
        }
    }
}

// Prototype method - defined correctly using a traditional function
// so 'this' refers to the instance.
Book.prototype.toggleReadStatus = function() {
    this.read = !this.read; // 'this.read' is a boolean, so '!' works as expected.
};

function addBookToLibrary (title, author, pages, read) {
    let book = new Book (title, author, pages, read);
    myLibrary.push(book);
}

function displayBooks() {
    const bookList = document.querySelector('.bookList');
    bookList.innerHTML = ''; // Clear existing books

    myLibrary.forEach(book => {
        const bookItem = document.createElement('tr');
        bookItem.classList.add('book-item');
        bookItem.setAttribute('data-id', book.id);
        const readStatusText = Book.read ? 'Read' : 'Not Read';
        
        bookItem.innerHTML = `
            <td>${book.title}</td>
            <td>Author: ${book.author}</td>
            <td>Pages: ${book.pages}</td>
            <td class="status">${readStatusText}</td>
            <td><button class="remove-btn">Remove</button></td>
            <td><button class="toggle-read-btn">Read it</button></td>
        `;

        bookList.appendChild(bookItem);
    });
};

    // Add event listeners to remove buttons
//     const removeButtons = document.querySelectorAll('.remove-btn');
//     removeButtons.forEach(button => {
//         button.addEventListener('click', removeBook);
//     });
// }

///Form Hidden Toggle
const showFormButton = document.querySelector('.newBookButton');
const formContainer = document.querySelector('.form-container');

showFormButton.addEventListener('click', () => {
    formContainer.classList.toggle('hidden')
});

///Button Behavior
let showLibraryButton = document.querySelector(".showLibrary");
    showLibraryButton.addEventListener("click", () => {
        displayBooks();
    });

let emptyLibraryButton = document.querySelector(".emptyLibrary");
    emptyLibraryButton.addEventListener("click", () => {
         const bookList = document.querySelector('.bookList');
        bookList.innerHTML = ''; // Clear existing books
    });


///Form Behavior
const addBookForm = document.querySelector('#addBookForm');
const titleInput = document.querySelector('#title');
const authorInput = document.querySelector('#author');
const pagesInput = document.querySelector('#pages');

addBookForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const title = titleInput.value;
    const author = authorInput.value;
    const pages = pagesInput.value;
    // Correctly get the value of the checked radio button
    // The querySelector looks for an input with name="already_read" that is currently :checked
    const readRadio = document.querySelector('input[name="already_read"]:checked');
    const read = readRadio ? readRadio.value : 'false'; // Default to 'false' if none selected (though 'required' should prevent this)

    const newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);

    titleInput.value = "";
    authorInput.value = "";
    pagesInput.value = "";
    // Reset radio buttons: uncheck the currently selected one,
    // or set a default (e.g., 'No' could be checked by default after submission)
    if (readRadio) {
        readRadio.checked = false;
    }

    displayBooks(); // Update the displayed book list
    // formContainer.classList.add('hidden'); // Hide the form after submission

    console.log('Book added: ', newBook);
    console.log('Current library: ', myLibrary);
});

///Remove Button Behaviour
const bookListBody = document.querySelector('.bookList');

bookListBody.addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-btn')) {
        const rowToRemove = event.target.closest('tr');

        if (rowToRemove) {
            const bookIdToRemove = rowToRemove.dataset.id;

            const indexToRemove = myLibrary.findIndex(Book => Book.id === bookIdToRemove);

            if (indexToRemove !== -1) {
                myLibrary.splice(indexToRemove, 1);
                console.log(`Book with ID ${bookIdToRemove} removed. Currently library:`, myLibrary)

                rowToRemove.remove();
            } else {
                console.log(`Book with ID ${bookIdToRemove} not found in the library.`);
            }
        }
    }

    if (event.target.classList.contains('toggle-read-btn')) {
        // Get the book ID from the parent <tr> element's data-id attribute
        const rowToUpdate = event.target.closest('tr');
        if (!rowToUpdate) return; // Should not happen if button is in a TR

        const bookIdToToggle = rowToUpdate.dataset.id;
        const bookToUpdate = myLibrary.find(Book => Book.id === bookIdToToggle);

        if (bookToUpdate) {
            bookToUpdate.toggleReadStatus();
            console.log(`Book with ID ${bookIdToToggle} read status toggled.`, bookToUpdate);

            // rowToUpdate is already defined above
            if (rowToUpdate) {
                // Select the cell by its class name '.status'
                const readStatusCell = rowToUpdate.querySelector('.status');
                if (readStatusCell) {
                    readStatusCell.textContent = bookToUpdate.read ? 'Read' : 'Not Read';
                } else {
                    console.error('Read status cell (.status) not found in the row.');
                }
            }
        } else {
            console.log(`Book with ID ${bookIdToToggle} not found in the library.`);
        }
    }
});


addBookToLibrary("The Hobbit", "J. R. R. Tolkien", 295, "true");
addBookToLibrary("The Fellowship of the Ring", "J. R. R. Tolkien", 500, "true");
addBookToLibrary("The Two Towers", "J. R. R. Tolkien", 600, "false");
addBookToLibrary("The Return of the King", "J. R. R. Tolkien", 500, "false");

console.log(myLibrary);
