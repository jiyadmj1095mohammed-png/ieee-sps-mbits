/**
 * GALLERY DATA
 * Add gallery items here. Images should be placed in assets/img/gallery/
 * Use placeholder SVG data URIs for development - replace with real images later.
 *
 * Fields:
 * - id: unique identifier
 * - src: image path (relative to site root)
 * - alt: alt text for accessibility
 * - caption: displayed in lightbox
 * - date: ISO date string
 * - eventTag: links to event (for filtering)
 * - width: image width (for layout)
 * - height: image height (for layout)
 */

// Generate placeholder SVG data URIs for development
function placeholderSVG(width, height, text, bgColor = "1A2234", textColor = "6B7280") {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'><rect fill='%23${bgColor}' width='${width}' height='${height}'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='16' fill='%23${textColor}'>${text}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

window.GALLERY = [
  // Signal 2.0 (2023)
  {
    id: "signal2-0-1",
    src: placeholderSVG(800, 600, "Signal 2.0 — Opening Ceremony"),
    alt: "Signal 2.0 opening ceremony with students and faculty",
    caption: "Signal 2.0 Opening Ceremony — November 2023",
    date: "2023-11-11",
    eventTag: "signal-2-0",
    width: 800,
    height: 600
  },
  {
    id: "signal2-0-2",
    src: placeholderSVG(800, 600, "Signal 2.0 — Web3 Workshop"),
    alt: "Students attending Web3 workshop at Signal 2.0",
    caption: "Web3 Workshop Session — Signal 2.0",
    date: "2023-11-12",
    eventTag: "signal-2-0",
    width: 800,
    height: 600
  },
  {
    id: "signal2-0-3",
    src: placeholderSVG(800, 600, "Signal 2.0 — VR Experience"),
    alt: "VR experience demo at Signal 2.0",
    caption: "VR/AR Experience Zone — Signal 2.0",
    date: "2023-11-12",
    eventTag: "signal-2-0",
    width: 800,
    height: 600
  },
  {
    id: "signal2-0-4",
    src: placeholderSVG(800, 600, "Signal 2.0 — GenAI Session"),
    alt: "Generative AI workshop at Signal 2.0",
    caption: "Generative AI Workshop — Signal 2.0",
    date: "2023-11-13",
    eventTag: "signal-2-0",
    width: 800,
    height: 600
  },
  {
    id: "signal2-0-5",
    src: placeholderSVG(800, 600, "Signal 2.0 — Design Thinking"),
    alt: "Design Thinking workshop participants",
    caption: "Design Thinking Workshop — Signal 2.0",
    date: "2023-11-13",
    eventTag: "signal-2-0",
    width: 800,
    height: 600
  },
  {
    id: "signal2-0-6",
    src: placeholderSVG(800, 600, "Signal 2.0 — Closing & Awards"),
    alt: "Closing ceremony and award distribution at Signal 2.0",
    caption: "Closing Ceremony & Awards — Signal 2.0",
    date: "2023-11-13",
    eventTag: "signal-2-0",
    width: 800,
    height: 600
  },

  // Decode the Signals Quiz (2023)
  {
    id: "decode-2023-1",
    src: placeholderSVG(800, 600, "Decode the Signals — Quiz Round"),
    alt: "Technical quiz competition in progress",
    caption: "Quiz Round — Decode the Signals 2023",
    date: "2023-05-31",
    eventTag: "decode-signals-2023",
    width: 800,
    height: 600
  },
  {
    id: "decode-2023-2",
    src: placeholderSVG(800, 600, "Decode the Signals — Winners"),
    alt: "Winners of Decode the Signals quiz with certificates",
    caption: "Winners — Decode the Signals 2023",
    date: "2023-05-31",
    eventTag: "decode-signals-2023",
    width: 800,
    height: 600
  },

  // Inception Ideathon (2023)
  {
    id: "inception-2023-1",
    src: placeholderSVG(800, 600, "Inception Ideathon — Team Presentations"),
    alt: "Teams presenting ideas at Inception Ideathon",
    caption: "Team Presentations — Inception Ideathon 2023",
    date: "2023-05-27",
    eventTag: "inception-2023",
    width: 800,
    height: 600
  },
  {
    id: "inception-2023-2",
    src: placeholderSVG(800, 600, "Inception Ideathon — Mentoring"),
    alt: "Faculty mentoring students during ideathon",
    caption: "Mentoring Session — Inception Ideathon 2023",
    date: "2023-05-27",
    eventTag: "inception-2023",
    width: 800,
    height: 600
  },

  // Real-Time Audio Processing Webinar (2024)
  {
    id: "audio-2024-1",
    src: placeholderSVG(800, 600, "Real-Time Audio Processing — Webinar"),
    alt: "Speaker presenting real-time audio processing webinar",
    caption: "Live Webinar Session — August 2024",
    date: "2024-08-08",
    eventTag: "realtime-audio-2024",
    width: 800,
    height: 600
  },

  // Arduino Workshop (2025)
  {
    id: "arduino-2025-1",
    src: placeholderSVG(800, 600, "Arduino Workshop — Hardware Setup"),
    alt: "Students working with Arduino boards and sensors",
    caption: "Hardware Setup — Arduino Workshop Feb 2025",
    date: "2025-02-19",
    eventTag: "arduino-2025",
    width: 800,
    height: 600
  },
  {
    id: "arduino-2025-2",
    src: placeholderSVG(800, 600, "Arduino Workshop — Signal Demo"),
    alt: "Signal acquisition demo on oscilloscope",
    caption: "Signal Acquisition Demo — Arduino Workshop",
    date: "2025-02-19",
    eventTag: "arduino-2025",
    width: 800,
    height: 600
  },
  {
    id: "arduino-2025-3",
    src: placeholderSVG(800, 600, "Arduino Workshop — Group Photo"),
    alt: "Group photo of Arduino workshop participants",
    caption: "Participants — Arduino Workshop Feb 2025",
    date: "2025-02-19",
    eventTag: "arduino-2025",
    width: 800,
    height: 600
  },

  // Raspberry Pi Workshop (2025)
  {
    id: "rpi-2025-1",
    src: placeholderSVG(800, 600, "Raspberry Pi Workshop — Setup"),
    alt: "Raspberry Pi setup for computer vision demo",
    caption: "Raspberry Pi Setup — Workshop Feb 2025",
    date: "2025-02-28",
    eventTag: "raspberry-pi-2025",
    width: 800,
    height: 600
  },
  {
    id: "rpi-2025-2",
    src: placeholderSVG(800, 600, "Raspberry Pi Workshop — CV Demo"),
    alt: "Computer vision demo on Raspberry Pi",
    caption: "Computer Vision Demo — Raspberry Pi Workshop",
    date: "2025-02-28",
    eventTag: "raspberry-pi-2025",
    width: 800,
    height: 600
  },

  // SPS Day Quiz (2025)
  {
    id: "sps-quiz-2025-1",
    src: placeholderSVG(800, 600, "SPS Day Quiz — Virtual Event"),
    alt: "Virtual quiz competition screen",
    caption: "Virtual Quiz Session — SPS Day 2025",
    date: "2025-06-02",
    eventTag: "sps-day-quiz-2025",
    width: 800,
    height: 600
  },

  // General Chapter Activities
  {
    id: "general-1",
    src: placeholderSVG(800, 600, "Weekly Technical Session"),
    alt: "Weekly technical discussion session",
    caption: "Weekly Technical Session",
    date: "2024-10-15",
    eventTag: "general",
    width: 800,
    height: 600
  },
  {
    id: "general-2",
    src: placeholderSVG(800, 600, "Industry Visit"),
    alt: "Students on industry visit",
    caption: "Industry Visit — Signal Processing Lab",
    date: "2024-11-20",
    eventTag: "general",
    width: 800,
    height: 600
  },
  {
    id: "general-3",
    src: placeholderSVG(800, 600, "Research Paper Discussion"),
    alt: "Research paper reading group meeting",
    caption: "Research Paper Discussion Group",
    date: "2025-01-10",
    eventTag: "general",
    width: 800,
    height: 600
  },
  {
    id: "general-4",
    src: placeholderSVG(800, 600, "IEEE Day Celebration"),
    alt: "IEEE Day celebration with cake cutting",
    caption: "IEEE Day Celebration 2024",
    date: "2024-10-01",
    eventTag: "general",
    width: 800,
    height: 600
  }
];

// Helper: Get unique event tags for filter buttons
window.getGalleryTags = function() {
  const tags = [...new Set(window.GALLERY.map(item => item.eventTag))];
  return tags.sort();
};

// Helper: Get gallery items by tag
window.getGalleryByTag = function(tag) {
  if (tag === 'all' || !tag) return window.GALLERY;
  return window.GALLERY.filter(item => item.eventTag === tag);
};

// Helper: Get gallery item by ID
window.getGalleryById = function(id) {
  return window.GALLERY.find(item => item.id === id);
};

// Helper: Get adjacent gallery items for lightbox navigation
window.getAdjacentGallery = function(currentId, tag) {
  const items = window.getGalleryByTag(tag);
  const currentIndex = items.findIndex(item => item.id === currentId);
  if (currentIndex === -1) return { prev: null, next: null };

  return {
    prev: currentIndex > 0 ? items[currentIndex - 1] : items[items.length - 1],
    next: currentIndex < items.length - 1 ? items[currentIndex + 1] : items[0]
  };
};