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

