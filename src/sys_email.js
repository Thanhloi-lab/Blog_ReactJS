module.exports = {
    Email: 'ntdtestmail@gmail.com',
    password:'myucaxqjngijhmzq',
    getCode(){
        return Math.floor(100000 + Math.random()*900000);
    },
    expiredDate(date, minutes){
        date.setMinutes(date.getHours() + minutes);
        return date;
    }
}