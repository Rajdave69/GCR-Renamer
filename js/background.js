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

    const e = await chrome.storage.local.get(["first_install"]);
    if (e.first_install === undefined) {
        chrome.storage.local.set({
            first_install: false,
            class_list: {
                subject_names: [],
                section_names: []
            },
            ignore_sections: false,
            gcr_redirection: false,
            gcr_url: "",
            just_installed: true
        });
        let url = chrome.runtime.getURL("index.html?first_install=true");
        let tab = await chrome.tabs.create({url});
        console.log(`Created tab ${tab.id}`);
        console.debug("First time installation");

    } else {
        let url = chrome.runtime.getURL("index.html?just_updated=true");
        let tab = await chrome.tabs.create({url});
        console.log(`Created tab ${tab.id}`);
        console.debug("Updated extension");
    }
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

