exports.getBestTeeTime = (settings, searchResult) => {
    let orderedResult = [];
    settings.courses.forEach(x => {
        const courseResult = searchResult.filter(y => y.r07 === x).sort();
        courseResult.forEach(y => orderedResult.push(y));
        
    });
    return orderedResult;
}