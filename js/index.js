/*
function get_info() {
    return new Promise(function (resolve) {
        chrome.storage.local.get(['info'], function (result) {
            resolve(result.info);
        });
    });
}

function set_info(account_info) {
    chrome.storage.local.set({info: account_info}, function () {
        console.log('Value is set to ' + account_info);
    });
}

*/


function set_account_info(account_number, info) {
    return new Promise(function (account_number) {
    _location = `account_info_${account_number}`;
    console.log(_location)

    chrome.storage.local.set({_location: info}, () => {
       console.log('Value for ' + _location + ' set to ');
        console.log(info);

    })});
}



set_account_info(1, {
    "subject_names": ["Main Class Group", "English", "History/Geography", "Economics/Civics", "Hindi", "Biology", "Physics", "Chemistry", "Math", "AI", "Mental Ability", "Art"],
    "section_names": ["Class Group"]
});






/*

set_info({"number_of_accounts": 1, "primary_account": 1});

get_info().then(function (result) {
    console.log(result);
})

*/