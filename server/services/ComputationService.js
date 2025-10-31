const data = require('../config/data');
const { getTeamByPosition } = require('../services/TeamsService');

const pointsTableData = data.pointsTableData;

function computeNRRBatFirst(formData, responseData) {
    const runsScored = formData.runs;
    const matchOvers = oversFaced = formData.overs;
    const desiredPosition = formData.desiredPosition;

    const team = pointsTableData[formData.team];
    const opponentTeam = pointsTableData[formData.opponentTeam];
    const desiredPositionTeam = getTeamByPosition(desiredPosition);

    const totalRunsScored = team.for.runs + runsScored;
    const totalOversFaced = team.for.overs + oversFaced;
    const totalRunsConceded = team.against.runs;
    const totalOversBowled = team.against.overs;

    let targetNRR = desiredPositionTeam.nrr;
    let minRunsToConcede = null;
    let maxRunsToConcede = null;
    let minNRR = null;
    let maxNRR = null;
    let upperBoundNRR = null;
    let lowerBoundNRR = null;
    if (desiredPosition > 1) {
        upperBoundNRR = getTeamByPosition(desiredPosition - 1).nrr;
    }
    if (desiredPosition < 8) {
        lowerBoundNRR = getTeamByPosition(desiredPosition + 1).nrr
    }
    var tempNRR = null;
    let withinUpperLimit = null;
    let withinLowerLimit = null;

    if (opponentTeam.key == desiredPositionTeam.key) {
        const opponentTotalRunsScored = opponentTeam.for.runs;
        const opponentTotalOversFaced = opponentTeam.for.overs;
        const opponentTotalRunsConceded = opponentTeam.against.runs + runsScored;
        const opponentTotalOversBowled = opponentTeam.against.overs + matchOvers;

        for (let i = 0; i <= runsScored; i++) {
            tempNRR = computeRunRate(totalRunsScored, totalOversFaced, totalRunsConceded + i, totalOversBowled + matchOvers);
            targetNRR = computeRunRate(opponentTotalRunsScored + i, opponentTotalOversFaced + matchOvers, opponentTotalRunsConceded, opponentTotalOversBowled);   // Opponent NRR

            withinUpperLimit = upperBoundNRR ? tempNRR < upperBoundNRR : true;
            withinLowerLimit = lowerBoundNRR ? tempNRR > lowerBoundNRR : true;

            if (tempNRR >= targetNRR && minRunsToConcede == null) {
                if (withinLowerLimit && withinUpperLimit) {
                    maxNRR = tempNRR;
                    minRunsToConcede = i;
                }
            } else if (tempNRR < targetNRR && maxRunsToConcede == null && minRunsToConcede != null) {
                tempNRR = computeRunRate(totalRunsScored, totalOversFaced, totalRunsConceded + (i - 1), totalOversBowled + matchOvers);
                minNRR = tempNRR;
                maxRunsToConcede = i - 1;
                break;
            }
        }

    } else {
        targetNRR = desiredPositionTeam.nrr;
        for (let i = 0; i <= runsScored; i++) {
            tempNRR = computeRunRate(totalRunsScored, totalOversFaced, totalRunsConceded + i, totalOversBowled + matchOvers);
            withinUpperLimit = upperBoundNRR ? tempNRR < upperBoundNRR : true;
            withinLowerLimit = lowerBoundNRR ? tempNRR > lowerBoundNRR : true;

            if (tempNRR >= targetNRR && minRunsToConcede == null) {
                if (withinLowerLimit && withinUpperLimit) {
                    maxNRR = tempNRR;
                    minRunsToConcede = i;
                }
            } else if (tempNRR < targetNRR && maxRunsToConcede == null && minRunsToConcede != null) {
                tempNRR = computeRunRate(totalRunsScored, totalOversFaced, totalRunsConceded + (i - 1), totalOversBowled + matchOvers);
                minNRR = tempNRR;
                maxRunsToConcede = i - 1;
                break;
            }
        }
    }

    if (minRunsToConcede == null) {
        responseData.statusCode = 200;
        responseData.data = {
            'success': false,
            'errorMsg': 'There is no possible way your team can reach to your desired position and NRR'
        };
    } else {
        responseData.statusCode = 200;
        responseData.data = {
            'success': true,
            'successMsg': `If ${team.name} scores ${runsScored} in ${matchOvers} overs, they need to restrict ${opponentTeam.name} between ${minRunsToConcede} to ${maxRunsToConcede} runs in ${matchOvers} overs. Revised Run Rate of ${team.name} will be between ${minNRR} to ${maxNRR}`,
        };
    }
}

