/**
 * @param {string} data
 */
function parse(data) {
	const MODE = {
		normal: 0,
		tagHeader: 1,
		tagAttrName: 2,
		tagAttrValue: 3,
		unknown: -1,
	}

	let tokens = tokenize(data);

	let tree = [];
	let mode = MODE.normal;
	let temp = {};

	for (let i = 0; i < tokens.length; i++) {
		let t = tokens[i];
	}

	return JSON.stringify(tree);
}

function tokenize(data) {
	const MODE = {
		normal: 0,
		tag: 1,
		attribute: 2,
		comment: 3,
		//header: 4,
	}

	let tokens = [];

	let mode = MODE.normal;
	let temp = "";
	let escape = false;

	for (let i = 0; i < data.length; i++) {
		let c = data[i];

		switch (mode) {
			case MODE.normal: {
				if (c == "<") {
					push();
					mode = MODE.tag;
					tokens.push("<");
				} else {
					temp += c;
				}
			} break;

			case MODE.tag: {
				if (c == ">") {
					push();
					mode = MODE.normal;
					tokens.push(">");
				} else if (c == "/") {
					tokens[tokens.length - 1] = "</";
				} else if (c == " " || c == "=") {
					push();
				} else if (c == "\"") {
					mode = MODE.attribute;
				} else if (c == "?") {
					// ignore lol
				} else if (c == "!") {
					mode = MODE.comment;
				} else {
					temp += c;
				}
			} break;

			case MODE.attribute: {
				if (c == "\"" && escape == false) {
					push();
					mode = MODE.tag;
				} else if (c == "\\") {
					escape = true;
				} else {
					temp += c;
					escape = false;
				}
			} break;

			case MODE.comment: if (c == "-" && data[i + 1] == "-" && data[i + 2] == ">") {
				tokens.pop();
				mode = MODE.normal;
				temp = "";
				i += 2;
			} break;
		}
	}

	return tokens;

	function push() {
		if (temp.trim().length > 0)
			tokens.push(temp.trim());

		temp = "";
	}
}

module.exports = parse;
