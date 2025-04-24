import { Injectable } from "@nestjs/common";
import { CourseService } from "./course.service";
import { TutorialService } from "./tuturial.service";

@Injectable()
export class CommentService {
    constructor(
        private courseService: CourseService,
        private tutorialService: TutorialService,
    ) { }
    getCourseComment(slug: string) {
        return 'Get course comments'
    }
    addCourseComment(slug: string, comment: { text: string, rate: number }) {
        return 'Post course comment'
    }
    modifyCourseComment(slug: string, id: string, comment: { text: string, rate: number }) {
        return 'Put course comment'
    }
    deleteCourseComment(slug: string, id: string) {
        return 'Delete course comment'
    }

    getTutorialComment(slug: string) {
        return 'Get tutorial comments'
    }
    addTutorialComment(slug: string, comment: { text: string, rate: number }) {
        return 'Post tutorial comment'
    }
    modifyTutorialComment(slug: string, id: string, comment: { text: string, rate: number }) {
        return 'Put tutorial comment'
    }
    deleteTutorialComment(slug: string, id: string) {
        return 'Delete tutorial comment'
    }

}
