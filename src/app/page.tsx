"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
//MaterialUI
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
//Google Ai Studio
import { GoogleGenAI } from "@google/genai";
//Context
import { useBridgeData } from "../../context/bridgeContext";

//structures
interface QueryDataStructure {
  topic: string,
  context: string,
  complexity: string
}

interface EmailStructure {
  email: string,
  subject: string,
  message: string
}

export default function Home() {
  const router = useRouter();
  //context loader
  const { isDarkMode, toggleTheme, setResponseData } = useBridgeData();
  //loader for brainstormer
  const [loading, setLoading] = useState(false);
  //State to store the data
  const [queryData, setQueryData] = useState<QueryDataStructure>({
    topic: "",
    context: "Academic",
    complexity: "Beginner"
  });
  const [messageData, setMessageData] = useState<EmailStructure>({
    email: "",
    subject: "",
    message: "",
  })
  //color according to theme
  const themedColor = isDarkMode ? '#141414' : '#fff';
  const lighterThemedColor = isDarkMode ? '#363535' : '#fff'
  const blackAndWhiteConv = isDarkMode ? 'white' : '#424242'
  //send mail
  const [sendMailBtn, setSendMailBtn] = useState(false);

  const toggleSendMail = () => setSendMailBtn(!sendMailBtn);

  //Connection with googleAistudio
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const ai = new GoogleGenAI({ apiKey: apiKey });

  async function main() {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `You are an AI called ProjectstormerAi that generates tailored project ideas based on the user's input.
              Instructions:
                1. **Input Parameters**: 
                  - Topic: ${queryData.topic} (e.g., sustainability, business strategy, creative arts, etc.)
                  - Context: ${queryData.context} (e.g., academic, professional, personal, etc.)
                  - Complexity: ${queryData.complexity} (e.g., beginner, intermediate, advanced)
                2. **Output Requirements**: 
                  - Generate three project ideas based on the topic, context, and complexity level.
                  - Each project must include:
                    - A relevant and clear project title.
                    - A detailed description of the project, including its objectives, target audience, and key components.
                  - Adapt the ideas to match the specified field or discipline (e.g., sciences, arts, business, etc.).
                  - Ensure the ideas are practical, achievable, and appropriate for the given context and complexity.
                3. **Constraints**: 
                  - Do not include unrelated content or generic commentary.
                  - Ideas should be inclusive and adaptable to diverse fields of study or work.
              For example: 
              Topic: "Sustainability"  
              Context: "Academic"  
              Complexity: "Beginner"  
              Output:  
              1. **EcoLearn Campaign**: Design a beginner-level awareness campaign for students about reducing waste. Create posters, presentations, and short videos tailored to a university setting.  
              2. **Green Start-Up Plan**: Draft a basic business plan for a small eco-friendly product or service (e.g., biodegradable utensils). Explore market research, product development, and cost projections.  
              3. **Art for Earth**: Develop an art project showcasing the importance of sustainability through mediums like painting, photography, or sculptures. Include an exhibition plan to raise awareness.`,
    });
    setResponseData(response.text || '');
    router.push('responsePage');
    setLoading(false);
  }
  const handleSubmit = async (event: React.FormEvent) => {
    setLoading(true);
    event.preventDefault(); // Prevent default form submission
    main();
  };

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
      {/*Haeding*/}
      <div className="mb-10">
        <h1
          className="font-bold text- sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl bg-gradient-to-br from-blue-300 via-indigo-500 to-blue-700 text-transparent bg-clip-text"
          style={{ fontWeight: 700 }}
        >
          Welcome to,
        </h1>
        <h1
          className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl bg-gradient-to-br from-blue-400 via-purple-600 to-blue-800 text-transparent bg-clip-text pb-5"
          style={{ fontWeight: 700 }}
        >
          ProjectstormerAi
        </h1>
      </div>

      {/*Form Area for user*/}
      <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[50%] bg-white shadow-lg border-2 border-purple-300 rounded-2xl p-6" style={{ backgroundColor: lighterThemedColor }}>
        <form
          className="flex flex-col gap-2"
          onSubmit={handleSubmit}>
          <h2 className="text-1xl font-mono" style={{ color: blackAndWhiteConv }}>
            Enter your topic for the projects (max 200 characters)
          </h2>
          <textarea
            placeholder="eg, 'How can AI be used to help students with neurodiversity?'"
            required
            onChange={(data) => setQueryData({ ...queryData, topic: data.target.value })}
            className="p-2 mb-5 sm:p-3 md:p-4 border border-gray-300 rounded-2xl h-32 w-full resize-none focus:outline-purple-300 align-top placeholder:text-left placeholder:font-mono"
            style={{ color: blackAndWhiteConv }}
            maxLength={200}
          />

          {/*Chose the context area for project*/}
          <FormControl className="gap-2">
            <span id="option-for-context-group-label" className="text-1xl font-mono" style={{ color: blackAndWhiteConv }}>
              Set the Direction of Your Project: Academic or Professional?
            </span>
            <RadioGroup
              row
              aria-labelledby="option-for-context-group-label"
              defaultValue="Academic"
              value={queryData.context}
              name="context-buttons-group"
              onChange={(data) => setQueryData({ ...queryData, context: data.target.value })}
            >
              <FormControlLabel value="Academic" control={<Radio />} label="Academic" sx={{ color: blackAndWhiteConv }} />
              <FormControlLabel value="Professional" control={<Radio />} label="Professional" sx={{ color: blackAndWhiteConv }} />
            </RadioGroup>
          </FormControl>
          {/*Chose the complexity area for project*/}
          <FormControl className="gap-2">
            <span id="option-for-complexitylevel-group-label" className="text-1xl font-mono" style={{ color: blackAndWhiteConv }}>
              Pick Your Project Complexity
            </span>
            <RadioGroup
              row
              aria-labelledby="option-for-complexitylevel-group-label"
              defaultValue="Beginner"
              value={queryData.complexity}
              name="complexitylevel-buttons-group"
              onChange={(data) => setQueryData({ ...queryData, complexity: data.target.value })}
            >
              <FormControlLabel value="Beginner" control={<Radio />} label="Beginner" sx={{ color: blackAndWhiteConv }} />
              <FormControlLabel value="Intermediate" control={<Radio />} label="Intermediate" sx={{ color: blackAndWhiteConv }} />
              <FormControlLabel value="Advanced" control={<Radio />} label="Advanced" sx={{ color: blackAndWhiteConv }} />
            </RadioGroup>
          </FormControl>

          {/*Submit button*/}
          <button
            type="submit"
            aria-label="Generate Ideas"
            className="bg-gradient-to-br from-blue-400 via-purple-600 to-blue-800 text-white p-2 rounded-md hover:from-blue-300 hover:via-indigo-500 hover:to-blue-500 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? (
              <Box sx={{ width: '100%' }}>
                <p className="font-mono">Brainstorming...</p>
                <LinearProgress />
              </Box>) : (
              <p className="font-mono">Generate Ideas</p>
            )}
          </button>
        </form>
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