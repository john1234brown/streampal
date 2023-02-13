let Autohide = false;
var server = 1;
const timer = ms => new Promise(res => setTimeout(res, ms));
var imdbId;
var namee;
var Id;
var objlist = [];
var adServersList = [];
var AdServersInfo = {
  'id': null,
  'ep': null,
  'season': null,
}
var Bookmarks = [];
var BookmarksJson;

//Override Existing Window.alert function to combat popups and alerts!
window.alert = function(text) { console.log('tried to alert: ' + text); return true; };

//Register events in the onload to ensure elements are loaded!
window.onload = function() {
  document.getElementById('logobutton').addEventListener('click', test);
  document.getElementById('searchbox').addEventListener('change', updateSearchContainerbySearch);
  document.getElementById('bookmarkButton').addEventListener('mouseover', bookmarkHovered);
  document.getElementById('bookmarkButton').addEventListener('mouseout', bookmarkHovered);
  if (localStorage.getItem('bookmarks')) {
    BookmarksJson = JSON.parse(localStorage.getItem('bookmarks'));
  }
  //document.getElementById('').addEventListener()
  //document.getElementById('framez').addEventListener('change', sndbx);
  /*setInterval(function (){
      console.log('howdy');
      document.getElementById('framez').innerHTML = "<blank><blank>";
      document.getElementById('framez').textContent = '';
      var elem = document.getElementById('framez');
      elem.children = null;
      elem.textContent = null;
      elem.nodeValue = "";
  }, 1);*/
  /*
  window.addEventListener("message", receiveMessage, false);
  window.addEventListener("pageshow", receiveMessage, false);
  function receiveMessage(event) {
    // Use event.origin here like
    if(event.origin == "https://127.0.0.1:3000"){
    // code here to block/unblock access ... a method like the one in user1646111's post can be good.
    }
    else{
      event.preventDefault();
    // code here to block/unblock access ... a method like the one in user1646111's post can be good.
    }
  }*/
  tvshowinitstonerexample();
  tvshowinitexample();
  bookmarkInit();
  bookmarkUpdate();
  if (document.cookie.split('; ').find((row) => row.startsWith('name='))?.split('=')[1]) {
    namee = document.cookie.split('; ').find((row) => row.startsWith('name='))?.split('=')[1];
  }
  if (document.cookie.split('; ').find((row) => row.startsWith('server='))?.split('=')[1]) {
    server = parseInt(document.cookie.split('; ').find((row) => row.startsWith('server='))?.split('=')[1]);
    console.log('server value found loaded:', server);
    if (document.cookie.split('; ').find((row) => row.startsWith('watchId='))?.split('=')[1]) {
      if (document.cookie.split('; ').find((row) => row.startsWith('watchType='))?.split('=')[1]) {
        if (document.cookie.split('; ').find((row) => row.startsWith('watchType='))?.split('=')[1] === "movie") {
          updateMovieContainer();
        }
        if (document.cookie.split('; ').find((row) => row.startsWith('watchType='))?.split('=')[1] === "tv") {
          if (document.cookie.split('; ').find((row) => row.startsWith('season='))?.split('=')[1] && document.cookie.split('; ').find((row) => row.startsWith('episode='))?.split('=')[1]) {
            updateTvContainer(document.cookie.split('; ').find((row) => row.startsWith('watchType='))?.split('=')[1], document.cookie.split('; ').find((row) => row.startsWith('='))?.split('=')[1]);
          }
        }
      }
    }
  }
}
//updateTvContainer();

function updatewatchIdAndEtc(id, type, name) {
  const d = new Date();
  d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000));
  var kia = "expires=" + d.toUTCString();
  document.cookie = "watchId=" + id + "; SameSite=strict; Secure; " + kia;
  Id = id;
  document.cookie = "watchType=" + type + "; SameSite=strict; Secure; " + kia;
  document.cookie = "name=" + name + "; SameSite=strict; Secure; " + kia;
  namee = name;
  /*
  * Memory Note Please don't forget to add a updateExternalId
  */
  document.cookie

}

function bookmarkInit() {
  if (localStorage.getItem('bookmarks')) {
    var id = document.cookie.split('; ').find((row) => row.startsWith('watchId='))?.split('=')[1];
    if (id) {
      var jsons = JSON.parse(localStorage.getItem('bookmarks'));
      if (jsons.find(tree => tree.id === id)) {
        //console.log('found it!');
        document.getElementById("bookmarkButton").setAttribute('src', 'assets/bookmarkfilled.png');
      } else {
        document.getElementById("bookmarkButton").setAttribute('src', 'assets/bookmark.png');
      }
    }
  }
}

function bookmarkUpdate() {
  if (localStorage.getItem('bookmarks')) {
    var bookmarksJson = JSON.parse(localStorage.getItem('bookmarks'));
    document.getElementById("bookmarklist").innerHTML = "";
    for (json1 of bookmarksJson) {
      switch (json1.type) {
        case "movie":
          fetch(`https://api.themoviedb.org/3/movie/${json1.id}?language=en-US`, {
            method: 'GET',
            headers: {
              'authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTljY2JkNDViNmY1MTJjN2E0YWZmMzA5MjIxZDgyOCIsInN1YiI6IjYzZDBhM2M3NjZhZTRkMDA5ZTlkZjY4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N5j1M7YnwmMTjIWMdYQbdh5suW2hCDucbqlDgMku_UA',
              'content-type': 'application/json;charset=utf-8'
            }
          }).then((response) => response.json())
            .then((json) => {
              var overview;
              if (json.overview) {
                overview = json.overview.substring(0, 200);
              } else {
                overview = "";
              }
              const newelement = document.createElement("li");
              newelement.innerHTML = `<figure class="card__thumbnail"></figure> \
                    <h3 class="card-title">${json.title}</h3> \
                    <div class="card-content"> \
                      <h3>Description</h3> \
                      <p>${overview}</p> \
                    </div> \
                    <div class="card-link-wrapper"> \
                      <p class="card-link">${json.release_date.split("-")[0]}</p> \
                    </div>`
              newelement.setAttribute("style", `background:url('https://image.tmdb.org/t/p/original${json.poster_path}'); background-repeat: no-repeat; background-size: cover; background-position: center;`);
              newelement.setAttribute("id", json.id);
              newelement.setAttribute("class", "card");
              newelement.setAttribute("onclick", `cardclicked(${json.id}, "${json.title}", "movie");`);
              document.getElementById("bookmarklist").appendChild(newelement);
            }).catch(e => {
              console.log(e);
            });


        case "tv":
          fetch(`https://api.themoviedb.org/3/tv/${json1.id}?language=en-US`, {
            method: 'GET',
            headers: {
              'authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTljY2JkNDViNmY1MTJjN2E0YWZmMzA5MjIxZDgyOCIsInN1YiI6IjYzZDBhM2M3NjZhZTRkMDA5ZTlkZjY4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N5j1M7YnwmMTjIWMdYQbdh5suW2hCDucbqlDgMku_UA',
              'content-type': 'application/json;charset=utf-8'
            }
          }).then((response) => response.json())
            .then((json) => {
              //console.log(data);
              //console.log(json.media_type);
              var overview;
              if (json.overview) {
                overview = json.overview.substring(0, 200);
              } else {
                overview = "";
              }
              const newelement = document.createElement("li");
              newelement.innerHTML = `<figure class="card__thumbnail"></figure> \
                    <h3 class="card-title">${json.name}</h3> \
                    <div class="card-content"> \
                      <h3>Description</h3> \
                      <p>${overview}</p> \
                    </div> \
                    <div class="card-link-wrapper"> \
                      <p class="card-link">${json.first_air_date.split("-")[0]}</p> \
                    </div>`
              newelement.setAttribute("style", `background:url('https://image.tmdb.org/t/p/original${json.poster_path}'); background-repeat: no-repeat; background-size: cover; background-position: center;`);
              newelement.setAttribute("id", json.id);
              newelement.setAttribute("class", "card");
              newelement.setAttribute("onclick", `cardclicked(${json.id}, "${json.name}", "tv");`);
              document.getElementById("bookmarklist").appendChild(newelement);
            }).catch(e => {
              console.log(e);
            });


      }
    }
  }
}

function bookmarkCard(OGObj) {
  if (localStorage.getItem('bookmarks')) {
    console.log("bookmarks Found!");
    var id = document.getElementById(OGObj.id).getAttribute('data-id');
    var type = document.getElementById(OGObj.id).getAttribute('data-type');
    console.log(id);
    console.log(type);
    if (id) {
      var bookmarksJson2 = JSON.parse(localStorage.getItem('bookmarks'));
      //console.log(bookmarks);
      var obj = {
        'id': id,
        'type': type
      }
      //console.log('url', document.getElementById(id).getAttribute('style').split("'")[1].split("'")[0]);
      if (bookmarksJson2.find(tree => parseInt(tree.id) === parseInt(id))) {
        console.log('Found it!');
        bookmarksJson2 = bookmarksJson2.filter(x => parseInt(x.id) !== parseInt(id));
        OGObj.src = "assets/bookmark.png";
        document.getElementById(OGObj.id).setAttribute('src', 'assets/bookmarkfilled.png');
      } else {
        console.log("Boookmarking IT!");
        OGObj.src = "assets/bookmarkfilled.png";
        document.getElementById(OGObj.id).setAttribute('src', 'assets/bookmark.png');
        bookmarksJson2.push(obj);
      }
      /*var book = {
          "bookmarks": JSON.stringify(Bo)
      }*/
      localStorage.setItem('bookmarks', JSON.stringify(bookmarksJson2));
      bookmarkUpdate();
      return;
    }
  } else {
    console.log("Not Found No Bookmarks Executed!");
    var id = document.getElementById(OGObj.id).getAttribute('data-id');
    var type = document.getElementById(OGObj.id).getAttribute('data-type');
    if (id) {
      var obj = {
        'id': id,
        'type': type
      }
      Bookmarks.push(obj);
      document.getElementById(OGObj.id).setAttribute('src', 'assets/bookmarkfilled.png');
      /*var book = {
          "bookmarks": JSON.stringify(Bookmarks)
      }*/
      localStorage.setItem('bookmarks', JSON.stringify(Bookmarks));
      bookmarkUpdate();
      return;
    }
  }
}

