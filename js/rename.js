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

