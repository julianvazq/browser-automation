const randomNum = (min = 1000, max = 3000) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

module.exports = {
    randomNum,
};
