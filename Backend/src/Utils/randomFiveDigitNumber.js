// Generate a unique 5-digit code
module.exports = generateUniqueCode = () => {
    return Math.floor(10000 + Math.random() * 90000).toString(); // 10000 - 99999
};
