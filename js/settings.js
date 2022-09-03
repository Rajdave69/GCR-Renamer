console.debug("settings.html");
const export_btn = document.getElementById('export-btn');
const import_btn = document.getElementById('import-btn');
const file_input = document.getElementById('file-input');
const ignore_section_toggle = document.getElementById('ignore-sections');
const back_button = document.getElementById('main-page');


get_from_local('ignore_sections').then( (res) => {
    ignore_section_toggle.checked = !!res;
})

back_button.addEventListener('click', () => {
    window.location.href = "config.html";
});


// add event listener to ignore_section_toggle to detect toggle state
ignore_section_toggle.addEventListener('change', () => {
    console.debug("ignore_section_toggle changed");
    if (ignore_section_toggle.checked) {
        store_to_local('ignore_sections', true).then(() => {
            console.info("Ignore sections set to true");
        });

    } else {
        store_to_local('ignore_sections',false).then(() => {
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
        get_from_local('class_list').then((result) => {
            console.log(result);
            let temp_json = result;
            get_from_local('ignore_sections').then((ignore_sections) => {
                temp_json['ignore_sections'] = ignore_sections;
                console.log(temp_json);
                get_from_local('account_id').then( (id) => {
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
                store_to_local('class_list', {'subject_names': data['subject_names'], 'section_names': data['section_names']}).then(() => {
                    console.log("done setting class list");
                    store_to_local('ignore_sections', data['ignore_sections']).then(() => {
                        console.log("done setting ignore rules");
                        store_to_local('account_id', data['account_id']).then(() => {
                            console.log("done setting account id");
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



