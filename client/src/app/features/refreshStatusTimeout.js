let timeout = null;

const refreshStatusTimeout = (dispatch, func, data) => {
  if (data.online === false) {
    timeout = setTimeout(() => {
      dispatch(func(data));
    }, 5 * 1000);
  }

  if (data.online === true) {
    if (timeout === null) {
      dispatch(func(data));
    } else {
      clearTimeout(refreshStatusTimeout);
      timeout = null;
    }
  }
};

export default refreshStatusTimeout;
