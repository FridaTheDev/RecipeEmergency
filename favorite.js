//Här hämtar jag informationen som är lagrad i min index.js! Denna informationen innehåller ''favoriter''
let favoriteRecipes = JSON.parse(sessionStorage.getItem("favoriteRecipeList"));
console.log(favoriteRecipes);

//En funktion som visar de reccept som är valda som favoriter.
async function showFavorites() {
  let favoriteItem = document.querySelector(".fav-item");
  favoriteItem.innerHTML = "";

  for (let i = 0; i < favoriteRecipes.length; i++) {
    let favId = favoriteRecipes[i];

    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + favId
    );
    const data = await response.json();

    if (data.meals) {
      let meal = data.meals[0];

      let recipeImg = meal.strMealThumb;
      let recipeTitle = meal.strMeal;
      let recipeHref = meal.strSource;
      let recipeId = meal.idMeal;

      favoriteItem.innerHTML += ` <div class="recipe-item">
            <button class="fav-button" style="display:none" ><i class="fa-regular fa-heart"></i></button>
            <button class="fav-button-clicked" data-myid="${recipeId}"><i class="fa-solid fa-heart"></i></button>
            <img src="${recipeImg}" alt="" class="recipe-image">
            <div class="meal-card">
            <h2 class="recipe-name">${recipeTitle}</h2>
            <button class="log-button" data-id="${recipeId}">Show Recipe</button>
            </div>`;
      buttonEvents();
    }
  }
}

function buttonEvents() {
  const buttonForFavorites = document.querySelectorAll(".fav-button-clicked");
  const buttonForNonfavorites = document.querySelectorAll(".fav-button");
  const logButtons = document.querySelectorAll(".log-button");

  for (let i = 0; i < buttonForFavorites.length; i++) {
    buttonForFavorites[i].addEventListener("click", () => {
      buttonForFavorites[i].style.display = "none";
      buttonForNonfavorites[i].style.display = "block";

      const myId = buttonForFavorites[i].dataset.myid;
      favoriteRecipes = favoriteRecipes.filter((id) => id !== myId);
      sessionStorage.setItem(
        "favoriteRecipeList",
        JSON.stringify(favoriteRecipes)
      );
      updatePieChart();
      console.log(JSON.parse(sessionStorage.getItem("favoriteRecipeList")));
      showFavorites();
    });
    logButtons[i].addEventListener("click", () => {
      const mealId = logButtons[i].dataset.id;
      getRecipeInfo(mealId);
      container.style.display = "block";
    });
  }
}

//En funktion som ger utökad information
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

showFavorites();

// Här påbörjas chart.js
const categoryChart = document.querySelector(".category-chart");
const categoryPie = document.querySelector(".chart-box");
const closePie = document.querySelector(".close-chart");

categoryChart.addEventListener("click", () => {
  categoryPie.style.display = "block";
  closePie.style.display = "block";
});

closePie.addEventListener("click", () => {
  categoryPie.style.display = "none";
  closePie.style.display = "none";
});

//Koden för min Pie-Chart
let myChart = null;
let categoryLabel = [];
let categoryData = [];

async function updatePieChart() {
  let updatedCategoryData = [];
  let updatedCategoryLabel = [];

  for (let i = 0; i < favoriteRecipes.length; i++) {
    let favId = favoriteRecipes[i];

    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + favId
    );

    const data = await response.json();
    let meal = data.meals[0].strCategory;

    let index = updatedCategoryLabel.indexOf(meal);

    if (index === -1) {
      updatedCategoryLabel.push(meal);
      updatedCategoryData.push(1);
    } else {
      updatedCategoryData[index]++;
    }
  }

  if (myChart) {
    myChart.data.labels = updatedCategoryLabel;
    myChart.data.datasets[0].data = updatedCategoryData;
    myChart.update();
  }

  categoryLabel = updatedCategoryLabel;
  categoryData = updatedCategoryData;
}

async function pieChart() {
  await updatePieChart();

  const data = {
    labels: categoryLabel,
    datasets: [
      {
        label: "Meal Categories",
        data: categoryData,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {},
    },
  };

  const config = {
    type: "pie",
    data,
    options,
  };

  myChart = new Chart(document.getElementById("myChart"), config);
}

pieChart();
