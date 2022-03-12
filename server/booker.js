const settingsReader = require('./settingsReader');
const apiHelpers = require('./api-helpers');
const helpers = require('./helpers');
const api = require('./api');

exports.searchResults = async (settings, session) => {
    const searchInitResult = await api.getJson(settings.endpoints.searchInit, session);
    session = { ...session, csrfToken: searchInitResult.CsrfToken, masterSponserId: searchInitResult.MasterSponsorID, groupId: searchInitResult.GroupID}

    const getLoginResult = await api.getJson(settings.endpoints.login, session);
    session = {...session, sessionId: getLoginResult.SessionID} 

    const postLoginResult = await api.login(settings.endpoints.login, apiHelpers.getLoginPayload(settings, session), session);
    session = {...session, contactId: postLoginResult.contactId, sessionId: postLoginResult.sessionId, csrfToken: postLoginResult.csrfToken, authorizationCode: postLoginResult.authorizationCode} 

    const searchResult = await api.postJson(settings.endpoints.search, apiHelpers.getSearchPayload(settings), session);
    const orderedResult = helpers.getBestTeeTime(settings, searchResult.r06);
    session = {...session, orderedResult: orderedResult};

    return session;
}

exports.bookTeeTime = async (session, settings) => {
    let counter = 0;
    for(let i = 0; i < session.orderedResult.length; i++){
        try{
            const orderHistoryResult = await api.getJson(settings.endpoints.orderHistory, session);
            if(session.orderHistory.FutureOrders.length !== orderHistoryResult.FutureOrders.length){
                break;
            }
            session = {...session, selectedTee: session.orderedResult[i]}
            const reservationResult = await api.postJson(settings.endpoints.reservation, apiHelpers.getReservationPayload(session), session);
            const addResult = await api.postJson(settings.endpoints.add, apiHelpers.getAddPayLoad(settings, session, reservationResult), session);


            if(addResult.StatusMessage !== '')
                throw new Error(`Failed to add to cart because ${addResult.StatusMessage}`);
            
            const cardAllResult = await api.getJson(settings.endpoints.cardAll, session);

            const cardLinkResult = await api.postJson(settings.endpoints.cardLink, apiHelpers.getCardLinkPayLoad(session, cardAllResult, reservationResult), session);

            if(!cardLinkResult.Successful)
                throw new Error(`Failed to link card because ${cardLinkResult.Successful}`);

            const holdReservationResult = await api.postJson(settings.endpoints.holdReservation, apiHelpers.getHoldReservationPayLoad(session), session);

            const checkTeeTimeConflictsResult = await api.postJson(settings.endpoints.checkTeeTimeConflicts, apiHelpers.getCheckTeeTimeConflictsPayLoad(session, reservationResult), session);

            if(settings.dryRun !== false){
            // const finishResult = await api.postJson(settings.endpoints.cartFinish, apiHelpers.getCartFinishPayLoad(session, reservationResult), session); 
            // if(finishResult.ConfirmationNumber !== '')
            //     break;
            }else {
                session.orderHistory.FutureOrders.push({});
            }

        }catch(exception){
            counter = counter + 1;
            console.log(`failed to book ${session.orderedResult[i].r16} because ${exception}`);
            console.log(`failed to book ${counter} times.`);
            if(counter >= settings.maxFailCount)
                throw new Error('Hit failed threshold');
        }
    }

    return;
}

exports.runBooker = () => {
    const settings = await settingsReader.readSettingsFile();
    let session = {};
    session = {...await searchResults(settings, session)};

    const orderHistoryResult = await api.getJson(settings.endpoints.orderHistory, session);
    session = {...session, orderHistory: orderHistoryResult};

    await bookTeeTime(session, settings);
}