function bookmark() {
  //console.log('Bookmark Clicked!');
  if (localStorage.getItem('bookmarks')) {
    console.log("bookmarks Found!");
    var id = document.cookie.split('; ').find((row) => row.startsWith('watchId='))?.split('=')[1];
    var type = document.cookie.split('; ').find((row) => row.startsWith('watchType='))?.split('=')[1];
    if (id) {
      var bookmarksJson = JSON.parse(localStorage.getItem('bookmarks'));
      //console.log(bookmarks);
      var obj = {
        'id': id,
        'type': type
      }
      //console.log('url', document.getElementById(id).getAttribute('style').split("'")[1].split("'")[0]);
      if (bookmarksJson.find(tree => tree.id === id)) {
        //console.log('Found it!');
        bookmarksJson = bookmarksJson.filter(x => x.id !== id);
        document.getElementById("bookmarkButton").setAttribute('src', 'assets/bookmarkfilled.png');
      } else {
        document.getElementById("bookmarkButton").setAttribute('src', 'assets/bookmark.png');
        bookmarksJson.push(obj);
      }
      /*var book = {
          "bookmarks": JSON.stringify(Bo)
      }*/
      localStorage.setItem('bookmarks', JSON.stringify(bookmarksJson));
      bookmarkUpdate();
      return;
    }
  } else {
    console.log("Not Found No Bookmarks Executed!");
    var id = document.cookie.split('; ').find((row) => row.startsWith('watchId='))?.split('=')[1];
    var type = document.cookie.split('; ').find((row) => row.startsWith('watchType='))?.split('=')[1];
    if (id) {
      var obj = {
        'id': id,
        'type': type
      }
      Bookmarks.push(obj);
      document.getElementById("bookmarkButton").setAttribute('src', 'assets/bookmarkfilled.png');
      /*var book = {
          "bookmarks": JSON.stringify(Bookmarks)
      }*/
      localStorage.setItem('bookmarks', JSON.stringify(Bookmarks));
      bookmarkUpdate();
      return;
    }
  }
}

function bookmarkHovered() {
  var src = document.getElementById("bookmarkButton").getAttribute('src');
  if (src === "assets/bookmarkfilled.png") {
    document.getElementById("bookmarkButton").setAttribute('src', 'assets/bookmark.png');
  } else {
    document.getElementById("bookmarkButton").setAttribute('src', 'assets/bookmarkfilled.png');
  }
}

function bookmarkCardHovered(obj) {
  //var src = document.getElementById("bookmarkButton").getAttribute('src');
  if (obj.src.split('assets/')[1] === "bookmarkfilled.png") {
    console.log(obj.src.split('assets/')[1]);
    document.getElementById(obj.id).setAttribute('src', 'assets/bookmark.png');
  } else {
    document.getElementById(obj.id).setAttribute('src', 'assets/bookmarkfilled.png');
  }
}

function updatewatchType(type) {
  const d = new Date();
  d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000));
  var kia = "expires=" + d.toUTCString();
  document.cookie = "watchType=" + type + "; SameSite=strict; Secure; " + kia;
}

function updateSearchContainerbyPage(n) {
  var result = document.getElementById('searchbox').value;
  //console.log(result2);
  //console.log(result);
  if (result) {
    var query = encodeURIComponent(encodeURI(result.replaceAll(' ', '-')).toString()).toString();
    console.log(query);
    fetch(`https://api.themoviedb.org/3/search/multi?query=${query}&language=en-US&page=${parseInt(n)}&append_to_response=external_ids`, {
      method: 'GET',
      headers: {
        'authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTljY2JkNDViNmY1MTJjN2E0YWZmMzA5MjIxZDgyOCIsInN1YiI6IjYzZDBhM2M3NjZhZTRkMDA5ZTlkZjY4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N5j1M7YnwmMTjIWMdYQbdh5suW2hCDucbqlDgMku_UA',
        'content-type': 'application/json;charset=utf-8'
      }
    }).then((response) => response.json())
      .then((data) => {
        //console.log(data);
        document.getElementById("searchlist").innerHTML = "";
        for (var json of data.results) {
          if (json.media_type !== "person") {
            //console.log(json.media_type);
            var overview;
            if (json.overview) {
              overview = json.overview.substring(0, 200);
            } else {
              overview = "";
            }

            if (json.media_type === "movie") {
              const newelement = document.createElement("li");
              var bookmarksrc = "assets/bookmark.png";
              if (localStorage.getItem('bookmarks')) {
                if (JSON.parse(localStorage.getItem('bookmarks')).find(tree => parseInt(tree.id) === parseInt(json.id))) {
                  bookmarksrc = "assets/bookmarkfilled.png";
                  console.log('FOUND BOOOKMARK');
                }
              }
              newelement.innerHTML = `<figure class="card__thumbnail"><img id="bookmarkButton-4-${json.id}" onmouseenter="bookmarkCardHovered(this)" onmouseleave="bookmarkCardHovered(this)" data="bookmarkButton" data-id=${json.id} data-type="movie" onclick="event.stopPropagation();bookmarkCard(this)" src="${bookmarksrc}"></figure> \
                    <h3 class="card-title">${json.title}</h3> \
                    <div class="card-content"> \
                      <h3>Description</h3> \
                      <p>${overview}</p> \
                    </div> \
                    <div class="card-link-wrapper"> \
                      <p class="card-link">${json.release_date.split("-")[0]}</p> \
                    </div>`
              newelement.setAttribute("style", `background:url('https://image.tmdb.org/t/p/original${json.poster_path}'); background-repeat: no-repeat; background-size: cover; background-position: center;`);
              newelement.setAttribute("id", json.id);
              newelement.setAttribute("class", "card");
              newelement.setAttribute("onclick", `cardclicked(${json.id}, "${json.title}", "${json.media_type}");`);
              document.getElementById("searchlist").appendChild(newelement);
            }

            if (json.media_type === "tv") {
              const newelement = document.createElement("li");
              var bookmarksrc = "assets/bookmark.png";
              if (localStorage.getItem('bookmarks')) {
                if (JSON.parse(localStorage.getItem('bookmarks')).find(tree => parseInt(tree.id) === parseInt(json.id))) {
                  bookmarksrc = "assets/bookmarkfilled.png";
                  console.log('FOUND BOOOKMARK');
                }
              }
              newelement.innerHTML = `<figure class="card__thumbnail"><img id="bookmarkButton-5-${json.id}" onmouseenter="bookmarkCardHovered(this)" onmouseleave="bookmarkCardHovered(this)" data="bookmarkButton" data-id=${json.id} data-type="tv" onclick="event.stopPropagation();bookmarkCard(this)" src="${bookmarksrc}"></figure> \
                    <h3 class="card-title">${json.name}</h3> \
                    <div class="card-content"> \
                      <h3>Description</h3> \
                      <p>${overview}</p> \
                    </div> \
                    <div class="card-link-wrapper"> \
                      <p class="card-link">${json.first_air_date.split("-")[0]}</p> \
                    </div>`
              newelement.setAttribute("style", `background:url('https://image.tmdb.org/t/p/original${json.poster_path}'); background-repeat: no-repeat; background-size: cover; background-position: center;`);
              newelement.setAttribute("id", json.id);
              newelement.setAttribute("class", "card");
              newelement.setAttribute("onclick", `cardclicked(${json.id}, "${json.name}", "${json.media_type}");`);
              document.getElementById("searchlist").appendChild(newelement);
            }
          }
        }
      }).catch(e => {
        console.log(e);
      });
  }
}

