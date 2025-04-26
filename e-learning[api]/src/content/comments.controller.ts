import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CommentService } from "./comments.service";
import { CommentDto } from "./dto/comment.dto";

@Controller('/api')
export class CommentController {
    constructor(
        private commentService: CommentService
    ) { }
    @Get('course/:slug/comment')
    getCourseComment(@Param('slug') slug: string) {
        return this.commentService.getCourseComment(slug)
    }
    @Post('course/:slug/comment')
    addCourseComment(@Param('slug') slug: string, @Body() body: CommentDto) {
        return this.commentService.addCourseComment(slug, body)
    }
    @Put('course/:slug/comment/:id')
    modCourseComment(@Param('slug') slug: string, @Param('id') id: string, @Body() body: CommentDto) {
        return this.commentService.modifyCourseComment(slug, id, body)
    }
    @Delete('course/:slug/comment/:id')
    delCourseComment(@Param('slug') slug: string, @Param('id') id: string) {
        return this.commentService.deleteCourseComment(slug, id)
    }

    @Get('tutorial/:slug/comment')
    getTutorialComment(@Param('slug') slug: string) {
        return this.commentService.getTutorialComment(slug)
    }
    @Post('tutorial/:slug/comment')
    addTutorialComment(@Param('slug') slug: string, @Body() body: CommentDto) {
        return this.commentService.addTutorialComment(slug, body)
    }
    @Put('tutorial/:slug/comment/:id')
    modTutorialComment(@Param('slug') slug: string, @Param('id') id: string, @Body() body: CommentDto) {
        return this.commentService.modifyTutorialComment(slug, id, body)
    }
    @Delete('tutorial/:slug/comment/:id')
    delTutorialComment(@Param('slug') slug: string, @Param('id') id: string) {
        return this.commentService.deleteTutorialComment(slug, id)
    }

}
