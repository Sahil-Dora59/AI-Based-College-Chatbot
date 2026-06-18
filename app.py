from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json["message"].lower()

    if "admission" in user_message:
        reply = "Admissions are open. Visit the admission office or college website for details."

    elif "fee" in user_message:
        reply = "Please contact the accounts department for the latest fee structure."

    elif "exam" in user_message:
        reply = "The examination schedule will be announced by the examination cell."

    elif "scholarship" in user_message:
        reply = "Scholarship information is available in the student welfare section."

    elif "academic calendar" in user_message:
        reply = "The academic calendar is available on the college website."

    elif "contact" in user_message:
        reply = "You can contact the college administration during office hours."

    else:
        reply = "Sorry, I could not understand your question. Please try another query."

    return jsonify({"response": reply})

if __name__ == "__main__":
    app.run(debug=True)
