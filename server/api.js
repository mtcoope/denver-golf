const fetch = require('node-fetch')
const helpers = require('./api-helpers');
const util = require('util')

exports.getJson = async (url, session) => {
    let headers;
    if(!session.sessionId)
        headers = {'Content-Type': 'application/json', 'Connection': 'keep-alive'};
    else
        headers = {'Content-Type': 'application/json', 'Connection': 'keep-alive', 'Cookie': helpers.getCookie(session)};
    const response = await fetch(url, {headers: headers});
    return await response.json();
}

exports.login = async (url, payload) => {
    let headers = {'Content-Type': 'application/json', 'Connection': 'keep-alive'};;
    const response = await fetch(url, {method: 'POST', body: JSON.stringify(payload), headers: headers})
    if(response.status != 200) {
        console.log(`Post failed with request: ${util.inspect(payload)} and response: ${util.inspect(response)}`);
        throw new Error();
    }
    const json = await response.json();
    return {
        json: json,
        sessionId: json.SessionID,
        csrfToken: json.CsrfToken,
        authorizationCode: json.AuthorizationCode,
        contactId : json.ContactID
    }
}

exports.postJson = async (url, payload, session) => {
    const response = await fetch(url, {method: 'POST', body: JSON.stringify(payload), headers: {'Content-Type': 'application/json', 'Cookie': helpers.getCookie(session), 'Connection': 'keep-alive'}})
    if(response.status != 200) {
        console.log(`Post failed with request: ${util.inspect(payload)} and response: ${util.inspect(response)}`);
        throw new Error();
    }
    return await response.json();
}