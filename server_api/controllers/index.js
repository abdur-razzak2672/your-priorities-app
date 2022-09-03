let express = require('express');
let router = express.Router();
let log = require('../utils/logger');
let toJson = require('../utils/to_json');
let path = require('path');
let fs = require('fs');
const {getSharingParameters, getFullUrl, getSplitUrl} = require("../utils/sharing_parameters");
const models = require("../models");

let replaceForBetterReykjavik = function (data) {
  return data.replace(/XmanifestPathX/g, "manifest_br");
};

let replaceForBetterIceland = function (data) {
  return data.replace(/XmanifestPathX/g, "manifest_bi");
};

let replaceForYrpri = function (data) {
  return data.replace(/XmanifestPathX/g, "manifest_yp");
};

let replaceForEngageBritain = function (data) {
  return data.replace(/XmanifestPathX/g, "manifest_eb");
};

let replaceForMyCityChallenge = function (data) {
  return data.replace(/XmanifestPathX/g, "manifest_my_city_challenge");
};

let replaceForTarsalgo = function (data) {
  return data.replace(/XmanifestPathX/g, "manifest_tarsalgo");
};

let replaceForOpenMontana = function (data) {
  return data.replace(/XmanifestPathX/g, "manifest_open_montana");
};

let replaceForParlScot = function (data) {
  return data.replace(/XmanifestPathX/g, "manifest_parlscott");
};

let replaceForJungesWien = function (data) {
  return data.replace(/XmanifestPathX/g, "manifest_junges_wien");
};

let replaceForSmarterNJ = function (data) {
  return data.replace(/XmanifestPathX/g, "manifest_smarternj");
};

let replaceForCommunityFund = function (data) {
  return data.replace(/XmanifestPathX/g, "manifest_community_fund");
};

let replaceFromEnv = function (data) {
  return data.replace(/XmanifestPathX/g, process.env.YP_INDEX_MANIFEST_PATH ? process.env.YP_INDEX_MANIFEST_PATH : "manifest_yp");
};

const plausibleCode = `
  <script defer data-domain="DATADOMAIN" src="https://plausible.io/js/plausible.js"></script>
  <script>window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }</script>
`;

const getPlausibleCode = (dataDomain) => {
  return plausibleCode.replace("DATADOMAIN", dataDomain);
}

const ziggeoHeaders = (ziggeoApplicationToken) => { return `
  <link rel="stylesheet" href="https://assets.ziggeo.com/v2-stable/ziggeo.css" />
  <script src="https://assets.ziggeo.com/v2-stable/ziggeo.js"></script>
  <script>
    var ziggeoApp = new ZiggeoApi.V2.Application({
      token:"${ziggeoApplicationToken}",
      webrtc_streaming_if_necessary: true,
      webrtc_on_mobile: true,
      debug: true
    });
  </script>
` };

const getCollection = async (req) => {
  return await new Promise(async (resolve, reject) => {
    try {
      let collection;
      const { splitUrl, splitPath, id } = getSplitUrl(req);
      if(!isNaN(id)) {
        if (splitUrl[splitPath]==='domain') {
          collection = req.ypDomain;
        } else if (splitUrl[splitPath]==='community') {
          collection = await models.Community.findOne({
            where: {
              id: id
            },
            attributes: ['id','name','description','language']
          });
        } else if (splitUrl[splitPath]==='group') {
          collection = await models.Group.findOne({
            where: {
              id: id
            },
            attributes: ['id','name','objectives','language']
          });
        } else if (splitUrl[splitPath]==='post') {
          collection = await models.Post.findOne({
            where: {
              id: id
            },
            attributes: ['id','name','description','language']
          });
        } else {
          collection = req.ypDomain;
          resolve({collection});
        }
        resolve({collection});
      } else {
        collection = req.ypDomain;
        resolve({collection});
      }
    } catch (error) {
      reject(error);
    }
  });
}

const replaceSharingData = async (req, indexFileData) => {
  return await new Promise(async (resolve, reject) => {
    try {

      const { collection } = await getCollection(req);

      const sharingParameters = await getSharingParameters(
        req,
        collection,
        getFullUrl(req),
        ""
      )

      indexFileData = indexFileData.replace(/XappNameX/g, sharingParameters.title);
      indexFileData = indexFileData.replace(/XdescriptionX/g, sharingParameters.description);
      indexFileData = indexFileData.replace(/Xogp:urlX/g, sharingParameters.url);
      indexFileData = indexFileData.replace(/Xogp:imageX/g, "");
      indexFileData = indexFileData.replace(/Xog:localeX/g, sharingParameters.locale);

      resolve(indexFileData);
    } catch (error) {
      reject(error);
    }
  });
}

