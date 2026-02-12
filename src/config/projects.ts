// ============================================
// Project Configuration (re-export from quizzes.ts)
// 司令の指定に基づき、projects.ts からもアクセス可能にする
// 実体は quizzes.ts で一元管理
// ============================================

export {
  QUIZ_CONFIGS as PROJECT_CONFIGS,
  getQuizConfig as getProjectConfig,
  getOrderedQuizzes as getOrderedProjects,
  getQuizSelectorOptions as getProjectSelectorOptions,
  DEFAULT_QUIZ_ID as DEFAULT_PROJECT_ID,
} from "./quizzes";

export type {
  QuizConfig as ProjectConfig,
  ScoreBucket,
} from "./quizzes";
