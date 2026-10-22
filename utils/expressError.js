class expressError extends Error{
    constructor(status,message){
        super();
        this.message = message;
        this.statusCode = status;
    }
}

module.exports = expressError;