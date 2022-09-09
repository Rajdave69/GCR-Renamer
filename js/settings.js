/*
Storage Structure

 │
 ├─► class_list    dict: {"subject_names": list, "section_names": list} ─► Stores the actual class list of the Subject and Section names which will be used to rename from.
 │
 ├─► ignore_sections    boolean: Stores a boolean value which controls if section names should be ignored while renaming.
 │
 ├─► gcr_redirection    boolean: Stores a boolean value which controls if the extension should redirect the user to the correct user id on GCR tabs with user id which doesn't match storage.
 │
 ├─► gcr_url    int: Stores the actual google account user-id
 │
 ├─► just_installed     boolean: Stores a boolean value which indicates if the extension was just installed. It will be true only upon installation/update.
 │
 └─► backup    dict: Stores all user data together
 */

console.debug("settings.html");
const export_btn = document.getElementById('export-btn');
const import_btn = document.getElementById('import-btn');
const file_input = document.getElementById('file-input');
const ignore_section_toggle = document.getElementById('ignore-sections');
const back_button = document.getElementById('main-page');
const gcr_url_input = document.getElementById('user-id-input');
const gcr_redirection_toggle = document.getElementById('gcr-redirection');

get_from_local('ignore_sections').then( (res) => {
    ignore_section_toggle.checked = !!res;
})
get_from_local('gcr_redirection').then( (res) => {
    gcr_redirection_toggle.checked = !!res;
})
get_from_local('gcr_url').then( (res) => {
    gcr_url_input.value = `classroom.google.com/u/${res}/h`;
})


back_button.addEventListener('click', () => {
    window.location.href = "index.html";
});

gcr_url_input.addEventListener('change', (e) => {
    // check regex
    if (e.target.value.match("classroom\\.google\\.com")) {
        console.log("passed")
        // remove https://
        let url = e.target.value.replace("https://", "").slice(20);
        let id;
        if (url.length > 0) {
            id = url.split("/");
            const results = id.filter(element => {
                return element !== '';
            });
            id = results[1];
            console.log(id);

        } else {
            id = 0;
        }
        console.log(id)
        console.log(url);
        if (id) {
            store_to_local('gcr_id', parseInt(id)).then( () => {
                console.log(id);
                alert("User ID saved successfully!");
            });
        }
    }
});


gcr_redirection_toggle.addEventListener('change', (e) => {
    console.debug("gcr_redirection_toggle changed");

    store_to_local('gcr_redirection', e.target.checked).then(r => {
        console.log(r);
    });
});


// add event listener to ignore_section_toggle to detect toggle state
ignore_section_toggle.addEventListener('change', (e) => {
    console.debug("ignore_section_toggle changed");

    store_to_local('ignore_sections', e.target.checked).then(() => {
            console.info("Ignore sections set to " + e.target.checked);
    });
});


export_btn.addEventListener('click', () => {
    export_to_json().then( () => {
        let tick_box = document.getElementById('export_complete');
        tick_box.checked = true;
    });
});


import_btn.addEventListener('click', () => {
    file_input.style.display = "block";
    import_from_json().then( () => {
        file_input.style.display = "none";

        let tick_box = document.getElementById('import_complete');
        tick_box.checked = true;

    });
});



/*
    >> Functions


*/


function export_to_json() {
    return new Promise( (resolve) => {
        get_from_local('class_list').then((result) => {
            console.log(result);
            let temp_json = result;
            get_from_local('ignore_sections').then((ignore_sections) => {
                temp_json['ignore_sections'] = ignore_sections;
                get_from_local('gcr_url').then( (id) => {
                    temp_json['gcr_url'] = id;
                    get_from_local('gcr_redirection').then( (redirection) => {
                        temp_json['gcr_redirection'] = redirection;
                        store_to_cloud({'backup': temp_json}).then(() => {
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
            });
        });
    });
}


function import_from_json() {
    return new Promise( (resolve) => {

        let fileInput = document.getElementById('file-input');
        fileInput.addEventListener('change', function () {
            let file = fileInput.files[0];
            let reader = new FileReader();
            // check if file is a json file
            if (file.name.split('.').pop() !== 'json') {
                alert("Please select a JSON file");
                return;
            }
            reader.onload = function() {
                const data = JSON.parse(reader.result);
                console.log(data);
                store_to_local('class_list', {'subject_names': data['subject_names'], 'section_names': data['section_names']}).then(() => {
                    console.log("done setting class list");
                    store_to_local('ignore_sections', data['ignore_sections']).then(() => {
                        console.log("done setting ignore rules");
                        store_to_local('gcr_url', data['gcr_url']).then(() => {
                            console.log("done setting account id");
                            store_to_local('gcr_redirection', data['gcr_redirection']).then(() => {
                                console.log("done setting gcr redirection");
                                resolve();
                            });
                            resolve();
                        });
                    });
                });
            };
            reader.readAsText(file);
        });
    });
}


function get_from_local(data_type) {
    return new Promise( (resolve) => {
        chrome.storage.local.get([data_type], (result) => {
            resolve(result[data_type]);
        });

    });
}

function store_to_local(data_type, data) {
    return new Promise( (resolve) => {
        chrome.storage.local.set({[data_type]: data}, () => {
            resolve();
        });
    });
}

function store_to_cloud(data) {
    return new Promise( (resolve) => {
        chrome.storage.sync.set(data, () => {
            resolve();
        });
    });
}



