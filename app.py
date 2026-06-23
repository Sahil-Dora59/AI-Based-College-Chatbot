from flask import Flask, render_template, request, jsonify
import sqlite3
from datetime import datetime

app = Flask(__name__)

DATABASE = "chatbot.db"

QUICK_RESPONSES = {

    "admission": "Admissions are currently open. Please submit your application through the college admission portal.",

    "fees": "Fee details are available at the accounts section. Contact the office for the latest fee structure.",

    "courses": "Our college offers BCA, B.Com, B.Sc, BA and various professional courses.",

    "scholarship": "Eligible students can apply through the scholarship portal with required documents.",

    "library": "The college library is open from 9:00 AM to 5:00 PM on working days.",

    "hostel": "Hostel facilities are available for both boys and girls.",

    "placement": "Placement training and campus recruitment drives are conducted regularly.",

    "internship": "Internship opportunities are available through the placement cell.",

    "canteen": "The college canteen serves meals and refreshments during college hours.",

    "contact": "Contact the college office for assistance regarding admissions and academics."

}
def get_connection():

    connection = sqlite3.connect(

        DATABASE,

        check_same_thread=False

    )

    connection.row_factory = sqlite3.Row

    return connection


def initialize_database():

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute(

        """
        CREATE TABLE IF NOT EXISTS chat_history (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_message TEXT NOT NULL,

            bot_response TEXT NOT NULL,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        )
        """
    )

    connection.commit()

    connection.close()


initialize_database()
def get_bot_response(user_message):

    message = user_message.lower().strip()

    for keyword, response in QUICK_RESPONSES.items():

        if keyword in message:

            return response

    if any(word in message for word in [

        "hello",

        "hi",

        "hey"

    ]):

        return "Hello! How can I help you today?"

    if "thank" in message:

        return "You're welcome. Happy to help."

    if "bye" in message:

        return "Goodbye. Have a great day."

    return (

        "I can help with admission, fees, courses, "

        "scholarship, library, hostel, placement, "

        "internship and contact information."

    )
    
def save_chat(user_message, bot_response):

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute(

    """
    INSERT INTO chat_history (

        user_message,

        bot_response

    )

    VALUES (?, ?)
    """,

    (

        user_message,

        bot_response

    )

    )

    connection.commit()

    connection.close()

@app.route("/")

def home():

    return render_template(

        "index.html"

    )


@app.route(

    "/chat",

    methods=["POST"]

)

def chat():

    data = request.get_json()

    user_message = data.get(

        "message",

        ""

    )

    bot_response = get_bot_response(

        user_message

    )

    save_chat(

        user_message,

        bot_response

    )

    return jsonify(

        {

            "response": bot_response

        }

    )
    
    @app.route("/dashboard")
    def dashboard():

        connection = get_connection()

        cursor = connection.cursor()

        cursor.execute(

        """

        SELECT COUNT(*)

        FROM chat_history

        """

    )

    total_chats = cursor.fetchone()[0]

    cursor.execute(

        """

        SELECT COUNT(*)

        FROM chat_history

        WHERE DATE(created_at)=DATE('now')

        """

    )

    today_chats = cursor.fetchone()[0]

    connection.close()

    return jsonify(

        {

            "total_chats": total_chats,

            "today_chats": today_chats,

            "status": "Active"

        }

    )


@app.route("/health")
def health():

    return jsonify(
        {
            "status": "Online",
            "database": "Connected",
            "time": datetime.now().strftime("%H:%M:%S")
        }
    )
    
@app.route("/history")
def history():

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute(

    """

    SELECT *

    FROM chat_history

    ORDER BY id DESC

    LIMIT 100

    """

)

    records = cursor.fetchall()

    connection.close()

    history_data = []

    for row in records:

        history_data.append(

            {

                "id": row["id"],

                "user_message": row["user_message"],

                "bot_response": row["bot_response"],

                "created_at": row["created_at"]

            }

        )

    return jsonify(

        history_data

    )


@app.route(

    "/clear-history",

    methods=["POST"]

)

def clear_history():

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute(

        """

        DELETE FROM chat_history

        """

    )

    connection.commit()

    connection.close()

    return jsonify(
    {
        "message": "History Cleared"
    }
)

@app.route(
    "/search",
    methods=["POST"]
)

def search_history():

    data = request.get_json()

    keyword = data.get(

        "keyword",

        ""

    ).strip()

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute(

        """

        SELECT *

        FROM chat_history

        WHERE user_message LIKE ?

        OR bot_response LIKE ?

        ORDER BY id DESC

        """,

        (

            f"%{keyword}%",

            f"%{keyword}%"

        )

    )

    records = cursor.fetchall()

    connection.close()

    results = []

    for row in records:

        results.append(

            {

                "id": row["id"],

                "user_message": row["user_message"],

                "bot_response": row["bot_response"],

                "created_at": row["created_at"]

            }

        )

    return jsonify(

        results

    )
    
@app.route("/analytics")

def analytics():

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute(

        """

        SELECT COUNT(*)

        FROM chat_history

        """

    )

    total_chats = cursor.fetchone()[0]

    cursor.execute(

        """

        SELECT COUNT(*)

        FROM chat_history

        WHERE DATE(created_at)=DATE('now')

        """

    )

    today_chats = cursor.fetchone()[0]

    cursor.execute(

        """

        SELECT user_message

        FROM chat_history

        """

    )

    records = cursor.fetchall()

    connection.close()

    messages = [

        row["user_message"]

        for row in records

    ]

    if messages:

        most_asked = max(

            set(messages),

            key=messages.count

        )

    else:

        most_asked = "No Data"

    return jsonify(

        {

            "total_chats": total_chats,

            "today_chats": today_chats,

            "most_asked_question": most_asked

        }

    )
    
@app.route("/export-history")

def export_history():

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute(

        """

        SELECT *

        FROM chat_history

        ORDER BY id DESC

        """

    )

    records = cursor.fetchall()

    connection.close()

    export_data = []

    for row in records:

        export_data.append(

            {

                "id": row["id"],

                "user_message": row["user_message"],

                "bot_response": row["bot_response"],

                "created_at": row["created_at"]

            }

        )

    return jsonify(

        export_data

    )


@app.route("/download-summary")

def download_summary():

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute(

        """

        SELECT COUNT(*)

        FROM chat_history

        """

    )

    total_chats = cursor.fetchone()[0]

    connection.close()

    return jsonify(

        {

            "application": "AI College Assistant",

            "version": "5.1",

            "total_chats": total_chats,

            "generated_at": datetime.now().strftime(

                "%Y-%m-%d %H:%M:%S"

            )

        }

    )
    
@app.route("/info")

def info():

    return jsonify(

        {

            "application": "AI College Assistant",

            "version": "5.1 Professional Edition",

            "developer": "A Sahil Dora",

            "framework": "Flask",

            "database": "SQLite"

        }

    )


@app.route("/about")

def about():

    return jsonify(

        {

            "project":

            "AI Based College Administrative Support System",

            "version":

            "5.1 Professional Edition"

        }

    )


if __name__ == "__main__":

    print(

        "AI College Assistant V5.1 Starting..."

    )
import os

app.run(
    host="0.0.0.0",
    port=int(os.environ.get("PORT", 5000))
)