function updateSearchContainerbySearch() {
  //console.log('search bar was updated! event fired Successfully');
  //var result = document.getElementById("searchbox").getAttribute('value');
  var result = document.getElementById('searchbox').value;
  //console.log(result2);
  //console.log(result);
  if (result) {
    var query = encodeURIComponent(encodeURI(result.replaceAll(' ', '-')).toString()).toString();
    console.log(query);
    fetch(`https://api.themoviedb.org/3/search/multi?query=${query}&language=en-US&append_to_response=external_ids`, {
      method: 'GET',
      headers: {
        'authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTljY2JkNDViNmY1MTJjN2E0YWZmMzA5MjIxZDgyOCIsInN1YiI6IjYzZDBhM2M3NjZhZTRkMDA5ZTlkZjY4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N5j1M7YnwmMTjIWMdYQbdh5suW2hCDucbqlDgMku_UA',
        'content-type': 'application/json;charset=utf-8'
      }
    }).then((response) => response.json())
      .then((data) => {
        //console.log(data);
        document.getElementById("pagelist").innerHTML = "";
        document.getElementById("searchlist").innerHTML = "";
        for (var json of data.results) {
          if (json.media_type !== "person") {
            //console.log(json.media_type);
            var overview;
            if (json.overview) {
              overview = json.overview.substring(0, 200);
            } else {
              overview = "";
            }

            if (json.media_type === "movie") {
              const newelement = document.createElement("li");
              var bookmarksrc = "assets/bookmark.png";
              if (localStorage.getItem('bookmarks')) {
                if (JSON.parse(localStorage.getItem('bookmarks')).find(tree => parseInt(tree.id) === parseInt(json.id))) {
                  bookmarksrc = "assets/bookmarkfilled.png";
                  console.log('FOUND BOOOKMARK');
                }
              }
              newelement.innerHTML = `<figure class="card__thumbnail"><img id="bookmarkButton-4-${json.id}" onmouseenter="bookmarkCardHovered(this)" onmouseleave="bookmarkCardHovered(this)" data="bookmarkButton" data-id=${json.id} data-type="movie" onclick="event.stopPropagation();bookmarkCard(this)" src="${bookmarksrc}"></figure> \
                    <h3 class="card-title">${json.title}</h3> \
                    <div class="card-content"> \
                      <h3>Description</h3> \
                      <p>${overview}</p> \
                    </div> \
                    <div class="card-link-wrapper"> \
                      <p class="card-link">${json.release_date.split("-")[0]}</p> \
                    </div>`
              newelement.setAttribute("style", `background:url('https://image.tmdb.org/t/p/original${json.poster_path}'); background-repeat: no-repeat; background-size: cover; background-position: center;`);
              newelement.setAttribute("id", json.id);
              newelement.setAttribute("class", "card");
              newelement.setAttribute("onclick", `cardclicked(${json.id}, "${json.title}", "${json.media_type}");`);
              document.getElementById("searchlist").appendChild(newelement);
            }

            if (json.media_type === "tv") {
              const newelement = document.createElement("li");
              var bookmarksrc = "assets/bookmark.png";
              if (localStorage.getItem('bookmarks')) {
                if (JSON.parse(localStorage.getItem('bookmarks')).find(tree => parseInt(tree.id) === parseInt(json.id))) {
                  bookmarksrc = "assets/bookmarkfilled.png";
                  console.log('FOUND BOOOKMARK');
                }
              }
              newelement.innerHTML = `<figure class="card__thumbnail"><img id="bookmarkButton-5-${json.id}" onmouseenter="bookmarkCardHovered(this)" onmouseleave="bookmarkCardHovered(this)" data="bookmarkButton" data-id=${json.id} data-type="tv" onclick="event.stopPropagation();bookmarkCard(this)" src="${bookmarksrc}"></figure> \
                    <h3 class="card-title">${json.name}</h3> \
                    <div class="card-content"> \
                      <h3>Description</h3> \
                      <p>${overview}</p> \
                    </div> \
                    <div class="card-link-wrapper"> \
                      <p class="card-link">${json.first_air_date.split("-")[0]}</p> \
                    </div>`
              newelement.setAttribute("style", `background:url('https://image.tmdb.org/t/p/original${json.poster_path}'); background-repeat: no-repeat; background-size: cover; background-position: center;`);
              newelement.setAttribute("id", json.id);
              newelement.setAttribute("class", "card");
              newelement.setAttribute("onclick", `cardclicked(${json.id}, "${json.name}", "${json.media_type}");`);
              document.getElementById("searchlist").appendChild(newelement);
            }
          }
        }
        if (data.total_pages >= 2) {
          for (var i = 0; data.total_pages > i; i++) {
            const pageelement = document.createElement("div");
            pageelement.innerHTML = `${(i + 1)}`;
            pageelement.setAttribute("class", "card6");
            pageelement.setAttribute("onclick", `updateSearchContainerbyPage(${(i + 1)})`);
            //newelement.setAttribute("onclick", `cardclicked(${json.id}, "${json.name}", "tv");`);
            document.getElementById("pagelist").appendChild(pageelement);
          }
        } else {
          const pageelement = document.createElement("div");
          pageelement.innerHTML = `${(1)}`;
          pageelement.setAttribute("class", "card6");
          pageelement.setAttribute("onclick", `updateSearchContainerbyPage(${(1)})`);
          //newelement.setAttribute("onclick", `cardclicked(${json.id}, "${json.name}", "tv");`);
          document.getElementById("pagelist").appendChild(pageelement);
        }
      }).catch(e => {
        console.log(e);
      });
  }
}

function updateMovieContainer() {
  bookmarkInit();
  var id; //Here we will load it from the document cookies
  //var season = document.cookie.split('; ').find((row) => row.startsWith('season='))?.split('=')[1];

  if (document.cookie.split('; ').find((rowc) => rowc.startsWith('watchType=movie'))) {
    try {
      document.getElementById("watchTvPlayer").removeAttribute('src');
      document.getElementById("watchMoviePlayer").removeAttribute('style');
    } catch (e) { }
    document.getElementById("seasoncontainer").setAttribute('style', 'display: none;');
    document.getElementById("episodecontainer").setAttribute('style', 'display: none;');
    document.getElementById("watchTvPlayer").setAttribute('style', 'display: none;');
    const cookieValue = document.cookie.split('; ').find((row) => row.startsWith('watchId='))?.split('=')[1];
    id = cookieValue;
    updateMovieAdServers(id);
    if (server === 1) {
      fetch(`https://api.themoviedb.org/3/movie/${id}/external_ids`, {
        method: 'GET',
        headers: {
          'authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTljY2JkNDViNmY1MTJjN2E0YWZmMzA5MjIxZDgyOCIsInN1YiI6IjYzZDBhM2M3NjZhZTRkMDA5ZTlkZjY4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N5j1M7YnwmMTjIWMdYQbdh5suW2hCDucbqlDgMku_UA',
          'content-type': 'application/json;charset=utf-8'
        }
      }).then((response) => response.json())
        .then((data) => {
          //document.getElementById("watchTvPlayer").removeAttribute('sandbox');
          document.getElementById("watchMoviePlayer").setAttribute('sandbox', "allow-forms allow-modals allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation");
          document.getElementById("watchMoviePlayer").setAttribute('src', `https://dbgo.fun/imdb.php?id=${data.imdb_id}`);
          //console.log(data);
        }).catch(e => {
          console.log(e);
        });
    }
    if (server === 2) {
      document.getElementById("watchMoviePlayer").setAttribute('sandbox', "allow-forms allow-modals allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation");
      document.getElementById("watchMoviePlayer").setAttribute('src', `https://databasegdriveplayer.xyz/player.php?tmdb=${id}`);//13612
    }
    if (server === 3) {
      document.getElementById("watchMoviePlayer").setAttribute('sandbox', "allow-forms allow-modals allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation");
      document.getElementById("watchMoviePlayer").setAttribute('src', `https://vidsrc.me/embed/${id}/`);//13612
    }

    if (server === 4) {
      //document.getElementById("watchMoviePlayer").setAttribute('sandbox', "allow-forms allow-modals allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation");
      document.getElementById("watchMoviePlayer").removeAttribute('sandbox');
      document.getElementById("watchMoviePlayer").setAttribute('src', `https://www.2embed.to/embed/tmdb/movie?id=${id}/`);//13612
    }

    if (server === 5) {
      try {
        document.getElementById("WatchMoviePlayer").removeAttribute('sandbox');
        fetch(`https://api.themoviedb.org/3/movie/${id}/external_ids`, {
          method: 'GET',
          headers: {
            'authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTljY2JkNDViNmY1MTJjN2E0YWZmMzA5MjIxZDgyOCIsInN1YiI6IjYzZDBhM2M3NjZhZTRkMDA5ZTlkZjY4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N5j1M7YnwmMTjIWMdYQbdh5suW2hCDucbqlDgMku_UA',
            'content-type': 'application/json;charset=utf-8'
          }
        }).then((response) => response.json())
          .then((data) => {
            document.getElementById("watchTvPlayer").removeAttribute('sandbox');
            //document.getElementById("watchMoviePlayer").setAttribute('sandbox', "allow-forms allow-modals allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation");
            document.getElementById("watchMoviePlayer").setAttribute('src', `https://gomo.to/movie/${data.imdb_id}/`);
            //console.log(data);
          }).catch(e => {
            console.log(e);
          });
      } catch (e) { console.log(e); }
    }

    if (server >= 6) {
      try {
        //document.getElementById("watchTvPlayer").removeAttribute('sandbox');
        var Loc = (server - 6);
        if (adServersList[Loc].server === "doodstream" || adServersList[Loc].server === "streamsb" || adServersList[Loc].server === "highload" || adServersList[Loc].server === "fembed") {
          //console.log("Its sandbox detection so removing sandbox please have ad blocker or brave browser recommended!");
          document.getElementById("watchMoviePlayer").removeAttribute('sandbox');
        } else { document.getElementById("watchTvPlayer").setAttribute('sandbox', "allow-forms allow-modals allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation"); }
        document.getElementById("watchMoviePlayer").setAttribute('src', adServersList[Loc].url);
      } catch (e) { return; }
    }
  }
}

function updateTvContainer() {
  bookmarkInit();
  var id; //Here we will load it from the document cookies
  var season = document.cookie.split('; ').find((row) => row.startsWith('season='))?.split('=')[1];
  if (document.cookie.split('; ').find((rowc) => rowc.startsWith('watchType=tv'))) {
    const cookieValue = document.cookie.split('; ').find((row) => row.startsWith('watchId='))?.split('=')[1];
    id = cookieValue;
    try {
      document.getElementById("watchTvPlayer").removeAttribute('style');
      document.getElementById("seasoncontainer").removeAttribute('style');
      document.getElementById("watchMoviePlayer").removeAttribute('src');
      document.getElementById("episodecontainer").removeAttribute('style');
    } catch (e) { }
    document.getElementById("watchMoviePlayer").setAttribute('style', 'display: none;');
    //Put inside if statement to make sure its watching a tv show! check the cookies!
    fetch(`https://api.themoviedb.org/3/tv/${id}?language=en-US&append_to_response=external_ids`, {
      method: 'GET',
      headers: {
        'authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTljY2JkNDViNmY1MTJjN2E0YWZmMzA5MjIxZDgyOCIsInN1YiI6IjYzZDBhM2M3NjZhZTRkMDA5ZTlkZjY4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N5j1M7YnwmMTjIWMdYQbdh5suW2hCDucbqlDgMku_UA',
        'content-type': 'application/json;charset=utf-8'
      }
    }).then((response) => response.json())
      .then((data) => {
        //console.log(data);
        document.getElementById("listofseasons").innerHTML = "";
        objlist = [];
        for (var json of data.seasons) {
          if (json.name !== null && !json.name.startsWith("Special")) {
            var obj = {
              "season": json.season_number,
              "episode_count": json.episode_count
            };
            obj.season = json.season_number;
            obj.episode_count = json.episode_count;
            objlist.push(obj);
            const seasonelement = document.createElement("li");
            seasonelement.innerHTML = `Season ${json.season_number}`;
            seasonelement.setAttribute("class", "card3");
            seasonelement.setAttribute("onclick", `getepisodes(${json.season_number})`);
            //newelement.setAttribute("onclick", `cardclicked(${json.id}, "${json.name}", "tv");`);
            document.getElementById("listofseasons").appendChild(seasonelement);
            //Then we for loop for each episode count and append the episode amount to the object!
            /*for(var i=0; json.episode_count> i; i++){
            const newelement =  document.createElement("div");
            newelement.innerHTML=`Episode ${json.episode_number}`;
            newelement.setAttribute("class", "seasonobj");
            //newelement.setAttribute("onclick", `cardclicked(${json.id}, "${json.name}", "tv");`);
            document.getElementById("stonertvlist").appendChild(newelement);
            }*/
          }
        }
        //console.log(objlist);
        getepisodes(season);
      }).catch(e => {
        console.log(e);
      });

  }
}

