import TeamSelectBox from "./form/TeamSelectBox";
import AlertModal from "./AlertModal";
import { useState } from "react";

import { validateField, validateForm } from "../utils/validation";

const NetRunRateForm = () => {

    // State for Form's Data
    const [formData, setFormData] = useState({
        team: "",
        opponent_team: "",
        overs: "",
        position: "",
        toss_result: "",
        runs: "",
    });
    // State for errors
    const [errors, setErrors] = useState({});
    const [modalContent, setModalContent] = useState({});
    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => setShowModal(false);

    // Function to process Form Submit API response
    const processSubmitResponse = (data) => {     
        if (data.success) {
            console.log(data.successMsg);
            setModalContent(data.successMsg);
        } else {
            console.log(data.errorMsg);
            setModalContent(data.errorMsg);
        }
        setShowModal(true);
    }

    //Function called on form submission
    const submitForm = async (e) => {
        e.preventDefault();
        let errors = validateForm(formData);
        setErrors(errors);
        
        if (Object.keys(errors).length === 0) {
            try {
                const response = await fetch('http://localhost:3000/ipl/submit_nrr_form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    alert('Something went Wrong');
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                processSubmitResponse(data);

            } catch (error) {
                console.error('Error submitting form:', error);
            }
        }
    }

    // Function to track Input fields chnages, validate and update the state
    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = { ...formData, [name]: value };
        setFormData(updatedFormData);   // updating  the form state 

        let error = validateField(name, value, updatedFormData);
        if (error) {
            setErrors((prev) => ({ ...prev, [name]: error }));
        } else {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    }

    return (
        <>
            <div className="row pb-2">
                <h2 className="mb-5 text-center">Compute NRR Form</h2>
                <form className="" id="compute_nrr_form">
                    <div className="form-group">
                        <label htmlFor="team" className="control-label">Select your Team</label>
                        <TeamSelectBox name='team' id='team' onBlur={handleChange} />
                        {errors.team && <small className="text-danger">{errors.team}</small>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="opponent_team" className="control-label">Select opponent</label>
                        <TeamSelectBox name='opponent_team' id='opponent_team' onBlur={handleChange} />
                        {errors.opponent_team && <small className="text-danger">{errors.opponent_team}</small>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="overs" className="control-label">Enter Overs for match</label>
                        <input type="number" name="overs" id="overs" className="form-control" placeholder="eg. 10, 15, 20" onChange={handleChange} onBlur={handleChange} />
                        {errors.overs && <small className="text-danger">{errors.overs}</small>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="position" className="control-label">Enter Desired position in points table</label>
                        <input type="number" name="position" id="position" className="form-control" placeholder="Enter position to achieve" onBlur={handleChange} />
                        {errors.position && <small className="text-danger">{errors.position}</small>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="toss_result" className="control-label">Toss Result</label>
                        <select name="toss_result" id="toss_result" className="form-control" onBlur={handleChange}>
                            <option value=''>-- Select --</option>
                            <option value="bat">Batting First</option>
                            <option value="bowl">Bowling First</option>
                        </select>
                        {errors.toss_result && <small className="text-danger">{errors.toss_result}</small>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="runs" className="control-label">Runs Scored / Runs to chase</label>
                        <input type="number" name="runs" id="runs" className="form-control" placeholder="Enter runs" onBlur={handleChange} />
                        {errors.runs && <small className="text-danger">{errors.runs}</small>}
                    </div>
                    <button className="btn btn-primary w-100 mt-2" id="submit_form_btn" onClick={submitForm}>Compute NRR</button>
                </form>
                <AlertModal content={modalContent} show={showModal} close={handleCloseModal} />
            </div>
        </>
    );
}

export default NetRunRateForm;