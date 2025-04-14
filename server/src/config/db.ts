export const dbConfig = {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/online-school',
    options: {
      maxPoolSize: 10,
    },
  };