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

    // פונקציה שמעדכנת UI לפי זמינות
    function renderAvailability() {
      if (book.available) {
        statusEl.textContent = "Available"; // טקסט
        statusEl.className = "badge badge--available"; // עיצוב ירוק
        hintEl.textContent = "Ready to borrow now"; // טקסט מצב
        borrowBtn.disabled = false; // אפשר להשאיל
        returnBtn.disabled = true; // אי אפשר להחזיר
      } else {
        statusEl.textContent = "Borrowed"; // טקסט
        statusEl.className = "badge badge--borrowed"; // עיצוב כתום
        hintEl.textContent = "Currently unavailable"; // טקסט מצב
        borrowBtn.disabled = true; // אי אפשר להשאיל
        returnBtn.disabled = false; // אפשר להחזיר
      }
    }

    renderAvailability(); // מפעיל את העדכון הראשוני

    // לחיצה על Borrow
    borrowBtn.addEventListener("click", () => {
      if (!book.available) return; // אם כבר מושאל אל תעשה כלום
      book.available = false; // משנה זמינות
      msgEl.textContent = "✅ Book borrowed successfully."; // הודעה
      renderAvailability(); // מעדכן UI
    });

    // לחיצה על Return
    returnBtn.addEventListener("click", () => {
      if (book.available) return; // אם כבר זמין אל תעשה כלום
      book.available = true; // מחזיר לזמין
      msgEl.textContent = "✅ Book returned successfully."; // הודעה
      renderAvailability(); // מעדכן UI
    });
  })
  .catch(() => {
    document.body.innerHTML = "<h2 style='padding:20px'>Error loading books.json</h2>"; // שגיאה בטעינה
  });
