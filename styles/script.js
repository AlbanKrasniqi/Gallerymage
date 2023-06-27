const accessKey = "183zuvbiOaILqvTxAZLqJYM0JoYuzui78Zr1CWuNeVE";
const gallery = document.getElementById("image-container");
const buttons = document.querySelectorAll(".buttonCat");
const loader = document.getElementById("loader");
const searchInput = document.querySelector(".searchTerm");
const searchButton = document.querySelector(".searchButton");
const prevButton = document.querySelector(".prevButton");
const nextButton = document.querySelector(".nextButton");
const logo = document.querySelector(".logo-text");
const title = document.querySelector(".title");

let currentPage = 1;
const imagesPerPage = 12;
let totalImages = 0;
let imagesData = [];

function refreshPage() {
  location.reload();
}

logo.addEventListener("click", refreshPage);
title.addEventListener("click", refreshPage);

function showLoader() {
  loader.style.display = "block";
}

function hideLoader() {
  loader.style.display = "none";
}

function fetchAllImages() {
  showLoader();
  fetch(
    `https://api.unsplash.com/photos/random?client_id=${accessKey}&count=45`
  )
    .then((response) => response.json())
    .then((data) => {
      const images = data.map((image) => ({ url: image.urls.regular }));
      updateTotalImages(images);
      hideLoader();
    })
    .catch((error) => {
      console.log("Error fetching images:", error);
      hideLoader();
    });
}

function fetchImages(category) {
  showLoader();
  fetch(
    `https://api.unsplash.com/photos/random?client_id=${accessKey}&count=25&query=${category}`
  )
    .then((response) => response.json())
    .then((data) => {
      const images = data.map((image) => ({ url: image.urls.regular }));
      updateTotalImages(images);
      hideLoader();
    })
    .catch((error) => {
      console.log("Error fetching images:", error);
      hideLoader();
    });
}

function updateTotalImages(images) {
  totalImages = images.length;
  imagesData = images;
  fetchImagesWithPagination();
}

function fetchImagesWithPagination() {
  showLoader();
  const startIndex = (currentPage - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const paginatedImages = imagesData.slice(startIndex, endIndex);
  displayImages(paginatedImages);
  hideLoader();
}

function displayImages(images) {
  gallery.innerHTML = "";

  images.forEach((image) => {
    const imgElement = document.createElement("img");
    imgElement.src = image.url;

    const linkElement = document.createElement("a");
    linkElement.href = image.url;
    linkElement.target = "_blank";
    linkElement.appendChild(imgElement);
    gallery.appendChild(linkElement);
  });
}

buttons.forEach((button) => {
  const category = button.getAttribute("data-category");
  button.addEventListener("click", () => {
    currentPage = 1;
    fetchImages(category);
  });
});

prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchImagesWithPagination();
  }
});

nextButton.addEventListener("click", () => {
  const totalPages = Math.ceil(totalImages / imagesPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    fetchImagesWithPagination();
  }
});

window.addEventListener("load", fetchAllImages);

searchButton.addEventListener("click", () => {
  const searchTerm = searchInput.value;
  if (searchTerm) {
    currentPage = 1;
    fetchImages(searchTerm);
  }
});

searchInput.addEventListener("keyup", (event) => {
  const searchTerm = event.target.value;
  if (event.key === "Enter" && searchTerm) {
    currentPage = 1;
    fetchImages(searchTerm);
  }
});
