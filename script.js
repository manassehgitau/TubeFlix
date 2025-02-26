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
    // console.log(`status Code: ${verificationResponse.status}`);
    const verificationData = await verificationResponse.json();
    // console.log(verificationData);

    if (!response.ok) {
      console.log("failed to fetch data!");
      return;
    }
  } catch (error) {
    console.error(error.message);
  }
}

// verifyUser();

async function displayMostTrendingShow() {
  const trendingBaseURL = baseURL + "/trending/all/week?language=en-US";
  try {
    const trendingResponse = await fetch(trendingBaseURL, {
      headers: {
        // "Authorization": `token ${process.env.THE_MOVIE_DATABASE_API}`,
        Authorization: `bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYWE4ZGIzYzU2MzA3YmU1MTU3OThjZTY3ZWU4ZGY0YSIsIm5iZiI6MTc0MDEyMTU3Ny45MzUwMDAyLCJzdWIiOiI2N2I4MjVlOTU1MDMyOTI3NTYyMjViNmEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.JyjxgXVNtn23X0hGkqXwPf-N5LAv0yuNggvKuGF-ppg`,
        accept: `application/json`,
      },
    });
    // console.log(`status Code: ${trendingResponse.status}`);

    const trendingResponseData = await trendingResponse.json();
    // console.log(trendingResponseData);

    // image backdrop
    const mainBackdropImgPath =
      posterImgsURL + trendingResponseData.results[0].backdrop_path;
    // console.log(mainBackdropImgPath);
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
    // console.log(genreType);
    let genreDiv = document.getElementById("movieGenres");
    genreDiv.textContent = `${showType} /`;

    // title placement
    let title = trendingResponseData.results[0].original_title;
    if (title === undefined) {
      title = trendingResponseData.results[0].original_name;
    }
    let titleDiv = document.getElementById("movieTitle");
    titleDiv.textContent = `${title}`;

    // description placement
    const description = trendingResponseData.results[0].overview;
    let descriptionDiv = document.getElementById("movieDescription");
    descriptionDiv.textContent = `${description}`;

    // if (!response.ok) {
    //   console.log("failed to fetch data!");
    //   return;
    // }
  } catch (error) {
    console.error(error.message);
  }
}

