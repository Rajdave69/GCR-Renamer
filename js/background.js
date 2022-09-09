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

chrome.runtime.onInstalled.addListener(async () => {
    /*
         >> First time installation functions

         This below code sets default values to the storage (if empty), on install.
    */
    let url = chrome.runtime.getURL("index.html");
    let tab = await chrome.tabs.create({url});
    console.log(`Created tab ${tab.id}`);

    set_default_values().then( () => {
        console.log("Default values set");
        chrome.storage.local.set({'just_installed': true});

    });
});



chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        console.info(
        `Storage key "${key}" in namespace "${namespace}" changed.`,
        `Old value was "${JSON.stringify(oldValue)}", new value is "${JSON.stringify(newValue)}".`
    );
  }
});




chrome.action.onClicked.addListener(function() {
    let url = chrome.runtime.getURL("index.html");
    let tab = chrome.tabs.create({ url });
    console.log(`Created tab ${tab.id}`);
    console.log("I was clicked");
});



function set_default_values() {
    return new Promise( (resolve) => {
        /*
        chrome.storage.local.get(['info']).then((result) => {
            try {
                if (isNaN(result.info['default_account']) || result.info['default_account'] === "") {
                    chrome.storage.local.set({'info': {'default_account': -1}});
                }
            } catch (e) {
                console.log("No info found");
                chrome.storage.local.set({'info': {'default_account': -1}})
            }
        });
        */

        chrome.storage.local.get(["class_list"]).then((result) => {
            if (result.class_list === undefined) {
                chrome.storage.local.set({'class_list': JSON.stringify({"subject_names": [], "section_names": []})});
            }
        });

        chrome.storage.local.get(['ignore_sections']).then((result) => {
            if (result['ignore_sections'] === undefined) {
                chrome.storage.local.set({'ignore_sections': false});
            }
        }).catch((e) => {
            console.log(e);
        });

        resolve(true);
    });
}