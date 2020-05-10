# EuroScorer-Api

This is the Firebase backend written in typescript for the 2020 EuroScorer voting app \o/.

The meat of the code is located at [`/functions/src/index.ts`](https://github.com/EuroScorer/EuroScorer-Api/blob/master/functions/src/index.ts)


## Firebase

The App uses Firebase to authenticate with a phone number and to send & store votes:
https://console.firebase.google.com

## Firebase Login with Phone number
### Android
https://firebase.google.com/docs/auth/android/phone-auth?authuser=1

### iOS
https://firebase.google.com/docs/auth/ios/phone-auth?authuser=1

### Web
https://firebase.google.com/docs/auth/web/phone-auth?authuser=1


## REST api

Base URL (until we get a domain name):  
https://api.euroscorer2020.com/v1

### Get songs

GET `/songs`


```json
[
  {
    "number": 1,
    "title": "Arilena Ara - Fall From The Sky",
    "link": "https://youtu.be/p-E-kIFPrsY",
    "image": "https://firebasestorage.googleapis.com/v0/b/eurovision2020-ea486.appspot.com/o/AL.jpg?alt=media",
    "country": {
      "code": "AL",
      "name": "Albania",
      "flag": "https://www.countryflags.io/al/flat/64.png"
    }
  },
  {
    "number": 2,
    "title": "Athena Manoukian - Chains on You",
    "link": "https://youtu.be/XpQHGMM8c5U",
    "image": "https://firebasestorage.googleapis.com/v0/b/eurovision2020-ea486.appspot.com/o/AM.jpg?alt=media",
    "country": {
      "code": "AM",
      "name": "Armenia",
      "flag": "https://www.countryflags.io/am/flat/64.png"
    }
  },
  {
    "number": 3,
    "title": "Vincent Bueno - Alive",
    "link": "https://youtu.be/cOuiTJlBC50",
    "image": "https://firebasestorage.googleapis.com/v0/b/eurovision2020-ea486.appspot.com/o/AT.jpg?alt=media",
    "country": {
      "code": "AT",
      "name": "Austria",
      "flag": "https://www.countryflags.io/at/flat/64.png"
    }
  },
  // ...
]
```

### Send votes
POST `/vote`  
Headers:  
`Content-Type`: `application/json`    
`Authorization`: `[YOUR_FIREBASE_ID_TOKEN]`  
Body:
```json
{
	"votes": ["GB", "IT"]
}
```

Authenticate the request with your firebase ID token.
See more details about ID tokens here:
https://firebase.google.com/docs/auth/admin/verify-id-tokens#retrieve_id_tokens_on_clients

If there are multiple votes for the same country, just add more entries for example:
```json
{
	"votes": ["FR", "FR", "FR", "RU", "RU", "AZ"]
}
```
3 votes for France, 2 for Russia and 1 for Azerbaijan.

The table has a maximum of 20 entries.
More and the request will fail.

### Get votes
GET `/vote`  
Headers:  
`Authorization`: `[YOUR_FIREBASE_ID_TOKEN]`  
Example response:
```json
{
  "user": "UjIr7VBz9GWOGzTeLrbw5laHg5w2",
  "country": "FR",
  "votes": [
    "DK",
    "EE",
    "EE"
  ]
}
```

## Receiving iOS beta builds (Testflight)
Just click on this link and get to test the latest versions !
https://testflight.apple.com/join/6gc3R8Bo