async function displayTrendingShows() {
  const trendingBaseURL = baseURL + "/trending/all/week?language=en-US";
  try {
    const trendingResponse = await fetch(trendingBaseURL, {
      headers: {
        // "Authorization": `token ${process.env.THE_MOVIE_DATABASE_API}`,
        Authorization: `bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYWE4ZGIzYzU2MzA3YmU1MTU3OThjZTY3ZWU4ZGY0YSIsIm5iZiI6MTc0MDEyMTU3Ny45MzUwMDAyLCJzdWIiOiI2N2I4MjVlOTU1MDMyOTI3NTYyMjViNmEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.JyjxgXVNtn23X0hGkqXwPf-N5LAv0yuNggvKuGF-ppg`,
        accept: `application/json`,
      },
    });
    // console.log(`status Code: ${trendingResponse.status}`);

    const trendingResponseData = await trendingResponse.json();
    // console.log(trendingResponseData);
    let displayData = trendingResponseData;
    let showContainer = document.getElementById("movie-slider");
    showContainer.innerHTML = "";
    setMovieTrailers(displayData.results);

    
    displayData.results.forEach((show) => {
      // posterURL Placement
      let posterURL = posterImgsURL + show.poster_path;
      // console.log(posterURL);

      // rating placement
      const rating = show.popularity;
      // console.log(rating);

      // genres placement
      const showType = show.media_type;
      // console.log(showType);

      // title placement
      let title = show.original_title;
      if (title === undefined) {
        title = show.original_name;
      }
      // console.log(title);

      // description placement
      const description = show.overview;

      // Create element to add the movie/show card

      let showsCard = document.createElement("div");
      showsCard.className += "carousel-item w-full sm:w-1/2 lg:w-1/4 p-4";

      showsCard.innerHTML = `
      <div class="min-w-[200px] bg-[#0e151d] shadow-lg rounded-lg overflow-hidden transition-all duration-300 ease-in-out cursor-pointer" onclick="toggleMovieDetails(this)">
        <img src="${posterURL}" alt="Movie Poster" class="w-full h-48 object-cover">
        <div class="p-4">
          <h2 class="text-xl font-semibold line-clamp-1">${title}</h2>
          <p id="showType" class="text-sm">${showType}</p>
          <div class="text-yellow-400">⭐ ${Math.floor(rating)}M</div>
        </div>
        <!-- Movie Details Section (Hidden by Default) -->
      <div class="movie-details hidden fixed inset-0 bg-[#0e151d] bg-opacity-90 p-6 z-50 overflow-y-auto flex justify-center items-center">
        <div class="max-w-4xl w-full bg-[#1c2733] rounded-lg shadow-lg p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-semibold text-white">${title}</h3>
            <!-- Close Button -->
            <button class="text-3xl font-bold text-white hover:text-gray-400 transition duration-200 ease-in-out" onclick="toggleMovieDetails(this.closest('.movie-card'))">&times;</button>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold text-white my-3">Movie Synopsis</h3>
            <p class="text-white text-md mb-4 mt-2 px-2 leading-relaxed">
              ${description}
            </p>
          </div>
        
          <!-- Trailer (Embedded YouTube) -->
          <div class="w-full h-64 sm:h-96 overflow-hidden rounded-lg shadow-md">
            <iframe id="trailer-iframe-${show.id}" class="w-full h-full" src="" title="Movie Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        </div>
      </div>
      </div>
        `;
      showContainer.appendChild(showsCard);
    });

    // if (!response.ok) {
      //   console.log("failed to fetch data!");
      //   return;
      // }
  } catch (error) {
    console.error(error.message);
  }
}
async function getMoviesByGenre(genreID=28) {
  const movieBasedOnGenreURL = baseURL + `discover/movie?include_adult=false&include_video=true&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genreID}`;
  try {
    const movieBasedOnGenreResponse = await fetch(movieBasedOnGenreURL, {
      headers: {
        // "Authorization": `token ${process.env.THE_MOVIE_DATABASE_API}`,
        Authorization: `bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYWE4ZGIzYzU2MzA3YmU1MTU3OThjZTY3ZWU4ZGY0YSIsIm5iZiI6MTc0MDEyMTU3Ny45MzUwMDAyLCJzdWIiOiI2N2I4MjVlOTU1MDMyOTI3NTYyMjViNmEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.JyjxgXVNtn23X0hGkqXwPf-N5LAv0yuNggvKuGF-ppg`,
        accept: `application/json`,
      },
    });
    // console.log(`status Code: ${movieBasedOnGenreResponse.status}`);
    const movieBasedOnGenreResponseData = await movieBasedOnGenreResponse.json();
    // console.log(movieBasedOnGenreResponseData);

    let displayMovieData = movieBasedOnGenreResponseData;

    // Clear previous movie cards before adding new ones
    const movieContainer = document.getElementById("movie-container");
    movieContainer.innerHTML = ""; // Clear existing cards
    setMovieTrailers(displayMovieData.results);

    displayMovieData.results.forEach((movie) => {
      // posterURL Placement
      let moviePosterURL = posterImgsURL + movie.poster_path;
      // console.log(moviePosterURL);

      // rating placement
      const movieRating = movie.popularity;
      // console.log(movieRating);

      // genres placement
      const releaseDate = movie.release_date;
      // console.log(releaseDate);

      // title placement
      let movieTitle = movie.original_title;
      if (movieTitle === undefined) {
        movieTitle = movie.original_name;
      }
      // console.log(movieTitle);

      // genres placement
      const showType = movie.media_type;
      // console.log(showType);

      // description placement
    const movieDescription = movie.overview;

    // get Movie id
    // const movieID = movie.id;
    // console.log(movieID);
    // // setTrailer(movieID);
    // (async () => {
    //   console.log(await getMovieTrailerLink(movieID));
    // })(); 
    
      // Create element to add the movie/show card
      let moviesCard = document.createElement("div");
      moviesCard.className += "carousel-item w-full sm:w-1/2 lg:w-1/4 p-4";

      moviesCard.innerHTML = `
      <div class="min-w-[200px] bg-[#0e151d] shadow-lg rounded-lg transition-all duration-300 ease-in-out cursor-pointer" onclick="toggleMovieDetails(this)">
        <img src="${moviePosterURL}" alt="Movie Poster" class="w-full h-48 object-cover">
        <div class="p-4">
          <h2 class="text-xl font-semibold line-clamp-1">${movieTitle}</h2>
          <p id="showType" class="text-sm">${releaseDate}</p>
          <div class="text-yellow-400">⭐ ${Math.floor(movieRating)}M</div>
        </div>
        <!-- Movie Details Section (Hidden by Default) -->
        <div class="movie-details hidden fixed inset-0 bg-[#0e151d] bg-opacity-90 p-6 z-50 overflow-y-auto flex justify-center items-center">
          <div class="max-w-4xl w-full bg-[#1c2733] rounded-lg shadow-lg p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl font-semibold text-white">${movieTitle}</h3>
              <!-- Close Button -->
              <button class="text-3xl font-bold text-white hover:text-gray-400 transition duration-200 ease-in-out" onclick="toggleMovieDetails(this.closest('.movie-card'))">&times;</button>
            </div>

            <div class="mb-6">
              <h3 class="text-lg font-semibold text-white my-3">Movie Synopsis</h3>
              <p class="text-white text-md mb-4 mt-2 px-2 leading-relaxed">
                ${movieDescription}
              </p>
            </div>
          
            <!-- Trailer (Embedded YouTube) -->
            <div class="w-full h-64 sm:h-96 overflow-hidden rounded-lg shadow-md">
              <iframe id="trailer-iframe-${movie.id}" class="w-full h-full" src="" title="Movie Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
          </div>
        </div>

      </div>
        `;
      movieContainer.appendChild(moviesCard);
    });

  } catch (error) {
    console.error(error.message);
  }
}

