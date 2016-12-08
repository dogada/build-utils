#!/usr/bin/env node

var program = require('commander');
var Command = program.Command;
var Option = program.Option;

var fs = require('fs');
var fsExtra = require('fs-extra');
var moment = require('moment');
var Promise = require('bluebird');
var util = require('util')
var exec = require('child_process').exec;

function puts(err, stdout, stderr) {
    if (err) throw new Error(err)
}
// var fs = Promise.promisifyAll(fs, {suffix: 'Promise'});

program
    .option('-v, --verbose', 'verbose');

program
    .command('save')
    .alias('s')
    .option('-f, --filename [filename]', 'source filename', 'docker-compose.yml')
    .option('-P, --path [path]', 'target path', __dirname + '/.tmp/')
    .action(function(options) {
        var dateFolder = moment().format('DD-MM-YYYY');
        try {
            fs.lstatSync(options.filename);
            fsExtra.copy(options.filename, options.path + dateFolder + '/' + options.filename);
            console.log('copied');
        } catch (e) {
            console.log('default filename - "' + options.filename + '" not exists in directory');
        }
    });

program
    .command('list')
    .alias('l')
    .option('-P, --path [path]', 'target path', __dirname + '/.tmp/')
    .action(function (options) {

    });
program
    .command('mac-alias-clean')
    .option('-i, --iface [iface]', 'networkinterface')
    .option('-s, --section [section]', 'in which section will search')
    .action(function(options) {

        if (!options.iface) return;

        function ips(out) {
            var maskPattern = /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/g;
            return out.match(maskPattern).filter(ip => {
                if (ip === '127.0.0.1') return;
                console.log(`ifconfig lo0 ${ip} -alias`);
                return Promise.fromCallback(cb => exec(`ifconfig ${options.iface} ${ip} -alias`, cb))
            })
        }

        function getSectionsAddresses() {

            var maskPattern = /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\/[0-9]{1,2}/;
            var betweenSession = new RegExp(`#### BEGIN ${options.section}((.|[\r\n])+)#### END ${options.section}`);
            var file = fs.readFileSync('/etc/hosts', 'utf8');
            file = file.match(betweenSession) ? file.match(betweenSession)[1] : false;
            if (!file) return [];
            var ips = file.match(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/g);
            return ips || [];
        }

        function execPromise(ip) {
            return Promise.formCallback(cb => exec(`ifconfig lo0 ${ip} -alias`, cb));
        }

        Promise.resolve(getSectionsAddresses()).map(ips);
    });

program
    .command('mac-alias')
    .option('-m, --mask [mask]', 'searching specific mask')
    .option('-s, --section [section]', 'in which section will search')
    .action(function(options) {
        if (!options.mask) return;
        if (!options.section) return;

        function aliasing(err, file) {

            var maskPattern = /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\/[0-9]{1,2}/;
            var betweenSession = new RegExp(`#### BEGIN ${options.section}((.|[\r\n])+)#### END ${options.section}`);

            file = file.match(betweenSession)[1];

            if(!options.mask.match(maskPattern)) return;

            var ip = options.mask.split('/')[0];
            var decMask = options.mask.split('/')[1];
            if (decMask%8 !== 0) return;

            var partIp = decMask/8;
            var partsIp = ip.split('.');
            var partsIpLength = partsIp.length;
            if(partsIpLength != 4) return;

            var startPosition = partsIpLength - partIp;
            var i = startPosition;
            for (i; i < 4; i++)
                partsIp[i] = '[0-9]+';

            var defaultMask = new RegExp(partsIp.join('\\.'), 'g');
            var aliasedIps = file.match(defaultMask);

            if (!(aliasedIps.length > 0)) return;
            console.log(`ifconfig alias lo0 ${aliasedIps}`);
            aliasedIps.forEach(ip => {
                exec(`ifconfig lo0 alias ${ip}`, puts)
            });

            console.log('done')
        }
        fs.readFile('/etc/hosts', 'utf8', aliasing)
    });

program.parse(process.argv);

if (!program.args.length) program.help();