function updateServer(n) {
  const cookieValue = document.cookie.split('; ').find((row) => row.startsWith('server='))?.split('=')[1];
  const cookieValue2 = document.cookie.split('; ').find((row) => row.startsWith('watchType='))?.split('=')[1];
  if (cookieValue === n) {
    return;
  } else {
    server = n;
    const d = new Date();
    d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000));
    var kia = "expires=" + d.toUTCString();
    document.cookie = "server=" + n + "; SameSite=strict; Secure; " + kia;
    if (cookieValue2 === "movie") {
      updateMovieContainer();
    } else {
      var season = document.cookie.split('; ').find((row) => row.startsWith('season='))?.split('=')[1];
      var episode = document.cookie.split('; ').find((row) => row.startsWith('episode='))?.split('=')[1];
      updateTvPlayer(season, episode);
    }
  }
}

function getepisodes(n) {
  var result = objlist.find(tree => (tree.season === parseInt(n)));
  //console.log(n);
  //console.log(result);
  document.getElementById("listofepisodes").innerHTML = "";
  for (var i = 0; result.episode_count > i; i++) {
    const newelement = document.createElement("div");
    newelement.innerHTML = `Episode ${(i + 1)}`;
    newelement.setAttribute("class", "card3");
    newelement.setAttribute("onclick", `updateTvPlayer(${n}, "${(i + 1)}");`);
    document.getElementById("listofepisodes").appendChild(newelement);
  }
  if (document.cookie.split('; ').find((row) => row.startsWith('episode'))) {
    var episodecookie = document.cookie.split('; ').find((row) => row.startsWith('episode='))?.split('=')[1];
    updateTvPlayer(n, episodecookie);
    //updateTvAdServers(document.cookie.split('; ').find((row) => row.startsWith('watchId='))?.split('=')[1], n, episodecookie);
    //console.log('Howdy dudoidoo');
  } else {
    updateTvPlayer(n, 1);
  }
}

function getTvExternalIds(id) {

  fetch(`https://api.themoviedb.org/3/tv/${id}/external_ids`, {
    method: 'GET',
    headers: {
      'authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTljY2JkNDViNmY1MTJjN2E0YWZmMzA5MjIxZDgyOCIsInN1YiI6IjYzZDBhM2M3NjZhZTRkMDA5ZTlkZjY4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N5j1M7YnwmMTjIWMdYQbdh5suW2hCDucbqlDgMku_UA',
      'content-type': 'application/json;charset=utf-8'
    }
  }).then((response) => response.json())
    .then((data) => {
      return data.imdb_id;
      //console.log(data);
    }).catch(e => {
      console.log(e);
    });
}

function updateMovieAdServers(id) {
  if (AdServersInfo.id !== id) {
    fetch(`https://private-anon-a708459cf9-superembed.apiary-proxy.com/?type=tmdb&id=${id}&max_results=5`).then((response) => response.json()).then((data) => {
      //console.log(data);
      AdServersInfo.id = id;
      //console.log(data);
      adServersList = [];
      var counter = 6;
      document.getElementById("ServersList").innerHTML = '<li class="card2" onclick="updateServer(1)">1</li> \
            <li class="card2" onclick="updateServer(2)">2</li> \
            <li class="card2" onclick="updateServer(3)">3</li>'
      document.getElementById("adServersList").innerHTML = '<li class="card2" onclick="updateServer(4)">4</li> \
          <li class="card2" onclick="updateServer(5)">5</li>'
      for (var json of data.results) {
        var obj = {
          'id': counter,
          'server': `${json.server}`,
          'url': `${json.url}`
        };
        adServersList.push(obj);
        if (json.server === "doodstream" || json.server === "streamsb" || json.server === "highload" || json.server === "fembed") {
          const newelement = document.createElement("li");
          newelement.innerHTML = `${json.server}`
          newelement.setAttribute("class", "card2");
          newelement.setAttribute("onclick", `updateServer("${counter}")`);
          document.getElementById("adServersList").appendChild(newelement);
          counter = counter + 1;
        } else {
          const newelement = document.createElement("li");
          newelement.innerHTML = `${json.server}`
          newelement.setAttribute("class", "card2");
          newelement.setAttribute("onclick", `updateServer("${counter}")`);
          document.getElementById("ServersList").appendChild(newelement);
          counter = counter + 1;
        }
      }
      //console.log(adServersList);
    }).catch(e => {
      console.log(e);
    });
    return;
  } else { return; }
}

function updateTvAdServers(id, season, episode) {
  if (AdServersInfo.id !== id || AdServersInfo.ep !== episode || AdServersInfo.season !== season) {
    fetch(`https://private-anon-a708459cf9-superembed.apiary-proxy.com/?type=tmdb&id=${id}&season=${season}&episode=${episode}&max_results=5`).then((response) => response.json()).then((data) => {
      //console.log(data);
      AdServersInfo.id = id;
      AdServersInfo.season = season;
      AdServersInfo.ep = episode;
      //console.log(data);
      adServersList = [];
      var counter = 6;
      document.getElementById("ServersList").innerHTML = '<li class="card2" onclick="updateServer(1)">1</li> \
            <li class="card2" onclick="updateServer(2)">2</li> \
            <li class="card2" onclick="updateServer(3)">3</li>'
      document.getElementById("adServersList").innerHTML = '<li class="card2" onclick="updateServer(4)">4</li> \
          <li class="card2" onclick="updateServer(5)">5</li>'
      for (var json of data.results) {
        var obj = {
          'id': counter,
          'server': `${json.server}`,
          'url': `${json.url}`
        };
        adServersList.push(obj);
        if (json.server === "doodstream" || json.server === "streamsb" || json.server === "highload" || json.server === "fembed") {
          const newelement = document.createElement("li");
          newelement.innerHTML = `${json.server}`
          newelement.setAttribute("class", "card2");
          newelement.setAttribute("onclick", `updateServer("${counter}")`);
          document.getElementById("adServersList").appendChild(newelement);
          counter = counter + 1;
        } else {
          const newelement = document.createElement("li");
          newelement.innerHTML = `${json.server}`
          newelement.setAttribute("class", "card2");
          newelement.setAttribute("onclick", `updateServer("${counter}")`);
          document.getElementById("ServersList").appendChild(newelement);
          counter = counter + 1;
        }
      }
      console.log(adServersList);
    }).catch(e => {
      console.log(e);
    });
    return;
  } else { return; }
}

function updateHistory(id, season, episode) {
  return;
}

function updateTvPlayer(season, episode) {
  const d = new Date();
  d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000));
  var kia = "expires=" + d.toUTCString();
  document.cookie = "season=" + season + "; SameSite=strict; Secure; " + kia;
  document.cookie = "episode=" + episode + "; SameSite=strict; Secure; " + kia;
  const cookieValue = document.cookie.split('; ').find((row) => row.startsWith('watchId='))?.split('=')[1];
  var id = cookieValue;
  bookmarkInit();
  updateTvAdServers(id, season, episode);
  //updateHistory(id, season, episode);
  if (server === 1) {
    fetch(`https://api.themoviedb.org/3/tv/${id}/external_ids`, {
      method: 'GET',
      headers: {
        'authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTljY2JkNDViNmY1MTJjN2E0YWZmMzA5MjIxZDgyOCIsInN1YiI6IjYzZDBhM2M3NjZhZTRkMDA5ZTlkZjY4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N5j1M7YnwmMTjIWMdYQbdh5suW2hCDucbqlDgMku_UA',
        'content-type': 'application/json;charset=utf-8'
      }
    }).then((response) => response.json())
      .then((data) => {
        //document.getElementById("watchTvPlayer").removeAttribute('sandbox');
        document.getElementById("watchTvPlayer").setAttribute('sandbox', "allow-forms allow-modals allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation");
        document.getElementById("watchTvPlayer").setAttribute('src', `https://dbgo.fun/tv-imdb.php?id=${data.imdb_id}&s=${season}`);
        //console.log(data);
      }).catch(e => {
        console.log(e);
      });
  }
  if (server === 2) {
    document.getElementById("watchTvPlayer").setAttribute('sandbox', "allow-forms allow-modals allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation");
    document.getElementById("watchTvPlayer").setAttribute('src', `https://databasegdriveplayer.xyz/player.php?type=series&tmdb=${id}&season=${season}&episode=${episode}`);
  }
  if (server === 3) {
    document.getElementById("watchTvPlayer").setAttribute('sandbox', "allow-forms allow-modals allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation");
    //document.getElementById("watchTvPlayer").removeAttribute('sandbox');
    document.getElementById("watchTvPlayer").setAttribute('src', `https://vidsrc.me/embed/${id}/${season}-${episode}/`);
  }

  if (server === 4) {
    document.getElementById("watchTvPlayer").removeAttribute('sandbox');
    //document.getElementById("watchTvPlayer").setAttribute('sandbox', "allow-same-origin allow-scripts allow-top-navigation");
    document.getElementById("watchTvPlayer").setAttribute('src', `https://www.2embed.to/embed/tmdb/tv?id=${id}&s=${season}&e=${episode}`);
  }//https://www.2embed.to/embed/tmdb/tv?id=76479&s=1&e=1

  if (server === 5) {
    try {
      document.getElementById("watchTvPlayer").removeAttribute('sandbox');
      if (season < 10) { season = "0" + season; }
      if (episode < 10) { episode = "0" + episode; }
      document.getElementById("watchTvPlayer").setAttribute('src', `https://gomo.to/show/${namee.replaceAll(" ", "-")}/${season}-${episode}`);
    } catch (e) { return; }
  }

  if (server >= 6) {
    try {
      //document.getElementById("watchTvPlayer").removeAttribute('sandbox');
      var Loc = (server - 6);
      if (adServersList[Loc].server === "doodstream" || adServersList[Loc].server === "streamsb" || adServersList[Loc].server === "highload" || adServersList[Loc].server === "fembed") {
        //console.log("Its sandbox detection so removing sandbox please have ad blocker or brave browser recommended!");
        document.getElementById("watchTvPlayer").removeAttribute('sandbox');
      } else { document.getElementById("watchTvPlayer").setAttribute('sandbox', "allow-forms allow-modals allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation"); }
      document.getElementById("watchTvPlayer").setAttribute('src', adServersList[Loc].url);
    } catch (e) { return; }
  }
}


