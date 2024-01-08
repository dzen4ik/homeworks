import {AvailableResolutions} from "../routes/videos";

export type VideoUpdateModule = {
    "title": string,
        "author": string,
        "availableResolutions": typeof AvailableResolutions,
        "canBeDownloaded": boolean,
        "minAgeRestriction": number | null,
        "publicationDate": string
}