const express= require('express');
const router = express.Router();
const ops = require('../models&ops/dbops');
const findCopsNearMe = ops.findCopsNearMe;
const fetchCopDetails = ops.fetchCopDetails;

router.get('/cop_page', (req, res) => {
    res.render('cop', {userId : req.query.userId} );
});
router.get('/civilian_page', (req, res) => {
    res.render('civilian', {userId : req.query.userId} );
});

router.get('/cops', async (req, res) => {

    //extract coordinates and find cops nearby

    const lat = req.query.lat; //modify get req with lat and lon
    const lon = req.query.lon;

    const obj = await findCopsNearMe([lon, lat], 2000); // obj is a bunch of mongo documents
    res.json({  // sends json as a response- need to connect to frontend
    copsNearMe : obj
    });
});


router.get('/cops/info', async (req, res)=>{
const userId = req.query.userId;
const obj = await fetchCopDetails(userId); 
res.json({
    copDetails: obj
});
});

router.get('/data', (req, res) => {
    res.render('data');
});

router.get('/requests/info', async (req, res) => {
    const results = await ops.fetchRequests(); // fetch requests from db
    const features = [];
    // convert the fetched requests to GeoJSON and return
    for (let i = 0; i < results.length; i++) {
        features.push({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: results[i].location.coordinates
            },
            properties: {
                status: results[i].status,
                requestTime: results[i].requestTime,
                address: results[i].location.address
            }
        });
    }

    const geoJsonData = {
        type: 'FeatureCollection',
        features: features
    }

    res.json(geoJsonData);
});



module.exports = router;

