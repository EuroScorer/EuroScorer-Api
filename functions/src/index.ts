import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

admin.initializeApp(functions.config().firebase)
const db = admin.firestore()

export const songs = functions.https.onRequest((request, response) => {
    
    const fetchCountries = db.collection('countries').get().then((snapshot) => {
        const countries: any[] = []
        snapshot.forEach((doc) => {
            const country = {
                "code" : doc.id,
                "name" : doc.data().name,
                "flag" : doc.data().flag
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
                "number" : doc.data().number,
                "title" : doc.data().title,
                "country" : matchingCountry
            }
            songsArray.push(song)
        })
        response.send(songsArray)
    }).catch((err) => {
        console.log('Error getting song', err)
    })

})
