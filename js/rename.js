/*
Useful Class Names:
Subject Text-Box => z3vRcc-ZoZQ1
Section Text-Box => YVvGBb
 */



function get_account_info(account_number) {
    return new Promise( (resolve) => {
        storage_location = `account_info_${account_number}`;
        console.log(storage_location);
        chrome.storage.local.get([storage_location], function (result) {
            resolve(JSON.parse(result[storage_location]));
        });
    });
}


// sleep for 3 seconds
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
sleep(1).then( () => (
get_account_info(1).then( (result) => {
    console.log(result);
    // get subject_name and section_name lists from result
    subject_list = result["subject_names"];
    section_list = result["section_names"];
    console.log(subject_list)
    console.log(section_list)
})
));


// get subject_list and section_list from e



// Run every 1 second
setInterval(function(){
   renameSection();
   renameSubject();
}, 1000);



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
