
chrome.runtime.onInstalled.addListener(async () => {

    let url = chrome.runtime.getURL("config.html");
    let tab = await chrome.tabs.create({url});
    console.log(`Created tab ${tab.id}`);


    chrome.storage.local.get(['info']).then( (result) => {
        try {
            if (isNaN(result.info['default_account']) || result.info['default_account'] === "") {
                chrome.storage.local.set({'info': {'default_account': -1}});
            }
        }
        catch (e) {
            console.log("No info found");
            chrome.storage.local.set({'info': {'default_account': -1}})
        }
    })});

    chrome.storage.local.get(["class_list"]).then( (result) => {
        if (result.class_list === undefined) {
            chrome.storage.local.set({'class_list': JSON.stringify({"subject_names": [], "section_names": []})});
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
    let url = chrome.runtime.getURL("config.html");
    let tab = chrome.tabs.create({ url });
    console.log(`Created tab ${tab.id}`);
    console.log("I was clicked");
});