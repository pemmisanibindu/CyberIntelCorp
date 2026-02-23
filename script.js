// 🔹 Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2m6-XkABN9gfnNKP7ipTtTCV-NzRbi2k",
  authDomain: "cyberintel-contact-us.firebaseapp.com",
  projectId: "cyberintel-contact-us",
  storageBucket: "cyberintel-contact-us.firebasestorage.app",
  messagingSenderId: "611824420948",
  appId: "1:611824420948:web:17c13750b9c4c4819845c1"
};

// 🔹 Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 🔹 Initialize EmailJS
emailjs.init("Yhqal_xYVHmoDXV4F");

// 🔹 Form Submit Handler
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("number").value.trim();
    const message = document.getElementById("message").value.trim();
    const status = document.getElementById("statusMsg");

    status.textContent = "Sending...";
    status.style.color = "#0f172a";

    // 🔹 Validation
    if (!firstName || !lastName || !email || !phone || !message) {
      status.textContent = "⚠️ All fields are required";
      status.style.color = "orange";
      return;
    }

    if (!email.includes("@")) {
      status.textContent = "⚠️ Enter a valid email address";
      status.style.color = "orange";
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      status.textContent = "⚠️ Phone must be 10 digits";
      status.style.color = "orange";
      return;
    }

    if (message.length < 10) {
      status.textContent = "⚠️ Message must be at least 10 characters";
      status.style.color = "orange";
      return;
    }

    try {
      // 🔹 Save to Firestore
      await db.collection("contactMessages").add({
        firstName,
        lastName,
        email,
        phone,
        message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });

      // 🔹 Send Email
      await emailjs.send("service_c8sz8ai", "template_i7rzjc6", {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        message
      });

      status.textContent = "✅ Message sent successfully!";
      status.style.color = "green";
      contactForm.reset();

      

    } catch (error) {
      console.error(error);
      status.textContent = "❌ Something went wrong. Try again.";
      status.style.color = "red";
    }
  });
}

