var express = require('express');
var router = express.Router();
const data = require('../config/data');
const NetRunRateService = require('../services/NetRunRateService');

router.get('/teams', function (req, res, next) {
    const pointsTableData = data.pointsTableData;
    res.status(200).send(Object.values(pointsTableData));
});

router.post('/submit_nrr_form', (req, res, next) => {
    let postData = req.body;

    if (Object.keys(postData).length < 1) {
        res.status(400).json({
            'success': false,
            'errorMsg': 'Bad Request!'
        });

    } else {
        let responseData = {};
        NetRunRateService.validateAndComputeNRR(responseData, postData);
        res.status(responseData.statusCode).json(responseData.data);
    }

});

module.exports = router;
