'use strict';

exports.port = 8000;
exports.bindaddress = '0.0.0.0';

exports.loginserver = process.env.LOGIN_SERVER_URL || 'http://login:3001/api/';
exports.loginserverkeyalgo = "RSA-SHA1";
exports.loginserverpublickeyid = 1;
exports.loginserverpublickey =
	`-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkuI3YkpLCZi56Y+3U69H
AOC1ikvQzmVIg0bpNlrC/4/IOZ8BuJaBBZyq0AUSYmsdAJGa2lfrrK56fz9SZQXv
to9lgnSTX97zV3MrvvnAHbYo0Ulu96KaNLOpJTu9eVGSZ5RAmRucYCze2d5pZKDz
kOULrHNDRHY92KSFEw3eCGKgmWM+WdUsEZSoEBb1nrQ2ZG8BKszFJDJo8HcjtcxE
gjvnchp1WMQUeYYYsGSAkmBdlUA10v4DzK73yIopQ2isbmAaec44B27pPsxs2NCY
ithhrLRYOsh6EEM5crlQPXmOzqt1zXRZWStdA4qSGeLYMrf4P5aVomZ2R/JyysOk
TwIDAQAB
-----END PUBLIC KEY-----`;

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
