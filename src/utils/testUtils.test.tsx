import { sleep } from "./testUtils";

it("sleep", async () => {
  const date1 = new Date().getTime();
  await sleep(2000);
  const date2 = new Date().getTime();
  const timePass = date2 - date1;
  expect(timePass).toBeGreaterThan(1999);
  expect(timePass).not.toBeGreaterThan(2005);
});
