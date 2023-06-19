/*
Data structure:
{
   "class_id":{
      "subject":"subject1",
      "section":"section1"
   },
   "class_id":{
      "subject":"subject2",
      "section":"section2"
   },
   "class_id":{
      "subject":"subject3",
      "section":"section3"
   },
   "class_id":{
      "subject":"subject4",
      "section":"section4"
   }
}
 */

// The classes of the `a` tag which make up a GCR class's names
const CLASSBOX_HOMEPAGE = "onkcGd eDfb1d YVvGBb Vx8Sxd";
const CLASSBOX_CLASSPAGE = "T4tcpe PagUde";
const SECTION_INDEX = 1;
const SUBJECT_INDEX = 0;
const CLASSBOX_HEADER = "onkcGd OGhwGf";

// regex which matches /u/{number}/h or /h (GCR home page)
const HOME_REGEX = /^\/u\/(\d+)\/h$|^\/h$/;
// regex which matches /u/{number}/c/{string} or /c/{string} (GCR class page)
const CLASS_REGEX = /^\/u\/(\d+)\/c\/([a-zA-Z0-9]+)$|^\/c\/([a-zA-Z0-9]+)$/;
// regex which  matches /u/{number/c/{string}/a/{string}/details or /c/{string}/a/{string}/details (GCR assignment page)
const ASSIGNMENT_REGEX = /^\/u\/(\d+)\/c\/([a-zA-Z0-9]+)\/a\/([a-zA-Z0-9]+)\/details$|^\/c\/([a-zA-Z0-9]+)\/a\/([a-zA-Z0-9]+)\/details$/;

const CLASSID_REGEX = /c\/(.+?)(\/|$)/;

// If home page is opened
if (document.location.pathname.match(HOME_REGEX)) {
  console.log("Home page");
  window.addEventListener("load", renameHomeClasses);
}

// If class page is opened
else if (document.location.pathname.match(CLASS_REGEX)) {

  console.log("Class page");

  window.addEventListener("load", () => {
    renameClassPage();
    renameClassHeader();

  });

}

// If assignment page is opened
else if (document.location.pathname.match(ASSIGNMENT_REGEX)) {
  console.log("Assignment page");
  window.addEventListener("load", renameClassHeader);
}


//
//
//  >> Renaming System <<
//
//


function renameHomeClasses() {
  getClassElementsHomePage().then((elements) => {
    // get sync storage
    chrome.storage.sync.get((result) => {

      // If the user is using the legacy storage system, convert it to the new system
      if (result['backup'] !== undefined) {
        // empty whole storage
        chrome.storage.sync.clear();

        // todo tell user that storage was cleared

        // if the user has no data set
      } else if (result === undefined || result === null || Object.keys(result).length === 0) {
        // todo tell user that storage is empty
        console.log("Storage is empty");

        chrome.storage.sync.set({

          "NTk4NDQyOTI0MjAx": {
            "subject": "Main Class Group",
            "section": "E"
          },
          "NTk4NDA0NTIwMzc3": {
            "subject": "Math",
            "section": "section2"
          },
          "NTQzNDg1Mzc0NDU2": {
            "subject": "Chemistry",
            "section": "section3"
          },
          "NTk5NDUxNzQ4NjEy": {
            "subject": "History",
            "section": "section4"
          }
        });

        // if classes are found in storage
      } else {

        // get the classes
        const classes = result;

        // loop through the classes
        for (let i = 0; i < elements.length; i++) {
          // Get the class id from the `a` element's href
          const class_id = elements[i].href.split("/").pop();

          // If the class doesn't have a section or subject defined in storage, skip it
          if (classes[class_id] === undefined) {
            console.log("Class not found in storage");
            continue;
          }

          // Get the divs inside the `a` element
          const divs = elements[i].getElementsByTagName("div");

          // div[0] is the subject div, div[1] is the section div
          divs[SUBJECT_INDEX].innerText = classes[class_id].subject;
          divs[SECTION_INDEX].innerText = classes[class_id].section;
        }
      }
    });

  });
  /*
     .then(() => {
         pathObserver.observe(document.body, {
         childList: true,
         subtree: true,
         });
     });
     */
}


function renameClassPage() {
  // get sync storage
  chrome.storage.sync.get((result) => {
    // get the classes
    const classes = result;

    // Get the class id from the url
    const class_id = document.location.pathname.split("/").pop();

    // If the class doesn't have a section or subject defined in storage, skip it
    if (classes[class_id] === undefined) {
      console.log("Class not found in storage");
    } else {
      getClassBoxClassPage().then((elements) => {
        elements[0].innerText = classes[class_id].subject;
        elements[1].innerText = classes[class_id].section;
      });
    }
  });
}

function renameClassHeader() {
  getClassHeaderObject().then((elements) => {
    console.log(elements);
    const class_id = (elements.href).match(CLASSID_REGEX)?.[1];

    chrome.storage.sync.get((result) => {
      const classdetails = result[class_id]

      // elements has two span elements as children
      elements.children[0].innerText = classdetails.subject;
      elements.children[1].innerText = classdetails.section;
      console.log(classdetails);

      // run a f

    });
  });
}




function getClassBoxClassPage() {
  // return promise
  return new Promise((resolve, reject) => {
    const elements = document.getElementsByClassName(CLASSBOX_CLASSPAGE);
    // keep trying until elements are available, then resolve
    if (elements.length === 0) {
      setTimeout(() => {
        resolve(getClassBoxClassPage());
      }, 100);
    } else {
      const h1 = elements[0].getElementsByTagName("h1")[0];
      const div = elements[0].getElementsByTagName("div")[0];
      resolve([h1, div]);
    }
  });
}



function getClassElementsHomePage() {
  // return promise
  return new Promise((resolve, reject) => {
    const elements = document.getElementsByClassName(CLASSBOX_HOMEPAGE);
    // keep trying until elements are available, then resolve
    if (elements.length === 0) {
      setTimeout(() => {
        resolve(getClassElementsHomePage());
      }, 100);
    } else {
      resolve(elements);
    }
  });
}

function getClassHeaderObject() {
  // return promise
  return new Promise((resolve, reject) => {
    const element = document.getElementsByClassName(CLASSBOX_HEADER);
    // keep trying until elements are available, then resolve
    if (element.length === 0) {
      setTimeout(() => {
        resolve(getClassHeaderObject());
      }, 100);
    } else {
      resolve(element[0]);
    }
  });
}


/*
const pathObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
      console.log("There was a mutation")
    if (mutation.addedNodes.length) {
      // renameHomeClasses();
    }
  });
});
*/
