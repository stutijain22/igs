const BASE_URL = 'http://api.indiagasservices.com/';
const BASE_URL_AUTH = BASE_URL + 'Api/';
const BASE_URL_API = 'http://api.indiagasservices.com/api/IGS/';
export default {
  AUTHENTICATE: BASE_URL + 'api/Auth/Authenticate',
  GET_ALL_USERS: BASE_URL_API + 'GetAllUsers',
  GET_ALL_SERVICE_PROBLEMS: BASE_URL_API + 'GetAllServiceProblems',
  CREATE_SERVICE_TICKET: BASE_URL_AUTH + 'IGS/CreateServiceTicket',
  ASSIGN_SERVICE_TICKET: BASE_URL_AUTH + 'IGS/AssignServiceTicket',
  SEARCH_TICKETS: BASE_URL_API + 'SearchTickets',
  GET_ALL_TECHNICIANS: BASE_URL_API + 'GetAllTechnicians',
  SIGN_UP_USER: BASE_URL_AUTH + 'Auth/SignUpUser',
  SEND_OTP: BASE_URL_AUTH + 'Auth/SendOTP',
};

export {BASE_URL, BASE_URL_AUTH, BASE_URL_API};
