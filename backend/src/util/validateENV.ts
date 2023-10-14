import { cleanEnv } from "envalid";
import { port, str } from "envalid/dist/validators";

export default cleanEnv(process.env, {
    MONGO_DB_CONNECTION_STRING: str(),
    PORT: port()
});