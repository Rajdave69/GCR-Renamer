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
const CLASSBOX_COURSEPAGE = "T4tcpe PagUde";
const SECTION_INDEX = 1;
const SUBJECT_INDEX = 0;
const CLASSBOX_HEADER = "onkcGd OGhwGf";

// regex which matches /u/{number}/h or /h with optional `/` in the end (GCR home page)
const HOME_REGEX = /^\/((u\/\d+\/h)|u\/1|h)\/?$/;
// regex which matches /u/{number}/c/{string} or /c/{string} (GCR class page)
const COURSE_REGEX = /^\/u\/(\d+)\/c\/([a-zA-Z0-9]+)$|^\/c\/([a-zA-Z0-9]+)$/;
// regex which  matches /u/{number/c/{string}/a/{string}/details or /c/{string}/a/{string}/details (GCR assignment page)
const ASSIGNMENT_REGEX = /^\/u\/(\d+)\/c\/([a-zA-Z0-9]+)\/a\/([a-zA-Z0-9]+)\/details$|^\/c\/([a-zA-Z0-9]+)\/a\/([a-zA-Z0-9]+)\/details$/;

const CLASSID_REGEX = /c\/(.+?)(\/|$)/;

console.log("GCR Class Renamer");

// If home page is opened
if (
    document.location.pathname.match(HOME_REGEX) || // If it is /u/{number}/h
    document.location.pathname === "/"
) {
  console.log("Home page");
  window.addEventListener("load", renameHomePage);
}

// If a course page is opened
else if (document.location.pathname.match(COURSE_REGEX)) {
  console.log("Course page");

  window.addEventListener("load", () => {
    renameCoursePage();
    renameCourseHeader();

  });
}

// If assignment page is opened
else if (document.location.pathname.match(ASSIGNMENT_REGEX)) {
  console.log("Assignment page");
  window.addEventListener("load", renameCourseHeader);
}


//
//
//  >> Observers <<
//
//


let oldPathname = document.location.pathname;
let oldInnerText = "";

// Mutation Observer for path change
const pathObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
      // If the path has changed
      if (document.location.pathname !== oldPathname) {
        oldPathname = document.location.pathname;
        console.log("Pathname changed");

        // If home page is opened
        if (document.location.pathname.match(HOME_REGEX)) {
          console.log("Home page");
          renameHomePage();

          // if a course's page is opened
        } else if (document.location.pathname.match(COURSE_REGEX)) {
          console.log("Class page");
          renameCoursePage();
          renameCourseHeader();

          // if an assignment's page is opened
        } else if (document.location.pathname.match(ASSIGNMENT_REGEX)) {
          console.log("Assignment page");
          renameCourseHeader();
        }
      }

    }
  });
});

// Start observing the document for changes in attributes
pathObserver.observe(document, {
  attributes: true,
  subtree: true,
  attributeFilter: ['href']
});





//
//
//  >> Renaming System <<
//
//


function renameHomePage() {
  getCourseElementsHomePage().then((elements) => {
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

        chrome.storage.sync.set({ // todo remove this

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

        // if courses are found in storage
      } else {

        // get the classes
        const classes = result;
        console.log(result)

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

          // keep checking every second for change in elements[1].innerText
          // if it changes, then rerun the function

          const IntervalId = setInterval(() => {
            if ((document.location.pathname).match(HOME_REGEX) === null) {
              clearInterval(IntervalId);
            }
            if (EDITMODE) {
              clearInterval(IntervalId);
            }

            const divs = elements[0].getElementsByTagName("div");
            const id = elements[0].href.split("/").pop();

            if (divs[SUBJECT_INDEX].innerText !== classes[id].subject) {
              renameHomePage();
            }

            // todo remove
            // add button which does toggleEditMode() to bottom right of screen

            // const button = document.createElement("button");
            // button.innerText = "Toggle Edit Mode";
            // button.style.position = "fixed";
            // button.style.bottom = "0";
            // button.style.right = "0";
            // button.id = "potato"
            // button.addEventListener("click", () => {
            //   toggleEditMode();
            // });
            //
            // document.body.appendChild(button);



          }, 2000);

        }
      }
    });

  });
}



function renameCoursePage() {
  console.debug("Renaming class page")

  // get sync storage
  chrome.storage.sync.get((result) => {
    // get the classes
    const classes = result;

    // Get the class id from the url
    const class_id = (document.location.pathname).match(CLASSID_REGEX)?.[1];

    // If the class doesn't have a section or subject defined in storage, skip it
    if (classes[class_id] === undefined) {
      console.log("Class not found in storage");
    } else {
      getClassBoxCoursePage().then((elements) => {
        elements[0].innerText = classes[class_id].subject;
        elements[1].innerText = classes[class_id].section;
      });
    }
  });
}

function renameCourseHeader() {
  console.debug("Renaming class header");

  getClassHeaderObject().then((element) => {
    console.log(element);
    const class_id = (element.href).match(CLASSID_REGEX)?.[1];

    const hasSection = element.children.length === 2;

    const subjectElement = element.children[SUBJECT_INDEX];
    const sectionElement = element.children[SECTION_INDEX] || "";

    console.log(element.children)

    console.log(subjectElement, sectionElement)

    chrome.storage.sync.get((result) => {
      const classdetails = result[class_id];

      console.log(classdetails);

      console.log("Class header changed");
      // elements has two span elements as children

      const revertChanges = () => {
        if (subjectElement.innerText !== classdetails.subject) {
          subjectElement.innerText = classdetails.subject;
        }
        if (hasSection !== undefined) {
          if (sectionElement.innerText !== classdetails.section) {
            sectionElement.innerText = classdetails.section;
          }
        }
      };

      const checkChanges = () => {
        console.debug("Checking for changes");
        if (subjectElement.innerText !== classdetails.subject) {
          console.log("Changes detected")
          // Changes detected, revert them back
          revertChanges();

        }

        if (document.location.pathname.match(ASSIGNMENT_REGEX) || document.location.pathname.match(COURSE_REGEX)) {
          console.log("Stopping interval");
          clearInterval(intervalId);
        }

      };

      const intervalId = setInterval(checkChanges, 2000); // Check every second

      // Update the initial values
      subjectElement.innerText = classdetails.subject;
      if (hasSection !== undefined) sectionElement.innerText = classdetails.section;

      // Cleanup the interval when needed
      // For example, clearInterval(intervalId) when you want to stop monitoring the changes
    });
  });
}






function getClassBoxCoursePage() {
  // return promise
  return new Promise((resolve, reject) => {
    const elements = document.getElementsByClassName(CLASSBOX_COURSEPAGE);
    // keep trying until elements are available, then resolve
    if (elements.length === 0) {
      setTimeout(() => {
        resolve(getClassBoxCoursePage());
      }, 100);
    } else {
      const h1 = elements[0].getElementsByTagName("h1")[0];
      const div = elements[0].getElementsByTagName("div")[0];
      resolve([h1, div]);
    }
  });
}



function getCourseElementsHomePage() {
  // return promise
  return new Promise((resolve, reject) => {
    const elements = document.getElementsByClassName(CLASSBOX_HOMEPAGE);
    // keep trying until elements are available, then resolve
    if (elements.length === 0) {
      setTimeout(() => {
        resolve(getCourseElementsHomePage());
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

let EDITMODE = false;
