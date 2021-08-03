import DatabaseController from "../database/DatabaseController";

/**
 * Basic response if someone does not hace the permissuns
 * @returns response
 */
async function getWord(serverId: string, wordId: number): Promise<string>{
    return new Promise<string>(async (resolve, reject) => {
        const server = await DatabaseController.getServerById(serverId);
        const language = JSON.parse(`../../res/languages/${server.language}.json`);
        resolve(language.words[wordId]);
    });
}

export { getWord };