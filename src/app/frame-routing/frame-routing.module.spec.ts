import { FrameRoutingModule } from './frame-routing.module';

describe('FrameRoutingModule', () => {
  let frameRoutingModule: FrameRoutingModule;

  beforeEach(() => {
    frameRoutingModule = new FrameRoutingModule();
  });

  it('should create an instance', () => {
    expect(frameRoutingModule).toBeTruthy();
  });
});
