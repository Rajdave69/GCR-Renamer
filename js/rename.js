/*
Useful Class Names:
Subject Text-Box => z3vRcc-ZoZQ1
Section Text-Box => YVvGBb
 */

acc_number = location.pathname
acc_number = acc_number.substring(3);
acc_number = acc_number.substring(0, acc_number.indexOf("/"));
console.log(`Signed in Google Account number is ${acc_number}`);

console.log(acc_number.substring(3).substring(0, acc_number.indexOf("/")));

function get_account_info(account_number) {
    return new Promise( (resolve) => {
        storage_location = `account_info_${account_number}`;
        console.log(storage_location);
        chrome.storage.local.get([storage_location], function (result) {
            resolve(JSON.parse(result[storage_location]));
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

sleep(1).then( () => (  // After sleeping...
    get_info().then((result) => {   // After getting user info from storage...
    console.log(`Userinfo ${result}`);

    if (result['default_account'] == null) {    // If no default account is set
        console.log(`Default account is not set`);
    }

    else {  // If default account is set...

        if (acc_number == result['default_account']) {  // If default account is the account signed into
            console.log("Already on default account: Current Account number is same as default_account number");
        }

        else {  // If default account is not the account signed into
            console.log("Not on default account: Current Account number is different from default_account number");
            location = `https://classroom.google.com/u/${result['default_account']}/h`;
        }

    }

    }).then (    // After getting the user-info and checking if it's the default account...
        get_account_info(acc_number).then( (result) => {    // Get Google Classroom subject and section info for the account signed into
            console.log(result);

            let subject_list = result["subject_names"]; // Get the list of subjects for the account signed into
            let section_list = result["section_names"]; // Get the list of sections for the account signed into
            console.log(subject_list)
            console.log(section_list)

            // check if subject list and section list are empty
            if (subject_list.length === 0 || section_list.length === 0) {   // If subject list or section list is empty
                console.log("Subject or section list is empty");
            }

            else {  // If subject list or section list is not empty
                setInterval(() => {   // Check every second
                    renameSection();
                    renameSubject();
                }, 1000);


                }
        })
    )
));


// get subject_list and section_list from e



// Run every 1 second


// Renames the Subject Text-Box
function renameSubject() {
    let subject = document.getElementsByClassName("z3vRcc-ZoZQ1");  // Find the elements

    for (let i = 0; i < subject.length; i++) {    // For each subject element, change it
    subject[i].innerText = subject_list[i];        // Change the content
    }
}


// Renames the Section Text-Box
function renameSection() {
    let section = GetElementsByExactClassName("YVvGBb");

    for (let i = 1; i < section.length; i++) {    //Find The Element(s)
     section[i].innerText = section_list[i];    // Change the content
    }
}




// Finds all elements with only given exact class name.
function GetElementsByExactClassName(class_name) {
    let i, length, element_list, data = [];
    element_list = document.getElementsByClassName(class_name);
    if (!element_list || !(length = element_list.length))
    return [];
    for (i = 0; i < length; i++) {if (element_list[i].className === class_name)data.push(element_list[i]);}
    return data;}
