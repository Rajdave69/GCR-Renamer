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
const classes_number = 0;
const submitBtn = document.getElementById('submit');
const classroomURL = document.getElementById('gcr-url');
const classesAmount = document.getElementById('classes-amount');
const subjectsArea = document.getElementById('subjects-area');
const sectionsArea = document.getElementById('sections-area');
const BtnContainer = document.getElementById('lower');
const expForURL = new RegExp(/classroom.google.com/);


submitBtn.addEventListener('click', (e) => {
    const URL = classroomURL.value.trim();
    const amount = classesAmount.value.trim();
    let URLError = "";
    let amountError = "";

    if(!expForURL.test(URL)) {
        URLError = true;
        classroomURL.style.border = "1px solid red";
    } else {
        classroomURL.style.border = "1px solid white";
    }

    if(typeof parseInt(amount) != 'number' || amount == '') {
        amountError = true;
        classesAmount.style.border = "1px solid red";
    } else {
        classesAmount.style.border = "1px solid white";
    }

    if(URLError == "" && amountError == "") {
        subjectsArea.innerHTML = "";
        sectionsArea.innerHTML = "";
        create_boxes(amount, subjectsArea, sectionsArea);
    }
});



function init() { // This function should be run after the 4 variables are set
    set_gcr_class_list({
        "subject_names": subject_list,
        "section_names": section_list
    }).then( () => {
        set_info({"default_account": acc_number}).then( () => {
        // create_boxes(parseInt(classes_number), subjectsArea, sectionsArea);
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

    const renameButton = document.createElement('button');

    renameButton.setAttribute('type', 'button');
    renameButton.id = "rename-btn";
    renameButton.textContent = "Rename";

    BtnContainer.appendChild(renameButton);
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