// Json Status Respond Message
module.exports = function(status, code = "", message = "") {
    let result = {
        status: "FAILED",
    };
    if (status) result.status = "SUCCESS";
    if (code) result.code = code;
    if (message) result.message = message;
    return result;
}