let currentMessageId = 1;

function createMessage(user, messageText) {
  console.log('creando mensaje:user:', user)
  console.log('creando mensaje:messageText', messageText)
  return {
    _id: currentMessageId++,
    text: messageText,
    createdAt: new Date(),
    user: {
      _id: user.userId,
      name: user.username,
      avatar: "https://placeimg.com/140/140/any",
    },
  };
}

function handleMessage(socket, users) {
  socket.on("message", (messageText) => {
    const user = users[socket.id];
    const message = createMessage(user, messageText);
    console.log("messageHandler::handleMessage:", message);
    socket.broadcast.emit("message", message);
  });
}

module.exports = { handleMessage };
