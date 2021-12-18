module.exports = {
    getDates(startDate, stopDate, listenDate) {
        const dates = [];
        listenDate.forEach(date=>{
            
            if(date<=stopDate && date>=startDate){
                dates.push(date);
            }
        })
        // return listenDate.map(date=> {date<=stopDate && date>=startDate})
        return dates;
    }
}