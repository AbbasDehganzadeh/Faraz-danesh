import { v4 as uuidv4 } from "uuid";
import { Injectable } from "@nestjs/common";
import { CourseService } from "./course.service";
import { TutorialService } from "./tuturial.service";

@Injectable()
export class CommentService {
    constructor(
        private courseService: CourseService,
        private tutorialService: TutorialService,
    ) { }
    async getCourseComment(slug: string) {
        const course = await this.courseService.getCourse(slug)
        return course?.comments
    }
    async addCourseComment(slug: string, comment: { text: string, rate: number }) {
        const now = new Date()
        const { text, rate } = comment
        const course = await this.courseService.getCourse(slug)
        course?.comments.push({
            id: uuidv4(),
            rate, text, createdAt: now, updatedAt: now,
        })
        course?.save()
        return course?.comments.at(-1)
    }
    async modifyCourseComment(slug: string, id: string, comment: { text: string, rate: number }) {
        const now = new Date()
        const { text, rate } = comment
        const course = await this.courseService.getCourse(slug)
        const currComment = course?.comments.find(obj => obj.id === id)
        if (!currComment) {
            return this.addCourseComment(slug, comment)
        }
        const idx = course?.comments.findIndex(obj => obj.id === id)
        if (idx) {
            course?.comments.splice(idx, 1)
        }
        course?.comments.push({
            id: currComment.id,
            text: !text ? currComment.text : text,
            rate: !rate ? currComment.rate : rate,
            createdAt: currComment.createdAt,
            updatedAt: now,
        })
        course?.save()
        return course?.comments.at(-1)
    }
    deleteCourseComment(slug: string, id: string) {
        return 'Delete course comment'
    }

    async getTutorialComment(slug: string) {
        const tutorial = await this.tutorialService.getTutorial(slug)
        return tutorial?.comments
    }
    async addTutorialComment(slug: string, comment: { text: string, rate: number }) {
        const now = new Date()
        const { text, rate } = comment
        const tutorial = await this.tutorialService.getTutorial(slug)
        tutorial?.comments.push({
            id: uuidv4(),
            rate, text, createdAt: now, updatedAt: now,
        })
        tutorial?.save()
        return tutorial?.comments.at(-1)
    }
    async modifyTutorialComment(slug: string, id: string, comment: { text: string, rate: number }) {
        const now = new Date()
        const { text, rate } = comment
        const tutorial = await this.tutorialService.getTutorial(slug)
        const currComment = tutorial?.comments.find(obj => obj.id === id)
        if (!currComment) {
            return this.addTutorialComment(slug, comment)
        }
        const idx = tutorial?.comments.findIndex(obj => obj.id === id)
        if (idx) {
            tutorial?.comments.splice(idx, 1)
        }
        tutorial?.comments.push({
            id: currComment.id,
            text: !text ? currComment.text : text,
            rate: !rate ? currComment.rate : rate,
            createdAt: currComment.createdAt,
            updatedAt: now,
        })
        tutorial?.save()
        return tutorial?.comments.at(-1)
    }
    deleteTutorialComment(slug: string, id: string) {
        return 'Delete tutorial comment'
    }

}
