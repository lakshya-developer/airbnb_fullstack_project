const showDetails = document.querySelectorAll(".view-details");
const hideDetails = document.querySelectorAll(".hide-details");

showDetails.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();

    const card = button.closest(".card");

    button.classList.add("hidden");
    card.querySelector(".hide-details").classList.remove("hidden");
    card.querySelector(".description").classList.remove("hidden");
    card.querySelector(".price").classList.remove("hidden");
    card.querySelector(".location").classList.remove("hidden");
  });
});

hideDetails.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();

    const card = button.closest(".card");

    button.classList.add("hidden");
    card.querySelector(".view-details").classList.remove("hidden");
    card.querySelector(".description").classList.add("hidden");
    card.querySelector(".price").classList.add("hidden");
    card.querySelector(".location").classList.add("hidden");
  });
});



document.querySelectorAll("#bookmarkBtn").forEach((button) => {
  const icon = button.querySelector("#bookmarkIcon");
  let isBookmarked = false;

  button.addEventListener("click", () => {
    isBookmarked = !isBookmarked;

    if (isBookmarked) {
      // Fill the bookmark
      icon.setAttribute("fill", "currentColor");
      icon.classList.add("text-yellow-500");
      icon.classList.remove("text-gray-500");
    } else {
      // Outline the bookmark
      icon.setAttribute("fill", "none");
      icon.classList.remove("text-yellow-500");
      icon.classList.add("text-gray-500");
    }
  });
});
