# intentionally_vulnerable_app.py
# WARNING: This application is intentionally insecure. Do NOT deploy publicly.
from flask import Flask, request, render_template
import sqlite3
import time
import re

app = Flask(__name__)

FLAG = 'ctf7{advanced_time_blind_sql_exploit}'

def setup_db():
    conn = sqlite3.connect('challenge.db')
    c = conn.cursor()
    c.execute('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)')
    c.execute('DELETE FROM users')
    c.execute('INSERT INTO users (username, password) VALUES (?, ?)', ('administrator', 'secret_password'))
    conn.commit()
    conn.close()

@app.route('/')
def index():
    return render_template("login.html")

# Comprehensive triggers derived from your list: keywords, function names, and variants.
# We check for these substrings (lowercased) anywhere in the input.
TIME_BASED_TRIGGERS = [
    "sleep(", "pg_sleep", "pg_sleep(", "waitfor delay", "waitfor", "benchmark(", "benchmark ",
    "randomblob(", "hex(randomblob", "hex(randomblob(", "upper(hex(randomblob", "pg_sleep",
    "sLEEP(", "SLEEP(", "WAITFOR", "BENCHMARK", "RANDOMBLOB", "pg_SLEEP", "pg_SLEEP(",
    "benchmark(", "md5(", "sha1(", "sha1", "md5", "/*' or s", # include some comment/obfuscation hints
    # Also include patterns commonly used by Wapiti and other scanners
    "or sleep", "or pg_sleep", "or benchmark", "or waitfor", "or randomblob", 
    ") or sleep", "));waitfor", ";waitfor", "waitfor delay", "sleep)=", "sleep)='",
    "sleep)\"", "sleep)--", "sleep)#", "sleep)#", "sleep)--",
    "benchmark(10000000", "benchmark(50000000", "benchmark(3200", "benchmark(50000000,md5",
    "or benchmark", "+ sleep", "+ sLeEp", "and sleep", "and pg_sleep", "order by sleep",
    "select * from (select(sleep", "(select * from (select(sleep", "select(sleep",
    "randomblob(500000000", "randomblob(1000000000", "randomblob(500000000/2",
    "like(upper(hex(randomblob", "and 2947=like", "or 2947=like"
]

def contains_time_trigger(inp: str) -> bool:
    if not inp:
        return False
    s = inp.lower()
    for trig in TIME_BASED_TRIGGERS:
        if trig in s:
            return True
    return False

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username', '')
    password = request.form.get('password', '')

    # If either field contains a time-based trigger, simulate a time-based behavior
    if contains_time_trigger(username) or contains_time_trigger(password):
        # Debug print so you can see what triggered it in the flask console
        print("TIME-BASED TRIGGER DETECTED. username:", username, "password:", password)
        # simulate the time-based delay attacker would cause on a real DB
        time.sleep(5)
        return render_template("result.html",
                               result=f"Time-based SQLi detected! Query took 5.00s. Flag: {FLAG}",
                               success=True)

    # otherwise behave like the vulnerable app (concatenate inputs into SQL)
    conn = sqlite3.connect('challenge.db')
    c = conn.cursor()

    try:
        query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
        # DEBUG: print the raw query to inspect how the input is placed
        print("RAW QUERY:", query)

        start = time.perf_counter()
        c.execute(query)
        result = c.fetchone()
        end = time.perf_counter()
        elapsed = end - start
        print("elapsed (server):", elapsed)

        if elapsed > 3:
            # If some heavy DB operation actually took >3s, return flag as well
            return render_template("result.html",
                                   result=f"Time-based SQLi detected! Query took {elapsed:.2f}s. Flag: {FLAG}",
                                   success=True)

        if result:
            return render_template("result.html",
                                   result=f"Login successful, but think harder to get the flag! (Query took {elapsed:.2f}s)",
                                   success=False)
        else:
            return render_template("result.html",
                                   result=f"Login failed. Query took {elapsed:.2f}s",
                                   success=False)

    except sqlite3.OperationalError as e:
        end = time.perf_counter()
        elapsed = end - start
        print("SQL ERROR (server):", str(e))
        print("elapsed (server, on error):", elapsed)

        if elapsed > 3:
            return render_template("result.html",
                                   result=f"Time-based SQLi detected via error! Query took {elapsed:.2f}s. Flag: {FLAG}",
                                   success=True)
        else:
            return render_template("result.html",
                                   result=f"SQL Error: {str(e)}",
                                   success=False)
    finally:
        conn.close()

if __name__ == "__main__":
    setup_db()
    app.run(debug=True, threaded=True)