function test() {
  Autohide = !Autohide;
  //console.log("Logo Clicked!");
  //console.log("Autohide Value: ", Autohide);
  if (Autohide == true) {
    console.log("Hiding Tab Labels!");
    document.getElementById("tababoutlabel")
    document.getElementById("tababoutlabel").setAttribute("style", "display: none");
    document.getElementById("tabhomelabel").setAttribute("style", "display: none");
    document.getElementById("tabgenrelabel").setAttribute("style", "display: none");
    //document.getElementById("tabcountrylabel").setAttribute("style", "display: none");
    document.getElementById("tabmovieslabel").setAttribute("style", "display: none");
    document.getElementById("tabtvlabel").setAttribute("style", "display: none");
    document.getElementById("tabsearchlabel").setAttribute("style", "display: none");
    document.getElementById("tabwatchlabel").setAttribute("style", "display: none");
    console.log(document.getElementById("tababoutlabel").getAttribute("display"));
  } else {
    document.getElementById("tababoutlabel").removeAttribute("style");
    document.getElementById("tabhomelabel").removeAttribute("style");
    document.getElementById("tabgenrelabel").removeAttribute("style");
    //document.getElementById("tabcountrylabel").removeAttribute("style");
    document.getElementById("tabmovieslabel").removeAttribute("style");
    document.getElementById("tabtvlabel").removeAttribute("style");
    document.getElementById("tabsearchlabel").removeAttribute("style");
    document.getElementById("tabwatchlabel").removeAttribute("style");
  }
}

function cardclicked(id, name, type) {
  //console.log("Id:", id, "Name:", name, "Type:", type, "Was Clicked");
  const cookieValue = document.cookie.split('; ').find((row) => row.startsWith('watchId='))?.split('=')[1];
  if (cookieValue === id) {
  } else {
    const d = new Date();
    d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000));
    var kia = "expires=" + d.toUTCString();
    document.cookie = "season=" + 1 + "; SameSite=strict; Secure; " + kia;
    document.cookie = "episode=" + 1 + "; SameSite=strict; Secure; " + kia;
    updatewatchIdAndEtc(id, type, name);
    //updatewatchName(name);
    //updatewatchType(type);
    bookmarkInit();
    if (type === "tv") {
      updateTvContainer();
    } else {
      updateMovieContainer();
    }
  }
  document.getElementById("tababout").checked = false;
  document.getElementById("tabhome").checked = false;
  document.getElementById("tabgenre").checked = false;
  document.getElementById("tabmovies").checked = false;
  document.getElementById("tabtvshows").checked = false;
  document.getElementById("tabsearch").checked = false;
  document.getElementById("tabwatch").checked = true;
}

async function tvaddbyPage(n, p) {
  switch (n) {
    case 1:
      fetch(`https://api.themoviedb.org/3/discover/tv?language=en-US&sort_by=popularity.asc&page=${(p + 1)}&with_original_language=en&vote_count.gte=1000&vote_average.gte=8&watch_region=US&region=US`, {
        method: 'GET',
        headers: {
          'authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTljY2JkNDViNmY1MTJjN2E0YWZmMzA5MjIxZDgyOCIsInN1YiI6IjYzZDBhM2M3NjZhZTRkMDA5ZTlkZjY4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N5j1M7YnwmMTjIWMdYQbdh5suW2hCDucbqlDgMku_UA',
          'content-type': 'application/json;charset=utf-8'
        }
      }).then((response) => response.json())
        .then((data) => {
          //console.log(data);
          for (var json of data.results) {
            if (json.poster_path === null && json.backdrop_path === null) {
            }
            if (json.poster_path !== null) {
              const newelement = document.createElement("li");
              var bookmarksrc = "assets/bookmark.png";
              if (localStorage.getItem('bookmarks')) {
                if (JSON.parse(localStorage.getItem('bookmarks')).find(tree => parseInt(tree.id) === parseInt(json.id))) {
                  bookmarksrc = "assets/bookmarkfilled.png";
                  //console.log('FOUND BOOOKMARK');
                }
              }
              newelement.innerHTML = `<figure class="card__thumbnail"><img id="bookmarkButton-1-${json.id}" onmouseenter="bookmarkCardHovered(this)" onmouseleave="bookmarkCardHovered(this)" data="bookmarkButton" data-id=${json.id} data-type="tv" onclick="event.stopPropagation();bookmarkCard(this)" src="${bookmarksrc}"></figure> \
                    <h3 class="card-title">${json.name}</h3> \
                    <div class="card-content"> \
                      <h3>Description</h3> \
                      <p>${json.overview.substring(0, 200)}</p> \
                    </div> \
                    <div class="card-link-wrapper"> \
                      <p class="card-link">${json.first_air_date.split("-")[0]}</p> \
                    </div>`
              newelement.setAttribute("style", `background:url('https://image.tmdb.org/t/p/original${json.poster_path}'); background-repeat: no-repeat; background-size: cover; background-position: center;`);
              newelement.setAttribute("id", json.id);
              newelement.setAttribute("class", "card");
              newelement.setAttribute("onclick", `cardclicked(${json.id}, "${json.name}", "tv");`);
              document.getElementById("IMDBToptvlist").appendChild(newelement);
            }
          }
        }).catch(e => {
          console.log(e);
        });
      break;

    case 2:
      fetch(`https://api.themoviedb.org/3/trending/tv/week?page=${(p + 1)}`, {
        method: 'GET',
        headers: {
          'authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTljY2JkNDViNmY1MTJjN2E0YWZmMzA5MjIxZDgyOCIsInN1YiI6IjYzZDBhM2M3NjZhZTRkMDA5ZTlkZjY4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N5j1M7YnwmMTjIWMdYQbdh5suW2hCDucbqlDgMku_UA',
          'content-type': 'application/json;charset=utf-8'
        }
      }).then((response) => response.json())
        .then((data) => {
          //console.log(data);
          for (var json of data.results) {
            if (json.poster_path === null && json.backdrop_path === null) {
            }
            if (json.poster_path !== null) {
              const newelement = document.createElement("li");
              var bookmarksrc = "assets/bookmark.png";
              if (localStorage.getItem('bookmarks')) {
                if (JSON.parse(localStorage.getItem('bookmarks')).find(tree => parseInt(tree.id) === parseInt(json.id))) {
                  bookmarksrc = "assets/bookmarkfilled.png";
                  //console.log('FOUND BOOOKMARK');
                }
              }
              newelement.innerHTML = `<figure class="card__thumbnail"><img id="bookmarkButton-2-${json.id}" onmouseenter="bookmarkCardHovered(this)" onmouseleave="bookmarkCardHovered(this)" data="bookmarkButton" data-id=${json.id} data-type="tv" onclick="event.stopPropagation();bookmarkCard(this)" src="${bookmarksrc}"></figure> \
                    <h3 class="card-title">${json.name}</h3> \
                    <div class="card-content"> \
                      <h3>Description</h3> \
                      <p>${json.overview.substring(0, 200)}</p> \
                    </div> \
                    <div class="card-link-wrapper"> \
                      <p class="card-link">${json.first_air_date.split("-")[0]}</p> \
                    </div>`
              newelement.setAttribute("style", `background:url('https://image.tmdb.org/t/p/original${json.poster_path}'); background-repeat: no-repeat; background-size: cover; background-position: center;`);
              newelement.setAttribute("id", json.id);
              newelement.setAttribute("class", "card");
              newelement.setAttribute("onclick", `cardclicked(${json.id}, "${json.name}", "tv");`);
              document.getElementById("newesttvlist").appendChild(newelement);
            }
          }
        }).catch(e => {
          console.log(e);
        });
      break;

    case 3:
      fetch(`https://api.themoviedb.org/3/discover/tv?language=en-US&sort_by=popularity.desc&page=${(p + 1)}&with_original_language=en`, {
        method: 'GET',
        headers: {
          'authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTljY2JkNDViNmY1MTJjN2E0YWZmMzA5MjIxZDgyOCIsInN1YiI6IjYzZDBhM2M3NjZhZTRkMDA5ZTlkZjY4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N5j1M7YnwmMTjIWMdYQbdh5suW2hCDucbqlDgMku_UA',
          'content-type': 'application/json;charset=utf-8'
        }
      }).then((response) => response.json())
        .then((data) => {
          //console.log(data);
          for (var json of data.results) {
            const newelement = document.createElement("li");
            var bookmarksrc = "assets/bookmark.png";
            if (localStorage.getItem('bookmarks')) {
              if (JSON.parse(localStorage.getItem('bookmarks')).find(tree => parseInt(tree.id) === parseInt(json.id))) {
                bookmarksrc = "assets/bookmarkfilled.png";
                //console.log('FOUND BOOOKMARK');
              }
            }
            newelement.innerHTML = `<figure class="card__thumbnail"><img id="bookmarkButton-3-${json.id}" onmouseenter="bookmarkCardHovered(this)" onmouseleave="bookmarkCardHovered(this)" data="bookmarkButton" data-id=${json.id} data-type="tv" onclick="event.stopPropagation();bookmarkCard(this)" src="${bookmarksrc}"></figure> \
                    <h3 class="card-title">${json.name}</h3> \
                    <div class="card-content"> \
                      <h3>Description</h3> \
                      <p>${json.overview.substring(0, 200)}</p> \
                    </div> \
                    <div class="card-link-wrapper"> \
                      <p class="card-link">${json.first_air_date.split("-")[0]}</p> \
                    </div>`
            newelement.setAttribute("style", `background:url('https://image.tmdb.org/t/p/original${json.poster_path}'); background-repeat: no-repeat; background-size: cover; background-position: center;`);
            newelement.setAttribute("id", json.id);
            newelement.setAttribute("class", "card");
            newelement.setAttribute("onclick", `cardclicked(${json.id}, "${json.name}", "tv");`);
            document.getElementById("populartvlist").appendChild(newelement);
          }
        }).catch(e => {
          console.log(e);
        });
      break;
  }
}

