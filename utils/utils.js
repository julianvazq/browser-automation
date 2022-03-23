const randomNum = (min = 1500, max = 4000) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

module.exports = {
    randomNum,
};
