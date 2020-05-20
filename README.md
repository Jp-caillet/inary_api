# inary_api



## add to .env 

 PORT = (port use)
BDD_USER = (bdd username owner)
BDD_MDP = (bdd password)
BDD_NAME = (name of bdd)
BDD_HOST = (link host BDD)
KEY_TOKEN = (web token for jwt use for security)


## Route 

### Post : /company/create

Body : 
{
	"nom": "inary",
	"siren": "ibhckjucbn",
	"telephone": "0664809122",
	"email": "jp78920@hotmail.com",
	"mdp": "test"
}

Response : 

{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub20iOiJpbmFyeSIsImVtYWlsIjoianA3ODkyMEBob3RtYWlsLmNvbSIsImVudHJlcHJpc2UiOnRydWUsIl9pZCI6MSwiaWF0IjoxNTg5OTIyMjUwfQ.6R7LMV579jqY_K7p9porcQ4gkQ_pVOVNEp_HQoTCZrA"
}

Bad Response : 

{
    "code": 401,
    "message": "user already exist"
}


### Post : /company/login

Body : 
{
	"email": "jp78920@hotmail.com",
	"mdp": "test"
}

Response : 

{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub20iOiJpbmFyeSIsImVtYWlsIjoianA3ODkyMEBob3RtYWlsLmNvbSIsImVudHJlcHJpc2UiOnRydWUsIl9pZCI6MSwiaWF0IjoxNTg5OTYxNTI3fQ.ppUJ7HkKY5gSqazuVr8CD5K_avQNBuFqDjRZo_yO0Us",
    "auth": true
}

Bad Response : 
wrong user
{
    "code": 401,
    "message": "Authentication failed. User not found.",
    "auth": false
}

wrong password
{
    "code": 401,
    "message": "Authentication failed. Wrong password.",
    "auth": false
}