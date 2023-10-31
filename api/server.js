import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    res.status(200).send({
        message:
            "This is ChatGPT AI APP server url, please visit https://chatgpt-ai-app-od21.onrender.com",
    });
});

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/", async (req, res) => {
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: req.body.input,
            temperature: 0,
            max_tokens: 4000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });
        console.log("PASSED: ", req.body.input);

        res.status(200).send({
            bot: response.data.choices[0].text,
        });
    } catch (error) {
        console.error("Error processing request:", error);

    // Handle different types of errors and send appropriate responses
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res.status(error.response.status).send({
        error: "OpenAI API Error: " + error.response.data.error.message,
      });
    } else if (error.request) {
      // The request was made but no response was received
      res.status(500).send({ error: "No response from OpenAI API" });
    } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500).send({ error: "Internal Server Error" });
    }
  }
});

// app.listen(4000, () => console.log("Server is running on port 4000"))

app.listen(4000, () => console.log("Server is running on port 4000"));