/*
Storage Structure

 │
 ├─► info           dict: {"default_account": int} ─► Stores the auth-user which has renaming activated.
 │
 ├─► class_list     dict: {"class_list": {"subject_names": list, "section_names": list}} ─► Stores the actual list of Subject and Section names which will be used to rename.
 │
 └─► subject_length int ─► Stores simply the number of classes the user is in, which will be used to create the respective amount of input boxes in the front end

*/

// TODO : Make force dark mode for gcr

const acc_number = "1";
const subject_list = ["Main Class Group", "English", "History/Geography", "Economics/Civics", "Hindi", "Biology", "Physics", "Chemistry", "Math", "AI", "Mental Ability", "Art"];
const section_list = ["Class Group"];


function get_info() {
    return new Promise(function (resolve) {
        chrome.storage.local.get(['info'], function (result) {
            resolve(result.info);
        });
    });
}

function set_info(account_info) {
    chrome.storage.local.set({info: account_info}, function () {
        console.log('Value is set to ' + JSON.stringify(account_info));
    });
}


function set_gcr_class_info(account_number, info) {
    return new Promise(function (resolve) {
        chrome.storage.local.set({"class_list": JSON.stringify(info)}, () => {
                console.log('Value for class_list set to ' + JSON.stringify(info));
                console.log(info);
                resolve();
            }
        )
    });
}


/*
function get_classes(account_number) {
    return new Promise(function (resolve) {
        let _tab = chrome.tabs.create({ url: `https://classroom.google.com/u/${account_number}/h` });
        // wait for the tab to load
        // close _tab
        let e = GetElementsByExactClassName("YVvGBb");
        console.log("e")
        console.log(e);
        _tab.close // TODO : fix this
        resolve();
    })
}
*/

function open_gcr(account_number) {
    return new Promise( (resolve) => {
        chrome.tabs.create({ url: `https://classroom.google.com/u/${account_number}/h` });
        resolve();
    })
}



function get_default_classes() {
    return new Promise( (resolve) => {
        chrome.storage.local.get(['subject_length'], (result) => {
            resolve(result['subject_length']);
        });
    })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

get_default_classes().then((result) => {
    console.log(`Number of classes found = ${parseInt(result)}`);
    if (parseInt(result) <= 0 || result === undefined || isNaN(result)) {   // if no classes are found
        console.log("no classes found!");
        open_gcr().then (() => {  // Open the respective Google Classroom page
            sleep(5000).then (() => {   // Wait for the page to load and then get the classes
                get_default_classes().then((result) => {  // Get the number of classes again

                    if (result === "0") {   // If the after opening GCR, there are still no classes
                        console.warn("User is in no GCR Classes!")
                    }

                    else if (result > "0") {    // If the after opening GCR, there are classes
                        console.log("Found " + acc_number + " classes!");
                        _boxes = [];
                        for (let i = 0; i < result; i++) {  // Create the respective amount of input boxes
                            let x = document.createElement("INPUT");
                            x.setAttribute("type", "text");
                            x.setAttribute("class", "boxes");
                            document.body.appendChild(x);
                            _boxes.push(x);
                        }
                    }
                })
            })
        })
    }

    else {
    console.log("Found " + result + " classes!");
        _boxes = [];
        for (let i = 0; i < result; i++) {  // Create the respective amount of input boxes
            let x = document.createElement("INPUT");
            x.setAttribute("type", "text");
            x.setAttribute("class", "boxes");
            document.body.appendChild(x);
            _boxes.push(x);
        }

    }
})
/*
get_classes(1).then(function (classes) {
    console.log(classes);
}
);
*/


set_gcr_class_info(acc_number, {
    "subject_names": subject_list,
    "section_names": section_list
});


set_info({"default_account": acc_number});

get_info().then((result) => {
    console.log(result);
})

