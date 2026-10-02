/**
 * SITE CONFIGURATION
 * Edit this file to update site-wide settings, dues, stats, and social links.
 * All values are exposed on window.SITE for use in other scripts.
 */

window.SITE = {
  // Site Identity
  name: "IEEE SPS SBC MBITS",
  fullName: "IEEE Signal Processing Society Student Branch Chapter, MBITS",
  tagline: "Innovate. Create. Empower Futures.",

  // Contact
  email: "ieeesbmbits@gmail.com",
  address: {
    line1: "Mar Baselios Institute of Technology and Science",
    line2: "Nellimattom P.O., Kothamangalam",
    line3: "Ernakulam District, Kerala, India – 686693"
  },

  // Form Endpoint (Replace with your Formspree/Web3Forms/EmailJS endpoint)
  formEndpoint: "https://formspree.io/f/REPLACE_WITH_YOUR_FORM_ID",

  // Membership Dues (Student Rates - Verify annually on IEEE Membership Dues Portal)
  dues: {
    baseStudent: 7.0,
    spsAddOn: 2.0,
    currency: "USD",
    verifyUrl: "https://www.ieee.org/membership/join/dues.html"
  },

  // Chapter Statistics (Update as needed)
  stats: {
    events: 50,
    members: 250,
    awards: 6,
    chapters: 5
  },

  // Social Links
  social: {
    linkedin: "https://linkedin.com/company/ieee-student-branch-mbits",
    instagram: "https://instagram.com/ieeesbmbits",
    youtube: "https://youtube.com/@ieeesbmbits",
    github: "",
    twitter: ""
  },

  // Navigation
  navLinks: [
    { href: "index.html", label: "Home" },
    { href: "index.html#history", label: "History" },
    { href: "events.html", label: "Events" },
    { href: "gallery.html", label: "Gallery" },
    { href: "execom.html", label: "Execom" }
  ],

  // SEO Defaults
  seo: {
    defaultTitle: "IEEE SPS SBC MBITS | Signal Processing Society Student Branch Chapter",
    defaultDescription: "IEEE Signal Processing Society Student Branch Chapter at Mar Baselios Institute of Technology and Science. Empowering students through technical excellence, innovation, and hands-on learning in signal processing.",
    ogImage: "assets/img/og-default.jpg"
  }
};