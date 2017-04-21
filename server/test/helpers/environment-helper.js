// eslint-disable-next-line import/no-extraneous-dependencies
import { SpecReporter } from 'jasmine-spec-reporter';

const specReporter = new SpecReporter({
  spec: {
    displayPending: true
  }
});
jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(specReporter);
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
