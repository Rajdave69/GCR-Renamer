/*
Storage Structure

 │
 ├─► info  dict: {"default_account": int} ─► Stores the auth-user which has renaming activated.
 │
 ├─► class_list    dict: {"class_list": {"subject_names": list, "section_names": list}} ─► Stores the actual list of Subject and Section names which will be used to rename.
 │
 └─► ignore-rules boolean ─► Stores a boolean value which controls if section names should be ignored or not
 */


let subject_list = [];
let section_list = [];
const renameBtn = document.getElementById('rename-btn');


// TODO : Make force dark mode for gcr
console.log("JS Loaded");
console.log(location.pathname)
// index.html JS
if (location.pathname === "/config.html") {

    const submitBtn = document.getElementById('submit');
    const classroomURL = document.getElementById('gcr-url');
    const classesAmount = document.getElementById('classes-amount');
    const subjectsArea = document.getElementById('subjects-area');
    const sectionsArea = document.getElementById('sections-area');
    const settings_page = document.getElementById('settings-page');
    // const BtnContainer = document.getElementById('lower');
    const expForURL = new RegExp("classroom\\.google\\.com/u/\\d+");
    let gcr_input_hidden = false;
    let _user_id;
    create_lists().then(() => {
        get_gcr_class_list().then((result) => {
            if (result['subject_names'].length > 0) {
                create_boxes(result['subject_names'].length, subjectsArea, sectionsArea);
                toggle_rename_button("on");

                let class_number_input = document.getElementById('classes-amount');
                class_number_input.setAttribute("value", result['subject_names'].length);

            }
        });

    })


    /*
        >> Event Listeners

           This part of the code is responsible for listening to events and performing actions accordingly.
           It contains only event listeners.
    */

    settings_page.addEventListener('click', () => {
        window.location.href = "settings.html";
    })

    submitBtn.addEventListener('click', () => { // Event listener for the submit button

        let URL = classroomURL.value.trim();
        const amount = classesAmount.value.trim();
        let URLError;
        let amountError1;
        let amountError2;

        if (!expForURL.test(URL)) { // If the URL is not valid
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

        if (isNaN(parseInt(amount))) {  // If amount is not NaN and is not empty
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
            get_info().then((result) => {
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
                            set_info({"default_account": user_id}).then(() => {
                                console.info("User ID has been updated");
                            });

                        }
                    }
                }

                create_lists(true).then(() => {
                    console.debug("created lists")
                    create_boxes(parseInt(amount), subjectsArea, sectionsArea);
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
        }).then(() => {
            console.info("Class list set");
        });

    });


}

else if (location.pathname === "/settings.html") {
    console.debug("settings.html");
    const export_btn = document.getElementById('export-btn');
    const import_btn = document.getElementById('import-btn');
    const file_input = document.getElementById('file-input');
    const ignore_section_toggle = document.getElementById('ignore-sections');
    const back_button = document.getElementById('main-page');

    get_ignore_rules().then( (res) => {
        ignore_section_toggle.checked = !!res;
    })

    back_button.addEventListener('click', () => {
        window.location.href = "config.html";
    } );


    // add event listener to ignore_section_toggle to detect toggle state
    ignore_section_toggle.addEventListener('change', () => {
        console.debug("ignore_section_toggle changed");
        if (ignore_section_toggle.checked) {
            set_ignore_rules(true).then(() => {
                console.info("Ignore sections set to true");
            });
        } else {
            set_ignore_rules(false).then(() => {
                console.info("Ignore sections set to false");
            });
        }
    });


    export_btn.addEventListener('click', () => {
        export_to_json().then( () => {
            let tick_box = document.getElementById('export_complete');
            tick_box.checked = true;
        });
    } );


    import_btn.addEventListener('click', () => {
        file_input.style.display = "block";
        import_from_json().then( () => {
            file_input.style.display = "none";

            let tick_box = document.getElementById('import_complete');
            tick_box.checked = true;

        } );
    } );
}





/*
    >> Functions
        This part of the code contains all the functions that are used in the code.
        It contains all the functions that are used in the code.

 */

function set_ignore_rules(info) {
    return new Promise((resolve) => {
        chrome.storage.local.set({'ignore-rules': info}, () => {
            resolve();
        } );
    } );
}

function get_ignore_rules() {
    return new Promise((resolve) => {
        chrome.storage.local.get('ignore-rules', (result) => {
            resolve(result['ignore-rules']);
        } );
    } );
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

        subjectsArea.innerText = "";
    sectionsArea.innerText = "";

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
           console.debug("ignoring user id");

           get_gcr_class_list().then((result) => {
               console.log(result);

               for (let i = 0; i < result['subject_names'].length; i++) {
                   subject_list.push(result['subject_names'][i]);
                   section_list.push(result['section_names'][i]);
               }

           });
            return resolve();
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

                    console.debug(_user_id)

                });

            } else {                    // If the user does not have a default account

            }
            resolve();
        });
    });
}

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


function toggle_rename_button(state) {
    // hide and show rename button
    if (state === "on") {
        renameBtn.style.display = "block";
    } else {
        renameBtn.style.display = "none";
    }
}

function store_to_cloud(data) {
    return new Promise( (resolve) => {
        chrome.storage.sync.set(data, () => {
            resolve();
        });
    });
}

function export_to_json() {
    return new Promise( (resolve) => {
        get_gcr_class_list().then((result) => {
            console.log(result);
            store_to_cloud({'backup': result}).then(() => {
                let temp_json = result;
                get_info().then((info) => {
                    temp_json['default_account'] = info['default_account'];
                    console.log(temp_json);
                    get_ignore_rules().then((ignore_rules) => {
                        temp_json['ignore_rules'] = ignore_rules;
                        console.log(temp_json);

                        let json = JSON.stringify(temp_json);
                        let blob = new Blob([json], {type: "application/json"});
                        let url = URL.createObjectURL(blob);
                        let a = document.createElement("a");
                        a.href = url;
                        a.download = "gcr_class_list.json";
                        document.body.appendChild(a);
                        a.click();
                        resolve();
                    });
                });
            });
        }).catch((error) => {
            console.error(error);
            resolve();
        } );
    } );
}

function import_from_json() {
    return new Promise( (resolve) => {

        let fileInput = document.getElementById('file-input');
        fileInput.addEventListener('change', function (e) {
            let file = fileInput.files[0];
            let reader = new FileReader();
            // check if file is a json file
            if (file.name.split('.').pop() !== 'json') {
                alert("Please select a JSON file");
                return;
            }
            reader.onload = function (e) {
                const data = JSON.parse(reader.result);
                console.log(data);
                set_gcr_class_list({'subject_names': data['subject_names'], 'section_names': data['section_names']}).then(() => {
                    console.log("done setting class list");
                    set_ignore_rules(data['ignore_rules']).then(() => {
                        console.log("done setting ignore rules");
                        set_info({"default_account": parseInt(data['default_account'])}).then(() => {
                            console.log("done setting info");
                            resolve();
                        } );
                    } );
                } );
            };
            reader.readAsText(file);
        });
    } );
}