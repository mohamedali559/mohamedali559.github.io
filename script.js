new FinisherHeader({
  count: 38,
  size: {
    min: 2,
    max: 9,
    pulse: 0,
  },
  speed: {
    x: {
      min: 0,
      max: 0.4,
    },
    y: {
      min: 0,
      max: 0.6,
    },
  },
  colors: {
    background: "#060036ff",
    particles: ["#fbfcca", "#d7f3fe", "#ffd0a7"],
  },
  blending: "overlay",
  opacity: {
    center: 1,
    edge: 0,
  },
  skew: 0,
  shapes: ["t", "c"],
});

// TypeWriter Effect
class TypeWriter {
  constructor(element, texts, speed = 150, deleteSpeed = 50, pauseTime = 1000) {
    this.element = element;
    this.texts = texts;
    this.speed = speed;
    this.deleteSpeed = deleteSpeed;
    this.pauseTime = pauseTime;
    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.init();
  }

  init() {
    this.type();
  }

  type() {
    const currentText = this.texts[this.textIndex];

    if (this.isDeleting) {
      this.element.textContent = currentText.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.element.textContent = currentText.substring(0, this.charIndex + 1);
      this.charIndex++;
    }

    let typeSpeed = this.isDeleting ? this.deleteSpeed : this.speed;

    if (!this.isDeleting && this.charIndex === currentText.length) {
      typeSpeed = this.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 1) {
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.texts.length;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// Theme Toggle
function initThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme") || "dark";
  body.classList.toggle("light-theme", savedTheme === "light");
  themeToggle.checked = savedTheme === "light";

  themeToggle.addEventListener("change", () => {
    const isLight = themeToggle.checked;
    body.classList.toggle("light-theme", isLight);
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });
}

// Smooth Scrolling for Navigation
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('.navigation a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Active Navigation Link
function initActiveNavigation() {
  const sections = document.querySelectorAll("section[id], .header");
  const navLinks = document.querySelectorAll(".navigation a");

  function updateActiveLink() {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute("id") || "Home";
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveLink);
  updateActiveLink(); // Initial call
}

// Contact Form Handler
function initContactForm() {
  const contactForm = document.querySelector(".contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Get form data
      const formData = new FormData(contactForm);
      const name =
        formData.get("name") ||
        contactForm.querySelector('input[type="text"]').value;
      const email =
        formData.get("email") ||
        contactForm.querySelector('input[type="email"]').value;
      const message =
        formData.get("message") || contactForm.querySelector("textarea").value;

      // Simple validation
      if (!name || !email || !message) {
        alert("Please fill in all fields.");
        return;
      }

      // Simulate form submission
      alert("Thank you for your message! I will get back to you soon.");
      contactForm.reset();
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize TypeWriter effect
  const typewriterElement = document.querySelector(".typewriter");
  if (typewriterElement) {
    const texts = JSON.parse(typewriterElement.getAttribute("data-text"));
    new TypeWriter(typewriterElement, texts);
  }

  // Initialize other features
  initThemeToggle();
  initSmoothScrolling();
  initActiveNavigation();
  initContactForm();
});

// Add scroll animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe skill cards, project cards, etc.
  const animatedElements = document.querySelectorAll(
    ".skill-card, .project-card, .pricing-card, .stat-item"
  );
  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
}

// Initialize scroll animations after a short delay
setTimeout(initScrollAnimations, 100);
