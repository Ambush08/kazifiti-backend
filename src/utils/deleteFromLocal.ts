import { unlink } from "node:fs/promises";
import { logger } from "./logger.js";



const deleteFromLocal = async (filePath: string) => {
  try {
    await unlink(filePath);
  } catch (error: any) {
    if (error?.code !== "ENOENT") {
      logger.warn({ code: error?.code }, "Failed to delete temp file");
    }
  }
};


export default deleteFromLocal;