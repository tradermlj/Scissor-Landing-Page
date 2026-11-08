"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");
const dropdownToggle = document.querySelector(".dropdown-toggle");
const dropdownMenu = document.querySelector("#features-menu");
const shortenerForm = document.querySelector("#shortener-form");
const urlInput = document.querySelector("#long-url");
const aliasInput = document.querySelector("#alias");
const urlError = document.querySelector("#url-error");
const aliasError = document.querySelector("#alias-error");
const formResult = document.querySelector("#form-result");

function closeMobileMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  navigation.classList.remove("is-open");
}

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
  navigation.classList.toggle("is-open", !isExpanded);
});

dropdownToggle.addEventListener("click", () => {
  const isExpanded = dropdownToggle.getAttribute("aria-expanded") === "true";
  dropdownToggle.setAttribute("aria-expanded", String(!isExpanded));
  dropdownMenu.hidden = isExpanded;
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    closeMobileMenu();
    dropdownToggle.setAttribute("aria-expanded", "false");
    dropdownMenu.hidden = true;
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav-dropdown")) {
    dropdownToggle.setAttribute("aria-expanded", "false");
    dropdownMenu.hidden = true;
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (dropdownToggle.getAttribute("aria-expanded") === "true") {
      dropdownToggle.setAttribute("aria-expanded", "false");
      dropdownMenu.hidden = true;
      dropdownToggle.focus();
    } else if (menuToggle.getAttribute("aria-expanded") === "true") {
      closeMobileMenu();
      menuToggle.focus();
    }
  }
});

function setFieldError(input, errorElement, message) {
  input.setAttribute("aria-invalid", message ? "true" : "false");
  errorElement.textContent = message;
}

shortenerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formResult.hidden = true;

  const submittedUrl = urlInput.value.trim();
  const alias = aliasInput.value.trim();
  let valid = true;

  if (!submittedUrl) {
    setFieldError(urlInput, urlError, "Enter a URL to preview.");
    valid = false;
  } else {
    try {
      const parsedUrl = new URL(submittedUrl);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        setFieldError(urlInput, urlError, "Use a URL that starts with http:// or https://.");
        valid = false;
      } else {
        setFieldError(urlInput, urlError, "");
      }
    } catch {
      setFieldError(urlInput, urlError, "Enter a valid URL, including http:// or https://.");
      valid = false;
    }
  }

  if (alias && !/^[a-zA-Z0-9][a-zA-Z0-9-]{1,29}[a-zA-Z0-9]$/.test(alias)) {
    setFieldError(aliasInput, aliasError, "Use 3–31 letters, numbers, or hyphens; start and end with a letter or number.");
    valid = false;
  } else {
    setFieldError(aliasInput, aliasError, "");
  }

  if (!valid) {
    formResult.textContent = "Please correct the highlighted fields and try again.";
    formResult.hidden = false;
    if (urlInput.getAttribute("aria-invalid") === "true") {
      urlInput.focus();
    } else {
      aliasInput.focus();
    }
    return;
  }

  const previewSlug = alias || Math.random().toString(36).slice(2, 8);
  const previewUrl = `https://${document.querySelector("#domain").value}/${previewSlug}`;
  const prefix = document.createTextNode(`Preview only (not a live link): `);
  const previewCode = document.createElement("code");
  previewCode.textContent = previewUrl;

  formResult.replaceChildren(prefix, previewCode);
  formResult.hidden = false;
});

document.querySelectorAll(".faq-question").forEach((question) => {
  question.addEventListener("click", () => {
    const expanded = question.getAttribute("aria-expanded") === "true";
    const answer = document.getElementById(question.getAttribute("aria-controls"));

    question.setAttribute("aria-expanded", String(!expanded));
    answer.hidden = expanded;
  });
});

document.querySelector("#current-year").textContent = String(new Date().getFullYear());
