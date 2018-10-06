// FUNCTION: Used as a response object wrapper so that all server responses can be uniform.
class Response {

  constructor(status, message, response) {
    // Either 'SUCCESS' for a positive outcome or 'ERROR' for a negative outcome
    if (status !== undefined) {
      this._status = status;
    } else {
      this._status = '';
    }

    // Either a success or failure message (usually indicating what point in function response was sent)
    if (message !== undefined) {
      this._message = message;
    } else {
      this._message = '';
    }

    // The response object
    if (response !== undefined) {
      this._response = response;
    } else {
      this._response = {};
    }
  }

  set status(status) {
    this._status = status.toUpperCase();
  }

  set message(message) {
    this._message = message;
  }

  set response(response) {
    this._response = response;
  }

  get status() {
    return this._status;
  }

  get message() {
    return this._message;
  }

  get response() {
    return this._response;
  }

}

module.exports = {Response};
