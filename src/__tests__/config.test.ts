import config from '../config';

describe('Configuration', () => {
  it('should load configuration', () => {
    expect(config).toBeDefined();
    expect(config.server).toBeDefined();
    expect(config.database).toBeDefined();
    expect(config.jwt).toBeDefined();
  });

  it('should have default values', () => {
    expect(config.server.port).toBe(3000);
    expect(config.server.host).toBe('0.0.0.0');
  });
});
