const info = (message) => {
    console.log(message);
};

const success = (message) => {
    console.log('SUCESS: ', message);
};

const error = (message) => {
    console.log('FAIL: ', message);
};

const errorDefault = (e) => {
    console.log('StackTrace: ', e);
    throw new Error();
};

module.exports = {
    error,
    errorDefault,
    success,
    info,
};
