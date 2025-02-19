import { sanityFetch } from "../live";
import {client} from "../adminClient"
import groq from "groq";

interface CreateStudentProps {
    clerkId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
}
export async function createStudentIfNotExists({
    clerkId,
    email,
    firstName,
    lastName,
    imageUrl,

}: CreateStudentProps){
    const existingStudentQuery = await sanityFetch({
        query : groq`*[_type == "student" && clerkId == $clerkId][0]`,
        params: {clerkId},
    });
    if(existingStudentQuery.data){
        console.log("Student already existis0, existingStudentQuery.data");
        return existingStudentQuery.data;
    }
    const newStudent = await client.create({
        _type:"student",
        clerkId,
        email,
        firstName,
        lastName,
        imageUrl
    })
    console.log("New Student created", newStudent);
    return newStudent
}