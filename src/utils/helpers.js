function formatDatetime(datetime) {

    let newDatetime = datetime.slice(8, 10) + '/' + datetime.slice(5,7) + '/' + datetime.slice(0,4) + ' ' + datetime.slice(11, 13) + ':' + datetime.slice(14,16)
    
    return newDatetime;

}

export {
    formatDatetime
}