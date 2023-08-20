// get the `?` parameters from URL
const urlParams = new URLSearchParams(window.location.search);

/*
A valid URL should have the following parameters -

courseIds=
courseNames=
sectionNames=
teacherNames=
pfpUrls=
backgrounds=

*/

if (urlParams.get("clearData") === "true") {
  chrome.storage.sync.clear(() => {
    console.log("Data cleared");
  });
}


const courseIds = urlParams.get('courseIds').split(',');
const courseNames = urlParams.get('courseNames').split(',');
const sectionNames = urlParams.get('sectionNames').split(',');
const teacherNames = urlParams.get('teacherNames').split(',');
const pfpUrls = urlParams.get('pfpUrls').split(',');
const backgrounds = urlParams.get('backgrounds').split(',');


console.log("JS loaded")

function createCourseElement(courseId, courseName, sectionName, teacherName, pfpURL, background) {
  return new Promise((resolve, reject) => {
    const liElement = document.createElement('li');
    liElement.className = 'main-box Aopndd rZXyy';

    const divElement1 = document.createElement('div');
    divElement1.className = 'Tc9hUd CNpREd ee1HBc';

    const divElement2 = document.createElement('div');
    divElement2.className = 'O7utsb bFjUmb-Tvm9db';

    const divElement3 = document.createElement('div');
    divElement3.className = 'OjOEXb Gf8MK';
    divElement3.style.backgroundImage = `url('${background}')`;

    const divElement4 = document.createElement('div');
    divElement4.className = 'R4EiSb';

    const h2Element = document.createElement('h2');
    h2Element.className = 'prWPdf';

    const aElement1 = document.createElement('a');
    aElement1.className = 'onkcGd eDfb1d course-details Vx8Sxd';

    const courseNameDiv = document.createElement('div');
    courseNameDiv.className = 'course-details course-name';
    courseNameDiv.id = `course_name_${courseId}`
    courseNameDiv.contentEditable = true;
    courseNameDiv.textContent = courseName;

    const sectionNameDiv = document.createElement('div');
    sectionNameDiv.className = 'course-details section-name';
    sectionNameDiv.id = `section_name_${courseId}`
    sectionNameDiv.contentEditable = true;
    sectionNameDiv.textContent = sectionName;

    aElement1.appendChild(courseNameDiv);
    aElement1.appendChild(sectionNameDiv);

    const aElement2 = document.createElement('a');
    aElement2.className = 'onkcGd Nmpzvc Vx8Sxd';

    const buttonElement = document.createElement('button');
    buttonElement.className = 'VfPpkd-Bz112c-LgbsSe yHy1rc eT1oJ mN1ivc oxacD JRosVd';

    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('focusable', 'false');
    svgElement.setAttribute('width', '24');
    svgElement.setAttribute('height', '24');
    svgElement.setAttribute('viewBox', '0 0 24 24');
    svgElement.className = 'NMm5M'; // todo fix

    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElement.setAttribute('d', 'M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z');
    svgElement.appendChild(pathElement);

    buttonElement.appendChild(svgElement);

    h2Element.appendChild(aElement1);
    h2Element.appendChild(aElement2);
    h2Element.appendChild(buttonElement);

    const teacherNameDiv = document.createElement('div');
    teacherNameDiv.className = 'Vx8Sxd course-details jJIbcc';
    teacherNameDiv.textContent = teacherName;

    const teacherNameBoxDiv = document.createElement('div');
    teacherNameBoxDiv.className = 'teacher-name-box';
    teacherNameBoxDiv.appendChild(teacherNameDiv);

    divElement4.appendChild(h2Element);
    divElement4.appendChild(teacherNameBoxDiv);

    divElement1.appendChild(divElement2);
    divElement1.appendChild(divElement3);
    divElement1.appendChild(divElement4);

    liElement.appendChild(divElement1);

    const pfpBoxDiv = document.createElement('div');
    pfpBoxDiv.className = 'pfp-box';

    const pfpImage = document.createElement('img');
    pfpImage.className = 'pfp-image';
    pfpImage.src = pfpURL;
    pfpImage.draggable = false;

    pfpBoxDiv.appendChild(pfpImage);

    liElement.appendChild(pfpBoxDiv);

    resolve(liElement);
  });
}


