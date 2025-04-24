// const firebaseConfig = {
//   apiKey: "AIzaSyDss53pHibCpqo87_1bhoUHkf8Idnj-Fig",
//   authDomain: "matager-f1f00.firebaseapp.com",
//   projectId: "matager-f1f00",
//   storageBucket: "matager-f1f00.appspot.com",
//   messagingSenderId: "922824110897",
//   appId: "1:922824110897:web:b7978665d22e2d652e7610",
// };

// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// const auth = firebase.auth();
//
// async function googleSignIn() {
//   const provider = new firebase.auth.GoogleAuthProvider();
//   try {
//     const result = await firebase.auth().signInWithPopup(provider);
//     Swal.fire({
//       icon: "success",
//       title: "Signed in successfully!",
//       showConfirmButton: false,
//       timer: 1500, // Close the alert after 1.5 seconds
//     });
//     return result.user;
//   } catch (error) {
//     console.error("Error signing in:", error);
//     Swal.fire({
//       icon: "error",
//       title: "Sign In Failed",
//       text: "There was a problem signing you in. Please try again!",
//       showConfirmButton: false,
//       timer: 1500, // Close the alert after 1.5 seconds
//     });
//     return null;
//   }
// }
//

//main

async function submitOrder() {
  try {
    // Ensure the user is signed in and fetch their token
    const user = firebase.auth().currentUser;
    const modal = document.querySelector(".modal");
    const modalContent = document.querySelector(".modal-content");
    const body = document.body;
    if (!user) {
      // Set the modal content for non-authenticated users
      modalContent.innerHTML = `
      <div class="guestmodalarea">
        <h2>Sign in for better experience</h2>
        <p>You can sign in to save your details,track your order,add items to favourite etc.</p>
        <div class="modal-buttons">
          <button id="goToAccount" class="modal-btn Gotoaccountbtn">Go to Account</button>
        </div>
        <h2 class="mt-40">OR</h2>
        <p>Continue as guest for quick and easy checkout</p>
        <div class="modal-buttons">
          <button id="continueGuest" class="modal-btn continueasguest">Continue as Guest</button>
        </div>
      </div>
      `;

      // Show the modal and disable background interactions
      body.classList.add("modal-open");
      modal.classList.add("show");

      // Add event listeners to the buttons
      document.getElementById("goToAccount").addEventListener("click", () => {
        window.location.href = "./account.html";
        closeModal();
      });

      document.getElementById("continueGuest").addEventListener("click", () => {
        sessionStorage.setItem("isGuest", "true");
        removeaddressarea();
        prepareguestbtn();
        closeModal();
      });

      // Close modal when clicking outside content (optional)
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          closeModal();
        }
      });
      function closeModal() {
        modal.classList.remove("show");
        body.classList.remove("modal-open");
      }
    } else {
      // Show the preloader
      document.getElementById("preloader").classList.remove("hidden");
      const idToken = await user.getIdToken();
      const Customeruid = user.uid; // Fetch the UID of the logged-in user
      // Get the cart from local storage
      let cart = JSON.parse(localStorage.getItem("cart"));
      if (!cart || cart.length === 0) {
        document.getElementById("preloader").classList.add("hidden");
        Swal.fire({
          icon: "warning",
          title: "Your cart is empty",
          text: "Please add items to your cart before placing an order.",
        });
        return;
      }

      const cartTotalElement = document.getElementById("cart-total");
      let cartTotal = 0;

      if (cartTotalElement) {
        const cartTotalText = cartTotalElement.innerText.match(/\d+/)
          ? cartTotalElement.innerText.match(/\d+/)[0]
          : "0";
        cartTotal = parseInt(cartTotalText, 10);
      }

      const unavailableItems = [];
      const updatedCart = [];

      for (const item of cart) {
        // Fetch the product data from Firebase
        const productResponse = await fetch(
          `${url}/Stores/${uid}/Products/${item.id}.json?auth=${idToken}`
        );
        const productData = await productResponse.json();

        if (!productData) {
          unavailableItems.push({
            title: item.title,
            photourl: item.photourl,
            reason: "Product no longer exists in the store.",
          });
          continue;
        }
        if (vanishedstock) {
          const stockQty =
            productData.sizes[item.productSize]?.[item.productColor]?.qty || 0;

          if (stockQty < item.quantity) {
            unavailableItems.push({
              title: item.title,
              photourl: item.photourl,
              reason: `Requested quantity (${item.quantity}) exceeds available stock (${stockQty}).`,
            });
            continue;
          }

          // Update the stock in Firebase
          const newStockQty = stockQty - item.quantity;

          if (newStockQty > 0) {
            await fetch(
              `${url}/Stores/${uid}/Products/${item.id}/sizes/${item.productSize}/${item.productColor}.json?auth=${idToken}`,
              {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ qty: newStockQty }),
              }
            );
          } else {
            // Delete the size/color if stock is depleted
            await fetch(
              `${url}/Stores/${uid}/Products/${item.id}.json?auth=${idToken}`,
              {
                method: "DELETE",
              }
            );
          }
        }

        updatedCart.push(item);
      }

      if (unavailableItems.length > 0) {
        document.getElementById("preloader").classList.add("hidden");

        const unavailableList = unavailableItems
          .map(
            (item) =>
              `<li>
              <img src="${item.photourl}" alt="${item.title}" style="width: 50px; height: 50px; margin-right: 10px;">
              <strong>${item.title}</strong> - ${item.reason}
            </li>`
          )
          .join("");

        Swal.fire({
          icon: "warning",
          title: "Some items are unavailable",
          html: `<ul>${unavailableList}</ul>`,
        }).then(() => {
          location.reload();
        });

        return;
      }

      // Get personal information and shipping fees
      const personalInfo = await getPersonalInfo(Customeruid, idToken);
      const shippingFees =
        parseFloat(localStorage.getItem("shippingFees")) || 0;
      const payment = localStorage.getItem("Payment") || "N/A";

      // Construct a preliminary order object
      const preliminaryOrder = {
        cart: updatedCart,
        personal_info: personalInfo,
        shippingFees,
        payment,
      };

      // Add order to customer history and get the order UID
      const orderUID = await addOrderToCustomerHistory(
        Customeruid,
        idToken,
        preliminaryOrder
      );

      // Construct the final order object
      const order = {
        ...preliminaryOrder, // Spread the preliminary order properties
        Customeruid: Customeruid,
        orderUID: orderUID, // Add the order UID
        Date: formattedDate,
      };

      // Submit the order to Firebase
      const orderResponse = await fetch(
        `${url}/Stores/${uid}/orders.json?auth=${idToken}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(order),
        }
      );

      if (!orderResponse.ok) {
        throw new Error("Failed to submit order");
      }

      // Clear the cart
      localStorage.removeItem("cart");
      document.getElementById("preloader").classList.add("hidden");

      Swal.fire({
        icon: "success",
        title: "Order submitted successfully!",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        window.location.href = "./index.html";
      });
    }
  } catch (error) {
    console.error("Error during order submission:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "An error occurred while processing your order. Please try again.",
    });
  }
}

//submit order in cart as guest
// async function guestSubmitorder() {
//   const modal = document.querySelector(".modal");
//   const modalContent = document.querySelector(".modal-content");
//   const body = document.body;

//   // Set the modal content for guest checkout form
//   modalContent.innerHTML = `
//     <div class="guestmodalarea">
//     <button type="button"  id="cancelGuestOrder">
//               <i class="bi bi-x-lg"></i>
//           </button>
//       <h2>Guest Checkout</h2>
//       <form class="mt-10" id="guestCheckoutForm">
//         <div class="form-group">
//           <input type="text" id="guest-name" class="form-input" placeholder="Full Name" required>
//         </div>
//         <div class="form-group">
//           <input type="tel" id="guest-phone1" class="form-input" placeholder="Phone Number (required)" required>
//         </div>
//         <div class="form-group">
//           <input type="tel" id="guest-phone2" class="form-input" placeholder="Alternative Phone (optional)">
//         </div>
//         <div class="form-group">
//           <input type="text" id="Gityandgovernment" class="form-input" placeholder="City/Government : Giza/Dokki">
//         </div>
//         <div class="form-group">
//           <textarea id="guest-address" class="form-textarea" placeholder="Full Address" required></textarea>
//         </div>
//         <div class="modal-buttons">
//           <button type="submit" id="submitGuestOrder" class="modal-btn suborderasguest">Order Now</button>
//         </div>
//       </form>
//     </div>
//   `;

//   // Show the modal and disable background interactions
//   body.classList.add("modal-open");
//   modal.classList.add("show");

//   // Handle form submission
//   document
//     .getElementById("guestCheckoutForm")
//     .addEventListener("submit", async (e) => {
//       e.preventDefault();

//       const name = document.getElementById("guest-name").value;
//       const phone1 = document.getElementById("guest-phone1").value;
//       const phone2 = document.getElementById("guest-phone2").value;
//       const Gityandgovernment =
//         document.getElementById("Gityandgovernment").value;
//       const address = document.getElementById("guest-address").value;

//       if (!name || !phone1 || !address || !Gityandgovernment) {
//         alert("Please fill all required fields");
//         return;
//       }

//       // Show preloader
//       document.getElementById("preloader").classList.remove("hidden");

//       // Close modal
//       closeModal();

//       // Here you would continue with your order processing logic
//       // using the collected guest information (name, phone1, phone2, address)
//       // ...
//     });

//   // Handle cancel button
//   document.getElementById("cancelGuestOrder").addEventListener("click", () => {
//     closeModal();
//   });

//   // Close modal when clicking outside content
//   modal.addEventListener("click", (e) => {
//     if (e.target === modal) {
//       closeModal();
//     }
//   });

//   function closeModal() {
//     modal.classList.remove("show");
//     body.classList.remove("modal-open");
//   }
// }

async function guestSubmitorder() {
  try {
    const modal = document.querySelector(".modal");
    const modalContent = document.querySelector(".modal-content");
    const body = document.body;

    // Check if cart exists and has items
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Your cart is empty",
        text: "Please add items to your cart before placing an order.",
      });
      return;
    }

    // Show guest checkout form modal
    modalContent.innerHTML = `
      <div class="guestmodalarea">
        <button type="button" id="cancelGuestOrder">
          <i class="bi bi-x-lg"></i>
        </button>
        <h2>Guest Checkout</h2>
        <form class="mt-10" id="guestCheckoutForm">
          <div class="form-group">
            <input type="text" id="guest-name" class="form-input" placeholder="Full Name" required>
          </div>
          <div class="form-group">
            <input type="tel" id="guest-phone1" class="form-input" placeholder="Phone Number (required)" required>
          </div>
          <div class="form-group">
            <input type="tel" id="guest-phone2" class="form-input" placeholder="Alternative Phone (optional)">
          </div>
          <div class="form-group">
            <input type="text" id="Gityandgovernment" class="form-input" placeholder="City/Government" required>
          </div>
          <div class="form-group">
            <textarea id="guest-address" class="form-textarea" placeholder="Full Address" required></textarea>
          </div>
          <div class="form-group">
            <textarea id="guest-notes" class="form-textarea mt-10" placeholder="Order Notes (optional)"></textarea>
          </div>
          <div class="modal-buttons">
            <button type="submit" id="submitGuestOrder" class="modal-btn suborderasguest">
              <span id="submitButtonText">Place Order</span>
              <div class="preloader hidden" id="preloader">
                <div class="loader"></div>
              </div>
            </button>
          </div>
        </form>
      </div>
    `;

    // Show the modal
    body.classList.add("modal-open");
    modal.classList.add("show");

    // Handle form submission
    document
      .getElementById("guestCheckoutForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitButton = document.getElementById("submitGuestOrder");
        const submitText = document.getElementById("submitButtonText");
        const preloader = document.getElementById("preloader");

        // Get form values
        const name = document.getElementById("guest-name").value;
        const phone1 = document.getElementById("guest-phone1").value;
        const phone2 = document.getElementById("guest-phone2").value;
        const city = document.getElementById("Gityandgovernment").value;
        const address = document.getElementById("guest-address").value;
        const notes = document.getElementById("guest-notes").value;

        // Validate required fields
        if (!name || !phone1 || !address || !city) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please fill out all required fields: Name, Phone, City and Address.",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
          });
          return;
        }

        // Show loading state
        submitText.classList.add("hidden");
        preloader.classList.remove("hidden");
        submitButton.disabled = true;

        try {
          // Sign in guest user
          const userCredential = await firebase
            .auth()
            .signInWithEmailAndPassword(GuestEmail, GuestEmail);
          const idToken = await userCredential.user.getIdToken();

          // Process cart items (similar to submitOrder)
          const unavailableItems = [];
          const updatedCart = [];
          let cartTotal = 0;

          for (const item of cart) {
            // Fetch product data from Firebase
            const productResponse = await fetch(
              `${url}/Stores/${uid}/Products/${item.id}.json?auth=${idToken}`
            );
            const productData = await productResponse.json();

            if (!productData) {
              unavailableItems.push({
                title: item.title,
                photourl: item.photourl,
                reason: "Product no longer exists in the store.",
              });
              continue;
            }
            if (vanishedstock) {
              const stockQty =
                productData.sizes[item.productSize]?.[item.productColor]?.qty ||
                0;

              if (stockQty < item.quantity) {
                unavailableItems.push({
                  title: item.title,
                  photourl: item.photourl,
                  reason: `Requested quantity (${item.quantity}) exceeds available stock (${stockQty}).`,
                });
                continue;
              }

              // Update stock in Firebase
              const newStockQty = stockQty - item.quantity;

              if (newStockQty > 0) {
                await fetch(
                  `${url}/Stores/${uid}/Products/${item.id}/sizes/${item.productSize}/${item.productColor}.json?auth=${idToken}`,
                  {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ qty: newStockQty }),
                  }
                );
              } else {
                // Delete the size/color if stock is depleted
                await fetch(
                  `${url}/Stores/${uid}/Products/${item.id}/sizes/${item.productSize}/${item.productColor}.json?auth=${idToken}`,
                  {
                    method: "DELETE",
                  }
                );
              }
            }

            updatedCart.push(item);
            cartTotal += (parseFloat(item.price) || 0) * item.quantity;
          }

          if (unavailableItems.length > 0) {
            const unavailableList = unavailableItems
              .map(
                (item) =>
                  `<li>
                <img src="${item.photourl}" alt="${item.title}" style="width: 50px; height: 50px; margin-right: 10px;">
                <strong>${item.title}</strong> - ${item.reason}
              </li>`
              )
              .join("");

            Swal.fire({
              icon: "warning",
              title: "Some items are unavailable",
              html: `<ul>${unavailableList}</ul>`,
            }).then(() => {
              location.reload();
            });

            return;
          }

          // Get shipping fees (you might want to calculate this differently for guests)

          const payment = localStorage.getItem("Payment") || "N/A";

          // Prepare order data
          const order = {
            Customeruid: "Guest User",
            Date: new Date().toISOString(),
            cart: updatedCart,
            payment: payment,
            personal_info: {
              address: address,
              name: name,
              email: "Guest",
              phone: phone1,
              phone2: phone2 || "N/A",
              city: city,
              notes: notes || "N/A",
            },
            shippingFees: parseInt(maxshipping, 10),
            isGuest: true,
          };

          // Submit order to Firebase
          const orderResponse = await fetch(
            `${url}/Stores/${uid}/orders.json?auth=${idToken}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(order),
            }
          );

          if (!orderResponse.ok) {
            throw new Error("Failed to submit order");
          }

          // Clear the cart
          localStorage.removeItem("cart");
          closeModal();

          Swal.fire({
            icon: "success",
            title: "Order submitted successfully!",
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            window.location.href = "./index.html";
          });
        } catch (error) {
          console.error("Error during guest order submission:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An error occurred while processing your order. Please try again.",
          });
        } finally {
          // Reset button state
          submitText.classList.remove("hidden");
          preloader.classList.add("hidden");
          submitButton.disabled = false;

          // Log out guest user
          try {
            await firebase.auth().signOut();
          } catch (error) {
            console.error("Error signing out guest user:", error);
          }
        }
      });

    // Handle cancel button
    document
      .getElementById("cancelGuestOrder")
      .addEventListener("click", () => {
        closeModal();
      });

    // Close modal when clicking outside content
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    function closeModal() {
      modal.classList.remove("show");
      body.classList.remove("modal-open");
    }
  } catch (error) {
    console.error("Error in guestSubmitorder:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "An error occurred while starting the checkout process. Please try again.",
    });
  }
}

async function getPersonalInfo(Customeruid, idToken) {
  try {
    // Fetch personal info from Firebase
    const response = await fetch(
      `https://matager-f1f00-default-rtdb.firebaseio.com/users/${Customeruid}/personalInfo.json?auth=${idToken}`
    );
    const data = await response.json();

    if (!data) {
      throw new Error("Failed to fetch personal information.");
    }

    // Extract personal info key and details
    const personalInfoKey = Object.keys(data)[0];
    const personalInfo = data[personalInfoKey];
    const userid = Customeruid;
    const name = `${personalInfo.firstName} ${personalInfo.lastName}`;
    const { email, phone, phone2 } = personalInfo;

    // Retrieve address, city, and shipping fees from local storage
    const address = localStorage.getItem("Address") || "N/A";
    const city = localStorage.getItem("City") || "N/A";
    const shippingFees = parseFloat(localStorage.getItem("shippingFees")) || 0;

    // Combine all information into a single object
    return {
      userid,
      name,
      email,
      phone,
      phone2,
      address,
      city,
      shippingFees,
    };
  } catch (error) {
    console.error("Error fetching personal information:", error);
    throw error;
  }
}

async function addOrderToCustomerHistory(Customeruid, idToken, order) {
  try {
    // Use `push()` to generate a random unique key automatically
    const saveResponse = await fetch(
      `https://matager-f1f00-default-rtdb.firebaseio.com/users/${Customeruid}/orderHistory/${uid}.json?auth=${idToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          order: order.cart.map((item) => ({
            id: item.id,
            brand: item.brand,
            title: item.title,
            photo: item.photourl,
            price: item.price,
            qty: item.quantity,
            size: item.productSize,
            color: item.productColor,
          })),
          progress: "Pending", // Add progress with a default value of "Pending"
          payment: order.payment,
          Date: formattedDate,
        }),
      }
    );

    if (!saveResponse.ok) throw new Error("Order history couldn't save");

    // Retrieve the unique key from the Firebase response
    const saveData = await saveResponse.json();
    const orderUID = saveData.name; // Firebase's generated key

    return orderUID; // Return the UID if needed elsewhere
  } catch (error) {
    console.error("Error updating order history:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
}
