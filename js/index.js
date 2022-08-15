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

const submitBtn = document.getElementById('submit');
const classroomURL = document.getElementById('gcr-url');
const classesAmount = document.getElementById('classes-amount');
const subjectsArea = document.getElementById('subjects-area');
const sectionsArea = document.getElementById('sections-area');
const BtnContainer = document.getElementById('lower');
const expForURL = new RegExp("https://classroom\\.google\\.com/u/\\d+");

let renameButtonExists = false;

submitBtn.addEventListener('click', () => {
    const URL = classroomURL.value.trim();
    const amount = classesAmount.value.trim();
    let URLError;
    let amountError1;
    let amountError2;

    if(!expForURL.test(URL)) { // If the URL is not valid
        URLError = true;
        classroomURL.style.border = "1px solid red";
    } else {    // If the URL is valid
        classroomURL.style.border = "1px solid white";
        URLError = false;
    }

    if (isNaN(parseInt(amount))){  // If amount is not NaN and is not empty
        amountError1 = true;
        classesAmount.style.border = "1px solid red";
    } else {
        amountError1 = false;
        classesAmount.style.border = "1px solid white";
    }

    if (parseInt(amount) < 0 || parseInt(amount) > 100) { // If amount between 1 and 100
        amountError2 = true;
        classesAmount.style.border = "1px solid red";
    } else {                // If amount is not a number
        amountError2 = false;
        classesAmount.style.border = "1px solid white";
    }

    console.log(amountError1, amountError2, URLError);

    // false = valid, true = invalid
    if (!URLError && !amountError1 && !amountError2) {    // If both inputs are valid
        subjectsArea.innerHTML = "";
        sectionsArea.innerHTML = "";
        create_boxes(amount, subjectsArea, sectionsArea);
        create_rename_button();

    }
});



function init() { // This function should be run after the 4 variables are set
    set_gcr_class_list({
        "subject_names": subject_list,
        "section_names": section_list
    }).then( () => {
        set_info({"default_account": acc_number}).then( () => {
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


function get_info() {
    return new Promise(function (resolve) {
        chrome.storage.local.get(['info'], function (result) {
            resolve(result.info);
        });
    });
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

function get_gcr_class_list() {
    return new Promise(function (resolve) {
        chrome.storage.local.get(["class_list"], (result) => {
            resolve(result);
        })
    })
}


function create_boxes(number, subjectsArea, sectionsArea) {
    let _subject_boxes = [];
    let _section_boxes = [];

    const subjectHeading = document.createElement('h4');
    const sectionHeading = document.createElement('h4');

    subjectHeading.textContent = "Subject Names";
    sectionHeading.textContent = "Section Names";

    subjectsArea.appendChild(subjectHeading);
    sectionsArea.appendChild(sectionHeading);

    for (let i = 0; i < number; i++) {
        const boxForSubject = document.createElement("input");
        const boxForSection = document.createElement("input");

        boxForSubject.setAttribute("type", "text");
        boxForSubject.setAttribute("class", "subject-box");
        boxForSubject.required = true;
        
        boxForSection.setAttribute("type", "text");
        boxForSection.setAttribute("class", "section-box");
        boxForSection.style.marginLeft = "auto";
        boxForSection.required = true;

        _subject_boxes.push(boxForSubject);
        _section_boxes.push(boxForSection);

        subjectsArea.appendChild(boxForSubject);
        sectionsArea.appendChild(boxForSection);
    }


}

function create_rename_button() {
    if (renameButtonExists) {
        return;
    }
    const renameButton = document.createElement('button');

    renameButton.setAttribute('type', 'button');
    renameButton.id = "rename-btn";
    renameButton.textContent = "Rename";

    BtnContainer.appendChild(renameButton);
    renameButtonExists = true;


}

/* Temporary code to mimic input gathering
set_gcr_class_list({
    "subject_names": subject_list,
    "section_names": section_list
}).then( () => {
    set_info({"default_account": acc_number}).then( () => {
        init();
    })
}) */

init()