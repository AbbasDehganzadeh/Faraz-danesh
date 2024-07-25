import { Controller } from "@nestjs/common";
import { ContentService } from "./content.service";

@Controller()
export class ContentController {
    constructor(private contentService:ContentService) {}
    
}
