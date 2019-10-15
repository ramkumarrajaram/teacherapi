import {filter, includes, isArray, isEmpty} from 'lodash';

const emailValidationRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class ValidationUtil {

    constructor(){}

    isNotValidEmail(email) {
        return !emailValidationRegex.test(email);
    }

    isValidEmailInArray(emailArray) {
        if(isEmpty(emailArray) || (isArray(emailArray) && emailArray === 0)) {
            return false;
        }

        const inValidEmails = emailArray.filter(this.isNotValidEmail);

        if (inValidEmails.length !== 0 || this.findDuplicateValueInArray(emailArray).length !==0) {
            return false;
        }

        return true;
    }

    findDuplicateValueInArray(array) {
        return filter(array, (val, i, iteratee) => includes(iteratee, val, i + 1));
    }
}

export default ValidationUtil;