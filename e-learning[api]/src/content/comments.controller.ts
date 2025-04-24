import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CommentService } from "./comments.service";

@Controller('/api')
export class CommentController {
    constructor(
        private commentService: CommentService
    ) { }
    @Get('course/:slug/comment')
    getCourseComment(@Param() slug: string) {
        return this.commentService.getCourseComment(slug)
    }
    @Post('course/:slug/comment')
    addCourseComment(@Param() slug: string, @Body() body: { text: string, rate: number }) {
        return this.commentService.addCourseComment(slug, body)
    }
    @Put('course/:slug/comment/:id')
    modCourseComment(@Param() slug: string, @Param() id: string, @Body() body: { text: string, rate: number }) {
        return this.commentService.modifyCourseComment(slug, id, body)
    }
    @Delete('course/:slug/comment/:id')
    delCourseComment(@Param() slug: string, @Param() id: string) {
        return this.commentService.deleteCourseComment(slug, id)
    }

    @Get('tutorial/:slug/comment')
    getTutorialComment(@Param() slug: string) {
        return this.commentService.getTutorialComment(slug)
    }
    @Post('tutorial/:slug/comment')
    addTutorialComment(@Param() slug: string, @Body() body: { text: string, rate: number }) {
        return this.commentService.addTutorialComment(slug, body)
    }
    @Put('tutorial/:slug/comment/:id')
    modTutorialComment(@Param() slug: string, @Param() id: string, @Body() body: { text: string, rate: number }) {
        return this.commentService.modifyTutorialComment(slug, id, body)
    }
    @Delete('tutorial/:slug/comment/:id')
    delTutorialComment(@Param() slug: string, @Param() id: string) {
        return this.commentService.deleteTutorialComment(slug, id)
    }

}
