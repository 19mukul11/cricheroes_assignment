const data = require('../config/data');

function getTeamPosition(teamKey) {
    return data.getTeamPosition[teamKey].position;
}

function getTeamByPosition(position) {
    const pointsTableData = data.pointsTableData;
    for (const teamKey in pointsTableData) {
        if (pointsTableData[teamKey].position === position) {
            return pointsTableData[teamKey];
        }
    }
    return null;
}

module.exports = {
    getTeamPosition,
    getTeamByPosition
};