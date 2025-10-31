export const validateField = (name, value, formData) => {
    let error = '';
    switch (name) {
        case 'team':
            if (!value) {
                error = 'Your Team field is required.'
            }
            break;
        case 'opponent_team':
            if (!value) {
                error = 'Your Team field is required.'
            } else if (value === formData.team) {
                error = 'Opponent team must be different from you team';
            }
            break;
        case 'overs':
            if (!value) {
                error = 'Overs field is required.'
            } else if (value > 20) {
                error = 'Overs sholud not be greater than 20.'
            }
            break;
        case 'position':
            if (!value) {
                error = 'Position field is required.'
            } else if (value > 7 || value < 1) {
                error = 'Position should be between 1 to 7';
            }
            break;
        case 'toss_result':
            if (!value) {
                error = 'Toss result field is required.'
            }
            break;
        case 'runs':
            if (!value) {
                error = 'Runs scored/Runs to chase field is required.'
            }
            break;
    }
    return error;
}

export const validateForm = (formData) => {
    const errors = {};
    Object.keys(formData).forEach((name) => {
        const msg = validateField(name, formData[name], formData);
        if (msg) {
            errors[name] = msg;
        }
    });
    return errors;
}