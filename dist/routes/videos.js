"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableResolutions = exports.videoRouter = void 0;
const express_1 = require("express");
const index_1 = require("../index");
exports.videoRouter = (0, express_1.Router)({});
exports.AvailableResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"];
const videos = [
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
        ]
    }
];
index_1.app.get('/videos', (req, res) => {
    res.send(videos);
});
index_1.app.get('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const video = videos.find((v) => v.id == id);
    if (!video) {
        res.sendStatus(404);
        return;
    }
    res.send(video);
});
index_1.app.post('/videos', (req, res) => {
    let errors = {
        errorsMessages: []
    };
    let { title, author, availableResolutions } = req.body;
    if (!title || typeof title !== 'string' || !title.trim() || title.trim().length > 40) {
        errors.errorsMessages.push({ message: 'Invalid title!', field: 'title' });
    }
    if (!author || typeof author !== 'string' || !author.trim() || author.trim().length > 20) {
        errors.errorsMessages.push({ message: 'Invalid author!', field: 'author' });
    }
    if (availableResolutions && Array.isArray(availableResolutions)) {
        availableResolutions.forEach((r) => {
            !exports.AvailableResolutions.includes(r) && errors.errorsMessages.push({ message: 'Invalid availableResolutions!', field: 'availableResolutions' });
        });
    }
    else {
        availableResolutions = [];
    }
    if (errors.errorsMessages.length) {
        res.status(400).send(errors);
        return;
    }
    const createdAt = new Date();
    const publicationDate = new Date();
    publicationDate.setDate(createdAt.getDate() + 1);
    const newVideo = {
        id: +(new Date()),
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        title,
        author,
        availableResolutions
    };
    videos.push(newVideo);
    res.status(201).send(newVideo);
});
index_1.app.put('/videos/:id', (req, res) => {
    const targetId = +req.params.id;
    let errors = {
        errorsMessages: []
    };
    let { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate } = req.body;
    if (!title || typeof title !== 'string' || !title.trim() || title.trim().length > 40) {
        errors.errorsMessages.push({ message: 'Invalid title!', field: 'title' });
    }
    if (!author || typeof author !== 'string' || !author.trim() || author.trim().length > 20) {
        errors.errorsMessages.push({ message: 'Invalid author!', field: 'author' });
    }
    if (availableResolutions && Array.isArray(availableResolutions)) {
        availableResolutions.forEach((r) => {
            !exports.AvailableResolutions.includes(r) && errors.errorsMessages.push({ message: 'Invalid availableResolutions!', field: 'availableResolutions' });
        });
    }
    else {
        availableResolutions = [];
    }
    if (typeof canBeDownloaded === 'undefined') {
        canBeDownloaded = false;
    }
    if (typeof minAgeRestriction === 'number') {
        if (minAgeRestriction < 1 || minAgeRestriction > 18) {
            errors.errorsMessages.push({ message: 'Invalid minAgeRestriction', field: 'minAgeRestriction' });
        }
    }
    if (typeof minAgeRestriction === 'undefined') {
        minAgeRestriction = null;
    }
    if (errors.errorsMessages.length) {
        res.status(400).send(errors);
        return;
    }
    const targetVideo = videos.find(function (video) {
        if (video.id === targetId) {
            return true;
        }
        else {
            return false;
        }
    });
    if (!targetVideo) {
        res.sendStatus(404);
        return;
    }
    const updateVideo = Object.assign(Object.assign({}, targetVideo), { canBeDownloaded,
        minAgeRestriction,
        title,
        author,
        availableResolutions, publicationDate: publicationDate ? publicationDate : targetVideo.publicationDate });
    const videoIndex = videos.findIndex(video => video.id === targetId);
    videos.splice(videoIndex, 1, updateVideo);
    res.sendStatus(204);
});
index_1.app.delete('/testing/all-data', (req, res) => {
    videos.length = 0;
    res.sendStatus(204);
});
index_1.app.delete('/videos/:id', (req, res) => {
    const id = +req.params.id;
    videos.length = 0;
    res.sendStatus(204);
    if (!id) {
        res.sendStatus(404);
        return;
    }
});
