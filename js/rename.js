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

/*
Notes:
- For the love of god, if you ever want to get a class id from anywhere use the CLASSID_REGEX and not the split method.

 */


// The classes of the `a` tag which make up a GCR class's names
const HOMEPAGE_NAMEBOX = "onkcGd eDfb1d YVvGBb Vx8Sxd";
const COURSEPAGE_NAMEBOX = "T4tcpe PagUde";
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

console.log("GCR Renamer");

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
  let convertedData = undefined;
  getElementsByClassName(HOMEPAGE_NAMEBOX).then((elements) => {
    chrome.storage.local.get((result) => {
      console.log(result)

      if (result['class_list'] !== undefined) {
        console.log("owo")
        // convert from the old storage method
        // old storage format - ['class_list] dict: {"subject_names": list[str], "section_names": list[str]}

        let tempDict = {}

        // get list of class ids from the page
        for (let i = 0; i < elements.length; i++) {
          // const class_id = elements[i].href.split("/").pop();
          const class_id = (elements[i]).match(CLASSID_REGEX)?.[1];
          console.log(class_id)
          tempDict[class_id] = {
            "subject": result['class_list']['subject_names'][i],
            "section": result['class_list']['section_names'][i]
          }
        }

        // set the new storage format
        chrome.storage.sync.set(tempDict, () => {
          console.log(tempDict)
          convertedData = tempDict
          console.log("Converted storage format")
          chrome.storage.local.remove('class_list')

        })

      }

    })

    // get sync storage
    chrome.storage.sync.get((result) => {

      // if the user has no data set
      if (result === undefined || result === null || Object.keys(result).length === 0) {
        console.log("Storage is empty");

        createRenameButton()

        alert("You have no custom class names set. Please click the edit button (bottom right after you close this popup) to set custom names");

        // if courses are found in storage
      } else {

        // get the classes
        const classes = result;
        console.log(result)

        // loop through the classes
        createRenameButton()

        for (let i = 0; i < elements.length; i++) {
          // Get the class id from the `a` element's href
          const class_id = (elements[i].href).match(CLASSID_REGEX)?.[1];
          console.log(class_id)

          // If the class doesn't have a section or subject defined in storage, skip it
          if (classes[class_id] === undefined) {
            console.log("Class not found in storage");
            continue;
          }

          // Get the divs inside the `a` element
          const divs = elements[i].getElementsByTagName("div");

          const revertChanges = () => {
            if (divs[SUBJECT_INDEX].innerText !== classes[class_id].subject) {
              divs[SUBJECT_INDEX].innerText = classes[class_id].subject;
            }
            if (divs[SECTION_INDEX].innerText !== classes[class_id].section) {
              divs[SECTION_INDEX].innerText = classes[class_id].section;
            }
          };

          const checkChanges = () => {
            if (!document.location.pathname.match(HOME_REGEX)) {
              clearInterval(intervalId);
              console.debug("Cleared home page interval")
            }

            if (divs[SUBJECT_INDEX].innerText !== classes[class_id].subject) {
              revertChanges();
            }
          };

          revertChanges();
          const intervalId = setInterval(checkChanges, 2000); // Check every second


        }
      }
    });

  });
}



function renameCoursePage() {
  console.debug("Renaming class page")

  // get sync storage
  chrome.storage.sync.get((result) => {

    // Get the class id from the url
    const class_id = (document.location.pathname).match(CLASSID_REGEX)?.[1];
    const classInfo = result[class_id];

    // If the class doesn't have a section or subject defined in storage, skip it
    if (classInfo === undefined) {
      console.log("Class not found in storage");

    } else {

      getElementsByClassName(COURSEPAGE_NAMEBOX).then((elements) => {

        elements = elements[0].children;
        const currentUrl = document.location.href;

        console.log(elements)

        const revertChanges = () => {
          if (elements[0].innerText !== classInfo.subject) {
            elements[0].innerText = classInfo.subject;
          }
          if (elements[1].innerText !== classInfo.section) {
            elements[1].innerText = classInfo.section;
          }
        };

        const checkChanges = () => {
          if (currentUrl !== document.location.href) {
            clearInterval(intervalId);
            console.debug("Cleared class page interval")
          }

          if (elements[0].innerText !== classInfo.subject) {
            revertChanges();
          }
        };

        // run the revertChanges(); function 20times with 100ms delay
        for (let i = 0; i < 20; i++) {
          setTimeout(revertChanges, 100);
        }

        const intervalId = setInterval(checkChanges, 1000); // Check every second
      });
    }
  });
}

