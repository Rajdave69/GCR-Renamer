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
const CLASS_NAME = "onkcGd eDfb1d YVvGBb Vx8Sxd";
const SECTION_INDEX = 1;
const SUBJECT_INDEX = 0;
// regex which matches /u/{number}/h or /h (GCR home page)
const HOME_REGEX = /^\/u\/(\d+)\/h$|^\/h$/;

if (document.location.pathname.match(HOME_REGEX)) {
	console.log("Home page");
	window.addEventListener("load", renameHomeClasses);
}

//
//
//  >> Renaming System <<
//
//


function renameHomeClasses() {
	getClassElements().then((elements) => {
		// get sync storage
		chrome.storage.sync.get((result) => {

			if (result['backup'] !== undefined) {
				// empty whole storage
				chrome.storage.sync.clear();

				// todo tell user that storage was cleared

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
	       observer.observe(document.body, {
	       childList: true,
	       subtree: true,
	       });
	   });
	   */
}



function getClassElements() {
	// return promise
	return new Promise((resolve, reject) => {
		const elements = document.getElementsByClassName(CLASS_NAME);
		// keep trying until elements are available, then resolve
		if (elements.length === 0) {
			setTimeout(() => {
				resolve(getClassElements());
			}, 100);
		} else {
			resolve(elements);
		}
	});
}



/*
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
      console.log("There was a mutation")
    if (mutation.addedNodes.length) {
      // renameHomeClasses();
    }
  });
});
*/