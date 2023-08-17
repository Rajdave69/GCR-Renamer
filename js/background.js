console.log("Hello")


chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      console.log("e")
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    console.log(request.msg)

    if (request.msg.startsWith("open_page"))
      sendResponse({farewell: "goodbye"});

      chrome.tabs.create({ url: request.msg.replace("open_page_", "") });
  }
);
