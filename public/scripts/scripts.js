document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("theme-toggle");
  const body = document.body

  // Apply saved theme on page load
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("manual-dark")
  }

  // Toggle theme on button click
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      body.classList.toggle("manual-dark")
      const isDark = body.classList.contains("manual-dark")
      localStorage.setItem("theme", isDark ? "dark" : "light")
    })
  }
})
