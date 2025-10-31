import Header from "../components/Header";
import { Link } from "react-router-dom";

function Error() {
    return(
        <>
            <Header />
            <div className="row text-center py-5 mt-5">
                <h2>Oops, You came a wrong way !</h2>
                <h3> Go back <Link to="/" className="">here....</Link> </h3>
            </div>
        </>
    );
}

export default Error;