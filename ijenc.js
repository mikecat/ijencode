"use strict";

const char_table =
	" !\"#$%&'()*+,-./" +
	"0123456789:;<=>?" +
	"@ABCDEFGHIJKLMNO" +
	"PQRSTUVWXYZ[\\]^_" +
	"`abcdefghijklmno" +
	"pqrstuvwxyz{|}~\x7f" +
	"　▘▝▀▖▌▞▛▗▚▐▜▄▙▟█" +
	"・━┃╋┫┣┻┳┏┓┗┛◤◥◣◢" +
	"¥｡｢｣､･ｦｧｨｩｪｫｬｭｮｯ" +
	"ｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿ" +
	"ﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏ" +
	"ﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝﾞﾟ" +
	"←→↑↓♠♥♣♦⚫⚪十飯獣宇♪渦" +
	"飛盤⌇留爆弗箱階扉前大右括左弧苺";

const emoji_escape_table = [
	["🔟","十"],["🍙","飯"],["🐱","獣"],["👾","宇"],["🌀","渦"],
	["🚀","飛"],["🛸","盤"],["🚁","留"],["💥","爆"],["💰","弗"],
	["🧰","箱"],["📶","階"],["🚪","扉"],["🕴","前"],["🕺","大"],
	["💃","右"],["🏌","括"],["🏃","左"],["🚶","弧"],["🍓","苺"]
];

const emoji_inv_table = (function(t) {
	const ret = {};
	for (let i = 0; i < t.length; i++) {
		ret[t[i][1]] = t[i][0];
	}
	return ret;
})(emoji_escape_table);

function encode_string(str) {
	let ok = true;
	let ng_chars = "";
	const ng_set = {};

	for (let i = 0; i < str.length; i++) {
		const c = str.charAt(i);
		if (c in emoji_inv_table) {
			if (!(c in ng_set)) {
				ng_chars += c;
				ng_set[c] = true;
			}
			ok = false;
		}
	}
	for (let i = 0; i < emoji_escape_table.length; i++) {
		let e = emoji_escape_table[i][0], t = emoji_escape_table[i][1];
		while (str.indexOf(e) >= 0) str = str.replace(e, t);
	}

	const result = [];
	for (let i = 0; i < str.length; i++) {
		const c = str.charAt(i);
		if (c.charCodeAt(0) < 0x20) {
			result.push(c.charCodeAt(0));
		} else {
			const idx = char_table.indexOf(c);
			if (idx >= 0) {
				result.push(idx + 0x20);
			} else {
				if (!(c in ng_set)) {
					ng_chars += c;
					ng_set[c] = true;
				}
				ok = false;
			}
		}
	}
	return {"ok": ok, "result": result, "ng_chars": ng_chars};
}

function decode_string(data) {
	let result = "";
	let ok = true;
	for (let i = 0; i < data.length; i++) {
		const c = data[i];
		if (isNaN(c) || c < 0 || 0xff < c) {
			ok = false;
		} else if (c < 0x20) {
			result += String.fromCharCode(c);
		} else {
			const rc = char_table.charAt(c - 0x20);
			result += rc in emoji_inv_table ? emoji_inv_table[rc] : rc;
		}
	}
	return {"ok": ok, "result": result};
}

function enkoodo() {
	const data = document.getElementById("moziretu").value;
	const result = encode_string(data);
	if (result.ok) {
		document.getElementById("koodoretu").value = result.result.join(",");
	} else {
		alert("以下の使用できない文字が含まれています：" + result.ng_chars);
	}
	return result.ok;
}

function dekoodo() {
	const data = document.getElementById("koodoretu").value.split(",").map(x => parseInt(x));
	const result = decode_string(data);
	if (result.ok) {
		document.getElementById("moziretu").value = result.result;
	} else {
		alert("範囲外もしくは整数でないデータがあります。");
	}
	return result.ok;
}
