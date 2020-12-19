const searchField = $('#search_field')
const goBtn = $('#search-button')
const placeholderDiv = $('#plot')
const container = $('.container')
const video = $('#video-space')
const titleDiv = $('#title')
const pBox = $('#p-box')
var input = ''

goBtn.on('click', function (event) {
    event.preventDefault()
    console.log(searchField.val())
    input = searchField.val()
    inputStr = input.replace(/\s+/g, '-').toLowerCase()
    console.log(input)
    getInfo(input)
})
function getInfo(input) {
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://rawg-video-games-database.p.rapidapi.com/games/" + inputStr,
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "7524861152msh237a3378b10e9bfp1a411ejsn270bb159b78f",
            "x-rapidapi-host": "rawg-video-games-database.p.rapidapi.com"
        }
    };
    $.ajax(settings).then(function (response) {
        console.log(!!response)
        if (response.redirect) {
            input = response.slug
            inputStr = input.replace(/\s+/g, '-').toLowerCase()
            getInfo()
        }
        else {
            // console.log(response.description);
            //console.log(response.clip.clips.full)
            // console.log(response.background_image)
            // console.log(response.released)
            // console.log(response.stores)
            placeholderDiv.html(response.description)
            video.html('<img src=' + response.background_image + '>')
            titleDiv.html(response.name)
            getYT()
        }
    }).catch(function (error) {
        pBox.empty()
        if (error.status === 404) {
            pBox.append("Game " + error.statusText)
        }
        else if (error.status >= 500) {
            pBox.append("Server Down, Please try again later")
        }
    });
}


function getYT() {
    var userInput = input
    var queryURL = "https://www.googleapis.com/youtube/v3/search? + key + part=snippet&key=AIzaSyCa_6yhtb95grtNTn6fca0k_dhcGkioEjk&type=video&q=" + userInput
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        for (var i = 0; i < 3; i++) {
            $("#youtube").append('<div class="player"><iframe width="250" height="250" src="https://www.youtube.com/embed/' + response.items[i].id.videoId + '"frameborder="0" allowfullscreen></iframe></div>');
        }
    })
}


var top10 = $('#top-10')
var top10Btn = $('#10-btn')



function top10Fun() {
    const listSettings = {
        "async": true,
        "crossDomain": true,
        "url": "https://rawg-video-games-database.p.rapidapi.com/games",
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "7524861152msh237a3378b10e9bfp1a411ejsn270bb159b78f",
            "x-rapidapi-host": "rawg-video-games-database.p.rapidapi.com"
        }
    };

    $.ajax(listSettings).done(function (response) {
        gameArray = response.results;
        for (let i = 0; i < 10; i++) {
            const currentGame = gameArray[i];
            console.log(currentGame.name)
            top10.append('<p>' + currentGame.name)

        }




    });
}
top10Btn.on('click', top10Fun())
