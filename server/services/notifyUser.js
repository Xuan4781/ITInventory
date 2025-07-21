import cron from "node-cron"
import { User } from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { Borrow } from "../models/borrowModel.js";

export const notifyUsers = () => {
    cron.schedule("*/30 * * * *", async()=>{
        try{
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const borrowers = await Borrow.find({
                dueDate: {
                    $lt: oneDayAgo
                },
                returnDate: null,
                notified: false,

            });
            for(const element of borrowers){
                if(element.user && element.user.email){
                    sendEmail({
                        email: element.user.email,
                        subject: "Book return Reminder",
                        message:`Hello ${element.user.name}, \n\n This is a reminder that the book you borrowed is due for return today. Please return the book to the IT as soon as possible.`
                    })
                    element.notified = true;
                    await element.save();
                    console.log(`Email sent to ${element.user.email}`)
                }
            }
        } catch (error){
            console.error("Some error occured while notifying users.", error);
        }
    });



}