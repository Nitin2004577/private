import axios from "axios";
import config from "../config/config.js";

const geminiReply = async (promptMessage) => {
  const response = await axios.post(
    config.gemini.apiUrl,
    {
      contents: [
        {
          parts: [
            {
              text: promptMessage,
            },
          ],
        },
      ],
    },
    {
      headers: {
        "x-goog-api-key": config.gemini.apiKey,
        "Content-Type": "application/json",
      },
    }
  );
  
  return response.data.candidates[0].content.parts[0].text;
};

export default geminiReply;
