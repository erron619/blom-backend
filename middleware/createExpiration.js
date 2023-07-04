module.exports = function(value, unit = "sec") {
    const table = {
        sec: 1000,
        min: 1000 * 60,
        hr: 1000 * 60 * 60,
        day: 1000 * 60 * 60 * 24,
    }
    const now = Date.now();
    return now + value * table[unit];
}