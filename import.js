var admin = require('firebase-admin');

var serviceAccount = require('./Radio-ae4759384ba2.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://radio-a8e0f.firebaseio.com'
});
const fetch = require("node-fetch");
const moment = require("moment");

var db = admin.database();
var ref = db.ref("/");

let today = moment().startOf('day').format("YYYY-MM-DDTHH:mm:ss");
let tommorrow = moment().add(1, 'days').startOf('day').format("YYYY-MM-DDTHH:mm:ss");

const tv_channels = [{
    id: 8,
    name: "RTÉ One",
    slug: "RTE_1"
}, {
    id: 10,
    name: "RTÉ Two",
    slug: "RTE_2"
}, {
    id: 6,
    name: "RTÉ Junior",
    slug: "RTEJr"
}]

const radio_channels = [{
    id: 20,
    slug: "junior",
    name: "Junior"
},
{
    id: 22,
    slug: "gold",
    name: "Gold"
},
{
    id: 16,
    slug: "lyricfm",
    name: "Lyric fm"
},
{
    id: 1,
    slug: "2fm",
    name: "2 fm"
},
{
    id: 18,
    slug: "2xm",
    name: "2 xm"
},
{
    id: 24,
    slug: "radio1extra",
    name: "Radio One Extra"
},
{
    id: 23,
    slug: "pulse",
    name: "Pulse"
},
{
    id: 9,
    slug: "radio1",
    name: "Radio One"
},
{
    id: 17,
    slug: "rnag",
    name: "Raidió na Gaeltachta"
}
];
var channelsRef = ref.child("stations");

tv_channels.forEach(c => {
    slug = c.slug.toLowerCase();
    channelsRef.child(slug).set({
        name: c.name,
        slug: c.slug.toLowerCase()
    })
})

radio_channels.forEach(c => {
    slug = c.slug.toLowerCase();
    channelsRef.child(slug).set({
        name: c.name,
        slug: c.slug.toLowerCase()
    })
})


function getSchedule(url, callback) {

    return fetch(url).then(response => response.json())

};





tv_channels.forEach(channel => {
    let url = `https://www.rte.ie/tv_listing/${today}/${tommorrow}/RTEGUIDE_${channel.slug}.json`;
    //console.log(url);
    let tv_promise = getSchedule(url)
    var slotRef = ref.child("slots");
    slotRef.remove();//delete the jaysus thing
    tv_promise.then(result => {
        makeTvSchdules(result.listings, channel)
        //console.log("i'm done with TV!")
    }).catch(err => {
        console.log(err)
    })
});


let radioDate = moment().format("YYYY-MM-DD");
let radioUrl = `https://s3-eu-west-1.amazonaws.com/radiodj-radio-schedules/${radioDate}.json`;
//console.log(radioUrl);
let radio_promise = getSchedule(radioUrl);
radio_promise.then(result => {
    //console.log(`Got ${result.length} from radio`);    
    result.map(slot => {
        let station = slot.station_name
        let schedule = slot.slot
        let stationSlug = slot.station
        console.log(`Radio station: ${station}`)
        schedule.map(s => {
            makeRadioSchedules(s, station);
            console.log(slot.station)
            console.log(s.prog_description);
        })
    })
}).catch(err => {
    console.log(err);
})



function makeRadioSchedules(channel, stationSlug) {
    let slotRef = ref.child("slots/");
    let slot = {}
    slot.title = channel.title;
    slot.prog_description = channel.prog_description;
    slot.type = "PROG";
    slot.start = moment.utc(channel.start).format();
    slot.end = moment.utc(channel.end).format();
    slot.station_name = channel.station_name;
    slot.date = moment.utc(channel.date).format("YYYY-MM-DD");
    slot.image = channel.image;
    slot.station = channel.station_name;
    slot.studio = channel.studio;
    //console.log(slot)
    slotRef.push(slot).then(snap => {
        let k = [snap.key]
        //console.log(`Your key sir ${snap.key}`)
        channelsRef.child(`${stationSlug.toLowerCase()}/slot`).update({
            [k]: true
        })
    })
};

function makeTvSchdules(listings, channels) {
    let slotRef = ref.child("slots/");
    let slug = `${channels.slug.toLowerCase()}`;
    //console.log(slug)
    listings.map(channel => {
        let slot = {}
        slot.title = channel.PROGRAMM;
        slot.prog_description = channel.LIVEDESCRIPTION;
        slot.type = "PROG";
        slot.start = moment.utc(channel.DATE).format();
        slot.end = moment.utc(channel.DATE).add(channel.DURATION, 'minutes').format();
        slot.station_name = channels.name;
        slot.date = moment.utc(channel.DATE).format("YYYY-MM-DD");
        slot.image = `https://img.rasset.ie/${channel.IMAGEREF}.jpg`;
        slot.station = channels.id;
        slot.studio = "";
        slotRef.push(slot)
            .then(snap => {
                //console.log(channels.slug.toLowerCase())
                //let slug = channels.id
                let k = [snap.key]
                channelsRef.child(`${channels.slug.toLowerCase()}/slot`).update({
                    [k]: true
                })
            })
    })
};
