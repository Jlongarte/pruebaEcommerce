document.addEventListener("DOMContentLoaded", () => {
  const productsGrid = document.querySelector(".products-grid");
  const categoryList = document.getElementById("category-list");
  const allProducts = document.querySelector(".all-products");

  // Carga productos por categoría FakeStore API
  function loadProducts(category = "women's clothing") {
    fetch(
      `https://fakestoreapi.com/products/category/${encodeURIComponent(
        category
      )}`
    )
      .then((res) => res.json())
      .then((products) => {
        productsGrid.innerHTML = "";

        products.forEach((product) => {
          productsGrid.innerHTML += `
            <div class="product-card">
              <img src="${product.image}" alt="${product.title}">
              <h3>${product.title}</h3>
              <p class="price">$${product.price}</p>
            </div>
          `;
        });
      })
      .catch((err) => {
        console.error("Error cargando productos:", err);
        productsGrid.innerHTML = "<p>Error al cargar productos.</p>";
      });
  }

  // Delegar clic en categorías
  categoryList.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      const category = e.target.getAttribute("data-category");
      if (category) {
        loadProducts(category);

        document
          .querySelectorAll("#category-list li")
          .forEach((li) => li.classList.remove("active"));
        e.target.classList.add("active");
      }
    }
  });

  // Cargar productos iniciales FakeStore
  loadProducts();

  // Cargar productos mock.shop en .all-products
  fetchAndRenderMockShopProducts();

  async function fetchAndRenderMockShopProducts() {
    try {
      const query = `
        {
          products(first: 12) {
            edges {
              node {
                id
                title
                featuredImage {
                  url
                  altText
                }
                variants(first: 1) {
                  edges {
                    node {
                      price {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const response = await fetch("https://mock.shop/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const json = await response.json();
      const products = json.data.products.edges;

      allProducts.innerHTML = "";

      products.forEach(({ node }) => {
        const imageUrl = node.featuredImage?.url || "";
        const imageAlt = node.featuredImage?.altText || node.title;
        const price = node.variants.edges[0]?.node.price;

        allProducts.innerHTML += `
          <div class="product-card">
            <img src="${imageUrl}" alt="${imageAlt}">
            <h3>${node.title}</h3>
            <p class="price">$${price.amount}</p>
          </div>
        `;
      });
    } catch (error) {
      console.error("Error cargando productos mock.shop:", error);
      allProducts.innerHTML =
        "<p>Error al cargar productos desde mock.shop.</p>";
    }
  }
});

const reviews = [
  {
    name: "Emily Johnson",
    profession: "Graphic Designer",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    review:
      "I absolutely love the jacket I bought! The quality is fantastic and it fits perfectly. Delivery was super fast too.",
  },
  {
    name: "Michael Lee",
    profession: "Marketing Manager",
    photo: "https://randomuser.me/api/portraits/men/35.jpg",
    review:
      "The jeans are very comfortable and stylish. The size guide was accurate, so no surprises there. Will definitely shop again!",
  },
  {
    name: "Sophia Martinez",
    profession: "Teacher",
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
    review:
      "Great customer service and the dress I ordered looks even better in person. Perfect for my upcoming event!",
  },
  {
    name: "James Carter",
    profession: "Software Engineer",
    photo: "https://randomuser.me/api/portraits/men/22.jpg",
    review:
      "Bought a couple of t-shirts and they are very soft and durable. The colors didn't fade after washing. Highly recommend.",
  },
  {
    name: "Olivia Brown",
    profession: "Photographer",
    photo: "https://randomuser.me/api/portraits/women/55.jpg",
    review:
      "The sweater is cozy and fits just right. The website was easy to navigate, and the checkout process was smooth.",
  },
  {
    name: "David Wilson",
    profession: "Entrepreneur",
    photo: "https://randomuser.me/api/portraits/men/50.jpg",
    review:
      "Excellent quality shoes and they arrived quicker than expected. Very happy with my purchase!",
  },
];

const reviewsSection = document.getElementById("reviews");
let currentIndex = 0;
let intervalId = null;

function createStars() {
  return "★★★★★";
}

function renderReview(index) {
  const { name, profession, photo, review } = reviews[index];

  // Crear puntos indicadores
  const dots = reviews
    .map((_, i) => {
      return `<span class="dot ${i === index ? "active" : ""}"></span>`;
    })
    .join("");

  reviewsSection.innerHTML = `
  <h2>We Love Our Clients</h2>
    <div class="review-card">
      <img src="${photo}" alt="${name}" />
      <p class="review-text">"${review}"</p>
      <h3>${name}</h3>
      <p class="profession">${profession}</p>
      <div class="stars">${createStars()}</div>
      <div class="dots">${dots}</div>
    </div>
  `;

  // Agregar evento para que al hacer click en un punto cambie la review
  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.addEventListener("click", () => {
      currentIndex = i;
      renderReview(currentIndex);
      resetInterval();
    });
  });
}

function nextReview() {
  currentIndex = (currentIndex + 1) % reviews.length;
  renderReview(currentIndex);
}

function resetInterval() {
  clearInterval(intervalId);
  intervalId = setInterval(nextReview, 4000);
}

// Inicializar carrusel
renderReview(currentIndex);
intervalId = setInterval(nextReview, 4000);

document.addEventListener("DOMContentLoaded", () => {
  const chatToggle = document.getElementById("chat-toggle");
  const chatWindow = document.getElementById("chat-window");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");

  chatToggle.addEventListener("click", () => {
    chatWindow.classList.toggle("hidden");
  });

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userMessage = chatInput.value.trim();
    if (userMessage === "") return;

    addMessage("user", userMessage);
    chatInput.value = "";

    setTimeout(() => {
      addMessage(
        "bot",
        "¡Hola humano curioso! 🤖 Este chat es solo una demo... ¡pero imagina todo lo que podríamos hablar cuando esté listo de verdad!"
      );
    }, 500);
  });

  function addMessage(sender, text) {
    const message = document.createElement("div");
    message.className = sender === "user" ? "user-msg" : "bot-msg";
    message.textContent = text;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("demo-modal");
  const closeBtn = document.querySelector(".close-btn");

  // Mostrar modal al hacer clic en botones o enlaces
  document
    .querySelectorAll("button:not(.no-popup), a:not(.no-popup)")
    .forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("demo-modal").classList.remove("hidden");
      });
    });

  // Cerrar modal al hacer clic en la X
  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Cerrar modal al hacer clic fuera del contenido
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });
});
