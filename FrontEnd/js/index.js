let categories = [];
let allWorks = [];

// chercher les {id: 0, name: 'Tous'}categories depuis le backend
checkIfConnected();
loadCategories();
displayWorks();

function loadCategories() {
  fetch("http://localhost:5678/api/categories")
    .then(response => {
      console.log(response);
      if (response.ok)
        return response.json();
    })
    .then(data => {
      if (data) {
        data.forEach(element => {
          categories.push(element);
        });
        console.log(categories);
        document.getElementById("0").addEventListener('click', () => {

          const gallery = document.querySelector('.gallery');
          gallery.innerHTML = '';
          allWorks.forEach((item) => {
            const figure = createFigure(item);
            gallery.appendChild(figure);
          });
        });
        displayFilters(categories);
        addOptionsInSelect(categories);
      }
    })
    .catch(error => {
      console.log(error);
      alert("Une erreur est survenue, veuillez contacter l'administrateur du site !");
    });
}

// Afficher les filtres 
function displayFilters(categories) {
  const filters = document.querySelector(".filters");
  categories.forEach(element => {
    const filter = document.createElement("div");
    filter.className = "filter";
    filter.setAttribute("id", element.id);
    filter.textContent = element.name;
    filters.appendChild(filter);
    // écouteur d'évènement ajouté à chaque filtre 
    filter.addEventListener('click', () => {
      const filterId = parseInt(filter.getAttribute('id'));
      const filteredWorks = allWorks.filter((work) => work.categoryId === filterId);
      const gallery = document.querySelector('.gallery');
      gallery.innerHTML = '';
      filteredWorks.forEach((item) => {
        const figure = createFigure(item);
        gallery.appendChild(figure);
      });
    })
  })
}

async function fetchWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}

// stocke projets dans allWorks et les affiche dans la section avec la classe "gallery" en utilisant createFigure pour créer des éléments HTML représentant chaque projet.
function displayWorks() {
  const projets = fetchWorks().then((data) => {
    allWorks = data;

    const gallery = document.querySelector(".gallery");
    console.log(projets);
    allWorks.forEach((item) => {
      const figure = createFigure(item);
      gallery.appendChild(figure);

    });
  }).catch((error) => {
    console.log(error);
    alert("Une erreur est survenue ! Veuillez contacter l'administrateur du site !")
  });

}

function createFigure(projet) {
  const figure = document.createElement("figure");
  figure.id = "figure" + projet.id;
  figure.dataset.categoryId = projet.categoryId;
  const image = document.createElement("img");
  image.src = projet.imageUrl;
  image.alt = projet.title;
  const title = document.createElement("figcaption");
  title.textContent = projet.title;

  figure.appendChild(image);
  figure.appendChild(title);
  return figure;
}

function checkIfConnected() {
  // si je suis authentifié j'ai un token  sinon non !
  if (localStorage.getItem("token")) {
    //cacher login 
    const login = document.getElementById("login");
    login.style.display = "none";
    //afficher logout
    const logout = document.getElementById("logout");
    logout.style.display = "block";
    logout.addEventListener('click', () => {
      /* localStorage.removeItem('token');
       localStorage.removeItem('userId');*/
      localStorage.clear();
      window.location.reload();
    });
    //Ajouter un actionListener clcik de logout 
    //afficher la barre noir et les boutons modifier
    const bar = document.querySelector(".bar");
    bar.style.display = "flex"

    const allBtnModifier = document.querySelectorAll(".btnModifier");
    allBtnModifier.forEach(element => {
      element.style.display = "flex";
    });
    //cacher les filtres
    const filters = document.querySelector(".filters");
    filters.style.display = "none";

  }
  else {
    //afficher login 
    const login = document.getElementById("login");
    login.style.display = "block";
    //cacher logout
    const logout = document.getElementById("logout");
    logout.style.display = "none";
    //cacher la barre noir et les boutons modifier
    const bar = document.querySelector(".bar");
    bar.style.display = "none"

    const allBtnModifier = document.querySelectorAll(".btnmodifier");
    allBtnModifier.forEach(element => {
      element.style.display = "none";
    });
    //afficher les filtres
    const filters = document.querySelector(".filters");
    filters.style.display = "flex";

  }
}


function addOptionsInSelect(categories) {
  const category = document.getElementById("category");
  category.innerHTML = "";
  categories.forEach(element => {
    const option = document.createElement('option');
    option.value = element.id;
    option.text = element.name;
    category.appendChild(option);
  });
}