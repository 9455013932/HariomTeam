export const validateUserForms = (name, value, formData) => {
    let error = '';
  
    switch (name) {
      case 'userId':
        if (!value) {
          error = 'User ID is required';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          error = 'Confirm Password is required';
        } else if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;
      case 'name':
        if (!value) {
          error = 'Name is required';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = 'Only alphabets are allowed';
        }
        break;
      case 'mobile1':
        if (!value) {
          error = 'Mobile number 1 is required';
        } else if (!/^[0-9]+$/.test(value)) {
          error = 'Mobile number must be digits';
        } else if (value.length !== 10) {
          error = 'Mobile number must be 10 digits';
        }
        break;
    
    //   case 'email':
    //     if (value && !/\S+@\S+\.\S+/.test(value)) {
    //       error = 'Email address is invalid';
    //     }
    //     break;
    
        
      case 'permission':
        if (!value) {
          error = 'Permission is required';
        }
        break;
      default:
        break;
    }
  
    return error;
  };
  