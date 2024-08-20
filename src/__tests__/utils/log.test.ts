import Log from '../../utils/log';

describe('Log', () => {
  
  it('logs an info call', () => {
    const log = jest.spyOn(console, 'log').mockImplementation(() => {});

    Log.info('an example');
    
    expect(log).toHaveBeenCalledWith('[JH-APN] an example');

    log.mockReset();
  });

  it('logs a warning call', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    Log.warn('an example');
    
    expect(warn).toHaveBeenCalledWith('[JH-APN] an example');

    warn.mockReset();
  });

  it('logs an error call', () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});

    Log.error('an example');
    
    expect(err).toHaveBeenCalledWith('[JH-APN] an example');

    err.mockReset();
  });

});
