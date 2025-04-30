"use strict";

let currentPage = 0;

let maxPages = 0;

let search = "";

let pageNumber = document.getElementById("page-number");
let prevButton = document.getElementById("prev");
let nextButton = document.getElementById("next");

let searchInput = document.getElementById("search-input");
let searchButton = document.getElementById("search-button");
let clearButton = document.getElementById("clear-button");

let ulTag = document.getElementById("listed-groups");

async function fetchMusicGroups(page) {
  try {
    const response = await fetch(`https://seido-webservice-307d89e1f16a.azurewebsites.net/api/MusicGroup/Read?seeded=true&flat=true&pageNr=${page}&pageSize=10`);

    const musicGroupData = await response.json();
    const data = musicGroupData.pageItems;

    if (!response.ok) {
      alert("Error fetching data. Please try again later.");
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    maxPages = musicGroupData.pageCount;
    
    pageNumberDisplay(currentPage, maxPages);

    ulTag.innerHTML = "";

    for (const group of data) {
      let liTag = document.createElement("li");
      let aTag = document.createElement("a");

      aTag.innerText = group.name;
      aTag.href = `group-page.html?id=${group.musicGroupId}`;

      liTag.appendChild(aTag);
      ulTag.appendChild(liTag);
    }
  }
  catch (error) {
    console.error(`Error fetching data: ${error}`);
  }
}

function updatePageNumber(changedPage) {

  if (maxPages === 1) {
    return;
  }

  if (changedPage === 1 && currentPage < maxPages) {
    currentPage++;
    pageNumberDisplay(currentPage, maxPages);
    if (searchInput.value === "") {
      fetchMusicGroups(currentPage);
    }
    else {
      searchMusicGroup(currentPage);
    }
  }
  else if (changedPage === -1 && currentPage > 0) {
    currentPage--;
    pageNumberDisplay(currentPage, maxPages);
    if (searchInput.value === "") {
      fetchMusicGroups(currentPage);
    }
    else {
      searchMusicGroup(currentPage);
    }
  }
}

function pageNumberDisplay(pageNum, maxPages) {
  pageNumber.innerText = `Page ${pageNum + 1} of ${maxPages}`;
}

async function searchMusicGroup() {
  try {
    const response = await fetch(`https://seido-webservice-307d89e1f16a.azurewebsites.net/api/MusicGroup/Read?seeded=true&flat=true&pageNr=0&pageSize=10`);

    let musicGroupData = await response.json();

    const response2 = await fetch(`https://seido-webservice-307d89e1f16a.azurewebsites.net/api/MusicGroup/Read?seeded=true&flat=true&pageNr=0&pageSize=${musicGroupData.dbItemsCount}`);
    
    musicGroupData = await response2.json();

    if (!response.ok || !response2.ok) {
      alert("Error fetching data. Please try again later.");
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = musicGroupData.pageItems;

    const filteredData = data.filter(group => group.name.toLowerCase().includes(search.toLowerCase()));

    console.log(filteredData);

    ulTag.innerHTML = "";

    if (filteredData.length === 0) {
      let liTag = document.createElement("li");
      liTag.textContent = "Search not found";
      ulTag.appendChild(liTag);
      pageNumberDisplay(0, 0);
      return;
    }

    maxPages = countPages(filteredData);
    pageNumberDisplay(currentPage, maxPages);

    // Makes the search results paginated
    const startIndex = currentPage * 10;
    const endIndex = startIndex + 10;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    for (const group of paginatedData) {
      if (group.name.toLowerCase().includes(search.toLowerCase())) {
        let liTag = document.createElement("li");
        let aTag = document.createElement("a");

        aTag.innerText = group.name;
        aTag.href = `group-page.html?id=${group.musicGroupId}`;

        liTag.appendChild(aTag);
        ulTag.appendChild(liTag);
      }
    }
  }
  catch (error) {
    console.error(`Error fetching data: ${error}`);
  }
}

function countPages(array) {
  let pageCount = Math.ceil(array.length / 10);
  return pageCount;
}

prevButton.addEventListener("click", () => updatePageNumber(-1));
nextButton.addEventListener("click", () => updatePageNumber(1));

searchButton.addEventListener("click", () => {
  search = searchInput.value;
  currentPage = 0;
  searchMusicGroup(currentPage);
});

clearButton.addEventListener("click", () => {
  searchInput.value = "";
  currentPage = 0;
  fetchMusicGroups(currentPage);
});


fetchMusicGroups(currentPage);

