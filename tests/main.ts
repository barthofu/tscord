import axios from 'axios'

(async() => {

    const res = await axios.get('https://i.imgur.com/aZ62CqH.png')

    console.log(res.request?.path)
})()