const searchField = $('#search_field')
const goBtn = $('#search-button')
const placeholderDiv = $('#plot')
const container =$('.container')
const video= $('#video-space')
const titleDiv =$('#title')
const pBox =$('#p-box')
var input = ''

goBtn.on('click', function(event) {
    event.preventDefault()
    console.log(searchField.val())
    input = searchField.val()
    inputStr= input.replace(/\s+/g, '-').toLowerCase()
    console.log(input)
    getInfo(input)
})
function getInfo (input) {
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
    if(response.redirect) {
        input = response.slug
        inputStr= input.replace(/\s+/g, '-').toLowerCase()
        getInfo()
    }
    else {
            // console.log(response.description);
            //console.log(response.clip.clips.full)
            // console.log(response.background_image)
            // console.log(response.released)
            // console.log(response.stores)
            placeholderDiv.html(response.description)
            video.html('<img src=' + response.background_image + '>' )
            titleDiv.html(response.name) 
            getYT()
        }
    }).catch(function (error) {
        if(error.status===404) {
            pBox.empty()
            pBox.append("Game " + error.statusText)

        }
    });
}


function getYT() {
    var userInput = input
    var queryURL = "https://www.googleapis.com/youtube/v3/search? + key + part=snippet&key=AIzaSyCa_6yhtb95grtNTn6fca0k_dhcGkioEjk&type=video&q=" + userInput
    $.ajax({
        url:queryURL,
        method:"GET",
}).then(function(response) {
for(var i = 0; i < 3; i++) {
    $("#youtube").append('<div class="player"><iframe width="420" height="315" src="https://www.youtube.com/embed/' + response.items[i].id.videoId + '"frameborder="0" allowfullscreen></iframe></div>');
}
})
}


const openModalButtons = document.querySelectorAll("[data-modal-target]")
const closeModalButtons = document.querySelectorAll("[data-close-button]")
const overlay = document.getElementById("overlay")

openModalButtons.forEach(button => {
    button.addEventListener("click", () =>{
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
    })
})

closeModalButtons.forEach(button => {
    button.addEventListener("click", () =>{
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