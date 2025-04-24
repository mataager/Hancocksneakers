document.addEventListener("DOMContentLoaded", function () {
  // Select elements
  const overlay = document.querySelector("[data-overlay]");
  const navOpenBtn = document.querySelector("[data-nav-open-btn]");
  const navbar = document.querySelector("[data-navbar]");
  const navCloseBtn = document.querySelector("[data-nav-close-btn]");
  const megaMenu = document.querySelector("[data-mega-menu]");

  // Event listeners for opening and closing the navbar
  navOpenBtn.addEventListener("click", function () {
    navbar.classList.add("active");
    overlay.classList.add("active");
  });

  navCloseBtn.addEventListener("click", function () {
    navbar.classList.remove("active");
    overlay.classList.remove("active");
  });

  overlay.addEventListener("click", function () {
    navbar.classList.remove("active");
    overlay.classList.remove("active");
  });

  // Prevent closing the navbar when clicking inside the mega menu
  if (megaMenu) {
    megaMenu.addEventListener("click", function (event) {
      event.stopPropagation(); // Prevent click from propagating to the document
    });
  }

  // Handle category selection
  const showMenu = function (category) {
    const menMenu = document.getElementById("men-menu");
    const womenMenu = document.getElementById("women-menu");
    const kidsMenu = document.getElementById("kids-menu");
    const menLabel = document.getElementById("men-label");
    const womenLabel = document.getElementById("women-label");
    const kidsLabel = document.getElementById("kids-label");

    // Hide all menus and reset labels
    menMenu.classList.add("hidden");
    womenMenu.classList.add("hidden");
    kidsMenu.classList.add("hidden");
    menLabel.style.fontWeight = "400";
    womenLabel.style.fontWeight = "400";
    kidsLabel.style.fontWeight = "400";

    // Show the selected category menu and highlight the label
    if (category === "men") {
      menMenu.classList.remove("hidden");
      menLabel.style.fontWeight = "700";
    } else if (category === "women") {
      womenMenu.classList.remove("hidden");
      womenLabel.style.fontWeight = "700";
    } else if (category === "kids") {
      kidsMenu.classList.remove("hidden");
      kidsLabel.style.fontWeight = "700";
    }
  };

  // Add event listeners to category labels
  document.getElementById("men-label").addEventListener("click", function (e) {
    e.stopPropagation(); // Prevent click from propagating to the document
    showMenu("men");
  });

  document
    .getElementById("women-label")
    .addEventListener("click", function (e) {
      e.stopPropagation(); // Prevent click from propagating to the document
      showMenu("women");
    });

  document.getElementById("kids-label").addEventListener("click", function (e) {
    e.stopPropagation(); // Prevent click from propagating to the document
    showMenu("kids");
  });

  // Handle scroll behavior
  const header = document.querySelector("[data-header]");
  const goTopBtn = document.querySelector("[data-go-top]");

  window.addEventListener("scroll", function () {
    if (window.scrollY >= 80) {
      header.classList.add("active");
      goTopBtn.classList.add("active");
    } else {
      header.classList.remove("active");
      goTopBtn.classList.remove("active");
    }
  });
});

//
// scroll to checout btn//

//handle page title
document.getElementById("store-title").innerHTML = storename;

//
// The function to handle the redirection
function brand(brandName) {
  const encodedBrand = encodeURIComponent(brandName); // Ensure URL safety
  window.location.href = `brand.html?brand=${encodedBrand}`;
}

//infinity brands scroll
const scrollers = document.querySelectorAll(".scroller");

// If a user hasn't opted in for recuded motion, then we add the animation
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  addAnimation();
}

function addAnimation() {
  scrollers.forEach((scroller) => {
    // add data-animated="true" to every `.scroller` on the page
    scroller.setAttribute("data-animated", true);

    // Make an array from the elements within `.scroller-inner`
    const scrollerInner = scroller.querySelector(".scroller__inner");
    const scrollerContent = Array.from(scrollerInner.children);

    // For each item in the array, clone it
    // add aria-hidden to it
    // add it into the `.scroller-inner`
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      duplicatedItem.setAttribute("aria-hidden", true);
      scrollerInner.appendChild(duplicatedItem);
    });
  });
}

//

function calculateSalePrice(originalPrice, saleAmount) {
  const discountedPrice = originalPrice - originalPrice * (saleAmount / 100);
  return Math.round(discountedPrice); // Rounds to the nearest integer (e.g., 3197.6 → 3198)
}

