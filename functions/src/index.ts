import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

admin.initializeApp(functions.config().firebase)
const db = admin.firestore()

export const songs = functions.https.onRequest((request, response) => {
    
    // Fetch Countries
    db.collection('countries').get().then((snapshot) => {
        const countriesArray: any[] = []
        snapshot.forEach((doc) => {
            const country = {
                "code" : doc.id,
                "name" : doc.data().name,
                "flag" : doc.data().flag
            }
            countriesArray.push(country)
        })

        // Fetch songs
        db.collection('songs').get().then((snapshotSongs) => {
            const songsArray: any[] = []
            snapshotSongs.forEach((doc) => {

                let matchingCountry = countriesArray.find( c => {
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
            console.log('Error getting songs', err)
        })

    }).catch((err) => {
        console.log('Error getting countries', err)
    })
})
