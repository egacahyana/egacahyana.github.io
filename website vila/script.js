// ============================================
// BALINESE VILA - JavaScript Functionality
// ============================================

// ---- Mobile Menu Toggle ----
const menuBtn = document.getElementById("menuBtn");
const navbar = document.querySelector("nav");

menuBtn?.addEventListener("click", () => {
  navbar.classList.toggle("expanded");
  console.log("Menu toggled");
});

// ---- Smooth Scroll untuk Navigation ----
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// ---- Booking Button Click Handler ----
const bookingBtn = document.getElementById("bookingBtn");
bookingBtn?.addEventListener("click", () => {
  const bookingSection = document.getElementById("booking");
  bookingSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
  // Highlight form
  const form = document.getElementById("bookingForm");
  form?.classList.add("animate-pulse");
  setTimeout(() => form?.classList.remove("animate-pulse"), 2000);
});

// ---- Booking Form Submission ----
const bookingForm = document.getElementById("bookingForm");

bookingForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get form data
  const formData = new FormData(bookingForm);
  const bookingData = {
    name:
      formData.get("name") ||
      document.querySelector('input[placeholder*="Nama"]').value,
    email:
      formData.get("email") ||
      document.querySelector('input[type="email"]').value,
    checkIn: document.querySelector('input[type="date"]:first-of-type').value,
    checkOut: document.querySelectorAll('input[type="date"]')[1].value,
    roomType: document.getElementById("roomType").value,
    specialRequests: document.querySelector("textarea").value,
    bookingDate: new Date().toISOString(),
  };
  document
    .getElementById("bookingForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const nama = document.getElementById("nama").value;
      const checkin = document.getElementById("checkin").value;
      const checkout = document.getElementById("checkout").value;
      const tamu = document.getElementById("tamu").value;

      const pesan = `Halo Balinese Villa,

Saya ingin melakukan booking villa.

Nama: ${nama}
Check-in: ${checkin}
Check-out: ${checkout}
Jumlah Tamu: ${tamu}`;

      const url = `https://wa.me/6289510855719?text=${encodeURIComponent(pesan)}`;

      window.open(url, "_blank");
    });

  // Validasi form
  if (
    !bookingData.name ||
    !bookingData.email ||
    !bookingData.checkIn ||
    !bookingData.checkOut ||
    !bookingData.roomType
  ) {
    showNotification(
      "⚠️ Silakan lengkapi semua field yang diperlukan",
      "warning",
    );
    return;
  }

  // Validasi tanggal
  const checkIn = new Date(bookingData.checkIn);
  const checkOut = new Date(bookingData.checkOut);

  if (checkIn >= checkOut) {
    showNotification(
      "❌ Tanggal check-out harus lebih besar dari check-in",
      "error",
    );
    return;
  }

  if (checkIn < new Date()) {
    showNotification("❌ Tanggal check-in tidak boleh di masa lalu", "error");
    return;
  }

  // Simulasi API call - Nanti bisa diganti dengan API sebenarnya
  console.log("Booking Data:", bookingData);
  showNotification(
    "✅ Booking berhasil! Tim kami akan menghubungi Anda segera.",
    "success",
  );

  // Reset form
  bookingForm.reset();

  // Log untuk development
  console.log("=== BOOKING INFORMATION ===");
  console.log("Nama:", bookingData.name);
  console.log("Email:", bookingData.email);
  console.log("Check-in:", bookingData.checkIn);
  console.log("Check-out:", bookingData.checkOut);
  console.log("Tipe Kamar:", bookingData.roomType);
  console.log("Permintaan Khusus:", bookingData.specialRequests);

  // TODO: Uncomment untuk menggunakan API sebenarnya
  /*
    try {
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
        });
        
        if (response.ok) {
            const result = await response.json();
            showNotification('✅ Booking berhasil! ID: ' + result.bookingId, 'success');
            bookingForm.reset();
        } else {
            showNotification('❌ Terjadi kesalahan. Silakan coba lagi.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('❌ Koneksi error. Silakan coba lagi.', 'error');
    }
    */
});

