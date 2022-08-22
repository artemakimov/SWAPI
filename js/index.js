let pagNavBar = document.getElementById("pagNavBar");
let charactersList = document.getElementById("charactersList");
let searchForm = document.getElementById("search");

let activePagbutton;
let getFullSwapiWebsite;
let boolURL = true;

searchForm.addEventListener("submit", showSearchedData);
document.addEventListener("DOMContentLoaded", postListcharactersList);
pagNavBar.addEventListener("click", showItems);

function addCharInfo(inf) {
  let {
    name,
    height,
    mass,
    hair_color,
    gender,
    skin_color,
    eye_color,
    birth_year,
  } = inf;
  let html = `<li class="charItem">
                    <p class="charInfoMain">Name: <span class="selectedtext">${name}</span></p>
                    <p class="charInfoMain">Gender: <span class="selectedtext">${gender}</span></p>
                    <button class="showButton charButtons">Show</button>
                    <p class="hideInfo charInfo">Height: <span class="selectedtext">${height}</span></p>
                    <p class="hideInfo charInfo">Mass: <span class="selectedtext">${mass}</span></p>
                    <p class="hideInfo charInfo">Hair Color: <span class="selectedtext">${hair_color}</span></p>
                    <p class="hideInfo charInfo">Skin Color: <span class="selectedtext">${skin_color}</span></p>
                    <p class="hideInfo charInfo">Eye Color: <span class="selectedtext">${eye_color}</span></p>
                    <p class="hideInfo charInfo">Birth Year: <span class="selectedtext">${birth_year}</span></p>
                    <button class="hideInfo hideButton charButtons">Hide</button>
             </li>`;

  return html;
}

async function postListcharactersList() {
  let pageNum = "";
  let pageFullHREF = document.location.href;
  

  charactersList.innerHTML = "";

  if (pageFullHREF.indexOf("page") != -1) {
    pageNum = pageFullHREF.substring(pageFullHREF.indexOf("page") + 5);

    getFullSwapiWebsite = "https://swapi.dev/api/people/" + `?page=${pageNum}`;
  } else {
    getFullSwapiWebsite = "https://swapi.dev/api/people/" + `?page=1`;
  }

  if (boolURL == false){
    getFullSwapiWebsite = "https://swapi.dev/api/people/" + `?page=1`;
  }
  let siteData = await getSiteContent(getFullSwapiWebsite);

  let pagecharactersList = siteData.count / 9;


  createPaginationcharactersList(pagecharactersList, true);
  if (boolURL){
    if (pageNum) {
      for (let li of pagNavBar.children) {
        if (li.textContent == pageNum) {
          activePagbutton = li;
          activePagbutton.classList.add("activePagbutton");
        }
      }
    } else {
      activePagbutton = pagNavBar.firstElementChild;
      activePagbutton.classList.add("activePagbutton");
    }
  } else{
    activePagbutton = pagNavBar.firstElementChild;
    activePagbutton.classList.add("activePagbutton");
    boolURL = true;
  }


  replenishmentList(getFullSwapiWebsite);

  showHideButtons();
}

function createPaginationcharactersList(num, boolName) {
  pagNavBar.innerHTML = "";
  if (boolName) {
    for (let i = 1; i <= num; i++) {
      let charItemBuffer = `
          <li class="footer__list-item"><a class="footer__link" href="#?page=${i}">${i}</a></li>
          `;
      pagNavBar.insertAdjacentHTML("beforeend", charItemBuffer);
    }
  } else {
    for (let i = 1; i <= num; i++) {
      let charItemBuffer = `
            <li class="footer__list-item"><a class="footer__link" href="#?search=${search}&page=${i}">${i}</a></li>
            `;

      pagNavBar.insertAdjacentHTML("beforeend", charItemBuffer);
    }
  }
}


async function getSiteContent(URL) {
  let websiteInfo = await fetch(URL);

  return await websiteInfo.json();
}

function showHideButtons() {
  let allShowButtons = document.querySelectorAll(".showButton");
  let allHideButtons = document.querySelectorAll(".hideButton");

  allShowButtons.forEach((item) => {
    item.addEventListener("click", (e) => {
      let listItem = e.target.closest("li");
      listItem.querySelectorAll("*").forEach((item) => {
        item.classList.remove("hideInfo");
      });

      e.target.classList.add("hideInfo");
    });
  });

  allHideButtons.forEach((item) => {
    item.addEventListener("click", (e) => {
      let listItem = e.target.closest("li");
      listItem.querySelectorAll(".charInfo").forEach((item) => {
        item.classList.add("hideInfo");
      });

      e.target.classList.add("hideInfo");

      listItem.querySelector(".showButton").classList.remove("hideInfo");
    });
  });
}

async function showSearchedData(e) {
  e.preventDefault();

  let input = document.querySelector("input");

  if (input.value != "") {
    charactersList.innerHTML = "";

    search = input.value;

    let url = "https://swapi.dev/api/people/" + `?search=${search}`;
    let siteDataArr = await getSiteContent(url);

    if (!siteDataArr.results.length) {
      charactersList.insertAdjacentHTML(
        "beforeend",
        `<h2 class="main_err">Nothing found</h2>`
      );
      let pageItems = Math.ceil(siteDataArr.count / 10);

      createPaginationcharactersList(pageItems, true);

    } else {
      let pageItems = Math.ceil(siteDataArr.count / 10);


      createPaginationcharactersList(pageItems, false);

      activePagbutton = pagNavBar.firstElementChild;
      activePagbutton.classList.add("activePagbutton");

      await replenishmentList(url);

      showHideButtons();

    }
  } else {
    boolURL = false;
    searchForm.reset();
    postListcharactersList();
    showHideButtons();
  }
}

async function showItems(e) {
  if (e.target.classList.contains("footer__link")) {
    if (activePagbutton) {
      activePagbutton.classList.remove("activePagbutton");
    }

    activePagbutton = e.target.closest("li");
    activePagbutton.classList.add("activePagbutton");

    getFullSwapiWebsite =
      "https://swapi.dev/api/people/" + `?page=${e.target.textContent}`;

    await replenishmentList(getFullSwapiWebsite);



    document.body.scrollTop = document.documentElement.scrollTop = 0;


  }
}

async function replenishmentList(swapiURL) {
  let siteData = await getSiteContent(swapiURL);
  charactersList.innerHTML = "";

  let siteDataArr = siteData.results;

  let data = siteDataArr.reduce((acc, item) => (acc += addCharInfo(item)), "");
  charactersList.insertAdjacentHTML("beforeend", data);
  showHideButtons();
}
