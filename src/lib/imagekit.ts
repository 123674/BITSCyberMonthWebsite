import ImageKit from "imagekit";
import { IMAGE_KIT_ENDPOINT, IMAGE_KIT_PRIVATE_KIT, IMAGE_KIT_PUBLIC_KEY } from "./contants";

export const imagekit = new ImageKit({
    publicKey : IMAGE_KIT_PUBLIC_KEY,
    privateKey : IMAGE_KIT_PRIVATE_KIT,
    urlEndpoint : IMAGE_KIT_ENDPOINT
});