import EventEmitter from 'events';

class Interceptor extends EventEmitter {
  constructor(instance, label = null) {
    super();
    this.label = label;
  }

  /**
   * Get Log Type with Label
   * @param logType
   * @private
   */
  _type = (logType) => {
    if (!this.label) return logType;
    return `${this.label}.${logType}`;
  };

  onRequest = (callback) => {
    this.addListener('request', callback);
    return this;
  };

  onRequestError = (callback) => {
    this.addListener('requestError', callback);
    return this;
  };

  onResponse = (callback) => {
    this.addListener('response', callback);
    return this;
  };

  onResponseError = (callback) => {
    this.addListener('responseError', callback);
    return this;
  };

  connect = (instance) => {
    instance.interceptors.request.use((request) => {
      // Build request log
      const requestLog = {
        timeout: request.timeout || null,
        headers: request.headers || null,
        method: request.method || null,
        baseURL: request.baseURL || null,
        path: request.url || null,
        url: `${request.baseURL}${request.url}` || null,
        params: request.params || null,
      };

      // If data exists then parse it out.
      if (request.data) {
        try {
          requestLog.data = JSON.parse(request.data);
        } catch (err) {
          requestLog.data = request.data || null;
        }
      }

      // Emit the request
      this.emit('request', this._type('request'), {
        request: requestLog,
      });

      return request;
    }, (error) => {
      // Build Request Error Log
      const requestErrorLog = {
        response: {
          data: error.response.data || null,
          status: error.response.status || null,
          headers: error.response.headers || null,
        },
        request: {
          headers: error.request.headers || null,
          url: error.request.url || null,
          data: error.request.data || null,
        },
        error: {
          message: error.message || null,
        },
      };

      // Log Request Error
      this.emit('requestError', this._type('request.error'), {
        error: requestErrorLog,
      });

      // Return the originally rejected promise.
      return Promise.reject(error);
    });

    instance.interceptors.response.use((response) => {
      // Build Response Log
      const responseLog = {
        response: {
          status: response.status || null,
          statusText: response.statusText || null,
          headers: response.headers || null,
          data: response.data || null,
          time: response.time || null,
        },
        request: {
          headers: response.request.headers || null,
          method: response.config.method || null,
          baseURL: response.config.baseURL || null,
          url: response.config.url || null,
          data: response.config.data || null,
        },
      };

      // Log Response
      this.emit('response', this._type('response'), {
        response: responseLog,
      });

      // Return original response
      return response;
    }, (error) => {
      // Build Response Error Log
      const responseErrorLog = {};

      if (error.response !== undefined) {
        responseErrorLog.response = {
          data: error.response.data || null,
          status: error.response.data || null,
          headers: error.response.headers || null,
          time: error.response.time || null,
        };
      }

      responseErrorLog.request = {};

      if (error.request) {
        responseErrorLog.request = {
          headers: error.request.headers || error.config.headers || null,
          host: error.config.baseURL || null,
          url: error.config.url || null,
          path: error.request.path || null,
          method: error.config.method || null,
          timeout: error.config.timeout || null,
        };

        try {
          responseErrorLog.request.data = JSON.parse(error.config.data);
        } catch (err) {
          responseErrorLog.request.data = error.config.data || null;
        }
      }

      responseErrorLog.error = {
        message: error.message || null,
      };

      // Log Response Errors
      this.emit('responseError', this._type('response.error'), {
        error: responseErrorLog,
      });

      // Return originally rejected Promise.
      return Promise.reject(error);
    });
  };
}

const connect = (instance, label = null) => {
  const interceptor = new Interceptor(label);
  interceptor.connect(instance);
  return interceptor;
};

export default connect;
