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

// function calculateSalePrice(originalPrice, saleAmount) {
//   const discountedPrice = originalPrice - originalPrice * (saleAmount / 100);
//   return Math.round(discountedPrice); // Rounds to the nearest integer (e.g., 3197.6 → 3198)
// }

function calculateSalePrice(originalPrice, saleAmount) {
  const discountedPrice = originalPrice - originalPrice * (saleAmount / 100);

  if (!autopricehandle) {
    return Math.round(discountedPrice);
  }

  // Small prices (≤ 999): round UP to nearest 50
  if (discountedPrice <= 999) {
    return Math.ceil(discountedPrice / 50) * 50;
  }

  // Medium prices (1,000-9,999): round UP to nearest 100
  if (discountedPrice <= 9999) {
    return Math.ceil(discountedPrice / 100) * 100;
  }

  // Large prices (≥10,000): round UP to nearest 1000
  return Math.ceil(discountedPrice / 1000) * 1000;
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

//shipping and reurn policy
function openPolicyModal() {
  // Create preloader overlay if it doesn't exist
  let preloader = document.getElementById("preloader-overlay");
  if (!preloader) {
    preloader = document.createElement("div");
    preloader.id = "preloader-overlay";
    preloader.className = "preloader-overlay";
    preloader.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(preloader);
  }

  preloader.classList.remove("hidden");
  document.body.classList.add("modal-open");

  // Start timer for minimum 1 second
  const minLoadTime = 1000;
  const startTime = Date.now();

  setTimeout(() => {
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, minLoadTime - elapsedTime);

    setTimeout(() => {
      // Fade out preloader
      preloader.classList.add("hidden");

      // Prepare modal
      const modal = document.querySelector(".modal");
      const modalContent = document.querySelector(".modal-content");

      // Set modal position and styles
      modal.style.display = "block";
      document.body.style.overflow = "hidden";

      // Policy content with improved list styling
      modalContent.innerHTML = `
        <div class="flex justify-content-space-between width-available modal-header">
          <div class="flex center flex-end" onclick="closeModal()">
            <button style="margin: 0px; border-radius: 0px 8px 0px 8px; background: initial !important; color:#333;" type="button" class="Add-to-Cart" id="closeButton">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
        
        <div class="policy-content" style="padding: 20px; max-height: 80vh; overflow-y: auto;">
          <h2 style="margin-bottom: 20px; color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Return Policy</h2>
          <ul class="policy-list">
            <li class="policy-item"><span class="policy-icon">•</span> You can only return the Order/Item within 24 hours after receiving your order.</li>
            <li class="policy-item"><span class="policy-icon">•</span> When returned, the item must be in the same condition as received.</li>
            <li class="policy-item"><span class="policy-icon">•</span> Shipping fees are non-refundable.</li>
            <li class="policy-item"><span class="policy-icon">•</span> You can try the product before making a payment. If it doesn't fit or you don't like it, you can return it directly with the delivery agent.</li>
          </ul>
          
          <div class="arabic-policy" style="margin-top: 30px; direction: rtl; text-align: right;">
            <h3 style="margin-bottom: 15px; color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">سياسة الإرجاع</h3>
            <ul class="policy-list" style="padding-right: 20px;">
              <li class="policy-item"><span class="policy-icon">•</span> يمكنك تقديم على إرجاع الطلب / المنتج بعد استلامه خلال 24 ساعة من الاستلام</li>
              <li class="policy-item"><span class="policy-icon">•</span> رسوم الشحن غير قابلة للاسترداد</li>
              <li class="policy-item"><span class="policy-icon">•</span> يمكنك تجربة المنتج قبل الدفع. وإذا لم يكن مناسبًا أو لم يعجبك، يمكنك إرجاعه مباشرة مع مندوب التوصيل</li>
            </ul>
          </div>
          
          <div class="faq-section" style="margin-top: 40px;">
            <h3 style="margin-bottom: 20px; color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Frequently Asked Questions</h3>
            
            <div class="faq-item" style="margin-bottom: 20px;">
              <h4 style="color: #555; margin-bottom: 8px; cursor: pointer;" onclick="toggleFAQ(this)">► How to place an Order?</h4>
              <div class="faq-answer" style="display: none; padding-left: 20px; color: #666;">
                <p>To place an order, simply browse our products, select the items you want, and proceed to checkout.</p>
              </div>
            </div>
            
            <div class="faq-item" style="margin-bottom: 20px;">
              <h4 style="color: #555; margin-bottom: 8px; cursor: pointer;" onclick="toggleFAQ(this)">► What are the Installment options?</h4>
              <div class="faq-answer" style="display: none; padding-left: 20px; color: #666;">
                <p>We offer various installment plans through select payment providers. Options will be shown at checkout.</p>
              </div>
            </div>
            
            <div class="faq-item" style="margin-bottom: 20px;">
              <h4 style="color: #555; margin-bottom: 8px; cursor: pointer;" onclick="toggleFAQ(this)">► Can I edit or cancel my order?</h4>
              <div class="faq-answer" style="display: none; padding-left: 20px; color: #666;">
                <p>You can edit or cancel your order within 1 hour of placement by contacting customer service.</p>
              </div>
            </div>
            
            <div class="faq-item" style="margin-bottom: 20px;">
              <h4 style="color: #555; margin-bottom: 8px; cursor: pointer;" onclick="toggleFAQ(this)">► What is the estimated delivery?</h4>
              <div class="faq-answer" style="display: none; padding-left: 20px; color: #666;">
                <p>Delivery typically takes 3-5 business days within major cities, and 5-7 days for other areas.</p>
              </div>
            </div>
          </div>
        </div>
      `;

      // Animate modal in from right
      setTimeout(() => {
        modal.classList.add("show");
      }, 10);

      // Close handler
      modal.addEventListener("click", function (event) {
        if (!modalContent.contains(event.target)) {
          closeModal();
        }
      });
    }, remainingTime);
  }, 10);
}

// FAQ toggle function
function toggleFAQ(element) {
  const answer = element.nextElementSibling;
  if (answer.style.display === "none" || !answer.style.display) {
    answer.style.display = "block";
    element.innerHTML = element.innerHTML.replace("►", "▼");
  } else {
    answer.style.display = "none";
    element.innerHTML = element.innerHTML.replace("▼", "►");
  }
}
// Reuse the same closeModal function
function closeModal() {
  const modal = document.querySelector(".modal");
  const preloader = document.getElementById("preloader-overlay");

  modal.classList.remove("show");

  setTimeout(() => {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    document.body.classList.remove("modal-open");

    if (preloader) {
      preloader.classList.add("hidden");
    }
  }, 300);
}
