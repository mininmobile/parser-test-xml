const fs = require("fs");
const parser = require("./lib/parser");

let args = process.argv.splice(2);

if (args[0] == "--help" || args[0] == "-h" || args[0] == "/?" || args[0] == undefined) {
	console.log([
		"usage:",
		"  /? -h --help\tshows this message",
		"  [in]\tparses a file and prints info to stdout",
		"  [in] [out]\tparses a file and saves info to file",
	].join("\n"));
} else if (args[0]) {
	fs.readFile(args[0], "UTF-8", (err, data) => {
		if (err)
			throw new Error(err);

		let info = parser(data) + "\n";

		if (args[1]) {
			fs.writeFileSync(args[1], info, (e) => {
				if (e)
					console.error(e);
			});
		} else {
			process.stdout.write(info);
		}
	});
}
