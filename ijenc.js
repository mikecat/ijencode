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

const character_convert_table = {
	"　":" ", "！":"!", "”":"\"", "＃":"#", "＄":"$", "％":"%", "＆":"&", "’":"'",
	"（":"(", "）":")", "＊":"*", "＋":"+", "，":",", "－":"-", "．":".", "／":"/",
	"０":"0", "１":"1", "２":"2", "３":"3", "４":"4", "５":"5", "６":"6", "７":"7",
	"８":"8", "９":"9", "：":":", "；":";", "＜":"<", "＝":"=", "＞":">", "？":"?",
	"＠":"@", "Ａ":"A", "Ｂ":"B", "Ｃ":"C", "Ｄ":"D", "Ｅ":"E", "Ｆ":"F", "Ｇ":"G",
	"Ｈ":"H", "Ｉ":"I", "Ｊ":"J", "Ｋ":"K", "Ｌ":"L", "Ｍ":"M", "Ｎ":"N", "Ｏ":"O",
	"Ｐ":"P", "Ｑ":"Q", "Ｒ":"R", "Ｓ":"S", "Ｔ":"T", "Ｕ":"U", "Ｖ":"V", "Ｗ":"W",
	"Ｘ":"X", "Ｙ":"Y", "Ｚ":"Z", "［":"[", "￥":"\\", "］":"]", "＾":"^", "＿":"_",
	"‘":"`", "ａ":"a", "ｂ":"b", "ｃ":"c", "ｄ":"d", "ｅ":"e", "ｆ":"f", "ｇ":"g",
	"ｈ":"h", "ｉ":"i", "ｊ":"j", "ｋ":"k", "ｌ":"l", "ｍ":"m", "ｎ":"n", "ｏ":"o",
	"ｐ":"p", "ｑ":"q", "ｒ":"r", "ｓ":"s", "ｔ":"t", "ｕ":"u", "ｖ":"v", "ｗ":"w",
	"ｘ":"x", "ｙ":"y", "ｚ":"z", "｛":"{", "｜":"|", "｝":"}", "￣":"~",

	"。":"｡", "「":"｢", "」":"｣", "、":"､", "ヲ":"ｦ", "ァ":"ｧ", "ィ":"ｨ", "ゥ":"ｩ",
	"ェ":"ｪ", "ォ":"ｫ", "ャ":"ｬ", "ュ":"ｭ", "ョ":"ｮ", "ッ":"ｯ", "ー":"ｰ", "ア":"ｱ",
	"イ":"ｲ", "ウ":"ｳ", "エ":"ｴ", "オ":"ｵ", "カ":"ｶ", "キ":"ｷ", "ク":"ｸ", "ケ":"ｹ",
	"コ":"ｺ", "サ":"ｻ", "シ":"ｼ", "ス":"ｽ", "セ":"ｾ", "ソ":"ｿ", "タ":"ﾀ", "チ":"ﾁ",
	"ツ":"ﾂ", "テ":"ﾃ", "ト":"ﾄ", "ナ":"ﾅ", "ニ":"ﾆ", "ヌ":"ﾇ", "ネ":"ﾈ", "ノ":"ﾉ",
	"ハ":"ﾊ", "ヒ":"ﾋ", "フ":"ﾌ", "ヘ":"ﾍ", "ホ":"ﾎ", "マ":"ﾏ", "ミ":"ﾐ", "ム":"ﾑ",
	"メ":"ﾒ", "モ":"ﾓ", "ヤ":"ﾔ", "ユ":"ﾕ", "ヨ":"ﾖ", "ラ":"ﾗ", "リ":"ﾘ", "ル":"ﾙ",
	"レ":"ﾚ", "ロ":"ﾛ", "ワ":"ﾜ", "ン":"ﾝ", "゛":"ﾞ", "゜":"ﾟ",

	"を":"ｦ", "ぁ":"ｧ", "ぃ":"ｨ", "ぅ":"ｩ", "ぇ":"ｪ", "ぉ":"ｫ", "ゃ":"ｬ", "ゅ":"ｭ",
	"ょ":"ｮ", "っ":"ｯ", "あ":"ｱ", "い":"ｲ", "う":"ｳ", "え":"ｴ", "お":"ｵ", "か":"ｶ",
	"き":"ｷ", "く":"ｸ", "け":"ｹ", "こ":"ｺ", "さ":"ｻ", "し":"ｼ", "す":"ｽ", "せ":"ｾ",
	"そ":"ｿ", "た":"ﾀ", "ち":"ﾁ", "つ":"ﾂ", "て":"ﾃ", "と":"ﾄ", "な":"ﾅ", "に":"ﾆ",
	"ぬ":"ﾇ", "ね":"ﾈ", "の":"ﾉ", "は":"ﾊ", "ひ":"ﾋ", "ふ":"ﾌ", "へ":"ﾍ", "ほ":"ﾎ",
	"ま":"ﾏ", "み":"ﾐ", "む":"ﾑ", "め":"ﾒ", "も":"ﾓ", "や":"ﾔ", "ゆ":"ﾕ", "よ":"ﾖ",
	"ら":"ﾗ", "り":"ﾘ", "る":"ﾙ", "れ":"ﾚ", "ろ":"ﾛ", "わ":"ﾜ", "ん":"ﾝ",

	"ガ":"ｶﾞ", "ギ":"ｷﾞ", "グ":"ｸﾞ", "ゲ":"ｹﾞ", "ゴ":"ｺﾞ",
	"ザ":"ｻﾞ", "ジ":"ｼﾞ", "ズ":"ｽﾞ", "ゼ":"ｾﾞ", "ゾ":"ｿﾞ",
	"ダ":"ﾀﾞ", "ヂ":"ﾁﾞ", "ヅ":"ﾂﾞ", "デ":"ﾃﾞ", "ド":"ﾄﾞ",
	"バ":"ﾊﾞ", "ビ":"ﾋﾞ", "ブ":"ﾌﾞ", "ベ":"ﾍﾞ", "ボ":"ﾎﾞ",
	"パ":"ﾊﾟ", "ピ":"ﾋﾟ", "プ":"ﾌﾟ", "ペ":"ﾍﾟ", "ポ":"ﾎﾟ",

	"が":"ｶﾞ", "ぎ":"ｷﾞ", "ぐ":"ｸﾞ", "げ":"ｹﾞ", "ご":"ｺﾞ",
	"ざ":"ｻﾞ", "じ":"ｼﾞ", "ず":"ｽﾞ", "ぜ":"ｾﾞ", "ぞ":"ｿﾞ",
	"だ":"ﾀﾞ", "ぢ":"ﾁﾞ", "づ":"ﾂﾞ", "で":"ﾃﾞ", "ど":"ﾄﾞ",
	"ば":"ﾊﾞ", "び":"ﾋﾞ", "ぶ":"ﾌﾞ", "べ":"ﾍﾞ", "ぼ":"ﾎﾞ",
	"ぱ":"ﾊﾟ", "ぴ":"ﾋﾟ", "ぷ":"ﾌﾟ", "ぺ":"ﾍﾟ", "ぽ":"ﾎﾟ"
};

function encode_string(str, do_convert = false) {
	let ok = true;
	let ng_chars = "";
	const ng_set = {};

	if (do_convert) {
		let str2 = "";
		for (let i = 0; i < str.length; i++) {
			const c = str.charAt(i);
			str2 += c in character_convert_table ? character_convert_table[c] : c;
		}
		str = str2;
	}

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
	const henkansuru = document.getElementById("henkansuru").checked;
	const result = encode_string(data, henkansuru);
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
