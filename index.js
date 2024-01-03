// En eventlyssnare som lyssnar efter om mitt form ''submitas'' och då sätter igång min getRecipes funktion.
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".form").addEventListener("submit", (event) => {
    event.preventDefault();
    searchForRecipes();
  });
});

// Funktionen som gör att man kan söka efter reccept
async function searchForRecipes() {
  const searchInput = document.querySelector("#search-input").value;
  const recipeItem = document.querySelectorAll(".recipe-item");
  const searchResults = document.querySelector(".search-result");

  searchResults.innerHTML = "";
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + searchInput
  );
  const data = await response.json();

  for (let i = 0; i < data.meals.length; i++) {
    let meal = data.meals[i];

    let recipeImg = meal.strMealThumb;
    let recipeTitle = meal.strMeal;
    let recipeHref = meal.strSource;
    let recipeId = meal.idMeal;

    searchResults.innerHTML += ` <div class="recipe-item">
      <button class="fav-button"><i class="fa-regular fa-heart"></i></button>
      <button class="fav-button-clicked"><i class="fa-solid fa-heart"></i></button>
      <img src="${recipeImg}" alt="" class="recipe-image">
      <div class="meal-card">
      <h2 class="recipe-name">${recipeTitle}</h2>
      <button class="log-button" id="M${recipeId}">Show Recipe</button>
      </div>`;
  }
  buttonEvents(data);
}

//Kod för mina knappar
function buttonEvents(data) {
  const buttonForFavorites = document.querySelectorAll(".fav-button-clicked");
  const buttonForNonfavorites = document.querySelectorAll(".fav-button");
  const logButtons = document.querySelectorAll(".log-button");

  //Kod för ''favorite'' knapparna
  let favoriteRecipes =
    JSON.parse(sessionStorage.getItem("favoriteRecipeList")) || [];
  for (let i = 0; i < buttonForNonfavorites.length; i++) {
    let favMealId = data.meals[i].idMeal;

    buttonForNonfavorites[i].addEventListener("click", () => {
      buttonForNonfavorites[i].style.display = "none";
      buttonForFavorites[i].style.display = "block";
      favoriteRecipes.push(favMealId);
      sessionStorage.setItem(
        "favoriteRecipeList",
        JSON.stringify(favoriteRecipes)
      );
      console.log(favoriteRecipes);
    });

    buttonForFavorites[i].addEventListener("click", () => {
      buttonForFavorites[i].style.display = "none";
      buttonForNonfavorites[i].style.display = "block";

      favoriteRecipes = favoriteRecipes.filter(
        (recipeId) => recipeId !== favMealId
      );
      sessionStorage.setItem(
        "favoriteRecipeList",
        JSON.stringify(favoriteRecipes)
      );
      console.log(favoriteRecipes);
    });

    if (favoriteRecipes.includes(favMealId)) {
      buttonForFavorites[i].style.display = "block";
      buttonForNonfavorites[i].style.display = "none";
    } else {
      buttonForFavorites[i].style.display = "none";
      buttonForNonfavorites[i].style.display = "block";
    }

    //Kod för mina reccept knappar

    logButtons[i].addEventListener("click", () => {
      getRecipeInfo(data.meals[i].idMeal);
      container.style.display = "block";
    });
  }
}

//Funktion som ta fram en informationsruta med ökad recceptinformation
const container = document.querySelector(".item-info-container");

async function getRecipeInfo(mealId) {
  container.innerHTML = "";

  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + mealId
  );
  const data = await response.json();

  let meal = data.meals[0];

  let recipeImg = meal.strMealThumb;
  let recipeTitle = meal.strMeal;
  let recipeHref = meal.strSource;
  let recipeCategory = meal.strCategory;
  let recipeInstructions = meal.strInstructions;

  container.innerHTML += `<div class="item-info">
        <button class="item-info-button">close</button>
        <h2 class="item-info-name">${recipeTitle}</h2>
        <img src="${recipeImg}" alt="" class="item-info-img">
        <div class="item-info-cat-container">
        <h3 class="item-info-categorytitel">Category</h3>
        <p class="item-info-category">${recipeCategory}</p>
        </div>
        <h3 class="item-info-instructiontitel">Instructions</h3>
        <p class="item-info-instructions">${recipeInstructions}</p>
        <a href="${recipeHref}" class="item-info-link">Recipe Link</a>
        </div>`;

  let closeButtons = document.querySelectorAll(".item-info-button");

  closeButtons.forEach((closeButton) => {
    closeButton.addEventListener("click", () => {
      container.style.display = "none";
    });
  });
}
