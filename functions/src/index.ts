import * as express from 'express'
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import * as cors from 'cors'


admin.initializeApp(functions.config().firebase)

const db = admin.firestore()
const app = express();
const main = express();

main.use('/v1', app);

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

export const api = functions.https.onRequest(main);

const songsRoute = functions.https.onRequest((request, response) => {
    
    const fetchCountries = db.collection('countries').get().then((snapshot) => {
        const countries: any[] = []
        snapshot.forEach((doc) => {
            const country = {
                code : doc.id,
                name : doc.data().name,
                flag : doc.data().flag
            }
            countries.push(country)
        })
        return countries
    })

    const fetchSongs = db.collection('songs').get()
    
    Promise.all([fetchCountries, fetchSongs]).then((result) => {
        let countries = result[0]
        const songsSnapshot = result[1]
        const songsArray: any[] = []
        songsSnapshot.forEach((doc) => {
            let matchingCountry = countries.find( c => {
                return c.code === doc.data().countryCode
            })
            const song = {
                number : doc.data().number,
                title : doc.data().title,
                country : matchingCountry
            }
            songsArray.push(song)

            songsArray.sort((a, b) => (a.number > b.number) ? 1 : -1)
        })
        response.send(songsArray)
    }).catch((err) => {
        console.log('Error getting song', err)
    })

})

// Api
app.get('/songs', songsRoute)


app.post('/vote', (request, response) => {
    let votesBody = request.body.votes
    let authToken = request.headers.authorization

    if (authToken == null) {
        response.send("You must authenticate with a valid token")
    }

    if (votesBody == null) {
        response.send("You must provide a body with votes")
    }

    if (votesBody.length > 20) {
        response.send("Votes should have a maximum of 20 entries")
    }

    admin.auth().verifyIdToken(authToken!).then(function(decodedToken) {
        let phoneNumber = decodedToken.phone_number
        let countryCode = countryCodeFromPhoneNumber(phoneNumber)
        let userId = decodedToken.uid
        
        let vote = {
            user: userId,
            country: countryCode,
            votes: votesBody
        }
          
        // Add a new document in collection "cities" with ID 'LA'
        db.collection('votes').doc(userId).set(vote).then((result) => {
            response.send(vote)
        }).catch(function(error) {
            response.send("Error Saving vote")
        })

    }).catch(function(error) {
    // Handle error
        response.send("Error decoding token")
    });
})

function countryCodeFromPhoneNumber(phoneNumber: String) {
    type myMap = {
        [key: string]: string
    }
    let prefixes: myMap = {
        "355" : "AL",
        "374" : "AM",
        "43" : "AT",
        "61" : "AU",
        "994" : "AZ",
        "32" : "BE",
        "359" : "BG",
        "375" : "BY",
        "41" : "CH",
        "357" : "CY",
        "420" : "CZ",
        "49" : "DE",
        "45" : "DK",
        "372" : "EE",
        "34" : "ES",
        "358" : "FI",
        "33" : "FR",
        "44" : "GB",
        "995" : "GE",
        "30" : "GR",
        "385" : "HR",
        "36" : "HU",
        "353" : "IE",
        "972" : "IL",
        "354" : "IS",
        "39" : "IT",
        "370" : "LT",
        "371" : "LV",
        "373" : "MD",
        "389" : "MK",
        "356" : "MT",
        "31" : "NL",
        "47" : "NO",
        "48" : "PL",
        "351" : "PT",
        "40" : "RO",
        "381" : "RS",
        "7" : "RU",
        "46" : "SE",
        "386" : "SI",
        "378" : "SM",
        "380" : "UA"
    }
    let twoDigitcode = phoneNumber.substring(1, 3)
    let threeDigitcode = phoneNumber.substring(1, 4)
    if (prefixes[twoDigitcode] != undefined) {
        return prefixes[twoDigitcode]
    }
    return prefixes[threeDigitcode]
}