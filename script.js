const chatInput=document.querySelector(".chat-input textarea");
const sendChatBtn=document.querySelector(".chat-input span");
const chatbox=document.querySelector(".chatbox");
const chatbotToggler=document.querySelector(".chatbot-toggler");
const chatbotCloseBtn=document.querySelector(".close-btn");

let userMessage;
//const APT_KEY="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";
// const APT_KEY="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";
//const APT_KEY="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";
const API_KEY="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";
const inputIniHeight=chatInput.scrollHeight;

const createChatLi=(message,className)=>{
    // create a chat <li> element with passed message and className
    const chatLi=document.createElement("li");
    chatLi.classList.add("chat",className);
    let chatContent=className==="outgoing"?`<p></p>`:` <span class="material-symbols-outlined">Smart_toy</span><p></p>`;
    chatLi.innerHTML=chatContent;
    chatLi.querySelector("p").textContent=message;
    return chatLi;
}

const generateResponse=(incomingChatLi)=>{
    const API_URL="https://api.openai.com/v1/chat/completions";
    const messageElement=incomingChatLi.querySelector("p");


    const requestOptions={
        method:"POSt",
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${APT_KEY}`
        },
    body:JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [ {role: "user",content: userMessage}]

        })
    }

    //send POST request to API, get response
    fetch(API_URL,requestOptions).then(res=>res.json()).then(data=>{
        messageElement.textContent=data.choices[0].message.content;

    }).catch((error)=>{
        messageElement.classList.add("error");
        messageElement.textContent="Oops! Something went wrong. Please try again.";
    }).finally(()=>chatbox.scrollTo(0,chatbox.scrollHeight));
}

const handleChat=()=>{
    userMessage=chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value="";
    chatInput.style.height=`${inputIniHeight}px`;


    //append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage,"outgoing"));
    chatbox.scrollTo(0,chatbox.scrollHeight);

    setTimeout(()=>{
        //display "Tinking ..." message while waiting for the response 
        const incomingChatLi=createChatLi("Thinking...","incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0,chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    },200)
}

chatInput.addEventListener("input",()=>{
    //adjust the height of the input textarea based on its content
 chatInput.style.height=`${inputIniHeight}px`;
 chatInput.style.height=`${chatInput.scrollHeight}px`;
});


chatInput.addEventListener("keydown",(e)=>{
    //if Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
  if(e.key==='Enter'&&!e.shiftKey&&window.innerWidth>800){
    e.preventDefault();
    handleChat();
  }
});



sendChatBtn.addEventListener("click",handleChat);
chatbotCloseBtn.addEventListener("click",()=>document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click",()=>document.body.classList.toggle("show-chatbot"));
