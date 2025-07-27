const awsConfig = {
  Auth: {
    region: "ap-south-2",
    userPoolId: "ap-south-2_I5fcdMkgs",
    userPoolWebClientId: "5bj9k2ri77vd7ris6doti3qmml",
  },
  API: {
    endpoints: [
      {
        name: "SmartCartAPI",
        endpoint: "https://q313voe6g7.execute-api.ap-south-2.amazonaws.com/prod",
        region: "ap-south-2",
      },
    ],
  },
};

export default awsConfig;
