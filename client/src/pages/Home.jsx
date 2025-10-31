import Header from "../components/Header";
import NetRunRateForm from "../components/NetRunRateForm";
import PointsTable from "../components/PointsTable";

function Home() {
    return(
        <>
            <Header />
            <div className="row" id="home_container">
                <div className="col panel" id="points_table_container">
                    <PointsTable />
                </div>
                <div className="col panel" id="form_container">
                    <NetRunRateForm />
                </div>
            </div>
        </>
    );
}

export default Home;