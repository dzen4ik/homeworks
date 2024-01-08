import {Request, Response, Router} from "express";
import {CreatedVideoType} from "../models/videoCreatModule";
import {VideoDbType} from "../models/videoViewModel";
import {VideoUpdateModule} from "../models/videoUpdateModel";
import {app} from "../index";
export const videoRouter = Router({})
export const  AvailableResolutions = [ "P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"]


const videos: VideoDbType[] = [
    {
        id: 0,
        title: "string",
        author: "string",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2024-01-03T11:45:32.103Z",
        publicationDate: "2024-01-03T11:45:32.103Z",
        availableResolutions: [
            "P144"
        ]}
]


type RequestWithParams<P> = Request<P, {}, {}, {}>
type RequestWithBody<B> = Request<{}, {}, B, {}>
type RequestWithParamsAndBody<P,B> =  Request<P, {}, B, {}>



type ErrorsMessage = {
    message: string,
    field: string
}

type ErrorType = {
    errorsMessages: ErrorsMessage[]
}

app.get('/videos',(req: Request, res: Response) => {
    res.send(videos)
})

app.get('/videos/:id', (req: RequestWithParams<{id: string}>, res: Response) => {
    const id = +req.params.id

    const video = videos.find((v) => v.id == id)

    if (!video){
        res.sendStatus(404)
        return
    }

    res.send(video)
})

app.post('/videos',(req: RequestWithBody<CreatedVideoType>, res: Response) => {
    let errors: ErrorType = {
        errorsMessages: []
    }

    let {title, author, availableResolutions}:CreatedVideoType = req.body

    if (!title || typeof title !== 'string' || !title.trim() || title.trim().length > 40){
        errors.errorsMessages.push({message: 'Invalid title!', field: 'title'})
    }

    if (!author || typeof author !== 'string' || !author.trim() || author.trim().length > 20){
        errors.errorsMessages.push({message: 'Invalid author!', field: 'author'})
    }

    if (availableResolutions && Array.isArray(availableResolutions)){
        availableResolutions.forEach((r)=> {
            !AvailableResolutions.includes(r) && errors.errorsMessages.push({message: 'Invalid availableResolutions!', field: 'availableResolutions'})
        })
    }else {
        availableResolutions = []
    }

    if (errors.errorsMessages.length){
        res.status(400).send(errors)
        return
    }

    const createdAt = new Date()
    const publicationDate = new Date()

    publicationDate.setDate(createdAt.getDate() + 1)

    const newVideo: VideoDbType = {
        id: +(new Date()),
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        title,
        author,
        availableResolutions
    }

    videos.push(newVideo)

    res.status(201).send(newVideo)
})

app.put('/videos/:id',(req: RequestWithParamsAndBody<{id: string},VideoUpdateModule>, res: Response) => {
const targetId = +req.params.id
    let errors: ErrorType = {
        errorsMessages: []
    }
    let {title, author, availableResolutions, canBeDownloaded,minAgeRestriction,publicationDate}:VideoUpdateModule = req.body



    if (!title || typeof title !== 'string' || !title.trim() || title.trim().length > 40){
        errors.errorsMessages.push({message: 'Invalid title!', field: 'title'})
    }

    if (!author || typeof author !== 'string' || !author.trim() || author.trim().length > 20){
        errors.errorsMessages.push({message: 'Invalid author!', field: 'author'})
    }

    if (availableResolutions && Array.isArray(availableResolutions)){
        availableResolutions.forEach((r)=> {
            !AvailableResolutions.includes(r) && errors.errorsMessages.push({message: 'Invalid availableResolutions!', field: 'availableResolutions'})
        })
    }else {
        availableResolutions = []
    }
    if (typeof canBeDownloaded === 'undefined'  ){
        canBeDownloaded = false
    }
    if ( typeof minAgeRestriction ==='number'  ) {
        if (minAgeRestriction < 1 || minAgeRestriction > 18) {
            errors.errorsMessages.push({message: 'Invalid minAgeRestriction', field: 'minAgeRestriction'})
        }
    }
    if (typeof minAgeRestriction === 'undefined'){
        minAgeRestriction = null
    }
    if (errors.errorsMessages.length){
        res.status(400).send(errors)
        return
    }
    const targetVideo = videos.find(function(video){
        if (video.id === targetId){
            return true;
        }
        else{
            return false;
        }
    })
    if (!targetVideo){
        res.sendStatus(404)
        return;
    }
    const updateVideo = {
        ...targetVideo,
        canBeDownloaded,
        minAgeRestriction,
        title,
        author,
        availableResolutions,
        publicationDate: publicationDate ? publicationDate: targetVideo.publicationDate
    }
   const videoIndex = videos.findIndex(video => video.id === targetId )
    videos.splice(videoIndex,1,updateVideo)
    res.sendStatus(204)
})

app.delete('/testing/all-data', (req: Request, res: Response) => {

    videos.length = 0
    res.sendStatus(204)
})

app.delete ('/videos/:id', (req: RequestWithParams<{id: string}>, res: Response) => {

    const id = +req.params.id
    videos.length = 0
    res.sendStatus(204)

    if (!id){
        res.sendStatus(404)
        return;
    }
})