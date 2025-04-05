"use client";
import { useRouter } from 'next/navigation';
import { useState } from "react";
//for response
import ReactMarkdown from "react-markdown";
//context
import { useBridgeData } from "../../../context/bridgeContext";

//structures
interface EmailStructure {
    email: string,
    subject: string,
    message: string
}

export default function ResponsePage() {
    const router = useRouter();
    const { isDarkMode, toggleTheme, responseData } = useBridgeData();
    // Simple fix: Insert a space after a digit + period + **
    const fixedResponse = responseData.replace(/(\d+)\.\*\*/g, '$1. **');
    //color according to theme
    const themedColor = isDarkMode ? '#141414' : '#fff';
    const lighterThemedColor = isDarkMode ? '#363535' : '#fff'
    const blackAndWhiteConv = isDarkMode ? 'white' : '#424242'
    //state to store message data
    const [messageData, setMessageData] = useState<EmailStructure>({
        email: "",
        subject: "",
        message: "",
    })
    //send mail
    const [sendMailBtn, setSendMailBtn] = useState(false);

    const toggleSendMail = () => setSendMailBtn(!sendMailBtn);

    //Mail sender Api caller
    async function sendMail() {
        const response = await fetch("/api/sendMail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: messageData.email,
                subject: messageData.subject,
                message: messageData.message,
            }),
        });

        const result = await response.json();
        if (result.success) {
            alert("Email sent!");
        } else {
            alert("Email not sent! please try again later");
            console.error("Error:", result.error);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 py-8" style={{ backgroundColor: themedColor }}>
            <button
                className="px-1 py-1 border-2 border-purple-300 rounded-md font-mono text-sm absolute top-5 left-5"
                aria-label="Back Button"
                style={{ color: blackAndWhiteConv }}
                onClick={() => router.back()}
            >
                Back
            </button>
            {/*Haeding*/}
            <div className="mb-10">
                <h1
                    className="font-bold pb-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl bg-gradient-to-br from-blue-300 via-indigo-500 to-blue-700 text-transparent bg-clip-text"
                >
                    Your Project Ideas
                </h1>
                <h2 className="ml-3 text-lg font-mono mt-4 max-w-2xl" style={{ color: blackAndWhiteConv }}>
                    Below are 3 project ideas. Go through each one and choose the one that suits you best. If you’re inspired or want something different, feel free to go back and refine your own vision.
                </h2>
            </div>
            <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[50%] shadow-lg border-2 border-purple-300 rounded-2xl p-6"
                style={{ backgroundColor: lighterThemedColor, color: blackAndWhiteConv }}
            >
                <ReactMarkdown>{fixedResponse || "No project ideas found. Please go back and generate them."}</ReactMarkdown>
            </div>
            <div className="mt-5 w-full sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[50%] flex justify-around">
                {/* Button for Changing Theme */}
                <button
                    className="px-1 py-1 border-2 border-purple-300 rounded-md font-mono text-sm"
                    onClick={toggleTheme}
                    aria-label="Change Theme"
                    style={{ color: blackAndWhiteConv }}
                >
                    {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>

                {/* Button for Contacting Developer */}
                <button
                    className="px-1 py-1 border-2 border-purple-300 rounded-md font-mono text-sm"
                    aria-label="Contact Developer"
                    style={{ color: blackAndWhiteConv }}
                    onClick={toggleSendMail}
                >
                    Contact Developer
                </button>
            </div>
            {/*form for */}
            {sendMailBtn && (
                <form
                    onSubmit={sendMail}
                    className="max-w-lg mx-auto p-6 rounded-lg border-2 border-fuchsia-600 shadow-lg space-y-4 absolute"
                    style={{ backgroundColor: themedColor }}
                >
                    <button
                        onClick={toggleSendMail}
                        className=" absolute top-2 right-2 font-light bg-fuchsia-100 rounded-sm px-2"
                    >
                        close
                    </button>
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold" style={{ color: blackAndWhiteConv }}>Your Email</label>
                        <input
                            type="email"
                            placeholder="Your Email"
                            value={messageData.email}
                            onChange={(data) => setMessageData({ ...messageData, email: data.target.value })}
                            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:caret-stone-300"
                            style={{ color: blackAndWhiteConv }}
                        />
                    </div>
                    <div>
                        <label htmlFor="subject" className="block text-sm font-semibold" style={{ color: blackAndWhiteConv }}>Subject</label>
                        <input
                            type="text"
                            placeholder="Subject"
                            required
                            value={messageData.subject}
                            onChange={(data) => setMessageData({ ...messageData, subject: data.target.value })}
                            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500  placeholder:caret-stone-300"
                            style={{ color: blackAndWhiteConv }}
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-semibold" style={{ color: blackAndWhiteConv }}>Your Message</label>
                        <textarea
                            placeholder="Your Message"
                            required
                            value={messageData.message}
                            onChange={(data) => setMessageData({ ...messageData, message: data.target.value })}
                            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500  placeholder:caret-stone-300"
                            style={{ color: blackAndWhiteConv }}
                        ></textarea>
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                        >
                            Send Email
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}