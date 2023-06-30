export interface IImageObject {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}

interface ImageData {
    name_image: string;
}

export interface IDeleteImageData {
    main_image: string;
    product_images: ImageData[];
}