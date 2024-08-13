function formatDatetime(datetime="1999-01-01T00:00:00.000Z", hour=1) {

    if(hour === 1) {
        let newDatetime = datetime.slice(8, 10) + '/' + datetime.slice(5,7) + '/' + datetime.slice(0,4) + ' ' + datetime.slice(11, 13) + ':' + datetime.slice(14,16);
        return newDatetime;
    }
    else {
        let newDatetime = datetime.slice(8, 10) + '/' + datetime.slice(5,7) + '/' + datetime.slice(0,4);
        return newDatetime;
    }

}

function formatValues(value) {
    const stringValue = String(value);
    const formattedValue = [];
    const strlen = stringValue.length - 1;

    for(let i = strlen; i >= 0; i--) {

        if((strlen - i) % 3 === 0 && strlen - i !== 0) {
            formattedValue.unshift(".");
        }

        formattedValue.unshift(stringValue[i]);
    }

    return formattedValue.join('');
}

export {
    formatDatetime,
    formatValues
}