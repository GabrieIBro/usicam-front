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

export {
    formatDatetime
}