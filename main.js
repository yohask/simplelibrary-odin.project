(() => {
    let myLibrary = [];
  
    /* UI Elements */
  
    const formContainer = document.querySelector(".new-book-form"); //reference to the container for the new book form
    const formEl = document.querySelector(".new-book-form form"); //reference to the new book form
    const booksEl = document.querySelector(".books"); //reference to the container displaying new books in the library
    const newBookBtn = document.querySelector("#new-book"); //reference to the new book button for adding new books
    const cancelNewBookBtn = document.querySelector("#cancel-book"); //reference to cancel button for cancelling new book addtion
  
    /* Logic */
  //define constructor 'Book' to create book objects
    function Book(id, title, author, pageCount, completed = false) {
      this.id = id;
      this.title = title;
      this.author = author;
      this.pageCount = pageCount;
      this.completed = completed;
    }
  
    Book.prototype.toggleCompleted = function () {
      this.completed = !this.completed;
    };
  //converts raw book data into 'Book' objects and populates the library array ('myLibrary') with them
    function rawDataToLibrary(data) {
      for (let i = 0; i < data.length; i++) {
        let { id, title, author, pageCount, completed } = data[i];
        myLibrary.push(new Book(id, title, author, pageCount, completed));
      }
    }
  //adds a new book to the library by by creating a Book object and pushing it into the myLibrary array
    function addNewBookToLibrary(title, author, pageCount, completed) {
      myLibrary.push(new Book(idGenerator(), title, author, pageCount, completed));
  
      updateLocalStorage(myLibrary);
    }
  //removes a book from the library based on its unique identifier (id)
    function removeBookFromLibrary(id) {
      myLibrary = myLibrary.filter((book) => book.id != id);
      updateLocalStorage(myLibrary);
    }
  //toggles the completed status of a book in the library
    function toggleCompletedBook(id) {
      myLibrary.find((book) => book.id == id)?.toggleCompleted();
      updateLocalStorage(myLibrary);
    }
  //generates a unique identifier for a book using a random string
    function idGenerator() {
      return Math.random().toString(36).substr(2, 8);
    }
  
    /* UI Functions */
  //renders the books in the library by creating and appending HTML elements for each book
    function displayLibrary() {
      booksEl.innerHTML = "";
      myLibrary.forEach((book) => {
        booksEl.append(createBookElement(book));
      });
    }
  //creates  an HTML element representing a book based on its data
    function createBookElement(book) {
      const bookEl = document.createElement("div");
      bookEl.classList.add("book");
      bookEl.dataset.id = book.id;
  
      ["title", "author", "pageCount", "completed", "delete"].forEach((prop) => {
        const el = document.createElement("div");
        el.classList.add(prop);
  
        const label = document.createElement("span");
        label.classList.add("label");
  
        if (prop == "completed") {
          let checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.checked = book[prop];
          el.append(checkbox);
  
          label.textContent = "have read : ";
          el.prepend(label);
        } else if (prop == "delete") {
          let delBtn = document.createElement("button");
          delBtn.classList.add("delete-book");
          delBtn.textContent = "x";
          el.append(delBtn);
        } else if (prop == "pageCount") {
          el.textContent = book[prop];
          label.textContent = "page count : ";
          el.prepend(label);
        } else {
          el.textContent = book[prop];
  
          label.textContent = prop + " : ";
          el.prepend(label);
        }
  
        bookEl.append(el);
      });
  
      return bookEl;
    }
  //retrieves form data for a new book from the new book form
    function getFormData() {
      return {
        title: formEl.querySelector("[name='title']").value,
        author: formEl.querySelector("[name='author']").value,
        pageCount: formEl.querySelector("[name='page-count']").value,
        completed: formEl.querySelector("[name='completed']").value == "yes",
      };
    }
  //clears the input fields of the new book form and resets default values
    function clearForm() {
      formEl.querySelector("[name='title']").value = "";
      formEl.querySelector("[name='author']").value = "";
      formEl.querySelector("[name='page-count']").value = 200;
      formEl.querySelector("[value='yes']").checked = false;
      formEl.querySelector("[value='no']").checked = true;
    }
  
    /* Event Handlers */
  //handles clicks on books in the library - toggles completed status of a book and deleting a book
    booksEl.addEventListener("click", (e) => {
      const targ = e.target;
      const parent = targ.parentElement;
  
      if (parent.classList.contains("completed")) {
        // clicked a checkbox
        // get data-id from parent book
        const id = parent.parentElement.dataset.id;
        toggleCompletedBook(id);
      } else if (parent.classList.contains("delete")) {
        // clicked a delete button
        const id = parent.parentElement.dataset.id;
        const book = myLibrary.find((book) => book.id == id);
        const confirmed = confirm(`Are you sure you want to delete "${book.title}" ?`);
  
        if (!confirmed) return;
  
        removeBookFromLibrary(id);
        // refresh display
        displayLibrary();
      }
    });
  //displays the new book form when the "+ New Book" button is clicked
    newBookBtn.addEventListener("click", () => {
      // show form
      formContainer.style.display = "block";
    });
  //hides the new book form and clears its input fields when the "Cancel" button is clicked
    cancelNewBookBtn.addEventListener("click", (e) => {
      e.preventDefault();
      formContainer.style.display = "none";
      clearForm();
    });
  //handles the submission of the new book form. Adds a new book to the library, updates the display, and hides the form
    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      addNewBookToLibrary(...Object.values(getFormData()));
      displayLibrary();
      clearForm();
      formContainer.style.display = "none";
    });
  //hides the new book form when a click occurs outside of the form
    formContainer.addEventListener("click", (e) => {
      // hide the form but don't clear if clicked outside form element
      if (e.target.classList.contains("new-book-form")) {
        formContainer.style.display = "none";
      }
    });
  
    /* LOCAL STORAGE */
  //remove all library data from local storage
    function clearLocalStorage() {
      localStorage.clear();
    }
  //updates the local storage with the current library data
    function updateLocalStorage(library) {
      localStorage.setItem("simpleLibrary", JSON.stringify(library));
    }
  //loads library data from local storage during initialization if it exists, populating the myLibrary array and displaying the library
    if (localStorage.getItem("simpleLibrary")) {
      let bookData = JSON.parse(localStorage.getItem("simpleLibrary"));
      rawDataToLibrary(bookData);
      displayLibrary();
    }
  })();
  