function computeNRRBowlFirst(formData, responseData) {
    const runstoChase = formData.runs;
    const matchOvers = oversFaced = formData.overs;
    const desiredPosition = formData.desiredPosition;

    const team = pointsTableData[formData.team];
    const opponentTeam = pointsTableData[formData.opponentTeam];
    const desiredPositionTeam = getTeamByPosition(desiredPosition);

    const totalRunsScored = team.for.runs;
    const totalOversFaced = team.for.overs;
    const totalRunsConceded = team.against.runs + runstoChase - 1;
    const totalOversBowled = team.against.overs + matchOvers;

    let targetNRR = desiredPositionTeam.nrr;
    let minOversForChase = null;
    let maxOversForChase = null;
    let minNRR = null;
    let maxNRR = null;
    let upperBoundNRR = null;
    let lowerBoundNRR = null;
    if (desiredPosition > 1) {
        upperBoundNRR = getTeamByPosition(desiredPosition - 1).nrr;
    }
    if (desiredPosition < 8) {
        lowerBoundNRR = getTeamByPosition(desiredPosition + 1).nrr
    }

    var tempNRR = null;
    let withinUpperLimit = null;
    let withinLowerLimit = null;

    if (opponentTeam.key == desiredPositionTeam.key) {
        const opponentTotalRunsScored = opponentTeam.for.runs + (runstoChase - 1);
        const opponentTotalOversFaced = opponentTeam.for.overs + matchOvers;
        const opponentTotalRunsConceded = opponentTeam.against.runs;
        const opponentTotalOversBowled = opponentTeam.against.overs;

        for (let i = 1; i <= (matchOvers * 6); i++) {
            tempNRR = computeRunRate(totalRunsScored + runstoChase, totalOversFaced + i, totalRunsConceded, totalOversBowled);
            targetNRR = computeRunRate(opponentTotalRunsScored, opponentTotalOversFaced, opponentTotalRunsConceded + runstoChase, opponentTotalOversBowled + i);   // Opponent NRR

            withinUpperLimit = upperBoundNRR ? tempNRR < upperBoundNRR : true;
            withinLowerLimit = lowerBoundNRR ? tempNRR > lowerBoundNRR : true;

             if (tempNRR >= targetNRR && minOversForChase == null) {
                if (withinLowerLimit && withinUpperLimit) {
                    maxNRR = tempNRR;
                    minOversForChase = convertBallsToOvers(i);
                }
            } else if (tempNRR < targetNRR && maxOversForChase == null && minOversForChase != null) {
                tempNRR = computeRunRate(totalRunsScored + runstoChase, totalOversFaced + i - 1, totalRunsConceded, totalOversBowled);
                minNRR = tempNRR;
                maxOversForChase = convertBallsToOvers(i - 1);
                break;
            }
        }

    } else {
        targetNRR = desiredPositionTeam.nrr;
        for (let i = 1; i <= (matchOvers * 6); i++) {
            tempNRR = computeRunRate(totalRunsScored + runstoChase, totalOversFaced + i, totalRunsConceded, totalOversBowled);
            withinUpperLimit = upperBoundNRR ? tempNRR < upperBoundNRR : true;
            withinLowerLimit = lowerBoundNRR ? tempNRR > lowerBoundNRR : true;

            if (tempNRR >= targetNRR && minOversForChase == null) {
                if (withinLowerLimit && withinUpperLimit) {
                    maxNRR = tempNRR;
                    minOversForChase = convertBallsToOvers(i);
                }
            } else if (tempNRR < targetNRR && maxOversForChase == null && minOversForChase != null) {
                tempNRR = computeRunRate(totalRunsScored + runstoChase, totalOversFaced + (i - 1), totalRunsConceded, totalOversBowled);
                minNRR = tempNRR;
                maxOversForChase = convertBallsToOvers(i - 1);
                break;
            }
        }
    }

    if (minOversForChase == null) {
        responseData.statusCode = 200;
        responseData.data = {
            'success': false,
            'errorMsg': 'There is no possible way your team can reach to your desired position and NRR'
        };
    } else {
        responseData.statusCode = 200;
        responseData.data = {
            'success': true,
            'successMsg': `${team.name} need to chase ${runstoChase} runs between ${minOversForChase} to ${maxOversForChase} overs. Revised Run Rate of ${team.name} will be between ${minNRR} to ${maxNRR}`,
        };
    }
}


// Some utility methods
function computeRunRate(runsScored, oversFaced, runsConceded, oversBowled) {
    const battingRunRate = runsScored / convertOversToBalls(oversFaced);
    const bowlingRunRate = runsConceded / convertOversToBalls(oversBowled);

    const netRunRate = battingRunRate - bowlingRunRate;
    return Math.round(netRunRate * 1000) / 1000;
}

function convertOversToBalls(overs) {
    const wholeOvers = Math.floor(overs);
    const balls = Math.round((overs - wholeOvers) * 10);
    return wholeOvers + (balls / 6);
}

function convertBallsToOvers(balls) {
    const wholeOvers = Math.floor(balls / 6);
    const remainingBalls = balls % 6;
    return parseFloat(wholeOvers + '.' + remainingBalls);
}

module.exports = {
    computeNRRBatFirst,
    computeNRRBowlFirst
};


