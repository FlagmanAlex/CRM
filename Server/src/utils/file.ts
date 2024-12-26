import fs from 'fs/promises'
import path from 'path'

export const deleteFile = async (fileName: string): Promise<void> => {
    const fullPath = path.resolve(__dirname, '..', 'images', fileName)

    try {
        await fs.unlink(fullPath)
        console.log(`Файл ${fullPath} успешно создан`);
    } catch (error) {
        console.error(`Ошибка при удалении файла: ${(error as NodeJS.ErrnoException).message}`);
        
    }

}