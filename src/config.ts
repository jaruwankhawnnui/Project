const ENV = process.env.NODE_ENV || "development";

const config = {
  development: {
    API_PREFIX: "http://localhost:3000",
  },
  production: {
    API_PREFIX: "https://hardware-coe.maliwan.cloud",
  },
};

// ดึงค่าตาม environment ปัจจุบัน
export const API_PREFIX = config[ENV as keyof typeof config].API_PREFIX;
