

function setLanguage(lang) {
  document.querySelectorAll("[data-tr]").forEach(el => {
    el.textContent = el.getAttribute(`data-${lang}`);
  });
  localStorage.setItem("lang", lang);
}

// Sayfa yüklendiğinde
window.addEventListener("load", () => {
  const savedLang = localStorage.getItem("lang") || "tr";
  setLanguage(savedLang);

  // Toggle varsa durumunu ayarla
  if (languageToggle) {
    languageToggle.checked = savedLang === "en";
  }
});

// Toggle varsa dinle
if (languageToggle) {
  languageToggle.addEventListener("change", () => {
    const lang = languageToggle.checked ? "en" : "tr";
    setLanguage(lang);
  });
}

