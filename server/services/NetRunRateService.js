const data = require('../config/data');
const computationService = require('./ComputationService');

function validateRequestedPosition(team, desiredPosition) {
    const pointsTableData = data.pointsTableData;
    if (desiredPosition >= pointsTableData[team].position) {
        return false;
    }
    return true;
}

function validateAndComputeNRR(responseData, postData) {
    // Fetching POST body data
    let team = postData.team;
    let opponentTeam = postData.opponent_team;
    let overs = Number(postData.overs);
    let desiredPosition = Number(postData.position);
    let toss = postData.toss_result;
    let runs = Number(postData.runs);

    //Validating requested position
    var isValidPosition = validateRequestedPosition(team, desiredPosition);

    if (!isValidPosition) {
        responseData.statusCode = 200;
        responseData.data = {
            'success': false,
            'errorMsg': 'Desired Position should be higher than current position'
        }

    } else {
        computeNRR({
            team: team,
            opponentTeam: opponentTeam,
            overs: overs,
            desiredPosition: desiredPosition,
            toss: toss,
            runs: runs,
        }, responseData);
    }
}

// Here NRR will be computed according to the Toss Result
// I have created 2 seperate methods for both the conditions
// Some conditions can be redundant in both, but it will be helpfull in terms of readibility and debugging
function computeNRR (formData, responseData) {  
    if (formData.toss == 'bat') {    
        computationService.computeNRRBatFirst(formData, responseData);  
    } else {
        computationService.computeNRRBowlFirst(formData, responseData);
    }
}


module.exports = {
    validateRequestedPosition,
    validateAndComputeNRR,
};