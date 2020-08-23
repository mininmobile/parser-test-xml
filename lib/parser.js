/**
 * @param {string} data
 */
function parse(data) {
	let tokens = tokenize(data);

	return JSON.stringify(tokens);
}

function tokenize(data) {
	let tokens = [];

	for (let i = 0; i < data.length; i++) {
		let c = data[i];
		let mode = MODE.normal;
		let temp = "";

		switch (mode) {
			case MODE.normal: {
				if (c == "<") {
					push();
					mode = MODE.tag;
				} else {
					temp += c;
				}
			} break;

			case MODE.tag: {
				if (c == ">") {
					push();
					mode = MODE.normal;
				} else if (c == " " || c == "=") {
					push();
				} else if (c == "\"") {
					mode = MODE.attribute;
				} else {
					temp += c;
				}
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
	header: 3,
	comment: 4,
}

module.exports = parse;