for (let i in courseIds) {
  createCourseElement(courseIds[i], courseNames[i], sectionNames[i], teacherNames[i], pfpUrls[i], backgrounds[i]).then((courseElement) => {
    console.log(courseElement);
    // const courseElementList = ;
    document.getElementById('course-element-list').appendChild(courseElement);
  });
}



function ChangeDetector(targetElements) {
  // Select all elements with the classname "course-name"
  // Debounce function
  const debounce = (callback, delay) => {
    let timerId;
    return (...args) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  };

  // Initialize an object to store previous innerText values
  const previousValues = {};

  // Function to handle changes for a specific element
  const handleInputChange = (element) => {
    const currentValue = element.innerText;
    const previousValue = previousValues[element];

    if (currentValue !== previousValue) {
      // The innerText of the element has changed
      console.log("New innerText for element:", element, currentValue);

      // Find the courseId from the element id
      const courseId = element.id.split("_")[2];
      let elementType = element.id.split("_")[0]; // course or section
      console.log(courseId)

      if (elementType === "course") {
        elementType = "subject";
      }

      // Update sync storage
      // remember that the data format is - {"courseId": {"subject": "", "section": ""}, ... }
      chrome.storage.sync.get().then((data) => {
        console.log(data);

        // add to the data
        if (data[courseId] === undefined) {
          data[courseId] = {};
          data[courseId][elementType] = currentValue.replaceAll("\n", "");

        } else {
            data[courseId][elementType] = currentValue.replaceAll("\n", "")
        }

        console.log(data);

        // set the data
        chrome.storage.sync.set(data, () => {
          console.log("Data saved");
        });

      })

      previousValues[element] = currentValue;
    }
  }


  // Add input event listener to each target element with debounce
  targetElements.forEach((element) => {
    previousValues[element] = element.innerText;
    element.addEventListener("input", debounce(() => handleInputChange(element), 500)); // Adjust the delay (in milliseconds) as needed
  });
}




// add event listener to DOMContentLoaded

document.addEventListener("DOMContentLoaded", function (event) {
  modal.showModal();

  ChangeDetector(document.querySelectorAll(".course-name"));
  ChangeDetector(document.querySelectorAll(".section-name"));
});


const modal = document.getElementById("myModal");
const btnClose = document.getElementById("closeModal");

// Close the modal
btnClose.onclick = function() {
  modal.close();
}

// Close the modal when the background is clicked
modal.addEventListener("click", function(event) {
  if (event.target === modal) {
    modal.close();
  }
});

// create 2 buttons bottom right, import and export settings

const importButton = document.createElement("button");
importButton.className = "import-button";
importButton.textContent = "Import Settings";

const exportButton = document.createElement("button");
exportButton.className = "export-button";
exportButton.textContent = "Export Settings";

const buttonBox = document.createElement("div");
buttonBox.className = "button-box";
buttonBox.appendChild(importButton);
buttonBox.appendChild(exportButton);

document.body.appendChild(buttonBox);


// add event listener to export button
exportButton.addEventListener("click", function(event) {
  // get the data
  chrome.storage.sync.get().then((data) => {
    console.log(data);

    // convert to JSON
    const dataJSON = JSON.stringify(data);
    console.log(dataJSON);

    // create a blob
    const blob = new Blob([dataJSON], {type: "application/json"});

    // create a URL
    const url = URL.createObjectURL(blob);

    // create a link
    const link = document.createElement("a");
    link.href = url;
    link.download = "settings.json";

    // click the link
    link.click();
  })
})

// clear sync storage
const clearButton = document.createElement("button");
clearButton.className = "clear-button";
clearButton.textContent = "Clear Settings";

document.body.appendChild(clearButton);

clearButton.addEventListener("click", function(event) {
  chrome.storage.sync.clear(() => {
    console.log("Data cleared");
  });
})