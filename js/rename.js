/*

Storage Structure

 │
 ├─► info           dict: {"default_account": int} ─► Stores the auth-user which has renaming activated.
 │
 ├─► class_list     dict: {"class_list": {"subject_names": list, "section_names": list}} ─► Stores the actual list of Subject and Section names which will be used to rename.
 │
 └─► subject_length int ─► Stores simply the number of classes the user is in, which will be used to create the respective amount of input boxes in the front end


Useful Class Names:
Subject Text-Box => z3vRcc-ZoZQ1
Section Text-Box => YVvGBb

 */

let acc_number = location.pathname.substring(3).substring(0, location.pathname.substring(3).indexOf("/"));
console.log(`Signed in Google Account number is ${acc_number}`);


sleep(1).then( () => (  // After sleeping...
    get_info().then((result) => {   // After getting user info from storage...
    console.log(`Userinfo ${JSON.stringify(result)}`);

    if (result['default_account'] == null) {    // If no default account is set
        console.log(`Default account is not set`);
    }

    else {  // If default account is set...
        if (acc_number == result['default_account']) {  // If default account is the account signed into
            console.log("Already on default account: Current Account number is same as default_account number");
        }

        else {  // If default account is not the account signed into
            console.log("Not on default account: Current Account number is different from default_account number");
            location = `https://classroom.google.com/u/${result['default_account']}/h`; // TODO: make it redirect to actual path
        }
    }

    }).then (    // After getting the user-info and checking if it's the default account...
        get_class_list().then( (result) => {    // Get GCR subject and section info
            result = JSON.parse(result['class_list']);
            console.log(result);

            const subject_list = result["subject_names"]; // Get the list of subjects for the account signed into
            const section_list = result["section_names"]; // Get the list of sections for the account signed into
            console.log(subject_list, section_list);

            //const found_subjects = document.getElementsByClassName("z3vRcc-ZoZQ1"); // Get the list of subjects in the page

            // check if subject list and section list are empty
            if (subject_list.length === 0 || section_list.length === 0) {   // If subject list or section list is empty
                console.log("Subject or section list is empty");
            }



            else {  // If subject list or section list is not empty
                setInterval(() => {   // Check every second
                    renameSection(section_list);
                    renameSubject(subject_list);
                }, 1000);
            }

        })
    )
));


// Renames the Subject Text-Box
function renameSubject(subject_list) {
    let subject = document.getElementsByClassName("z3vRcc-ZoZQ1");  // Find the elements
    for (let i = 0; i < subject.length; i++) {    // For each subject element, change it
    subject[i].innerText = subject_list[i];        // Change the content
    }
}

// Renames the Section Text-Box
function renameSection(section_list) {
    let section = GetElementsByExactClassName("YVvGBb");
    for (let i = 1; i < section.length; i++) {    //Find The Element(s)
     section[i].innerText = section_list[i];    // Change the content
    }
}



function get_class_list() {
    return new Promise( (resolve) => {
        chrome.storage.local.get(['class_list'], (result) => {
            resolve(result);
        });
    });
}

function get_info() {
    return new Promise(function (resolve) {
        chrome.storage.local.get(['info'], function (result) {
            resolve(result.info);
        });
    });
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



// Finds all elements with only given exact class name.
function GetElementsByExactClassName(class_name) {
    let i, length, data = [];
    let element_list = document.getElementsByClassName(class_name);
    if (!element_list || !(length = element_list.length))
    return [];
    for (i = 0; i < length; i++) {if (element_list[i].className === class_name)data.push(element_list[i]);}
    return data;}