let sendIndex = async (req, res) => {
  let indexFilePath;
  log.info('Index Viewed', { userId: req.user ? req.user.id : null });

  if (process.env.NODE_ENV === 'production' || process.env.FORCE_PRODUCTION === "true") {
    indexFilePath = path.resolve(__dirname, '../../client_app/build/bundled/index.html');
  } else {
    indexFilePath = path.resolve(__dirname, '../../client_app/index.html');
  }

  fs.readFile(indexFilePath, 'utf8', async (err, indexFileData) => {
    if (err) {
      console.error("Cant read index file");
      throw err;
    } else {
      var userAgent = req.headers['user-agent'];
      var ie11 = /Trident/.test(userAgent);
      if (!ie11) {
        indexFileData = indexFileData.replace('<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE11">','');
      }

      if (process.env.ZIGGEO_ENABLED && req.ypDomain.configuration.ziggeoApplicationToken) {
        indexFileData = indexFileData.replace(
          '<html lang="en">',
          `<html lang="en">${ziggeoHeaders(req.ypDomain.configuration.ziggeoApplicationToken)}`
        );
      }

      if (req.ypDomain.configuration && req.ypDomain.configuration.preloadCssUrl) {
        indexFileData = indexFileData.replace(
          '<html lang="en">',
          `<html lang="en"><link rel="stylesheet" href="${req.ypDomain.configuration.preloadCssUrl}">`
        );
      }

      if (req.ypDomain &&
          req.ypDomain.configuration &&
          req.ypDomain.configuration.plausibleDataDomains &&
          req.ypDomain.configuration.plausibleDataDomains.length>5) {
        indexFileData = indexFileData.replace('XplcX',getPlausibleCode(req.ypDomain.configuration.plausibleDataDomains));
      } else {
        indexFileData = indexFileData.replace('XplcX', '');
      }

      if (req.hostname) {
        if (req.hostname.indexOf('betrireykjavik.is') > -1) {
          indexFileData = replaceForBetterReykjavik(indexFileData);
        } else if (req.hostname.indexOf('betraisland.is') > -1) {
          indexFileData = replaceForBetterIceland(indexFileData);
        } else if (req.hostname.indexOf('smarter.nj.gov') > -1) {
          indexFileData = replaceForSmarterNJ(indexFileData);
        } else if (req.hostname.indexOf('puttingcommunitiesfirst.org.uk') > -1) {
          indexFileData = replaceForCommunityFund(indexFileData);
        } else if (req.hostname.indexOf('parliament.scot') > -1) {
          indexFileData = replaceForParlScot(indexFileData);
        } else if (req.hostname.indexOf('ypus.org') > -1) {
          indexFileData = replaceForYrpri(indexFileData);
        } else if (req.hostname.indexOf('mycitychallenge.org') > -1) {
          indexFileData = replaceForMyCityChallenge(indexFileData);
        } else if (req.hostname.indexOf('engagebritain.org') > -1) {
          indexFileData = replaceForEngageBritain(indexFileData);
        } else if (req.hostname.indexOf('tarsalgo.net') > -1) {
          indexFileData = replaceForTarsalgo(indexFileData);
        } else if (req.hostname.indexOf('junges.wien') > -1) {
          indexFileData = replaceForJungesWien(indexFileData);
        } else if (req.hostname.indexOf('openmontana.org') > -1) {
          indexFileData = replaceForOpenMontana(indexFileData);
        } else if (req.hostname.indexOf('yrpri.org') > -1) {
          indexFileData = replaceForYrpri(indexFileData);
        } else {
          indexFileData = replaceFromEnv(indexFileData);
        }
      } else {
        log.warn("No req.hostname");
        indexFileData = replaceFromEnv(indexFileData);
      }

      try {
        indexFileData = await replaceSharingData(req, indexFileData);
      } catch (error) {
        log.error(`Error in index.html creation: ${error}`);
      }

      res.send(indexFileData);
    }
  });
};

router.get('/', function(req, res) {
  sendIndex(req, res);
});

router.get('/domain*', function(req, res) {
  sendIndex(req, res);
});

router.get('/community*', function(req, res) {
  sendIndex(req, res);
});

router.get('/group*', function(req, res) {
  sendIndex(req, res);
});

router.get('/post*', function(req, res) {
  sendIndex(req, res);
});

router.get('/user*', function(req, res) {
  sendIndex(req, res);
});

module.exports = router;
