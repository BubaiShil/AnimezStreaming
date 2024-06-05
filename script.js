const search = document.querySelector(".search input")
const btn = document.querySelector(".search button")
const grid_title = document.querySelector(".favorites h1")
let main_grid = document.querySelector(".favorites .anime-grid")
const popup_contain = document.querySelector(".popup-container")



function add_card_click(cards) {
    cards.forEach(card => {
        card.addEventListener('click', () => {
            cardPOP(card)

        })
    })
}

async function fetchHomePage() {
    try {
        const response = await fetch("https://api-aniwatch.onrender.com/anime/home");
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error.message);
        throw error;
    }
}

async function handleHomePage() {
    try {
        const homeData = await fetchHomePage();
        //console.log('Fetched home data:', homeData);

        
        main_grid.innerHTML = ''; 

        // Check if homeData.top10Animes is an object
        if (typeof homeData.top10Animes === 'object' && homeData.top10Animes !== null) {
            if (Array.isArray(homeData.top10Animes.today)) {
                main_grid.innerHTML = homeData.top10Animes.today.map(anime => {
                    return `
                     <div class="card" data-id="${anime.id}">
    					<div class="img">
    						<img src="${anime.poster}" alt="">
    					</div>
    					<div class="info">
    						<h2>${anime.name}</h2>
    						<div class="single-info">
    							<span>Rate: </span>
    							<span>${anime.rating}</span>
    						</div>
    						<div class="single-info">
                            <span>Sub Epi: </span>
                            <span class="span1">${anime.episodes.sub}</span>
                            <span>Dub Epi: </span>
                            <span class="span2">${anime.episodes.dub}</span>
    						</div>
    					</div>
    				</div> 
                    `;
                }).join('');
            } else {
                console.error('Data.top10Animes.today is not an array:', homeData.top10Animes.today);
            }
        } else {
            console.error('Data.top10Animes is not an object:', homeData.top10Animes);
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}


async function searchInp(DynaSearch) {
    try {
        const response = await fetch(`https://api-aniwatch.onrender.com/anime/search?q=${DynaSearch}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error.message);
        throw error; 
    }
}

btn.addEventListener('click', searched_item);

async function searched_item(event) {
    event.preventDefault(); 
    try {
        const data = await searchInp(search.value);
        //console.log('Fetched data:', data);
        // Handle the data here
        grid_title.innerText = "Search Results..."

        // Check if data is an array
        main_grid.innerHTML = '';

        // Check if data.animes is an array
        if (Array.isArray(data.animes)) {
            // Use map function on the data.animes array
            main_grid.innerHTML = data.animes.map(anime => {
                // console.log(anime.name); // Assuming 'name' is a property of each anime
                // console.log(anime.id);
                return `
                <div class="card" data-id="${anime.id}">
                <div class="img">
                    <img src="${anime.poster}" alt="">
                </div>
                <div class="info">
                    <h2>${anime.name}</h2>
                    <div class="single-info">
                        <span>Rating: </span>
                        <span>${anime.rating}</span>
                    </div>
                    <div class="single-info">
                        <span>Sub Epi: </span>
                        <span class="span1">${anime.episodes.sub}</span>
                        <span>Dub Epi: </span>
                        <span class="span2">${anime.episodes.dub}</span>
                    </div>
                </div>
            </div>
                `
            }).join('')

            const cards = document.querySelectorAll(".card")
            add_card_click(cards)

        }
        else {
            console.error('Data.animes is not an array:', data.animes);
        }


    } catch (error) {
        console.error('Error:', error.message);
    }
}

window.addEventListener('load', handleHomePage);

async function get_anime_by_info(card) {
    //console.log("cardclick" + card);
    const dataId = card.dataset.id;
    //console.log(dataId);
    const resp = await fetch(`https://api-aniwatch.onrender.com/anime/info?id=${dataId}`)
    const respData = await resp.json()
    return respData
}



async function getAnimeEpisodes(episodeId) {
    try {
        const response = await fetch(`https://api-aniwatch.onrender.com/anime/episodes/${episodeId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error.message);
        throw error;
    }
}


async function cardPOP(card) {
    try {
        const additionalData = await get_anime_by_info(card);
        const animeId = card.dataset.id;

        // Fetch episodes data for the animeId
        const episodesData = await getAnimeEpisodes(animeId);
        const posterSrc = card.querySelector('.img img').src;
        const title = card.querySelector('.info h2').innerText;

        popup_contain.classList.add('show-popup');
        popup_contain.style.background = `linear-gradient(rgba(0, 0, 0, .8), rgba(0, 0, 0, 1)), url(${posterSrc})`;
        popup_contain.style.backgroundSize = 'cover';

        const episodes = episodesData.episodes;

        popup_contain.innerHTML = `
            <span class="x-icon">&#10006;</span>
            <div class="content">
                <div class="left">
                    <div class="poster-img">
                        <img src="${posterSrc}" alt="">
                    </div>
                    <div class="single-info">
                        <span>Add to favorites:</span>
                        <span class="heart-icon">&#9829;</span>
                    </div>
                </div>
                <div class="right">
                    <h1>${title}</h1>
                    <h3>${additionalData.anime.info.stats.type}</h3>
                    <div class="single-info-container">
                        <div class="single-info">
                            <span>Quality:</span>
                            <span>${additionalData.anime.info.stats.quality}</span>
                        </div>
                        <div class="single-info">
                            <span>Length:</span>
                            <span>${additionalData.anime.info.stats.duration}</span>
                        </div>
                        <div class="single-info">
                            <span>Episode Links</span>
                            <button class="episode-link-btn">View Episodes</button>
                        </div>
                    </div>
                    <div class="genres">
                        <h2>Genres</h2>
                        <ul>
                            ${additionalData.anime.moreInfo.genres.join(', ')}
                        </ul>
                    </div>
                    <div class="overview">
                        <h2>Overview</h2>
                        <p>${additionalData.anime.info.description}</p>
                    </div>
                </div>
            </div>
        `;

        const episodeLinkBtn = document.querySelector('.episode-link-btn');
        const episodeLinksContainer = document.createElement('div');


        episodeLinksContainer.innerHTML = "PLEASE WAIT..."


        episodeLinkBtn.addEventListener('click', async () => {
            episodes.forEach(async (episode) => {
                const episodeId = episode.episodeId;
                const episodeSrcs = await fetch(`https://api-aniwatch.onrender.com/anime/episode-srcs?id=${episodeId}&server=vidstreaming&category=sub`);
                const episodeData = await episodeSrcs.json();

                const episodeUrl = episodeData.sources[0].url;
                const link = document.createElement('a');
                link.href = episodeUrl;
                link.textContent = `Episode ${episodeId}`;
                link.target = '_blank';
                episodeLinksContainer.appendChild(link);
                episodeLinksContainer.appendChild(document.createElement('br'));
            });

            document.body.appendChild(episodeLinksContainer);
            episodeLinksContainer.classList.add('episode-popup', 'show-popup');
        });

        const x_icon = document.querySelector('.x-icon');
        x_icon.addEventListener('click', () => {
            popup_contain.classList.remove('show-popup');
            episodeLinksContainer.classList.remove('show-popup');
        });
    } catch (error) {
        console.error('Error fetching additional data:', error.message);
    }
}



