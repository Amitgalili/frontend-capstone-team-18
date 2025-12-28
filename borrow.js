// קורא id מה-URL: borrow.html?id=3
const params = new URLSearchParams(window.location.search); // יוצר אובייקט גישה לפרמטרים בכתובת
const bookId = Number(params.get("id")) || 1; // לוקח את id וממיר למספר, אם אין אז 1

// טוען את books.json מאותה תיקייה
fetch("./books.json") // מבקש מהדפדפן לקרוא את קובץ ה-JSON
  .then((res) => res.json()) // ממיר את התשובה למערך אובייקטים (ספרים)
  .then((books) => {
    const book = books.find((b) => b.id === bookId); // מחפש את הספר עם אותו id

    if (!book) { // אם אין ספר כזה
      document.body.innerHTML = "<h2 style='padding:20px'>Book not found</h2>"; // מציג הודעה
      return; // עוצר
    }

    // ממלא כותרת / מחבר / קטגוריה
    document.getElementById("bookTitle").textContent = book.title; // שם ספר
    document.getElementById("bookAuthor").textContent = book.author; // מחבר
    document.getElementById("bookCategory").textContent = book.category; // קטגוריה למעלה

    // ממלא קטגוריה שנייה בכרטיס info (אם קיים)
    const cat2 = document.getElementById("bookCategory2"); // אלמנט קטגוריה בכרטיס
    if (cat2) cat2.textContent = book.category; // ממלא אותו

    // ממלא נתונים בצד ימין
    document.getElementById("bookIsbn").textContent = book.isbn; // ISBN
    document.getElementById("bookYear").textContent = book.year; // שנה
    document.getElementById("bookLanguage").textContent = book.language; // שפה
    document.getElementById("bookDescription").textContent = book.description; // תיאור
    // ===== Read more / Read less =====
    const descEl = document.getElementById("bookDescription");
    const toggleBtn = document.getElementById("toggleDescBtn");

    let isExpanded = false;

function renderDescToggle() {
  // if description is short - hide the button
  if (!book.description || book.description.length < 160) {
    toggleBtn.style.display = "none";
    descEl.classList.remove("desc-text--clamp");
    return;
  }

  toggleBtn.style.display = "inline-flex";
  descEl.classList.toggle("desc-text--clamp", !isExpanded);
  toggleBtn.textContent = isExpanded ? "Read less" : "Read more";
}

toggleBtn.addEventListener("click", () => {
  isExpanded = !isExpanded;
  renderDescToggle();
});

renderDescToggle();


    // תמונת כריכה
    const coverImg = document.getElementById("bookCover"); // אלמנט תמונה
    coverImg.src = book.cover || "images/placeholder-cover.png"; // אם אין כריכה -> placeholder

    // ממלא ID אם יש אלמנט כזה
    const idEl = document.getElementById("bookId"); // אלמנט ID
    if (idEl) idEl.textContent = book.id; // ממלא ID

    // סטטוס + טקסט זמינות
    const statusEl = document.getElementById("bookStatus"); // תג סטטוס
    const hintEl = document.getElementById("bookAvailabilityText"); // טקסט קטן מתחת

    // כפתורים
    const borrowBtn = document.getElementById("borrowBtn"); // כפתור Borrow
    const returnBtn = document.getElementById("returnBtn"); // כפתור Return
    const msgEl = document.getElementById("systemMessage"); // הודעות למשתמש
    function showMessage(text) { // shows a message then hides it
    msgEl.textContent = text; // puts the text inside the message box
    msgEl.style.opacity = "1"; // makes it visible

    clearTimeout(window._msgTimer); // clears old timer if exists

    window._msgTimer = setTimeout(() => { // starts a new timer
     msgEl.style.opacity = "0"; // fades it out
    }, 2500); // 2.5 seconds
}


   function renderAvailability() {
        if (book.available) {
          // ===== ספר זמין =====
             statusEl.textContent = "Available";
             statusEl.className = "badge badge--available";

             hintEl.textContent = "Ready to borrow now";

             borrowBtn.disabled = false;
             returnBtn.disabled = true;

             // כפתורים
             borrowBtn.className = "btn btn--primary";
             returnBtn.className = "btn btn--ghost";
        } else {
             // ===== ספר מושאל =====
             statusEl.textContent = "Borrowed";
             statusEl.className = "badge badge--borrowed";

             hintEl.textContent = "This book is currently borrowed";

             borrowBtn.disabled = true;
             returnBtn.disabled = false;

            // 👇 כאן הקסם
             borrowBtn.className = "btn btn--ghost";
             returnBtn.className = "btn btn--return-active";
        }
}


    renderAvailability(); // מפעיל את העדכון הראשוני

    // לחיצה על Borrow
    borrowBtn.addEventListener("click", () => {
      if (!book.available) return; // אם כבר מושאל אל תעשה כלום
      book.available = false; // משנה זמינות
      showMessage("✅ Book borrowed successfully.");
      renderAvailability(); // מעדכן UI
    });

    // לחיצה על Return
    returnBtn.addEventListener("click", () => {
      if (book.available) return; // אם כבר זמין אל תעשה כלום
      book.available = true; // מחזיר לזמין
      showMessage("✅ Book returned successfully.");
      renderAvailability(); // מעדכן UI
    });
  })
  .catch(() => {
    document.body.innerHTML = "<h2 style='padding:20px'>Error loading books.json</h2>"; // שגיאה בטעינה
  });
// ===== Hover Zoom follows the mouse (Premium effect) =====

// מוצא את העטיפה (ה-div שמכיל את התמונה)
const coverBox = document.querySelector(".cover"); // אלמנט העטיפה

// מוצא את התמונה עצמה (לפי ה-id שכבר יש לך)
const coverImgEl = document.getElementById("bookCover"); // תמונת הכריכה

// אם אחד מהם לא קיים, לא עושים כלום כדי שלא תהיה שגיאה
if (coverBox && coverImgEl) {
  // כשמזיזים עכבר בתוך העטיפה
  coverBox.addEventListener("mousemove", (e) => {
    const rect = coverBox.getBoundingClientRect(); // מיקום וגודל של העטיפה על המסך

    const x = ((e.clientX - rect.left) / rect.width) * 100; // אחוז X בתוך האלמנט
    const y = ((e.clientY - rect.top) / rect.height) * 100; // אחוז Y בתוך האלמנט

    coverImgEl.style.transformOrigin = `${x}% ${y}%`; // הזום יהיה לכיוון העכבר
    coverBox.classList.add("zoom"); // מוסיף class שמפעיל scale ב-CSS
  });

  // כשעוזבים את העטיפה
  coverBox.addEventListener("mouseleave", () => {
    coverBox.classList.remove("zoom"); // מוריד את ה-scale
    coverImgEl.style.transformOrigin = "center center"; // מחזיר למרכז
  });
}
