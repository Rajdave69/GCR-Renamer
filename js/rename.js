/*
Storage Structure

 │
 ├─► class_list    dict: {"subject_names": list, "section_names": list} ─► Stores the actual class list of the Subject and Section names which will be used to rename from.
 │
 ├─► ignore_sections    boolean: Stores a boolean value which controls if section names should be ignored while renaming.
 │
 ├─► gcr_redirection    boolean: Stores a boolean value which controls if the extension should redirect the user to the correct user id on GCR tabs with user id which doesn't match storage.
 │
 ├─► gcr_id    int: Stores the actual google account user-id
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

console.log(location)

if (location.pathname === `/u/${acc_number}/h` || location.pathname === "/h") { // If the user is on the home page

    console.debug("Home Page");
    get_from_local('class_list').then((result) => {    // Get GCR subject and section info
        console.log(result);

        const subject_list = result["subject_names"]; // Get the list of subjects for the account signed into
        const section_list = result["section_names"]; // Get the list of sections for the account signed into
        console.log(subject_list, section_list);

        //const found_subjects = document.getElementsByClassName("z3vRcc-ZoZQ1"); // Get the list of subjects in the page

        // check if subject list and section list are empty
        if (subject_list === undefined) {
            console.log("Subject list is empty");
        } else if (subject_list.length < 1) {   // If subject list or section list is empty
            console.log("Subject or section list is empty");
        } else {  // If subject list or section list is not empty
            get_from_local('ignore_sections').then((res) => {
                console.debug(res);
                if (res) {
                    console.log("Ignoring Sections. Config says so.")
                    setInterval(() => {   // Check every second
                        renameSubject(subject_list);
                        renameSidebar(subject_list, [], true);
                    }, 1000);

                } else {
                    setInterval(() => {   // Check every second
                        renameSubject(subject_list);
                        renameSection(section_list);
                        renameSidebar(subject_list, section_list, false);
                    }, 1000);

                }
            });
        }

    });

}

else if (location.pathname === `/u/${acc_number}/s` || location.pathname === "/s") {
    console.debug("Settings Page");
    get_from_local('class_list').then((result) => {    // Get GCR subject and section info

        const subject_list = result["subject_names"]; // Get the list of subjects for the account signed into
        const section_list = result["section_names"]; // Get the list of sections for the account signed into

        // check if subject list and section list are empty
        if (subject_list === undefined) {
            console.log("Subject list is empty");
        } else if (subject_list.length < 1) {   // If subject list or section list is empty
            console.log("Subject or section list is empty");
        } else {  // If subject list or section list is not empty
            get_from_local('ignore_sections').then((res) => {
                console.debug(res);

                if (res) {
                    console.log("Ignoring Sections. Config says so.")
                    setInterval(() => {   // Check every second
                        renameSettingsPage(subject_list, [], true);
                    }, 10000);

                } else {
                    setInterval(() => {   // Check every second
                        renameSettingsPage(subject_list, section_list, false);
                    }, 10000);

                }
            });
        }

    });
}


function renameSettingsPage(subject_list, section_list, ignore_sections) {
    const found_subjects = GetElementsByExactClassName("PtHAPb asQXV"); // Get the list of subjects in the page
    for (let i = 0; i < found_subjects.length; i++) {
        found_subjects[i].innerText = subject_list[i];
    }
    if (!ignore_sections) {
        const found_sections = GetElementsByExactClassName("cSyPgb"); // Get the list of sections in the page
        for (let i = 0; i < found_sections.length; i++) {
            found_sections[i].innerText = section_list[i];
        }
    }
}


// Renames the Subject Text-Box
function renameSubject(subject_list) {
    const subject = document.getElementsByClassName("z3vRcc-ZoZQ1");  // Find the elements
    for (let i = 0; i < subject.length; i++) {    // For each subject element, change it
    subject[i].innerText = subject_list[i];        // Change the content
    }
}

// Renames the Section Text-Box
function renameSection(section_list) {
    const section = GetElementsByExactClassName("YVvGBb");
    for (let i = 1; i < section.length; i++) {    //Find The Element(s)
     section[i].innerText = section_list[i];    // Change the content
    }
}

function renameSidebar(subject_list, section_list, ignore_sections) {
    const sidebar = GetElementsByExactClassName("nhassd asQXV YVvGBb");
    for (let i = 0; i < sidebar.length; i++) {
        // if it's the first 3 elements or the last 2, skip
        if (i < 3 || i > sidebar.length - 3) {
            continue;
        }
        sidebar[i].innerText = subject_list[i-3];
    }
    if (!ignore_sections) {
        let sidebar_section = GetElementsByExactClassName("TajIHf dDKhVc YVvGBb");
        for (let i = 0; i < sidebar_section.length; i++) {
            sidebar_section[i].innerText = section_list[i];
        }
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


get_from_local('gcr_redirection').then(res => {
    if (res) {
        get_from_local('gcr_id').then(r => {
            console.log(r);
            if (r > -1) {
                // get current account number from location
                let acc_number = location.pathname.charAt(3);
                if (isNaN(parseInt(acc_number))) {
                    console.log(acc_number);
                    acc_number = 0;
                }
                console.log(`Signed in Google Account number is ${acc_number}`);
                if (!isNaN(parseInt(acc_number))) { // If account number is a number
                    if (parseInt(r) !== parseInt(acc_number)) {
                        console.log(`r: ${r} | acc_number: ${acc_number}`);
                        console.log(`Redirecting to account ${r}`);
                        let thing = location.pathname.substring(4);
                        location = `https://classroom.google.com/u/${r}${thing}`;

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

