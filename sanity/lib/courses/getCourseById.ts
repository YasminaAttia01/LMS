import { defineQuery } from "groq";
import { sanityFetch } from "../live";

async function getCourseById(id:string) {
    
    const getCourseByIdQuery = defineQuery(`*[_type =="course" && _id == $id][0]{
        ...,
        "category": category->{...},
        "instructor":instructor->{...},
        "modules":modules[]->{
        ...,
        "lessons":lessons[]->{...}}}`)
    const course = await sanityFetch({
        query: getCourseByIdQuery,
        params: {id},
    });
    return course.data
}export default getCourseById;