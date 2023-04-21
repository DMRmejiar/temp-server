module.exports = {
  database: {
    host: "luftsentry.clwscxrjicps.us-east-1.rds.amazonaws.com",
    user: "istleTHyDrun",
    password: "HXcyllLZjitcdgtnGhVv",
    database: "data_collector",
  },
  iotCore: {
    host: "a34yrxgh1yvd6y-ats.iot.us-east-1.amazonaws.com",
    keyPath: ".\\keys\\luftsentry.private.key",
    certPath: ".\\keys\\luftsentry.cert.pem",
    caPath: ".\\keys\\AmazonRootCA1.pem",
    clientId: "ServerLuftSentry",
    region: "us-east-1",
    topic: "Luft_Sentry_Antioquia",
  },
};
