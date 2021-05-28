export const getHostName = (isStage, isDev) => {
    return isDev ? `http://localhost:3001` : `https://${isStage ? 'stage-' : ''}microbrands.headout.com`;
};