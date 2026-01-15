

function setLanguage(lang) {
  document.querySelectorAll("[data-tr]").forEach(el => {
    el.textContent = el.getAttribute(`data-${lang}`);
  });
  localStorage.setItem("lang", lang);
}


window.addEventListener("load", () => {
  const savedLang = localStorage.getItem("lang") || "tr";
  setLanguage(savedLang);

  if (languageToggle) {
    languageToggle.checked = savedLang === "en";
  }
});


if (languageToggle) {
  languageToggle.addEventListener("change", () => {
    const lang = languageToggle.checked ? "en" : "tr";
    setLanguage(lang);
  });
}

