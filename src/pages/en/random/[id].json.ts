import { randomPaths, randomQuestionResponse } from '../../../lib/paths';

export const getStaticPaths = () => randomPaths('en');
export const GET = randomQuestionResponse;