async function initializeaddbypage(n, t_p) {
  for (var p = 0; t_p > p; p++) {
    if (p < 50) {
      console.log(p);
      tvaddbyPage(n, p);
      await timer(100);
    }
    if (p >= 101) {
      return;
    }
    //console.log(p);
  }

}

async function tvshowAll(n, cb) {
  var total_pages = 1;
  //First we clear the already existing list! then we add to it!
  switch (n) {
    case 1:
      document.getElementById("IMDBToptvlist").innerHTML = "";
      fetch(`https://api.themoviedb.org/3/discover/tv?language=en-US&sort_by=popularity.asc&page=1&with_original_language=en&vote_count.gte=1000&vote_average.gte=8&watch_region=US&region=US`, {
        method: 'GET',
        headers: {
          'authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTljY2JkNDViNmY1MTJjN2E0YWZmMzA5MjIxZDgyOCIsInN1YiI6IjYzZDBhM2M3NjZhZTRkMDA5ZTlkZjY4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N5j1M7YnwmMTjIWMdYQbdh5suW2hCDucbqlDgMku_UA',
          'content-type': 'application/json;charset=utf-8'
        }
      }).then((response) => response.json())
        .then((data) => {
          //const timer = ms => new Promise(res => setTimeout(res, ms));
          total_pages = parseInt(data.total_pages);
          if (cb.checked) {
            initializeaddbypage(1, total_pages);
          }
          //console.log(data);

        }).catch(e => {
          console.log(e);
        });
      break;
    case 2:
      document.getElementById("newesttvlist").innerHTML = "";
      fetch(`https://api.themoviedb.org/3/trending/tv/week?page=1`, {
        method: 'GET',
        headers: {
          'authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTljY2JkNDViNmY1MTJjN2E0YWZmMzA5MjIxZDgyOCIsInN1YiI6IjYzZDBhM2M3NjZhZTRkMDA5ZTlkZjY4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N5j1M7YnwmMTjIWMdYQbdh5suW2hCDucbqlDgMku_UA',
          'content-type': 'application/json;charset=utf-8'
        }
      }).then((response) => response.json())
        .then((data) => {
          total_pages = parseInt(data.total_pages);
          if (cb.checked) {
            initializeaddbypage(2, total_pages);
          }
          //console.log(data);
        }).catch(e => {
          console.log(e);
        });
      break;
    case 3:
      document.getElementById("populartvlist").innerHTML = "";
      fetch(`https://api.themoviedb.org/3/discover/tv?language=en-US&sort_by=popularity.desc&page=1&with_original_language=en`, {
        method: 'GET',
        headers: {
          'authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTljY2JkNDViNmY1MTJjN2E0YWZmMzA5MjIxZDgyOCIsInN1YiI6IjYzZDBhM2M3NjZhZTRkMDA5ZTlkZjY4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N5j1M7YnwmMTjIWMdYQbdh5suW2hCDucbqlDgMku_UA',
          'content-type': 'application/json;charset=utf-8'
        }
      }).then((response) => response.json())
        .then((data) => {
          total_pages = parseInt(data.total_pages);
          if (cb.checked) {
            initializeaddbypage(3, total_pages);
          }
          //console.log(total_pages);
          //console.log(data);
        }).catch(e => {
          console.log(e);
        });
      break;
  }
  //Here we clear a list if its not checked!
  //  console.log(cb.checked);
  if (!cb.checked) {
    switch (n) {
      case 1:
        fetch('https://api.themoviedb.org/3/discover/tv?language=en-US&sort_by=popularity.asc&page=1&with_original_language=en&vote_count.gte=1000&vote_average.gte=8&watch_region=US&region=US', {
          method: 'GET',
          headers: {
            'authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTljY2JkNDViNmY1MTJjN2E0YWZmMzA5MjIxZDgyOCIsInN1YiI6IjYzZDBhM2M3NjZhZTRkMDA5ZTlkZjY4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N5j1M7YnwmMTjIWMdYQbdh5suW2hCDucbqlDgMku_UA',
            'content-type': 'application/json;charset=utf-8'
          }
        }).then((response) => response.json())
          .then((data) => {
            //console.log(data);
            for (var json of data.results) {
              if (json.poster_path === null && json.backdrop_path === null) {
              }
              if (json.poster_path !== null) {
                const newelement = document.createElement("li");
                var bookmarksrc = "assets/bookmark.png";
                if (localStorage.getItem('bookmarks')) {
                  if (JSON.parse(localStorage.getItem('bookmarks')).find(tree => parseInt(tree.id) === parseInt(json.id))) {
                    bookmarksrc = "assets/bookmarkfilled.png";
                    console.log('FOUND BOOOKMARK');
                  }
                }
                newelement.innerHTML = `<figure class="card__thumbnail"><img id="bookmarkButton-1-${json.id}" onmouseenter="bookmarkCardHovered(this)" onmouseleave="bookmarkCardHovered(this)" data="bookmarkButton" data-id=${json.id} data-type="tv" onclick="event.stopPropagation();bookmarkCard(this)" src="${bookmarksrc}"></figure> \
                            <h3 class="card-title">${json.name}</h3> \
                            <div class="card-content"> \
                              <h3>Description</h3> \
                              <p>${json.overview.substring(0, 200)}</p> \
                            </div> \
                            <div class="card-link-wrapper"> \
                              <p class="card-link">${json.first_air_date.split("-")[0]}</p> \
                            </div>`
                newelement.setAttribute("style", `background:url('https://image.tmdb.org/t/p/original${json.poster_path}'); background-repeat: no-repeat; background-size: cover; background-position: center;`);
                newelement.setAttribute("id", json.id);
                newelement.setAttribute("class", "card");
                newelement.setAttribute("onclick", `cardclicked(${json.id}, "${json.name}", "tv");`);
                document.getElementById("IMDBToptvlist").appendChild(newelement);
              }
            }
          }).catch(e => {
            console.log(e);
          });
        break;
      case 2:
        fetch('https://api.themoviedb.org/3/trending/tv/week', {
          method: 'GET',
          headers: {
            'authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTljY2JkNDViNmY1MTJjN2E0YWZmMzA5MjIxZDgyOCIsInN1YiI6IjYzZDBhM2M3NjZhZTRkMDA5ZTlkZjY4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N5j1M7YnwmMTjIWMdYQbdh5suW2hCDucbqlDgMku_UA',
            'content-type': 'application/json;charset=utf-8'
          }
        }).then((response) => response.json())
          .then((data) => {
            //console.log(data);
            for (var json of data.results) {
              if (json.poster_path === null && json.backdrop_path === null) {
              }
              if (json.poster_path !== null) {
                const newelement = document.createElement("li");
                var bookmarksrc = "assets/bookmark.png";
                if (localStorage.getItem('bookmarks')) {
                  if (JSON.parse(localStorage.getItem('bookmarks')).find(tree => parseInt(tree.id) === parseInt(json.id))) {
                    bookmarksrc = "assets/bookmarkfilled.png";
                    console.log('FOUND BOOOKMARK');
                  }
                }
                newelement.innerHTML = `<figure class="card__thumbnail"><img id="bookmarkButton-2-${json.id}" onmouseenter="bookmarkCardHovered(this)" onmouseleave="bookmarkCardHovered(this)" data="bookmarkButton" data-id=${json.id} data-type="tv" onclick="event.stopPropagation();bookmarkCard(this)" src="${bookmarksrc}"></figure> \
                            <h3 class="card-title">${json.name}</h3> \
                            <div class="card-content"> \
                              <h3>Description</h3> \
                              <p>${json.overview.substring(0, 200)}</p> \
                            </div> \
                            <div class="card-link-wrapper"> \
                              <p class="card-link">${json.first_air_date.split("-")[0]}</p> \
                            </div>`
                newelement.setAttribute("style", `background:url('https://image.tmdb.org/t/p/original${json.poster_path}'); background-repeat: no-repeat; background-size: cover; background-position: center;`);
                newelement.setAttribute("id", json.id);
                newelement.setAttribute("class", "card");
                newelement.setAttribute("onclick", `cardclicked(${json.id}, "${json.name}", "tv");`);
                document.getElementById("newesttvlist").appendChild(newelement);
              }
            }
          }).catch(e => {
            console.log(e);
          });
        break;
      case 3:
        fetch('https://api.themoviedb.org/3/discover/tv?language=en-US&sort_by=popularity.desc&page=1&with_original_language=en', {
          method: 'GET',
          headers: {
            'authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTljY2JkNDViNmY1MTJjN2E0YWZmMzA5MjIxZDgyOCIsInN1YiI6IjYzZDBhM2M3NjZhZTRkMDA5ZTlkZjY4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N5j1M7YnwmMTjIWMdYQbdh5suW2hCDucbqlDgMku_UA',
            'content-type': 'application/json;charset=utf-8'
          }
        }).then((response) => response.json())
          .then((data) => {
            //console.log(data);
            for (var json of data.results) {
              const newelement = document.createElement("li");
              var bookmarksrc = "assets/bookmark.png";
              if (localStorage.getItem('bookmarks')) {
                if (JSON.parse(localStorage.getItem('bookmarks')).find(tree => parseInt(tree.id) === parseInt(json.id))) {
                  bookmarksrc = "assets/bookmarkfilled.png";
                  console.log('FOUND BOOOKMARK');
                }
              }
              newelement.innerHTML = `<figure class="card__thumbnail"><img id="bookmarkButton-3-${json.id}" onmouseenter="bookmarkCardHovered(this)" onmouseleave="bookmarkCardHovered(this)" data="bookmarkButton" data-id=${json.id} data-type="tv" onclick="event.stopPropagation();bookmarkCard(this)" src="${bookmarksrc}"></figure> \
                            <h3 class="card-title">${json.name}</h3> \
                            <div class="card-content"> \
                              <h3>Description</h3> \
                              <p>${json.overview.substring(0, 200)}</p> \
                            </div> \
                            <div class="card-link-wrapper"> \
                              <p class="card-link">${json.first_air_date.split("-")[0]}</p> \
                            </div>`
              newelement.setAttribute("style", `background:url('https://image.tmdb.org/t/p/original${json.poster_path}'); background-repeat: no-repeat; background-size: cover; background-position: center;`);
              newelement.setAttribute("id", json.id);
              newelement.setAttribute("class", "card");
              newelement.setAttribute("onclick", `cardclicked(${json.id}, "${json.name}", "tv");`);
              document.getElementById("populartvlist").appendChild(newelement);
            }
          }).catch(e => {
            console.log(e);
          });
        break;
    }
  }
}
//Fetch the Highest Rated TV Shows! first 20!
async function tvshowinitexample() {

  fetch('https://api.themoviedb.org/3/discover/tv?language=en-US&sort_by=popularity.asc&page=1&with_original_language=en&vote_count.gte=1000&vote_average.gte=8&watch_region=US&region=US', {
    method: 'GET',
    headers: {
      'authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTljY2JkNDViNmY1MTJjN2E0YWZmMzA5MjIxZDgyOCIsInN1YiI6IjYzZDBhM2M3NjZhZTRkMDA5ZTlkZjY4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N5j1M7YnwmMTjIWMdYQbdh5suW2hCDucbqlDgMku_UA',
      'content-type': 'application/json;charset=utf-8'
    }
  }).then((response) => response.json())
    .then((data) => {
      //console.log(data);
      for (var json of data.results) {

        if (json.poster_path === null && json.backdrop_path === null) {

        }
        if (json.poster_path !== null) {
          const newelement = document.createElement("li");
          var bookmarksrc = "assets/bookmark.png";
          if (localStorage.getItem('bookmarks')) {
            if (JSON.parse(localStorage.getItem('bookmarks')).find(tree => parseInt(tree.id) === parseInt(json.id))) {
              bookmarksrc = "assets/bookmarkfilled.png";
              console.log('FOUND BOOOKMARK');
            }
          }
          newelement.innerHTML = `<figure class="card__thumbnail"><img id="bookmarkButton-1-${json.id}" onmouseenter="bookmarkCardHovered(this)" onmouseleave="bookmarkCardHovered(this)" data="bookmarkButton" data-id=${json.id} data-type="tv" onclick="event.stopPropagation();bookmarkCard(this)" src="${bookmarksrc}"></figure> \
                <h3 class="card-title">${json.name}</h3> \
                <div class="card-content"> \
                  <h3>Description</h3> \
                  <p>${json.overview.substring(0, 200)}</p> \
                </div> \
                <div class="card-link-wrapper"> \
                  <p class="card-link">${json.first_air_date.split("-")[0]}</p> \
                </div>`
          newelement.setAttribute("style", `background:url('https://image.tmdb.org/t/p/original${json.poster_path}'); background-repeat: no-repeat; background-size: cover; background-position: center;`);
          newelement.setAttribute("id", json.id);
          newelement.setAttribute("class", "card");
          newelement.setAttribute("onclick", `cardclicked(${json.id}, "${json.name}", "tv");`);
          document.getElementById("IMDBToptvlist").appendChild(newelement);
        }
      }
    }).catch(e => {
      console.log(e);
    });


  fetch('https://api.themoviedb.org/3/trending/tv/week', {
    method: 'GET',
    headers: {
      'authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTljY2JkNDViNmY1MTJjN2E0YWZmMzA5MjIxZDgyOCIsInN1YiI6IjYzZDBhM2M3NjZhZTRkMDA5ZTlkZjY4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N5j1M7YnwmMTjIWMdYQbdh5suW2hCDucbqlDgMku_UA',
      'content-type': 'application/json;charset=utf-8'
    }
  }).then((response) => response.json())
    .then((data) => {
      //console.log(data);
      for (var json of data.results) {
        //console.log(json.id);
        //console.log(json.poster_path);
        //console.log(json.backdrop_path);
        if (json.poster_path === null && json.backdrop_path === null) {

        }
        if (json.poster_path !== null) {
          const newelement = document.createElement("li");
          /*if (BookmarksJson){
          for (var js of BookmarksJson){
           // console.log(js.id);
           // console.log(json.id);
           if (parseInt(js.id) === parseInt(json.id)){
             console.log("Bookmark found!");
             bookmarksrc = "assets/bookmarkfilled.png";
           } 
          }
          }*/
          var bookmarksrc = "assets/bookmark.png";
          if (localStorage.getItem('bookmarks')) {
            if (JSON.parse(localStorage.getItem('bookmarks')).find(tree => parseInt(tree.id) === parseInt(json.id))) {
              bookmarksrc = "assets/bookmarkfilled.png";
              console.log('FOUND BOOOKMARK');
            }
          }
          newelement.innerHTML = `<figure class="card__thumbnail"><img id="bookmarkButton-2-${json.id}" onmouseenter="bookmarkCardHovered(this)" onmouseleave="bookmarkCardHovered(this)" data="bookmarkButton" data-id=${json.id} data-type="tv" onclick="event.stopPropagation();bookmarkCard(this)" src="${bookmarksrc}"></figure> \
                <h3 class="card-title">${json.name}</h3> \
                <div class="card-content"> \
                  <h3>Description</h3> \
                  <p>${json.overview.substring(0, 200)}</p> \
                </div> \
                <div class="card-link-wrapper"> \
                  <p class="card-link">${json.first_air_date.split("-")[0]}</p> \
                </div>`
          newelement.setAttribute("style", `background:url('https://image.tmdb.org/t/p/original${json.poster_path}'); background-repeat: no-repeat; background-size: cover; background-position: center;`);
          newelement.setAttribute("id", json.id);
          newelement.setAttribute("data-type", "tv");
          newelement.setAttribute("data-name", json.name);
          newelement.setAttribute("data-id", json.id);
          newelement.setAttribute("class", "card");
          newelement.setAttribute("onclick", `cardclicked(${json.id}, "${json.name}", "tv");`);
          document.getElementById("newesttvlist").appendChild(newelement);

          //document.getElementById(`${json.id}`).addEventListener("click", cardclicked(`${json.id}`));
          //console.log(JSON.stringify(json));
        }
      }
    }).catch(e => {
      console.log(e);
    });

  fetch('https://api.themoviedb.org/3/discover/tv?language=en-US&sort_by=popularity.desc&page=1&with_original_language=en', {
    method: 'GET',
    headers: {
      'authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTljY2JkNDViNmY1MTJjN2E0YWZmMzA5MjIxZDgyOCIsInN1YiI6IjYzZDBhM2M3NjZhZTRkMDA5ZTlkZjY4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N5j1M7YnwmMTjIWMdYQbdh5suW2hCDucbqlDgMku_UA',
      'content-type': 'application/json;charset=utf-8'
    }
  }).then((response) => response.json())
    .then((data) => {
      //console.log(data);
      for (var json of data.results) {
        //console.log(json.id);
        //console.log(json.poster_path);
        const newelement = document.createElement("li");
        var bookmarksrc = "assets/bookmark.png";
        if (localStorage.getItem('bookmarks')) {
          if (JSON.parse(localStorage.getItem('bookmarks')).find(tree => parseInt(tree.id) === parseInt(json.id))) {
            bookmarksrc = "assets/bookmarkfilled.png";
            console.log('FOUND BOOOKMARK');
          }
        }
        newelement.innerHTML = `<figure class="card__thumbnail"><img id="bookmarkButton-3-${json.id}" onmouseenter="bookmarkCardHovered(this)" onmouseleave="bookmarkCardHovered(this)" data="bookmarkButton" data-id=${json.id} data-type="tv" onclick="event.stopPropagation();bookmarkCard(this)" src="${bookmarksrc}"></figure> \
                <h3 class="card-title">${json.name}</h3> \
                <div class="card-content"> \
                  <h3>Description</h3> \
                  <p>${json.overview.substring(0, 200)}</p> \
                </div> \
                <div class="card-link-wrapper"> \
                  <p class="card-link">${json.first_air_date.split("-")[0]}</p> \
                </div>`
        newelement.setAttribute("style", `background:url('https://image.tmdb.org/t/p/original${json.poster_path}'); background-repeat: no-repeat; background-size: cover; background-position: center;`);
        newelement.setAttribute("id", json.id);
        newelement.setAttribute("class", "card");
        newelement.setAttribute("onclick", `cardclicked(${json.id}, "${json.name}", "tv");`);
        document.getElementById("populartvlist").appendChild(newelement);
      }
    }).catch(e => {
      console.log(e);
    });
}

