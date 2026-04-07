import { ResultStatus } from '../../database/entities/Result';

export const RESULT_MESSAGES = {
  NOT_FOUND: 'Result not found',
  CREATED: 'Result created successfully',
  UPDATED: 'Result updated successfully',
  PUBLISHED: 'Results published successfully',
  SCORES_ENTERED: 'Scores entered successfully',
} as const;

export { ResultStatus };

export default { RESULT_MESSAGES };