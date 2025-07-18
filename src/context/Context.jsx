import { createContext, useState } from "react";
import { geminiChat } from "../config/gemini";

export const GeminiContext = createContext();

export const GeminiContextProvider = ({children})=>{
    const [getPrompt, setGetPrompt] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [previousPrompt, setPreviousPrompt] = useState([]);
    const [showResult, setShowResult] = useState(false)
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("")


    const delayParagraph = (index, nextWord) =>{
         setTimeout(function(){
                setResultData(prev => prev+nextWord)
         },75*index)
    }

    const newChat = ()=>{
        setLoading(false);
        setShowResult(false);
    }

    const onSent = async (prompt)=>{
            setResultData("");
            setLoading(true);
            setShowResult(true);
            let response;
            if(prompt !== undefined){
                response = await geminiChat(prompt);
                setRecentPrompt(prompt || getPrompt);
                setPreviousPrompt(prev => [...prev, prompt])
            }
            else{
                setPreviousPrompt(prev => [ ...prev, prompt]);
                setRecentPrompt(prompt || getPrompt);
                response = await geminiChat(prompt);
            }
            
            let responseArray = response.split("**");
            let newResponse ="";
            for(let i=0; i < responseArray.length; i++){
                if(i === 0 ||  i%2 !== 1){
                    newResponse += responseArray[i];
                }
                else{
                    newResponse += "<b>"+responseArray[i]+"</b>";
                }
            }
            let newResponse2 = newResponse.split("*").join("<br/>")
            let newResposeArray = newResponse2.split(" ");
            for(let i=0; i<newResposeArray.length; i++){
                const nextWord = newResposeArray[i];
                delayParagraph(i, nextWord+" ")
            }
            // setResultData(newResponse2);
            setLoading(false);
            setGetPrompt("")
    }

    console.log(resultData)
    const contextValue = {
            previousPrompt,
            setPreviousPrompt,
            onSent,
            recentPrompt,
            setRecentPrompt,
            showResult,
            getPrompt,
            setGetPrompt,
            loading,
            resultData,
            newChat
    }
        return(
        <GeminiContext.Provider value={contextValue}>
                {children}
        </GeminiContext.Provider>
        )  
}