async function movieinitstonerexample() {

  fetch('https://api.themoviedb.org/3/discover/movie?language=en-US&sort_by=popularity.desc&page=1&include_null_first_air_dates=false&with_keywords=302399%7C54169%7C10776%7C171235%7C241040%7C8224%7C258212%7C195631%7C243617%7C171401%7C195632%7C245911', {
    method: 'GET',
    headers: {
      'authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTljY2JkNDViNmY1MTJjN2E0YWZmMzA5MjIxZDgyOCIsInN1YiI6IjYzZDBhM2M3NjZhZTRkMDA5ZTlkZjY4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N5j1M7YnwmMTjIWMdYQbdh5suW2hCDucbqlDgMku_UA',
      'content-type': 'application/json;charset=utf-8'
    }
  }).then((response) => response.json())
    .then((data) => {
      //console.log(data);
      for (var json of data.results) {
        if (json.poster_path === null && json.backdrop_path === null) {
        }
        if (json.poster_path !== null) {
          const newelement = document.createElement("li");
          newelement.innerHTML = `<figure class="card__thumbnail"></figure> \
                <h3 class="card-title">${json.name}</h3> \
                <div class="card-content"> \
                  <h3>Description</h3> \
                  <p>${json.overview.substring(0, 200)}</p> \
                </div> \
                <div class="card-link-wrapper"> \
                  <p class="card-link">${json.first_air_date.split("-")[0]}</p> \
                </div>`
          newelement.setAttribute("style", `background:url('https://image.tmdb.org/t/p/original${json.poster_path}'); background-repeat: no-repeat; background-size: cover; background-position: center;`);
          newelement.setAttribute("id", json.id);
          newelement.setAttribute("class", "card");
          newelement.setAttribute("onclick", `cardclicked(${json.id}, "${json.name}", "tv");`);
          document.getElementById("stonertvlist").appendChild(newelement);
        }
      }
    }).catch(e => {
      console.log(e);
    });


  fetch('https://api.themoviedb.org/3/discover/tv?language=en-US&sort_by=popularity.desc&page=2&include_null_first_air_dates=false&with_keywords=302399%7C54169%7C10776%7C171235%7C241040%7C8224%7C258212%7C195631%7C243617%7C171401%7C195632%7C245911', {
    method: 'GET',
    headers: {
      'authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTljY2JkNDViNmY1MTJjN2E0YWZmMzA5MjIxZDgyOCIsInN1YiI6IjYzZDBhM2M3NjZhZTRkMDA5ZTlkZjY4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N5j1M7YnwmMTjIWMdYQbdh5suW2hCDucbqlDgMku_UA',
      'content-type': 'application/json;charset=utf-8'
    }
  }).then((response) => response.json())
    .then((data) => {
      //console.log(data);
      for (var json of data.results) {
        //console.log(json.id);
        //console.log(json.poster_path);
        //console.log(json.backdrop_path);
        if (json.poster_path === null && json.backdrop_path === null) {

        }
        if (json.poster_path !== null) {
          const newelement = document.createElement("li");
          newelement.innerHTML = `<figure class="card__thumbnail"></figure> \
                <h3 class="card-title">${json.name}</h3> \
                <div class="card-content"> \
                  <h3>Description</h3> \
                  <p>${json.overview.substring(0, 200)}</p> \
                </div> \
                <div class="card-link-wrapper"> \
                  <p class="card-link">${json.first_air_date.split("-")[0]}</p> \
                </div>`
          newelement.setAttribute("style", `background:url('https://image.tmdb.org/t/p/original${json.poster_path}'); background-repeat: no-repeat; background-size: cover; background-position: center;`);
          newelement.setAttribute("id", json.id);
          newelement.setAttribute("class", "card");
          newelement.setAttribute("onclick", `cardclicked(${json.id}, "${json.name}", "tv");`);
          document.getElementById("stonertvlist").appendChild(newelement);
        }
      }
    }).catch(e => {
      console.log(e);
    });
  //console.log(jsons);
  /*fetch('https://api.themoviedb.org/3/genre/tv/list', {
    method: 'GET',
    headers: {
      'authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTljY2JkNDViNmY1MTJjN2E0YWZmMzA5MjIxZDgyOCIsInN1YiI6IjYzZDBhM2M3NjZhZTRkMDA5ZTlkZjY4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N5j1M7YnwmMTjIWMdYQbdh5suW2hCDucbqlDgMku_UA',
      'content-type': 'application/json;charset=utf-8'
    }
  }).then((response) => response.json())
    .then((data) => {
      //console.log(data);
    }).catch(e => {
      console.log(e);
    });*/

  /*fetch('https://api.themoviedb.org/3/search/keyword?query=weed&page=1', {
    method: 'GET',
    headers: {
      'authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTljY2JkNDViNmY1MTJjN2E0YWZmMzA5MjIxZDgyOCIsInN1YiI6IjYzZDBhM2M3NjZhZTRkMDA5ZTlkZjY4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N5j1M7YnwmMTjIWMdYQbdh5suW2hCDucbqlDgMku_UA',
      'content-type': 'application/json;charset=utf-8'
    }
  }).then((response) => response.json())
    .then((data) => {
      //console.log(data);
    }).catch(e => {
      console.log(e);
    });*/
}