async function getMovieTrailerLink(movieID) {
  const showTrailerURL = baseURL + `/movie/${movieID}/videos`;
  const youTubeBaseURL = `https://www.youtube.com/embed/`;

  const movieKeyResponse = await fetch(showTrailerURL, {
    headers: {
      Authorization: `bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYWE4ZGIzYzU2MzA3YmU1MTU3OThjZTY3ZWU4ZGY0YSIsIm5iZiI6MTc0MDEyMTU3Ny45MzUwMDAyLCJzdWIiOiI2N2I4MjVlOTU1MDMyOTI3NTYyMjViNmEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.JyjxgXVNtn23X0hGkqXwPf-N5LAv0yuNggvKuGF-ppg`,
      accept: `application/json`,
    },
  });

  const movieKeyResponseData = await movieKeyResponse.json();
  
  // Find the first YouTube trailer key
  const trailer = movieKeyResponseData.results.find((result) => result.site === "YouTube");
  
  if (trailer) {
    // Return the full YouTube link
    return youTubeBaseURL + trailer.key;
  } else {
    // Return a fallback value if no trailer is found
    return null;
  }
}

async function setMovieTrailers(movies) {
  for (let index = 0; index < movies.length; index++) {
    const movie = movies[index];

    // Fetch the trailer link for this movie
    const trailerLink = await getMovieTrailerLink(movie.id);

    // If a trailer link is found, assign it to the iframe of the corresponding movie card
    if (trailerLink) {
      const iframe = document.getElementById(`trailer-iframe-${movie.id}`);
      if (iframe) {
        iframe.src = trailerLink;
        // console.log("Added");
      }
    } else {
      // console.log(`No trailer found for movie ID: ${movie.id}`);
    }
  }
}

