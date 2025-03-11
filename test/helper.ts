import {chromium} from "@playwright/test";
import {createServer as netCreateServer, type AddressInfo} from "node:net";
import {createServer} from "vite";

const getRandomPort = () => {
  return new Promise<number>((resolve, reject) => {
    const server = netCreateServer();
    server.listen(0, () => {
      const port = (server.address() as AddressInfo).port;
      server.close(() => resolve(port));
    });
    server.on("error", reject);
  });
};

export const startPlaywright = async () => {
  const port = await getRandomPort();
  const server = await createServer({server: {port}});
  await server.listen();

  try {
    const browser = await chromium.launch({headless: true});
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(`http://localhost:${port}/`);

    return {server, browser, page, close: async () => {
      await server.close();
      await browser.close();
    }};
  } catch (e) {
    console.error(e);
    throw e;
  }
};