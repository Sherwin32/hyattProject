const ONE_DAY_MILISECONDS = 86400000;

const yargs = require("yargs");
const argv = yargs
    .option("head", { alias: "h", description: "the location you want to go (case sensitive)", default: 'https://www.hyatt.com/shop/apcal?' })
    .option("location", { alias: "l", description: "the location you want to go (case sensitive)", default: 'Alila Napa Valley' })
    .option("from", { alias: "f", description: "starting date for search (yyyy-mm-dd)", default: new Date().toISOString().split('T')[0] })
    .option("to", { alias: "t", description: "ending date for search (yyyy-mm-dd)", default: new Date((new Date().getTime() + ONE_DAY_MILISECONDS * 3)).toISOString().split('T')[0] })
    .option("nights", { alias: "n", description: "total nights to stay", default: 1 })
    .option("rooms", { alias: "r", description: "rooms", default: 1 })
    .option("adults", { alias: "a", description: "adults", default: 2 })
    .option("kids", { alias: "k", description: "kids", default: 0 })
    .help().argv;

const exec = require('child_process').exec;

try {
    main();
} catch (e) {
    console.error(e);
}

function main() {
    console.log(argv.location)
    console.log(argv.from)
    console.log(argv.to)
    console.log(argv.nights)
    generateUrl();
}

function generateUrl() {
    let dayStart = new Date(argv.from).getTime();
    let dayEnd = dayStart + ONE_DAY_MILISECONDS * argv.nights;
    let searchEnd = new Date(argv.to).getTime();
    let location = argv.location.split(' ').join('%20');
    let urlArr = []
    while (dayStart < searchEnd) {
        let checkinDate = new Date(dayStart).toISOString().split('T')[0]
        let checkoutDate = new Date(dayEnd).toISOString().split('T')[0]
        let url = `"${argv.head}location=${location}&checkinDate=${checkinDate}&checkoutDate=${checkoutDate}&rooms=${argv.rooms}&adults=${argv.adults}&kids=${argv.kids}&rate=Standard&rateFilter=woh"`;
        console.log(url)
        // window.open(url, '_blank');
        urlArr.push(url);
        dayStart = dayStart + ONE_DAY_MILISECONDS;
        dayEnd = dayEnd + ONE_DAY_MILISECONDS;
    }
    // return;
    for (let i=0; i<urlArr.length; i++) {
        setTimeout(() => {
            exec(`open -a "Google Chrome" ${urlArr[i]}`);
        }, 2000 * i)
    }
    // exec(`open -a "Google Chrome" ${urlArr.join(' ')} --args --incognito`);
}
//https://www.hyatt.com/shop/apcal?location=Alila%20Napa%20Valley&checkinDate=2022-03-30&checkoutDate=2022-03-31&rooms=1&adults=2&kids=0&rate=Standard&rateFilter=woh

// Example: node hyattScanner.js -f=2022-03-29 -t=2022-05-01 -l='Alila Ventana Big Sur' -h='https://www.hyatt.com/shop/sjcal?'