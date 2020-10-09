// eslint-disable-next-line
exports.handler = async (event, context) => {
  console.log(JSON.stringify(event, null, 2));

  const body = {
    message: "Hello from Lambda"
  }
  const response = {
    statusCode: 200,
    body: JSON.stringify(body),
    headers: {
      "Access-Control-Allow-Origin": "*",
    }
  };
  return response;
};
