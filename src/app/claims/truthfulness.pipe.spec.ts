import { TruthfulnessPipe } from './truthfulness.pipe';

describe('TruthfulnessPipe', () => {
  it('create an instance', () => {
    const pipe = new TruthfulnessPipe();
    expect(pipe).toBeTruthy();
  });
});
