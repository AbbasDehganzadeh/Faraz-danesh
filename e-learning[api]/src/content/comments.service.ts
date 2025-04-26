import { v4 as uuidv4 } from "uuid";
import { Injectable } from "@nestjs/common";
import { CourseService } from "./course.service";
import { TutorialService } from "./tuturial.service";
import { IComment } from "./intefaces/comment.interface";

@Injectable()
export class CommentService {
    constructor(
        private courseService: CourseService,
        private tutorialService: TutorialService,
    ) {}
    async getCourseComment(slug: string) {
        const course = await this.courseService.getCourse(slug)
        return course?.comments
    }
    async addCourseComment(slug: string, comment: IComment) {
        const now = new Date()
        const { text, rate } = comment
        const course = await this.courseService.getCourse(slug)
        if (course) {
            course.rate = this.updateCommentRating(course?.comments!, course?.rate!, rate!)
        }
        course?.comments.push({
            id: uuidv4(),
            rate, text, createdAt: now, updatedAt: now,
        })
        course?.save()
        return course?.comments.at(-1)
    }
    async modifyCourseComment(slug: string, id: string, comment: IComment) {
        const now = new Date()
        const { text, rate } = comment
        const course = await this.courseService.getCourse(slug)
        const currComment = course?.comments.find(obj => obj.id === id)
        if (!currComment) {
            return this.addCourseComment(slug, comment)
        }
        const idx = course?.comments.findIndex(obj => obj.id === id)!
        if (idx !== -1) {
            course?.comments.splice(idx, 1)
        }
        if (course) {
            course.rate = this.updateCommentRating(course?.comments!, course?.rate!, rate!)
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
    async deleteCourseComment(slug: string, id: string) {
        const course = await this.courseService.getCourse(slug)
        const idx = course?.comments.findIndex(obj => obj.id === id)!
        if (idx !== -1) {
            const rate = course?.comments[idx].rate
            if (course) {
                course.rate = this.updateCommentRating(course?.comments!, course?.rate!, rate!)
            }
            course?.comments.splice(idx, 1)
        }
        course?.save()
        return course?.comments
    }

    async getTutorialComment(slug: string) {
        const tutorial = await this.tutorialService.getTutorial(slug)
        return tutorial?.comments
    }
    async addTutorialComment(slug: string, comment: IComment) {
        const now = new Date()
        const { text, rate } = comment
        const tutorial = await this.tutorialService.getTutorial(slug)
        if (tutorial) {
            tutorial.rate = this.updateCommentRating(tutorial?.comments!, tutorial?.rate!, rate)
        }
        tutorial?.comments.push({
            id: uuidv4(),
            rate, text, createdAt: now, updatedAt: now,
        })
        tutorial?.save()
        return tutorial?.comments.at(-1)
    }
    async modifyTutorialComment(slug: string, id: string, comment: IComment) {
        const now = new Date()
        const { text, rate } = comment
        const tutorial = await this.tutorialService.getTutorial(slug)
        const currComment = tutorial?.comments.find(obj => obj.id === id)
        if (!currComment) {
            return this.addTutorialComment(slug, comment)
        }
        const idx = tutorial?.comments.findIndex(obj => obj.id === id)!
        if (idx !== -1) {
            tutorial?.comments.splice(idx, 1)
        }
        if (tutorial) {
            tutorial.rate = this.updateCommentRating(tutorial?.comments!, tutorial?.rate!, rate)
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
    async deleteTutorialComment(slug: string, id: string) {
        const tutorial = await this.tutorialService.getTutorial(slug)
        const idx = tutorial?.comments.findIndex(obj => obj.id === id)!
        if (idx !== -1) {
            const rate = tutorial?.comments[idx].rate
            if (tutorial) {
                tutorial.rate = this.updateCommentRating(tutorial?.comments!, tutorial?.rate!, rate!)
            }
            tutorial?.comments.splice(idx, 1)
        }
        tutorial?.save()
        return tutorial?.comments
    }

    private updateCommentRating(
        comments: IComment[], total: number, rate: number
    ) {
        const len = comments?.length
        const ratings = len! * total
        const sum = (ratings + rate)
        if (rate>0) { // add comment
            return sum / len! + 1
        }
        return sum / len! // remove comment
    }
}
