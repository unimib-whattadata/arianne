import Redis from "ioredis";

const publisher = new Redis(process.env.REDIS!);
const cache = new Redis(process.env.REDIS!);

export { cache, publisher };
