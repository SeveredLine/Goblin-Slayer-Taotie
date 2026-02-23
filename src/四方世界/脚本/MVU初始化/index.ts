// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';
import { Schema } from '../../schema';

const $ = (window as any).$;

$(() => {
  registerMvuSchema(Schema);
});