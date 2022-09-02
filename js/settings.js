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
        get_gcr_class_list().then((result) => {
            console.log(result);
            let temp_json = result;
            get_info().then((info) => {
                temp_json['default_account'] = info['default_account'];
                console.log(temp_json);
                get_ignore_rules().then((ignore_rules) => {
                    temp_json['ignore_rules'] = ignore_rules;
                    console.log(temp_json);
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


function get_ignore_rules() {
    return new Promise((resolve) => {
        chrome.storage.local.get('ignore-rules', (result) => {
            resolve(result['ignore-rules']);
        } );
    } );
}

function set_ignore_rules(value) {
    return new Promise((resolve) => {
        chrome.storage.local.set({'ignore-rules': value}, () => {
            resolve();
        } );
    } );
}

function get_gcr_class_list() {
    return new Promise( (resolve) => {
        chrome.storage.local.get(['class_list'], (result) => {
            console.log(result.class_list);
            resolve(JSON.parse(result.class_list));
        });
    });
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

function store_to_cloud(data) {
    return new Promise( (resolve) => {
        chrome.storage.sync.set(data, () => {
            resolve();
        });
    });
}

function set_info(account_info) {
    return new Promise(function (resolve) {
        chrome.storage.local.set({info: account_info}, function () {
        resolve();
        });
    })
}

