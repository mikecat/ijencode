"use strict";

const char_table =
	" !\"#$%&'()*+,-./" +
	"0123456789:;<=>?" +
	"@ABCDEFGHIJKLMNO" +
	"PQRSTUVWXYZ[\\]^_" +
	"`abcdefghijklmno" +
	"pqrstuvwxyz{|}~ " +
	"　▘▝▀▖▌▞▛▗▚▐▜▄▙▟█" +
	"・━┃╋┫┣┻┳┏┓┗┛◤◥◣◢" +
	"¥。「」、。ヲァィゥェォャュョッ" +
	"ーアイウエオカキクケコサシスセソ" +
	"タチツテトナニヌネノハヒフヘホマ" +
	"ミムメモヤユヨラリルレロワン゛゜" /*+
	"←→↑↓♠♥♣♦⚫⚪🔟🍙🐱👾♪🌀" +
	"🚀🛸⌇🚁💥💰🧰📶🚪🕴🕺💃🏌🏃🚶🍓"*/;

function enkoodo() {
	const data = document.getElementById("moziretu").value;
	const result = [];
	for (let i = 0; i < data.length; i++) {
		const c = data.charAt(i);
		if (c.charCodeAt(0) < 0x20) {
			result.push(c.charCodeAt(0));
		} else {
			const idx = char_table.indexOf(c);
			result.push(idx >= 0 ? idx + 0x20 : -1);
		}
	}
	document.getElementById("koodoretu").value = result.join(",");
}

function dekoodo() {
	const data = document.getElementById("koodoretu").value.split(",");
	let result = "";
	for (let i = 0; i < data.length; i++) {
		const c = parseInt(data[i]);
		if (isNaN(c) || c < 0 || 0xff < c) {
			// nop
		} else if (c < 0x20) {
			result += String.fromCharCode(c);
		} else {
			result += char_table.charAt(c - 0x20);
		}
	}
	document.getElementById("moziretu").value = result;
}