//using them in cart checkout page
function removeaddressarea() {
  const addressarea = document.getElementById("address-sec");
  addressarea.remove();
}
function prepareguestbtn() {
  const removedbtn = document.getElementById("checkoutByAccount");
  const addedbtn = document.getElementById("checkoutWithoutAccount");
  addedbtn.classList.remove("hidden");

  if (removedbtn) removedbtn.remove();

  if (addedbtn) {
    addedbtn.innerHTML = `
      <button id="guestSubmitorderbtn" class="Add-to-Cart">
        Order Now As Guest
        <i class="bi bi-check2-all"></i>
      </button>
    `;

    // Add event listener properly
    document
      .getElementById("guestSubmitorderbtn")
      .addEventListener("click", guestSubmitorder);
  }
}
//
// Configuration object for store hints
const storeHintsConfig = {
  currentPromos: [], // Will be populated from Firebase
  rotationInterval: 3000, // 3 seconds rotation
  apiUrl: `https://matager-f1f00-default-rtdb.firebaseio.com/Stores/${uid}/Promocodes.json`,
};

// DOM elements
let hintsContainer;
let rotationInterval;

// Function to render the free shipping hint
function renderFreeShippingHint(threshold) {
  return `
        <div class="store-hint">
            <div class="flex items-center">
                <p>Free Shipping On Orders Over</p>
                <div class="m-x-3 highlight-shipping-amount">${threshold}</div>
                <p>EGP</p>
            </div>
        </div>
    `;
}

// Function to render a promo code hint
function renderPromoHint(promo) {
  return `
        <div class="store-hint">
            <div class="flex items-center">
                <p>Use Promo Code:</p>
                <div class="m-x-3 highlight-promo-code">${promo.promoName}</div>
                <p>for ${promo.promoAmount} EGP Off</p>
            </div>
        </div>
    `;
}

// Fetch promo codes from Firebase
async function fetchPromoCodes() {
  try {
    const response = await fetch(storeHintsConfig.apiUrl);
    const data = await response.json();

    // Convert object to array and filter valid promos
    storeHintsConfig.currentPromos = Object.values(data).filter(
      (promo) => promo.promoName && promo.promoAmount
    );

    return true;
  } catch (error) {
    console.error("Error fetching promo codes:", error);
    return false;
  }
}

// Main function to render store hints
async function renderStoreHints() {
  hintsContainer = document.getElementById("store-hints");
  if (!hintsContainer) return;

  // Fetch promo codes first
  await fetchPromoCodes();

  // Clear existing content
  hintsContainer.innerHTML = `
        <div class="rotating-store-hints"></div>
    `;

  const rotatingContainer = hintsContainer.querySelector(
    ".rotating-store-hints"
  );

  // Add free shipping hint
  rotatingContainer.insertAdjacentHTML(
    "beforeend",
    renderFreeShippingHint(freeshipping)
  );

  // Add promo code hints if available
  storeHintsConfig.currentPromos.forEach((promo) => {
    rotatingContainer.insertAdjacentHTML("beforeend", renderPromoHint(promo));
  });

  // Start rotation if we have multiple hints
  const hints = rotatingContainer.querySelectorAll(".store-hint");
  if (hints.length > 1) {
    startHintRotation(rotatingContainer);
  } else {
    // If only one hint, just show it
    hints[0].style.opacity = "1";
  }
}

// Rotation function
function startHintRotation(container) {
  const hints = container.querySelectorAll(".store-hint");
  let currentIndex = 0;

  // Clear any existing interval
  if (rotationInterval) {
    clearInterval(rotationInterval);
  }

  // Initially show first hint
  hints[currentIndex].style.opacity = "1";
  hints[currentIndex].style.transform = "translateY(0)";

  // Set up rotation interval
  rotationInterval = setInterval(() => {
    // Fade out current hint
    hints[currentIndex].style.opacity = "0";
    hints[currentIndex].style.transform = "translateY(10px)";

    // Move to next hint (with wrap-around)
    currentIndex = (currentIndex + 1) % hints.length;

    // Fade in next hint
    hints[currentIndex].style.opacity = "1";
    hints[currentIndex].style.transform = "translateY(0)";
  }, storeHintsConfig.rotationInterval);
}

// Initialize the store hints when the page loads
document.addEventListener("DOMContentLoaded", renderStoreHints);

// Public function to update hints
window.updateStoreHints = async function (newConfig) {
  Object.assign(storeHintsConfig, newConfig);
  await renderStoreHints();
};
