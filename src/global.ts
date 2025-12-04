declare global {
  var resumeTest: typeof import("@ember/test-helpers").resumeTest;
  var pauseTest: typeof import("@ember/test-helpers").pauseTest;
}

export {};
