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

Useful Class Names:
Subject Text-Box => z3vRcc-ZoZQ1
Section Text-Box => YVvGBb

 */

let acc_number = location.pathname.substring(3).substring(0, location.pathname.substring(3).indexOf("/"));
console.log(`Signed in Google Account number is ${acc_number}`);


get_from_local('class_list').then( (result) => {    // Get GCR subject and section info
    console.log(result);

    const subject_list = result["subject_names"]; // Get the list of subjects for the account signed into
    const section_list = result["section_names"]; // Get the list of sections for the account signed into
    console.log(subject_list, section_list);

    //const found_subjects = document.getElementsByClassName("z3vRcc-ZoZQ1"); // Get the list of subjects in the page

    // check if subject list and section list are empty
    if (subject_list === undefined) {
        console.log("Subject list is empty");
    }
    else if (subject_list.length < 1) {   // If subject list or section list is empty
        console.log("Subject or section list is empty");
    }




    else {  // If subject list or section list is not empty
        get_from_local('ignore_sections').then( (res) => {
            console.debug(res);
            console.log("Ignoring Sections. Config says so.")
            if (res) {
                setInterval(() => {   // Check every second
                    renameSubject(subject_list);
                    }, 1000);

            } else {
                setInterval(() => {   // Check every second
                    renameSubject(subject_list);
                    renameSection(section_list);
                    }, 1000);

            }
        });
    }

});


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



// Finds all elements with only given exact class name.
function GetElementsByExactClassName(class_name) {
    let i, length, data = [];
    let element_list = document.getElementsByClassName(class_name);
    if (!element_list || !(length = element_list.length))
    return [];
    for (i = 0; i < length; i++) {if (element_list[i].className === class_name)data.push(element_list[i]);}
    return data;}

function get_from_local(data_type) {
    return new Promise( (resolve) => {
        chrome.storage.local.get([data_type], (result) => {
            resolve(result[data_type]);
        });

    });
}

    /*
    get_info().then((result) => {   // After getting user info from storage...
    console.log(`Userinfo ${JSON.stringify(result)}`);

    if (result['default_account'] == null) {    // If no default account is set
        console.log(`Default account is not set`);
    }

    else {  // If default account is set...
        if (acc_number == result['default_account']) {  // If default account is the account signed into
            console.log("Already on default account: Current Account number is same as default_account number");
        }
        else if (result['default_account'] < 0) {
            console.log("default account is set to be under 0. Skipping redirect")
        }
        else {  // If default account is not the account signed into
            console.log("Not on default account: Current Account number is different from default_account number");
            location = `https://classroom.google.com/u/${result['default_account']}/h`; // TODO: make it redirect to actual path
        }
    }

    }).then (    // After getting the user-info and checking if it's the default account...
    */
get_from_local('gcr_redirection').then(res => {
    if (res) {
        get_from_local('gcr_id').then(r => {
            console.log(r);
            if (r > -1) {
                // get current account number from location
                let acc_number = location.pathname.substring(3).substring(0, location.pathname.substring(3).indexOf("/"));
                console.log(`Signed in Google Account number is ${acc_number}`);
                if (!isNaN(parseInt(acc_number))) { // If account number is a number
                    if (parseInt(r) !== parseInt(acc_number)) {
                        console.log(`r: ${r} | acc_number: ${acc_number}`);
                        console.log(`Redirecting to account ${r}`);
                        location = `https://classroom.google.com/u/${r}/h`;
                    } else {
                        console.log(`Already on account ${r}`);
                    }
                }

            } else {
                console.log("r is less than 0. Skipping redirect");
            }
        })
    } else {
        console.log("Redirection is disabled. Skipping redirect");
    }

})