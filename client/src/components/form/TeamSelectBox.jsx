function TeamSelectBox(props) {
    return (
        <select name={props.name} id={props.id} onBlur={props.onBlur} className="form-control">
            <option value="">-- Select --</option>
            <option value="csk">Chennai Super Kings</option>
            <option value="mi">Mumbai Indians</option>
            <option value="rcb">Royal Challengers Bangalore</option>
            <option value="kkr">Kolkata Knight Riders</option>
            <option value="rr">Rajasthan Royals</option>
            <option value="pbks">Punjab Kings</option>
            <option value="dc">Delhi Capitals</option>
            <option value="srh">Sunrisers Hyderabad</option>
        </select>
    );
}

export default TeamSelectBox;