/**
 * EVENTS DATA
 * Seed data from PRD §2. Add new events here - they will auto-sort into
 * Upcoming/Past based on the date field.
 *
 * Fields:
 * - id: unique identifier (kebab-case)
 * - title: event name
 * - date: ISO date string (YYYY-MM-DD) - used for sorting
 * - endDate: optional, for multi-day events
 * - type: "Flagship" | "Workshop" | "Webinar" | "Competition" | "Ideathon" | "Other"
 * - description: short description
 * - venue: location (e.g., "MBITS", "Online", "Auditorium")
 * - registerUrl: optional registration link
 * - galleryTag: optional tag linking to gallery images
 * - isExternal: boolean, if true opens registerUrl in new tab
 */

window.EVENTS = [
  // ==========================================
  // UPCOMING EVENTS (future dates)
  // ==========================================
  {
    id: "sps-day-2026",
    title: "SPS Day 2026 — Inception Ideathon",
    date: "2026-05-27",
    type: "Ideathon",
    description: "Annual SPS Day celebration featuring an ideathon focused on signal processing innovations for social impact. Open to all MBITS students.",
    venue: "MBITS Auditorium",
    registerUrl: "#",
    galleryTag: "sps-day-2026",
    isExternal: false
  },
  {
    id: "dl-workshop-2026",
    title: "Deep Learning for Signal Processing Workshop",
    date: "2026-07-15",
    endDate: "2026-07-16",
    type: "Workshop",
    description: "Two-day hands-on workshop covering CNN/RNN architectures for audio, image, and biomedical signal classification. Includes Python/TensorFlow labs.",
    venue: "MBITS Computer Lab",
    registerUrl: "#",
    galleryTag: "dl-workshop-2026",
    isExternal: false
  },
  {
    id: "5g-seminar-2026",
    title: "5G/6G Signal Processing Seminar",
    date: "2026-09-10",
    type: "Webinar",
    description: "Expert talk on advanced signal processing techniques for next-generation wireless communications. Speaker: Industry researcher from IEEE ComSoc.",
    venue: "Online (Zoom)",
    registerUrl: "#",
    galleryTag: "5g-seminar-2026",
    isExternal: true
  },

  // ==========================================
  // PAST EVENTS (historical dates from PRD)
  // ==========================================
  {
    id: "signal-2-0",
    title: "Signal 2.0",
    date: "2023-11-11",
    endDate: "2023-11-13",
    type: "Flagship",
    description: "Three-day mega event with sub-workshops on Web3, VR, GenAI, and Design Thinking. Flagship annual event with 200+ participants.",
    venue: "MBITS",
    registerUrl: "#",
    galleryTag: "signal-2-0",
    isExternal: false
  },
  {
    id: "decode-signals-quiz-2023",
    title: "Decode the Signals — Technical Quiz",
    date: "2023-05-31",
    type: "Competition",
    description: "Inter-college technical quiz competition testing knowledge on signals, systems, and signal processing fundamentals.",
    venue: "MBITS Seminar Hall",
    galleryTag: "decode-signals-2023",
    isExternal: false
  },
  {
    id: "inception-ideathon-2023",
    title: "Inception Ideathon (SPS Day)",
    date: "2023-05-27",
    type: "Ideathon",
    description: "First annual SPS Day celebration featuring an ideathon where teams proposed innovative signal processing solutions for real-world problems.",
    venue: "MBITS Auditorium",
    galleryTag: "inception-2023",
    isExternal: false
  },
  {
    id: "realtime-audio-2024",
    title: "Introduction to Real-Time Audio Processing",
    date: "2024-08-08",
    type: "Webinar",
    description: "Guest lecture covering fundamentals of real-time audio signal processing, including FFT, filtering, and audio effects implementation.",
    venue: "Online",
    galleryTag: "realtime-audio-2024",
    isExternal: true
  },
  {
    id: "arduino-workshop-2025",
    title: "Workshop on Arduino (S4 ECE/EEE)",
    date: "2025-02-19",
    type: "Workshop",
    description: "Hands-on workshop for S4 ECE/EEE students on Arduino-based signal acquisition, sensor interfacing, and basic DSP implementation.",
    venue: "MBITS Electronics Lab",
    galleryTag: "arduino-2025",
    isExternal: false
  },
  {
    id: "raspberry-pi-workshop-2025",
    title: "Raspberry Pi Workshop",
    date: "2025-02-28",
    type: "Workshop",
    description: "Workshop on Raspberry Pi for embedded signal processing applications including computer vision and audio processing demos.",
    venue: "MBITS Computer Lab",
    galleryTag: "raspberry-pi-2025",
    isExternal: false
  },
  {
    id: "sps-day-quiz-2025",
    title: "SPS Day Quiz (Virtual)",
    date: "2025-06-02",
    type: "Competition",
    description: "Annual SPS Day celebration with virtual technical quiz competition on signal processing concepts and applications.",
    venue: "Online",
    galleryTag: "sps-day-quiz-2025",
    isExternal: true
  }
];

// Helper: Get upcoming events (date >= today)
window.getUpcomingEvents = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return window.EVENTS.filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

// Helper: Get past events (date < today)
window.getPastEvents = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return window.EVENTS.filter(event => new Date(event.date) < today)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Helper: Get event by ID
window.getEventById = function(id) {
  return window.EVENTS.find(event => event.id === id);
};

// Helper: Get unique event types for filtering
window.getEventTypes = function() {
  const types = [...new Set(window.EVENTS.map(e => e.type))];
  return types.sort();
};