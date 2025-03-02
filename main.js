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
    const apiKey = import.meta.env.VITE_THE_MOVIE_DATABASE_READ_ACCESS_TOKEN;
    // console.log(apiKey);
    const verificationResponse = await fetch(verificationURL, {
      headers: {
        // "Authorization": `token ${process.env.THE_MOVIE_DATABASE_API}`,
        Authorization: `bearer ${apiKey}`,
        accept: `application/json`,
      },
    });
    // console.log(`status Code: ${verificationResponse.status}`);
    const verificationData = await verificationResponse.json();
    // console.log(verificationData);

    // if (!response.ok) {
    //   console.log("failed to fetch data!");
    //   return;
    // }
  } catch (error) {
    console.error(error.message);
  }
}

verifyUser();

async function displayMostTrendingShow() {
  const trendingBaseURL = baseURL + "/trending/all/week?language=en-US";
  try {
    const apiKey = import.meta.env.VITE_THE_MOVIE_DATABASE_READ_ACCESS_TOKEN;
    const trendingResponse = await fetch(trendingBaseURL, {
      headers: {
        // "Authorization": `token ${process.env.THE_MOVIE_DATABASE_API}`,
        Authorization: `bearer ${apiKey}`,
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

    document.getElementById("backdrop-trailer").addEventListener("click", async () => {
      let backdropContainer = document.getElementById("backdrop");
      // Save the original background image before clearing
      const originalBackgroundImage = backdropContainer.style.backgroundImage;
      // Clear the background image and show the video trailer
      backdropContainer.style.backgroundImage = 'none';
    
      // Fetch the trailer link for the current trending movie
      const movieID = trendingResponseData.results[0].id;
      const trailerLink = await getMovieTrailerLink(movieID); // Assuming you have a getMovieTrailerLink function
    
      if (trailerLink) {
        // Replace the backdrop content with the iframe for the trailer and add a Close button
        backdropContainer.innerHTML = `
          <!-- Trailer (Embedded YouTube) -->
          <div class="w-full h-full sm:h-full overflow-hidden rounded-lg shadow-md">
            <iframe id="trailer-iframe-${movieID}" class="w-full h-full" src="${trailerLink}" title="Movie Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
          <button id="close-trailer" class="absolute top-50 right-2 bg-[#f6101f] text-white font-bold py-1 px-4 rounded-full">Close</button>
        `;
    
        // Add event listener for the Close button
        document.getElementById("close-trailer").addEventListener("click", () => {
          // Restore the original background image and remove the trailer
          backdropContainer.innerHTML = ''; // Clear the trailer content
          backdropContainer.style.backgroundImage = originalBackgroundImage; // Restore background image
              // Restore movie details
          document.getElementById("movieTitle").textContent = originalTitle;
          document.getElementById("movieGenres").textContent = originalGenres;
          document.getElementById("movieRating").textContent = originalRating;
          document.getElementById("movieDescription").textContent = originalDescription;
        });
      } else {
        console.error(`No trailer found for movie ID: ${movieID}`);
      }
    });
    

    // if (!response.ok) {
    //   console.log("failed to fetch data!");
    //   return;
    // }
  } catch (error) {
    console.error(error.message);
  }
}

async function displayTrendingShows() {
  const apiKey = import.meta.env.VITE_THE_MOVIE_DATABASE_READ_ACCESS_TOKEN;
  const trendingBaseURL = baseURL + "/trending/all/week?language=en-US";
  try {
    const trendingResponse = await fetch(trendingBaseURL, {
      headers: {
        // "Authorization": `token ${process.env.THE_MOVIE_DATABASE_API}`,
        Authorization: `bearer ${apiKey}`,
        accept: `application/json`,
      },
    });
    // console.log(`status Code: ${trendingResponse.status}`);

    const trendingResponseData = await trendingResponse.json();
    // console.log(trendingResponseData);
    let displayData = trendingResponseData;
    let showContainer = document.getElementById("movie-slider");
    showContainer.innerHTML = "";
        document.addEventListener("DOMContentLoaded", setMovieTrailers(displayData.results));


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
      <div class="min-w-[200px] bg-[#0e151d] shadow-lg rounded-lg overflow-hidden transition-all duration-300 ease-in-out cursor-pointer movie-card">
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
            <button class="close-button text-3xl font-bold text-white hover:text-gray-400 transition duration-200 ease-in-out" >&times;</button>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold text-white my-3">Movie Synopsis</h3>
            <p class="text-white text-md mb-4 mt-2 px-2 leading-relaxed">
              ${description}
            </p>
          </div>
        
          <!-- Trailer (Embedded YouTube) -->
          <div class="w-full h-64 sm:h-96 overflow-hidden rounded-lg shadow-md">
            <iframe id="trailer-iframe-${
              show.id
            }" class="w-full h-full" src="" title="Movie Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        </div>
      </div>
      </div>
        `;
    // Add event listeners for the TV Show Card
    showsCard.querySelector(".movie-card").addEventListener("click", function () {
      toggleDetails(this, "movie");
    });

    showsCard.querySelector(".close-button").addEventListener("click", function (e) {
      e.stopPropagation(); // Prevents triggering the card click when pressing the close button
      toggleDetails(this.closest(".movie-card"), "movie");
    });

    // Function to toggle details visibility (show or hide)
    function toggleDetails(card, section) {
      const detailsSection = card.querySelector(`.${section}-details`);

      if (detailsSection.classList.contains("hidden")) {
        // Show the details section
        detailsSection.classList.remove("hidden");
      } else {
        // Hide the details section and stop the trailer from playing
        const iframe = detailsSection.querySelector("iframe");
        if (iframe) {
          iframe.src = ""; // Reset the iframe src to stop the trailer
        }
        detailsSection.classList.add("hidden");
      }
    }

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


document.getElementById("trends-now").addEventListener("click",  

  function loadTrendingShows(){
    document.getElementById("trends-now").classList.add("text-[#f6101f]");
    document.getElementById("popular").classList.remove("text-[#f6101f]");
    document.getElementById("premeiers").classList.remove("text-[#f6101f]");
    document.getElementById("recent").classList.remove("text-[#f6101f]");


    displayTrendingShows();
  }
);

async function displayPopularShows() {
  const apiKey = import.meta.env.VITE_THE_MOVIE_DATABASE_READ_ACCESS_TOKEN;
  const popularBaseURL = baseURL + "/movie/popular?language=en-US&page=1";
  try {
    const popularResponse = await fetch(popularBaseURL, {
      headers: {
        // "Authorization": `token ${process.env.THE_MOVIE_DATABASE_API}`,
        Authorization: `bearer ${apiKey}`,
        accept: `application/json`,
      },
    });
    // console.log(`status Code: ${trendingResponse.status}`);

    const popularResponseData = await popularResponse.json();
    // console.log(trendingResponseData);
    let displayData = popularResponseData;
    let showContainer = document.getElementById("movie-slider");
    showContainer.innerHTML = "";
    document.addEventListener("DOMContentLoaded", setMovieTrailers(displayData.results));
    

    displayData.results.forEach((show) => {
      // posterURL Placement
      let posterURL = posterImgsURL + show.poster_path;
      // console.log(posterURL);

      // rating placement
      const rating = show.popularity;
      // console.log(rating);

      // genres placement
      const showType = "movie";
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
      <div class="min-w-[200px] bg-[#0e151d] shadow-lg rounded-lg overflow-hidden transition-all duration-300 ease-in-out cursor-pointer movie-card">
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
            <h3 class="text-2xl font-semibold text
            <button class="close-button text-3xl font-bold text-white hover:text-gray-400 transition duration-200 ease-in-out">&times;</button>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold text-white my-3">Movie Synopsis</h3>
            <p class="text-white text-md mb-4 mt-2 px-2 leading-relaxed">
              ${description}
            </p>
          </div>
        
          <!-- Trailer (Embedded YouTube) -->
          <div class="w-full h-64 sm:h-96 overflow-hidden rounded-lg shadow-md">
            <iframe id="trailer-iframe-${
              show.id
            }" class="w-full h-full" src="" title="Movie Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        </div>
      </div>
      </div>
        `;

    // Add event listeners for the TV Show Card
    showsCard.querySelector(".movie-card").addEventListener("click", function () {
      toggleDetails(this, "movie");
    });

    showsCard.querySelector(".close-button").addEventListener("click", function (e) {
      e.stopPropagation(); // Prevents triggering the card click when pressing the close button
      toggleDetails(this.closest(".movie-card"), "movie");
    });

    // Function to toggle details visibility (show or hide)
    function toggleDetails(card, section) {
      const detailsSection = card.querySelector(`.${section}-details`);

      if (detailsSection.classList.contains("hidden")) {
        // Show the details section
        detailsSection.classList.remove("hidden");
      } else {
        // Hide the details section and stop the trailer from playing
        const iframe = detailsSection.querySelector("iframe");
        if (iframe) {
          iframe.src = ""; // Reset the iframe src to stop the trailer
        }
        detailsSection.classList.add("hidden");
      }
    }
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

document.getElementById("popular").addEventListener("click",  
  function loadPopularShows(){
    document.getElementById("popular").classList.add("text-[#f6101f]");
    document.getElementById("trends-now").classList.remove("text-[#f6101f]");
    document.getElementById("premeiers").classList.remove("text-[#f6101f]");
    document.getElementById("recent").classList.remove("text-[#f6101f]");


    displayPopularShows();
  }
);

async function displayUpcomingShows() {
  const apiKey = import.meta.env.VITE_THE_MOVIE_DATABASE_READ_ACCESS_TOKEN;
  const upcomingBaseURL = baseURL + "/movie/upcoming?language=en-US&page=1";
  try {
    const upcomingResponse = await fetch(upcomingBaseURL, {
      headers: {
        // "Authorization": `token ${process.env.THE_MOVIE_DATABASE_API}`,
        Authorization: `bearer ${apiKey}`,
        accept: `application/json`,
      },
    });
    // console.log(`status Code: ${trendingResponse.status}`);

    const upcomingResponseData = await upcomingResponse.json();
    // console.log(trendingResponseData);
    let displayData = upcomingResponseData;
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
      const showType = "movie";
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
      <div class="min-w-[200px] bg-[#0e151d] shadow-lg rounded-lg overflow-hidden transition-all duration-300 ease-in-out cursor-pointer movie-card">
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
            <button class="close-button text-3xl font-bold text-white hover:text-gray-400 transition duration-200 ease-in-out" >&times;</button>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold text-white my-3">Movie Synopsis</h3>
            <p class="text-white text-md mb-4 mt-2 px-2 leading-relaxed">
              ${description}
            </p>
          </div>
        
          <!-- Trailer (Embedded YouTube) -->
          <div class="w-full h-64 sm:h-96 overflow-hidden rounded-lg shadow-md">
            <iframe id="trailer-iframe-${
              show.id
            }" class="w-full h-full" src="" title="Movie Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        </div>
      </div>
      </div>
        `;
    // Add event listeners for the TV Show Card
    showsCard.querySelector(".movie-card").addEventListener("click", function () {
      toggleDetails(this, "movie");
    });

    showsCard.querySelector(".close-button").addEventListener("click", function (e) {
      e.stopPropagation(); // Prevents triggering the card click when pressing the close button
      toggleDetails(this.closest(".movie-card"), "movie");
    });

    // Function to toggle details visibility (show or hide)
    function toggleDetails(card, section) {
      const detailsSection = card.querySelector(`.${section}-details`);

      if (detailsSection.classList.contains("hidden")) {
        // Show the details section
        detailsSection.classList.remove("hidden");
      } else {
        // Hide the details section and stop the trailer from playing
        const iframe = detailsSection.querySelector("iframe");
        if (iframe) {
          iframe.src = ""; // Reset the iframe src to stop the trailer
        }
        detailsSection.classList.add("hidden");
      }
    }
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

document.getElementById("premeiers").addEventListener("click", 
  function loadUpcomingShows(){
    document.getElementById("premeiers").classList.add("text-[#f6101f]");
    document.getElementById("trends-now").classList.remove("text-[#f6101f]");
    document.getElementById("popular").classList.remove("text-[#f6101f]");
    document.getElementById("recent").classList.remove("text-[#f6101f]");


    displayUpcomingShows();
  }
);

async function displayLatestShows() {
  const apiKey = import.meta.env.VITE_THE_MOVIE_DATABASE_READ_ACCESS_TOKEN;
  const latestBaseURL = baseURL + "/movie/latest";
  try {
    const latestResponse = await fetch(latestBaseURL, {
      headers: {
        // "Authorization": `token ${process.env.THE_MOVIE_DATABASE_API}`,
        Authorization: `bearer ${apiKey}`,
        accept: `application/json`,
      },
    });
    // console.log(`status Code: ${trendingResponse.status}`);

    const latestResponseData = await latestResponse.json();
    // console.log(trendingResponseData);
    let displayData = latestResponseData;
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
      const showType = "movie";
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
      <div class="min-w-[200px] bg-[#0e151d] shadow-lg rounded-lg overflow-hidden transition-all duration-300 ease-in-out cursor-pointer movie-card">
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
            <button class="close-button text-3xl font-bold text-white hover:text-gray-400 transition duration-200 ease-in-out">&times;</button>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold text-white my-3">Movie Synopsis</h3>
            <p class="text-white text-md mb-4 mt-2 px-2 leading-relaxed">
              ${description}
            </p>
          </div>
        
          <!-- Trailer (Embedded YouTube) -->
          <div class="w-full h-64 sm:h-96 overflow-hidden rounded-lg shadow-md">
            <iframe id="trailer-iframe-${
              show.id
            }" class="w-full h-full" src="" title="Movie Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        </div>
      </div>
      </div>
        `;

    // Add event listeners for the TV Show Card
    showsCard.querySelector(".movie-card").addEventListener("click", function () {
      toggleDetails(this, "movie");
    });

    showsCard.querySelector(".close-button").addEventListener("click", function (e) {
      e.stopPropagation(); // Prevents triggering the card click when pressing the close button
      toggleDetails(this.closest(".movie-card"), "movie");
    });

    // Function to toggle details visibility (show or hide)
    function toggleDetails(card, section) {
      const detailsSection = card.querySelector(`.${section}-details`);

      if (detailsSection.classList.contains("hidden")) {
        // Show the details section
        detailsSection.classList.remove("hidden");
      } else {
        // Hide the details section and stop the trailer from playing
        const iframe = detailsSection.querySelector("iframe");
        if (iframe) {
          iframe.src = ""; // Reset the iframe src to stop the trailer
        }
        detailsSection.classList.add("hidden");
      }
    }

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

document.getElementById("recent").addEventListener("click", 
  function loadLatestShows(){
    document.getElementById("recent").classList.add("text-[#f6101f]");
    document.getElementById("premeiers").classList.remove("text-[#f6101f]");
    document.getElementById("popular").classList.remove("text-[#f6101f]");


    displayLatestShows();
  }
);
 let genreId;
document.getElementById("movies-tab").addEventListener("click", 
  // Function to load movies
  function loadMovies() {
    // Make "Movies" tab active and "TV Shows" tab inactive
    document.getElementById("movies-tab").classList.add("text-[#f6101f]");
    document.getElementById("search-tab").classList.remove("text-[#f6101f]");
    document.getElementById("tvshows-tab").classList.remove("text-[#f6101f]");
    document.getElementById("search-container").classList.add("hidden");

    const searchContainer = document.getElementById("search-container");
    
    // Toggle visibility of the search container
    if (searchContainer.classList.contains("hidden")) {
      searchContainer.classList.add("hidden");
    } 

    document.getElementById("movie-genres").innerHTML = "";
    document.getElementById("movie-genres").innerHTML = `
    <div class="movie-genres flex overflow-x-auto scroll-smooth gap-4 no-scrollbar mx-8" id="genre-list">
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="28">Action</div>
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="12">Adventure</div>
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="16">Animation</div>
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="35">Comedy</div>
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="80">Crime</div>
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="99">Documentary</div>
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="18">Drama</div>
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="10751">Family</div>
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="14">Fantasy</div>
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="36">History</div>
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="27">Horror</div>
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="10402">Music</div>
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="9648">mystery</div>
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="10749">Romance</div>
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="10770">Tv-Movie</div>
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="10752">War</div>
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="53">Thriller</div>
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="37">Western</div>
        </div>

        <button id="prev-genre"
          class="absolute -left-14 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-md ml-2 z-10">
          Prev
        </button>
        <button id="next-genre"
          class="absolute -right-14 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-md mr-2 z-10">
          Next
        </button>

    `;
    // Get all genre elements and add event listeners
  const genreElements = document.querySelectorAll(".genre");
  genreElements.forEach((genreElement) => {
    genreElement.addEventListener("click", function () {
      genreId = this.getAttribute("data-genre-id"); // Store the selected genreId
      getMoviesByGenre(genreId, 1); // Fetch the first page of the selected genre
    });
  });
});

document.getElementById("tvshows-tab").addEventListener("click", 
  // Function to load TV shows
  function loadTvShows() {
    // Make "TV Shows" tab active and "Movies" tab inactive
    document.getElementById("tvshows-tab").classList.add("text-[#f6101f]");
    document.getElementById("search-tab").classList.remove("text-[#f6101f]");
    document.getElementById("movies-tab").classList.remove("text-[#f6101f]");
    document.getElementById("alert").classList.add("hidden");

    // Toggle visibility of the search container
    if (searchContainer.classList.contains("hidden")) {
      searchContainer.classList.add("hidden");
    } 

  
    document.getElementById("movie-genres").innerHTML = "";
    document.getElementById("movie-genres").innerHTML = `
    <div class="movie-genres flex overflow-x-auto scroll-smooth gap-4 no-scrollbar mx-8" id="genre-list">
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="10759">Action-Adventure</div>
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="16">Animation</div>
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="35">Comedy</div>
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="80">Crime</div>
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="99">Documentary</div>
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="18">Drama</div>
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="10751">Family</div>
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="10762">Kids</div>
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="9648">Mystery</div>
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="10764">Reality</div>
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="10765">Sci-Fi & Fantasy</div>
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="10766">Soap</div>
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="10767">Talk</div>
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="10768">War & Politics</div>
          <div
            class="genre bg-[#f6101f] w-[140px] h-[49px] text-white text-center font-bold flex justify-center items-center rounded-2xl mx-2 py-1 px-3 my-2 cursor-pointer" data-genre-id="37">Western</div>
        </div>

        <button id="prev-genre"
          class="absolute -left-10 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-md ml-2 z-10">
          Prev
        </button>
        <button id="next-genre"
          class="absolute -right-14 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-md mr-2 z-10">
          Next
        </button>

    `;
     // Get all genre elements and add event listeners
    const genreElements = document.querySelectorAll(".genre");
    genreElements.forEach((genreElement) => {
      genreElement.addEventListener("click", function () {
        genreId = this.getAttribute("data-genre-id");
        getTvShowByGenre(genreId);
      });
    });
  }
);

document.getElementById("search-tab").addEventListener("click", 
  function toggleSearch() {
    const searchContainer = document.getElementById("search-container");
    
    // Toggle visibility of the search container
    if (searchContainer.classList.contains("hidden")) {
      searchContainer.classList.remove("hidden");
    } else {
      searchContainer.classList.add("hidden");
    }

    // Make the search tab active and the others inactive
    document.getElementById("search-tab").classList.add("text-[#f6101f]");
    document.getElementById("movies-tab").classList.remove("text-[#f6101f]");
    document.getElementById("tvshows-tab").classList.remove("text-[#f6101f]");
  }
);

document.getElementById("search-button").addEventListener("click", 
  async function performSearch(event){
    event.preventDefault();
    const query = document.getElementById("search-input").value;
    
    // Make sure the search query is not empty
    if (query.trim() === "") {
      document.getElementById("alert").classList.remove("hidden");
      document.getElementById("alert").innerHTML = 
      `
      <p class="font-semibold">Please enter a search term.</p>
      `;
      return;
    }else{
      document.getElementById("alert").classList.add("hidden");
    }

    const movieContainer = document.getElementById("movie-container");
    document.getElementById("movie-genres").innerHTML = "";
    document.getElementById("movie-genres").innerHTML = `
      <p class="font-semibold text-xl">The results for "${query}"
    `;
    movieContainer.innerHTML = ""; // Clear existing cards

    const complexSearchURL = baseURL +  `search/multi?query=${query}&include_adult=false&language=en-US&page=1`

    try {
      const apiKey = import.meta.env.VITE_THE_MOVIE_DATABASE_READ_ACCESS_TOKEN;
      const complexSearchResponse = await fetch(complexSearchURL, {
        headers: {
          // "Authorization": `token ${process.env.THE_MOVIE_DATABASE_API}`,
          Authorization: `bearer ${apiKey}`,
          accept: `application/json`,
        },
      });
      
      // console.log(`status Code: ${complexSearchResponse.status}`);
      const complexSearchResponseData =
        await complexSearchResponse.json();
      console.log(complexSearchResponseData);

      let searchResultsData = complexSearchResponseData.results;

      searchResultsData.forEach((entity) => {
        let entityType= entity.media_type;
        // console.log(entityType);

        if(entityType === "movie"){
          // posterURL Placement
        let entityPosterURL = posterImgsURL + entity.poster_path;

        // rating placement
        const entityRating = entity.popularity;

        // genres placement
        const releaseDate = entity.release_date;

        // title placement
        let entityTitle = entity.original_title;
        if (entityTitle === undefined) {
          entityTitle = entity.original_name;
        }
      
        // description placement
        const entityDescription = entity.overview;

          // Create element to add the movie/show card
        let showsCard = document.createElement("div");
        showsCard.className += "carousel-item w-full sm:w-1/2 lg:w-1/4 p-4";

        showsCard.innerHTML = `
        <div class="min-w-[200px] bg-[#0e151d] shadow-lg rounded-lg transition-all duration-300 ease-in-out cursor-pointer movie-card">
          <img src="${entityPosterURL}" alt="Movie Poster" class="w-full h-48 object-cover">
          <div class="p-4">
            <h2 class="text-xl font-semibold line-clamp-1">${entityTitle}</h2>
            <p id="showType" class="text-sm">${releaseDate}</p>
            <p id="showType" class="text-sm">${entityType}</p>
            <div class="text-yellow-400">⭐ ${Math.floor(entityRating)}M</div>
          </div>
          <!-- Movie Details Section (Hidden by Default) -->
          <div class="movie-details hidden fixed inset-0 bg-[#0e151d] bg-opacity-90 p-6 z-50 overflow-y-auto flex justify-center items-center">
            <div class="max-w-4xl w-full bg-[#1c2733] rounded-lg shadow-lg p-6">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-2xl font-semibold text-white">${entityTitle}</h3>
                <!-- Close Button -->
                <button class="close-button text-3xl font-bold text-white hover:text-gray-400 transition duration-200 ease-in-out" >&times;</button>
              </div>

              <div class="mb-6">
                <h3 class="text-lg font-semibold text-white my-3">Movie Synopsis</h3>
                <p class="text-white text-md mb-4 mt-2 px-2 leading-relaxed">
                  ${entityDescription}
                </p>
              </div>
            
              <!-- Trailer (Embedded YouTube) -->
              <div class="w-full h-64 sm:h-96 overflow-hidden rounded-lg shadow-md">
                <iframe id="trailer-iframe-${
                  entity.id
                }" class="w-full h-full" src="" title="Movie Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
            </div>
          </div>

        </div>
          `;

    // Add event listeners for the TV Show Card
    showsCard.querySelector(".movie-card").addEventListener("click", function () {
      toggleDetails(this, "movie");
    });

    showsCard.querySelector(".close-button").addEventListener("click", function (e) {
      e.stopPropagation(); // Prevents triggering the card click when pressing the close button
      toggleDetails(this.closest(".movie-card"), "movie");
    });

    // Function to toggle details visibility (show or hide)
    function toggleDetails(card, section) {
      const detailsSection = card.querySelector(`.${section}-details`);

      if (detailsSection.classList.contains("hidden")) {
        // Show the details section
        detailsSection.classList.remove("hidden");
      } else {
        // Hide the details section and stop the trailer from playing
        const iframe = detailsSection.querySelector("iframe");
        if (iframe) {
          iframe.src = ""; // Reset the iframe src to stop the trailer
        }
        detailsSection.classList.add("hidden");
      }
    }

        movieContainer.appendChild(showsCard);
        }

        if (entityType === "tv"){
        // posterURL Placement
        let tvShowPosterURL = posterImgsURL + entity.poster_path;
        // console.log(tvShowPosterURL);

        // rating placement
        const tvShowRating = entity.popularity;
        // console.log(tvShowRating);

        // genres placement
        const releaseDate = entity.first_air_date;
        // console.log(releaseDate);

        // title placement
        let tvShowTitle = entity.original_title;
        if (tvShowTitle === undefined) {
          tvShowTitle = entity.original_name;
        }
        // console.log(tvShowTitle);

        // description placement
        const tvShowDescription = entity.overview;
        // console.log(tvShowDescription);

        // console.log(entity.id);

        // Create element to add the movie/show card
        let showsCard = document.createElement("div");
        showsCard.className += "carousel-item w-full sm:w-1/2 lg:w-1/4 p-4";

        showsCard.innerHTML = `
        <div class="min-w-[200px] bg-[#0e151d] shadow-lg rounded-lg transition-all duration-300 ease-in-out cursor-pointer movie-card">
          <img src="${tvShowPosterURL}" alt="Movie Poster" class="w-full h-48 object-cover">
          <div class="p-4">
            <h2 class="text-xl font-semibold line-clamp-1">${tvShowTitle}</h2>
            <p id="showType" class="text-sm">${releaseDate}</p>
            <p id="showType" class="text-sm">${entityType}</p>
            <div class="text-yellow-400">⭐ ${Math.floor(tvShowRating)}M</div>
          </div>
          <!-- Movie Details Section (Hidden by Default) -->
          <div class="movie-details hidden fixed inset-0 bg-[#0e151d] bg-opacity-90 p-6 z-50 overflow-y-auto flex justify-center items-center">
            <div class="max-w-4xl w-full bg-[#1c2733] rounded-lg shadow-lg p-6">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-2xl font-semibold text-white">${tvShowTitle}</h3>
                <!-- Close Button -->
                <button class="close-button text-3xl font-bold text-white hover:text-gray-400 transition duration-200 ease-in-out" >&times;</button>
              </div>

              <div class="mb-6">
                <h3 class="text-lg font-semibold text-white my-3">Tv Show Synopsis</h3>
                <p class="text-white text-md mb-4 mt-2 px-2 leading-relaxed">
                  ${tvShowDescription}
                </p>
              </div>
            
              <!-- Trailer (Embedded YouTube) -->
              <div class="w-full h-64 sm:h-96 overflow-hidden rounded-lg shadow-md">
                <iframe id="trailer-iframe-${
                  entity.id
                }" class="w-full h-full" src="" title="Movie Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
            </div>
          </div>

        </div>
          `; 
      
          // Add event listeners for the TV Show Card
          showsCard.querySelector(".movie-card").addEventListener("click", function () {
            toggleDetails(this, "movie");
          });
      
          showsCard.querySelector(".close-button").addEventListener("click", function (e) {
            e.stopPropagation(); // Prevents triggering the card click when pressing the close button
            toggleDetails(this.closest(".movie-card"), "movie");
          });
      
          // Function to toggle details visibility (show or hide)
          function toggleDetails(card, section) {
            const detailsSection = card.querySelector(`.${section}-details`);
      
            if (detailsSection.classList.contains("hidden")) {
              // Show the details section
              detailsSection.classList.remove("hidden");
            } else {
              // Hide the details section and stop the trailer from playing
              const iframe = detailsSection.querySelector("iframe");
              if (iframe) {
                iframe.src = ""; // Reset the iframe src to stop the trailer
              }
              detailsSection.classList.add("hidden");
            }
          }
      
          movieContainer.appendChild(showsCard); 
        }
        
        if (entityType === "person"){
          // console.log(entity);
            // posterURL Placement
          let personPosterURL = posterImgsURL + entity.profile_path;
          // console.log(personPosterURL);
    
          // rating placement
          const personRating = entity.popularity;
          // console.log(personRating);
    
          // name of person
          const personName = entity.name;
          // console.log(personName);

          let personGender;
          if (entity.gender === 2){
            personGender = "Male";
          } else{
            personGender = "Female";
          }
    
          // career of person
          const personCareer = entity.known_for_department;
          // console.log(personCareer);
    
          // Create element to add the movie/show card
          let showsCard = document.createElement("div");
          showsCard.className += "carousel-item w-full sm:w-1/2 lg:w-1/4 p-4";
    
          showsCard.innerHTML = `
          <div class="min-w-[200px] bg-[#0e151d] shadow-lg rounded-lg transition-all duration-300 ease-in-out cursor-pointer movie-card">
            <img src="${personPosterURL}" alt="Movie Poster" class="w-full h-48 object-cover">
            <div class="p-4">
              <h2 class="text-xl font-semibold line-clamp-1">${personName}</h2>
              <p id="showType" class="text-sm">Career: ${personCareer}</p>
              <p id="showType" class="text-sm">Gender: ${personGender}</p>
              <div class="text-yellow-400">⭐ ${Math.floor(personRating)}M</div>
            </div>
            <!-- Production Details Section (Hidden by Default) -->
            <div class="movie-details hidden fixed inset-0 bg-[#0e151d] bg-opacity-90 p-6 z-50 overflow-y-auto flex justify-center items-center">
              <div class="max-w-11/12 w-full bg-[#1c2733] rounded-lg shadow-lg p-6">
                <div class="flex justify-between items-center mb-6">
                  <h3 class="text-2xl font-semibold text-white">${personName}</h3>
                  <!-- Close Button -->
                  <button class="close-button text-3xl font-bold text-white hover:text-gray-400 transition duration-200 ease-in-out" >&times;</button>
                </div>
                <div id="production-details" class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-2 p-4 mb-6 mx-center justify-items-center">
                </div>
              </div>
            </div>
          </div>
            `;
            // Add event listeners for the TV Show Card
            showsCard.querySelector(".movie-card").addEventListener("click", function () {
              toggleDetails(this, "movie");
            });
        
            showsCard.querySelector(".close-button").addEventListener("click", function (e) {
              e.stopPropagation(); // Prevents triggering the card click when pressing the close button
              toggleDetails(this.closest(".movie-card"), "movie");
            });
        
            // Function to toggle details visibility (show or hide)
            function toggleDetails(card, section) {
              const detailsSection = card.querySelector(`.${section}-details`);
        
              if (detailsSection.classList.contains("hidden")) {
                // Show the details section
                detailsSection.classList.remove("hidden");
              } else {
                // Hide the details section and stop the trailer from playing
                const iframe = detailsSection.querySelector("iframe");
                if (iframe) {
                  iframe.src = ""; // Reset the iframe src to stop the trailer
                }
                detailsSection.classList.add("hidden");
              }
            }
        
          movieContainer.appendChild(showsCard); 
          
          const productionsMade = entity.known_for;
          productionsMade.forEach((production) => {
            // media type
            let mediaType = production.media_type;
            // console.log(mediaType);
    
              // posterURL Placement
          let productionPosterURL = posterImgsURL + production.poster_path;
          // console.log(productionPosterURL);
    
          // rating placement
          const productionRating = production.popularity;
          // console.log(productionRating);
    
          // genres placement
          const releaseDate = production.release_date;
          // console.log(releaseDate);
    
          // title placement
          let productionTitle = production.original_title;
          if (productionTitle === undefined) {
            productionTitle = production.original_name;
          }
          // console.log(productionTitle);
    
        
          // description placement
          const productionDescription = production.overview;
          // console.log(productionDescription);
    
          // console.log(entity.id);  
          
          let productionContainer = document.getElementById("production-details");
          productionTitle = document.createElement("div");
          productionTitle.className += "min-w-[200px] bg-[#0e151d] shadow-lg rounded-lg transition-all duration-300 ease-in-out cursor-pointer";
          productionTitle.innerHTML = 
          `
              <img src="${productionPosterURL}" alt="Movie Poster" class="w-full h-48 object-cover">
              <div class="p-4">
                <h2 class="text-xl font-semibold line-clamp-1">${production.original_title}</h2>
                <p id="showType" class="text-sm">${mediaType}</p>
                <div class="text-yellow-400">⭐ ${Math.floor(productionRating)}M</div>
              </div>
          `;
          productionContainer.append(productionTitle);
          })
          }
      });
    }catch(error){
      console.log(error.message);
    }
  }
);

let currentPage = 1; // To keep track of the current page
const totalPages = 500; // You can dynamically update this based on the API response

// Fetch movies by genre and page
async function getMoviesByGenre(genreID, page = 1) {
  let movieBasedOnGenreURL = `${baseURL}discover/movie?include_adult=false&include_video=true&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=${genreID}`;

  try {
    const apiKey = import.meta.env.VITE_THE_MOVIE_DATABASE_READ_ACCESS_TOKEN;
    const movieBasedOnGenreResponse = await fetch(movieBasedOnGenreURL, {
      headers: {
        Authorization: `bearer ${apiKey}`,
        accept: `application/json`,
      },
    });

    const movieBasedOnGenreResponseData = await movieBasedOnGenreResponse.json();
    let displayMovieData = movieBasedOnGenreResponseData;

    // Update current page in the UI
    currentPage = movieBasedOnGenreResponseData.page;
    document.getElementById('current-page').innerText = `Page ${currentPage}`;

    document.getElementById('prev-page-btn').disabled = currentPage === 1;
    document.getElementById('next-page-btn').disabled = currentPage >= movieBasedOnGenreResponseData.total_pages;
    document.getElementById("next-page-btn").addEventListener("click", () => {
      if (currentPage < totalPages) {
        movieBasedOnGenreURL = `${baseURL}discover/movie?include_adult=false&include_video=true&language=en-US&page=${currentPage += 1}&sort_by=popularity.desc&with_genres=${genreID}`;
      }
    });
  
    // Handle Previous Page Button Click
    document.getElementById("prev-page-btn").addEventListener("click", () => {
      if (currentPage > 1) {
        movieBasedOnGenreURL = `${baseURL}discover/movie?include_adult=false&include_video=true&language=en-US&page=${currentPage -= 1}&sort_by=popularity.desc&with_genres=${genreID}`;
      }
    });

    // Clear the container
    const movieContainer = document.getElementById("movie-container");
    movieContainer.innerHTML = ""; // Clear existing cards
    setMovieTrailers(displayMovieData.results);

    // Loop through the results and create movie cards (same as before)
    displayMovieData.results.forEach((movie) => {
      let moviePosterURL = posterImgsURL + movie.poster_path;
      let movieTitle = movie.original_title || movie.original_name;
      const movieRating = movie.popularity;
      const releaseDate = movie.release_date;
      const movieDescription = movie.overview;

      // Create the movie card
      let showsCard = document.createElement("div");
      showsCard.className += "carousel-item w-full sm:w-1/2 lg:w-1/4 p-4";

      showsCard.innerHTML = `
        <div class="min-w-[200px] bg-[#0e151d] shadow-lg rounded-lg transition-all duration-300 ease-in-out cursor-pointer movie-card">
          <img src="${moviePosterURL}" alt="Movie Poster" class="w-full h-48 object-cover">
          <div class="p-4">
            <h2 class="text-xl font-semibold line-clamp-1">${movieTitle}</h2>
            <p id="showType" class="text-sm">${releaseDate}</p>
            <div class="text-yellow-400">⭐ ${Math.floor(movieRating)}M</div>
          </div>
          <div class="movie-details hidden fixed inset-0 bg-[#0e151d] bg-opacity-90 p-6 z-50 overflow-y-auto flex justify-center items-center">
            <div class="max-w-4xl w-full bg-[#1c2733] rounded-lg shadow-lg p-6">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-2xl font-semibold text-white">${movieTitle}</h3>
                <button class="close-button text-3xl font-bold text-white hover:text-gray-400 transition duration-200 ease-in-out">&times;</button>
              </div>
              <div class="mb-6">
                <h3 class="text-lg font-semibold text-white my-3">Movie Synopsis</h3>
                <p class="text-white text-md mb-4 mt-2 px-2 leading-relaxed">${movieDescription}</p>
              </div>
              <div class="w-full h-64 sm:h-96 overflow-hidden rounded-lg shadow-md">
                <iframe id="trailer-iframe-${movie.id}" class="w-full h-full" title="Movie Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
            </div>
          </div>
        </div>
      `;

      // Add event listeners for opening/closing movie details (same as before)
      showsCard.querySelector(".movie-card").addEventListener("click", function () {
        toggleDetails(this, "movie");
      });

      showsCard.querySelector(".close-button").addEventListener("click", function (e) {
        e.stopPropagation(); // Prevents triggering the card click when pressing the close button
        toggleDetails(this.closest(".movie-card"), "movie");
      });

      movieContainer.appendChild(showsCard);
    });
  } catch (error) {
    console.error(error.message);
  }
}

async function getTvShowByGenre(genreID=28, page=1) {
  const tvShowBasedOnGenreURL =
    baseURL + `discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genreID}`;
  try {
    const apiKey = import.meta.env.VITE_THE_MOVIE_DATABASE_READ_ACCESS_TOKEN;
    const tvShowBasedOnGenreResponse = await fetch(tvShowBasedOnGenreURL, {
      headers: {
        // "Authorization": `token ${process.env.THE_MOVIE_DATABASE_API}`,
        Authorization: `bearer ${apiKey}`,
        accept: `application/json`,
      },
    });
    // console.log(`status Code: ${movieBasedOnGenreResponse.status}`);
    const tvShowBasedOnGenreResponseData =
      await tvShowBasedOnGenreResponse.json();
    // console.log(movieBasedOnGenreResponseData);

    let displayTvShowData = tvShowBasedOnGenreResponseData;

     // Update current page in the UI
     currentPage = movieBasedOnGenreResponseData.page;
     document.getElementById('current-page').innerText = `Page ${currentPage}`;
 
     // Enable or disable the Previous button
     document.getElementById('prev-page-btn').disabled = currentPage === 1;
 
     // Enable or disable the Next button based on total pages
     document.getElementById('next-page-btn').disabled = currentPage >= movieBasedOnGenreResponseData.total_pages;
 
     

    // Clear previous movie cards before adding new ones
    const tvShowContainer = document.getElementById("movie-container");
    tvShowContainer.innerHTML = ""; // Clear existing cards
    setTvShowTrailers(displayTvShowData);

    displayTvShowData.results.forEach((tvShow) => {
      // posterURL Placement
      let tvShowPosterURL = posterImgsURL + tvShow.poster_path;
      // console.log(tvShowPosterURL);

      // rating placement
      const tvShowRating = tvShow.popularity;
      // console.log(tvShowRating);

      // genres placement
      const releaseDate = tvShow.first_air_date;
      // console.log(releaseDate);

      // title placement
      let tvShowTitle = tvShow.original_title;
      if (tvShowTitle === undefined) {
        tvShowTitle = tvShow.original_name;
      }
      // console.log(tvShowTitle);

      // description placement
      const tvShowDescription = tvShow.overview;
      // console.log(tvShowDescription);

      // console.log(tvShow.id);

      // Create element to add the movie/show card
      let showsCard = document.createElement("div");
      showsCard.className += "carousel-item w-full sm:w-1/2 lg:w-1/4 p-4";

      showsCard.innerHTML = `
      <div class="min-w-[200px] bg-[#0e151d] shadow-lg rounded-lg transition-all duration-300 ease-in-out cursor-pointer movie-card">
        <img src="${tvShowPosterURL}" alt="Movie Poster" class="w-full h-48 object-cover">
        <div class="p-4">
          <h2 class="text-xl font-semibold line-clamp-1">${tvShowTitle}</h2>
          <p id="showType" class="text-sm">${releaseDate}</p>
          <div class="text-yellow-400">⭐ ${Math.floor(tvShowRating)}M</div>
        </div>
        <!-- Movie Details Section (Hidden by Default) -->
        <div class="movie-details hidden fixed inset-0 bg-[#0e151d] bg-opacity-90 p-6 z-50 overflow-y-auto flex justify-center items-center">
          <div class="max-w-4xl w-full bg-[#1c2733] rounded-lg shadow-lg p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl font-semibold text-white">${tvShowTitle}</h3>
              <!-- Close Button -->
              <button class="close-button text-3xl font-bold text-white hover:text-gray-400 transition duration-200 ease-in-out">&times;</button>
            </div>

            <div class="mb-6">
              <h3 class="text-lg font-semibold text-white my-3">Tv Show Synopsis</h3>
              <p class="text-white text-md mb-4 mt-2 px-2 leading-relaxed">
                ${tvShowDescription}
              </p>
            </div>
          
            <!-- Trailer (Embedded YouTube) -->
            <div class="w-full h-64 sm:h-96 overflow-hidden rounded-lg shadow-md">
              <iframe id="trailer-iframe-${
                tvShow.id
              }" class="w-full h-full" title="Movie Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
          </div>
        </div>

      </div>
        `;

    // Add event listeners for the TV Show Card
    showsCard.querySelector(".movie-card").addEventListener("click", function () {
      toggleDetails(this, "movie");
    });

    showsCard.querySelector(".close-button").addEventListener("click", function (e) {
      e.stopPropagation(); // Prevents triggering the card click when pressing the close button
      toggleDetails(this.closest(".movie-card"), "movie");
    });

    // Function to toggle details visibility (show or hide)
    function toggleDetails(card, section) {
      const detailsSection = card.querySelector(`.${section}-details`);

      if (detailsSection.classList.contains("hidden")) {
        // Show the details section
        detailsSection.classList.remove("hidden");
      } else {
        // Hide the details section and stop the trailer from playing
        const iframe = detailsSection.querySelector("iframe");
        if (iframe) {
          iframe.src = ""; // Reset the iframe src to stop the trailer
        }
        detailsSection.classList.add("hidden");
      }
    }

        tvShowContainer.appendChild(showsCard);
    });
  } catch (error) {
    console.error(error.message);
  }



}
async function getMovieTrailerLink(movieID) {
  const showTrailerURL = baseURL + `/movie/${movieID}/videos`;
  const youTubeBaseURL = `https://www.youtube.com/embed/`;
  const apiKey = import.meta.env.VITE_THE_MOVIE_DATABASE_READ_ACCESS_TOKEN;

  try {
    const movieKeyResponse = await fetch(showTrailerURL, {
      headers: {
        Authorization: `bearer ${apiKey}`,
        accept: `application/json`,
      },
    });

    if (!movieKeyResponse.ok) {
      // console.error(`Failed to fetch trailer for movie ID: ${movieID}, Status: ${movieKeyResponse.status}`);
      return null;
    }

    const movieKeyResponseData = await movieKeyResponse.json();
    
    const trailerData = movieKeyResponseData.results;
    
    if (!trailerData || trailerData.length === 0) {
      // console.log(`No trailers available for movie ID: ${movieID}`);
      return null;
    }

    for (let entry of trailerData) {
      if (entry.size === 1080 && entry.official === true && entry.site === "YouTube") {
        return youTubeBaseURL + entry.key;
      }
    }

    return null;
  } catch (error) {
    // console.error(`Error fetching trailer for movie ID: ${movieID}: `, error);
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
        // console.log(trailerLink);
        // console.log("Added");
      }
    } else {
      // console.log(`No trailer found for movie ID: ${movie.id}`);
    }
  }
}

async function getTvShowTrailerLink(tvShowID) {
  const showTrailerURL = baseURL + `/tv/${tvShowID}/videos?language=en-US`;
  const youTubeBaseURL = `https://www.youtube.com/embed/`;
  const apiKey = import.meta.env.VITE_THE_MOVIE_DATABASE_READ_ACCESS_TOKEN;

  try {
    // Make the fetch request for TV show trailers
    const tvShowKeyResponse = await fetch(showTrailerURL, {
      headers: {
        Authorization: `bearer ${apiKey}`,
        accept: `application/json`,
      },
    });

    // Check if the response is successful
    if (!tvShowKeyResponse.ok) {
      console.error(`Failed to fetch trailer for TV show ID: ${tvShowID}, Status: ${tvShowKeyResponse.status}`);
      return null;
    }

    const tvShowKeyResponseData = await tvShowKeyResponse.json();

    // Check if the results are defined and not empty
    const trailerData = tvShowKeyResponseData.results;
    if (!trailerData || trailerData.length === 0) {
      console.log(`No trailers available for TV show ID: ${tvShowID}`);
      return null;
    }

    // Add filtering for official YouTube trailer with 1080p size
    for (let entry of trailerData) {
      if (entry.size === 1080 && entry.official === true && entry.site === "YouTube") {
        return youTubeBaseURL + entry.key;
      }
    }

    return null;

  } catch (error) {
    console.error(`Error fetching trailer for TV show ID: ${tvShowID}: `, error);
    return null;
  }
}

async function setTvShowTrailers(tvShows) {
  for (let index = 0; index < tvShows.length; index++) {
    const tvShow = tvShows[index];

    // Fetch the trailer link for this movie
    const trailerLink = await getTvShowTrailerLink(tvShow.id);

    // If a trailer link is found, assign it to the iframe of the corresponding movie card
    if (trailerLink) {
      const iframe = document.getElementById(`trailer-iframe-${tvShow.id}`);
      if (iframe) {
        iframe.src = trailerLink;
        // console.log("Added");
        console.log(trailerLink);
      }
    } else {
      console.log(`No trailer found for movie ID: ${movie.id}`);
    }
  }
}

// Add event listeners to each genre button
document.querySelectorAll(".genre").forEach((genreButton) => {
  genreButton.addEventListener("click", () => {
    const genreID = genreButton.getAttribute("onclick").match(/\d+/)[0]; // Extract genre ID from onclick attribute
    getMoviesByGenre(genreID);
  });
});

// Initial movie load
document.addEventListener("DOMContentLoaded", () => {
  displayMostTrendingShow();
  displayTrendingShows();
  getMoviesByGenre(28, 1);
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
  const genreList = document.getElementById("genre-list");
  const prevButtonGenre = document.getElementById("prev-genre");
  const nextButtonGenre = document.getElementById("next-genre");

  const scrollAmountGenre = 200; // Amount to scroll when the button is clicked

  // Scroll to the left when "Prev" is clicked
  prevButtonGenre.addEventListener("click", () => {
    genreList.scrollBy({
      left: -scrollAmountGenre,
      behavior: "smooth",
    });
  });

  // Scroll to the right when "Next" is clicked
  nextButtonGenre.addEventListener("click", () => {
    genreList.scrollBy({
      left: scrollAmountGenre,
      behavior: "smooth",
    });
  });

 });

 
(function () {
  emailjs.init("e3ZUBznRByF_3vBfw");
})();
function sendMail(event) {
  event.preventDefault(); 
  const templateParams = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      message: document.getElementById('message').value
  };

  emailjs.send("service_gsb7od3", "template_pesxnn3", templateParams)
      .then((response) => {
          // Show success message using SweetAlert2
          Swal.fire({
              title: 'Email Sent',
              text: 'Your email has been sent successfully!',
              icon: 'success',
          });
          // Clear the form fields
          document.getElementById('contactForm').reset()
      })
      .catch((error) => {
          // Show error message using SweetAlert2
          Swal.fire({
              title: 'Error',
              text: 'Failed to send email. Please try again later.',
              icon: 'error',
          });
          console.error('Failed to send email:', error);
      });
}

document.getElementById('contactForm'). addEventListener('submit', sendMail);

