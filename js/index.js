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

const acc_number = 1;
const subject_list = ["Main Class Group", "English", "History/Geography", "Economics/Civics", "Hindi", "Biology", "Physics", "Chemistry", "Math", "AI", "Mental Ability", "Art"];
const section_list = ["Class Group"];
const classes_number = 12;



function init() { // This function should be run after the 4 variables are set
    set_gcr_class_list({
        "subject_names": subject_list,
        "section_names": section_list
    }).then( () => {
        set_info({"default_account": acc_number}).then( () => {
        create_boxes(parseInt(classes_number))
    })
})
}


function set_info(account_info) {
    return new Promise(function (resolve) {
        chrome.storage.local.set({info: account_info}, function () {
        resolve();
        });
    })
}

function set_gcr_class_list(info) {
    return new Promise(function (resolve) {
        chrome.storage.local.set({"class_list": JSON.stringify(info)}, () => {
                console.log('Value for class_list set to ' + JSON.stringify(info));
                console.log(info);
                resolve();
            }
        )
    });
}

function create_boxes(number) {
    for (let i = 0; i < number; i++) {
        let _boxes = []
        let x = document.createElement("INPUT");
        x.setAttribute("type", "text");
        x.setAttribute("class", "boxes");
        // document.body.appendChild(x);
        document.getElementById("all-inputs").appendChild(x)
        _boxes.push(x);
    }
}



/* Temporary code to mimic input gathering
set_gcr_class_list({
    "subject_names": subject_list,
    "section_names": section_list
}).then( () => {
    set_info({"default_account": acc_number}).then( () => {
        init();
    })
})


*/
init()