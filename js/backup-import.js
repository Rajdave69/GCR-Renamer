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
console.debug("backup-import.html")
chrome.storage.sync.get(['backup'], (result) => {
    console.log(result['backup'])
    if (result['backup'] !== undefined) {

        console.debug("it is not undefined")
        console.debug(result['backup']['default_account'], result['backup']['subject_names'], result['backup']['section_names'], result['backup']['ignore_sections'], result['backup']['default_account']);

        chrome.storage.local.set({'backup': result['backup']});
        chrome.storage.local.set({'class_list': {"subject_names": result['backup']['subject_names'], "section_names": result['backup']['section_names']}});
        chrome.storage.local.set({'ignore_sections': result['backup']['ignore_sections']});
        chrome.storage.local.set({'gcr_id': result['backup']['gcr_id']});
        chrome.storage.local.set({'gcr_redirection': result['backup']['gcr_redirection']});

    } else {
        console.error("No backup found");
    }
    location.pathname = "/index.html";
});

