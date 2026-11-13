(() => {
  "use strict";
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }));
  }

  const form = document.querySelector("#enquiry-form");
  if (form) form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = document.querySelector("#form-status");
    if (!status) return;
    const data = new FormData(form);
    const required = ["name", "email", "eventType"];
    if (required.some((key) => !String(data.get(key) || "").trim())) {
      status.textContent = "Please complete your name, email address and event type.";
      status.classList.add("is-active");
      return;
    }
    const lines = [
      "MASAB EVENTS — ENQUIRY PREVIEW",
      "Name: " + data.get("name"),
      "Email: " + data.get("email"),
      "Event: " + data.get("eventType"),
      "Date: " + (data.get("date") || "Not specified"),
      "Location: " + (data.get("location") || "Not specified"),
      "Service: " + (data.get("service") || "Not specified"),
      "Details: " + (data.get("details") || "Not provided")
    ];
    const old = form.querySelector(".enquiry-preview");
    if (old) old.remove();
    const preview = document.createElement("pre");
    preview.className = "enquiry-preview";
    preview.textContent = lines.join("\n");
    form.appendChild(preview);
    status.textContent = "Preview created. This demonstration does not send or store your information. An owner-approved contact destination and privacy notice must be configured before launch.";
    status.classList.add("is-active");
  });
})();