// ---- Room Card Click Handler ----
const roomCards = document.querySelectorAll(".villa-card");
roomCards.forEach((card) => {
  const buttons = card.querySelectorAll("button");
  buttons.forEach((button) => {
    if (button.textContent.includes("Pesan")) {
      button.addEventListener("click", (e) => {
        e.preventDefault();

        // Extract room type from card
        const roomTitle = card.querySelector("h3").textContent;
        const roomPrice = card.querySelector(
          '[class*="text-3xl"][class*="font-bold"]',
        ).textContent;

        // Scroll to booking
        document
          .getElementById("booking")
          .scrollIntoView({ behavior: "smooth" });

        // Show message
        showNotification(
          `📌 ${roomTitle} dipilih. Lanjutkan dengan mengisi form booking.`,
          "info",
        );

        console.log(`Room Selected: ${roomTitle} - ${roomPrice}`);
      });
    }
  });
});

// ---- Notification System ----
function showNotification(message, type = "info") {
  // Remove existing notification
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className =
    "notification fixed bottom-4 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg animate-slide-in";

  // Set colors based on type
  let bgColor = "bg-blue-500";
  if (type === "success") bgColor = "bg-emerald-500";
  if (type === "error") bgColor = "bg-red-500";
  if (type === "warning") bgColor = "bg-yellow-500";
  if (type === "info") bgColor = "bg-blue-500";

  notification.innerHTML = `
        <div class="${bgColor} text-white p-4 rounded-lg shadow-lg">
            <p class="text-sm font-medium">${message}</p>
        </div>
    `;

  document.body.appendChild(notification);

  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-in forwards";
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// ---- Price Calculator ----
const roomPrices = {
  deluxe: 850000,
  premium: 1500000,
  villa: 2500000,
};

function calculatePrice() {
  const roomType = document.getElementById("roomType").value;
  const checkInInput = document.querySelectorAll('input[type="date"]')[0];
  const checkOutInput = document.querySelectorAll('input[type="date"]')[1];

  if (!roomType || !checkInInput.value || !checkOutInput.value) {
    return 0;
  }

  const checkIn = new Date(checkInInput.value);
  const checkOut = new Date(checkOutInput.value);
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  const pricePerNight = roomPrices[roomType] || 0;

  return nights > 0 ? nights * pricePerNight : 0;
}

// Add event listeners for price calculation
document.getElementById("roomType")?.addEventListener("change", () => {
  const totalPrice = calculatePrice();
  if (totalPrice > 0) {
    const priceText = `Total: Rp ${totalPrice.toLocaleString("id-ID")}`;
    console.log(priceText);
  }
});

document.querySelectorAll('input[type="date"]').forEach((input) => {
  input.addEventListener("change", () => {
    const totalPrice = calculatePrice();
    if (totalPrice > 0) {
      const priceText = `Total: Rp ${totalPrice.toLocaleString("id-ID")}`;
      console.log(priceText);
    }
  });
});

// ---- Promo Code Validator (untuk pengembangan selanjutnya) ----
function validatePromoCode(code) {
  const promoCodes = {
    EARLYBIRD30: { discount: 30, type: "percentage" },
    HONEYMOON25: { discount: 25, type: "percentage" },
    FAMILY40: { discount: 40, type: "percentage" },
    LONGSTAY35: { discount: 35, type: "percentage" },
    WELCOME100K: { discount: 100000, type: "fixed" },
  };

  return promoCodes[code.toUpperCase()] || null;
}

// ---- Initialize on Page Load ----
document.addEventListener("DOMContentLoaded", () => {
  console.log("🌴 Balinese Vila Website Loaded");
  console.log("Ready for bookings!");

  // Set minimum date for check-in (today)
  const today = new Date().toISOString().split("T")[0];
  document.querySelectorAll('input[type="date"]').forEach((input) => {
    input.setAttribute("min", today);
  });

  // Add CSS animations if not already present
  if (!document.querySelector("style[data-animations]")) {
    addAnimationStyles();
  }
});

// ---- Add Animation Styles ----
function addAnimationStyles() {
  const style = document.createElement("style");
  style.setAttribute("data-animations", "true");
  style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .animate-slide-in {
            animation: slideIn 0.3s ease-out;
        }
        
        @keyframes fadeInUp {
            from {
                transform: translateY(20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        .fade-in-up {
            animation: fadeInUp 0.6s ease-out;
        }

        /* Smooth scroll behavior */
        html {
            scroll-behavior: smooth;
        }

        /* Input focus styles */
        input:focus,
        textarea:focus,
        select:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
        }
    `;
  document.head.appendChild(style);
}

// ---- Utility: Format Currency ----
function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

// ---- Export functions for external use ----
window.BalineseVila = {
  calculatePrice,
  validatePromoCode,
  formatCurrency,
  showNotification,
};

console.log("✅ All scripts loaded successfully!");
