// referenceDetailsValidation.js
export const validateReferenceDetails = (field, value) => {
    let error = '';
    switch (field) {
        case 'PacketNo':
            if (!value) {
                return 'Packet number is required';
            }
            break;
      
        case 'VMob1':
            if (value && !/^[0-9]+$/.test(value)) {
                error = 'Mobile number must be digits';
            } else if (value && value.length != 10) {
                error = 'Mobile number must be 10 digits';
            }
          
            break;
    
        default:
            return null;
    }
    return error;
};
