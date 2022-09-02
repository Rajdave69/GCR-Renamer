console.debug("backup-import.html")
chrome.storage.sync.get(['backup'], (result) => {
    console.log(result['backup'])
    if (result['backup'] !== undefined) {
        console.debug("it is not undefined")
        chrome.storage.local.set({'backup': result['backup']});
        console.debug(result['backup']['default_account'], result['backup']['subject_names'], result['backup']['section_names'], result['backup']['ignore_rules'], result['backup']['default_account']);
        chrome.storage.local.set({'info': {"default_account": result['backup']['default_account']}});
        chrome.storage.local.set({'class_list': JSON.stringify({"subject_names": result['backup']['subject_names'], "section_names": result['backup']['section_names']})});
        chrome.storage.local.set({'ignore-rules': result['backup']['ignore-rules']});
    } else {
        console.error("No backup found");
    }
    location.pathname = "/config.html";
});

