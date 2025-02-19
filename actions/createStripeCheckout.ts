"use server";

import baseUrl from "@/lib/baseUrl";
import { createEnrollment } from "@/sanity/lib/courses/createEnrollment";
import getCourseById from "@/sanity/lib/courses/getCourseById";
import { urlFor } from "@/sanity/lib/image";
import { createStudentIfNotExists } from "@/sanity/lib/student/createStudentIfNotExists";
import { clerkClient } from "@clerk/nextjs/server";
import stripe from "@/lib/stripe";

export async function createStripeCheckout(courseId: string,userId: string){
    try {
        const course = await getCourseById(courseId)
        const clerkUser = await (await clerkClient()).users.getUser(userId)
        const {emailAddresses , firstName , lastName, imageUrl}= clerkUser;
        const email = emailAddresses[0]?.emailAddress;
        if(!emailAddresses || !email){
            throw new Error( "User details not found")
        }
        if(!course){
            throw new Error("Course not found");
        }
        // create a user in sanity if it doesnt exist
        const user = await createStudentIfNotExists({
            clerkId: userId,
            email: email || "",
            firstName: firstName || email,
            lastName: lastName || "",
            imageUrl: imageUrl || "",
        });
        if(!user){
            throw new Error ("User not found");
        }
        // 2. Validate course data ad prepare price for Stripe 
        if(!course.price && course.price !== 0){
            throw new Error("Course price is not set");
        }
        const priceInCents = Math.round(course.price * 100);
        if (priceInCents === 0){
            await createEnrollment({
                studentId: user._id,
                courseId: course._id,
                paymentId: "free",
                amount: 0,
            })
            return {url: `/courses/${course.slug?.current}`};
        }
        const {title, description, image, slug} = course;
        if(!title || !description ||!image ||!slug){
            throw new Error("Course data is incomplete")
        }
        //3- Create and configure stripe checkout session with course details
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            success_url: `${baseUrl}/courses/${slug.current}`,
            cancel_url:`${baseUrl}/courses/${slug.current}?canceled=true`,
            metadata:{
                courseId: course._id,
                userId: userId,
            },
            line_items:[
                {
                    quantity : 1,
                    price_data:{
                        currency: "dt",
                        product_data:{
                            name:title,
                            description:description,
                            images:[urlFor(image).url()|| ""]
                        },
                        unit_amount : priceInCents,
                    },
                }
            ]
        })
        //4.Return chekcout session URL for client redirect
        return{url:session.url};

    } catch (error) {
        console.error("Error in cretaeStripeCHeckout:",error);
        throw new Error("Failed to create checkout session")
        
    }
}