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

let subject_list = [];
let section_list = [];
const submitBtn = document.getElementById('submit');
const classroomURL = document.getElementById('gcr-url');
const classesAmount = document.getElementById('classes-amount');
const subjectsArea = document.getElementById('subjects-area');
const sectionsArea = document.getElementById('sections-area');
const renameBtn = document.getElementById('rename-btn');
// const BtnContainer = document.getElementById('lower');
const expForURL = new RegExp("classroom\\.google\\.com/u/\\d+");
let gcr_input_hidden = false;
let _user_id;
create_lists();



// let renameButtonExists = false;


function toggle_url_input(state = "on") {
    let gcr_url_input = document.getElementById("gcr-url-input");

    if (state === "on") {
        gcr_url_input.style.display = "block";
        console.info("No URL found in storage");

        gcr_input_hidden = false;
    } else {
        gcr_url_input.style.display = "none";
        console.info("URL was entered before. Hiding input field.");

        gcr_input_hidden = true;
    }
}

/*
    >> Event Listeners

       This part of the code is responsible for listening to events and performing actions accordingly.
       It contains only event listeners.
*/


submitBtn.addEventListener('click', () => { // Event listener for the submit button

    let URL = classroomURL.value.trim();
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
    if (_user_id < 0) {
        // unhide the input field
        toggle_url_input("on");
    } else {
        if (gcr_input_hidden) {
            URLError = false;
        }
    }

    if (isNaN(parseInt(amount))){  // If amount is not NaN and is not empty
        amountError1 = true;
        classesAmount.style.border = "1px solid red";
    } else {
        amountError1 = false;
        classesAmount.style.border = "1px solid white";
    }

    if (parseInt(amount) < 1 || parseInt(amount) > 100) { // If amount between 1 and 100
        amountError2 = true;
        classesAmount.style.border = "1px solid red";
    } else {                // If amount is not a number
        amountError2 = false;
        classesAmount.style.border = "1px solid white";
    }

    console.debug(amountError1, amountError2, URLError);

    // false = valid, true = invalid
    if (!URLError && !amountError1 && !amountError2) {    // If both inputs are valid
        get_info().then( (result) => {
            if (URL != "") {   // If URL is not empty
                URL = URL.split("/");
                console.debug(URL);

                for (let i = 0; i < URL.length; i++) {
                    if (!isNaN(URL[i]) && URL[i] !== "") {
                        user_id = URL[i];
                        break;
                    }
                }
                console.info("User ID: " + user_id);
                set_info({"default_account": user_id});
                toggle_url_input("off");

                if (isNaN(parseInt(result))) {  // If result is not a number
                    set_info({"default_account": user_id});

                } else { // If result is a number

                    if (parseInt(result) === parseInt(user_id)) { // If result is equal to user_id
                        console.info("User ID is the same as the one in storage");
                    } else {                // If result is not equal to user_id
                        set_info({"default_account": user_id}).then( () => {
                            console.info("User ID has been updated");
                        });

                    }
                }
            }

            create_lists(true).then( () => {
                create_boxes(amount, subjectsArea, sectionsArea);
                toggle_rename_button("on");
            })

        });
    }
});


renameBtn.addEventListener('click', () => { // Event listener for the rename button

    let subject_names = [];
    let section_names = [];
    let subject_inputs = document.getElementsByClassName("subject-box");
    let section_inputs = document.getElementsByClassName("section-box");
    for (let i = 0; i < subject_inputs.length; i++) {
        subject_names.push(subject_inputs[i].value);
    }
    for (let i = 0; i < section_inputs.length; i++) {
        section_names.push(section_inputs[i].value);
    }
    console.info("Subjects: " + JSON.stringify(subject_names));
    console.info("Sections: " + JSON.stringify(section_names));
    set_gcr_class_list({
        "subject_names": subject_names,
        "section_names": section_names
    }).then( () => {
        console.info("Class list set");
    });

});




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
            if (isNaN(result.info['default_account']) || result.info['default_account'] === "") {
                resolve(undefined);
                console.debug(`get_info: [undefined] ${JSON.stringify(result.info)}`);
            } else {
                resolve(result.info);
                console.debug(`get_info: ${JSON.stringify(result.info)}`);
            }
        });
    });
}

function set_gcr_class_list(info) {
    return new Promise(function (resolve) {
        chrome.storage.local.set({"class_list": JSON.stringify(info)}, () => {
                console.debug('Value for class_list set to ' + JSON.stringify(info));
                console.debug(info);
                resolve();
            }
        )
    });
}

function get_gcr_class_list() {
    return new Promise( (resolve) => {
        chrome.storage.local.get(['class_list'], (result) => {
            console.log(result.class_list);
            resolve(JSON.parse(result.class_list));
        });
    });
}


function create_boxes(number, subjectsArea, sectionsArea) {
    let _subject_boxes = [], _section_boxes = [];

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
        boxForSubject.setAttribute("value", subject_list[i]);
        boxForSubject.required = true;

        boxForSection.setAttribute("type", "text");
        boxForSection.setAttribute("class", "section-box");
        boxForSection.setAttribute("value", section_list[i]);
        boxForSection.style.marginLeft = "auto";
        boxForSection.required = true;

        _subject_boxes.push(boxForSubject);
        _section_boxes.push(boxForSection);

        subjectsArea.appendChild(boxForSubject);
        sectionsArea.appendChild(boxForSection);
    }

}

function create_lists(ignore_userid = false) {
    return new Promise( (resolve) => {
        if (ignore_userid) {
           toggle_url_input("off");
           console.debug("user id is over -1");

           get_gcr_class_list().then((result) => {
               console.log(result);

               for (let i = 0; i < result['subject_names'].length; i++) {
                   subject_list.push(result['subject_names'][i]);
                   section_list.push(result['section_names'][i]);
               }

               if (result['subject_names'].length > 0) {
                   create_boxes(result['subject_names'].length, subjectsArea, sectionsArea);
                   toggle_rename_button("on");

                   let class_number_input = document.getElementById('classes-amount');
                   class_number_input.setAttribute("value", result['subject_names'].length);
               }

           });
            return;
        }

        get_info().then((info) => {
            _user_id = info["default_account"];
            console.log(_user_id);

            if (parseInt(_user_id) > -1) { // If the user has a default account
                toggle_url_input("off");
                console.debug("user id is over -1");

                get_gcr_class_list().then((result) => {
                    console.log(result);

                    for (let i = 0; i < result['subject_names'].length; i++) {
                        subject_list.push(result['subject_names'][i]);
                        section_list.push(result['section_names'][i]);
                    }

                    if (result['subject_names'].length > 0 && !isNaN(_user_id)) {
                        create_boxes(result['subject_names'].length, subjectsArea, sectionsArea);
                        toggle_rename_button("on");


                        let class_number_input = document.getElementById('classes-amount');
                        class_number_input.setAttribute("value", result['subject_names'].length);
                    }
                    console.debug(_user_id)

                });

            } else {                    // If the user does not have a default account

            }
            resolve();
        });
    });
}

function toggle_rename_button(state) {
    // hide and show rename button
    if (state === "on") {
        renameBtn.style.display = "block";
    } else {
        renameBtn.style.display = "none";
    }
}

