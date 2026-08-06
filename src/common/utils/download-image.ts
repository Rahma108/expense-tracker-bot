import axios from "axios";
import { createWriteStream } from "fs";
import { pipeline } from "stream/promises";

export async function downloadImage(
    url: string,
    output: string,
) {

    const response = await axios({
        url,
        method: "GET",
        responseType: "stream",
    });
    await pipeline(
        response.data,
        createWriteStream(output),
    );

}