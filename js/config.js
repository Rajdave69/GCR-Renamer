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

