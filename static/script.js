const chatBox = document.getElementById(

    "chat-box"

);

const userInput = document.getElementById(

    "user-input"

);

const sendBtn = document.getElementById(

    "sendBtn"

);

const typingIndicator = document.getElementById(

    "typing-indicator"

);

document.addEventListener(

    "DOMContentLoaded",

    function(){

        loadDashboard();

        loadAnalytics();

        addWelcomeMessage();

        userInput.focus();

    }

);

function addMessage(

    message,

    type

){

    const messageDiv = document.createElement(

        "div"

    );

    messageDiv.classList.add(

        "message"

    );

    if(

        type === "user"

    ){

        messageDiv.classList.add(

            "user-message"

        );

    }

    else{

        messageDiv.classList.add(

            "bot-message"

        );

    }

    messageDiv.innerHTML = `

        <div>${message}</div>

        <div class="message-time">

            ${new Date().toLocaleTimeString()}

        </div>

    `;

    chatBox.appendChild(

        messageDiv

    );

    chatBox.scrollTop =

        chatBox.scrollHeight;

}

function showTyping(){

    typingIndicator.style.display =

        "block";

}

function hideTyping(){

    typingIndicator.style.display =

        "none";

}

function addWelcomeMessage(){

    addMessage(

`👋 Welcome to AI College Assistant

Ask about:

• Admission
• Fees
• Courses
• Scholarship
• Hostel
• Library
• Placement
• Contact`,

        "bot"

    );

}
async function sendMessage(){

    const message = userInput.value.trim();

    if(

        message === ""

    ){

        return;

    }

    addMessage(

        message,

        "user"

    );

    userInput.value = "";

    showTyping();

    try{

        const response = await fetch(

            "/chat",

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify({

                    message:message

                })

            }

        );

        const data = await response.json();

        hideTyping();

        addMessage(

            data.response,

            "bot"

        );

        addNotification(

            "New Chat Processed"

        );

        addActivityLog(

            "User sent a message"

        );

    }

    catch(error){

        hideTyping();

        addMessage(

            "Server Connection Failed",

            "bot"

        );

    }

}

sendBtn.addEventListener(

    "click",

    sendMessage

);

userInput.addEventListener(

    "keypress",

    function(event){

        if(

            event.key === "Enter"

        ){

            sendMessage();

        }

    }

);

document.querySelectorAll(

    ".quick-btn"

).forEach(

    function(button){

        button.addEventListener(

            "click",

            function(){

                const text =

                    this.innerText

                    .replace(

                        /[^\w\s]/g,

                        ""

                    )

                    .trim();

                userInput.value = text;

                sendMessage();

            }

        );

    }

);
async function loadDashboard(){

    try{

        const response = await fetch(

            "/dashboard"

        );

        const data = await response.json();

        document.getElementById(

            "totalChats"

        ).textContent =

            data.total_chats;

        document.getElementById(

            "todayChats"

        ).textContent =

            data.today_chats;

        document.getElementById(

            "mostAsked"

        ).textContent =

            data.most_asked;

    }

    catch(error){

        console.log(

            error

        );

    }

}

async function loadAnalytics(){

    try{

        const response = await fetch(

            "/analytics"

        );

        const data = await response.json();

        document.getElementById(

            "analyticsTotalChats"

        ).textContent =

            data.total_chats;

        document.getElementById(

            "analyticsTodayChats"

        ).textContent =

            data.today_chats;

        document.getElementById(

            "analyticsMostAsked"

        ).textContent =

            data.most_asked_question;

        document.getElementById(

            "statTotalChats"

        ).textContent =

            data.total_chats;

        document.getElementById(

            "statTodayChats"

        ).textContent =

            data.today_chats;

        document.getElementById(

            "statMostAsked"

        ).textContent =

            data.most_asked_question;

    }

    catch(error){

        console.log(

            error

        );

    }

}

setInterval(

    function(){

        loadDashboard();

        loadAnalytics();

    },

    60000

);
const historyBtn = document.getElementById(

    "historyBtn"

);

const historyPanel = document.getElementById(

    "historyPanel"

);

const closeHistoryBtn = document.getElementById(

    "closeHistoryBtn"

);

