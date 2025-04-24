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
        const {text, rate} = comment
        const course = await this.courseService.getCourse(slug)
        course?.comments.push({
            id: uuidv4(),
            rate, text, createdAt: now, updatedAt: now,
        })
        course?.save()
        return course?.comments.at(-1)
    }
    modifyCourseComment(slug: string, id: string, comment: { text: string, rate: number }) {
        return 'Put course comment'
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
        const {text, rate} = comment
        const tutorial = await this.tutorialService.getTutorial(slug)
        tutorial?.comments.push({
            id: uuidv4(),
            rate, text, createdAt: now, updatedAt: now,
        })
        tutorial?.save()
        return tutorial?.comments.at(-1)
    }
    modifyTutorialComment(slug: string, id: string, comment: { text: string, rate: number }) {
        return 'Put tutorial comment'
    }
    deleteTutorialComment(slug: string, id: string) {
        return 'Delete tutorial comment'
    }

}
