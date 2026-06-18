function sendMessage() {

    let input = document.getElementById("user-input");

    let chatBox = document.getElementById("chat-box");

    let message = input.value.trim();

    if (message === "") {
        return;
    }

    chatBox.innerHTML += "<p><b>You:</b> " + message + "</p>";

    chatBox.innerHTML += "<p><b>Chatbot:</b> Thank you for your question. AI response will be added soon.</p>";

    input.value = "";

    chatBox.scrollTop = chatBox.scrollHeight;
}
