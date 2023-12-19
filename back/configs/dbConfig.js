import mongoose from "mongoose";

require("dotenv").config();
const mongoURL = process.env.MONGO_URL;

function databaseConnection() {
  const db = mongoose.connection;

  mongoose
    .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log(`${mongoURL}\n정상적으로 연결되었습니다.`))
    .catch((e) =>
      console.error(`MongoDB 연결에 실패하였습니다. ${mongoURL} ${e}`)
    );

  db.on("disconnected", () => {
    console.log(`mongoDB 연결이 끊겼습니다. 연결을 재시도 합니다.`);
    connect(mongoURL);
  });
}

export default databaseConnection;
