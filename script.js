// require("dotenv").config();
document.addEventListener("DOMContentLoaded", () => {
  // Select the hamburger menu and the nav-items
  const hamburger = document.querySelector(".hamburger");
  const navItems = document.querySelector(".nav-items");

  // Toggle function to show/hide nav-items on click of the hamburger
  hamburger.addEventListener("click", () => {
    navItems.classList.toggle("hidden");
    navItems.classList.toggle("flex");
  });

  // Function to hide the nav-items when clicking outside of the menu
  document.addEventListener("click", (event) => {
    const isClickInside =
      hamburger.contains(event.target) || navItems.contains(event.target);

    let icon = document.getElementById("hamburger-icon");

    if (icon === `<i class="fa-solid fa-bars"></i>`) {
      icon.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
    } else {
      icon.innerHTML = `<i class="fa-solid fa-bars"></i>`;
    }

    if (!isClickInside) {
      navItems.classList.add("hidden");
    }
  });
});

// base URL
const baseURL = "https://api.themoviedb.org/3/";
const posterImgsURL = "https://image.tmdb.org/t/p/original/";
async function verifyUser() {
  const verificationURL = baseURL + "/authentication";
  try {
    const verificationResponse = await fetch(verificationURL, {
      headers: {
        // "Authorization": `token ${process.env.THE_MOVIE_DATABASE_API}`,
        Authorization: `bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYWE4ZGIzYzU2MzA3YmU1MTU3OThjZTY3ZWU4ZGY0YSIsIm5iZiI6MTc0MDEyMTU3Ny45MzUwMDAyLCJzdWIiOiI2N2I4MjVlOTU1MDMyOTI3NTYyMjViNmEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.JyjxgXVNtn23X0hGkqXwPf-N5LAv0yuNggvKuGF-ppg`,
        accept: `application/json`,
      },
    });
    console.log(`status Code: ${verificationResponse.status}`);
    const verificationData = await verificationResponse.json();
    console.log(verificationData);

    if (!response.ok) {
      console.log("failed to fetch data!");
      return;
    }
  } catch (error) {
    console.error(error.message);
  }
}

// verifyUser();

async function getTrendingMovies() {
  const trendingBaseURL = baseURL + "/trending/all/week?language=en-US";
  try {
    const trendingResponse = await fetch(trendingBaseURL, {
      headers: {
        // "Authorization": `token ${process.env.THE_MOVIE_DATABASE_API}`,
        Authorization: `bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYWE4ZGIzYzU2MzA3YmU1MTU3OThjZTY3ZWU4ZGY0YSIsIm5iZiI6MTc0MDEyMTU3Ny45MzUwMDAyLCJzdWIiOiI2N2I4MjVlOTU1MDMyOTI3NTYyMjViNmEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.JyjxgXVNtn23X0hGkqXwPf-N5LAv0yuNggvKuGF-ppg`,
        accept: `application/json`,
      },
    });
    console.log(`status Code: ${trendingResponse.status}`);

    const trendingResponseData = await trendingResponse.json();
    // console.log(trendingResponseData);

    // image backdrop
    const mainBackdropImgPath = posterImgsURL + trendingResponseData.results[0].backdrop_path;
    console.log(mainBackdropImgPath);
    let backdropDiv = document.getElementById("backdrop");
    backdropDiv.style.backgroundImage = `url("${mainBackdropImgPath}")`;
    backdrop.style.objectFit = "fill";

    // rating placement
    const rating = trendingResponseData.results[0].popularity;
    let ratingDiv = document.getElementById("movieRating");
    ratingDiv.textContent = `⭐ ${rating}`;

    // genres placement
    const showType = trendingResponseData.results[0].media_type;
    let genreType = trendingResponseData.results[0].genre_ids;
    console.log(genreType);
    let genreDiv = document.getElementById("movieGenres");
    let finalText;
    for (let i = 0; i <= genreType.length; i++){
      
      finalText +=  genreType[i];
      console.log(finalText);
    }
    genreDiv.textContent = `${showType} /`;

    // title placement
    const title = trendingResponseData.results[0].original_title;
    let titleDiv = document.getElementById("movieTitle");
    titleDiv.textContent = `${title}`;

    // description placement
    const description = trendingResponseData.results[0].overview;
    let descriptionDiv = document.getElementById("movieDescription");
    descriptionDiv.textContent = `${description}`;

    if (!response.ok) {
      console.log("failed to fetch data!");
      return;
    }

  } catch (error) {
    console.error(error.message);
  }
}
getTrendingMovies();


document.addEventListener("DOMContentLoaded", () => {
  // document.querySelector(".hero-image").innerHTML = `HEllo wordls`;
});
