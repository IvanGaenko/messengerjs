let frequency = null;
onmessage = (msg) => {
  // console.log('worker finded', msg.data);
  if (msg.data === 'enableTimeout') {
    enableTimeout();
  } else if (msg.data === 'disableTimeout') {
    if (frequency !== null) {
      console.log('Timeout disabled in worker');
      clearTimeout(frequency);
      frequency = null;
    }
  }
};

const enableTimeout = () => {
  console.log('Timeout enabled in worker');
  frequency = setTimeout(() => {
    console.log('logout procced');
    postMessage('logout');
  }, 60 * 5 * 1000);
};
