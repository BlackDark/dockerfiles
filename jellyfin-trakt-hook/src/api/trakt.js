const express = require("express");
const Trakt = require("trakt.tv");
const fs = require("fs");

const router = express.Router();

const CONFIG_DIR = process.env.CONFIG_DIR;
const DEBUG_HEADERS = process.env.DEBUG_HEADERS;

let options = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  debug: process.env.TRAKT_DEBUG || false,
};

const trakt = new Trakt(options);

let CACHED_TOKEN = null;
let TRAKT_TOKEN_IMPORTED = false;
let timeout = undefined;

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
      console.error(error, `[Trakt loadConfig] Could load token from file`);
      return false;
    }
  }

  return false;
};

// https://trakt.docs.apiary.io/#reference/search/id-lookup/get-id-lookup-results
const authenticate = async () => {
  try {
    const result = await trakt.get_codes();
    console.log(
      `Use Code: ${result.user_code} with URL: ${result.verification_url}`
    );
    await trakt.poll_access(result);
    console.log("[Trakt authenticate] Successfully authenticated device.");
  } catch (error) {
    console.error(
      `[Trakt authenticate] Trakt authentication error: ${JSON.stringify(
        error
      )}`
    );
  }

  const newToken = trakt.export_token();

  storeConfig(newToken);
  console.log("[Trakt authenticate] Exported token to file.");

  CACHED_TOKEN = newToken;
  TRAKT_TOKEN_IMPORTED = true;
  return newToken;
};

const validateToken = async () => {
  if (!CACHED_TOKEN) {
    if (!loadConfig()) {
      await authenticate();
    }
  }

  if (!TRAKT_TOKEN_IMPORTED) {
    console.log("[Trakt validateToken] Import token into trakt ...");
    try {
      const newTokens = await trakt.import_token(CACHED_TOKEN);
      console.log("[Trakt validateToken] Imported token");

      if (JSON.stringify(CACHED_TOKEN) !== JSON.stringify(newTokens)) {
        console.log("[Trakt validateToken] Refreshed token");
        storeConfig(newTokens);
        CACHED_TOKEN = newTokens;
      }
    } catch (err) {
      console.log(`Failed loading token: ${JSON.stringify(err)}`);
      throw err;
    }
  }

  // 24 hours before expiry
  const expiresInMs = new Date(trakt._authentication.expires) - new Date();

  if (timeout == null) {
    let timeoutms = expiresInMs - 24 * 60 * 60 * 1000;
    timeoutms = Math.max(timeoutms, 0);
    // refresh at least every week
    timeoutms = Math.min(timeoutms, 7 * 24 * 60 * 60 * 1000);

    console.log(
      `[Trakt validateToken] Next token refresh in ${timeoutms / 1000} seconds`
    );
    timeout = setTimeout(async () => {
      console.log(
        "[Trakt validateToken] Timeout triggered. Refreshing token ..."
      );

      try {
        await trakt.refresh_token();
        const newToken = trakt.export_token();

        if (JSON.stringify(CACHED_TOKEN) !== JSON.stringify(newToken)) {
          console.log("[Trakt validateToken] Refreshed token");
          storeConfig(newToken);
          CACHED_TOKEN = newToken;
        }
      } catch (err) {
        console.log(`Failed refreshing token: ${JSON.stringify(err)}`);
        CACHED_TOKEN = undefined;
      }
      timeout = undefined;
    }, timeoutms);
  }
};

const syncToTrakt = async (body) => {
  const tvdb = body.tvdb;
  const imdb = body.imdb;
  const type = body.type;
  const completed = body.completed;

  if (!completed) {
    console.log(
      `[Trakt syncToTrakt] Provided video not completed. Ignoring. ${JSON.stringify(
        body
      )}`
    );
    return "Not completed. Ignoring";
  }

  if (!tvdb && !imdb) {
    console.log(
      `[Trakt syncToTrakt] No imdb and tvdb provided. ${JSON.stringify(body)}`
    );
    return "No imdb and tvdb provided";
  }

  await validateToken();

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
      // const example = [
      //   {
      //     type: "episode",
      //     score: 1000,
      //     episode: {
      //       season: 1,
      //       number: 3,
      //       title: "Tokiwadai is Targeted",
      //       ids: {
      //         trakt: 755412,
      //         tvdb: 1191341,
      //         imdb: "tt1530846",
      //         tmdb: 749403,
      //         tvrage: 1064860610,
      //       },
      //     },
      //     show: {
      //       title: "A Certain Scientific Railgun",
      //       year: 2009,
      //       ids: {
      //         trakt: 30843,
      //         slug: "a-certain-scientific-railgun",
      //         tvdb: 114921,
      //         imdb: "tt1515996",
      //         tmdb: 30977,
      //         tvrage: null,
      //       },
      //     },
      //   },
      // ];

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

  console.log(`[Trakt syncToTrakt] Search for trakt id ...`);

  const traktId = await searchThingy();

  if (traktId) {
    console.log(`[Trakt syncToTrakt] Found trakt id: ${traktId}`);
  } else {
    console.log(`[Trakt syncToTrakt] Did not find trakt id.`);
  }

  const result = await trakt.sync.history.get({
    type: historyType,
    id: traktId || imdb || tvdb,
  });

  response.history = result;

  if (result.length <= 0) {
    console.log(
      `[Trakt syncToTrakt] Add watched (traktid: ${traktId} / imdb: ${imdb} / tvdb: ${tvdb})`
    );
    const watchedResult = await addWatched();

    console.log(
      `[Trakt syncToTrakt] Successfully added (traktid: ${traktId} / imdb: ${imdb} / tvdb: ${tvdb})`
    );
    response.addToWatched = watchedResult;
  } else {
    console.log(
      `[Trakt syncToTrakt] Already watched (traktid: ${traktId} / imdb: ${imdb} / tvdb: ${tvdb})`
    );
  }

  return response;
};

router.post("/", async (req, res) => {
  const expected = {
    imdb: req.body.imdb || null,
    tvdb: req.body.tvdb || null,
    tmdb: req.body.tmdb || null,
    completed: req.body.completed === "True",
    type: req.body.type,
  };

  // console.log(CACHED_TOKEN);

  console.log(
    `[Trakt post] Request body: ${JSON.stringify(
      req.body
    )} - Transformed: ${JSON.stringify(expected)}`
  );

  if (DEBUG_HEADERS) {
    console.log(`Headers: ${JSON.stringify(req.headers)}`);
  }

  const result = await syncToTrakt(expected);
  res.json(result);
});

module.exports = router;
