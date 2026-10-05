import ImageKit from "imagekit";
import { IMAGE_KIT_ENDPOINT, IMAGE_KIT_PRIVATE_KIT, IMAGE_KIT_PUBLIC_KEY } from "./contants";

let imagekit: ImageKit | undefined;

export function getImageKit(): ImageKit {
    if (!IMAGE_KIT_PUBLIC_KEY || !IMAGE_KIT_PRIVATE_KIT || !IMAGE_KIT_ENDPOINT) {
        throw new Error(
            "ImageKit is not configured. Set IMAGE_KIT_PUBLIC_KEY, IMAGE_KIT_PRIVATE_KIT, and IMAGE_KIT_ENDPOINT to upload event posters.",
        );
    }

    imagekit ??= new ImageKit({
        publicKey: IMAGE_KIT_PUBLIC_KEY,
        privateKey: IMAGE_KIT_PRIVATE_KIT,
        urlEndpoint: IMAGE_KIT_ENDPOINT,
    });

    return imagekit;
}