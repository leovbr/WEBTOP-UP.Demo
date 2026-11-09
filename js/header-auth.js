(function () {
  "use strict";
  // Demo mode: authentication is handled locally by the demo chat page.
  // This shared header must never contact Supabase or an external auth service.
  function init() {
    document.querySelectorAll(".side-menu-login").forEach(function (link) {
      link.href = "chat-admin.html";
      link.removeAttribute("data-auth-state");
      link.setAttribute("aria-label", "Masuk atau daftar akun demo");
      var label = link.querySelector("span:first-child");
      if (label) label.textContent = "Masuk / Daftar";
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();