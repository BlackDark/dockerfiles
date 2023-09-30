const express = require("express");
const Trakt = require("trakt.tv");
const fs = require("fs");

const router = express.Router();

const CONFIG_DIR = process.env.CONFIG_DIR;

let options = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  debug: process.env.TRAKT_DEBUG || false,
};

const trakt = new Trakt(options);

let CACHED_TOKEN = null;

const storeConfig = (config) => {
  fs.writeFileSync(`${CONFIG_DIR}/trakt.json`, JSON.stringify(config));
};

const loadConfig = () => {
  if (fs.existsSync(`${CONFIG_DIR}/trakt.json`)) {
    try {
      const file = fs.readFileSync(`${CONFIG_DIR}/trakt.json`, "utf-8");
      CACHED_TOKEN = JSON.parse(file);
      return true;
    } catch (error) {
      console.error("Could load token from file");
      return false;
    }
  }

  return false;
};

// https://trakt.docs.apiary.io/#reference/search/id-lookup/get-id-lookup-results
const authenticate = async () => {
  try {
    const result = await trakt.get_codes();

    console.log(result.verification_url);
    console.log(result.user_code);
    await trakt.poll_access(result);
  } catch (error) {
    console.log(error);
  }

  const newToken = trakt.export_token();

  CACHED_TOKEN = newToken;
  console.log("Requested new token");
  storeConfig(newToken);
  return newToken;
};

const syncToTrakt = async (body) => {
  const tvdb = body.tvdb;
  const imdb = body.imdb;
  const type = body.type;
  const completed = body.completed;

  if (!completed) {
    return "Not completed. Ignoring";
  }

  if (!tvdb && !imdb) {
    return "No imdb and tvdb provided";
  }

  if (!CACHED_TOKEN) {
    if (!loadConfig()) {
      await authenticate();
    }
  }

  trakt.import_token(CACHED_TOKEN).then((newTokens) => {
    CACHED_TOKEN = newTokens;

    if (CACHED_TOKEN !== newTokens) {
      console.log("Refreshed token");
      storeConfig(newTokens);
    }
  });

  const historyType = type === "Episode" ? "episodes" : "movies";
  const searchType = type === "Episode" ? "episode" : "movie";
  const searchKind = imdb ? "imdb" : "tvdb";
  // searchids trakt,tvdb,tmdb,imdb

  let response = {};

  const searchThingy = async () => {
    const searchResult = await trakt.search.id({
      type: searchType,
      id_type: searchKind,
      id: imdb || tvdb,
    });

    if (searchResult.length > 0) {
      // maybe do something about scoure etc
      const example = [
        {
          type: "episode",
          score: 1000,
          episode: {
            season: 1,
            number: 3,
            title: "Tokiwadai is Targeted",
            ids: {
              trakt: 755412,
              tvdb: 1191341,
              imdb: "tt1530846",
              tmdb: 749403,
              tvrage: 1064860610,
            },
          },
          show: {
            title: "A Certain Scientific Railgun",
            year: 2009,
            ids: {
              trakt: 30843,
              slug: "a-certain-scientific-railgun",
              tvdb: 114921,
              imdb: "tt1515996",
              tmdb: 30977,
              tvrage: null,
            },
          },
        },
      ];

      if (searchType === "episode") {
        return searchResult[0].episode.ids.trakt;
      }
      return searchResult[0].movie.ids.trakt;
    }
  };

  const addWatched = async () => {
    const idSearch = {};

    if (imdb) {
      idSearch.imdb = imdb;
    } else {
      idSearch.tvdb = tvdb;
    }

    const watcher = await trakt.sync.history.add({
      [historyType]: [
        {
          ids: idSearch,
        },
      ],
    });

    return {
      response: watcher,
      triggered: true,
    };
  };

  const traktId = await searchThingy();

  const result = await trakt.sync.history.get({
    type: historyType,
    id: traktId || imdb || tvdb,
  });

  console.log(historyType, imdb, tvdb);

  response.history = result;

  if (result.length < 0) {
    const watchedResult = await addWatched();
    response.addToWatched = watchedResult;
  }
  return response;
};

router.post("/", async (req, res) => {
  const expected = {
    imdb: req.body.imdb || null,
    tvdb: req.body.tvdb || null,
    completed: req.body.completed === "True",
    type: req.body.type,
  };

  const result = await syncToTrakt(expected);
  res.json(result);
});

module.exports = router;
