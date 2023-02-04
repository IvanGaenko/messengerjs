const getFormattedMessages = (messages) => {
  console.log('data', messages);
  const x = [];

  // const content = [
  //   'hello',
  //   'hi',
  //   'how are you?',
  //   'memory',
  //   'quite',
  //   'goodsale',
  // ];
  // const time = [
  //   'December 15, 1995 23:15:30',
  //   'December 15, 1995 23:17:30',
  //   'December 17, 1995 23:00:30',
  //   'December 20, 1995 23:15:30',
  //   'December 20, 1995 23:17:30',
  //   'December 20, 1995 23:18:10',
  //   'December 21, 1995 23:15:30',
  //   'December 21, 1995 23:15:45',
  //   'December 23, 1995 18:15:30',
  //   'December 25, 1995 17:15:30',
  //   'December 25, 1995 17:15:50',
  // ];
  let groupId = 1;
  let subGroupId = 1;

  for (let i = 0; i < messages.length; i++) {
    // const y = Math.floor(Math.random() * content.length);
    const message = messages[i];
    // const currentDate = new Date(message.createdAt);
    const currentDate = new Date(message.timestamp * 1000);
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const hour = currentDate.getHours();
    const minutes = currentDate.getMinutes();

    if (i === 0) {
      x.push({
        id: groupId,
        name: 'group by day',
        day,
        month,
        year,
        dayPayload: [
          {
            id: subGroupId,
            name: 'group by time',
            hour,
            minutes,
            minutePayload: [
              {
                // id: message.id,
                // name: 'message',
                ...message,
                hour,
                minutes,
                // content: message.content,
                timestamp: currentDate,
              },
            ],
          },
        ],
      });
    } else {
      const findSameDay = x.findIndex((d) => d.day === day);
      if (findSameDay !== -1) {
        const findSameHourAndMinute = x[findSameDay].dayPayload.findIndex(
          (h) =>
            h.hour === hour &&
            (h.minutes === minutes ||
              h.minutes - 1 === minutes ||
              h.minutes + 1 === minutes),
        );
        if (findSameHourAndMinute !== -1) {
          x[findSameDay].dayPayload[findSameHourAndMinute].minutePayload.push({
            // id: message.id,
            // name: 'message',
            ...message,
            hour,
            minutes,
            // content: message.content,
            timestamp: currentDate,
          });
        } else {
          x[findSameDay].dayPayload.push({
            id: subGroupId,
            name: 'group by time',
            hour,
            minutes,
            minutePayload: [
              {
                // id: message.id,
                // name: 'message',
                ...message,
                hour,
                minutes,
                // content: message.content,
                timestamp: currentDate,
              },
            ],
          });
        }
      } else {
        x.push({
          id: groupId,
          name: 'group by day',
          day,
          month,
          year,
          dayPayload: [
            {
              id: subGroupId,
              name: 'group by time',
              hour,
              minutes,
              minutePayload: [
                {
                  // id: message.id,
                  // name: 'message',
                  ...message,
                  hour,
                  minutes,
                  // content: message.content,
                  timestamp: currentDate,
                },
              ],
            },
          ],
        });
      }
    }
    groupId += 1;
    subGroupId += 1;
  }
  // console.log('x', x);
  return x;
};

export default getFormattedMessages;
