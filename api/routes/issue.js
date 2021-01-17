// Config
const getConfig = require("../util/config");

const express = require("express");
const router = express.Router();
const Issue = require("../models/issue");
// const User = require("../models/user");
// const Mailer = require("../mail/mailer");
// const Sonarr = require("../services/sonarr");
// const Radarr = require("../services/radarr");

router.post("/add", async (req, res) => {
  const newIssue = new Issue({
    mediaId: req.body.mediaId,
    type: req.body.type,
    title: req.body.title,
    user: req.body.user,
    sonarrId: false,
    radarrId: false,
    issue: req.body.issue,
    comment: req.body.comment,
  });

  try {
    const savedIssue = await newIssue.save();
    res.json(savedIssue);
    // mailRequest(user.id, request.id);
    // let sonarr = new Sonarr();
    // let radarr = new Radarr();
    // sonarr.getRequests();
    // radarr.getRequests();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "error adding issue" });
  }
});

// async function mailRequest(user, request) {
//   const prefs = getConfig();
//   let userData = await User.findOne({ id: user });
//   if (!userData) {
//     userData = {
//       email: prefs.adminEmail,
//     };
//   }
//   const requestData = await Request.findOne({ requestId: request });
//   console.log(requestData);
//   let type = requestData.type === "tv" ? "TV Show" : "Movie";
//   new Mailer().mail(
//     `You've just requested the ${type} ${requestData.title}`,
//     `${type}: ${requestData.title}`,
//     `Your request has been received and you'll receive an email once it has been added to Plex!`,
//     `https://image.tmdb.org/t/p/w500${requestData.thumb}`,
//     [userData.email]
//   );
// }

router.get("/all", async (req, res) => {
  const issues = await Issue.find();
  res.json(issues);
});

// router.get("/all", async (req, res) => {
//   const requests = await Request.find();
//   let data = {};
//   let sonarr = new Sonarr();
//   let radarr = new Radarr();
//   try {
//     let sonarrQ = await sonarr.queue();
//     let radarrQ = await radarr.queue();

//     data = {};

//     await Promise.all(
//       requests.map(async (request, i) => {
//         let children = [];

//         if (request.type === "movie" && request.radarrId.length > 0) {
//           for (let i = 0; i < Object.keys(request.radarrId).length; i++) {
//             let radarrIds = request.radarrId[i];
//             let rId = radarrIds[Object.keys(radarrIds)[0]];
//             let serverUuid = Object.keys(radarrIds)[0];
//             let server = new Radarr(serverUuid);
//             children[i] = {};
//             children[i].id = rId;
//             children[i].info = await server.movie(rId);
//             children[i].info.serverName = server.config.title;
//             children[i].status = [];
//             if (radarrQ[i]) {
//               for (let o = 0; o < radarrQ[i].records.length; o++) {
//                 if (radarrQ[i].records[o].movieId === rId) {
//                   children[i].status[o] = radarrQ[i].records[o];
//                 }
//               }
//             }
//           }
//         }

//         if (request.type === "tv" && request.sonarrId.length > 0) {
//           for (let i = 0; i < Object.keys(request.sonarrId).length; i++) {
//             let sonarrIds = request.sonarrId[i];
//             let sId = sonarrIds[Object.keys(sonarrIds)[0]];
//             let serverUuid = Object.keys(sonarrIds)[0];
//             let server = new Sonarr(serverUuid);
//             children[i] = {};
//             children[i].id = sId;
//             children[i].info = await server.series(sId);
//             children[i].info.serverName = server.config.title;
//             children[i].status = [];
//             if (sonarrQ[i]) {
//               for (let o = 0; o < sonarrQ[i].length; o++) {
//                 if (sonarrQ[i][o].series.id === sId) {
//                   children[i].status.push(sonarrQ[i][o]);
//                 }
//               }
//             }
//           }
//         }

//         data[request.requestId] = {
//           title: request.title,
//           children: children,
//           requestId: request.requestId,
//           type: request.type,
//           thumb: request.thumb,
//           imdb_id: request.imdb_id,
//           tmdb_id: request.tmdb_id,
//           tvdb_id: request.tvdb_id,
//           users: request.users,
//           sonarrId: request.sonarrId,
//           radarrId: request.radarrId,
//         };
//       })
//     );
//   } catch (err) {
//     console.log(err);
//     console.log(`ERR: Error getting requests`);
//   }
//   res.json(data);
// });

module.exports = router;