historyBtn.addEventListener(

    "click",

    function(){

        historyPanel.classList.add(

            "active"

        );

        loadHistory();

    }

);

closeHistoryBtn.addEventListener(

    "click",

    function(){

        historyPanel.classList.remove(

            "active"

        );

    }

);

async function loadHistory(){

    try{

        const response = await fetch(

            "/history"

        );

        const data = await response.json();

        const historyContent = document.getElementById(

            "historyContent"

        );

        historyContent.innerHTML = "";

        data.forEach(

            function(item){

                const card = document.createElement(

                    "div"

                );

                card.className =

                    "history-card";

                card.innerHTML = `

                    <strong>You:</strong>

                    <br>

                    ${item.user_message}

                    <hr>

                    <strong>Bot:</strong>

                    <br>

                    ${item.bot_response}

                    <br><br>

                    <small>

                    ${item.created_at}

                    </small>

                `;

                historyContent.appendChild(

                    card

                );

            }

        );

    }

    catch(error){

        console.log(

            error

        );

    }

}
const searchBtn = document.getElementById(

    "searchBtn"

);

const searchPanel = document.getElementById(

    "searchPanel"

);

const closeSearchBtn = document.getElementById(

    "closeSearchBtn"

);

searchBtn.addEventListener(

    "click",

    function(){

        searchPanel.classList.add(

            "active"

        );

    }

);

closeSearchBtn.addEventListener(

    "click",

    function(){

        searchPanel.classList.remove(

            "active"

        );

    }

);

async function searchHistory(){

    const keyword = document.getElementById(

        "searchInput"

    ).value.trim();

    if(

        keyword === ""

    ){

        return;

    }

    try{

        const response = await fetch(

            "/search",

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify({

                    keyword:keyword

                })

            }

        );

        const results = await response.json();

        const container = document.getElementById(

            "searchResults"

        );

        container.innerHTML = "";

        results.forEach(

            function(item){

                const card = document.createElement(

                    "div"

                );

                card.className =

                    "search-result-card";

                card.innerHTML = `

                    <strong>You:</strong>

                    <br>

                    ${item.user_message}

                    <hr>

                    <strong>Bot:</strong>

                    <br>

                    ${item.bot_response}

                `;

                container.appendChild(

                    card

                );

            }

        );

    }

    catch(error){

        console.log(

            error

        );

    }

}

document.getElementById(

    "searchNowBtn"

).addEventListener(

    "click",

    searchHistory

);
const analyticsBtn = document.getElementById(

    "analyticsBtn"

);

const analyticsPanel = document.getElementById(

    "analyticsPanel"

);

const closeAnalyticsBtn = document.getElementById(

    "closeAnalyticsBtn"

);

analyticsBtn.addEventListener(

    "click",

    function(){

        analyticsPanel.classList.add(

            "active"

        );

        loadAnalytics();

    }

);

closeAnalyticsBtn.addEventListener(

    "click",

    function(){

        analyticsPanel.classList.remove(

            "active"

        );

    }

);

function addNotification(message){

    const notificationList = document.getElementById(

        "notificationList"

    );

    const item = document.createElement(

        "div"

    );

    item.className =

        "notification-item";

    item.textContent =

        message;

    notificationList.prepend(

        item

    );

}

function addActivityLog(message){

    const log = document.getElementById(

        "activityLog"

    );

    const item = document.createElement(

        "div"

    );

    item.className =

        "activity-item";

    item.innerHTML =

        new Date().toLocaleTimeString()

        +

        " - "

        +

        message;

    log.prepend(

        item

    );

}
function showToast(message){

    const toast = document.getElementById(

        "toast"

    );

    toast.textContent =

        message;

    toast.classList.add(

        "show"

    );

    setTimeout(

        function(){

            toast.classList.remove(

                "show"

            );

        },

        3000

    );

}

async function updateServerStatus(){

    try{

        const response = await fetch(

            "/health"

        );

        const data = await response.json();

        document.getElementById(

            "serverStatus"

        ).textContent =

            data.status;

        document.getElementById(

            "databaseStatus"

        ).textContent =

            data.database;

    }

    catch(error){

        document.getElementById(

            "serverStatus"

        ).textContent =

            "Offline";

        document.getElementById(

            "databaseStatus"

        ).textContent =

            "Disconnected";

    }

}

