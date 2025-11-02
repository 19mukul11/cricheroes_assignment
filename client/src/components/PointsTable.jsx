import { useEffect, useState } from "react";

const PointsTable = () => {

    //Statte to store points table data 
    const [pointsTableData, setPointsTableData] = useState([]);

    // Fucntion call for API call of points table data
    async function getPointsTableData() {
        try {
            const response = await fetch("http://localhost:3000/ipl/teams");
            if (!response.ok) {
                alert('Something went wrong');
                throw new Error("Failed to Fetch Data");
            }

            const data = await response.json();
            setPointsTableData(data);
        } catch (error) {
            console.error("Error fetching teams data:", error);
        }
    }

    // Fetching points table on page load
    useEffect(() => {
        getPointsTableData();
    }, []);

    return (
        <>
            <div className="row text-center pb-2">
                <h2 className="mb-5">IPL Points Table 2025</h2>

                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>S no.</th>
                            <th>Team</th>
                            <th>Matches</th>
                            <th>Won</th>
                            <th>Lost</th>
                            <th>Points</th>
                            <th>For</th>
                            <th>Against</th>
                            <th>NRR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            pointsTableData.map((record, index) => {
                                return (<tr key={index + 1}>
                                    <td>{record.position}</td>
                                    <td>{record.name}</td>
                                    <td>{record.matches}</td>
                                    <td>{record.won}</td>
                                    <td>{record.lost}</td>
                                    <td>{record.points}</td>
                                    <td>{record.for.runs}/{record.for.overs}</td>
                                    <td>{record.against.runs}/{record.against.overs}</td>
                                    <td>{record.nrr}</td>
                                </tr>)
                            })
                        }
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default PointsTable;