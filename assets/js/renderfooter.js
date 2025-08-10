document.addEventListener("DOMContentLoaded", function () {
  const footer = document.createElement("footer");
  footer.className = "matagerFooter animate-on-scroll";

  // Payment options array with all your provided links
  const paymentOptions = [
    "https://peacockstorebunny.b-cdn.net/matager-assets/payment%20options/Value.svg",
    "https://peacockstorebunny.b-cdn.net/matager-assets/payment%20options/VisaCard.svg",
    "https://peacockstorebunny.b-cdn.net/matager-assets/payment%20options/VodaCash.svg",
    "https://peacockstorebunny.b-cdn.net/matager-assets/payment%20options/masterCard.svg",
    "https://peacockstorebunny.b-cdn.net/matager-assets/payment%20options/khazna.svg",
    "https://peacockstorebunny.b-cdn.net/matager-assets/payment%20options/Instapay.svg",
    "https://peacockstorebunny.b-cdn.net/matager-assets/payment%20options/contact.svg",
    "https://peacockstorebunny.b-cdn.net/matager-assets/payment%20options/applepay.svg",
    "https://peacockstorebunny.b-cdn.net/matager-assets/payment%20options/aman.svg",
    "https://peacockstorebunny.b-cdn.net/matager-assets/payment%20options/Souhoola.svg",
    "https://peacockstorebunny.b-cdn.net/matager-assets/payment%20options/forsa.svg",
  ];

  // Generate payment icons HTML
  const paymentIconsHTML = paymentOptions
    .map(
      (option) =>
        `<img src="${option}" alt="Payment option" style="height: 40px; margin: 0 5px;">`
    )
    .join("");

  footer.innerHTML = `
 <!-- Payment Options Section -->
            <div style="width: -webkit-fill-available;margin-bottom: 15px;text-align: center;">
                <div style="padding-bottom: 20px;border-bottom: 60px solid white;display: flex;flex-wrap: wrap;justify-content: center;align-items: center;gap: 8px;">
                      ${paymentIconsHTML}
                </div>
            </div>
            
        <!-- Main Footer Content -->
            <div style="gap: 10px; padding: 30px; max-width: 800px; margin: 0 auto; display: flex; flex-direction: column;">
                <div style="display: flex; margin-bottom: 15px; justify-content: center;">
                    <img src="https://peacockstorebunny.b-cdn.net/matager-assets/logos/matager-${theme}-inline.svg" alt="Matager Logo" style="height: 30px;">
                </div>
                
                <div style="color: #6c757d; font-size: 14px; margin-bottom: 10px; text-align: center;">
                    Do you want a website like this?
                </div>

                <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin-bottom: 15px;">
                    <a href="https://matager.online" style="color: #0d6efd; text-decoration: none; font-size: 14px;">
                        Visit Matager.online
                    </a>
                    <a href="tel:01010773587" style="color: #0d6efd; text-decoration: none; font-size: 14px;">
                        Call us: 01010773587
                    </a>
                </div>
                
                <div style="color: #adb5bd; font-size: 12px; text-align: center;">
                    © 2025 Matager. All rights reserved.
                </div>
            </div>
        </div>
    `;

  // Append the footer to the body
  document.body.appendChild(footer);
});
