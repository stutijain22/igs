const BASE_URL = "http://api.indiagasservices.com/";
const BASE_URL_AUTH = BASE_URL + "api/Auth/";
const BASE_URL_API = "http://api.indiagasservices.com/api/IGS/";
export default {
    AUTHENTICATE: BASE_URL_AUTH + "Authenticate",
    GET_ALL_SERVICE_PROBLEMS: BASE_URL_API + "GetAllServiceProblems",
    CREATE_SERVICE_TICKET: BASE_URL + "Api/IGS/CreateServiceTicket",
    SEARCH_TICKETS: BASE_URL_API + "SearchTickets",

};


export {
    BASE_URL,
    BASE_URL_AUTH,
    BASE_URL_API
}