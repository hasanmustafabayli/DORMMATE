# To run this:
#
# Download/save this file somewhere
#
# Go to https://developer.spotify.com/dashboard and create an App
# Set the redirect URI for the app to: http://localhost:5000/callback
# Copy the client ID and secret into the variables below
# 
# In a terminal...
# pip install flask requests
# Navigate to the directory where you saved this file
# flask --app spotify run


from flask import Flask, redirect, request, session
import requests
import urllib

# Initialize App
app = Flask(__name__)

# Spotify Credentials
CLIENT_ID = "put client id here"
CLIENT_SECRET = "put client secret here"
app.secret_key = CLIENT_SECRET


# Login Page HTML
LOGIN_PAGE = """
<html>
    <body>
        <div>
            <a href="/logon"><button>Login with Spotify</button></a>
        </div>
    </body>
</html>
"""

# Main page HTML
MAIN_PAGE = """
<html>
    <header>
        <script>
            function getPlaylists() {
                window.location.href = `/playlists/${document.getElementById("username").value}`
            }
        </script>
    </header>
    <body>
        <div>
            <p>Enter a Spotify username to get public playlists</p>
            <input id="username" type="text">
            <button onclick=getPlaylists()>Get Playlists</button>
            <br/><br/>
            <p>Get your top 5 artists</p>
            <a href="/top"><button>My Top 5 Artists</button></a>
        </div>
    </body>
</html>
"""


### Web Views
@app.route('/')
def index():
    """ Main page
    """
    # Redirect to login page if user is not logged in
    if 'user_id' and 'access_token' not in session:
        return LOGIN_PAGE
    return MAIN_PAGE

@app.route('/logon')
def request_auth():
    """ Send user to spotify for oauth
    """
    url = "https://accounts.spotify.com/authorize?"
    data = { "client_id": CLIENT_ID, "response_type":"code", "scope": "user-top-read", "redirect_uri":"http://localhost:5000/callback" }
    return redirect(url + urllib.parse.urlencode(data))

@app.route('/callback')
def callback():
    """ Spotify Oauth callback - Gets authorization token and adds to browser session
    """
    url = "https://accounts.spotify.com/api/token"
    data = { "grant_type": "authorization_code", "code": request.args.get('code'), "redirect_uri":"http://localhost:5000/callback", "client_id": CLIENT_ID, "client_secret":CLIENT_SECRET}
    token_response = requests.post(url, data=data).json()
    session['user_id'] = get_id(token_response['access_token'])
    session['access_token'] = token_response['access_token']
    return redirect("/")

@app.route('/playlists/<user>')
def list_playlists(user):
    """ Render a list of a given user's public playlists
    """
    if 'user_id' and 'access_token' not in session:
        return LOGIN_PAGE
    playlists = get_playlists(user, session['access_token'])
    if not playlists:
        return "User not found"
    return print_list(playlists)
    
@app.route('/top')
def top_artists():
    """ Render a list of the current logged in user's top 5 artists
    """
    if 'user_id' and 'access_token' not in session:
        return LOGIN_PAGE
    artists = get_top_artists(session['access_token'])
    if not artists:
        return "User not found"
    return print_list(artists)

### Spotify API Functions
def get_playlists(user, token):
    """ Get the playlists for a user from the spotify API
    """
    url = f"https://api.spotify.com/v1/users/{user}/playlists?limit=50"
    header = { "Authorization": "Bearer " + token}
    response = requests.get(url, headers=header).json()
    playlists = []
    for playlist in response.get('items', {}):
       if playlist['owner']['id'] == user:
            playlists.append(playlist['name'])
    return playlists

def get_id(token):
    """ Get Spotify User ID for current logged in user
    """
    url = "https://api.spotify.com/v1/me"
    header = { "Authorization": "Bearer " +  token}
    response = requests.get(url, headers=header).json()
    return response['id']

def get_top_artists(token):
    """ Get a list of the current logged in user's top 5 artists from the spotify API
    """
    url = "https://api.spotify.com/v1/me/top/artists?limit=5"
    header = { "Authorization": "Bearer " + token}
    response = requests.get(url, headers=header).json()
    artists = []
    for artist in response.get('items', {}):
       artists.append(artist['name'])
    return artists


### Utility Functions
def print_list(items):
    """ Generate an HTML list from a python list of strings
    """
    output = "<html><body>"
    for item in sorted(items):
        output += f"<li>{item}</li>"
    output += "</body></html>"
    return output

