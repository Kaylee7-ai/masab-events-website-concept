(() => {
  "use strict";
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    const closeMenu = () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
    };
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        closeMenu();
        toggle.focus();
      }
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  }

  // Prevent visitors from selecting an event date in the past.
  const eventDate = document.querySelector('input[name="date"]');
  if (eventDate) {
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    eventDate.min = localDate;
  }

  const form = document.querySelector("#enquiry-form");
  const eventDate = document.querySelector('input[name="date"]');
  if (eventDate) {
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    eventDate.min = localToday;
  }

  if (form) form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = document.querySelector("#form-status");
    if (!status) return;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const selectedServices = data.getAll("services");
    const value = (key) => String(data.get(key) || "").trim() || "Not specified";
    const lines = [
      "MASAB EVENTS — EVENT ENQUIRY PREVIEW",
      "",
      "CONTACT",
      "Name: " + value("name"),
      "Email: " + value("email"),
      "Phone: " + value("phone"),
      "Preferred contact: " + value("contactPreference"),
      "",
      "EVENT",
      "Type: " + value("eventType"),
      "Occasion: " + value("eventName"),
      "Date: " + value("date"),
      "Date flexible: " + value("dateFlexible"),
      "Start time: " + value("startTime"),
      "Duration: " + value("duration"),
      "Location: " + value("location"),
      "Venue status: " + value("venueStatus"),
      "Venue: " + value("venue"),
      "",
      "GUESTS & VISION",
      "Estimated guests: " + value("guestCount"),
      "Budget: " + value("budget"),
      "Style: " + value("style"),
      "Theme / colours: " + value("theme"),
      "",
      "SERVICES REQUESTED",
      selectedServices.length ? selectedServices.join(", ") : "Not specified",
      "",
      "Wedding / cultural details: " + value("weddingDetails"),
      "Additional notes: " + value("details")
    ];
    const old = form.querySelector(".enquiry-preview");
    if (old) old.remove();
    const preview = document.createElement("pre");
    preview.className = "enquiry-preview";
    preview.setAttribute("tabindex", "0");
    preview.setAttribute("aria-label", "Your event brief preview");
    preview.textContent = lines.join("\n");
    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = "button dark copy-brief-button";
    copyButton.textContent = "Copy event brief";
    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(lines.join("\n"));
        copyButton.textContent = "Copied";
      } catch {
        preview.focus();
        status.textContent = "Select and copy the event brief above. Nothing has been sent or stored.";
      }
    });
    form.appendChild(preview);
    form.appendChild(copyButton);
    status.textContent = "Your event brief preview is ready. You can copy it for demonstration purposes. Nothing has been sent or stored.";
    status.classList.add("is-active");
    preview.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
})();