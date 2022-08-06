let pagNavBar = document.getElementById("pagNavBar");
let CharactersList = document.getElementById("charactersList");
let activePagbutton;
let getFullSwapiWebsite;

function addCharInfo(inf) {
  let name = inf.name;
  let height = inf.height;
  let mass = inf.mass;
  let hair_color = inf.hair_color;
  let skin_color = inf.skin_color;
  let eye_color = inf.eye_color;
  let birth_year = inf.birth_year;
  let gender = inf.gender;
  let html = `<li class="charItem">
                    <p class="charInfo">Name: <span class="selectedtext">${name}</span></p>
                    <p class="charInfo">Height: <span class="selectedtext">${height}</span></p>
                    <p class="charInfo">Mass: <span class="selectedtext">${mass}</span></p>
                    <p class="charInfo">Hair Color: <span class="selectedtext">${hair_color}</span></p>
                    <p class="charInfo">Skin Color: <span class="selectedtext">${skin_color}</span></p>
                    <p class="charInfo">Eye Color: <span class="selectedtext">${eye_color}</span></p>
                    <p class="charInfo">Birth Year: <span class="selectedtext">${birth_year}</span></p>
                    <p class="charInfo">Gender: <span class="selectedtext">${gender}</span></p>
             </li>`;

  return html;
}

pagNavBar.addEventListener("click", async function (e) {
  if (e.target.classList.contains("footer__link")) {
    if (activePagbutton) {
      activePagbutton.classList.remove("activePagbutton");
    }

    activePagbutton = e.target.closest("li");
    activePagbutton.classList.add("activePagbutton");
    getFullSwapiWebsite =
      "https://swapi.dev/api/people/" + `?page=${e.target.textContent}`;

    let siteData = await getSiteContent(getFullSwapiWebsite);

    CharactersList.innerHTML = "";

    let siteDataArr = siteData.results;

    siteDataArr.forEach((item) => {
      let charItemBuffer = addCharInfo(item);

      CharactersList.insertAdjacentHTML("beforeend", charItemBuffer);
    });
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }
});

async function postListcharactersList() {
  let pageNum = "";
  let pageFullHREF = document.location.href;

  CharactersList.innerHTML = "";

  if (pageFullHREF.indexOf("=") != -1) {
    pageNum = pageFullHREF.substring(pageFullHREF.indexOf("=") + 1);
    getFullSwapiWebsite = "https://swapi.dev/api/people/" + `?page=${pageNum}`;
  } else {
    getFullSwapiWebsite = "https://swapi.dev/api/people/" + `?page=1`;
  }

  let siteData = await getSiteContent(getFullSwapiWebsite);
  let pagecharactersList = siteData.count / 9;
  let siteDataArr = siteData.results;
  createPaginationcharactersList(pagecharactersList);

  if (pageNum) {
    for (let li of pagNavBar.children) {
      if (li.textContent == pageNum) {
        activePagbutton = li;
        activePagbutton.classList.add("activePagbutton");
      }
    }
  } else {
    activePagbutton = pagNavBar.closest("li");
    activePagbutton.classList.add("activePagbutton");
  }

  siteDataArr.forEach((item) => {
    let charItemBuffer = addCharInfo(item);

    CharactersList.insertAdjacentHTML("beforeend", charItemBuffer);
  });
}



function createPaginationcharactersList(num) {
  pagNavBar.innerHTML = "";
  for (let i = 1; i <= num; i++) {
    let charItemBuffer = `
          <li class="footer__list-item"><a class="footer__link" href="#?page=${i}">${i}</a></li>
          `;
    pagNavBar.insertAdjacentHTML("beforeend", charItemBuffer);
  }
}

async function getSiteContent(URL) {
  let websiteInfo = await fetch(URL);

  return await websiteInfo.json();
}

document.addEventListener("load", postListcharactersList());
