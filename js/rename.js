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

sleep(1).then( () => (
    get_info().then((result) => {
    console.log(`Userinfo ${result}`);
    if (result['default_account'] == null) {
        console.log(`Default account is not set`);
    }
    else {
        // change path account number to default account number

        if (acc_number == result['default_account'])
        {
            console.log("Line 47, account number is SAME as default account number");
            console.log("Already on default account");
        }
        else {
            console.log("Line 51, account number is DIFFERENT from default account number");
            console.log(acc_number)
            console.log(result['default_account'])
        location = `https://classroom.google.com/u/${result['default_account']}/h`;
        }

    }
}).then(


get_account_info(acc_number).then( (result) => {
    console.log(result);
    // get subject_name and section_name lists from result
    subject_list = result["subject_names"];
    section_list = result["section_names"];
    console.log(subject_list)
    console.log(section_list)

    // check if subject list and section list are empty
    if (subject_list.length === 0 || section_list.length === 0) {
        console.log("Subject or section list is empty");
    }
    else {
        setInterval(() =>{
   renameSection();
   renameSubject();
}, 1000);


    }
}))
));


// get subject_list and section_list from e



// Run every 1 second


// Renames the Subject Text-Box
function renameSubject() {
    let subject = document.getElementsByClassName("z3vRcc-ZoZQ1");  // Find the elements

    for(let i = 0; i < subject.length; i++){    // For each subject element, change it
    subject[i].innerText = subject_list[i];        // Change the content
    }
}


// Renames the Section Text-Box
function renameSection() {
    let section = GetElementsByExactClassName("YVvGBb");

    for(let i = 1; i < section.length; i++){    //Find The Element(s)
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
