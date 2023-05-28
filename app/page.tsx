"use client";
import Image from "next/image";

import { Configuration, OpenAIApi } from "openai";
import { ChangeEvent, useEffect, useState } from "react";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_CHAT_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default function Home() {
  const [twit, setTwit] = useState("");
  const [hashTagResult, setHashTagResult] = useState("");
  const [numberRange, setNumberRange] = useState("3");

  const onGenerate = () => {
    const completion = openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(twit, numberRange),
      temperature: 0.45,
      max_tokens: 500,
    });
    completion.then((res) => {
      const text = res.data.choices[0].text;
      console.log(res);
      setHashTagResult(text ? text : "");
    });
  };

  const onPostFieldChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTwit(event.target.value);
  };

  const getResult = () => {
    return hashTagResult;
  };

  const handleOnChangeHashTagRange = (event: ChangeEvent<HTMLInputElement>) => {
    setNumberRange(event.target.value);
  };

  return (
    <main className="flex items-center justify-center h-screen">
      <div className="form min-w-[50%]">
        <label
          htmlFor="message"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Input Your Twitter Post
        </label>
        <textarea
          id="message"
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 
          rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500
           dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
            h-60"
          placeholder="Write your post here..."
          onChange={onPostFieldChange}
        ></textarea>

        <div className="flex items-center justify-center p-10">
          <label
            htmlFor="default-range"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            How much hastags?
          </label>
          <input
            id="default-range"
            type="range"
            min={1}
            max={10}
            defaultValue={3}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            onChange={handleOnChangeHashTagRange}
          />
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white pl-10">
            {numberRange}
          </label>
        </div>

        <div className="flex items-center justify-center p-10">
          <button
            type="submit"
            className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
            onClick={() => onGenerate()}
          >
            Generate Perfect Tags
          </button>
        </div>

        <div className="flex items-center justify-center p-10">
          {getResult()}
        </div>
      </div>
    </main>
  );
}

function generatePrompt(twit: string, max: string) {
  return ` 
  1. Generate top twitter hashtags for the text below;
  2. Needed format is: #one, #two and etc.;
  3. Hash tags should not be empty;
  4. Numbers of hashtags: ${max};

  Twit: ${twit}
  `;
}
