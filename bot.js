// ==UserScript==
// @name         Bing BOT 0.2
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  the bot allows you to find information by key phrase!
// @author       Alexander Churkin
// @match        https://www.bing.com/*
// @match        https://napli.ru/
// @match        https://kiteuniverse.ru/
// @match        https://motoreforma.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

let links = document.links;
let btnK = document.getElementsByName("search")[0];
let arrow = document.querySelector(".sb_pagN_bp");

let sites = {
	"napli.ru": [
		"Установка и настройка Git",
		"10 самых популярных шрифтов от Google",
		"Отключение редакций и ревизий в WordPress",
		"Вывод произвольных типов записей и полей в WordPress",
	],
	"kiteuniverse.ru": ["Kite Universe", "Ветровые арт инсталляции", "Фестиваль воздушных змеев"],
	"motoreforma.com": [
		"Мотореформа",
		"прошивки для CAN-AM",
		"тюнинг для квадроциклов CAN-AM",
		"вариатор CV-Tech для Can-Am",
	],
};
let site = Object.keys(sites)[getRandom(0, Object.keys(sites).length)];
let keywords = sites[site];
let keyword = keywords[getRandom(0, keywords.length)];
let googleInput = document.getElementsByName("q")[0];

if (btnK !== undefined) {
	document.cookie = `site=${site}`;
} else if (location.hostname == "www.bing.com") {
	site = getCookie("site");
} else {
	site = location.hostname;
}

if (btnK !== undefined) {
	let i = 0;
	let timerId = setInterval(() => {
		googleInput.value += keyword[i];
		i++;
		if (i == keyword.length) {
			clearInterval(timerId);
			btnK.click();
		}
	}, 200);
} else if (location.hostname == site) {
	alert(`вы попали на сайт ${site}`)
	// setInterval(() => {
	// 	let index = getRandom(0, links.length);
	// 	if (getRandom(0, 101) > 70) {
	// 		location.href = "https://www.bing.com/";
	// 	}
	// 	if (links[index].href.indexOf(site) !== -1) links[index].click();
	// }, getRandom(3000, 5000));
	// ветвлление работает на странице поисковика ищет ссылку сайта
} else {
	let nextGooglePage = true;
	for (let i = 0; i < links.length; i++) {
		if (links[i].href.indexOf(site) !== -1) {
			let link = links[i];
			nextGooglePage = false;
			console.log("Нашел строку " + link);
			setTimeout(() => {
				link.click();
			}, getRandom(3000, 4000));
			break;
		}
	}
	let elementExist = setInterval(() => {
		let elemLink = document.querySelector(".sb_pagS_bp");
		if (arrow !== null) {
			if (elemLink.innerText == "5") {
				nextGooglePage = false;
				location.href = "https://www.bing.com/";
			}
			clearInterval(elementExist);
		}
	}, 100);

	if (nextGooglePage) {
		setTimeout(() => {
			arrow.click();
		}, getRandom(2000, 4000));
	}
}

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function getCookie(name) {
	let matches = document.cookie.match(
		new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)")
	);
	return matches ? decodeURIComponent(matches[1]) : undefined;
}
