const fs = require('fs');
const path = require('path');

exports.port = 8000;
exports.bindaddress = '0.0.0.0';

exports.loginserver = process.env.LOGIN_SERVER_URL || 'http://login:3001/api/';
exports.loginserverkeyalgo = "RSA-SHA1";
exports.loginserverpublickeyid = 1;

try {
	exports.loginserverpublickey = fs.readFileSync(path.join(__dirname, 'public.pem'), 'utf8');
} catch (err) {
	console.error("Warning: Could not read public.pem. Login verification may fail.");
	exports.loginserverpublickey = '';
}

exports.routes = {
	root: 'localhost',
	client: 'localhost',
	dex: 'dex.pokemonshowdown.com',
	replays: 'localhost',
};

exports.crashguard = true;
exports.reportjoins = true;
exports.reportbattles = true;
exports.reportbattlejoins = true;
exports.forcetimer = true;
exports.backdoor = false;
exports.consoleips = ['127.0.0.1'];
exports.watchconfig = true;
exports.logchat = false;
exports.logchallenges = false;

exports.subprocesses = {
	network: 1,
	simulator: 1,
	validator: 1,
	verifier: 1,
};
