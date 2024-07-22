const validator = require('../helpers/validate');

const saveEvent = (req, res, next) => {
  const validationRule = {
    title: 'required|string',
    description: 'required|string',
    date: 'required|date',
    location: 'required|string',
    created_by: 'required|string',
    created_at: 'date',
    updated_at: 'date',
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

module.exports = {
  saveEvent
};