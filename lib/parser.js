/**
 * @param {string} data
 */
function parse(data) {
	let tokens = tokenize(data);

	return JSON.stringify(tokens);
}

function tokenize(data) {
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

			case MODE.comment: if (c == ">") {
				push();
				mode = MODE.normal;
				tokens.pop();
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

const MODE = {
	normal: 0,
	tag: 1,
	attribute: 2,
	comment: 3,
	//header: 4,
}

module.exports = parse;