async function tvshowinitstonerexample() {

  fetch('https://api.themoviedb.org/3/discover/tv?language=en-US&sort_by=popularity.desc&page=1&include_null_first_air_dates=false&with_keywords=302399%7C54169%7C10776%7C171235%7C241040%7C8224%7C258212%7C195631%7C243617%7C171401%7C195632%7C245911', {
    method: 'GET',
    headers: {
      'authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTljY2JkNDViNmY1MTJjN2E0YWZmMzA5MjIxZDgyOCIsInN1YiI6IjYzZDBhM2M3NjZhZTRkMDA5ZTlkZjY4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N5j1M7YnwmMTjIWMdYQbdh5suW2hCDucbqlDgMku_UA',
      'content-type': 'application/json;charset=utf-8'
    }
  }).then((response) => response.json())
    .then((data) => {
      //console.log(data);
      for (var json of data.results) {
        if (json.poster_path === null && json.backdrop_path === null) {
        }
        if (json.poster_path !== null) {
          const newelement = document.createElement("li");
          var bookmarksrc = "assets/bookmark.png";
          if (localStorage.getItem('bookmarks')) {
            if (JSON.parse(localStorage.getItem('bookmarks')).find(tree => parseInt(tree.id) === parseInt(json.id))) {
              bookmarksrc = "assets/bookmarkfilled.png";
              console.log('FOUND BOOOKMARK');
            }
          }
          newelement.innerHTML = `<figure class="card__thumbnail"><img id="bookmarkButton-4-${json.id}" onmouseenter="bookmarkCardHovered(this)" onmouseleave="bookmarkCardHovered(this)" data="bookmarkButton" data-id=${json.id} data-type="tv" onclick="event.stopPropagation();bookmarkCard(this)" src="${bookmarksrc}"></figure> \
                <h3 class="card-title">${json.name}</h3> \
                <div class="card-content"> \
                  <h3>Description</h3> \
                  <p>${json.overview.substring(0, 200)}</p> \
                </div> \
                <div class="card-link-wrapper"> \
                  <p class="card-link">${json.first_air_date.split("-")[0]}</p> \
                </div>`
          newelement.setAttribute("style", `background:url('https://image.tmdb.org/t/p/original${json.poster_path}'); background-repeat: no-repeat; background-size: cover; background-position: center;`);
          newelement.setAttribute("id", json.id);
          newelement.setAttribute("class", "card");
          newelement.setAttribute("onclick", `cardclicked(${json.id}, "${json.name}", "tv");`);
          document.getElementById("stonertvlist").appendChild(newelement);
        }
      }
    }).catch(e => {
      console.log(e);
    });


  fetch('https://api.themoviedb.org/3/discover/tv?language=en-US&sort_by=popularity.desc&page=2&include_null_first_air_dates=false&with_keywords=302399%7C54169%7C10776%7C171235%7C241040%7C8224%7C258212%7C195631%7C243617%7C171401%7C195632%7C245911', {
    method: 'GET',
    headers: {
      'authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTljY2JkNDViNmY1MTJjN2E0YWZmMzA5MjIxZDgyOCIsInN1YiI6IjYzZDBhM2M3NjZhZTRkMDA5ZTlkZjY4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N5j1M7YnwmMTjIWMdYQbdh5suW2hCDucbqlDgMku_UA',
      'content-type': 'application/json;charset=utf-8'
    }
  }).then((response) => response.json())
    .then((data) => {
      //console.log(data);
      for (var json of data.results) {
        //console.log(json.id);
        //console.log(json.poster_path);
        //console.log(json.backdrop_path);
        if (json.poster_path === null && json.backdrop_path === null) {

        }
        if (json.poster_path !== null) {
          const newelement = document.createElement("li");
          var bookmarksrc = "assets/bookmark.png";
          if (localStorage.getItem('bookmarks')) {
            if (JSON.parse(localStorage.getItem('bookmarks')).find(tree => parseInt(tree.id) === parseInt(json.id))) {
              bookmarksrc = "assets/bookmarkfilled.png";
              console.log('FOUND BOOOKMARK');
            }
          }
          newelement.innerHTML = `<figure class="card__thumbnail"><img id="bookmarkButton-5-${json.id}" onmouseenter="bookmarkCardHovered(this)" onmouseleave="bookmarkCardHovered(this)" data="bookmarkButton" data-id=${json.id} data-type="tv" onclick="event.stopPropagation();bookmarkCard(this)" src="${bookmarksrc}"></figure> \
                <h3 class="card-title">${json.name}</h3> \
                <div class="card-content"> \
                  <h3>Description</h3> \
                  <p>${json.overview.substring(0, 200)}</p> \
                </div> \
                <div class="card-link-wrapper"> \
                  <p class="card-link">${json.first_air_date.split("-")[0]}</p> \
                </div>`
          newelement.setAttribute("style", `background:url('https://image.tmdb.org/t/p/original${json.poster_path}'); background-repeat: no-repeat; background-size: cover; background-position: center;`);
          newelement.setAttribute("id", json.id);
          newelement.setAttribute("class", "card");
          newelement.setAttribute("onclick", `cardclicked(${json.id}, "${json.name}", "tv")`);
          document.getElementById("stonertvlist").appendChild(newelement);
        }
      }
    }).catch(e => {
      console.log(e);
    });
  fetch('https://api.themoviedb.org/3/genre/tv/list', {
    method: 'GET',
    headers: {
      'authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTljY2JkNDViNmY1MTJjN2E0YWZmMzA5MjIxZDgyOCIsInN1YiI6IjYzZDBhM2M3NjZhZTRkMDA5ZTlkZjY4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N5j1M7YnwmMTjIWMdYQbdh5suW2hCDucbqlDgMku_UA',
      'content-type': 'application/json;charset=utf-8'
    }
  }).then((response) => response.json())
    .then((data) => {
      //console.log(data);
    }).catch(e => {
      console.log(e);
    });

  /*  fetch('https://private-anon-a708459cf9-superembed.apiary-proxy.com/?type=tmdb&id=85723&season=1&episode=1&max_results=5').then((response) => response.json())
      .then((data) => {
        console.log(data);
      }).catch(e => {
        console.log(e);
      });*/
  /*fetch('https://api.themoviedb.org/3/tv/37854', {
    method: 'GET',
    headers: {
      'authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTljY2JkNDViNmY1MTJjN2E0YWZmMzA5MjIxZDgyOCIsInN1YiI6IjYzZDBhM2M3NjZhZTRkMDA5ZTlkZjY4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N5j1M7YnwmMTjIWMdYQbdh5suW2hCDucbqlDgMku_UA',
      'content-type': 'application/json;charset=utf-8'
    }
  }).then((response) => response.json())
    .then((data) => {
      console.log(data);
    }).catch(e => {
      console.log(e);
    });*/
}
