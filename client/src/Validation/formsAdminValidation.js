
export const validateFormsAdmin = (field, value) => {
    let error = '';
    switch (field) {
        case 'PacketNo':
            if (!value) {
                return 'This is required';
            }
            break;

        case 'VEAddress':
        case 'VHAddress':
            if (!value) {
                return 'Address is required';
            }
            break;

        case 'NoOfForms':
            if (!value) {
                return 'No Of Forms is required';
            }
            break;

        case 'VMob1':
            if (!value) {
                return 'Mobile No is required';
            }
            if (value && !/^[0-9]+$/.test(value)) {
                error = 'Mobile number must be digits';
            }
            else if (value && value.length != 10) {
                error = 'Mobile number must be 10 digits';
            }
            break;

        case 'CMob1':
        case 'VMob2':
            if (value && !/^[0-9]+$/.test(value)) {
                error = 'Mobile number must be digits';
            }
            else if (value && value.length != 10) {
                error = 'Mobile number must be 10 digits';
            }
            break;

        case 'VEName':

            if (!value) {
                error = 'Name (English)  is required';
            } else if (value && !/^[a-zA-Z\s]+$/.test(value)) {
                error = 'Only alphabets are allowed';
            }
            break;

            case 'VHName':
                if (!value) {
                    error = 'Name (Hindi)  is required';
                } 
                break;

        case 'CEName':

            if (value && !/^[a-zA-Z\s]+$/.test(value)) {
                error = 'Only alphabets are allowed';
            }
            break;

        default:
            return null;
    }
    return error;
};
