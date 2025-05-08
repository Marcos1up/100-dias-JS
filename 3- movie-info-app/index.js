let movieNameRef = document.getElementById('movie');
let searchBtn = document.getElementById('search-btn');
let result = document.getElementById('result');

//funcion fetch a la API
let getMovie = () => {
  let movieName = movieNameRef.value;

  let url = `http://www.omdbapi.com/?t=${movieName}&apikey=${apiKey}`;

  if (movieName.length <= 0) {
    result.innerHTML = `<h3 class="msg">Buscar película...</h3>`;
  } else {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.Response === 'True') {
          result.innerHTML = `
                    <div class="info">
                        <img src=${data.Poster} class="poster">
                        <div>
                            <h2>${data.Title}</h2>
                            <div class="rating">
                                <img src="star.svg">
                                <h4>${data.imdbRating}</h4>
                            </div>
                            <div class="details">
                                <span>${data.Rated}</span>
                                <span>${data.Year}</span>
                                <span>${data.Runtime}</span>
                            </div>
                            <div class="genre">
                                <div>${data.Genre.split(',').join(
                                  '</div><div>'
                                )}</div>
                            </div>
                        </div>
                    </div>
                    <h3>Plot:</h3>
                    <p>${data.Plot}</p>
                    <h3>Cast:</h3>
                    <p>${data.Actors}</p>
                `;
        }

        //si la peli no existe
        else {
          result.innerHTML = `<h3 class="msg">${data.Error}</h3>`;
        }
      })
      //si hay un error
      .catch(() => {
        result.innerHTML = `<h3 class="msg">Ha ocurrido un error</h3>`;
      });
  }
};

searchBtn.addEventListener('click', getMovie);
window.addEventListener('load', getMovie);
