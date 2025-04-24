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
        const course = await this.courseService.getCourse(slug)
        const {text, rate} = comment
        course?.comments.push({rate, text})
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
        const tutorial = await this.tutorialService.getTutorial(slug)
        const {text, rate} = comment
        tutorial?.comments.push({rate, text})
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
