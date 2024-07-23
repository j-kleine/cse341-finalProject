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

const saveParticipant = (req, res, next) => {
  const validationRule = {
    first_name: 'required|string',
    last_name: 'required|string',
    email: 'required|email',
    event_id: 'required|string',
    event_title: 'string',
    joined_at: 'required|date',
    status: 'required|string',
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
  saveEvent,
  saveParticipant
};