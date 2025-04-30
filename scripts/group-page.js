"use strict";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

const musicInfoUrl = `https://seido-webservice-307d89e1f16a.azurewebsites.net/api/MusicGroup/ReadItem?id=${id}&flat=false`;

let groupName = document.getElementById("group-name");
let genre = document.getElementById("genre");
let bandYear = document.getElementById("band-year");

let artists = document.getElementById("artists");
let albums = document.getElementById("albums");

async function fetchMusicGroupInfo() {
    try {
        const response = await fetch(musicInfoUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const musicGroupInfo = await response.json();
        console.log(musicGroupInfo.name);

        groupName.innerText = musicGroupInfo.name;
        genre.innerText = musicGroupInfo.genre;
        bandYear.innerText = musicGroupInfo.establishedYear;

        for (const artist of musicGroupInfo.artists) {
            let liTag = document.createElement("li");
            liTag.textContent = (`${artist.firstName} ${artist.lastName}`);
            artists.appendChild(liTag);
        }

        for (const album of musicGroupInfo.albums) {
            let liTag = document.createElement("li");
            liTag.textContent = (`${album.name}   Released: ${album.releaseYear}`);
            albums.appendChild(liTag);
        }
    }
    catch (error) {
        console.error(`Error fetching data: ${error}`);
    }
}

fetchMusicGroupInfo();