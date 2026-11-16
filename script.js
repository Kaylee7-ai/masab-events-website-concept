// ======================
// NAV
// ======================
const nav = document.getElementById('nav');
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 40);
});

menuBtn?.addEventListener('click', () => {
  navLinks?.classList.toggle('show');
});

// Close mobile menu when clicking a link
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('show');
  });
});

// ======================
// EVENT PLANNER
// ======================
let selectedEvent = 'Wedding';
let selectedServices = [];

const eventTypes = document.getElementById('eventTypes');
const serviceChips = document.getElementById('serviceChips');

// Event type chips
eventTypes?.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    eventTypes.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    selectedEvent = chip.dataset.value;
    updateSummary();
  });
});

// Service chips
serviceChips?.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    chip.classList.toggle('active');
    const val = chip.dataset.value;

    if (chip.classList.contains('active')) {
      selectedServices.push(val);
    } else {
      selectedServices = selectedServices.filter(s => s !== val);
    }
    updateSummary();
  });
});

// Live summary
['fullName', 'eventDate', 'guests', 'venue', 'notes'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', updateSummary);
});

function updateSummary() {
  const getValue = id => document.getElementById(id)?.value ?? '';
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText('sumEvent', selectedEvent);
  setText('sumServices', selectedServices.length
    ? selectedServices.join(', ')
    : 'None selected yet');
  setText('sumName', getValue('fullName') || '—');
  setText('sumDate', getValue('eventDate') || 'To be confirmed');
  setText('sumGuests', getValue('guests'));
  setText('sumVenue', getValue('venue') || 'Not decided');
}

function buildMessage() {
  const getValue = id => document.getElementById(id)?.value ?? '';
  const name = getValue('fullName') || 'Not provided';
  const date = getValue('eventDate') || 'To be confirmed';
  const guests = getValue('guests') || 'To be confirmed';
  const venue = getValue('venue') || 'Not decided';
  const notes = getValue('notes') || 'None';

  return `Hello Masab Events! 👋

I'd like to plan an event:

*Event type:* ${selectedEvent}
*Services needed:* ${selectedServices.length ? selectedServices.join(', ') : 'To discuss'}
*Name:* ${name}
*Date:* ${date}
*Expected guests:* ${guests}
*Venue / Area:* ${venue}
*Notes / Theme ideas:* ${notes}

Looking forward to hearing from you!`;
}

document.getElementById('sendWhatsApp')?.addEventListener('click', () => {
  const msg = encodeURIComponent(buildMessage());
  window.open(`https://wa.me/233262744322?text=${msg}`, '_blank', 'noopener');
});

document.getElementById('copyDetails')?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(buildMessage());
    alert('Event details copied! You can paste them anywhere.');
  } catch (error) {
    const textArea = document.createElement('textarea');
    textArea.value = buildMessage();
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'absolute';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    const copied = document.execCommand('copy');
    textArea.remove();
    alert(copied
      ? 'Event details copied! You can paste them anywhere.'
      : 'Copy was not available. Please select and copy your details manually.');
  }
});

// Keep the event summary accurate when the page first loads.
updateSummary();