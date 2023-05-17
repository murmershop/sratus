import config from "../../web.config.json";

export const API_URL = import.meta.env.PROD ? `${config.site}/api/` : "/api/";
