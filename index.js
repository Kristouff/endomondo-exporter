#!/usr/bin/env node
import 'cross-fetch/dist/node-polyfill.js';
import endomondo from 'endomondo-api-handler';
import yargs from 'yargs';
import luxon from 'luxon';
import fs from 'fs';

const { Api } = endomondo;
const { argv } = yargs;
const { DateTime } = luxon;

const api = new Api();

function checkCommandLine() {
    if (!argv.username || !argv.password) {
        console.error('ERROR: --username and --password are required');
        printHelp();
        process.exit(1);
    }
}

async function login() {
    console.log('Logging in...');
    return new Promise((resolve) => {
        api.login(argv.username, argv.password).then(token => resolve(token)).catch(e => {
            console.error('ERROR: Invalid username and/or password');
            process.exit(1);
        });
    });
}

function getWorkoutFilter() {
    let startDate = DateTime.fromObject({
        year: (argv.year ? argv.year : 1990),
        month: (argv.month ? argv.month : 1),
        day: (argv.day ? argv.day : 1)
    });
    let endDate = DateTime.fromObject({
        year: (argv.year ? argv.year : 2099),
        month: (argv.month ? argv.month : 12),
        day: (argv.day ? argv.day : 28)
    });
    endDate = DateTime.fromObject({
        year: (argv.year ? argv.year : 2099),
        month: (argv.month ? argv.month : 12),
        day: endDate.daysInMonth
    });
    let filter = {
        after: startDate,
        before: endDate
    }
    return filter;
}

function getFilename(workout) {
    let dir = (argv.dir ? argv.dir : '/tmp/');
    if (!dir.endsWith('/')) {
        dir += '/';
    }
    let date = workout.getStart().toISODate();
    let result = '';
    let i = 1;
    do {
        result = dir + date + '_' + i + '.gpx';
        if (fs.existsSync(result)) {
            i++;
            result = '';
        }
    } while (result == '');
    return result;
}

async function processWorkouts(filter) {
    await api.processWorkouts(filter, async (workout) => {
        if (workout.hasGPSData()) {
            let filename = getFilename(workout);
            let gpx = await api.getWorkoutGpx(workout.getId());
            fs.writeFileSync(filename, gpx, 'utf8');
            console.log('Exporting: ' + workout.toString() + ' to: ' + filename);
        }
    });
}

function printHelp() {
    console.log("--username=...     Required: Endomondo username");
    console.log("--password=...     Required: Endomondo password");
    console.log("--year=...         Optional: Year to export (default: all)");
    console.log("--month=...        Optional: Month to export (default: all)");
    console.log("--day=...          Optional: Day of month to export (default: all)");
    console.log("--dir=...          Optional: Destination directory (default: /tmp/)");
}

(async () => {
    checkCommandLine();
    await login();
    let filter = getWorkoutFilter();
    await processWorkouts(filter);
})();
