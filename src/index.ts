import express from 'express'
import {videoRouter} from "./routes/videos";
export const app = express()

const port = 3000
app.use('/videos', videoRouter)

app.listen(port, () => {
    console.log(`App start on port ${port}`)
})