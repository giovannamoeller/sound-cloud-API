// Criação do Objeto

let SoundCloudAPI = {} // por padrão, objeto normalmente começa com letra maíuscula

var UI = {}

UI.clear = () => { // limpar todos os cards
    document.querySelector(".cards").innerHTML = ""
}

// Pegar valor do input

UI.enterPress = () => {
    UI.clear()
    document.querySelector(".js-search").addEventListener('keyup', e => {
        if (e.which == 13) {
            SoundCloudAPI.getMusica(document.querySelector(".input-search").value)
        }
    })
}

UI.click = () => {
    UI.clear()
    document.querySelector(".js-submit").addEventListener('click', () => {
        SoundCloudAPI.getMusica(document.querySelector(".input-search").value)
    })
}

UI.enterPress()
UI.click()

// SoundCloud API - inicializar

SoundCloudAPI.init = () => { // init é uma propriedade do seu novo objeto
    SC.initialize({
        client_id: 'cd9be64eeb32d1741c17cb39e41d254d'
    });
}

SoundCloudAPI.init()

// Buscar músicas de acordo com o que foi digitado

SoundCloudAPI.getMusica = inputValue => {
    SC.get('/tracks', {
        q: inputValue
    }).then(tracks => {
        SoundCloudAPI.mostrarMusica(tracks)
    });
}

// Mostrar as músicas (criação dinâmica de "cards")

SoundCloudAPI.mostrarMusica = tracks => {
    if (tracks == ""){
        document.querySelector(".cards").innerHTML = "Não foi encontrado nenhum resultado!"
    } else {
        tracks.forEach(track => {
            var card = document.createElement('div')
            card.classList.add("card")
    
            var imgDiv = document.createElement('div')
            imgDiv.classList.add("img")
    
            var imgImg = document.createElement('img')
            imgImg.classList.add("image_img")
            // imgImg.src = track.artwork_url || '.....'
            if (track.artwork_url == null) {
                imgImg.src = "https://imagens.canaltech.com.br/empresas/3182.400.jpg"
                imgImg.width = "100"
                imgImg.height = "100"
            } else {
                imgImg.src = track.artwork_url
            }
    
            var content = document.createElement('div')
            content.classList.add("content")
    
            var header = document.createElement('header')
            header.classList.add("header")
            header.innerHTML = `<a href = ${track.permalink_url} target = "_blank">${track.title}</a>`
    
            var buttonDiv = document.createElement('div')
            buttonDiv.classList.add('ui', 'bottom', 'attached', 'button', 'js-button')
            var icon = document.createElement('i')
            icon.classList.add('add', 'icon')
            var span = document.createElement('span')
            span.innerHTML = "Add to playlist"
    
            var searchResults = document.querySelector('.js-search-results')
    
            searchResults.appendChild(card)
            card.appendChild(imgDiv)
            imgDiv.appendChild(imgImg)
            card.appendChild(content)
            content.appendChild(header)
            card.appendChild(buttonDiv)
            buttonDiv.appendChild(icon)
            buttonDiv.appendChild(span)
            buttonDiv.addEventListener('click', () => {
                SoundCloudAPI.playMusic(track.permalink_url)
            })
        })
    }
}

// Adiciona na playlist e toca a música

SoundCloudAPI.playMusic = link => {
    console.log(link)
    SC.oEmbed(`${link}`, {
        auto_play: true
    }).then(function (embed) {
        var sideBar = document.querySelector(".js-playlist")
        var box = document.createElement('div')
        sideBar.appendChild(box)
        box.innerHTML = embed.html
        sideBar.insertBefore(box, sideBar.firstChild)

        localStorage.setItem("key", sideBar.innerHTML) // key é o nome dado para os dados gravados
    });
}

var sideBar = document.querySelector(".js-playlist")
sideBar.innerHTML = localStorage.getItem("key") // coloca o conteúdo do localStorage na sideBar
