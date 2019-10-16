import {filter, includes} from 'lodash';
// eslint-disable-next-line no-useless-escape
const emailValidationRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const validateEmail = email => emailValidationRegex.test(email);

export const isNotValidEmail = email => !validateEmail(email);

export const addStatusAndMessageToResponse = (res, status, errorMessage) => {
	res.status(status).send({message: errorMessage});
};

export const convertToArrayIfNot = values =>
	Array.isArray(values) ? values : [values];

export const findDuplicateValueInArray = (array) => filter(array, (val, i, iteratee) => includes(iteratee, val, i + 1));