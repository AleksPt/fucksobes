import { randomPaths, randomQuestionResponse } from '../../lib/paths';

export const getStaticPaths = () => randomPaths('ru');
export const GET = randomQuestionResponse;
