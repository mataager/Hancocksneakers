async function handleBuyNowClick() {
  // Get product details
  const brandName = document.getElementById("BrandName").innerText;
  const productTitle = document.getElementById("productTitle").innerText;
  const productPrice = document.getElementById("productPrice").innerText;
  const productSize = document.getElementById("product-Size").innerText;
  const productColor = document.getElementById("product-color").innerText;
  const productID = document.getElementById("productID").innerText;

  // Show the form to collect user details
  showUserForm();
}

//v1
// Function to show the user form
function showUserForm() {
  // Smoothly scroll to the top of the page
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  // Create a form element
  const form = document.createElement("form");
  form.classList.add("BuyItNowForm");

  // Get product details
  const productImage = document.getElementById("productImage").src;
  const productSize = document.getElementById("product-Size").innerText;
  const productColor = document.getElementById("product-color").innerText;
  const productPrice = document.getElementById("productPrice").innerText;

  // Create a container for the product summary
  const productSummary = document.createElement("div");
  productSummary.style.display = "flex";
  productSummary.style.alignItems = "center";
  productSummary.style.gap = "10px";
  productSummary.style.marginBottom = "20px";
  productSummary.style.flexDirection = "column"; // Stack items vertically

  // Create close button
  const closeButton = document.createElement("div");
  closeButton.innerHTML = '<i class="bi bi-x"></i>'; // X symbol
  closeButton.style.position = "absolute";
  closeButton.style.top = "10px";
  closeButton.style.right = "10px";
  closeButton.style.background = "none";
  closeButton.style.border = "none";
  closeButton.style.fontSize = "20px";
  closeButton.style.cursor = "pointer";
  closeButton.style.padding = "5px 10px";

  // Add hover effect
  closeButton.onmouseover = function () {
    this.style.color = "red";
  };
  closeButton.onmouseout = function () {
    this.style.color = "black";
  };

  // Close functionality - only this part is new
  closeButton.onclick = function () {
    form.remove();
  };

  // Create a container for the product image with a size badge
  const imageContainer = document.createElement("div");
  imageContainer.style.position = "relative"; // For absolute positioning of the badge

  // Add the product image
  const productImageElement = document.createElement("img");
  productImageElement.src = productImage;
  productImageElement.style.width = "100px";
  productImageElement.style.height = "100px";
  productImageElement.style.borderRadius = "5px";
  productImageElement.style.objectFit = "cover";
  productImageElement.style.margin = "20px"; // Add margin around the image
  imageContainer.appendChild(productImageElement);

  // Add the size badge
  const sizeBadge = document.createElement("p");
  sizeBadge.innerText = productSize;
  sizeBadge.style.color = "white";
  sizeBadge.style.backgroundColor = "black";
  sizeBadge.style.borderRadius = "5px";
  sizeBadge.style.padding = "5px";
  sizeBadge.style.position = "absolute";
  sizeBadge.style.top = "0";
  sizeBadge.style.width = "fit-content";
  sizeBadge.style.margin = "0";
  sizeBadge.style.fontSize = "10px";
  imageContainer.appendChild(sizeBadge);

  // Add the product color
  const colorText = document.createElement("p");
  colorText.innerText = `${productColor}`;
  colorText.style.margin = "0";
  colorText.style.fontSize = "10px";
  colorText.style.borderRadius = "5px";
  colorText.style.padding = "5px";
  colorText.style.background = "black";
  colorText.style.color = "white";
  colorText.style.position = "absolute";
  colorText.style.bottom = "0"; // Position at the bottom of the image
  imageContainer.appendChild(colorText);

  // Append the image container to the product summary
  productSummary.appendChild(imageContainer);

  // Add the product price after the image, size, and color
  const priceText = document.createElement("h3");
  priceText.innerText = `Price: ${productPrice}`;
  priceText.style.margin = "0";
  priceText.style.fontSize = "12px";
  priceText.style.fontWeight = "thin";
  priceText.style.color = "#333";
  productSummary.appendChild(priceText);

  // Append the product summary to the form
  form.appendChild(productSummary);

  // Add input fields
  const nameInput = createInput("text", "name", "Enter your name");
  const phoneInput = createInput("tel", "phone", "Enter your phone number");
  const secondPhoneInput = createInput(
    "tel",
    "secondPhone",
    "Enter a second phone number (optional)"
  );
  const Gityandgovernment = createInput(
    "text",
    "Gityandgovernment",
    "City/Government : Giza/Dokki"
  );

  // Add a textarea for the address
  const addressTextArea = createTextArea("address", "Enter your address");

  // Add a textarea for order notes (optional)
  const orderNotesTextArea = createTextArea(
    "orderNotes",
    "Add any additional notes or special instructions (optional)"
  );

  // Add a submit button
  const submitButton = document.createElement("button");
  submitButton.classList.add("placeorderbtn");
  submitButton.type = "submit";
  submitButton.innerText = "Place order";

  // Append inputs and buttons to the form
  form.appendChild(nameInput);
  form.appendChild(phoneInput);
  form.appendChild(secondPhoneInput);
  form.appendChild(Gityandgovernment);
  form.appendChild(addressTextArea);
  form.appendChild(orderNotesTextArea);
  form.appendChild(closeButton);
  form.appendChild(submitButton);

  form.onsubmit = async function (event) {
    event.preventDefault(); // Prevent form submission

    // Check if required fields are filled
    if (
      !nameInput.value ||
      !phoneInput.value ||
      !addressTextArea.value ||
      !Gityandgovernment.value
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill out all required fields: Name, Phone, and Address.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    // Show preloader in the button
    submitButton.innerHTML = `<div class="preloader" id="preloader"> <div class="loader"></div></div>`;
    submitButton.disabled = true;

    // Get form data
    const formData = {
      name: nameInput.value,
      phone: phoneInput.value,
      secondPhone: secondPhoneInput.value || "N/A",
      address: addressTextArea.value,
      city: Gityandgovernment.value,
      orderNotes: orderNotesTextArea.value || "N/A",
    };

    // Get product details
    const brandName = document.getElementById("BrandName").innerText;
    const productTitle = document.getElementById("productTitle").innerText;
    const productPrice = document.getElementById("productPrice").innerText;
    const productSize = document.getElementById("product-Size").innerText;
    const productColor = document.getElementById("product-color").innerText;
    const productID = document.getElementById("productID").innerText;
    const productImage = document.getElementById("productImage").src;

    try {
      // Sign in the guest user programmatically
      const userCredential = await firebase
        .auth()
        .signInWithEmailAndPassword(GuestEmail, GuestEmail);
      const idToken = await userCredential.user.getIdToken();

      // Check product availability and stock
      const productResponse = await fetch(
        `${url}/Stores/${uid}/Products/${productID}.json?auth=${idToken}`
      );
      const productData = await productResponse.json();

      if (!productData) {
        throw new Error("Product no longer available");
      }
      const requestedQty = 1; // Since this is single product order
      if (vanishedstock) {
        // Check stock quantity
        const stockQty =
          productData.sizes?.[productSize]?.[productColor]?.qty || 0;

        if (stockQty < requestedQty) {
          Swal.fire({
            icon: "warning",
            title: "Product Unavailable",
            html: `
            <div style="text-align: center;">
              <img src="${productImage}" alt="${productTitle}" style="width: 100px; height: 100px; margin-bottom: 15px;">
              <p><strong>${productTitle}</strong></p>
              <p>Requested quantity (${requestedQty}) exceeds available stock (${stockQty}).</p>
            </div>
          `,
            confirmButtonText: "OK",
          });
          return;
        }

        // Update stock in Firebase
        const newStockQty = stockQty - requestedQty;
        if (newStockQty > 0) {
          await fetch(
            `${url}/Stores/${uid}/Products/${productID}/sizes/${productSize}/${productColor}.json?auth=${idToken}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ qty: newStockQty }),
            }
          );
        } else {
          // Delete the size/color if stock is depleted
          await fetch(
            `${url}/Stores/${uid}/Products/${productID}/sizes/${productSize}/${productColor}.json?auth=${idToken}`,
            {
              method: "DELETE",
            }
          );
        }
      }

      // Prepare order data
      const order = {
        Customeruid: "Guest User",
        Date: new Date().toISOString(),
        cart: [
          {
            brand: brandName,
            id: productID,
            photourl: productImage,
            price: productPrice,
            productColor: productColor,
            productSize: productSize,
            quantity: requestedQty,
            title: productTitle,
          },
        ],
        payment: "N/A",
        personal_info: {
          address: formData.address,
          name: formData.name,
          email: "Guest",
          phone: formData.phone,
          phone2: formData.secondPhone,
          city: formData.city,
          notes: formData.orderNotes,
        },
        shippingFees: parseInt(maxshipping, 10),
        isGuest: true,
      };

      // Push order data to the server
      const orderResponse = await fetch(
        `${url}/Stores/${uid}/orders.json?auth=${idToken}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(order),
        }
      );

      if (!orderResponse.ok) {
        throw new Error("Failed to place the order.");
      }

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Order Placed!",
        html: `
          <div style="text-align: center;">
            <img src="${productImage}" alt="${productTitle}" style="width: 100px; height: 100px; margin-bottom: 15px;">
            <p><strong>${productTitle}</strong></p>
            <p>Your order has been placed successfully.</p>
          </div>
        `,
        showConfirmButton: false,
        timer: 3000,
      });

      // Remove the form from the DOM
      form.remove();
    } catch (error) {
      console.error("Error:", error);

      let errorMessage =
        "An error occurred while placing the order. Please try again.";
      if (error.message === "Product no longer available") {
        errorMessage =
          "This product is no longer available. Please refresh the page.";
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      // Reset the button text and enable it
      submitButton.innerHTML = "Place order";
      submitButton.disabled = false;

      // Log out the guest user
      try {
        await firebase.auth().signOut();
      } catch (error) {
        console.error("Error signing out guest user:", error);
      }
    }
  };

  // Append the form to the body
  document.body.appendChild(form);
}

// Function to create an input field
function createInput(type, id, placeholder) {
  const input = document.createElement("input");
  input.type = type;
  input.id = id;
  input.placeholder = placeholder;
  input.style.padding = "10px";
  input.style.border = "1px solid #ccc";
  input.style.borderRadius = "5px";
  return input;
}

// Function to create a textarea field
function createTextArea(id, placeholder) {
  const textarea = document.createElement("textarea");
  textarea.classList.add("input");
  textarea.id = id;
  textarea.placeholder = placeholder;
  textarea.style.maxWidth = "375px";
  textarea.style.width = "-webkit-fill-available";
  textarea.style.background = "none";
  textarea.style.color = "inherit";
  textarea.style.fontFamily = "inherit";
  textarea.style.fontSize = "medium";
  textarea.style.padding = "10px";
  textarea.style.border = "1px solid #ccc";
  textarea.style.borderRadius = "5px";
  textarea.style.resize = "vertical"; // Allow vertical resizing
  textarea.style.minHeight = "100px"; // Set a minimum height
  return textarea;
}