function renameCourseHeader() {
  console.debug("Renaming class header");

  getElementsByClassName(CLASSBOX_HEADER).then((element) => {
    console.log(element);
    const class_id = (element[0].href).match(CLASSID_REGEX)?.[1];

    const hasSection = element[0].children.length === 2;

    const subjectElement = element[0].children[SUBJECT_INDEX];
    const sectionElement = element[0].children[SECTION_INDEX] || "";

    chrome.storage.sync.get((result) => {
      const resultDetails = result[class_id];

      console.log("Class header changed");
      // elements has two span elements as children

      const revertChanges = () => {
        if (subjectElement.innerText !== resultDetails.subject) {
          subjectElement.innerText = resultDetails.subject;
        }
        if (hasSection !== undefined) {
          if (sectionElement.innerText !== resultDetails.section) {
            sectionElement.innerText = resultDetails.section;
          }
        }
      };

      const checkChanges = () => {
        if (!document.location.pathname.match(COURSE_REGEX) && !document.location.pathname.match(HOME_REGEX)) {
          clearInterval(intervalId);
        }

        if (subjectElement.innerText !== resultDetails.subject) {
          revertChanges();
        }

        if (document.location.pathname.match(ASSIGNMENT_REGEX) || document.location.pathname.match(COURSE_REGEX)) {
          console.log("Stopping interval");
          clearInterval(intervalId);
        }

      };

      const intervalId = setInterval(checkChanges, 500); // Check every second

      revertChanges();

      // Cleanup the interval when needed
      // For example, clearInterval(intervalId) when you want to stop monitoring the changes
    });
  });
}

function getElementsByClassName(classes, timeout = 100) {
  // return promise
  return new Promise((resolve, reject) => {
    const element = document.getElementsByClassName(classes);
    // keep trying until elements are available, then resolve
    if (element.length === 0) {
      setTimeout(() => {
        resolve(getElementsByClassName(classes, timeout));
      }, timeout);
    } else {
      resolve(element);
    }
  });
}


function launchEditor() {
  // this function will collect the data from the page and launch a URL with the data
  // we need lists with the following -
  //  courseIds=
  //  courseNames=
  //  sectionNames=
  //  teacherNames=
  //  pfpUrls=
  //  backgrounds=

  let courseIds = [];
  let courseNames = [];
  let sectionNames = [];
  let teacherNames = [];
  let pfpUrls = [];
  let backgrounds = [];

  getElementsByClassName(HOMEPAGE_NAMEBOX).then((elements) => {
    for (let i = 0; i < elements.length; i++) {

      // Get and add course id
      courseIds.push((elements[i].href).match(CLASSID_REGEX)?.[1]);

      // inside element, there are 2 divs. Innertext of each of them is the course name and section name respectively
      const divs = elements[i].getElementsByTagName("div");
      courseNames.push(divs[0].innerText);
      sectionNames.push(divs[1].innerText);

    }
  });

  // Get background image elements
  getElementsByClassName('OjOEXb Gf8MK').then((divs) => {
    for (let i = 0; i < divs.length; i++) {
      // Get the backgroud-image style and extract the url
      const background = divs[i].style.backgroundImage.slice(4, -1).replace(/"/g, "");
      backgrounds.push(background);

    }
  });

  // Get teacher name elements
  getElementsByClassName('Vx8Sxd YVvGBb jJIbcc').then((divs) => {
    for (let i = 0; i < divs.length; i++) {
      // Get the backgroud-image style and extract the url
      teacherNames.push(divs[i].innerText);
    }
  });

  // Get the teachers' profile picture elements
  getElementsByClassName('PNzAWd').then((divs) => {
    for (let i = 0; i < divs.length; i++) {
      // Get the backgroud-image style and extract the url
      pfpUrls.push(divs[i].src);
    }
  });

  getElementsByClassName(HOMEPAGE_NAMEBOX).then((elements) => {
    do {
      console.log(courseIds, courseNames, sectionNames, teacherNames, pfpUrls, backgrounds)

      // create the URL

      const baseUrl = 'config.html';
      const urlParams = new URLSearchParams();

      urlParams.append('courseIds', courseIds.join(','));
      urlParams.append('courseNames', courseNames.join(','));
      urlParams.append('sectionNames', sectionNames.join(','));
      urlParams.append('teacherNames', teacherNames.join(','));
      urlParams.append('pfpUrls', pfpUrls.join(','));
      urlParams.append('backgrounds', backgrounds.join(','));

      const finalUrl = baseUrl + '?' + urlParams.toString();
      console.log(finalUrl);



      (async () => {
        try {
          await chrome.runtime.sendMessage({
            msg: `open_page_${finalUrl}`
          });
        } catch (e) {
          alert("There was an error. Please reload the page and try again.")
          console.log(e);
        }
      })();


      break;

    }
    while (
      courseIds.length === elements.length ||
      courseNames.length === elements.length ||
      sectionNames.length === elements.length ||
      teacherNames.length === elements.length ||
      pfpUrls.length === elements.length ||
      backgrounds.length === elements.length
    ) {
      // Wait until all the data is collected
    }
  });

}



function createRenameButton() {
  if (BUTTON_CREATED) return;

  const button = document.createElement("button");
  button.innerText = "GCR Renamer\nLaunch Editor";
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.zIndex = "9999";
  button.style.backgroundColor = "#4285F4";
  button.style.color = "white";
  button.style.borderRadius = "5px";

  button.onclick = () => {
    launchEditor();
  }

  document.body.appendChild(button);

  BUTTON_CREATED = true;

}

let BUTTON_CREATED = false;