function toggleMovieDetails(movieCard) {
  const movieDetails = movieCard.querySelector('.movie-details');
  
  if (movieDetails.classList.contains('hidden')) {
    // Show movie details
    movieDetails.classList.remove('hidden');
  } else {
    // Hide movie details and stop the trailer from playing
    const iframe = movieDetails.querySelector('iframe');
    if (iframe) {
      iframe.src = '';  // Reset the src to stop the trailer
    }
    movieDetails.classList.add('hidden');
  }
}
// Add event listeners to each genre button
document.querySelectorAll('.genre').forEach(genreButton => {
  genreButton.addEventListener('click', () => {
    const genreID = genreButton.getAttribute('onclick').match(/\d+/)[0]; // Extract genre ID from onclick attribute
    getMoviesByGenre(genreID);
  });
});

// Initial movie load
document.addEventListener("DOMContentLoaded", () => {
  displayMostTrendingShow();
  displayTrendingShows();
  getMoviesByGenre(); // Load default genre on page load
});

// Auto-move and controls for the carousel
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("movie-slider");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");

  let scrollAmount = 0;
  const scrollStep = 220; 
  const autoScrollInterval = 3000; 

  // Auto-move function
  const autoMove = () => {
    scrollAmount += scrollStep;
    if (scrollAmount >= slider.scrollWidth) {
      scrollAmount = 0; 
    }
    slider.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  // Manual controls
  prevButton.addEventListener("click", () => {
    scrollAmount -= scrollStep;
    if (scrollAmount < 0) {
      scrollAmount = slider.scrollWidth - slider.clientWidth; 
    }
    slider.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });
  });

  nextButton.addEventListener("click", () => {
    scrollAmount += scrollStep;
    if (scrollAmount >= slider.scrollWidth) {
      scrollAmount = 0;
    }
    slider.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });
  });

  // Auto-move slider every few seconds
  let autoMoveInterval = setInterval(autoMove, autoScrollInterval);

  // Stop auto-move on hover
  slider.addEventListener("mouseenter", () => {
    clearInterval(autoMoveInterval);
  });

  slider.addEventListener("mouseleave", () => {
    autoMoveInterval = setInterval(autoMove, autoScrollInterval);
  });

  // Control the buttons in the movie genre section
  const genreList = document.getElementById('genre-list');
const prevButtonGenre = document.getElementById('prev-genre');
const nextButtonGenre = document.getElementById('next-genre');

const scrollAmountGenre = 200; // Amount to scroll when the button is clicked

// Scroll to the left when "Prev" is clicked
prevButtonGenre.addEventListener('click', () => {
  genreList.scrollBy({
    left: -scrollAmountGenre,
    behavior: 'smooth'
  });
});

// Scroll to the right when "Next" is clicked
nextButtonGenre.addEventListener('click', () => {
  genreList.scrollBy({
    left: scrollAmountGenre,
    behavior: 'smooth'
  });
});

// Control the buttons in the movie cards section
const movieCards = document.getElementById('movie-container');
const prevButtonMovie = document.getElementById('prevMovie');
const nextButtonMovie = document.getElementById('nextMovie');

const scrollAmountMovie = 200; // Amount to scroll when the button is clicked

// Scroll to the left when "Prev" is clicked
prevButtonMovie.addEventListener('click', () => {
  movieCards.scrollBy({
    left: -scrollAmountMovie,
    behavior: 'smooth'
  });
});

// Scroll to the right when "Next" is clicked
nextButtonMovie.addEventListener('click', () => {
  movieCards.scrollBy({
    left: scrollAmountMovie,
    behavior: 'smooth'
  });
});
});
