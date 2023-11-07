import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { MulterModuleOptions, MulterOptionsFactory } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import path, { extname } from "path";

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    createMulterOptions(): MulterModuleOptions {
        return {
            // limits: {
            //     fileSize: process.env.MAX_FILE_SIZE,
            // },
            fileFilter: (req: any, file: any, cb: any) => {
                if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                    cb(null, true);
                } else {
                    cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
                }
            },
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    cb(null, Date.now() + extname(file.originalname))
                }
            }),
        };
      }

}