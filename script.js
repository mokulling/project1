const searchField = $('#search_field')
const goBtn = $('#search-button')
const placeholderDiv = $('#plot')
const container = $('.container')
const video = $('#video-space')
const titleDiv = $('#title')
const pBox = $('#p-box')
const youtubeDiv = $("#youtube")
const lastsearchDiv = $("#pGames")
var input = ''
var gameArray = JSON.parse(localStorage.getItem("prevGames")) || []
var top10 = $('#top-10')
var top10Btn = $('#10-btn')

goBtn.on('click', function (event) {
    $('#alert').hide()
    event.preventDefault()
    pBox.empty()
    input = searchField.val()
    inputStr = input.replace(/\s+/g, '-').toLowerCase()
    $("#balloon").empty()
    getInfo(input)
})
function getInfo(input) {
    $("body").attr("id", 'tv');
$("body").css("color", "white");
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
        if (response.redirect) {
            input = response.slug
            inputStr = input.replace(/\s+/g, '-').toLowerCase()
            getInfo()
        }
        else {
            placeholderDiv.html(response.description)
            video.html('<img src=' + response.background_image + '>')
            title = response.name
            titleDiv.html(title)
            removeDuplicates
            gameArray.push(title)
            addToList()
            getYT()
            $('#yBtn').show()
        }
    }).catch(function (error) {
        $('#alert').show()
        if (error.status === 404) {
            $('#balloon').append("Game " + error.statusText)
        }
        else if (error.status >= 500) {
            $('#balloon').append("Server Down, Please try again later")
        }
    });
}
function getYT() {
    youtubeDiv.empty()
    var userInput = input
    var queryURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyCa_6yhtb95grtNTn6fca0k_dhcGkioEjk&type=video&q=" + userInput
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        for (var i = 0; i < 3; i++) {
            $(youtubeDiv).append('<div class="player"><iframe width="250" height="250" src="https://www.youtube.com/embed/' + response.items[i].id.videoId + '"frameborder="0" allowfullscreen></iframe></div>');
        }
    }).catch(function (error) {
        if (error.status === 403) {
            youtubeDiv.text("youtube quota is full, please try again tomorrow")
        }
    })
}
function addToList() {
    removeDuplicates()
    JSON.parse(localStorage.getItem("prevGames"))
    for (var i = 0; i < gameArray.length; i++) {
        var glist = $('<li>' + gameArray[i] + "</li>")
        lastsearchDiv.prepend(glist)
    }
}
function removeDuplicates() {
    gameArrayUnique = gameArray.filter(
        function (a) { if (!this[a]) { this[a] = 1; return a; } }, {}
    )
    gameArray = gameArrayUnique
    maxGameArray()
    localStorage.setItem('prevGames', JSON.stringify(gameArray))
    lastsearchDiv.empty()
}
function maxGameArray() {
    if (gameArray.length === 5) {
        gameArray.shift()
    }
}
function getPastSearch(event) {
    var target = event.target;
    if (event.target.matches("li")) {
        input = target.textContent.trim(2);
        inputStr = input.replace(/\s+/g, '-').replace(/:|!/g,'').replace(/\(|\)/g, "").toLowerCase()
        input=inputStr
        $("#balloon").empty()
        pBox.empty()
        getInfo();
        $('#alert').hide()
    }
}
$(document).on("click", getPastSearch);
addToList()

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
        topGameArray = response.results;
        top10.empty()
        for (let i = 0; i < 10; i++) {
            const currentGame = topGameArray[i];
            top10.append('<li>' + currentGame.name)
        }
    });
}
$(top10Btn).on('click', top10Fun)

const openModalButtons = document.querySelectorAll("[data-modal-target]")
const closeModalButtons = document.querySelectorAll("[data-close-button]")
const overlay = document.getElementById("overlay")

openModalButtons.forEach(button => {
    button.addEventListener("click", () => {
        const modal = document.querySelector(button.dataset.modalTarget) 
        openModal(modal)
    })
})
closeModalButtons.forEach(button => {
    button.addEventListener("click", () => {
        const modal = button.closest('.modal')
        closeModal(modal)
    })
})
function openModal(modal) {
    if (modal == null) return
    modal.classList.add('active')
    overlay.classList.add('active')
}
function closeModal(modal) {
    if (modal == null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
}

$('#alert').hide()