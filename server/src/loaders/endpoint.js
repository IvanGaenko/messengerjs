// App Imports
import { node_env, endpoint } from '../config/env';
import authentication from './authentication';
import language from './language';
import controllers from '../controllers';

// Setup endpoint
export default function(app) {
  console.info('SETUP - Endpoint..');

  // API endpoint
  app.all(endpoint.url, [authentication, language], async (req, res) => {
    let result = {
      success: false,
      message: 'Please try again.',
      data: null,
    };

    // console.log('yo', req.auth);
    // Check if operation to be called is set
    if (req.body.operation) {
      try {
        // Execute operation
        // operationName({ params, fields, auth })
        const { success, data, message } = await controllers[
          req.body.operation
        ]({
          params: req.body.params || {},
          fields: req.body.fields || {},
          auth: req.auth,
        });

        // Operation executed successfully
        result.success = success;
        result.data = data;
        result.message = message;
      } catch (error) {
        result.message =
          controllers[req.body.operation] === undefined
            ? `${req.body.operation} operation is not available.`
            : error.message;
      }
    }

    // Log info in development mode
    if (node_env === 'development') {
      console.log('req.body', req.body);
      console.log('result.success', result.success);
      console.log('result.message', result.message);
    }

    // Send response
    res.send(result);
  });
}
