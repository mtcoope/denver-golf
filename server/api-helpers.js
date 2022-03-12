exports.getLoginPayload = (settings, session) => {
    return {Login: settings.userName, MasterSponsorID: session.masterSponserId, Password: settings.password, SessionID: session.sessionId}
}

exports.getSearchPayload = (settings) => {
    return {
        p01: settings.courses,
        p02: settings.date,
        p03: settings.earliestTime,
        p04: settings.latestTime,
        p05: 0,
        p06: settings.players,
        p07: false
    };
}

exports.getReservationPayload = (session) => {
    return {
        p01: session.selectedTee.r01,
        p02: [{
            r01: session.selectedTee.r06,
            r02: 1,
            r03: session.selectedTee.r13,
            r04: session.selectedTee.r03,
            r05: session.selectedTee.r03,
            r06: -1,
            r07: "1"
        }],
        p03: session.sessionId
    }
}

exports.getAddPayLoad = (settings, session, reservationResponse) => {
    return {
        r01: session.selectedTee.r01,
        r02: reservationResponse.r02[0],
        r03: settings.players,
        r04: false,
        r05: session.contactId,
        r06: false,
        r07: session.sessionId,
        r08: reservationResponse.r02[0].r06,
        r09: session.csrfToken
    }
}

exports.getCardLinkPayLoad = (session, cardAllItem, reservationResponse) => {
    return {
        CardOnFileID: cardAllItem.CreditCards[0].CardId,
        ContactID: session.contactId,
        CourseID: reservationResponse.r02[0].r07,
        MasterSponsorID: session.masterSponserId,
        SessionID: session.sessionId,
        SponsorID: session.masterSponserId
    }
}

exports.getHoldReservationPayLoad = (session) => {
    return {
        ContactID: session.contactId,
        MasterSponsorID: session.masterSponserId,
        PriceWindowIDs: null,
        SessionID: session.sessionId,
        SponsorID: session.SponsorID
    }
}

exports.getCheckTeeTimeConflictsPayLoad = (session, reservationResponse) => {
    return {
        ContactID: session.contactId,
        CourseID: reservationResponse.r02[0].r07,
        SponsorID: session.masterSponserId,
        TeeTime: session.selectedTee.r15
    }
}

exports.getCartFinishPayLoad = (session, reservationResponse) => {
    return {
        ContactID: session.contactId,
        ContinueOnPartnerTeeTimeConflict: true,
        CourseID: reservationResponse.r02[0].r07,
        Email1: null,
        Email2: null,
        Email3: null,
        GroupID: session.groupId,
        MasterSponsorID: session.masterSponserId,
        ReservationTypeID: session.selectedTee.r13,
        SessionID: session.sessionId,
        SponsorID: session.masterSponserId
    }
}

exports.getCookie = (session) => {
    return `EZBookPro.SessionId=${session.sessionId}; AuthorizationCode=${session.authorizationCode}; ContactID=${session.contactId};`
}