async function updateResponseTime(){

    const start = performance.now();

    try{

        await fetch(

            "/health"

        );

        const end = performance.now();

        document.getElementById(

            "responseTime"

        ).textContent =

            Math.round(

                end - start

            ) + " ms";

    }

    catch(error){

        document.getElementById(

            "responseTime"

        ).textContent =

            "--";

    }

}

window.addEventListener(

    "load",

    function(){

        updateServerStatus();

        updateResponseTime();

    }

);
document.getElementById(

    "exportJsonBtn"

).addEventListener(

    "click",

    async function(){

        try{

            const response = await fetch(

                "/export-history"

            );

            const data = await response.json();

            const blob = new Blob(

                [

                    JSON.stringify(

                        data,

                        null,

                        4

                    )

                ],

                {

                    type:"application/json"

                }

            );

            const url = URL.createObjectURL(

                blob

            );

            const link = document.createElement(

                "a"

            );

            link.href = url;

            link.download =

                "chat_history.json";

            link.click();

            URL.revokeObjectURL(

                url

            );

            showToast(

                "History Exported"

            );

        }

        catch(error){

            console.log(

                error

            );

        }

    }

);

document.getElementById(

    "downloadSummaryBtn"

).addEventListener(

    "click",

    async function(){

        try{

            const response = await fetch(

                "/download-summary"

            );

            const data = await response.json();

            const blob = new Blob(

                [

                    JSON.stringify(

                        data,

                        null,

                        4

                    )

                ],

                {

                    type:"application/json"

                }

            );

            const url = URL.createObjectURL(

                blob

            );

            const link = document.createElement(

                "a"

            );

            link.href = url;

            link.download =

                "summary.json";

            link.click();

            URL.revokeObjectURL(

                url

            );

            showToast(

                "Summary Downloaded"

            );

        }

        catch(error){

            console.log(

                error

            );

        }

    }

);

document.getElementById(

    "refreshDashboardBtn"

).addEventListener(

    "click",

    function(){

        loadDashboard();

        loadAnalytics();

        updateServerStatus();

        updateResponseTime();

        showToast(

            "Dashboard Refreshed"

        );

    }

);
const darkModeBtn = document.getElementById(

    "darkModeBtn"

);

darkModeBtn.addEventListener(

    "click",

    function(){

        document.body.classList.toggle(

            "dark-mode"

        );

        localStorage.setItem(

            "theme",

            document.body.classList.contains(

                "dark-mode"

            )

        );

    }

);

if(

    localStorage.getItem(

        "theme"

    ) === "true"

){

    document.body.classList.add(

        "dark-mode"

    );

}

const floatingChatBtn = document.getElementById(

    "floatingChatBtn"

);

floatingChatBtn.addEventListener(

    "click",

    function(){

        userInput.focus();

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    }

);

const backToTopBtn = document.getElementById(

    "backToTopBtn"

);

backToTopBtn.addEventListener(

    "click",

    function(){

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    }

);

const welcomePopup = document.getElementById(

    "welcomePopup"

);

document.getElementById(

    "closeWelcomePopup"

).addEventListener(

    "click",

    function(){

        welcomePopup.style.display =

            "none";

    }

);

window.addEventListener(

    "load",

    function(){

        setTimeout(

            function(){

                document.getElementById(

                    "loadingScreen"

                ).style.display =

                    "none";

            },

            1500

        );

        addNotification(

            "System Ready"

        );

        addActivityLog(

            "Application Started"

        );

        showToast(

            "Welcome to AI College Assistant V5.1"

        );

    }

);

document.addEventListener(

    "keydown",

    function(event){

        if(

            event.key === "Escape"

        ){

            historyPanel.classList.remove(

                "active"

            );

            searchPanel.classList.remove(

                "active"

            );

            analyticsPanel.classList.remove(

                "active"

            );

        }

    }

);

console.log(

    "AI College Assistant V5.1 Professional Edition"

);
