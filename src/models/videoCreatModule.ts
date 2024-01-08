import {AvailableResolutions} from "../routes/videos";

export type CreatedVideoType = {
    title: string,
    author: string,
    availableResolutions: typeof AvailableResolutions
}