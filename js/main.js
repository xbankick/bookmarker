// Retrieving Inputs
var bookmarkName = document.getElementById("bookmarkName");
var bookmarkURL = document.getElementById("bookmarkURL");
var submitButton = document.getElementById("submitBtn");

// Table that we will insert in new bookmarks
var tableContent = document.getElementById("tableContent");

// Validation Section
var nameRegex = /^\w{3,}(\s+\w+)*$/;
var urlRegex = /^(https?:\/\/)?(w{3}\.)?\w+\.\w{2,}\/?(:\d{2,5})?(\/\w+)*$/;

bookmarkName.oninput = function () {
    validate(bookmarkName, nameRegex);
}

bookmarkURL.oninput = function () {
    validate(bookmarkURL, urlRegex);
}

function validate(element, regex) {
    if (regex.test(element.value)) {
        element.classList.add("is-valid");
        element.classList.remove("is-invalid");
        return;
    }
    element.classList.add("is-invalid");
    element.classList.remove("is-valid");
}


// Add bookmark on submit
submitButton.onclick = function () {
    if (bookmarkName.classList.contains("is-valid") && bookmarkURL.classList.contains("is-valid")) {
        var bookmark = {
            bookmarkName: bookmarkName.value,
            bookmarkURL: bookmarkURL.value,
        };
        bookmarkName.value = ""
        bookmarkURL.value = ""
        bookmarks.push(bookmark);
        localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
        showBookmark(bookmarks.length - 1);
        bookmarkName.classList.remove("is-valid");
        bookmarkURL.classList.remove("is-valid");
    }
}

// Putting items that in local storage when refresh
var bookmarks = localStorage.getItem("bookmarksList") ? JSON.parse(localStorage.getItem("bookmarksList")) : []

for (var index = 0; index < bookmarks.length; index++) {
    showBookmark(index);
}

// Show bookmark for viewer
function showBookmark(index) {
    var newBookmark = `
    <tr>
      <td>${index + 1}</td>
      <td>${bookmarks[index].bookmarkName}</td>              
      <td>
        <button class="btn btn-visit" data-index="${index}">
          <i class="fa-solid fa-eye pe-2"></i>Visit
        </button>
      </td>
      <td>
        <button class="btn btn-delete pe-2" data-index="${index}">
          <i class="fa-solid fa-trash-can"></i>
          Delete
        </button>
      </td>
    </tr>
    `;
    tableContent.innerHTML += newBookmark;

    deleteBtns = document.querySelectorAll(".btn-delete");
    if (deleteBtns) {
        for (var j = 0; j < deleteBtns.length; j++) {
            deleteBtns[j].addEventListener("click", function (e) {
                deleteBookmark(e);
            });
        }
    }

    visitBtns = document.querySelectorAll(".btn-visit");
    if (visitBtns) {
        for (var j = 0; j < visitBtns.length; j++) {
            visitBtns[j].addEventListener("click", function (e) {
                visitWebsite(e);
            });
        }
    }
}

// Delete Bookmark
function deleteBookmark(element) {
    tableContent.innerHTML = "";
    var itemDeleted = element.target.dataset.index;
    bookmarks.splice(itemDeleted, 1);
    for (var k = 0; k < bookmarks.length; k++) {
        showBookmark(k);
    }
    localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
}

// Visit Website
function visitWebsite(element) {
    var websiteIndex = element.target.dataset.index;
    var https = /^https?:\/\//;
    if (https.test(bookmarks[websiteIndex].bookmarkURL)) {
        open(bookmarks[websiteIndex].bookmarkURL);
    } else {
        open(`https://${bookmarks[websiteIndex].bookmarkURL}`);
    }
}